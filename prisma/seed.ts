/**
 * Creates the first WAJIBU administrator.
 *
 *   ADMIN_EMAIL     defaults to Admin1@wajibu.uk
 *   ADMIN_PASSWORD  REQUIRED – never commit it. The admin is asked to change it at first sign-in.
 *   ADMIN_NAME      defaults to "Samuel Orie"
 *
 * Run:  npm run db:seed
 * Idempotent: if the admin already exists nothing is overwritten unless RESET_ADMIN_PASSWORD=1.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "Admin1@wajibu.uk").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Samuel Orie";

  if (!password || password.length < 10) {
    throw new Error("Set ADMIN_PASSWORD (min 10 characters) in the environment before seeding.");
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    if (process.env.RESET_ADMIN_PASSWORD === "1") {
      await db.user.update({
        where: { email },
        data: { passwordHash: await bcrypt.hash(password, 12), mustChangePassword: true, active: true },
      });
      console.log(`Admin ${email}: password reset (must change at next sign-in).`);
    } else {
      console.log(`Admin ${email} already exists – nothing to do.`);
    }
    return;
  }

  await db.user.create({
    data: {
      email,
      name,
      role: "ADMIN",
      passwordHash: await bcrypt.hash(password, 12),
      mustChangePassword: true,
    },
  });
  console.log(`Created admin ${email}. They must change the password at first sign-in.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
