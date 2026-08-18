import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { Icon } from "@/components/Icon";
import { site } from "@/content/site";

export const metadata = { title: `Connexion — ${site.brand}` };

export default function ConnexionPage() {
  return (
    <main className="grid-bg" style={{ minHeight: "80vh" }}>
      <div className="login-box card-dark text-center">
        <span className="badge">
          <Icon name="lock" size={13} /> Accès sécurisé
        </span>
        <h1 className="title-red mt-2" style={{ fontSize: "1.4rem" }}>
          Espace Membre
        </h1>
        <p className="muted mt-1 small">
          Entre le code d&apos;accès que tu as reçu par email après ton achat pour
          débloquer tes leçons vidéo.
        </p>
        <LoginForm />
        <p className="muted mt-2 small">
          Pas encore membre ?{" "}
          <Link href="/" style={{ color: "var(--red)", fontWeight: 700 }}>
            Rejoindre le programme
          </Link>
          <br />
          Code perdu ? Contacte-nous, on te le renvoie.
        </p>
      </div>
    </main>
  );
}
