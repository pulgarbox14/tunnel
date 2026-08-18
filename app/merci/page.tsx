import Link from "next/link";
import { Icon } from "@/components/Icon";
import { site } from "@/content/site";
import { findOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";
export const metadata = { title: `Merci — ${site.brand}` };

export default async function MerciPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const order = ref ? await findOrder(ref) : undefined;
  const paid = order?.status === "paid";

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
            <span className="badge badge-green">
              <Icon name="check" size={13} /> {paid ? "Paiement confirmé" : "Commande reçue"}
            </span>
            <h1 className="title-red mt-2" style={{ fontSize: "1.5rem" }}>
              Félicitations{order ? `, ${order.name.split(" ")[0]}` : ""} !
            </h1>

            {paid && order?.accessCode ? (
              <>
                <p className="muted mt-1">Voici ton code d&apos;accès personnel :</p>
                <div className="access-code-box mt-1">{order.accessCode}</div>
                {order.emailSent ? (
                  <p className="muted small mt-1">
                    📬 Une copie a été envoyée à <span className="strong-white">{order.email}</span>.
                  </p>
                ) : (
                  <p className="muted small mt-1">
                    Note bien ce code : c&apos;est ta clé d&apos;accès aux vidéos.
                  </p>
                )}
                <p className="muted small mt-1">
                  ⚠️ Ce code est <span className="strong-white">personnel</span> — il se lie à ton
                  appareil à la première connexion et ne peut pas être partagé.
                </p>
              </>
            ) : (
              <p className="muted mt-1">
                Ton paiement est en cours de confirmation. Tu recevras ton{" "}
                <span className="strong-white">code d&apos;accès par email</span> dès validation.
              </p>
            )}

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
