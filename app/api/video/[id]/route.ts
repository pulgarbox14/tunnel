import { createReadStream, promises as fs } from "fs";
import { Readable } from "stream";
import { isAuthenticated, isAdminAuthenticated } from "@/lib/auth";
import { getMergedSite } from "@/lib/content";
import { videoPath, VIDEO_TYPES } from "@/lib/videos";

/**
 * Diffusion sécurisée des vidéos auto-hébergées.
 *
 * - Réservée aux membres connectés (et à l'admin).
 * - Exception : la vidéo de vente et les vidéos d'avis référencées sur la
 *   page d'accueil sont publiques.
 * - Support des requêtes Range (lecture progressive, avance/retour rapide).
 */

async function isPublicVideo(id: string): Promise<boolean> {
  const site = await getMergedSite();
  const urls = [site.hero.videoUrl, ...site.results.items.map((t) => t.src ?? "")];
  return urls.some((u) => u === `/api/video/${id}`);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const file = videoPath(id);
  if (!file) return new Response("Introuvable", { status: 404 });

  const allowed =
    (await isAuthenticated()) || (await isAdminAuthenticated()) || (await isPublicVideo(id));
  if (!allowed) return new Response("Accès refusé", { status: 403 });

  let stat;
  try {
    stat = await fs.stat(file);
  } catch {
    return new Response("Introuvable", { status: 404 });
  }

  const ext = id.split(".").pop() ?? "mp4";
  const contentType = VIDEO_TYPES[ext] ?? "video/mp4";
  const size = stat.size;

  const range = request.headers.get("range");
  if (range) {
    const match = range.match(/bytes=(\d*)-(\d*)/);
    let start = match?.[1] ? parseInt(match[1], 10) : 0;
    let end = match?.[2] ? parseInt(match[2], 10) : size - 1;
    if (Number.isNaN(start) || start >= size) start = 0;
    if (Number.isNaN(end) || end >= size) end = size - 1;

    const stream = createReadStream(file, { start, end });
    return new Response(Readable.toWeb(stream) as ReadableStream, {
      status: 206,
      headers: {
        "Content-Type": contentType,
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Content-Length": String(end - start + 1),
        "Accept-Ranges": "bytes",
        "Cache-Control": "private, no-store",
      },
    });
  }

  const stream = createReadStream(file);
  return new Response(Readable.toWeb(stream) as ReadableStream, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(size),
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, no-store",
    },
  });
}
