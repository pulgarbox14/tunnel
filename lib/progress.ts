import { readJson, writeJson } from "./store";

/**
 * Progression des membres : leçons marquées comme terminées, par code d'accès.
 * Sert à débloquer l'offre bonus quand toute la formation est terminée.
 */

type ProgressMap = Record<string, string[]>;

const FILE = "progress.json";

export async function getProgress(code: string): Promise<string[]> {
  const all = await readJson<ProgressMap>(FILE, {});
  return all[code] ?? [];
}

export async function setLessonDone(
  code: string,
  lessonKey: string,
  done: boolean,
): Promise<string[]> {
  const all = await readJson<ProgressMap>(FILE, {});
  const list = new Set(all[code] ?? []);
  if (done) list.add(lessonKey);
  else list.delete(lessonKey);
  all[code] = [...list];
  await writeJson(FILE, all);
  return all[code];
}
