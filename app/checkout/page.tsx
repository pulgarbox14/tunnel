import { CheckoutForm } from "@/components/CheckoutForm";
import { site } from "@/content/site";

export const metadata = { title: `Commande — ${site.brand}` };

export default function CheckoutPage() {
  return (
    <main className="grid-bg" style={{ minHeight: "80vh" }}>
      <section>
        <div className="container" style={{ maxWidth: 520 }}>
          <div className="funnel-steps">
            <span className="active">1. Commande</span>
            <span>→</span>
            <span>2. Paiement</span>
            <span>→</span>
            <span>3. Accès aux vidéos</span>
          </div>

          <div className="card-dark text-center">
            <span className="badge badge-yellow">{site.pricing.badge}</span>
            <h1 className="title-red mt-2" style={{ fontSize: "1.4rem" }}>
              Finalise ta commande
            </h1>
            <div className="mt-1 price-old">
              {site.pricing.oldPrice} {site.pricing.currency}
            </div>
            <div className="price-now">
              {site.pricing.price} {site.pricing.currency}
            </div>
            <p className="muted small">{site.pricing.note}</p>

            <CheckoutForm />

            <p className="muted small mt-2">
              🔒 Paiement 100 % sécurisé. Après validation, tu reçois ton code
              d&apos;accès à l&apos;espace membre.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
