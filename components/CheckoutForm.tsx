"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FeexPay from "react-sdk-feexpay";
import { site } from "@/content/site";
import { Icon } from "@/components/Icon";

type FeexpayConfig = { shopId: string; token: string; mode: "LIVE" | "SANDBOX" };

/**
 * Commande en deux temps.
 *
 * 1. Le client laisse ses coordonnées → la commande est créée côté serveur
 *    (c'est lui qui fixe le montant).
 * 2. Le bouton officiel FeexPay ouvre la page de paiement : le client y
 *    choisit son réseau (MTN, Moov, Celtiis, carte…) et saisit le numéro
 *    à débiter. Le numéro demandé ici est celui de WhatsApp, pour le
 *    contact — il n'intervient pas dans le paiement.
 */
export function CheckoutForm({
  product = "programme",
  priceLabel,
}: {
  product?: "programme" | "bonus";
  priceLabel?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<{
    ref: string;
    amount: number;
    name: string;
    email: string;
    feexpay: FeexpayConfig;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: form.get("phone"), product }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Une erreur est survenue. Réessaie.");
        setLoading(false);
        return;
      }
      // Mode simulation (FeexPay non configuré) : commande validée directement
      if (data.redirect) {
        router.push(data.redirect);
        return;
      }
      setOrder({ ref: data.ref, amount: data.amount, name, email, feexpay: data.feexpay });
      setLoading(false);
    } catch {
      setError("Connexion impossible. Vérifie ta connexion internet.");
      setLoading(false);
    }
  }

  /** Retour du paiement FeexPay → confirmation côté serveur. */
  async function handlePayment(result: {
    reference: string;
    status: string;
    transaction_id: string;
    reseau: string;
  }) {
    if (!order) return;
    setError("");
    try {
      const res = await fetch("/api/checkout/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ref: order.ref,
          reference: result.reference,
          transaction_id: result.transaction_id,
          status: result.status,
          reseau: result.reseau,
        }),
      });
      const data = await res.json();
      if (data.ok && data.redirect) {
        router.push(data.redirect);
      } else {
        setError(data.error ?? "Le paiement n'a pas abouti. Réessaie.");
      }
    } catch {
      setError(
        `Paiement enregistré mais confirmation impossible. Note ta référence ${order.ref} et contacte-nous.`,
      );
    }
  }

  // ===== Étape 2 : paiement sur FeexPay =====
  if (order) {
    return (
      <div className="mt-2">
        <div className="order-recap">
          <p className="small">
            Commande <strong className="mono">{order.ref}</strong>
          </p>
          <p className="small muted">
            {order.name} · {order.email}
          </p>
        </div>

        {error && (
          <p className="error-msg icon-line">
            <Icon name="alert-triangle" size={13} /> {error}
          </p>
        )}

        <FeexPay
          amount={order.amount}
          token={order.feexpay.token}
          id={order.feexpay.shopId}
          mode={order.feexpay.mode}
          currency="XOF"
          description={`Commande ${order.ref}`}
          reference={order.ref}
          customId={order.ref}
          first_name={order.name}
          email={order.email}
          buttonText={`Payer ${order.amount.toLocaleString("fr-FR")} FCFA`}
          buttonClass="btn-cta btn-block"
          callback={handlePayment}
        />

        <button
          type="button"
          className="btn-ghost btn-block mt-1"
          onClick={() => {
            setOrder(null);
            setError("");
          }}
        >
          Modifier mes informations
        </button>
      </div>
    );
  }

  // ===== Étape 1 : coordonnées =====
  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="form-field">
        <label htmlFor="name">Nom complet</label>
        <input id="name" name="name" type="text" placeholder="Ton nom complet" required />
      </div>
      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="ton@email.com" required />
      </div>
      <div className="form-field">
        <label htmlFor="phone">Numéro WhatsApp</label>
        <input id="phone" name="phone" type="tel" placeholder="+229 01 00 00 00 00" required />
      </div>

      {error && (
        <p className="error-msg icon-line">
          <Icon name="alert-triangle" size={13} /> {error}
        </p>
      )}

      <button type="submit" className="btn-cta btn-block" disabled={loading}>
        {loading ? "Un instant…" : "Continuer vers le paiement"}
        <small>
          {priceLabel ?? `${site.pricing.price} ${site.pricing.currency}`} — paiement unique
        </small>
      </button>
    </form>
  );
}
