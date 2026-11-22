/**
 * Fills the portal with clearly-labelled DEMO data so WAJIBU can show stakeholders a populated directory
 * before the real charities are loaded.
 *
 *   npm run db:demo          create the demo organisations (and print their sign-in details once)
 *   npm run db:demo:clean    remove everything the demo created
 *
 * Safety: every demo organisation name ends with " (Demo)" and every demo login ends with @demo.wajibu.test,
 * so cleaning is exact. The script refuses to run against a PostgreSQL (production-style) database or when
 * NODE_ENV=production unless ALLOW_DEMO=1 is set deliberately.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomInt } from "node:crypto";

const db = new PrismaClient();
const SUFFIX = " (Demo)";
const DOMAIN = "@demo.wajibu.test";

function guard() {
  const looksLikeProduction = process.env.NODE_ENV === "production" || /^postgres/i.test(process.env.DATABASE_URL ?? "");
  if (looksLikeProduction && process.env.ALLOW_DEMO !== "1") {
    throw new Error("Refusing to create demo data on a production-style database. Set ALLOW_DEMO=1 if you really mean it.");
  }
}

function password() {
  const U = "ABCDEFGHJKLMNPQRSTUVWXYZ", L = "abcdefghijkmnpqrstuvwxyz", D = "23456789";
  const pick = (s: string) => s[randomInt(s.length)];
  const c = [pick(U), pick(L), pick(D)];
  while (c.length < 14) c.push(pick(U + L + D));
  for (let i = c.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c.join("");
}

async function clean() {
  const orgs = await db.organisation.deleteMany({ where: { name: { endsWith: SUFFIX } } }); // cascades profiles, users, activity
  const users = await db.user.deleteMany({ where: { email: { endsWith: DOMAIN } } });
  console.log(`Removed ${orgs.count} demo organisations and ${users.count} demo logins.`);
}

const CHARITIES = [
  { name: "Green Canopy Kenya", country: "Kenya", number: "DEMO-0001", sectors: "environment,education", level: 5, featured: true, published: true, login: "green-canopy",
    summary: "Community-led reforestation and school tree-nurseries across the Rift Valley. Plants 200,000 trees a year and employs local rangers." },
  { name: "Hope Haven Children's Home", country: "Ghana", number: "DEMO-0002", sectors: "orphanage,social-welfare", level: 4, featured: false, published: true, login: "hope-haven",
    summary: "Residential care, schooling and counselling for 60 children in Accra, with a family-reunification programme." },
  { name: "Bright Futures Schools Trust", country: "Uganda", number: "DEMO-0003", sectors: "education", level: 3, featured: false, published: true,
    summary: "Builds and equips primary schools in rural districts and funds teacher training." },
  { name: "Clean Water Initiative", country: "Nigeria", number: "DEMO-0004", sectors: "environment,social-welfare", level: 4, featured: false, published: true,
    summary: "Boreholes, filtration and hygiene education for villages without safe drinking water." },
  { name: "Safe Harbour Community Centre", country: "United Kingdom", number: "DEMO-0005", sectors: "social-welfare", level: 2, featured: false, published: true,
    summary: "Food bank, advice clinic and youth club serving a high-need London neighbourhood." },
  { name: "Little Stars Orphanage", country: "Malawi", number: "DEMO-0006", sectors: "orphanage,education", level: 1, featured: false, published: false,
    summary: "Draft profile – still being reviewed by WAJIBU, so it is not visible to companies." },
];

async function main() {
  guard();
  await clean();
  if (process.argv[2] === "clean") return;

  const out: string[] = [];
  const mkUser = async (email: string, name: string, role: "CHARITY" | "COMPANY") => {
    const pw = password();
    out.push(`${role.padEnd(7)} ${email}   ${pw}`);
    return { email, name, role, passwordHash: await bcrypt.hash(pw, 12), mustChangePassword: false };
  };

  const charityIds: string[] = [];
  for (const c of CHARITIES) {
    const org = await db.organisation.create({
      data: {
        type: "CHARITY",
        name: c.name + SUFFIX,
        country: c.country,
        charity: { create: { registeredNumber: c.number, summary: c.summary, sectors: c.sectors, complianceLevel: c.level, featured: c.featured, published: c.published } },
        ...(c.login ? { users: { create: await mkUser(`${c.login}${DOMAIN}`, `${c.name} Administrator`, "CHARITY") } } : {}),
      },
      include: { charity: true },
    });
    charityIds.push(org.charity!.id);
  }

  const companies = [
    { name: "Northbridge Capital", country: "United Kingdom", login: "northbridge", industry: "Asset management" },
    { name: "Evergreen Foods Ltd", country: "United Kingdom", login: "evergreen", industry: "Food & beverage" },
  ];
  const companyIds: string[] = [];
  for (const co of companies) {
    const org = await db.organisation.create({
      data: {
        type: "COMPANY",
        name: co.name + SUFFIX,
        country: co.country,
        company: { create: { industry: co.industry, values: "Climate action; children's education" } },
        users: { create: await mkUser(`${co.login}${DOMAIN}`, `${co.name} Administrator`, "COMPANY") },
      },
    });
    companyIds.push(org.id);
  }

  // a little activity so Reports and the dashboards are not empty
  for (const [ci, ch] of [[0, 0], [0, 0], [0, 1], [1, 0], [1, 3]] as const)
    await db.profileView.create({ data: { charityId: charityIds[ch], companyId: companyIds[ci] } });
  await db.shortlist.create({ data: { companyId: companyIds[0], charityId: charityIds[0] } });
  await db.shortlist.create({ data: { companyId: companyIds[0], charityId: charityIds[1] } });
  await db.connection.create({ data: { companyId: companyIds[0], charityId: charityIds[0], note: "Interested in a multi-year partnership." } });

  console.log("\nDemo data created. Sign-in details (shown once – these are demo accounts only):\n");
  console.log(out.join("\n"));
  console.log("\nRemove everything later with: npm run db:demo:clean\n");
}

main()
  .catch((e) => {
    console.error(e.message ?? e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
