"use client";

import { useRef } from "react";
import { Icon } from "@/components/Icon";
import type { Testimonial } from "@/content/site";

/**
 * Nature réelle du média, déduite du fichier lui-même.
 *
 * Le menu « Photo / Vidéo » du panel admin n'est qu'une indication : si
 * une vidéo est déposée dans un bloc resté sur « Photo », on l'affiche
 * quand même comme une vidéo (et inversement).
 */
function mediaKind(src: string, declared: Testimonial["type"]): "video" | "image" | "iframe" {
  if (src.startsWith("/api/video/") || /\.(mp4|webm|m4v)$/i.test(src)) return "video";
  if (src.startsWith("/uploads/") || /\.(jpe?g|png|webp|gif)$/i.test(src)) return "image";
  return declared === "vimeo" ? "iframe" : "image";
}

/** Carrousel horizontal des avis / résultats d'élèves. */
export function ResultsCarousel({ items }: { items: Testimonial[] }) {
  const track = useRef<HTMLDivElement>(null);

  function scroll(dir: number) {
    track.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }

  return (
    <div className="carousel-wrap">
      <button className="carousel-arrow left" onClick={() => scroll(-1)} aria-label="Précédent">
        ‹
      </button>
      <div className="carousel-track" ref={track}>
        {items.map((t, i) => {
          const kind = t.src ? mediaKind(t.src, t.type) : null;
          return (
            <div className="result-card carousel-item" key={i}>
              <p className="caption">
                <strong>{t.name}</strong>
                {t.caption ? <> : « {t.caption} »</> : null}
              </p>
              <div className={`media${kind === "image" ? " whatsapp" : ""}`}>
                {t.src && kind === "video" ? (
                  <video controls controlsList="nodownload" src={t.src} />
                ) : t.src && kind === "iframe" ? (
                  <iframe src={t.src} allowFullScreen title={t.name} />
                ) : t.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.src} alt={`Avis de ${t.name}`} loading="lazy" />
                ) : (
                  <span className="icon-line">
                    <Icon name={t.type === "vimeo" ? "video" : "award"} size={16} />
                    {t.type === "vimeo" ? "Vidéo à venir" : "Avis à venir"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <button className="carousel-arrow right" onClick={() => scroll(1)} aria-label="Suivant">
        ›
      </button>
    </div>
  );
}
