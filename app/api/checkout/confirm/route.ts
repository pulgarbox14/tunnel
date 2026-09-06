import { NextResponse } from "next/server";
import { findOrder, markOrderPaid, updateOrder } from "@/lib/orders";
import { getStatus } from "@/lib/feexpay";

/**
 * Confirmation d'un paiement effectué sur la page FeexPay.
 *
 * Le bouton FeexPay appelle cette route avec le résultat du paiement.
 * Comme ce résultat vient du navigateur, il n'est JAMAIS cru sur parole :
 * le serveur redemande le statut à FeexPay avant de délivrer le code
 * d'accès. Si cette vérification est impossible (API injoignable), la
 * commande est bien validée pour ne pas bloquer un vrai acheteur, mais
 * elle est marquée « à vérifier » dans le panel admin, où le formateur
 * peut la recouper avec son tableau de bord FeexPay — et au besoin
 * supprimer le code d'accès.
 */

const SUCCESS = new Set(["SUCCESSFUL", "SUCCESS"]);

export async function POST(request: Request) {
  let data: {
    ref?: string;
    reference?: string;
    transaction_id?: string;
    status?: string;
    reseau?: string;
  };
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const ref = (data.ref ?? "").trim();
  const order = await findOrder(ref);
  if (!order) {
    return NextResponse.json({ ok: false, error: "Commande introuvable." }, { status: 404 });
  }
  // Déjà payée : on renvoie simplement vers la page de remerciement
  if (order.status === "paid") {
    return NextResponse.json({ ok: true, redirect: `/merci?ref=${order.ref}` });
  }

  const providerRef = (data.reference ?? data.transaction_id ?? "").trim();
  const reportedOk = SUCCESS.has(String(data.status ?? "").toUpperCase());

  await updateOrder(ref, {
    providerRef: providerRef || undefined,
    method: data.reseau ? String(data.reseau).toLowerCase() : order.method,
  });

  // 1. Vérification auprès de FeexPay (source de vérité)
  if (providerRef) {
    try {
      const status = await getStatus(providerRef);
      if (SUCCESS.has(status)) {
        await updateOrder(ref, { paymentVerified: true, error: undefined });
        await markOrderPaid(ref);
        return NextResponse.json({ ok: true, redirect: `/merci?ref=${ref}` });
      }
      // FeexPay répond, et le paiement n'a pas abouti : on refuse
      await updateOrder(ref, {
        status: "failed",
        paymentVerified: false,
        error: `Paiement non abouti chez FeexPay (statut ${status}).`,
      });
      return NextResponse.json(
        { ok: false, error: "Le paiement n'a pas abouti. Réessaie." },
        { status: 402 },
      );
    } catch (e) {
      // 2. Vérification impossible : on tranche avec ce que dit le navigateur
      const detail = e instanceof Error ? e.message : String(e);
      if (reportedOk) {
        await updateOrder(ref, {
          paymentVerified: false,
          error: `À VÉRIFIER — statut non confirmé auprès de FeexPay : ${detail}`,
        });
        await markOrderPaid(ref);
        return NextResponse.json({ ok: true, redirect: `/merci?ref=${ref}` });
      }
      await updateOrder(ref, { status: "failed", paymentVerified: false, error: detail });
      return NextResponse.json(
        { ok: false, error: "Le paiement n'a pas abouti. Réessaie." },
        { status: 402 },
      );
    }
  }

  // 3. Aucune référence de transaction : rien à vérifier
  if (reportedOk) {
    await updateOrder(ref, {
      paymentVerified: false,
      error: "À VÉRIFIER — paiement annoncé sans référence de transaction FeexPay.",
    });
    await markOrderPaid(ref);
    return NextResponse.json({ ok: true, redirect: `/merci?ref=${ref}` });
  }

  await updateOrder(ref, {
    status: "failed",
    error: `Paiement non abouti (statut ${data.status ?? "inconnu"}).`,
  });
  return NextResponse.json(
    { ok: false, error: "Le paiement n'a pas abouti. Réessaie." },
    { status: 402 },
  );
}
