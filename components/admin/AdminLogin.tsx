"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";

export function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const password = new FormData(e.currentTarget).get("password");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok) {
        router.refresh();
      } else {
        setError(data.error ?? "Mot de passe incorrect.");
        setLoading(false);
      }
    } catch {
      setError("Connexion impossible.");
      setLoading(false);
    }
  }

  return (
    <main className="grid-bg" style={{ minHeight: "85vh" }}>
      <div className="login-box card-dark text-center">
        <span className="badge">
          <Icon name="shield" size={13} /> Espace de gestion
        </span>
        <h1 className="title-red mt-2" style={{ fontSize: "1.3rem" }}>
          Panel Admin
        </h1>
        <p className="muted mt-1 small">Accès réservé à l&apos;équipe.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <input name="password" type="password" placeholder="Mot de passe admin" required />
          </div>
          {error && (
            <p className="error-msg icon-line">
              <Icon name="alert-triangle" size={13} /> {error}
            </p>
          )}
          <button type="submit" className="btn-cta btn-block" disabled={loading}>
            {loading ? "Vérification…" : "Entrer"}
            <small>panel de gestion</small>
          </button>
        </form>
      </div>
    </main>
  );
}
