import Link from "next/link";
import { db } from "@/lib/portal/db";
import { requireUser } from "@/lib/portal/session";
import { SECTORS, SECTOR_KEYS } from "@/lib/portal/constants";
import { addToShortlist } from "../actions";

export const metadata = { title: "Charity Directory" };
export const dynamic = "force-dynamic";

export default async function DirectoryPage({ searchParams }: { searchParams: Promise<{ sector?: string; msg?: string }> }) {
  const user = await requireUser("COMPANY", "ADMIN");
  const { sector, msg } = await searchParams;
  const active = sector && SECTOR_KEYS.includes(sector) ? sector : null;

  const charities = await db.charityProfile.findMany({
    where: {
      published: true,
      organisation: { status: "APPROVED" },
      ...(active ? { sectors: { contains: active } } : {}),
    },
    include: { organisation: true },
    // Featured first, then by compliance level, then A–Z
    orderBy: [{ featured: "desc" }, { complianceLevel: "desc" }, { organisation: { name: "asc" } }],
  });

  const shortlisted = user.role === "COMPANY"
    ? new Set((await db.shortlist.findMany({ where: { companyId: user.organisationId! }, select: { charityId: true } })).map((s) => s.charityId))
    : new Set<string>();

  return (
    <main className="pt-main">
      <p className="pt-eyebrow">Charity Directory</p>
      <h1 className="pt-title">Find a charity to support</h1>
      <p className="pt-sub">
        Browse vetted charities and filter by sector. Select several, add them to your shortlist and WAJIBU will help you
        connect.
      </p>
      {msg === "none" && <div className="pt-msg info">Please select at least one charity first.</div>}

      <nav className="pt-filter" aria-label="Filter by sector">
        <Link href="/portal/directory" className={`pt-chip${!active ? " on" : ""}`}>All sectors</Link>
        {SECTORS.map((s) => (
          <Link key={s.key} href={`/portal/directory?sector=${s.key}`} className={`pt-chip${active === s.key ? " on" : ""}`}>
            {s.label}
          </Link>
        ))}
      </nav>

      {charities.length === 0 ? (
        <div className="pt-empty">No charities to show{active ? " in this sector" : " yet"}. New organisations are added as WAJIBU approves them.</div>
      ) : (
        <form action={addToShortlist}>
          <input type="hidden" name="back" value="/portal/directory" />
          <div className="pt-grid cols3">
            {charities.map((c) => (
              <div key={c.id} className="pt-charity">
                {c.featured && <span className="pt-featured">Featured</span>}
                <h3><Link href={`/portal/charity/${c.id}`}>{c.organisation.name}</Link></h3>
                <p className="pt-country">{c.organisation.country}</p>
                {user.role === "COMPANY" && (
                  shortlisted.has(c.id) ? (
                    <p className="pt-pick"><span className="pt-pill ok">On your shortlist</span></p>
                  ) : (
                    <label className="pt-pick">
                      <input type="checkbox" name="charityId" value={c.id} /> Select for shortlist
                    </label>
                  )
                )}
              </div>
            ))}
          </div>
          {user.role === "COMPANY" && (
            <div className="pt-sticky">
              <div className="pt-bar">
                <span>Tick one or more charities, then add them to your dashboard.</span>
                <button type="submit" className="pt-btn">Add selected to shortlist</button>
              </div>
            </div>
          )}
        </form>
      )}
    </main>
  );
}
