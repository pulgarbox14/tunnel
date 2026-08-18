import { promises as fs } from "fs";
import path from "path";

/**
 * Petit stockage JSON sur disque (dossier data/ à la racine).
 * Suffisant pour un serveur Node classique (VPS, next start).
 * NB : sur un hébergeur serverless (Vercel), prévoir une base de données.
 */

const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readJson<T>(name: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, name), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson(name: string, value: unknown): Promise<void> {
  await ensureDir();
  const file = path.join(DATA_DIR, name);
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2), "utf8");
  await fs.rename(tmp, file);
}
