import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "sb_admin_session";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET environment variable is not set");
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getAuthSecret()).update(payload).digest("hex");
}

export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = `admin.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [subject, expiresAtRaw, signature] = parts;
  if (subject !== "admin") return false;

  const payload = `${subject}.${expiresAtRaw}`;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  const expiresAt = Number(expiresAtRaw);
  return Number.isFinite(expiresAt) && Date.now() <= expiresAt;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true as const,
    secure: true as const,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function passwordsMatch(candidate: string, expected: string): boolean {
  const a = createHash("sha256").update(candidate).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}
