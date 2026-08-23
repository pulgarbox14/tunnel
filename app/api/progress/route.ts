import { NextResponse } from "next/server";
import { getSessionCode, isAdminAuthenticated } from "@/lib/auth";
import { getProgress, setLessonDone } from "@/lib/progress";

async function resolveCode(): Promise<string | null> {
  const code = await getSessionCode();
  if (code) return code;
  return (await isAdminAuthenticated()) ? "ADMIN" : null;
}

/** Progression du membre connecté (vidéos terminées). */
export async function GET() {
  const code = await resolveCode();
  if (!code) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, completed: await getProgress(code) });
}

export async function POST(request: Request) {
  const code = await resolveCode();
  if (!code) return NextResponse.json({ ok: false }, { status: 401 });

  let body: { lessonKey?: string; done?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }
  if (typeof body.lessonKey !== "string" || !/^\d+-\d+$/.test(body.lessonKey)) {
    return NextResponse.json({ ok: false, error: "Leçon invalide." }, { status: 400 });
  }

  const completed = await setLessonDone(code, body.lessonKey, body.done !== false);
  return NextResponse.json({ ok: true, completed });
}
