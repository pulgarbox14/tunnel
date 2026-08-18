"use client";

import { useEffect } from "react";

/** Compte une visite par session de navigation (pour les stats du panel). */
export function TrackVisit() {
  useEffect(() => {
    if (sessionStorage.getItem("cap-tracked")) return;
    sessionStorage.setItem("cap-tracked", "1");
    fetch("/api/track", { method: "POST" }).catch(() => {});
  }, []);
  return null;
}
