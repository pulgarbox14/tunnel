import { NextResponse } from "next/server";
import { createOrder, markOrderPaid } from "@/lib/orders";
import { feexpayConfigured } from "@/lib/feexpay";
import { site } from "@/content/site";

/**
 * Création de la commande AVANT le paiement.
 *
 * Le paiement lui-même se fait sur la page FeexPay, ouverte par le bouton
 * officiel (SDK React) : c'est là que le client choisit son réseau (MTN,
 * Moov, Celtiis, carte…) et saisit son numéro. Cette route se contente
 * donc d'enregistrer la commande et de renvoyer :
 *   - sa référence, utilisée comme référence de transaction chez FeexPay
 *   - le montant, TOUJOURS calculé côté serveur
 *   - la configuration publique du bouton FeexPay
 *
 * Sans clé FeexPay : mode simulation (commande validée directement) pour
 * tester le tunnel de bout en bout.
 */
export async function POST(request: Request) {
  let data: { name?: string; email?: string; phone?: string; product?: string };
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const name = (data.name ?? "").trim();
  const email = (data.email ?? "").trim();
  const phone = (data.phone ?? "").trim();
  const product = data.product === "bonus" ? "bonus" : "programme";

  if (!name || !email || !phone) {
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
    method: "",
    product,
    amount,
    currency: priceSource.currency,
  });

  // Mode simulation tant que FeexPay n'est pas configuré
  if (!feexpayConfigured()) {
    await markOrderPaid(order.ref);
    return NextResponse.json({ ok: true, simulation: true, redirect: `/merci?ref=${order.ref}` });
  }

  return NextResponse.json({
    ok: true,
    ref: order.ref,
    amount,
    feexpay: {
      shopId: process.env.FEEXPAY_SHOP_ID,
      token: process.env.FEEXPAY_API_KEY,
      mode: process.env.FEEXPAY_MODE === "SANDBOX" ? "SANDBOX" : "LIVE",
    },
  });
}
