import Link from "next/link";
import { requireUser } from "@/lib/portal/session";
import { RANGES, charityReport, normaliseRange } from "@/lib/portal/reports";

export const metadata = { title: "Reports" };
export const dynamic = "force-dynamic";

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  await requireUser("ADMIN");
  const { range } = await searchParams;
  const key = normaliseRange(range);
  const rows = await charityReport(key);

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
        <a href={`/api/portal/reports?range=${key}`} className="pt-btn small dark" download>Download CSV</a>
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
