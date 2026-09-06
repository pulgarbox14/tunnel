/**
 * Intégration API FeexPay — paiements Mobile Money au Bénin.
 *
 * Variables d'environnement :
 *   FEEXPAY_API_KEY  — clé API du compte marchand (en-tête Bearer)
 *   FEEXPAY_SHOP_ID  — identifiant de la boutique (ex : Ayg9lkjkhurIvNp)
 *   FEEXPAY_BASE_URL — défaut : https://api-v2.feexpay.me
 *
 * Flux « request to pay » :
 *   1. On envoie la demande → le client reçoit le push USSD sur son
 *      téléphone et confirme avec son code PIN.
 *   2. La page /paiement/<ref> interroge le statut jusqu'à SUCCESSFUL.
 *
 * Certains réseaux (Moov) renvoient parfois le statut final dès la
 * première réponse : requestToPay renvoie donc aussi ce statut.
 */

const BASE_URL = process.env.FEEXPAY_BASE_URL ?? "https://api-v2.feexpay.me";

/** Limites imposées par FeexPay (en XOF). */
export const MIN_AMOUNT = 100;
export const MAX_AMOUNT = 2_000_000;

export function feexpayConfigured(): boolean {
  return Boolean(process.env.FEEXPAY_API_KEY && process.env.FEEXPAY_SHOP_ID);
}

/** Réseaux gérés, du choix affiché vers le segment d'URL FeexPay. */
export const NETWORKS: Record<string, string> = {
  mtn: "mtn",
  moov: "moov",
  celtiis: "celtiis_bj",
};

/**
 * Format attendu par FeexPay : indicatif 229 suivi du numéro local à
 * 10 chiffres commençant par 01 (exemple de la doc : 2290166000000).
 *
 *   "+229 01 97 91 77 59" → "2290197917759"
 *   "0197917759"          → "2290197917759"
 *   "97917759" (ancien)   → "2290197917759"
 */
export function normalizePhone(raw: string): string {
  let local = raw.replace(/\D/g, "");
  if (local.startsWith("229")) local = local.slice(3);
  // Anciens numéros à 8 chiffres : le Bénin les préfixe désormais de 01
  if (local.length === 8) local = `01${local}`;
  return `229${local}`;
}

/** Le numéro est-il exploitable (10 chiffres locaux commençant par 0) ? */
export function isValidPhone(raw: string): boolean {
  return /^2290\d{9}$/.test(normalizePhone(raw));
}

/** FeexPay refuse les caractères spéciaux dans description. */
function plain(text: string): string {
  return text.replace(/[^a-zA-Z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

async function api(path: string, method: string, body?: unknown) {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${process.env.FEEXPAY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    throw new Error(`FeexPay injoignable (${BASE_URL}${path}) : ${String(e)}`);
  }

  const raw = await res.text();
  let data: unknown = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    if (!res.ok) throw new Error(`FeexPay ${path} → HTTP ${res.status} : ${raw.slice(0, 300)}`);
  }
  if (!res.ok) {
    throw new Error(`FeexPay ${path} → HTTP ${res.status} : ${JSON.stringify(data).slice(0, 300)}`);
  }
  return data as Record<string, unknown>;
}

/** Message lisible renvoyé par l'opérateur en cas de refus. */
export function operatorMessage(data: Record<string, unknown>): string {
  const op = data.response_operator as { description?: unknown } | undefined;
  const desc = op?.description;
  if (Array.isArray(desc) && desc.length) return String(desc[0]);
  if (typeof desc === "string") return desc;
  if (typeof data.message === "string") return data.message;
  return "";
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
}): Promise<{ reference: string; status: string; message: string }> {
  const network = NETWORKS[params.method];
  if (!network) {
    throw new Error(`Réseau non géré : ${params.method}`);
  }
  if (params.amount < MIN_AMOUNT || params.amount > MAX_AMOUNT) {
    throw new Error(
      `Montant hors limites FeexPay (${MIN_AMOUNT} à ${MAX_AMOUNT} XOF) : ${params.amount}`,
    );
  }
  const [firstname, ...rest] = params.customer.name.trim().split(/\s+/);

  const data = await api(`/api/transactions/public/requesttopay/${network}`, "POST", {
    shop: process.env.FEEXPAY_SHOP_ID,
    amount: params.amount,
    phoneNumber: Number(normalizePhone(params.phone)),
    first_name: plain(firstname) || "Client",
    last_name: plain(rest.join(" ")) || "-",
    description: plain(`Commande ${params.orderRef}`),
    callback_info: params.orderRef,
  });

  const reference = typeof data.reference === "string" ? data.reference : "";
  if (!reference) {
    throw new Error(
      `FeexPay : référence absente de la réponse ${JSON.stringify(data).slice(0, 300)}`,
    );
  }
  return {
    reference,
    status: String(data.status ?? "PENDING").toUpperCase(),
    message: operatorMessage(data),
  };
}

/** Statut d'une transaction : SUCCESSFUL | PENDING | FAILED. */
export async function getStatus(reference: string): Promise<string> {
  const data = await api(`/api/transactions/public/single/status/${reference}`, "GET");
  const d = data as { status?: string; transaction?: { status?: string } };
  return String(d.status ?? d.transaction?.status ?? "PENDING").toUpperCase();
}
