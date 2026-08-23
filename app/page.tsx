import { Cta } from "@/components/Cta";
import { Icon } from "@/components/Icon";
import { ResultsCarousel } from "@/components/ResultsCarousel";
import { TrackVisit } from "@/components/TrackVisit";
import { getMergedSite } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const site = await getMergedSite();
  return (
    <main>
      <TrackVisit />
      {/* ===== HERO ===== */}
      <section className="grid-bg text-center">
        <div className="container">
          <span className="badge badge-yellow">
            <Icon name="graduation-cap" size={13} /> {site.hero.badge}
          </span>
          <h1 className="title-red mt-2">{site.hero.title}</h1>
          <p className="muted mt-1" style={{ maxWidth: 540, margin: "12px auto 0" }}>
            {site.hero.subtitle}
          </p>

          <div className="video-frame">
            <div className="video-label">
              <Icon name="play" size={11} /> {site.hero.videoLabel}{" "}
              <Icon name="play" size={11} />
            </div>
            <div className="video-inner">
              {site.hero.videoUrl ? (
                site.hero.videoUrl.startsWith("/api/video/") ||
                site.hero.videoUrl.endsWith(".mp4") ? (
                  <video
                    controls
                    controlsList="nodownload"
                    src={site.hero.videoUrl}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <iframe src={site.hero.videoUrl} allowFullScreen title="Vidéo de présentation" />
                )
              ) : (
                <div className="play-btn" />
              )}
            </div>
          </div>

          <Cta href="/checkout" label="Rejoindre le programme" sub="maintenant" />

          <div className="trust-bar">
            {site.trust.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BÉNÉFICES ===== */}
      <section>
        <div className="container">
          <h2 className="section-heading">Ton avenir mérite mieux que le hasard</h2>
          <p className="muted text-center" style={{ maxWidth: 500, margin: "0 auto 26px" }}>
            S&apos;orienter seul après le BAC, c&apos;est stressant et risqué. Ce programme te
            donne un chemin clair, en vidéo, de la réflexion jusqu&apos;à l&apos;inscription.
          </p>
          <ul className="red-list" style={{ maxWidth: 540, margin: "0 auto" }}>
            {site.benefits.map((b) => (
              <li key={b.title}>
                <span className="dot">
                  <Icon name={b.icon} size={14} />
                </span>
                <span>
                  <strong>{b.title}</strong> — {b.text}
                </span>
              </li>
            ))}
          </ul>
          <div className="text-center mt-3">
            <Cta href="/checkout" label="Rejoindre le programme" sub="maintenant" />
          </div>
        </div>
      </section>

      {/* ===== POUR QUI ===== */}
      <section className="text-center">
        <div className="container">
          <div className="card-dark" style={{ maxWidth: 540, margin: "0 auto" }}>
            <h2 className="section-heading">{site.forWho.title}</h2>
            <ul className="red-list divided" style={{ textAlign: "left" }}>
              {site.forWho.items.map((item) => (
                <li key={item.highlight}>
                  <span className="dot">
                    <Icon name={item.icon} size={14} />
                  </span>
                  <span>
                    Les <span className="hl">{item.highlight}</span> {item.text}
                  </span>
                </li>
              ))}
            </ul>
            <p className="muted mt-1 small">{site.forWho.note}</p>
          </div>
          <div className="mt-3">
            <Cta href="/checkout" label="Rejoindre le programme" sub="maintenant" />
          </div>
        </div>
      </section>

      {/* ===== LES ERREURS ===== */}
      <section className="grid-bg">
        <div className="container">
          <h2 className="section-heading">{site.mistakes.title}</h2>
          <p className="muted text-center" style={{ marginBottom: 26 }}>
            {site.mistakes.intro}
          </p>
          <ol className="numbered" style={{ maxWidth: 500, margin: "0 auto" }}>
            {site.mistakes.items.map((item, i) => (
              <li key={item}>
                <span className="n">{i + 1}</span>
                <span>
                  <strong>{item}</strong>
                </span>
              </li>
            ))}
          </ol>
          <p
            className="text-center mt-2"
            style={{ color: "var(--red)", fontWeight: 900, textTransform: "uppercase" }}
          >
            {site.mistakes.conclusion}
          </p>
          <div className="text-center mt-2">
            <Cta href="/checkout" label="Réserver ma place" sub="maintenant" />
          </div>
        </div>
      </section>

      {/* ===== LA PROMESSE ===== */}
      <section>
        <div className="container">
          <div className="card-dark">
            <h2 className="section-heading">{site.promise.title}</h2>
            <ul className="red-list">
              {site.promise.items.map((item) => (
                <li key={item.title}>
                  <span className="dot">
                    <Icon name={item.icon} size={14} />
                  </span>
                  <span>
                    <strong>{item.title}</strong> {item.text}
                  </span>
                </li>
              ))}
            </ul>
            <p className="muted text-center mt-1 small">{site.promise.note}</p>
          </div>
          <div className="text-center mt-3">
            <Cta href="/checkout" label="Rejoindre le programme" sub="maintenant" />
          </div>
        </div>
      </section>

      {/* ===== LA MÉTHODE ===== */}
      <section>
        <div className="container-wide">
          <h2 className="section-heading">{site.method.title}</h2>
          <p className="muted text-center" style={{ maxWidth: 520, margin: "0 auto" }}>
            {site.method.intro}
          </p>
          <div className="pillars">
            {site.method.pillars.map((p) => (
              <div className="pillar" key={p.title}>
                <span className="pillar-icon">
                  <Icon name={p.icon} size={18} />
                </span>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-3">
            <Cta href="/checkout" label="Rejoindre le programme" sub="maintenant" />
          </div>
        </div>
      </section>

      {/* ===== LES MODULES ===== */}
      <section className="grid-bg">
        <div className="container-wide">
          <p className="muted text-center" style={{ marginBottom: 8 }}>
            Tu vas suivre un parcours clair, étape par étape —{" "}
            <span className="strong-white">
              de la découverte des universités jusqu&apos;à ton plan de carrière.
            </span>
          </p>
          <h2 className="section-heading">Découvre les 4 modules du programme</h2>
          <div className="modules-grid">
            {site.modules.map((mod) => (
              <div className="module-card" key={mod.title}>
                <div className="cover">
                  <Icon name={mod.icon} size={48} className="cover-icon" />
                </div>
                <span className="tag">{mod.tag}</span>
                <h3>{mod.title}</h3>
                {mod.duration && <span className="duration">{mod.duration}</span>}
                <ul>
                  {mod.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                {mod.promise && <p className="promise">« {mod.promise} »</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LE FORMATEUR ===== */}
      <section>
        <div className="container-wide">
          <div className="coach-grid">
            <div>
              <h2 className="title-red" style={{ fontSize: "1.4rem" }}>
                {site.coach.heading}
              </h2>
              <p className="muted mt-1">
                <span className="strong-white">{site.coach.name}</span> {site.coach.intro}
              </p>
              <div className="card-dark mt-2" style={{ padding: "20px 18px" }}>
                <ul className="red-list divided" style={{ marginBottom: 0 }}>
                  {site.coach.points.map((p) => (
                    <li key={p} style={{ marginBottom: 12 }}>
                      <span className="dot dot-green">
                        <Icon name="check" size={13} />
                      </span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="muted mt-2 small" style={{ textTransform: "uppercase", fontWeight: 700 }}>
                {site.coach.missionTitle}
              </p>
              <p className="title-red" style={{ fontSize: "1rem" }}>
                {site.coach.missionProgram}
              </p>
              <p className="muted mt-1 small">{site.coach.mission}</p>
            </div>
            <div style={{ display: "grid", gap: 18 }}>
              {site.coach.photos.map((photo, i) =>
                photo ? (
                  <div className="photo-frame" key={i}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo} alt={site.coach.name} />
                  </div>
                ) : (
                  <div className="photo-frame" key={i}>
                    Photo du formateur
                  </div>
                ),
              )}
            </div>
          </div>
          <div className="text-center mt-3">
            <Cta href="/checkout" label="Rejoindre le programme" sub="maintenant" />
          </div>
        </div>
      </section>

      {/* ===== GALERIE ===== */}
      <section className="grid-bg">
        <div className="container-wide">
          <h2 className="section-heading">{site.gallery.title}</h2>
          <div className="gallery-strip">
            {site.gallery.images.map((img, i) =>
              img ? (
                <div className="photo-frame" key={i}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" />
                </div>
              ) : (
                <div className="photo-frame" key={i}>
                  Photo
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ===== RÉSULTATS D'ÉLÈVES ===== */}
      <section>
        <div className="container-wide">
          <h2 className="section-heading">{site.results.title}</h2>
          <p className="muted text-center" style={{ maxWidth: 520, margin: "0 auto" }}>
            {site.results.intro}
          </p>
          <ResultsCarousel items={site.results.items} />
          <div className="text-center mt-3">
            <Cta href="/checkout" label="Rejoindre le programme" sub="maintenant" />
          </div>
        </div>
      </section>

      {/* ===== OFFRE ===== */}
      <section id="offre" className="text-center">
        <div className="container">
          <h2 className="section-heading">Rejoins le programme maintenant</h2>
          <div className="card-dark" style={{ maxWidth: 420, margin: "0 auto" }}>
            <span className="badge badge-yellow">{site.pricing.badge}</span>
            <div className="mt-2 price-old">
              {site.pricing.oldPrice} {site.pricing.currency}
            </div>
            <div className="price-now">
              {site.pricing.price} {site.pricing.currency}
            </div>
            <p className="muted small">{site.pricing.note}</p>
            <ul className="red-list mt-2" style={{ textAlign: "left" }}>
              {site.pricing.features.map((f) => (
                <li key={f}>
                  <span className="dot dot-green">
                    <Icon name="check" size={14} />
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2">
              <Cta href="/checkout" label="Rejoindre le programme" sub="accès immédiat" block />
            </div>
          </div>
          <p className="muted mt-2 small icon-line">
            <Icon name="lock" size={12} /> {site.pricing.paymentNote}
          </p>
        </div>
      </section>
    </main>
  );
}
