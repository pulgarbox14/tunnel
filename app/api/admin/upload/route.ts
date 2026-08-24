import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { UPLOADS_DIR, ensureUploadsDir } from "@/lib/uploads";

const ALLOWED = new Set(["jpg", "jpeg", "png", "webp", "gif"]);
const MAX_BYTES = 4 * 1024 * 1024; // 4 Mo

/**
 * Upload d'image (avis WhatsApp, photos formateur/galerie) en base64.
 * Stockage dans data/uploads/ (hors public/, non servi après le build),
 * diffusion via la route /uploads/<nom>.
 */
export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: { filename?: string; data?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const ext = (body.filename ?? "").split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED.has(ext)) {
    return NextResponse.json(
      { ok: false, error: "Format accepté : jpg, png, webp, gif." },
      { status: 400 },
    );
  }

  const base64 = (body.data ?? "").replace(/^data:[^;]+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");
  if (!buffer.length || buffer.length > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Image vide ou trop lourde (4 Mo maximum)." },
      { status: 400 },
    );
  }

  await ensureUploadsDir();
  const name = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
  await fs.writeFile(path.join(UPLOADS_DIR, name), buffer);

  return NextResponse.json({ ok: true, url: `/uploads/${name}` });
}
