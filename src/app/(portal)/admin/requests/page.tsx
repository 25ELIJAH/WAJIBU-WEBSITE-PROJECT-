import { db } from "@/lib/portal/db";
import { requireUser } from "@/lib/portal/session";
import Link from "next/link";
import { approveRequest, declineDeletion, rejectRequest } from "../actions";
import FlashBox from "../FlashBox";

export const metadata = { title: "Access requests" };
export const dynamic = "force-dynamic";

export default async function RequestsPage({ searchParams }: { searchParams: Promise<{ error?: string; msg?: string; all?: string }> }) {
  await requireUser("ADMIN");
  const { error, msg, all } = await searchParams;
  const requests = await db.accessRequest.findMany({
    where: all ? {} : { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  const deletions = await db.deletionRequest.findMany({
    where: { status: "PENDING" },
    include: { organisation: { include: { users: { select: { name: true, email: true } } } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="pt-main" id="main">
      <p className="pt-eyebrow">Registration</p>
      <h1 className="pt-title">Access requests</h1>
      <p className="pt-sub">
        Review each request. Approving creates the organisation and the single administrator login that WAJIBU chooses.
      </p>
      <FlashBox />
      {error && <div className="pt-msg err">{error === "email" ? "That administrator email already has an account." : "Please check the details and try again."}</div>}
      {msg === "rejected" && <div className="pt-msg ok">Request rejected.</div>}
      {msg === "declined" && <div className="pt-msg ok">Deletion request declined.</div>}

      {deletions.length > 0 && (
        <section style={{ marginBottom: 36 }} aria-labelledby="deletions">
          <h2 id="deletions" style={{ fontSize: 28, marginBottom: 14 }}>Account deletion requests</h2>
          <div className="pt-grid">
            {deletions.map((d) => (
              <div key={d.id} className="pt-card" style={{ borderColor: "rgba(140,47,47,.35)" }}>
                <div className="pt-row" style={{ justifyContent: "space-between" }}>
                  <h3>{d.organisation.name}</h3>
                  <span className="pt-pill pending">Pending</span>
                </div>
                <p className="pt-country" style={{ margin: "4px 0 10px" }}>
                  {d.organisation.type === "CHARITY" ? "Charity" : "Company"} · {d.organisation.country} · requested {d.createdAt.toLocaleDateString("en-GB")}
                  {d.organisation.users[0] && ` · by ${d.organisation.users[0].name}`}
                </p>
                {d.reason && <p style={{ fontSize: 14, margin: "0 0 12px" }}><strong>Reason:</strong> {d.reason}</p>}
                <div className="pt-row">
                  <Link href={`/admin/organisations/${d.organisationId}`} className="pt-btn small danger">Review &amp; delete</Link>
                  <form action={declineDeletion}>
                    <input type="hidden" name="requestId" value={d.id} />
                    <button type="submit" className="pt-btn small ghost">Decline</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <h2 style={{ fontSize: 28, marginBottom: 14 }}>Access requests</h2>

      <div className="pt-subnav">
        <a href="/admin/requests" className={`pt-chip${!all ? " on" : ""}`}>Pending</a>
        <a href="/admin/requests?all=1" className={`pt-chip${all ? " on" : ""}`}>All</a>
      </div>

      {requests.length === 0 ? (
        <div className="pt-empty">No {all ? "" : "pending "}requests.</div>
      ) : (
        <div className="pt-grid">
          {requests.map((r) => (
            <section key={r.id} className="pt-card">
              <div className="pt-row" style={{ justifyContent: "space-between" }}>
                <h3>{r.orgName}</h3>
                <span className={`pt-pill ${r.status === "PENDING" ? "pending" : r.status === "APPROVED" ? "ok" : "bad"}`}>{r.status}</span>
              </div>
              <p className="pt-country" style={{ margin: "4px 0 12px" }}>
                {r.type === "CHARITY" ? "Charity" : "Company"} · {r.country} · {r.createdAt.toLocaleDateString("en-GB")}
              </p>
              <dl className="pt-dl">
                <dt>Contact</dt><dd>{r.contactName} · <a href={`mailto:${r.email}`} style={{ textDecoration: "underline" }}>{r.email}</a>{r.phone && ` · ${r.phone}`}</dd>
                {r.registeredNumber && (<><dt>Registered number</dt><dd>{r.registeredNumber}</dd></>)}
                {r.message && (<><dt>Message</dt><dd style={{ whiteSpace: "pre-line" }}>{r.message}</dd></>)}
              </dl>
              {r.status === "PENDING" && (
                <details style={{ marginTop: 18 }}>
                  <summary className="pt-btn small dark" style={{ display: "inline-flex", cursor: "pointer" }}>Approve &amp; choose administrator</summary>
                  <form action={approveRequest} className="pt-form" style={{ marginTop: 16 }}>
                    <input type="hidden" name="requestId" value={r.id} />
                    <input type="hidden" name="type" value={r.type} />
                    <div className="pt-grid cols2">
                      <div className="pt-field"><label>Organisation name</label><input name="name" defaultValue={r.orgName} required /></div>
                      <div className="pt-field"><label>Country</label><input name="country" defaultValue={r.country} required /></div>
                    </div>
                    {r.type === "CHARITY" && (
                      <div className="pt-field"><label>Registered charity number</label><input name="registeredNumber" defaultValue={r.registeredNumber} /></div>
                    )}
                    <div className="pt-grid cols2">
                      <div className="pt-field"><label>Administrator name</label><input name="adminName" defaultValue={r.contactName} required /></div>
                      <div className="pt-field"><label>Administrator email</label><input name="adminEmail" type="email" defaultValue={r.email} required /></div>
                    </div>
                    <p className="pt-hint">A temporary password is generated and shown to you once. The administrator must change it at first sign-in.</p>
                    <div><button type="submit" className="pt-btn">Approve &amp; create account</button></div>
                  </form>
                </details>
              )}
              {r.status === "PENDING" && (
                <form action={rejectRequest} style={{ marginTop: 12 }}>
                  <input type="hidden" name="requestId" value={r.id} />
                  <button type="submit" className="pt-btn small ghost">Reject</button>
                </form>
              )}
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
