import Link from "next/link";
import { db } from "@/lib/portal/db";
import { requireUser } from "@/lib/portal/session";
import { updateConnection } from "../actions";

export const metadata = { title: "Connections" };
export const dynamic = "force-dynamic";

const LABEL: Record<string, string> = { NEW: "New", IN_PROGRESS: "In progress", CLOSED: "Closed" };

export default async function ConnectionsPage({ searchParams }: { searchParams: Promise<{ status?: string; msg?: string }> }) {
  await requireUser("ADMIN");
  const { status, msg } = await searchParams;
  const filter = status && LABEL[status] ? status : null;

  const rows = await db.connection.findMany({
    where: filter ? { status: filter } : {},
    include: { company: true, charity: { include: { organisation: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <main className="pt-main">
      <p className="pt-eyebrow">Matching</p>
      <h1 className="pt-title">Connection requests</h1>
      <p className="pt-sub">A company selected a charity &ndash; WAJIBU takes over. Update the status as you progress.</p>
      {msg === "saved" && <div className="pt-msg ok">Saved.</div>}

      <div className="pt-subnav">
        <Link href="/admin/connections" className={`pt-chip${!filter ? " on" : ""}`}>All</Link>
        {Object.entries(LABEL).map(([k, v]) => (
          <Link key={k} href={`/admin/connections?status=${k}`} className={`pt-chip${filter === k ? " on" : ""}`}>{v}</Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="pt-empty">No connection requests{filter ? " with this status" : " yet"}.</div>
      ) : (
        <div className="pt-grid">
          {rows.map((r) => (
            <section key={r.id} className="pt-card">
              <div className="pt-row" style={{ justifyContent: "space-between" }}>
                <h3 style={{ fontSize: 20 }}>
                  {r.company.name} <span style={{ color: "var(--gold)" }}>→</span>{" "}
                  <Link href={`/admin/organisations/${r.charity.organisationId}`} style={{ textDecoration: "underline" }}>{r.charity.organisation.name}</Link>
                </h3>
                <span className={`pt-pill ${r.status === "NEW" ? "new" : r.status === "CLOSED" ? "" : "ok"}`}>{LABEL[r.status]}</span>
              </div>
              <p className="pt-country" style={{ margin: "4px 0 10px" }}>
                {r.company.country} → {r.charity.organisation.country} · requested {r.createdAt.toLocaleString("en-GB")}
              </p>
              {r.note && <p style={{ margin: "0 0 12px", fontSize: 14 }}><strong>Company note:</strong> {r.note}</p>}
              <form action={updateConnection} className="pt-form">
                <input type="hidden" name="connectionId" value={r.id} />
                <div className="pt-grid cols2">
                  <div className="pt-field">
                    <label>Status</label>
                    <select name="status" defaultValue={r.status}>
                      <option value="NEW">New</option>
                      <option value="IN_PROGRESS">In progress</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                  <div className="pt-field">
                    <label>WAJIBU internal note</label>
                    <input name="adminNote" defaultValue={r.adminNote} maxLength={2000} />
                  </div>
                </div>
                <div><button type="submit" className="pt-btn small">Update</button></div>
              </form>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
