import { isAdminAuthenticated } from "@/lib/auth";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

/**
 * PANEL ADMIN — URL secrète, aucun lien depuis le site.
 * Accès : https://ton-site.com/gestion-cap-x7k9
 * (pour changer l'URL : renommer le dossier app/gestion-cap-x7k9)
 */

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Panel de gestion",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();
  return authed ? <AdminDashboard /> : <AdminLogin />;
}
