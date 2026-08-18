"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import type { Testimonial } from "@/content/site";

type Tab = "stats" | "videos" | "avis" | "photos";

interface StatsData {
  visits: { total: number; last14: [string, number][] };
  orders: {
    total: number;
    paid: number;
    pending: number;
    failed: number;
    revenue: number;
    recent: {
      ref: string;
      name: string;
      email: string;
      phone: string;
      method: string;
      amount: number;
      status: string;
      accessCode?: string;
      emailSent?: boolean;
      createdAt: number;
    }[];
  };
  codes: {
    code: string;
    name: string;
    email: string;
    devices: number;
    maxDevices: number;
  }[];
}

interface ContentData {
  overrides: Record<string, unknown>;
  defaults: {
    heroVideoUrl: string;
    coachName: string;
    coachPhotos: string[];
    gallery: string[];
    testimonials: Testimonial[];
    modules: { tag: string; title: string; lessons: { title: string; url: string }[] }[];
  };
}

async function uploadImage(file: File): Promise<string> {
  const data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, data }),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error ?? "Échec de l'upload");
  return json.url as string;
}

/** Champ image : URL + bouton d'upload de fichier. */
function ImageField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="img-field">
      <input
        type="text"
        value={value}
        placeholder={placeholder ?? "URL de l'image ou upload →"}
        onChange={(e) => onChange(e.target.value)}
      />
      <label className="btn-ghost upload-btn">
        {busy ? "…" : "📁 Fichier"}
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setBusy(true);
            try {
              onChange(await uploadImage(file));
            } catch (err) {
              alert(String(err));
            } finally {
              setBusy(false);
            }
          }}
        />
      </label>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="img-preview" />
      )}
    </div>
  );
}

export function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("stats");
  const [stats, setStats] = useState<StatsData | null>(null);
  const [content, setContent] = useState<ContentData | null>(null);
  const [saved, setSaved] = useState("");

  // Champs éditables
  const [heroVideo, setHeroVideo] = useState("");
  const [lessonUrls, setLessonUrls] = useState<Record<string, string>>({});
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [coachName, setCoachName] = useState("");
  const [coachPhotos, setCoachPhotos] = useState<string[]>(["", ""]);
  const [gallery, setGallery] = useState<string[]>(["", "", "", ""]);

  const load = useCallback(async () => {
    const [statsRes, contentRes] = await Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/content").then((r) => r.json()),
    ]);
    if (statsRes.ok) setStats(statsRes);
    if (contentRes.ok) {
      setContent(contentRes);
      const o = contentRes.overrides ?? {};
      const d = contentRes.defaults;
      setHeroVideo((o.heroVideoUrl as string) ?? d.heroVideoUrl ?? "");
      const urls: Record<string, string> = {};
      d.modules.forEach((m: ContentData["defaults"]["modules"][0], mi: number) =>
        m.lessons.forEach((l, li) => {
          urls[`${mi}-${li}`] =
            (o.lessonUrls as Record<string, string> | undefined)?.[`${mi}-${li}`] ?? l.url ?? "";
        }),
      );
      setLessonUrls(urls);
      setTestimonials((o.testimonials as Testimonial[]) ?? d.testimonials);
      setCoachName((o.coachName as string) ?? d.coachName);
      setCoachPhotos((o.coachPhotos as string[]) ?? d.coachPhotos);
      setGallery((o.gallery as string[]) ?? d.gallery);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save(patch: Record<string, unknown>) {
    setSaved("");
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const json = await res.json();
    setSaved(json.ok ? "✅ Enregistré ! Le site est à jour." : "❌ Erreur d'enregistrement.");
    if (json.ok) load();
  }

  async function resetCodeDevices(code: string) {
    if (!confirm(`Libérer les appareils du code ${code} ?`)) return;
    await fetch("/api/admin/codes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, action: "reset-devices" }),
    });
    load();
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.refresh();
  }

  const fmtDate = (t: number) =>
    new Date(t).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });

  return (
    <main className="admin-wrap">
      <div className="container-wide">
        <div className="member-header">
          <div>
            <span className="badge badge-green">
              <Icon name="shield" size={13} /> Panel Admin
            </span>
            <h1 className="title-red mt-1" style={{ fontSize: "1.3rem" }}>
              Cap sur monAvenir — Gestion
            </h1>
          </div>
          <button className="btn-ghost" onClick={logout}>
            Se déconnecter
          </button>
        </div>

        <div className="admin-tabs">
          {(
            [
              ["stats", "📊 Statistiques"],
              ["videos", "🎬 Vidéos"],
              ["avis", "⭐ Avis clients"],
              ["photos", "📷 Photos"],
            ] as [Tab, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              className={`admin-tab${tab === key ? " active" : ""}`}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {saved && <p className="muted mt-1">{saved}</p>}

        {/* ===== STATISTIQUES ===== */}
        {tab === "stats" && stats && (
          <div className="mt-2">
            <div className="stat-cards">
              <div className="stat-card">
                <span className="num">{stats.visits.total}</span>
                <span className="label">Visites totales</span>
              </div>
              <div className="stat-card">
                <span className="num">{stats.orders.total}</span>
                <span className="label">Commandes</span>
              </div>
              <div className="stat-card">
                <span className="num text-green">{stats.orders.paid}</span>
                <span className="label">Paiements confirmés</span>
              </div>
              <div className="stat-card">
                <span className="num text-yellow">
                  {stats.orders.revenue.toLocaleString("fr-FR")} F
                </span>
                <span className="label">Revenu encaissé</span>
              </div>
            </div>

            <h2 className="admin-h2">Visites (14 derniers jours)</h2>
            <div className="visits-bars">
              {stats.visits.last14.length === 0 && <p className="muted small">Aucune visite enregistrée pour l&apos;instant.</p>}
              {stats.visits.last14.map(([day, n]) => (
                <div key={day} className="visit-row">
                  <span className="d">{day.slice(5)}</span>
                  <div className="bar" style={{ width: `${Math.min(100, n * 4)}%` }} />
                  <span className="n">{n}</span>
                </div>
              ))}
            </div>

            <h2 className="admin-h2">Dernières commandes</h2>
            <div className="table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Nom</th>
                    <th>Contact</th>
                    <th>Moyen</th>
                    <th>Montant</th>
                    <th>Statut</th>
                    <th>Code</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.orders.recent.map((o) => (
                    <tr key={o.ref}>
                      <td>{fmtDate(o.createdAt)}</td>
                      <td>{o.name}</td>
                      <td>
                        {o.email}
                        <br />
                        {o.phone}
                      </td>
                      <td>{o.method}</td>
                      <td>{o.amount.toLocaleString("fr-FR")} F</td>
                      <td>
                        <span className={`status ${o.status}`}>
                          {o.status === "paid" ? "✅ payé" : o.status === "pending" ? "⏳ en attente" : "❌ échec"}
                        </span>
                      </td>
                      <td className="mono">{o.accessCode ?? "—"}</td>
                      <td>{o.emailSent ? "📬 envoyé" : "—"}</td>
                    </tr>
                  ))}
                  {stats.orders.recent.length === 0 && (
                    <tr>
                      <td colSpan={8} className="muted">
                        Aucune commande pour l&apos;instant.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <h2 className="admin-h2">Codes d&apos;accès</h2>
            <div className="table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Client</th>
                    <th>Appareils</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.codes.map((c) => (
                    <tr key={c.code}>
                      <td className="mono">{c.code}</td>
                      <td>
                        {c.name}
                        <br />
                        {c.email}
                      </td>
                      <td>
                        {c.devices}/{c.maxDevices}
                      </td>
                      <td>
                        <button className="btn-ghost small-btn" onClick={() => resetCodeDevices(c.code)}>
                          Libérer les appareils
                        </button>
                      </td>
                    </tr>
                  ))}
                  {stats.codes.length === 0 && (
                    <tr>
                      <td colSpan={4} className="muted">
                        Aucun code émis pour l&apos;instant.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== VIDÉOS ===== */}
        {tab === "videos" && content && (
          <div className="mt-2">
            <p className="muted small">
              Colle un <strong>lien Vimeo</strong> (ex : vimeo.com/123456) ou le{" "}
              <strong>script &lt;iframe&gt;</strong> complet — les deux fonctionnent, tout est
              converti automatiquement.
            </p>

            <h2 className="admin-h2">Vidéo de vente (page d&apos;accueil)</h2>
            <input
              type="text"
              value={heroVideo}
              placeholder="Lien ou script iframe de la vidéo de vente"
              onChange={(e) => setHeroVideo(e.target.value)}
            />

            {content.defaults.modules.map((mod, mi) => (
              <div key={mod.tag}>
                <h2 className="admin-h2">
                  {mod.tag} — {mod.title}
                </h2>
                {mod.lessons.map((lesson, li) => (
                  <div className="lesson-row" key={li}>
                    <label>{lesson.title}</label>
                    <input
                      type="text"
                      value={lessonUrls[`${mi}-${li}`] ?? ""}
                      placeholder="Lien ou script iframe Vimeo"
                      onChange={(e) =>
                        setLessonUrls({ ...lessonUrls, [`${mi}-${li}`]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>
            ))}

            <button
              className="btn-cta mt-2"
              onClick={() => save({ heroVideoUrl: heroVideo, lessonUrls })}
            >
              Enregistrer les vidéos
              <small>mise à jour immédiate</small>
            </button>
          </div>
        )}

        {/* ===== AVIS ===== */}
        {tab === "avis" && content && (
          <div className="mt-2">
            <p className="muted small">
              Les avis s&apos;affichent en <strong>carrousel</strong> sur la page d&apos;accueil.
              Type « image » = capture WhatsApp · type « vimeo » = vidéo témoignage.
            </p>
            {testimonials.map((t, i) => (
              <div className="card-dark mt-2 avis-editor" key={i}>
                <div className="avis-row">
                  <input
                    type="text"
                    value={t.name}
                    placeholder="Nom (ex : Élève 1, Avis WhatsApp)"
                    onChange={(e) => {
                      const next = [...testimonials];
                      next[i] = { ...t, name: e.target.value };
                      setTestimonials(next);
                    }}
                  />
                  <select
                    value={t.type}
                    onChange={(e) => {
                      const next = [...testimonials];
                      next[i] = { ...t, type: e.target.value as Testimonial["type"] };
                      setTestimonials(next);
                    }}
                  >
                    <option value="image">📷 Capture WhatsApp</option>
                    <option value="vimeo">🎬 Vidéo Vimeo</option>
                  </select>
                  <button
                    className="btn-ghost small-btn"
                    onClick={() => setTestimonials(testimonials.filter((_, j) => j !== i))}
                  >
                    🗑 Supprimer
                  </button>
                </div>
                <input
                  type="text"
                  className="mt-1"
                  value={t.caption}
                  placeholder="Légende (ex : Classé dans la filière de son 1er choix)"
                  onChange={(e) => {
                    const next = [...testimonials];
                    next[i] = { ...t, caption: e.target.value };
                    setTestimonials(next);
                  }}
                />
                {t.type === "image" ? (
                  <ImageField
                    value={t.src ?? ""}
                    onChange={(v) => {
                      const next = [...testimonials];
                      next[i] = { ...t, src: v };
                      setTestimonials(next);
                    }}
                    placeholder="Capture WhatsApp : URL ou upload →"
                  />
                ) : (
                  <input
                    type="text"
                    className="mt-1"
                    value={t.src ?? ""}
                    placeholder="Lien ou script iframe Vimeo du témoignage"
                    onChange={(e) => {
                      const next = [...testimonials];
                      next[i] = { ...t, src: e.target.value };
                      setTestimonials(next);
                    }}
                  />
                )}
              </div>
            ))}
            <div className="mt-2" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                className="btn-ghost"
                onClick={() =>
                  setTestimonials([
                    ...testimonials,
                    { name: "", caption: "", type: "image", src: "" },
                  ])
                }
              >
                ➕ Ajouter un avis
              </button>
              <button className="btn-cta" onClick={() => save({ testimonials })}>
                Enregistrer les avis
                <small>mise à jour immédiate</small>
              </button>
            </div>
          </div>
        )}

        {/* ===== PHOTOS ===== */}
        {tab === "photos" && content && (
          <div className="mt-2">
            <h2 className="admin-h2">Formateur</h2>
            <input
              type="text"
              value={coachName}
              placeholder="Nom du formateur"
              onChange={(e) => setCoachName(e.target.value)}
            />
            {coachPhotos.map((p, i) => (
              <ImageField
                key={i}
                value={p}
                onChange={(v) => {
                  const next = [...coachPhotos];
                  next[i] = v;
                  setCoachPhotos(next);
                }}
                placeholder={`Photo du formateur ${i + 1}`}
              />
            ))}

            <h2 className="admin-h2">Galerie « communauté » (4 photos)</h2>
            {gallery.map((p, i) => (
              <ImageField
                key={i}
                value={p}
                onChange={(v) => {
                  const next = [...gallery];
                  next[i] = v;
                  setGallery(next);
                }}
                placeholder={`Photo ${i + 1}`}
              />
            ))}

            <button
              className="btn-cta mt-2"
              onClick={() => save({ coachName, coachPhotos, gallery })}
            >
              Enregistrer les photos
              <small>mise à jour immédiate</small>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
