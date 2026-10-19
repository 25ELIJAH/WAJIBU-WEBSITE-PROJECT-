import "server-only";
import { db } from "./db";
import { sendMail } from "./mail";

/** In-app notification for every user of an organisation (plus email). */
export async function notifyOrganisation(organisationId: string, title: string, body = "", href = "") {
  const users = await db.user.findMany({ where: { organisationId, active: true } });
  await Promise.all(
    users.map(async (u) => {
      await db.notification.create({ data: { userId: u.id, title, body, href } });
      await sendMail({ to: u.email, subject: title, text: `${body}\n\nWAJIBU Charity Portal` });
    })
  );
}

/** In-app notification for every WAJIBU admin, plus an email to the admin mailbox. */
export async function notifyAdmins(title: string, body = "", href = "") {
  const admins = await db.user.findMany({ where: { role: "ADMIN", active: true } });
  await Promise.all(admins.map((u) => db.notification.create({ data: { userId: u.id, title, body, href } })));
  const to = process.env.NOTIFY_EMAIL ?? "Admin1@wajibu.uk";
  await sendMail({ to, subject: title, text: `${body}\n\nWAJIBU Charity Portal` });
}

export const audit = (actorId: string | null, action: string, detail = "") =>
  db.auditLog.create({ data: { actorId, action, detail } });
