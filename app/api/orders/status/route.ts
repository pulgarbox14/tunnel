import { NextResponse } from "next/server";
import { findOrder, markOrderPaid, updateOrder } from "@/lib/orders";
import { feexpayConfigured, getStatus } from "@/lib/feexpay";

/** Suivi du statut d'une commande (interrogé par la page /paiement/<ref>). */
export async function GET(request: Request) {
  const ref = new URL(request.url).searchParams.get("ref") ?? "";
  const order = await findOrder(ref);
  if (!order) {
    return NextResponse.json({ ok: false, error: "Commande introuvable." }, { status: 404 });
  }

  if (order.status === "pending" && order.providerRef && feexpayConfigured()) {
    try {
      const status = await getStatus(order.providerRef);
      if (status === "SUCCESSFUL") {
        await markOrderPaid(order.ref);
        return NextResponse.json({ ok: true, status: "paid" });
      }
      if (status === "FAILED" || status === "CANCELED" || status === "CANCELLED") {
        await updateOrder(order.ref, { status: "failed" });
        return NextResponse.json({ ok: true, status: "failed" });
      }
    } catch (e) {
      console.error("FeexPay getStatus:", e);
    }
  }

  return NextResponse.json({ ok: true, status: order.status });
}
