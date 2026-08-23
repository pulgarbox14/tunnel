"use client";

import { useRef } from "react";
import { Icon } from "@/components/Icon";
import type { Testimonial } from "@/content/site";

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
        {items.map((t, i) => (
          <div className="result-card carousel-item" key={i}>
            <p className="caption">
              <strong>{t.name}</strong>
              {t.caption ? <> : « {t.caption} »</> : null}
            </p>
            <div className={`media${t.type === "image" ? " whatsapp" : ""}`}>
              {t.src ? (
                t.type === "vimeo" ? (
                  t.src.startsWith("/api/video/") || t.src.endsWith(".mp4") ? (
                    <video controls controlsList="nodownload" src={t.src} />
                  ) : (
                    <iframe src={t.src} allowFullScreen title={t.name} />
                  )
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.src} alt={`Avis de ${t.name}`} loading="lazy" />
                )
              ) : (
                <span className="icon-line">
                  <Icon name={t.type === "vimeo" ? "video" : "smartphone"} size={16} />
                  {t.type === "vimeo" ? "Vidéo à venir" : "Avis à venir"}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-arrow right" onClick={() => scroll(1)} aria-label="Suivant">
        ›
      </button>
    </div>
  );
}
