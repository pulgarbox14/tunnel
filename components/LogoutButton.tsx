"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/connexion");
    router.refresh();
  }

  return (
    <button className="btn-ghost" onClick={handleLogout}>
      Se déconnecter
    </button>
  );
}
