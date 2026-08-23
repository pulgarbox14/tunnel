import Link from "next/link";
import { BonusLoginForm } from "@/components/BonusLoginForm";
import { Icon } from "@/components/Icon";
import { site } from "@/content/site";

export const metadata = {
  title: `Connexion bonus — ${site.brand}`,
  robots: { index: false, follow: false },
};

/** Porte d'entrée SÉPARÉE de l'espace bonus : demande le code bonus. */
export default function ConnexionBonusPage() {
  return (
    <main className="grid-bg" style={{ minHeight: "80vh" }}>
      <div className="login-box card-dark text-center">
        <span className="badge badge-yellow">
          <Icon name="gift" size={13} /> Espace bonus
        </span>
        <h1 className="title-red mt-2" style={{ fontSize: "1.3rem" }}>
          {site.bonus.title}
        </h1>
        <p className="muted mt-1 small">
          Entre le <span className="strong-white">code bonus</span> que tu as reçu par email
          après ton achat de l&apos;accompagnement ({site.bonus.pricing.price}{" "}
          {site.bonus.pricing.currency}).
        </p>
        <BonusLoginForm />
        <p className="muted mt-2 small">
          Pas encore le bonus ?{" "}
          <Link href="/bonus" style={{ color: "var(--red)", fontWeight: 700 }}>
            Découvrir l&apos;accompagnement
          </Link>
          <br />
          Code perdu ? Contacte-nous, on te le renvoie.
        </p>
      </div>
    </main>
  );
}
