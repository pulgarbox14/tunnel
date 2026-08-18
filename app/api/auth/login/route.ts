import { NextResponse } from "next/server";
import { createSessionToken, verifyAccessCode, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  let code = "";
  try {
    const body = await request.json();
    code = typeof body.code === "string" ? body.code : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  if (!verifyAccessCode(code)) {
    return NextResponse.json(
      { ok: false, error: "Code incorrect. Vérifie l'email reçu après ton achat." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
