"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { site } from "@/content/site";
import { Icon } from "@/components/Icon";

export function CheckoutForm() {
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
      phone: form.get("phone"),
      method: form.get("method"),
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
        <label htmlFor="phone">Téléphone (Mobile Money)</label>
        <input id="phone" name="phone" type="tel" placeholder="+225 07 00 00 00 00" required />
      </div>

      <div className="form-field">
        <label>Moyen de paiement</label>
        <div className="payment-methods">
          {site.paymentMethods.map((m, i) => (
            <label key={m.id}>
              <input type="radio" name="method" value={m.id} defaultChecked={i === 0} required />
              <span className="icon-line">
                <Icon name={m.icon} size={16} /> {m.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <p className="error-msg icon-line">
          <Icon name="alert-triangle" size={13} /> {error}
        </p>
      )}

      <button type="submit" className="btn-cta btn-block" disabled={loading}>
        {loading ? "Traitement…" : "Valider ma commande"}
        <small>
          {site.pricing.price} {site.pricing.currency} — paiement unique
        </small>
      </button>
    </form>
  );
}
