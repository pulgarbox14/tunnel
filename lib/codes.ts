import { randomBytes } from "crypto";
import { readJson, writeJson } from "./store";

/**
 * Codes d'accès personnels.
 *
 * - Un code unique est généré pour chaque acheteur après paiement confirmé.
 * - À la première connexion, le code se lie à l'appareil (cookie appareil).
 *   Au-delà de MAX_DEVICES appareils différents, la connexion est refusée :
 *   impossible de partager son code.
 */

export interface AccessCodeRec {
  code: string;
  name: string;
  email: string;
  orderRef: string;
  devices: string[];
  maxDevices: number;
  createdAt: number;
  lastUsedAt?: number;
}

const FILE = "codes.json";
const MAX_DEVICES = Number(process.env.MAX_DEVICES ?? 2);

/** Alphabet sans caractères ambigus (pas de O/0, I/1…). */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomBlock(len: number): string {
  const bytes = randomBytes(len);
  let out = "";
  for (let i = 0; i < len; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out;
}

export async function listCodes(): Promise<AccessCodeRec[]> {
  return readJson<AccessCodeRec[]>(FILE, []);
}

export async function findCode(code: string): Promise<AccessCodeRec | undefined> {
  const codes = await listCodes();
  const norm = code.trim().toUpperCase();
  return codes.find((c) => c.code === norm);
}

export async function createCodeForOrder(order: {
  ref: string;
  name: string;
  email: string;
}): Promise<AccessCodeRec> {
  const codes = await listCodes();
  const existing = codes.find((c) => c.orderRef === order.ref);
  if (existing) return existing;

  let code: string;
  do {
    code = `CAP-${randomBlock(4)}-${randomBlock(4)}`;
  } while (codes.some((c) => c.code === code));

  const rec: AccessCodeRec = {
    code,
    name: order.name,
    email: order.email,
    orderRef: order.ref,
    devices: [],
    maxDevices: MAX_DEVICES,
    createdAt: Date.now(),
  };
  codes.push(rec);
  await writeJson(FILE, codes);
  return rec;
}

/**
 * Tente une connexion avec un code depuis un appareil donné.
 * Lie l'appareil au code si une place est disponible.
 */
export async function tryUseCode(
  code: string,
  deviceId: string,
): Promise<{ ok: boolean; reason?: string; rec?: AccessCodeRec }> {
  const codes = await listCodes();
  const norm = code.trim().toUpperCase();
  const rec = codes.find((c) => c.code === norm);
  if (!rec) return { ok: false, reason: "Code incorrect. Vérifie l'email reçu après ton achat." };

  if (!rec.devices.includes(deviceId)) {
    if (rec.devices.length >= rec.maxDevices) {
      return {
        ok: false,
        reason: `Ce code est déjà utilisé sur ${rec.maxDevices} appareil(s). Il est personnel et ne peut pas être partagé. Contacte-nous si tu as changé de téléphone.`,
      };
    }
    rec.devices.push(deviceId);
  }
  rec.lastUsedAt = Date.now();
  await writeJson(FILE, codes);
  return { ok: true, rec };
}

/** Réinitialise les appareils liés (ex : le client a changé de téléphone). */
export async function resetDevices(code: string): Promise<boolean> {
  const codes = await listCodes();
  const rec = codes.find((c) => c.code === code.trim().toUpperCase());
  if (!rec) return false;
  rec.devices = [];
  await writeJson(FILE, codes);
  return true;
}
