import Link from "next/link";
import { Icon } from "@/components/Icon";
import { site } from "@/content/site";

export const metadata = { title: `Merci — ${site.brand}` };

export default function MerciPage() {
  return (
    <main className="grid-bg" style={{ minHeight: "80vh" }}>
      <section>
        <div className="container" style={{ maxWidth: 520 }}>
          <div className="funnel-steps">
            <span>1. Commande</span>
            <span>→</span>
            <span>2. Paiement</span>
            <span>→</span>
            <span className="active">3. Accès aux vidéos</span>
          </div>

          <div className="card-dark text-center">
            <span className="badge">
              <Icon name="check" size={13} /> Commande confirmée
            </span>
            <h1 className="title-red mt-2" style={{ fontSize: "1.5rem" }}>
              Félicitations, tu es dedans !
            </h1>
            <p className="muted mt-1">
              Ton accès au programme est en cours d&apos;activation. Tu vas recevoir
              ton <span className="strong-white">code d&apos;accès par email</span> dans
              quelques minutes.
            </p>
            <p className="muted mt-1 small">
              Pense à vérifier tes spams si tu ne vois rien arriver.
            </p>
            <div className="mt-2">
              <Link href="/connexion" className="btn-cta btn-block">
                Accéder à mes vidéos
                <small>espace membre</small>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
