import type { Metadata } from "next";
import { site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  title: `${site.brand} — ${site.hero.title}`,
  description: site.hero.subtitle,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <div className="topbar">{site.topbar}</div>
        {children}
        <footer>
          <p>© 2026 {site.brand} — Tous droits réservés</p>
          <p className="mt-1">
            <a href="/connexion">🔑 Déjà membre ? Accéder à mes vidéos</a>
          </p>
          <p className="mt-1">
            <a href="#">Mentions légales</a> · <a href="#">CGV</a> ·{" "}
            <a href="#">Confidentialité</a>
          </p>
        </footer>
      </body>
    </html>
  );
}
