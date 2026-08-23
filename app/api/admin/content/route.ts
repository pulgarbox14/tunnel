import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getOverrides, saveOverrides, normalizeVideoInput, type ContentOverrides } from "@/lib/content";
import { site } from "@/content/site";

/** GET : contenu actuel (défauts + surcharges) pour préremplir le panel. */
export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const overrides = await getOverrides();
  return NextResponse.json({
    ok: true,
    overrides,
    defaults: {
      heroVideoUrl: site.hero.videoUrl,
      coachName: site.coach.name,
      coachPhotos: site.coach.photos,
      gallery: site.gallery.images,
      testimonials: site.results.items,
      modules: site.memberModules.map((m) => ({
        tag: m.tag,
        title: m.title,
        lessons: m.lessons.map((l) => ({ title: l.title, url: l.url ?? "" })),
      })),
      bonusVideos: [],
      bonusContactPhone: site.bonus.contactPhone,
    },
  });
}

/** PUT : enregistre les surcharges (vidéos normalisées automatiquement). */
export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  let patch: ContentOverrides;
  try {
    patch = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  // Normalisation : liens de partage ou scripts <iframe> → URL embed
  if (patch.heroVideoUrl !== undefined) {
    patch.heroVideoUrl = normalizeVideoInput(patch.heroVideoUrl);
  }
  if (patch.lessonUrls) {
    for (const key of Object.keys(patch.lessonUrls)) {
      patch.lessonUrls[key] = normalizeVideoInput(patch.lessonUrls[key]);
    }
  }
  if (typeof patch.bonusContactPhone === "string") {
    patch.bonusContactPhone = patch.bonusContactPhone.trim();
  }
  if (patch.bonusVideos) {
    patch.bonusVideos = patch.bonusVideos
      .map((v) => ({ title: (v.title ?? "").trim(), url: normalizeVideoInput(v.url ?? "") }))
      .filter((v) => v.title || v.url);
  }
  if (patch.testimonials) {
    patch.testimonials = patch.testimonials.map((t) => ({
      ...t,
      src: t.type === "vimeo" ? normalizeVideoInput(t.src ?? "") : t.src,
    }));
  }

  const merged = await saveOverrides(patch);
  return NextResponse.json({ ok: true, overrides: merged });
}
