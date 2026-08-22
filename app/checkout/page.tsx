import { CheckoutForm } from "@/components/CheckoutForm";
import { site } from "@/content/site";

export const metadata = { title: `Commande — ${site.brand}` };

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ produit?: string }>;
}) {
  const { produit } = await searchParams;
  const isBonus = produit === "bonus";
  const pricing = isBonus ? site.bonus.pricing : site.pricing;
  const productTitle = isBonus ? site.bonus.title : "Le programme complet";

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
            <span className="badge badge-yellow">
              {isBonus ? site.bonus.badge : site.pricing.badge}
            </span>
            <h1 className="title-red mt-2" style={{ fontSize: "1.4rem" }}>
              Finalise ta commande
            </h1>
            <p className="muted mt-1 small strong-white">{productTitle}</p>
            <div className="mt-1 price-old">
              {pricing.oldPrice} {pricing.currency}
            </div>
            <div className="price-now">
              {pricing.price} {pricing.currency}
            </div>
            <p className="muted small">{pricing.note}</p>

            <CheckoutForm
              product={isBonus ? "bonus" : "programme"}
              priceLabel={`${pricing.price} ${pricing.currency}`}
            />

            <p className="muted small mt-2">
              🔒 Paiement 100 % sécurisé via FeexPay. Après validation, tu reçois ton code
              d&apos;accès personnel par email.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
