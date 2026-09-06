"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { site } from "@/content/site";
import { Icon } from "@/components/Icon";

/** Réseaux Mobile Money gérés par l'API FeexPay. */
const NETWORKS = site.paymentMethods.filter((m) => m.id !== "card");

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      whatsapp: form.get("whatsapp"),
      phone: form.get("phone"),
      method: form.get("method"),
      product,
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        router.push(data.redirect ?? "/merci");
      } else {
        setError(data.error ?? "Une erreur est survenue. Réessaie.");
        setLoading(false);
      }
    } catch {
      setError("Connexion impossible. Vérifie ta connexion internet.");
      setLoading(false);
    }
  }

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
        <label htmlFor="whatsapp">Numéro WhatsApp</label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          placeholder="+229 01 00 00 00 00"
          required
        />
      </div>

      <div className="form-field">
        <label>Réseau Mobile Money</label>
        <div className="payment-methods">
          {NETWORKS.map((m, i) => (
            <label key={m.id}>
              <input type="radio" name="method" value={m.id} defaultChecked={i === 0} required />
              <span className="icon-line">
                <Icon name={m.icon} size={16} /> {m.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="phone">Numéro à débiter</label>
        <input id="phone" name="phone" type="tel" placeholder="01 97 00 00 00" required />
      </div>

      {error && (
        <p className="error-msg icon-line">
          <Icon name="alert-triangle" size={13} /> {error}
        </p>
      )}

      <button type="submit" className="btn-cta btn-block" disabled={loading}>
        {loading ? "Envoi de la demande…" : "Valider ma commande"}
        <small>
          {priceLabel ?? `${site.pricing.price} ${site.pricing.currency}`} — paiement unique
        </small>
      </button>
    </form>
  );
}
