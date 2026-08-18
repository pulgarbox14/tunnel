import { site } from "@/content/site";
import { Cta } from "@/components/Cta";

export default function HomePage() {
  return (
    <main>
      {/* ===== HERO ===== */}
      <section className="grid-bg text-center">
        <div className="container">
          <span className="badge">{site.hero.badge}</span>
          <h1 className="title-red mt-2">{site.hero.title}</h1>
          <p className="muted mt-1" style={{ maxWidth: 520, margin: "12px auto 0" }}>
            {site.hero.subtitle}
          </p>

          <div className="video-frame">
            <div className="video-label">{site.hero.videoLabel}</div>
            <div className="video-inner">
              {site.hero.videoUrl ? (
                <iframe src={site.hero.videoUrl} allowFullScreen title="Vidéo de présentation" />
              ) : (
                <div className="play-btn" />
              )}
            </div>
          </div>

          <Cta href="/checkout" label="Rejoindre la formation" sub="maintenant" />

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
          <h2 className="section-heading">Et si tu pouvais enfin y arriver ?</h2>
          <p className="muted text-center" style={{ maxWidth: 500, margin: "0 auto 26px" }}>
            Apprendre seul, c&apos;est long et décourageant. Cette formation te donne un chemin
            clair, en vidéo, du premier pas jusqu&apos;au résultat.
          </p>
          <ul className="red-list" style={{ maxWidth: 520, margin: "0 auto" }}>
            {site.benefits.map((b) => (
              <li key={b.title}>
                <span className="dot">{b.emoji}</span>
                <span>
                  <strong>{b.title}</strong> — {b.text}
                </span>
              </li>
            ))}
          </ul>
          <div className="text-center mt-3">
            <Cta href="/checkout" label="Rejoindre la formation" sub="maintenant" />
          </div>
        </div>
      </section>

      {/* ===== POUR QUI ===== */}
      <section className="text-center">
        <div className="container">
          <div className="card-dark" style={{ maxWidth: 520, margin: "0 auto" }}>
            <h2 className="section-heading">{site.forWho.title}</h2>
            <ul className="red-list" style={{ textAlign: "left" }}>
              {site.forWho.items.map((item) => (
                <li key={item.highlight}>
                  <span className="dot">{item.emoji}</span>
                  <span>
                    Les <span className="hl">{item.highlight}</span> {item.text}
                  </span>
                </li>
              ))}
            </ul>
            <p className="muted mt-1 small">{site.forWho.note}</p>
          </div>
          <div className="mt-3">
            <Cta href="/checkout" label="Rejoindre la formation" sub="maintenant" />
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
          <ol className="numbered" style={{ maxWidth: 480, margin: "0 auto" }}>
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
                  <span className="dot">{item.emoji}</span>
                  <span>
                    <strong>{item.title}</strong> {item.text}
                  </span>
                </li>
              ))}
            </ul>
            <p className="muted text-center mt-1 small">{site.promise.note}</p>
          </div>
          <div className="text-center mt-3">
            <Cta href="/checkout" label="Rejoindre la formation" sub="maintenant" />
          </div>
        </div>
      </section>

      {/* ===== LES MODULES ===== */}
      <section className="grid-bg">
        <div className="container-wide">
          <p className="muted text-center" style={{ marginBottom: 8 }}>
            Tu vas suivre un parcours clair, étape par étape —{" "}
            <span className="strong-white">même si tu n&apos;as encore rien commencé.</span>
          </p>
          <h2 className="section-heading">Découvre les modules de la formation</h2>
          <div className="modules-grid">
            {site.modules.map((mod) => (
              <div className="module-card" key={mod.title}>
                <div className="cover">{mod.emoji}</div>
                <span className="tag">{mod.tag}</span>
                <h3>{mod.title}</h3>
                <ul>
                  {mod.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OFFRE ===== */}
      <section id="offre" className="text-center">
        <div className="container">
          <h2 className="section-heading">Rejoins la formation maintenant</h2>
          <div className="card-dark" style={{ maxWidth: 420, margin: "0 auto" }}>
            <span className="badge">{site.pricing.badge}</span>
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
                  <span className="dot">✅</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2">
              <Cta href="/checkout" label="Rejoindre la formation" sub="accès immédiat" block />
            </div>
          </div>
          <p className="muted mt-2 small">{site.pricing.paymentNote}</p>
        </div>
      </section>
    </main>
  );
}
