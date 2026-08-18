import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSessionToken, verifyAccessCode, SESSION_COOKIE } from "@/lib/auth";
import { tryUseCode } from "@/lib/codes";

const DEVICE_COOKIE = "cap_did";

/**
 * Connexion à l'espace membre.
 *
 * - Le code maître (env ACCESS_CODE) fonctionne toujours — pour le formateur.
 * - Les codes personnels (CAP-XXXX-XXXX) se lient à l'appareil dès la
 *   première connexion : au-delà du nombre d'appareils autorisés, refus.
 */
export async function POST(request: Request) {
  let code = "";
  try {
    const body = await request.json();
    code = typeof body.code === "string" ? body.code.trim() : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  // Identifiant d'appareil (cookie httpOnly longue durée)
  const store = await cookies();
  let deviceId = store.get(DEVICE_COOKIE)?.value;
  const isNewDevice = !deviceId;
  if (!deviceId) deviceId = randomBytes(16).toString("hex");

  let granted = false;
  let error = "Code incorrect. Vérifie l'email reçu après ton achat.";
  let sessionCode = "";

  if (verifyAccessCode(code)) {
    // Code maître (formateur / administration)
    granted = true;
    sessionCode = "MASTER";
  } else {
    const result = await tryUseCode(code, deviceId);
    if (result.ok && result.rec) {
      granted = true;
      sessionCode = result.rec.code;
    } else if (result.reason) {
      error = result.reason;
    }
  }

  if (!granted) {
    return NextResponse.json({ ok: false, error }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, createSessionToken(sessionCode), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  if (isNewDevice) {
    response.cookies.set(DEVICE_COOKIE, deviceId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return response;
}
