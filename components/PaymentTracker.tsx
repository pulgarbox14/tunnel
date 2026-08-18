"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/Icon";

/** Suit le statut du paiement Mobile Money (push USSD) et redirige quand payé. */
export function PaymentTracker({ orderRef }: { orderRef: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"pending" | "paid" | "failed">("pending");

  useEffect(() => {
    let active = true;
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/status?ref=${orderRef}`);
        const data = await res.json();
        if (!active || !data.ok) return;
        setStatus(data.status);
        if (data.status === "paid") {
          clearInterval(timer);
          router.push(`/merci?ref=${orderRef}`);
        }
        if (data.status === "failed") clearInterval(timer);
      } catch {
        /* on réessaie au prochain tick */
      }
    }, 3000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [orderRef, router]);

  if (status === "failed") {
    return (
      <div className="card-dark text-center">
        <span className="badge">
          <Icon name="alert-triangle" size={13} /> Paiement non abouti
        </span>
        <h1 className="title-red mt-2" style={{ fontSize: "1.3rem" }}>
          Le paiement a échoué
        </h1>
        <p className="muted mt-1">
          La transaction a été refusée ou annulée. Aucun montant n&apos;a été débité.
        </p>
        <div className="mt-2">
          <Link href="/checkout" className="btn-cta btn-block">
            Réessayer le paiement
            <small>retour à la commande</small>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card-dark text-center">
      <span className="badge badge-yellow">
        <Icon name="smartphone" size={13} /> Confirme sur ton téléphone
      </span>
      <h1 className="title-red mt-2" style={{ fontSize: "1.3rem" }}>
        Paiement en cours…
      </h1>
      <div className="spinner mt-2" aria-hidden="true" />
      <p className="muted mt-2">
        Un message de confirmation vient d&apos;être envoyé sur ton téléphone.
        <br />
        <span className="strong-white">Compose ton code PIN Mobile Money pour valider.</span>
      </p>
      <p className="muted small mt-1">
        Cette page se met à jour automatiquement dès que le paiement est confirmé.
      </p>
    </div>
  );
}
