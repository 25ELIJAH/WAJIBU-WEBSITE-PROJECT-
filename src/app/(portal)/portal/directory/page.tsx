import Link from "next/link";
import { db } from "@/lib/portal/db";
import { requireUser } from "@/lib/portal/session";
import { parseSectors } from "@/lib/portal/constants";
import { getActiveSectors } from "@/lib/portal/sectors";
import { addToShortlist } from "../actions";

export const metadata = { title: "Charity Directory" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 24;
// SQLite's LIKE is already case-insensitive; PostgreSQL needs mode: "insensitive".
const ci = /^postgres/i.test(process.env.DATABASE_URL ?? "") ? ({ mode: "insensitive" } as const) : {};

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string; q?: string; page?: string; msg?: string }>;
}) {
  const user = await requireUser("COMPANY", "ADMIN");
  const sp = await searchParams;
  const sectors = await getActiveSectors();
  const active = sectors.find((s) => s.key === sp.sector)?.key ?? null;
  const q = (sp.q ?? "").trim().slice(0, 80);
  const page = Math.max(parseInt(sp.page ?? "1", 10) || 1, 1);

  const rows = await db.charityProfile.findMany({
    where: {
      published: true,
      organisation: {
        status: "APPROVED",
        ...(q ? { OR: [{ name: { contains: q, ...ci } }, { country: { contains: q, ...ci } }] } : {}),
      },
      ...(active ? { sectors: { contains: active } } : {}), // coarse; exact match below
    },
    include: { organisation: true },
    // Featured first, then by compliance level, then A–Z
    orderBy: [{ featured: "desc" }, { complianceLevel: "desc" }, { organisation: { name: "asc" } }],
  });
  const matches = active ? rows.filter((c) => parseSectors(c.sectors).includes(active)) : rows;
  const pages = Math.max(Math.ceil(matches.length / PAGE_SIZE), 1);
  const current = Math.min(page, pages);
  const charities = matches.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const shortlisted =
    user.role === "COMPANY"
      ? new Set((await db.shortlist.findMany({ where: { companyId: user.organisationId! }, select: { charityId: true } })).map((s) => s.charityId))
      : new Set<string>();

  const href = (over: { sector?: string | null; page?: number }) => {
    const p = new URLSearchParams();
    const s = over.sector === undefined ? active : over.sector;
    if (s) p.set("sector", s);
    if (q) p.set("q", q);
    if (over.page && over.page > 1) p.set("page", String(over.page));
    const qs = p.toString();
    return `/portal/directory${qs ? `?${qs}` : ""}`;
  };

  return (
    <main className="pt-main" id="main">
      <p className="pt-eyebrow">Charity Directory</p>
      <h1 className="pt-title">Find a charity to support</h1>
      <p className="pt-sub">
        Browse vetted charities and filter by sector. Select several, add them to your shortlist and WAJIBU will help you
        connect.
      </p>
      {sp.msg === "none" && <div className="pt-msg info">Please select at least one charity first.</div>}

      <form action="/portal/directory" method="get" className="pt-filter" role="search" aria-label="Search charities">
        {active && <input type="hidden" name="sector" value={active} />}
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name or country"
          aria-label="Search by name or country"
          className="pt-search"
          maxLength={80}
        />
        <button type="submit" className="pt-btn small dark">Search</button>
        {q && <Link href={href({ page: 1 }).replace(/([?&])q=[^&]*&?/, "$1").replace(/[?&]$/, "")} className="pt-chip">Clear search</Link>}
      </form>

      <nav className="pt-filter" aria-label="Filter by sector">
        <Link href={href({ sector: null })} className={`pt-chip${!active ? " on" : ""}`}>All sectors</Link>
        {sectors.map((s) => (
          <Link key={s.key} href={href({ sector: s.key })} className={`pt-chip${active === s.key ? " on" : ""}`}>
            {s.label}
          </Link>
        ))}
      </nav>

      {charities.length === 0 ? (
        <div className="pt-empty">
          No charities to show{active || q ? " for this search" : " yet"}. New organisations are added as WAJIBU approves them.
        </div>
      ) : (
        <form action={addToShortlist}>
          <input type="hidden" name="back" value="/portal/directory" />
          <p className="pt-hint" style={{ marginBottom: 14 }}>
            {matches.length} charit{matches.length === 1 ? "y" : "ies"}
          </p>
          <div className="pt-grid cols3">
            {charities.map((c) => (
              <div key={c.id} className="pt-charity">
                {c.featured && <span className="pt-featured">Featured</span>}
                <h3><Link href={`/portal/charity/${c.id}`}>{c.organisation.name}</Link></h3>
                <p className="pt-country">{c.organisation.country}</p>
                {user.role === "COMPANY" &&
                  (shortlisted.has(c.id) ? (
                    <p className="pt-pick"><span className="pt-pill ok">On your shortlist</span></p>
                  ) : (
                    <label className="pt-pick">
                      <input type="checkbox" name="charityId" value={c.id} /> Select for shortlist
                    </label>
                  ))}
              </div>
            ))}
          </div>

          {pages > 1 && (
            <nav className="pt-pager" aria-label="Pages">
              {current > 1 && <Link href={href({ page: current - 1 })} className="pt-chip">&larr; Previous</Link>}
              <span className="pt-hint">Page {current} of {pages}</span>
              {current < pages && <Link href={href({ page: current + 1 })} className="pt-chip">Next &rarr;</Link>}
            </nav>
          )}

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
