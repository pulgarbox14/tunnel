import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { site } from "@/content/site";
import { Icon } from "@/components/Icon";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.brand} — ${site.hero.title}`,
  description: site.hero.subtitle,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={poppins.className}>
        <div className="topbar">{site.topbar}</div>
        <div className="flag-stripe" />
        {children}
        <footer>
          <p>© 2026 {site.brand} — Tous droits réservés</p>
          <p className="mt-1">
            <a href="/connexion" className="icon-line">
              <Icon name="key" size={12} /> Déjà membre ? Accéder à mes vidéos
            </a>
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
