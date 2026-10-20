import Link from "next/link";
import { db } from "@/lib/portal/db";
import { requireUser } from "@/lib/portal/session";

export const metadata = { title: "Reports" };
export const dynamic = "force-dynamic";

const RANGES: Record<string, { label: string; days: number | null }> = {
  "7": { label: "Last 7 days", days: 7 },
  "30": { label: "Last 30 days", days: 30 },
  "90": { label: "Last 90 days", days: 90 },
  all: { label: "All time", days: null },
};

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  await requireUser("ADMIN");
  const { range } = await searchParams;
  const key = range && RANGES[range] ? range : "30";
  const since = RANGES[key].days ? new Date(Date.now() - RANGES[key].days! * 86400000) : null;
  const when = since ? { createdAt: { gte: since } } : {};

  const charities = await db.charityProfile.findMany({
    include: { organisation: true },
    orderBy: { organisation: { name: "asc" } },
  });

  const [views, shortlists, conns] = await Promise.all([
    db.profileView.groupBy({ by: ["charityId"], where: when, _count: { _all: true } }),
    db.shortlist.groupBy({ by: ["charityId"], where: when, _count: { _all: true } }),
    db.connection.groupBy({ by: ["charityId"], where: when, _count: { _all: true } }),
  ]);
  // distinct companies per charity (a company viewing ten times counts once)
  const distinct = await db.profileView.findMany({ where: when, distinct: ["charityId", "companyId"], select: { charityId: true, companyId: true } });

  const n = (rows: { charityId: string; _count: { _all: number } }[]) => new Map(rows.map((r) => [r.charityId, r._count._all]));
  const V = n(views), S = n(shortlists), C = n(conns);
  const U = new Map<string, number>();
  distinct.forEach((d) => U.set(d.charityId, (U.get(d.charityId) ?? 0) + 1));

  const rows = charities
    .map((c) => ({
      id: c.id,
      orgId: c.organisationId,
      name: c.organisation.name,
      country: c.organisation.country,
      published: c.published,
      views: V.get(c.id) ?? 0,
      companies: U.get(c.id) ?? 0,
      shortlists: S.get(c.id) ?? 0,
      connections: C.get(c.id) ?? 0,
    }))
    .sort((a, b) => b.views - a.views || a.name.localeCompare(b.name));

  const total = (k: "views" | "shortlists" | "connections") => rows.reduce((s, r) => s + r[k], 0);

  return (
    <main className="pt-main" id="main">
      <p className="pt-eyebrow">Insight</p>
      <h1 className="pt-title">Reports</h1>
      <p className="pt-sub">How many companies viewed, shortlisted and asked to connect with each charity.</p>

      <div className="pt-subnav">
        {Object.entries(RANGES).map(([k, v]) => (
          <Link key={k} href={`/admin/reports?range=${k}`} className={`pt-chip${key === k ? " on" : ""}`}>{v.label}</Link>
        ))}
      </div>

      <div className="pt-grid cols3" style={{ marginBottom: 28 }}>
        <div className="pt-card"><div className="pt-stat">{total("views")}</div><div className="pt-stat-l">Profile views</div></div>
        <div className="pt-card"><div className="pt-stat">{total("shortlists")}</div><div className="pt-stat-l">Shortlist adds</div></div>
        <div className="pt-card"><div className="pt-stat">{total("connections")}</div><div className="pt-stat-l">Connection requests</div></div>
      </div>

      {rows.length === 0 ? (
        <div className="pt-empty">No charities yet.</div>
      ) : (
        <div className="pt-tablewrap">
          <table className="pt-table">
            <thead>
              <tr><th>Charity</th><th>Country</th><th>Views</th><th>Companies viewed</th><th>Shortlisted</th><th>Connections</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <Link href={`/admin/organisations/${r.orgId}`} style={{ textDecoration: "underline" }}>{r.name}</Link>
                    {!r.published && <> <span className="pt-pill pending">Draft</span></>}
                  </td>
                  <td>{r.country}</td>
                  <td>{r.views}</td>
                  <td>{r.companies}</td>
                  <td>{r.shortlists}</td>
                  <td>{r.connections}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
