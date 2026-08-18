import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { resetDevices } from "@/lib/codes";

/** Actions sur les codes d'accès (ex : libérer les appareils d'un client). */
export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: { code?: string; action?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  if (body.action === "reset-devices" && body.code) {
    const done = await resetDevices(body.code);
    return NextResponse.json({ ok: done, error: done ? undefined : "Code introuvable." });
  }

  return NextResponse.json({ ok: false, error: "Action inconnue." }, { status: 400 });
}
