/**
 * Intégration FeexPay (https://feexpay.me) — paiements FCFA au Bénin :
 * MTN Mobile Money, Moov Money, Celtiis Cash, cartes bancaires.
 *
 * Variables d'environnement :
 *   FEEXPAY_API_KEY  — clé API du compte marchand (Bearer token)
 *   FEEXPAY_SHOP_ID  — identifiant de la boutique FeexPay
 *   FEEXPAY_BASE_URL — défaut : https://api.feexpay.me
 *
 * Flux Mobile Money ("request to pay") :
 *   1. On envoie la demande de paiement → le client reçoit le push USSD
 *      sur son téléphone et confirme avec son code PIN.
 *   2. On interroge le statut de la transaction jusqu'à SUCCESSFUL.
 *
 * ⚠️ Les chemins d'API sont à vérifier avec la documentation FeexPay de
 * ton compte marchand (ils peuvent évoluer). Sans clé configurée, le
 * checkout passe en mode simulation pour tester le tunnel de bout en bout.
 */

const BASE_URL = process.env.FEEXPAY_BASE_URL ?? "https://api.feexpay.me";

export function feexpayConfigured(): boolean {
  return Boolean(process.env.FEEXPAY_API_KEY && process.env.FEEXPAY_SHOP_ID);
}

/** Réseaux FeexPay par moyen de paiement du formulaire. */
const NETWORKS: Record<string, string> = {
  mtn: "mtn",
  moov: "moov",
  celtiis: "celtiis_bj",
};

async function api(path: string, method: string, body?: unknown) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.FEEXPAY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`FeexPay ${path} → ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

/**
 * Lance une demande de paiement Mobile Money.
 * Le client reçoit le push USSD et confirme sur son téléphone.
 */
export async function requestToPay(params: {
  method: string;
  phone: string;
  amount: number;
  orderRef: string;
  customer: { name: string; email: string };
}): Promise<{ reference: string }> {
  const network = NETWORKS[params.method];
  if (!network) {
    throw new Error(`Moyen de paiement non géré par l'API Mobile Money : ${params.method}`);
  }
  const [firstname, ...rest] = params.customer.name.trim().split(/\s+/);

  const data = await api(`/api/transactions/public/requesttopay/${network}`, "POST", {
    shop: process.env.FEEXPAY_SHOP_ID,
    amount: params.amount,
    phoneNumber: params.phone.replace(/\s+/g, ""),
    first_name: firstname || "Client",
    last_name: rest.join(" ") || "-",
    email: params.customer.email,
    custom_id: params.orderRef,
  });

  const reference: string = data.reference ?? data.transaction?.reference ?? data.id;
  if (!reference) throw new Error("FeexPay : référence de transaction introuvable.");
  return { reference };
}

/** Statut d'une transaction : SUCCESSFUL | PENDING | FAILED (selon FeexPay). */
export async function getStatus(reference: string): Promise<string> {
  const data = await api(`/api/transactions/public/single/status/${reference}`, "GET");
  return String(data.status ?? data.transaction?.status ?? "PENDING").toUpperCase();
}
