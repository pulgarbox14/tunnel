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

/**
 * Numéro attendu par FeexPay : chiffres uniquement, SANS le "+" ni
 * l'indicatif pays (les exemples officiels montrent le numéro local).
 * "+229 01 97 91 77 59" → "0197917759"
 */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.startsWith("229") ? digits.slice(3) : digits;
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
    // Le serveur n'a pas pu joindre FeexPay du tout (réseau, DNS, pare-feu)
    throw new Error(`FeexPay injoignable (${BASE_URL}${path}) : ${String(e)}`);
  }

  const raw = await res.text();
  let data: Record<string, unknown> = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    // Réponse non-JSON (page HTML d'erreur, proxy…) : on garde le texte brut
    if (!res.ok) throw new Error(`FeexPay ${path} → HTTP ${res.status} : ${raw.slice(0, 300)}`);
  }
  if (!res.ok) {
    throw new Error(`FeexPay ${path} → HTTP ${res.status} : ${JSON.stringify(data).slice(0, 300)}`);
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
    phoneNumber: normalizePhone(params.phone),
    first_name: firstname || "Client",
    last_name: rest.join(" ") || "-",
    email: params.customer.email,
    custom_id: params.orderRef,
  });

  // La clé portant la référence varie selon les versions de l'API
  const d = data as { reference?: string; id?: string; transaction?: { reference?: string } };
  const reference = d.reference ?? d.transaction?.reference ?? d.id;
  if (!reference) {
    throw new Error(
      `FeexPay : référence de transaction absente de la réponse ${JSON.stringify(data).slice(0, 300)}`,
    );
  }
  return { reference };
}

/** Statut d'une transaction : SUCCESSFUL | PENDING | FAILED (selon FeexPay). */
export async function getStatus(reference: string): Promise<string> {
  const data = await api(`/api/transactions/public/single/status/${reference}`, "GET");
  const d = data as { status?: string; transaction?: { status?: string } };
  return String(d.status ?? d.transaction?.status ?? "PENDING").toUpperCase();
}
