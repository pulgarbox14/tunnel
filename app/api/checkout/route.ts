import { NextResponse } from "next/server";
import { createOrder, markOrderPaid, updateOrder } from "@/lib/orders";
import { feexpayConfigured, requestToPay } from "@/lib/feexpay";
import { site } from "@/content/site";

/**
 * Création de commande + lancement du paiement FeexPay.
 *
 * - Mobile Money : demande "request to pay" (push USSD sur le téléphone),
 *   puis le client est redirigé vers /paiement/<ref> qui suit le statut.
 * - Sans FEEXPAY_API_KEY : mode simulation (paiement accepté directement)
 *   pour tester le tunnel de bout en bout.
 */
export async function POST(request: Request) {
  let data: {
    name?: string;
    email?: string;
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
  const phone = (data.phone ?? "").trim();
  const method = (data.method ?? "").trim();
  const product = data.product === "bonus" ? "bonus" : "programme";

  if (!name || !email || !phone || !method) {
    return NextResponse.json(
      { ok: false, error: "Merci de remplir tous les champs." },
      { status: 400 },
    );
  }

  // Le montant est TOUJOURS déterminé côté serveur selon le produit.
  const priceSource = product === "bonus" ? site.bonus.pricing : site.pricing;
  const amount = parseInt(priceSource.price.replace(/\D/g, ""), 10);
  const order = await createOrder({
    name,
    email,
    phone,
    method,
    product,
    amount,
    currency: priceSource.currency,
  });

  // Mode simulation tant que FeexPay n'est pas configuré
  if (!feexpayConfigured() || method === "card") {
    // TODO carte bancaire : brancher la page de paiement carte FeexPay
    await markOrderPaid(order.ref);
    return NextResponse.json({ ok: true, redirect: `/merci?ref=${order.ref}` });
  }

  try {
    const { reference } = await requestToPay({
      method,
      phone,
      amount,
      orderRef: order.ref,
      customer: { name, email },
    });
    await updateOrder(order.ref, { providerRef: reference });
    return NextResponse.json({ ok: true, redirect: `/paiement/${order.ref}` });
  } catch (e) {
    console.error("FeexPay requestToPay:", e);
    await updateOrder(order.ref, { status: "failed" });
    return NextResponse.json(
      { ok: false, error: "Le paiement n'a pas pu être lancé. Vérifie ton numéro et réessaie." },
      { status: 502 },
    );
  }
}
