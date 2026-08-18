import { PaymentTracker } from "@/components/PaymentTracker";
import { site } from "@/content/site";

export const dynamic = "force-dynamic";
export const metadata = { title: `Paiement — ${site.brand}` };

export default async function PaiementPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  return (
    <main className="grid-bg" style={{ minHeight: "80vh" }}>
      <section>
        <div className="container" style={{ maxWidth: 520 }}>
          <div className="funnel-steps">
            <span>1. Commande</span>
            <span>→</span>
            <span className="active">2. Paiement</span>
            <span>→</span>
            <span>3. Accès aux vidéos</span>
          </div>
          <PaymentTracker orderRef={ref} />
        </div>
      </section>
    </main>
  );
}
