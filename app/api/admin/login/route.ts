import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  createSessionToken,
  passwordsMatch,
  sessionCookieOptions,
} from "@/lib/auth";

export async function POST(req: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: "Admin login is not configured." },
      { status: 500 },
    );
  }

  const { password } = (await req.json()) as { password?: string };
  if (!password || !passwordsMatch(password, adminPassword)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, createSessionToken(), sessionCookieOptions());

  return NextResponse.json({ ok: true });
}
