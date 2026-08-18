import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";
import { Icon } from "@/components/Icon";
import { site } from "@/content/site";

export const metadata = {
  title: `Espace membre — ${site.brand}`,
  robots: { index: false, follow: false },
};

export default async function EspaceMembrePage() {
  // Protection côté serveur : sans session valide, retour à la connexion.
  if (!(await isAuthenticated())) {
    redirect("/connexion");
  }

  return (
    <main>
      <div className="container-wide">
        <div className="member-header">
          <div>
            <span className="badge">
              <Icon name="check" size={13} /> Membre connecté
            </span>
            <h1 className="title-red mt-1" style={{ fontSize: "1.4rem" }}>
              {site.brand} — Mes leçons vidéo
            </h1>
          </div>
          <LogoutButton />
        </div>

        <p className="muted">
          Bienvenue dans ton espace ! Suis les modules dans l&apos;ordre pour de
          meilleurs résultats.
        </p>

        {site.memberModules.map((mod) => (
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
      </div>
    </main>
  );
}
