"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** Bouton « leçon terminée » — la progression débloque le bonus. */
export function LessonDone({
  lessonKey,
  initialDone,
}: {
  lessonKey: string;
  initialDone: boolean;
}) {
  const router = useRouter();
  const [done, setDone] = useState(initialDone);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    const next = !done;
    setDone(next);
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonKey, done: next }),
      });
      router.refresh();
    } catch {
      setDone(!next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      className={`lesson-done${done ? " done" : ""}`}
      onClick={toggle}
      disabled={busy}
      type="button"
    >
      {done ? "✓ Vidéo terminée" : "Marquer comme terminée"}
    </button>
  );
}
