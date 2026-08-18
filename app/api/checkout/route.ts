import { NextResponse } from "next/server";

/**
 * Création de commande — POINT D'INTÉGRATION PAIEMENT.
 *
 * Pour l'instant : simulation (la commande est acceptée directement).
 *
 * Prochaine étape : brancher un agrégateur de paiement FCFA, par exemple
 * CinetPay, FedaPay, PayDunya ou Paystack :
 *   1. créer la transaction chez le prestataire avec le montant,
 *   2. rediriger le client vers l'URL de paiement retournée,
 *   3. dans le webhook de confirmation, générer/envoyer le code d'accès
 *      par email au client.
 */
export async function POST(request: Request) {
  let data: { name?: string; email?: string; phone?: string; method?: string };
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const name = (data.name ?? "").trim();
  const email = (data.email ?? "").trim();
  const phone = (data.phone ?? "").trim();
  const method = (data.method ?? "").trim();

  if (!name || !email || !phone || !method) {
    return NextResponse.json(
      { ok: false, error: "Merci de remplir tous les champs." },
      { status: 400 },
    );
  }

  // TODO (intégration paiement) : créer la transaction et renvoyer paymentUrl.
  return NextResponse.json({ ok: true, redirect: "/merci" });
}
