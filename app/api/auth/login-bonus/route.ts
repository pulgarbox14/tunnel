import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createBonusToken, BONUS_COOKIE } from "@/lib/auth";
import { findCode, tryUseCode } from "@/lib/codes";

const DEVICE_COOKIE = "cap_did";

/**
 * Connexion à l'ESPACE BONUS — porte séparée de l'espace membre.
 * N'accepte que les codes bonus (envoyés après l'achat des 5 000 F).
 */
export async function POST(request: Request) {
  let code = "";
  try {
    const body = await request.json();
    code = typeof body.code === "string" ? body.code.trim() : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const rec = await findCode(code);
  if (!rec) {
    return NextResponse.json(
      { ok: false, error: "Code incorrect. Vérifie l'email reçu après ton achat du bonus." },
      { status: 401 },
    );
  }
  if (rec.product !== "bonus") {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Ce code correspond à la formation, pas au bonus. Le code bonus t'est envoyé après l'achat de l'accompagnement.",
      },
      { status: 401 },
    );
  }

  // Verrouillage d'appareil, comme pour l'espace membre
  const store = await cookies();
  let deviceId = store.get(DEVICE_COOKIE)?.value;
  const isNewDevice = !deviceId;
  if (!deviceId) deviceId = randomBytes(16).toString("hex");

  const use = await tryUseCode(code, deviceId);
  if (!use.ok) {
    return NextResponse.json({ ok: false, error: use.reason }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(BONUS_COOKIE, createBonusToken(rec.code), {
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
