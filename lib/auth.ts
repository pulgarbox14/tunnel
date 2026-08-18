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

/** Crée un jeton de session signé : "<expiration>.<signature>". */
export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

/** Valide un jeton de session (signature + expiration). */
export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  return Number(payload) > Date.now();
}

/** Lit le cookie de session et dit si l'utilisateur est membre connecté. */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}
