import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { VIDEOS_DIR, VIDEO_ID_RE, ensureVideosDir } from "@/lib/videos";
import { getOverrides } from "@/lib/content";

/** Liste des vidéos hébergées sur le serveur (panel admin). */
export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  await ensureVideosDir();
  const names = (await fs.readdir(VIDEOS_DIR)).filter((n) => VIDEO_ID_RE.test(n));

  // Quelles vidéos sont utilisées quelque part ?
  const o = await getOverrides();
  const used = new Set(
    [o.heroVideoUrl ?? "", ...Object.values(o.lessonUrls ?? {}), ...(o.testimonials ?? []).map((t) => t.src ?? "")]
      .filter((u) => u.startsWith("/api/video/"))
      .map((u) => u.split("/").pop() as string),
  );

  const videos = await Promise.all(
    names.map(async (name) => {
      const stat = await fs.stat(path.join(VIDEOS_DIR, name));
      return {
        id: name,
        url: `/api/video/${name}`,
        sizeMb: Math.round((stat.size / (1024 * 1024)) * 10) / 10,
        createdAt: stat.mtimeMs,
        used: used.has(name),
      };
    }),
  );
  videos.sort((a, b) => b.createdAt - a.createdAt);
  return NextResponse.json({ ok: true, videos });
}

/** Suppression définitive d'une vidéo du serveur. */
export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!VIDEO_ID_RE.test(id)) {
    return NextResponse.json({ ok: false, error: "Identifiant invalide." }, { status: 400 });
  }
  try {
    await fs.rm(path.join(VIDEOS_DIR, id));
  } catch {
    return NextResponse.json({ ok: false, error: "Fichier introuvable." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
