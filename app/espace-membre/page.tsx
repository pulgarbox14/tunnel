import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionCode } from "@/lib/auth";
import { findCode } from "@/lib/codes";
import { LogoutButton } from "@/components/LogoutButton";
import { Icon } from "@/components/Icon";
import { site as staticSite } from "@/content/site";
import { getMergedSite } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `Espace membre — ${staticSite.brand}`,
  robots: { index: false, follow: false },
};

export default async function EspaceMembrePage() {
  // Protection côté serveur : sans session valide, retour à la connexion.
  const sessionCode = await getSessionCode();
  if (!sessionCode) {
    redirect("/connexion");
  }

  // Accès selon le produit acheté (le code maître voit tout)
  const isMaster = sessionCode === "MASTER";
  const rec = isMaster ? undefined : await findCode(sessionCode);
  const product = rec?.product ?? "programme";
  const showProgramme = isMaster || product === "programme";
  const showBonus = isMaster || product === "bonus";

  const site = await getMergedSite();

  return (
    <main>
      <div className="container-wide">
        <div className="member-header">
          <div>
            <span className="badge badge-green">
              <Icon name="check" size={13} /> Membre connecté{rec ? ` — ${rec.name}` : ""}
            </span>
            <h1 className="title-red mt-1" style={{ fontSize: "1.4rem" }}>
              {site.brand} — Mes leçons vidéo
            </h1>
          </div>
          <LogoutButton />
        </div>

        <p className="muted">
          Bienvenue dans ton espace ! Suis les modules dans l&apos;ordre pour de meilleurs
          résultats.
        </p>

        {/* ===== PROGRAMME PRINCIPAL ===== */}
        {showProgramme &&
          site.memberModules.map((mod) => (
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
                {mod.lessons.map((lesson) => (
                  <div className="video-item" key={lesson.title}>
                    {lesson.url ? (
                      lesson.url.endsWith(".mp4") ? (
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
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

        {/* ===== BONUS ===== */}
        {showBonus && (
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

            <div className="video-list">
              {site.bonus.lessons.map((lesson) => (
                <div className="video-item" key={lesson.title}>
                  {lesson.url ? (
                    lesson.url.endsWith(".mp4") ? (
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
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===== PROPOSITION CROISÉE ===== */}
        {!isMaster && !showBonus && (
          <div className="card-dark text-center mt-2" style={{ maxWidth: 520, margin: "24px auto" }}>
            <span className="badge badge-yellow">
              <Icon name="gift" size={13} /> Bonus disponible
            </span>
            <p className="muted mt-1 small">
              <span className="strong-white">{site.bonus.title}</span> — {site.bonus.pricing.price}{" "}
              {site.bonus.pricing.currency}. Apprends à postuler pour les bourses extérieures, avec
              accompagnement.
            </p>
            <div className="mt-1">
              <Link href="/bonus" className="btn-ghost">
                Découvrir le bonus
              </Link>
            </div>
          </div>
        )}
        {!isMaster && !showProgramme && (
          <div className="card-dark text-center mt-2" style={{ maxWidth: 520, margin: "24px auto" }}>
            <span className="badge badge-yellow">
              <Icon name="graduation-cap" size={13} /> Programme complet disponible
            </span>
            <p className="muted mt-1 small">
              <span className="strong-white">Réussir Son Post-BAC</span> — {site.pricing.price}{" "}
              {site.pricing.currency}. Les {site.memberModules.length} modules pour réussir ton
              orientation.
            </p>
            <div className="mt-1">
              <Link href="/" className="btn-ghost">
                Découvrir le programme
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
