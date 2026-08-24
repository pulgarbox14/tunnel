import { createReadStream, promises as fs } from "fs";
import { Readable } from "stream";
import { uploadPath, IMAGE_TYPES } from "@/lib/uploads";

/**
 * Diffusion des images uploadées depuis le panel admin.
 *
 * En production, `next start` ne sert pas les fichiers ajoutés dans
 * public/ après le build : cette route lit donc le fichier sur le disque
 * (data/uploads/, ou public/uploads/ pour les anciens uploads) et le
 * renvoie elle-même. Les URLs restent inchangées : /uploads/<nom>.
 */

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file: name } = await params;
  const file = await uploadPath(name);
  if (!file) return new Response("Introuvable", { status: 404 });

  let stat;
  try {
    stat = await fs.stat(file);
  } catch {
    return new Response("Introuvable", { status: 404 });
  }

  const ext = name.split(".").pop() ?? "jpg";
  return new Response(Readable.toWeb(createReadStream(file)) as ReadableStream, {
    status: 200,
    headers: {
      "Content-Type": IMAGE_TYPES[ext] ?? "image/jpeg",
      "Content-Length": String(stat.size),
      // Nom de fichier unique à chaque upload → cache long sans risque
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
