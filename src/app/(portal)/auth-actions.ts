"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/portal/db";
import { createSession, destroySession, getCurrentUser } from "@/lib/portal/session";
import { hashPassword, passwordProblem, verifyPassword } from "@/lib/portal/password";
import { audit } from "@/lib/portal/notify";
import { sendMail } from "@/lib/portal/mail";
import { siteOrigin } from "@/lib/portal/origin";
import { RESET_TTL_MS, generateToken, hashToken, sessionCutoff } from "@/lib/portal/token";
import { findValidReset } from "@/lib/portal/reset";

// Throttle: failed sign-ins are already recorded in the audit log, so the limit is enforced from the
// database and holds across server instances and restarts.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

const recentFailures = (email: string) =>
  db.auditLog.count({
    where: { action: "login.failed", detail: email, createdAt: { gt: new Date(Date.now() - WINDOW_MS) } },
  });

// Compared against when the email is unknown, so response time does not reveal which emails exist.
const DUMMY_HASH = "$2b$12$C6UzMDM.H6dfI/f/IKcEeO5PzW9kQoWl0GJ8o1eQeC8Nn3b7FZ8W6";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
  next: z.string().optional(),
});

const safeNext = (next?: string) =>
  next && /^\/(portal|admin)(\/[\w\-./?=&%]*)?$/.test(next) && !next.includes("//") ? next : null;

export async function login(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") ?? undefined,
  });
  if (!parsed.success) redirect("/login?error=invalid");
  const { email, password, next } = parsed.data;

  if ((await recentFailures(email)) >= MAX_ATTEMPTS) redirect("/login?error=locked");

  const user = await db.user.findUnique({ where: { email }, include: { organisation: true } });
  const ok =
    !!user &&
    user.active &&
    (!user.organisation || user.organisation.status === "APPROVED") &&
    (await verifyPassword(password, user.passwordHash));
  if (!user) await verifyPassword(password, DUMMY_HASH);

  if (!ok || !user) {
    await audit(null, "login.failed", email);
    redirect("/login?error=invalid");
  }

  await db.auditLog.deleteMany({ where: { action: "login.failed", detail: email } });
  await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await createSession(user.id);
  await audit(user.id, "login.ok");

  if (user.mustChangePassword) redirect("/portal/account?first=1");
  redirect(safeNext(next) ?? (user.role === "ADMIN" ? "/admin" : "/portal"));
}

export async function logout() {
  const user = await getCurrentUser();
  if (user) await audit(user.id, "logout");
  await destroySession();
  redirect("/login");
}

const changeSchema = z.object({
  current: z.string().min(1),
  next: z.string().min(1),
  confirm: z.string().min(1),
});

export async function changePassword(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const parsed = changeSchema.safeParse({
    current: formData.get("current"),
    next: formData.get("next"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) redirect("/portal/account?error=missing");
  const { current, next, confirm } = parsed.data;

  if (next !== confirm) redirect("/portal/account?error=mismatch");
  if (passwordProblem(next)) redirect("/portal/account?error=weak");
  if (!(await verifyPassword(current, user.passwordHash))) redirect("/portal/account?error=current");
  if (current === next) redirect("/portal/account?error=same");

  await db.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(next), mustChangePassword: false, sessionsValidFrom: sessionCutoff() },
  });
  await createSession(user.id); // every other session is now invalid; keep this browser signed in
  await audit(user.id, "password.changed");
  redirect(user.role === "ADMIN" ? "/admin?pw=1" : "/portal?pw=1");
}


/* ───────────────────────── forgot / reset password ───────────────────────── */

const MAX_RESETS_PER_HOUR = 3;

/**
 * "Forgot password": emails a one-time link. The response is identical whether or not the address has an
 * account, so this cannot be used to discover which emails are registered.
 */
export async function requestReset(formData: FormData) {
  const parsed = z.string().trim().toLowerCase().email().max(200).safeParse(formData.get("email"));
  if (parsed.success) {
    const user = await db.user.findUnique({ where: { email: parsed.data }, include: { organisation: true } });
    const eligible = !!user && user.active && (!user.organisation || user.organisation.status === "APPROVED");
    if (user && eligible) {
      const recent = await db.passwordReset.count({
        where: { userId: user.id, createdAt: { gt: new Date(Date.now() - 60 * 60 * 1000) } },
      });
      if (recent < MAX_RESETS_PER_HOUR) {
        const token = generateToken();
        await db.passwordReset.create({
          data: { userId: user.id, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + RESET_TTL_MS) },
        });
        const link = `${await siteOrigin()}/reset-password?token=${token}`;
        await sendMail({
          to: user.email,
          subject: "Reset your WAJIBU Charity Portal password",
          text:
            `Hello ${user.name},\n\nWe received a request to reset your WAJIBU Charity Portal password.\n\n` +
            `Choose a new password (this link works once and expires in 1 hour):\n${link}\n\n` +
            `If you did not ask for this, you can ignore this email – your password has not changed.\n\nWAJIBU`,
        });
        await audit(user.id, "password.reset.requested");
      }
    }
  }
  redirect("/forgot-password?sent=1");
}

export async function resetWithToken(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const back = (error: string) => redirect(`/reset-password?token=${encodeURIComponent(token)}&error=${error}`);

  const reset = await findValidReset(token);
  if (!reset) redirect("/reset-password?error=invalid");
  if (!next || !confirm) back("missing");
  if (next !== confirm) back("mismatch");
  if (passwordProblem(next)) back("weak");

  const user = reset.user;
  await db.$transaction([
    db.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(next), mustChangePassword: false, sessionsValidFrom: sessionCutoff() },
    }),
    // this link is spent, and so is every other outstanding link for the account
    db.passwordReset.updateMany({ where: { userId: user.id, usedAt: null }, data: { usedAt: new Date() } }),
    // a user who was locked out by failed attempts can sign in again
    db.auditLog.deleteMany({ where: { action: "login.failed", detail: user.email } }),
  ]);
  await audit(user.id, "password.reset.completed");
  await sendMail({
    to: user.email,
    subject: "Your WAJIBU Charity Portal password was changed",
    text: `Hello ${user.name},\n\nYour password was just changed using a reset link. If this was not you, contact WAJIBU immediately at Admin1@wajibu.uk.\n\nWAJIBU`,
  });
  redirect("/login?reset=1");
}
