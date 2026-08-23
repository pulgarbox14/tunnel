import { promises as fs } from "fs";
import path from "path";

/**
 * Vidéos auto-hébergées.
 *
 * Les fichiers sont stockés dans data/videos/ — HORS de public/ :
 * ils ne sont donc jamais accessibles directement. La diffusion passe
 * par /api/video/<id>, qui vérifie la session membre.
 */

export const VIDEOS_DIR = path.join(process.cwd(), "data", "videos");

/** Identifiant de fichier vidéo sûr (généré par l'upload). */
export const VIDEO_ID_RE = /^[a-z0-9]+\.(mp4|webm|m4v)$/;

export const VIDEO_TYPES: Record<string, string> = {
  mp4: "video/mp4",
  webm: "video/webm",
  m4v: "video/x-m4v",
};

export async function ensureVideosDir(): Promise<void> {
  await fs.mkdir(VIDEOS_DIR, { recursive: true });
}

export function videoPath(id: string): string | null {
  if (!VIDEO_ID_RE.test(id)) return null;
  return path.join(VIDEOS_DIR, id);
}

/** Une URL de vidéo hébergée chez nous (ou fichier direct) → balise <video>. */
export function isSelfHostedVideo(url: string): boolean {
  return url.startsWith("/api/video/") || url.endsWith(".mp4") || url.endsWith(".webm");
}
