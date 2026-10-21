import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { db } from "./db";
import type { Role } from "./constants";

export const SESSION_COOKIE = "wajibu_session";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    if (process.env.NODE_ENV === "production") throw new Error("SESSION_SECRET must be set (min 32 characters).");
    return new TextEncoder().encode("dev-only-secret-change-me-dev-only-secret");
  }
  return new TextEncoder().encode(s);
}

export async function createSession(userId: string) {
  const token = await new SignJWT({ uid: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret());
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

/** The signed-in user, re-read from the database so suspended or deleted accounts lose access immediately. */
export async function getCurrentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const user = await db.user.findUnique({
      where: { id: String(payload.uid) },
      include: { organisation: true },
    });
    if (!user || !user.active) return null;
    // A password change/reset signs out every older session.
    if (user.sessionsValidFrom && (payload.iat ?? 0) < user.sessionsValidFrom.getTime() / 1000) return null;
    if (user.organisation && user.organisation.status !== "APPROVED") return null;
    return user;
  } catch {
    return null;
  }
}

/** Require a signed-in user with one of the given roles; otherwise redirect. */
export async function requireUser(...roles: Role[]) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.mustChangePassword) redirect("/portal/account?first=1");
  if (roles.length && !roles.includes(user.role as Role)) redirect(user.role === "ADMIN" ? "/admin" : "/portal");
  return user;
}

/** Like requireUser, but does not force the first-login password change (used by that page itself). */
export async function requireUserAllowPasswordChange() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
