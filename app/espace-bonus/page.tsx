import { redirect } from "next/navigation";
import { getSessionCode, isAdminAuthenticated } from "@/lib/auth";
import { findCode, listCodes } from "@/lib/codes";
import { LogoutButton } from "@/components/LogoutButton";
import { Icon } from "@/components/Icon";
import { site as staticSite } from "@/content/site";
import { getMergedSite } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `Espace bonus — ${staticSite.brand}`,
  robots: { index: false, follow: false },
};

/**
 * ESPACE BONUS — page séparée de l'espace membre.
 * Accessible uniquement aux acheteurs du bonus (leur code dédié)
 * et à l'admin. Contient les vidéos du bonus et le contact
 * d'accompagnement.
 */
export default async function EspaceBonusPage() {
  const memberCode = await getSessionCode();
  const isAdmin = await isAdminAuthenticated();
  if (!memberCode && !isAdmin) {
    redirect("/connexion");
  }

  // A-t-il le bonus ? (code produit bonus, ou bonus acheté avec le même email)
  let hasBonus = isAdmin;
  if (!hasBonus && memberCode) {
    const rec = await findCode(memberCode);
    if (rec) {
      hasBonus =
        rec.product === "bonus" ||
        (await listCodes()).some((c) => c.email === rec.email && c.product === "bonus");
    }
  }
  if (!hasBonus) {
    // Membre du programme sans bonus : retour à son espace (offre à la fin)
    redirect("/espace-membre");
  }

  const site = await getMergedSite();
  const phone = site.bonus.contactPhone;
  const waLink = phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : "";

  return (
    <main>
      <div className="container-wide">
        <div className="member-header">
          <div>
            <span className="badge badge-yellow">
              <Icon name="gift" size={13} /> Espace bonus
            </span>
            <h1 className="title-red mt-1" style={{ fontSize: "1.4rem" }}>
              {site.bonus.title}
            </h1>
          </div>
          <LogoutButton />
        </div>

        {/* Pitch du bonus */}
        <div className="card-dark">
          <p className="muted small" style={{ fontStyle: "italic" }}>
            « {site.bonus.pitch} »
          </p>
        </div>

        {/* Vidéos du bonus */}
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

        {/* Contact accompagnement */}
        <section style={{ paddingTop: 30, paddingBottom: 50 }}>
          <div className="card-dark text-center" style={{ maxWidth: 520, margin: "0 auto" }}>
            <span className="badge badge-green">
              <Icon name="users" size={13} /> Ton accompagnement
            </span>
            <h2 className="title-red mt-2" style={{ fontSize: "1.15rem" }}>
              On t&apos;accompagne dans tes démarches
            </h2>
            <p className="muted small mt-1">
              Pour ton accompagnement personnalisé (candidatures au Bénin et à
              l&apos;étranger), contacte-nous directement :
            </p>
            {phone ? (
              <>
                <div className="access-code-box mt-1" style={{ letterSpacing: 1 }}>
                  {phone}
                </div>
                {waLink && (
                  <div className="mt-2">
                    <a href={waLink} target="_blank" rel="noreferrer" className="btn-cta btn-block">
                      Écrire sur WhatsApp
                      <small>accompagnement bonus</small>
                    </a>
                  </div>
                )}
              </>
            ) : (
              <p className="muted small mt-1 icon-line">
                <Icon name="clock" size={13} /> Le numéro de contact sera affiché ici très
                bientôt.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
