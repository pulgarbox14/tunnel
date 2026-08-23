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

const AUTH_SECRET = process.env.AUTH_SECRET ?? "dev-secret-a-changer-en-production";

export const SESSION_COOKIE = "member_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 jours

function sign(payload: string): string {
  return createHmac("sha256", AUTH_SECRET).update(payload).digest("hex");
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

/* ===================== Administration ===================== */

/**
 * Identifiants admin : UNIQUEMENT via variables d'environnement.
 * En production, si ADMIN_EMAIL / ADMIN_PASSWORD ne sont pas définis,
 * le panel est verrouillé (aucune valeur par défaut dans le code).
 * En développement local, un repli permet de tester.
 */
const IS_PROD = process.env.NODE_ENV === "production";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? (IS_PROD ? "" : "admin@test.local");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? (IS_PROD ? "" : "capadmin2026");
export const ADMIN_COOKIE = "admin_session";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return false;
  return safeEqual(email.trim().toLowerCase(), ADMIN_EMAIL.toLowerCase()) && safeEqual(password, ADMIN_PASSWORD);
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
