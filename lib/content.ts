import { site, type Testimonial } from "@/content/site";
import { readJson, writeJson } from "./store";

/**
 * Contenu modifiable depuis le panel admin (vidéos, avis, photos…).
 * Les valeurs enregistrées ici surchargent celles de content/site.ts.
 */

export interface BonusVideo {
  title: string;
  url: string;
}

export interface ContentOverrides {
  heroVideoUrl?: string;
  /** URLs des capsules, clé "moduleIndex-lessonIndex" (ex : "0-2"). */
  lessonUrls?: Record<string, string>;
  /** Blocs vidéo du bonus, ajoutés librement depuis le panel admin. */
  bonusVideos?: BonusVideo[];
  /** Numéro WhatsApp d'accompagnement affiché dans l'espace bonus. */
  bonusContactPhone?: string;
  coachName?: string;
  coachPhotos?: string[];
  gallery?: string[];
  testimonials?: Testimonial[];
}

const FILE = "content.json";

export async function getOverrides(): Promise<ContentOverrides> {
  return readJson<ContentOverrides>(FILE, {});
}

export async function saveOverrides(patch: ContentOverrides): Promise<ContentOverrides> {
  const current = await getOverrides();
  const merged = { ...current, ...patch };
  await writeJson(FILE, merged);
  return merged;
}

/**
 * Normalise une entrée vidéo : accepte un lien direct, un lien de partage
 * Vimeo/YouTube, ou un script <iframe> complet — retourne l'URL embed.
 */
export function normalizeVideoInput(input: string): string {
  const raw = (input ?? "").trim();
  if (!raw) return "";

  // Script <iframe ... src="..."> collé tel quel
  const iframeMatch = raw.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
  if (iframeMatch) return iframeMatch[1];

  // Lien de partage Vimeo → player.vimeo.com
  const vimeoMatch = raw.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([a-zA-Z0-9]+))?/);
  if (vimeoMatch && !raw.includes("player.vimeo.com")) {
    const hash = vimeoMatch[2] ? `?h=${vimeoMatch[2]}` : "";
    return `https://player.vimeo.com/video/${vimeoMatch[1]}${hash}`;
  }

  // Lien YouTube → embed
  const ytMatch = raw.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`;

  return raw;
}

/** Le contenu du site avec les surcharges du panel admin appliquées. */
export async function getMergedSite() {
  const o = await getOverrides();

  const merged = structuredClone(site);
  if (o.heroVideoUrl !== undefined) merged.hero.videoUrl = o.heroVideoUrl;
  if (o.coachName) merged.coach.name = o.coachName;
  if (o.coachPhotos) merged.coach.photos = o.coachPhotos;
  if (o.gallery) merged.gallery.images = o.gallery;
  if (o.testimonials) merged.results.items = o.testimonials;
  if (o.lessonUrls) {
    merged.memberModules.forEach((mod, mi) => {
      mod.lessons.forEach((lesson, li) => {
        const url = o.lessonUrls?.[`${mi}-${li}`];
        if (url !== undefined) lesson.url = url;
      });
    });
  }
  // Blocs vidéo du bonus (espace bonus) : gérés depuis le panel admin
  merged.bonus.videos = (o.bonusVideos ?? []).filter((v) => v.url);
  if (o.bonusContactPhone !== undefined) merged.bonus.contactPhone = o.bonusContactPhone;
  return merged;
}
