import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { VIDEOS_DIR, ensureVideosDir } from "@/lib/videos";

/**
 * Upload de vidéo par morceaux (chunks) depuis le panel admin.
 *
 * Le fichier est découpé côté navigateur (4 Mo par morceau) et les
 * morceaux sont envoyés PLUSIEURS EN PARALLÈLE : sur une connexion
 * mobile, un seul flux n'utilise jamais tout le débit disponible.
 *
 * Chaque morceau est écrit à sa position exacte (chunk × 4 Mo) dans le
 * fichier .part — l'ordre d'arrivée n'a donc aucune importance, et un
 * morceau renvoyé après une coupure ne corrompt rien.
 *
 * Un fichier « carte » (.map) note quel morceau est bien arrivé : un
 * morceau perdu laisserait sinon un trou de zéros invisible (la taille
 * finale serait juste, mais la vidéo illisible).
 *
 * Appels du panel :
 *   POST ?name=…&chunk=0&total=N&id=        → crée le fichier, renvoie l'id
 *   POST ?name=…&chunk=i&total=N&id=ID      → écrit le morceau i
 *   POST ?finalize=1&id=ID&size=OCTETS      → vérifie tout et assemble
 */

const ALLOWED = new Set(["mp4", "webm", "m4v"]);
/** Doit correspondre au découpage côté panel (AdminDashboard). */
const CHUNK_BYTES = 4 * 1024 * 1024;
/** Taille maximale en Mo. 0 (défaut) = AUCUNE limite. */
const MAX_MB = Number(process.env.MAX_VIDEO_MB ?? 0);

const ID_RE = /^[a-z0-9]+\.(mp4|webm|m4v)$/;

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const url = new URL(request.url);
  const name = url.searchParams.get("name") ?? "";
  let id = url.searchParams.get("id") ?? "";

  await ensureVideosDir();

  // ---- Étape finale : tous les morceaux sont arrivés, on assemble ----
  if (url.searchParams.get("finalize") === "1") {
    if (!ID_RE.test(id)) {
      return NextResponse.json({ ok: false, error: "Identifiant invalide." }, { status: 400 });
    }
    const partFile = path.join(VIDEOS_DIR, `${id}.part`);
    const mapFile = path.join(VIDEOS_DIR, `${id}.map`);
    const finalFile = path.join(VIDEOS_DIR, id);

    // Déjà assemblée (réponse perdue en route, le panel réessaie) : c'est bon
    if (await fs.stat(finalFile).catch(() => null)) {
      return NextResponse.json({ ok: true, id, url: `/api/video/${id}` });
    }

    const expected = Number(url.searchParams.get("size") ?? 0);
    const stat = await fs.stat(partFile).catch(() => null);
    if (!stat) {
      return NextResponse.json(
        { ok: false, error: "Upload introuvable — recommence l'envoi du fichier." },
        { status: 409 },
      );
    }

    // Tous les morceaux sont-ils réellement arrivés ?
    const map = await fs.readFile(mapFile).catch(() => null);
    if (!map) {
      return NextResponse.json(
        { ok: false, error: "Upload introuvable — recommence l'envoi du fichier." },
        { status: 409 },
      );
    }
    const missing = [...map].reduce((n, b) => n + (b ? 0 : 1), 0);
    if (missing > 0) {
      return NextResponse.json(
        {
          ok: false,
          error: `${missing} morceau(x) sur ${map.length} ne sont pas arrivés — recommence l'envoi.`,
        },
        { status: 409 },
      );
    }
    if (expected > 0 && stat.size !== expected) {
      return NextResponse.json(
        {
          ok: false,
          error: `Fichier incomplet (${stat.size} octets reçus sur ${expected}) — recommence l'envoi.`,
        },
        { status: 409 },
      );
    }

    await fs.rename(partFile, finalFile);
    await fs.rm(mapFile, { force: true });
    return NextResponse.json({ ok: true, id, url: `/api/video/${id}` });
  }

  // ---- Envoi d'un morceau ----
  const chunk = parseInt(url.searchParams.get("chunk") ?? "0", 10);
  const total = parseInt(url.searchParams.get("total") ?? "1", 10);

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

  if (chunk === 0) {
    id = `${Date.now().toString(36)}${randomBytes(5).toString("hex")}.${ext}`;
  } else if (!ID_RE.test(id)) {
    return NextResponse.json({ ok: false, error: "Identifiant invalide." }, { status: 400 });
  }

  const partFile = path.join(VIDEOS_DIR, `${id}.part`);
  const mapFile = path.join(VIDEOS_DIR, `${id}.map`);
  const buffer = Buffer.from(await request.arrayBuffer());

  // Garde-fou optionnel (MAX_VIDEO_MB) — désactivé par défaut : aucune limite
  if (MAX_MB > 0 && chunk * CHUNK_BYTES + buffer.length > MAX_MB * 1024 * 1024) {
    await fs.rm(partFile, { force: true });
    await fs.rm(mapFile, { force: true });
    return NextResponse.json(
      { ok: false, error: `Vidéo trop lourde (maximum ${MAX_MB} Mo).` },
      { status: 400 },
    );
  }

  if (chunk === 0) {
    // Le premier morceau crée le fichier et la carte des morceaux ; les
    // suivants peuvent alors partir en parallèle, chacun à sa position.
    await fs.writeFile(partFile, buffer);
    await fs.writeFile(mapFile, Buffer.alloc(total, 0));
  } else if (!(await fs.stat(partFile).catch(() => null))) {
    return NextResponse.json(
      { ok: false, error: "Upload interrompu côté serveur — recommence l'envoi du fichier." },
      { status: 409 },
    );
  } else {
    const fh = await fs.open(partFile, "r+");
    try {
      await fh.write(buffer, 0, buffer.length, chunk * CHUNK_BYTES);
    } finally {
      await fh.close();
    }
  }

  // Écriture d'un seul octet à la position du morceau : chaque requête
  // touche un octet différent, aucun conflit possible entre les envois
  // parallèles.
  const mh = await fs.open(mapFile, "r+").catch(() => null);
  if (mh) {
    try {
      await mh.write(Buffer.from([1]), 0, 1, chunk);
    } finally {
      await mh.close();
    }
  }

  return NextResponse.json({ ok: true, id });
}
