import { randomBytes } from "crypto";
import { readJson, writeJson } from "./store";
import { createCodeForOrder } from "./codes";
import { sendAccessCodeEmail } from "./mailer";

export interface Order {
  ref: string;
  name: string;
  email: string;
  phone: string;
  method: string;
  /** "programme" (offre principale) ou "bonus" (bourses extérieures). */
  product: "programme" | "bonus";
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed";
  /** Référence de la transaction chez FeexPay. */
  providerRef?: string;
  accessCode?: string;
  emailSent?: boolean;
  createdAt: number;
  paidAt?: number;
}

const FILE = "orders.json";

export async function listOrders(): Promise<Order[]> {
  return readJson<Order[]>(FILE, []);
}

export async function saveOrders(orders: Order[]): Promise<void> {
  await writeJson(FILE, orders);
}

export async function createOrder(
  data: Omit<Order, "ref" | "status" | "createdAt">,
): Promise<Order> {
  const orders = await listOrders();
  const order: Order = {
    ...data,
    ref: `CMD-${randomBytes(5).toString("hex").toUpperCase()}`,
    status: "pending",
    createdAt: Date.now(),
  };
  orders.push(order);
  await saveOrders(orders);
  return order;
}

export async function findOrder(ref: string): Promise<Order | undefined> {
  return (await listOrders()).find((o) => o.ref === ref);
}

export async function findOrderByProviderRef(ref: string): Promise<Order | undefined> {
  return (await listOrders()).find((o) => o.providerRef === ref);
}

export async function updateOrder(ref: string, patch: Partial<Order>): Promise<Order | undefined> {
  const orders = await listOrders();
  const order = orders.find((o) => o.ref === ref);
  if (!order) return undefined;
  Object.assign(order, patch);
  await saveOrders(orders);
  return order;
}

/**
 * Marque une commande payée : génère le code d'accès personnel
 * et envoie l'email (si un fournisseur est configuré).
 */
export async function markOrderPaid(ref: string): Promise<Order | undefined> {
  const order = await findOrder(ref);
  if (!order) return undefined;
  if (order.status === "paid" && order.accessCode) return order;

  const rec = await createCodeForOrder({ ...order, product: order.product });
  const mail = await sendAccessCodeEmail({ to: order.email, name: order.name, code: rec.code });

  return updateOrder(ref, {
    status: "paid",
    paidAt: order.paidAt ?? Date.now(),
    accessCode: rec.code,
    emailSent: mail.sent,
  });
}
