"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/portal/db";
import { createSession, destroySession, getCurrentUser } from "@/lib/portal/session";
import { hashPassword, passwordProblem, verifyPassword } from "@/lib/portal/password";
import { audit } from "@/lib/portal/notify";

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
    data: { passwordHash: await hashPassword(next), mustChangePassword: false },
  });
  await audit(user.id, "password.changed");
  redirect(user.role === "ADMIN" ? "/admin?pw=1" : "/portal?pw=1");
}
