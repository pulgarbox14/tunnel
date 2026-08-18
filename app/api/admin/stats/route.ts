import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { readJson } from "@/lib/store";
import { listOrders } from "@/lib/orders";
import { listCodes } from "@/lib/codes";

interface Stats {
  total: number;
  days: Record<string, number>;
}

/** Statistiques du site : visites, commandes, paiements, codes d'accès. */
export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const stats = await readJson<Stats>("stats.json", { total: 0, days: {} });
  const orders = await listOrders();
  const codes = await listCodes();

  const last14 = Object.entries(stats.days)
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .slice(0, 14);

  const paid = orders.filter((o) => o.status === "paid");

  return NextResponse.json({
    ok: true,
    visits: { total: stats.total, last14 },
    orders: {
      total: orders.length,
      paid: paid.length,
      pending: orders.filter((o) => o.status === "pending").length,
      failed: orders.filter((o) => o.status === "failed").length,
      revenue: paid.reduce((sum, o) => sum + o.amount, 0),
      recent: orders
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 25)
        .map((o) => ({
          ref: o.ref,
          name: o.name,
          email: o.email,
          phone: o.phone,
          method: o.method,
          amount: o.amount,
          status: o.status,
          accessCode: o.accessCode,
          emailSent: o.emailSent,
          createdAt: o.createdAt,
        })),
    },
    codes: codes.map((c) => ({
      code: c.code,
      name: c.name,
      email: c.email,
      devices: c.devices.length,
      maxDevices: c.maxDevices,
      lastUsedAt: c.lastUsedAt,
    })),
  });
}
