import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { VIDEOS_DIR, ensureVideosDir } from "@/lib/videos";

/**
 * Upload de vidéo par morceaux (chunks) depuis le panel admin.
 *
 * Le fichier est découpé côté navigateur (4 Mo par morceau) pour passer
 * sans problème même sur une connexion moyenne, puis assemblé ici.
 * Le panel appelle : POST /api/admin/video-upload?name=...&chunk=N&total=M&id=...
 */

const ALLOWED = new Set(["mp4", "webm", "m4v"]);
const MAX_MB = Number(process.env.MAX_VIDEO_MB ?? 2048);

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const url = new URL(request.url);
  const name = url.searchParams.get("name") ?? "";
  const chunk = parseInt(url.searchParams.get("chunk") ?? "0", 10);
  const total = parseInt(url.searchParams.get("total") ?? "1", 10);
  let id = url.searchParams.get("id") ?? "";

  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED.has(ext)) {
    return NextResponse.json(
      { ok: false, error: "Format accepté : mp4 (recommandé), webm, m4v." },
      { status: 400 },
    );
  }
  if (!Number.isFinite(chunk) || !Number.isFinite(total) || chunk < 0 || chunk >= total) {
    return NextResponse.json({ ok: false, error: "Morceau invalide." }, { status: 400 });
  }

  await ensureVideosDir();

  if (chunk === 0) {
    id = `${Date.now().toString(36)}${randomBytes(5).toString("hex")}.${ext}`;
  } else if (!/^[a-z0-9]+\.[a-z0-9]+$/.test(id)) {
    return NextResponse.json({ ok: false, error: "Identifiant invalide." }, { status: 400 });
  }

  const partFile = path.join(VIDEOS_DIR, `${id}.part`);
  const buffer = Buffer.from(await request.arrayBuffer());

  // Garde-fou taille totale
  const currentSize = chunk === 0 ? 0 : (await fs.stat(partFile).catch(() => ({ size: 0 }))).size;
  if (currentSize + buffer.length > MAX_MB * 1024 * 1024) {
    await fs.rm(partFile, { force: true });
    return NextResponse.json(
      { ok: false, error: `Vidéo trop lourde (maximum ${MAX_MB} Mo).` },
      { status: 400 },
    );
  }

  if (chunk === 0) {
    await fs.writeFile(partFile, buffer);
  } else {
    await fs.appendFile(partFile, buffer);
  }

  if (chunk === total - 1) {
    await fs.rename(partFile, path.join(VIDEOS_DIR, id));
    return NextResponse.json({ ok: true, id, url: `/api/video/${id}` });
  }
  return NextResponse.json({ ok: true, id });
}
