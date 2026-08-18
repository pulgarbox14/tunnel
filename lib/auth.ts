import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * Authentification de l'espace membre.
 *
 * - Le code d'accès est envoyé à l'acheteur après paiement.
 * - À la connexion, on pose un cookie httpOnly signé (HMAC-SHA256) :
 *   impossible à forger sans le secret serveur.
 *
 * En production, définir dans les variables d'environnement :
 *   ACCESS_CODE  — le code envoyé aux acheteurs
 *   AUTH_SECRET  — un secret long et aléatoire pour signer les sessions
 */

const ACCESS_CODE = process.env.ACCESS_CODE ?? "FORMATION2026";
const AUTH_SECRET = process.env.AUTH_SECRET ?? "dev-secret-a-changer-en-production";

export const SESSION_COOKIE = "member_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 jours

function sign(payload: string): string {
  return createHmac("sha256", AUTH_SECRET).update(payload).digest("hex");
}

/** Vérifie le code d'accès saisi par l'utilisateur. */
export function verifyAccessCode(code: string): boolean {
  const a = Buffer.from(code.trim().toUpperCase());
  const b = Buffer.from(ACCESS_CODE.toUpperCase());
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Crée un jeton de session signé portant le code du membre : "member|<code>|<exp>.<signature>". */
export function createSessionToken(code: string): string {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload = `member|${code}|${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

/** Valide un jeton de session ; retourne le code du membre ou null. */
export function verifySessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const idx = token.lastIndexOf(".");
  if (idx <= 0) return null;
  const payload = token.slice(0, idx);
  const signature = token.slice(idx + 1);
  const parts = payload.split("|");
  if (parts.length !== 3 || parts[0] !== "member") return null;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Number(parts[2]) <= Date.now()) return null;
  return parts[1];
}

/** Lit le cookie de session et dit si l'utilisateur est membre connecté. */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value) !== null;
}

/** Code du membre connecté (jeton de session), ou null. */
export async function getSessionCode(): Promise<string | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** Code d'accès affiché à l'acheteur après paiement confirmé. */
export function getAccessCode(): string {
  return ACCESS_CODE;
}

/* ===================== Administration ===================== */

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "capadmin2026";
export const ADMIN_COOKIE = "admin_session";

export function verifyAdminPassword(password: string): boolean {
  const a = Buffer.from(password);
  const b = Buffer.from(ADMIN_PASSWORD);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function createAdminToken(): string {
  const payload = `admin.${Date.now() + SESSION_DURATION_MS}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const idx = token.lastIndexOf(".");
  if (idx <= 0) return false;
  const payload = token.slice(0, idx);
  const signature = token.slice(idx + 1);
  if (!payload.startsWith("admin.")) return false;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  return Number(payload.slice("admin.".length)) > Date.now();
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifyAdminToken(store.get(ADMIN_COOKIE)?.value);
}
