// Chooses the right Prisma schema from DATABASE_URL, so the same code runs on SQLite (local) and
// PostgreSQL (production) with no manual edits.
//
//   node scripts/db.mjs generate   – prisma generate
//   node scripts/db.mjs deploy     – prisma migrate deploy (production)
//   node scripts/db.mjs build      – generate, migrate (if Postgres), then next build
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// Load .env for local runs (hosts inject real environment variables instead).
const envFile = path.join(process.cwd(), ".env");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"#\r\n]*)"?\s*$/i);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}

const url = process.env.DATABASE_URL ?? "";
const postgres = /^postgres(ql)?:\/\//i.test(url);
const schemaArg = postgres ? " --schema prisma/postgres/schema.prisma" : "";
const run = (cmd) => execSync(cmd, { stdio: "inherit", env: process.env });

const task = process.argv[2];
if (task === "generate") {
  run(`npx prisma generate${schemaArg}`);
} else if (task === "deploy") {
  if (!postgres) throw new Error("db deploy needs a postgres:// DATABASE_URL. Locally use `npx prisma migrate dev`.");
  run(`npx prisma migrate deploy${schemaArg}`);
} else if (task === "build") {
  run(`npx prisma generate${schemaArg}`);
  // On a hosted build with a Postgres database, apply pending migrations automatically.
  if (postgres) run(`npx prisma migrate deploy${schemaArg}`);
  run("npx next build");
} else {
  throw new Error("Usage: node scripts/db.mjs generate|deploy|build");
}
