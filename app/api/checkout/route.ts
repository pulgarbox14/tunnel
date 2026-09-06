import { NextResponse } from "next/server";
import { createOrder, markOrderPaid, updateOrder } from "@/lib/orders";
import {
  feexpayConfigured,
  isValidPhone,
  requestToPay,
  NETWORKS,
  MIN_AMOUNT,
  MAX_AMOUNT,
} from "@/lib/feexpay";
import { site } from "@/content/site";

/**
 * Création de commande + demande de paiement Mobile Money (API FeexPay).
 *
 * Le client reçoit le push USSD sur son téléphone et confirme avec son
 * code PIN ; la page /paiement/<ref> suit ensuite le statut.
 * Sans clé FeexPay : mode simulation pour tester le tunnel.
 */
export async function POST(request: Request) {
  let data: {
    name?: string;
    email?: string;
    whatsapp?: string;
    phone?: string;
    method?: string;
    product?: string;
  };
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const name = (data.name ?? "").trim();
  const email = (data.email ?? "").trim();
  const whatsapp = (data.whatsapp ?? "").trim();
  const phone = (data.phone ?? "").trim();
  const method = (data.method ?? "").trim();
  const product = data.product === "bonus" ? "bonus" : "programme";

  if (!name || !email || !whatsapp || !phone || !method) {
    return NextResponse.json(
      { ok: false, error: "Merci de remplir tous les champs." },
      { status: 400 },
    );
  }
  if (!NETWORKS[method]) {
    return NextResponse.json(
      { ok: false, error: "Choisis ton réseau Mobile Money." },
      { status: 400 },
    );
  }
  if (!isValidPhone(phone)) {
    return NextResponse.json(
      { ok: false, error: "Numéro Mobile Money invalide (ex : 01 97 91 77 59)." },
      { status: 400 },
    );
  }

  // Le montant est TOUJOURS déterminé côté serveur selon le produit.
  const priceSource = product === "bonus" ? site.bonus.pricing : site.pricing;
  const amount = parseInt(priceSource.price.replace(/\D/g, ""), 10);
  if (amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
    return NextResponse.json(
      { ok: false, error: "Montant non accepté par le prestataire de paiement." },
      { status: 400 },
    );
  }

  const order = await createOrder({
    name,
    email,
    whatsapp,
    phone,
    method,
    product,
    amount,
    currency: priceSource.currency,
  });

  // Mode simulation tant que FeexPay n'est pas configuré
  if (!feexpayConfigured()) {
    await markOrderPaid(order.ref);
    return NextResponse.json({ ok: true, redirect: `/merci?ref=${order.ref}` });
  }

  try {
    const { reference, status, message } = await requestToPay({
      method,
      phone,
      amount,
      orderRef: order.ref,
      customer: { name, email },
    });
    await updateOrder(order.ref, { providerRef: reference });

    // Moov peut renvoyer le statut final dès cette réponse
    if (status === "FAILED") {
      await updateOrder(order.ref, {
        status: "failed",
        error: message || "Paiement refusé par l'opérateur.",
      });
      return NextResponse.json(
        {
          ok: false,
          error: message
            ? `Paiement refusé : ${message}`
            : "Paiement refusé par l'opérateur. Vérifie ton solde et réessaie.",
        },
        { status: 402 },
      );
    }
    if (status === "SUCCESSFUL") {
      await updateOrder(order.ref, { paymentVerified: true });
      await markOrderPaid(order.ref);
      return NextResponse.json({ ok: true, redirect: `/merci?ref=${order.ref}` });
    }

    return NextResponse.json({ ok: true, redirect: `/paiement/${order.ref}` });
  } catch (e) {
    // La cause technique est conservée sur la commande : elle s'affiche
    // dans le panel admin, sans avoir à ouvrir le serveur en SSH.
    const detail = e instanceof Error ? e.message : String(e);
    console.error("FeexPay requestToPay:", detail);
    await updateOrder(order.ref, { status: "failed", error: detail });
    return NextResponse.json(
      { ok: false, error: "Le paiement n'a pas pu être lancé. Vérifie ton numéro et réessaie." },
      { status: 502 },
    );
  }
}
