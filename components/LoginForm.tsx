"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const code = new FormData(e.currentTarget).get("code");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.ok) {
        router.push("/espace-membre");
        router.refresh();
      } else {
        setError(data.error ?? "Code incorrect.");
        setLoading(false);
      }
    } catch {
      setError("Connexion impossible. Réessaie.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-field">
        <input
          name="code"
          type="password"
          placeholder="Ton code d'accès"
          autoComplete="off"
          required
        />
      </div>
      {error && <p className="error-msg">❌ {error}</p>}
      <button type="submit" className="btn-cta btn-block" disabled={loading}>
        {loading ? "Vérification…" : "Débloquer mes vidéos"}
        <small>accès membre</small>
      </button>
    </form>
  );
}
