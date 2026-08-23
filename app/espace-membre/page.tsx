import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionCode, isAdminAuthenticated } from "@/lib/auth";
import { findCode, listCodes } from "@/lib/codes";
import { getProgress } from "@/lib/progress";
import { LogoutButton } from "@/components/LogoutButton";
import { LessonDone } from "@/components/LessonDone";
import { Icon } from "@/components/Icon";
import { site as staticSite } from "@/content/site";
import { getMergedSite } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `Espace membre — ${staticSite.brand}`,
  robots: { index: false, follow: false },
};

export default async function EspaceMembrePage() {
  // Protection côté serveur : session membre OU session admin (le
  // formateur accède à tout depuis son panel, sans code).
  const memberCode = await getSessionCode();
  const isMaster = await isAdminAuthenticated();
  if (!memberCode && !isMaster) {
    redirect("/connexion");
  }
  const sessionCode = memberCode ?? "ADMIN";

  const rec = isMaster ? undefined : await findCode(sessionCode);
  const product = rec?.product ?? "programme";
  const showProgramme = isMaster || product === "programme";

  // Le bonus est déjà acheté ? (un autre code du même email, produit bonus)
  const allCodes = rec ? await listCodes() : [];
  const hasBonus =
    isMaster ||
    product === "bonus" ||
    (rec ? allCodes.some((c) => c.email === rec.email && c.product === "bonus") : false);

  const site = await getMergedSite();

  // Progression : toutes les leçons du programme principal terminées ?
  const completed = await getProgress(sessionCode);
  const totalLessons = site.memberModules.reduce((sum, m) => sum + m.lessons.length, 0);
  const doneCount = site.memberModules.reduce(
    (sum, m, mi) =>
      sum + m.lessons.filter((_, li) => completed.includes(`${mi}-${li}`)).length,
    0,
  );
  const allDone = showProgramme && doneCount >= totalLessons;

  return (
    <main>
      <div className="container-wide">
        <div className="member-header">
          <div>
            <span className="badge badge-green">
              <Icon name="check" size={13} /> Membre connecté{rec ? ` — ${rec.name}` : ""}
            </span>
            <h1 className="title-red mt-1" style={{ fontSize: "1.4rem" }}>
              {site.brand} — Mes vidéos de formation
            </h1>
          </div>
          <LogoutButton />
        </div>

        {/* ===== BARRE DE PROGRESSION ===== */}
        {showProgramme && (
          <div className="progress-wrap">
            <div className="progress-info">
              <span>
                Ta progression :{" "}
                <span className="strong-white">
                  {doneCount}/{totalLessons} vidéos terminées
                </span>
              </span>
              {!allDone && (
                <span className="muted small icon-line">
                  <Icon name="gift" size={12} /> Termine tout pour débloquer le bonus
                </span>
              )}
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${totalLessons ? Math.round((doneCount / totalLessons) * 100) : 0}%` }}
              />
            </div>
          </div>
        )}

        <p className="muted">
          Bienvenue dans ton espace ! Suis les modules dans l&apos;ordre, et marque chaque vidéo
          terminée pour suivre ta progression.
        </p>

        {/* ===== PROGRAMME PRINCIPAL ===== */}
        {showProgramme &&
          site.memberModules.map((mod, mi) => (
            <section key={mod.tag} style={{ paddingBottom: 20 }}>
              <div className="card-dark">
                <div className="module-title-row">
                  <span className="module-icon">
                    <Icon name={mod.icon} size={22} />
                  </span>
                  <div>
                    <span className="tag">{mod.tag}</span>
                    <h2 className="title-red mt-1" style={{ fontSize: "1.1rem" }}>
                      {mod.title}
                    </h2>
                  </div>
                </div>
                <p className="muted small mt-1" style={{ fontStyle: "italic" }}>
                  « {mod.pitch} »
                </p>
              </div>

              <div className="video-list">
                {mod.lessons.map((lesson, li) => (
                  <div className="video-item" key={lesson.title}>
                    {lesson.url ? (
                      lesson.url.startsWith("/api/video/") || lesson.url.endsWith(".mp4") || lesson.url.endsWith(".webm") ? (
                        <video controls controlsList="nodownload" src={lesson.url} />
                      ) : (
                        <iframe src={lesson.url} allowFullScreen title={lesson.title} />
                      )
                    ) : (
                      <div className="placeholder">
                        <Icon name="video" size={20} />
                        <span style={{ marginLeft: 8 }}>Vidéo à venir</span>
                      </div>
                    )}
                    <div className="info">
                      <h3>{lesson.title}</h3>
                      <p>{lesson.description}</p>
                      <LessonDone
                        lessonKey={`${mi}-${li}`}
                        initialDone={completed.includes(`${mi}-${li}`)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

        {/* ===== BONUS : verrouillé tant que la formation n'est pas terminée ===== */}
        {showProgramme && !hasBonus && (
          allDone ? (
            <section className="bonus-unlock" style={{ paddingBottom: 30 }}>
              <div className="card-dark text-center bonus-card">
                <span className="badge badge-yellow">
                  <Icon name="gift" size={13} /> Bonus débloqué !
                </span>
                <h2 className="title-red mt-2" style={{ fontSize: "1.3rem" }}>
                  Félicitations, tu as terminé la formation !
                </h2>
                <p className="muted mt-1" style={{ maxWidth: 520, margin: "12px auto 0" }}>
                  Tu as maintenant accès à une offre réservée aux membres qui vont au bout :{" "}
                  <span className="strong-white">{site.bonus.title}</span> — on t&apos;accompagne
                  pour postuler dans les universités du Bénin comme à l&apos;étranger.
                </p>
                <div className="mt-1 price-old">
                  {site.bonus.pricing.oldPrice} {site.bonus.pricing.currency}
                </div>
                <div className="price-now">
                  {site.bonus.pricing.price} {site.bonus.pricing.currency}
                </div>
                <div className="mt-2">
                  <Link href="/bonus" className="btn-cta">
                    Découvrir le bonus
                    <small>offre réservée aux finissants</small>
                  </Link>
                </div>
              </div>
            </section>
          ) : (
            <section style={{ paddingBottom: 30 }}>
              <div className="card-dark text-center bonus-locked">
                <span className="badge">
                  <Icon name="lock" size={13} /> Bonus verrouillé
                </span>
                <p className="muted mt-1 small">
                  Un bonus exclusif t&apos;attend à la fin de la formation. Termine les{" "}
                  <span className="strong-white">
                    {totalLessons - doneCount} vidéo(s) restante(s)
                  </span>{" "}
                  pour le débloquer.
                </p>
              </div>
            </section>
          )
        )}

        {/* ===== CONTENU DU BONUS (acheté) ===== */}
        {hasBonus && (
          <section style={{ paddingBottom: 20 }}>
            <div className="card-dark">
              <div className="module-title-row">
                <span className="module-icon">
                  <Icon name="gift" size={22} />
                </span>
                <div>
                  <span className="tag">Bonus</span>
                  <h2 className="title-red mt-1" style={{ fontSize: "1.1rem" }}>
                    {site.bonus.title}
                  </h2>
                </div>
              </div>
              <p className="muted small mt-1" style={{ fontStyle: "italic" }}>
                « {site.bonus.pitch} »
              </p>
            </div>

            {site.bonus.videos.length > 0 ? (
              <div className="video-list">
                {site.bonus.videos.map((video) => (
                  <div className="video-item" key={video.title + video.url}>
                    {video.url.startsWith("/api/video/") ||
                    video.url.endsWith(".mp4") ||
                    video.url.endsWith(".webm") ? (
                      <video controls controlsList="nodownload" src={video.url} />
                    ) : (
                      <iframe src={video.url} allowFullScreen title={video.title} />
                    )}
                    <div className="info">
                      <h3>{video.title || "Vidéo du bonus"}</h3>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted small mt-2 icon-line">
                <Icon name="clock" size={13} /> Les vidéos du bonus apparaîtront ici dès leur
                publication.
              </p>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
