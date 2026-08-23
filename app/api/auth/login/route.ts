import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSessionToken, createBonusToken, SESSION_COOKIE, BONUS_COOKIE } from "@/lib/auth";
import { tryUseCode } from "@/lib/codes";

const DEVICE_COOKIE = "cap_did";

/**
 * Connexion à l'espace membre — uniquement par code personnel.
 *
 * Les codes (CAP-XXXX-XXXX) se lient à l'appareil dès la première
 * connexion : au-delà du nombre d'appareils autorisés, refus.
 * (Le formateur accède à l'espace membre via sa session admin.)
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

  const result = await tryUseCode(code, deviceId);
  if (!result.ok || !result.rec) {
    return NextResponse.json(
      { ok: false, error: result.reason ?? "Code incorrect. Vérifie l'email reçu après ton achat." },
      { status: 401 },
    );
  }
  // Un code BONUS saisi ici : on ouvre directement la session bonus
  if (result.rec.product === "bonus") {
    const response = NextResponse.json({ ok: true, redirect: "/espace-bonus" });
    response.cookies.set(BONUS_COOKIE, createBonusToken(result.rec.code), {
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
  const sessionCode = result.rec.code;

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
