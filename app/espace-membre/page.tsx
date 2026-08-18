import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";
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
            <span className="badge">✅ Membre connecté</span>
            <h1 className="title-red mt-1" style={{ fontSize: "1.4rem" }}>
              Mes vidéos de formation
            </h1>
          </div>
          <LogoutButton />
        </div>

        <p className="muted">
          Bienvenue dans ton espace ! Regarde les vidéos dans l&apos;ordre pour de
          meilleurs résultats. 👇
        </p>

        <div className="video-list">
          {site.videos.map((video) => (
            <div className="video-item" key={video.title}>
              {video.url ? (
                video.url.endsWith(".mp4") ? (
                  <video controls controlsList="nodownload" src={video.url} />
                ) : (
                  <iframe src={video.url} allowFullScreen title={video.title} />
                )
              ) : (
                <div className="placeholder">🎬 Vidéo à venir</div>
              )}
              <div className="info">
                <span className="tag">{video.module}</span>
                <h3>{video.title}</h3>
                <p>{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
