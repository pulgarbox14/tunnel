import { promises as fs } from "fs";
import path from "path";

/**
 * Images uploadées depuis le panel admin (avis, formateur, galerie).
 *
 * Les fichiers sont stockés dans data/uploads/ — HORS de public/ :
 * en production, `next start` ne sert pas les fichiers ajoutés dans
 * public/ après le build. La diffusion passe par la route /uploads/<nom>,
 * qui lit le fichier sur le disque à chaque requête.
 */

export const UPLOADS_DIR = path.join(process.cwd(), "data", "uploads");

/** Ancien emplacement (avant correctif) — encore lu en secours. */
export const LEGACY_UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

/** Nom de fichier généré par l'upload : horodatage-aléa.extension */
export const UPLOAD_NAME_RE = /^[0-9]+-[a-f0-9]+\.(jpg|jpeg|png|webp|gif)$/;

export const IMAGE_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export async function ensureUploadsDir(): Promise<void> {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

/** Chemin absolu d'une image uploadée, ou null si le nom est invalide/absent. */
export async function uploadPath(name: string): Promise<string | null> {
  if (!UPLOAD_NAME_RE.test(name)) return null;
  // Chemins construits statiquement (le build ne trace pas tout le projet)
  const candidates = [
    path.join(process.cwd(), "data", "uploads", name),
    path.join(process.cwd(), "public", "uploads", name),
  ];
  for (const file of candidates) {
    try {
      await fs.access(file);
      return file;
    } catch {
      // essayer l'emplacement suivant
    }
  }
  return null;
}
