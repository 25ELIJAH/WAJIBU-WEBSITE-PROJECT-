import Link from "next/link";
import { db } from "@/lib/portal/db";
import { requireUser } from "@/lib/portal/session";
import { createOrganisation } from "../actions";
import FlashBox from "../FlashBox";

export const metadata = { title: "Organisations" };
export const dynamic = "force-dynamic";

export default async function OrganisationsPage({ searchParams }: { searchParams: Promise<{ type?: string; msg?: string; error?: string }> }) {
  await requireUser("ADMIN");
  const { type, msg, error } = await searchParams;
  const filter = type === "CHARITY" || type === "COMPANY" ? type : null;

  const orgs = await db.organisation.findMany({
    where: filter ? { type: filter } : {},
    include: { users: { select: { name: true, email: true, lastLoginAt: true } }, charity: { select: { published: true, featured: true } } },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });

  return (
    <main className="pt-main" id="main">
      <p className="pt-eyebrow">Directory management</p>
      <h1 className="pt-title">Organisations</h1>
      <FlashBox />
      {msg === "deleted" && <div className="pt-msg ok">Organisation deleted.</div>}
      {error && <div className="pt-msg err">{error === "email" ? "That administrator email already has an account." : "Please check the details and try again."}</div>}

      <div className="pt-subnav">
        <Link href="/admin/organisations" className={`pt-chip${!filter ? " on" : ""}`}>All</Link>
        <Link href="/admin/organisations?type=CHARITY" className={`pt-chip${filter === "CHARITY" ? " on" : ""}`}>Charities</Link>
        <Link href="/admin/organisations?type=COMPANY" className={`pt-chip${filter === "COMPANY" ? " on" : ""}`}>Companies</Link>
      </div>

      {orgs.length === 0 ? (
        <div className="pt-empty">No organisations yet. Approve a request or add one below.</div>
      ) : (
        <div className="pt-tablewrap">
          <table className="pt-table">
            <thead>
              <tr><th>Name</th><th>Type</th><th>Country</th><th>Administrator</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {orgs.map((o) => (
                <tr key={o.id}>
                  <td><strong>{o.name}</strong></td>
                  <td>{o.type === "CHARITY" ? "Charity" : "Company"}</td>
                  <td>{o.country}</td>
                  <td>{o.users[0] ? <>{o.users[0].name}<br /><span className="pt-hint">{o.users[0].email}</span></> : <span className="pt-hint">None</span>}</td>
                  <td>
                    <span className={`pt-pill ${o.status === "APPROVED" ? "ok" : "bad"}`}>{o.status === "APPROVED" ? "Active" : "Suspended"}</span>
                    {o.charity && (
                      <>
                        {" "}<span className={`pt-pill ${o.charity.published ? "ok" : "pending"}`}>{o.charity.published ? "Published" : "Draft"}</span>
                        {o.charity.featured && <> <span className="pt-pill new">Featured</span></>}
                      </>
                    )}
                  </td>
                  <td><Link href={`/admin/organisations/${o.id}`} className="pt-btn small dark">Manage</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <details className="pt-card" style={{ marginTop: 32 }}>
        <summary style={{ cursor: "pointer", fontWeight: 600, color: "var(--gd)" }}>Add an organisation directly</summary>
        <form action={createOrganisation} className="pt-form" style={{ marginTop: 18 }}>
          <div className="pt-grid cols2">
            <div className="pt-field">
              <label>Type</label>
              <select name="type" defaultValue="CHARITY"><option value="CHARITY">Charity</option><option value="COMPANY">Company</option></select>
            </div>
            <div className="pt-field"><label>Organisation name</label><input name="name" required /></div>
            <div className="pt-field"><label>Country</label><input name="country" required /></div>
            <div className="pt-field"><label>Registered charity number (charities)</label><input name="registeredNumber" /></div>
            <div className="pt-field"><label>Administrator name</label><input name="adminName" required /></div>
            <div className="pt-field"><label>Administrator email</label><input name="adminEmail" type="email" required /></div>
          </div>
          <div><button type="submit" className="pt-btn">Create organisation &amp; administrator</button></div>
        </form>
      </details>
    </main>
  );
}
