import { NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/store";

interface Stats {
  total: number;
  days: Record<string, number>;
}

/** Comptage des visites (appelé une fois par session de navigation). */
export async function POST() {
  const stats = await readJson<Stats>("stats.json", { total: 0, days: {} });
  const day = new Date().toISOString().slice(0, 10);
  stats.total += 1;
  stats.days[day] = (stats.days[day] ?? 0) + 1;
  await writeJson("stats.json", stats);
  return NextResponse.json({ ok: true });
}
