import { site } from "@/content/site";
import { Cta } from "@/components/Cta";
import { Icon } from "@/components/Icon";

export const metadata = {
  title: `${site.bonus.title} — ${site.brand}`,
  description: site.bonus.subtitle,
};

export default function BonusPage() {
  const b = site.bonus;
  return (
    <main>
      {/* ===== HERO BONUS ===== */}
      <section className="grid-bg text-center">
        <div className="container">
          <span className="badge badge-yellow">
            <Icon name="gift" size={13} /> {b.badge}
          </span>
          <h1 className="title-red mt-2">{b.title}</h1>
          <p className="muted mt-1" style={{ maxWidth: 540, margin: "12px auto 0" }}>
            {b.subtitle}
          </p>
          <div className="mt-3">
            <Cta href="/checkout?produit=bonus" label="Obtenir le bonus" sub="maintenant" />
          </div>
        </div>
      </section>

      {/* ===== CE QUE TU VAS APPRENDRE ===== */}
      <section>
        <div className="container">
          <div className="card-dark" style={{ maxWidth: 560, margin: "0 auto" }}>
            <h2 className="section-heading">Ce que le bonus t&apos;apporte</h2>
            <ul className="red-list divided" style={{ textAlign: "left" }}>
              {b.points.map((p) => (
                <li key={p}>
                  <span className="dot dot-green">
                    <Icon name="check" size={13} />
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <p className="muted small mt-1 icon-line">
              <Icon name="alert-triangle" size={13} /> Règle d&apos;or : on ne paie jamais une
              admission à un intermédiaire. On paie un établissement ou un service public, contre
              un reçu.
            </p>
          </div>
        </div>
      </section>

      {/* ===== LES CAPSULES DU BONUS ===== */}
      <section className="grid-bg">
        <div className="container-wide">
          <h2 className="section-heading">Les capsules du bonus</h2>
          <div className="modules-grid">
            {b.lessons.map((lesson) => (
              <div className="module-card" key={lesson.title}>
                <div className="cover">
                  <Icon name="gift" size={42} className="cover-icon" />
                </div>
                <h3 style={{ paddingTop: 14 }}>{lesson.title}</h3>
                <ul>
                  <li>{lesson.description}</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OFFRE BONUS ===== */}
      <section className="text-center">
        <div className="container">
          <h2 className="section-heading">Obtiens le bonus maintenant</h2>
          <div className="card-dark" style={{ maxWidth: 420, margin: "0 auto" }}>
            <span className="badge badge-yellow">{b.badge}</span>
            <div className="mt-2 price-old">
              {b.pricing.oldPrice} {b.pricing.currency}
            </div>
            <div className="price-now">
              {b.pricing.price} {b.pricing.currency}
            </div>
            <p className="muted small">{b.pricing.note}</p>
            <ul className="red-list mt-2" style={{ textAlign: "left" }}>
              <li>
                <span className="dot dot-green">
                  <Icon name="check" size={14} />
                </span>
                <span>Les 4 capsules vidéo du bonus</span>
              </li>
              <li>
                <span className="dot dot-green">
                  <Icon name="check" size={14} />
                </span>
                <span>Accompagnement dans tes démarches</span>
              </li>
              <li>
                <span className="dot dot-green">
                  <Icon name="check" size={14} />
                </span>
                <span>Espace membre sécurisé à vie</span>
              </li>
            </ul>
            <div className="mt-2">
              <Cta href="/checkout?produit=bonus" label="Obtenir le bonus" sub="accès immédiat" block />
            </div>
          </div>
          <p className="muted mt-2 small">
            Le bonus est indépendant : tu peux le prendre avec ou sans le programme principal.
          </p>
        </div>
      </section>
    </main>
  );
}
