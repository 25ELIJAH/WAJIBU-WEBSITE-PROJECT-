import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/portal/db";
import { requireUser } from "@/lib/portal/session";
import { parseSectors, sectorLabel } from "@/lib/portal/constants";
import CharityView from "../CharityView";
import { removeFromShortlist, requestConnection } from "./actions";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

const MSG: Record<string, string> = {
  added: "Added to your shortlist.",
  removed: "Removed from your shortlist.",
  connected: "Request sent. WAJIBU will take over and be in touch.",
  exists: "You already have an open connection request with the selected charities.",
  none: "Please select at least one charity first.",
};

export default async function PortalHome({ searchParams }: { searchParams: Promise<{ msg?: string; pw?: string }> }) {
  const user = await requireUser("COMPANY", "CHARITY", "ADMIN");
  if (user.role === "ADMIN") redirect("/admin");
  const { msg, pw } = await searchParams;

  /* ───────── charity: their own page, read only ───────── */
  if (user.role === "CHARITY") {
    const charity = await db.charityProfile.findUnique({
      where: { organisationId: user.organisationId! },
      include: { organisation: true, photos: { orderBy: { sort: "asc" } } },
    });
    if (!charity) return <main className="pt-main"><div className="pt-empty">Your profile is being prepared by WAJIBU.</div></main>;
    return (
      <main className="pt-main">
        {pw && <div className="pt-msg ok">Your password has been updated.</div>}
        <CharityView charity={charity}>
          {!charity.published && (
            <div className="pt-msg info">
              Your profile is not yet visible to companies. WAJIBU will publish it once it has been reviewed.
            </div>
          )}
          <p className="pt-hint" style={{ marginBottom: 20 }}>
            Profile content and photos are managed by WAJIBU. To request a change, email{" "}
            <a href="mailto:Admin1@wajibu.uk" style={{ textDecoration: "underline" }}>Admin1@wajibu.uk</a>.
          </p>
        </CharityView>
      </main>
    );
  }

  /* ───────── company dashboard ───────── */
  const companyId = user.organisationId!;
  const [shortlist, connections, notes] = await Promise.all([
    db.shortlist.findMany({
      where: { companyId, charity: { published: true } },
      include: { charity: { include: { organisation: true } } },
      orderBy: { createdAt: "desc" },
    }),
    db.connection.findMany({
      where: { companyId },
      include: { charity: { include: { organisation: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    db.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return (
    <main className="pt-main">
      <p className="pt-eyebrow">{user.organisation!.name}</p>
      <h1 className="pt-title">Your dashboard</h1>
      <p className="pt-sub">
        Shortlist the charities you are interested in, then ask WAJIBU to connect you. WAJIBU takes over from there and
        both parties are notified.
      </p>
      {pw && <div className="pt-msg ok">Your password has been updated.</div>}
      {msg && MSG[msg] && <div className={`pt-msg ${msg === "none" || msg === "exists" ? "info" : "ok"}`} role="status">{MSG[msg]}</div>}

      <h2 style={{ fontSize: 28, marginBottom: 14 }}>Shortlisted charities</h2>
      {shortlist.length === 0 ? (
        <div className="pt-empty">
          Nothing shortlisted yet. <Link href="/portal/directory" style={{ textDecoration: "underline" }}>Browse the Charity Directory</Link> and
          select the organisations you would like to support.
        </div>
      ) : (
        <form>
          <div className="pt-grid cols3">
            {shortlist.map(({ charity: c }) => (
              <div key={c.id} className="pt-charity">
                {c.featured && <span className="pt-featured">Featured</span>}
                <h3><Link href={`/portal/charity/${c.id}`}>{c.organisation.name}</Link></h3>
                <p className="pt-country">{c.organisation.country}</p>
                <div className="pt-tags">
                  {parseSectors(c.sectors).map((s) => <span key={s} className="pt-tag">{sectorLabel(s)}</span>)}
                </div>
                <label className="pt-pick">
                  <input type="checkbox" name="charityId" value={c.id} /> Select
                </label>
              </div>
            ))}
          </div>
          <div className="pt-sticky">
            <div className="pt-bar">
              <div className="pt-field" style={{ flex: "1 1 260px" }}>
                <label htmlFor="note" style={{ color: "#fff" }}>Message for WAJIBU (optional)</label>
                <input id="note" name="note" maxLength={1000} placeholder="e.g. interested in a long-term partnership" />
              </div>
              <div className="pt-row">
                <button type="submit" formAction={requestConnection} formMethod="post" className="pt-btn">Connect me via WAJIBU</button>
                <button type="submit" formAction={removeFromShortlist} formMethod="post" className="pt-btn ghost" style={{ color: "#fff", borderColor: "#fff" }}>Remove selected</button>
              </div>
            </div>
          </div>
        </form>
      )}

      <div className="pt-grid cols2" style={{ marginTop: 40 }}>
        <section>
          <h2 style={{ fontSize: 28, marginBottom: 14 }}>Connection requests</h2>
          {connections.length === 0 ? (
            <div className="pt-empty">No requests yet.</div>
          ) : (
            <div className="pt-tablewrap">
              <table className="pt-table">
                <thead><tr><th>Charity</th><th>Requested</th><th>Status</th></tr></thead>
                <tbody>
                  {connections.map((c) => (
                    <tr key={c.id}>
                      <td>{c.charity.organisation.name}</td>
                      <td>{c.createdAt.toLocaleDateString("en-GB")}</td>
                      <td><span className={`pt-pill ${c.status === "NEW" ? "new" : c.status === "CLOSED" ? "" : "ok"}`}>
                        {c.status === "NEW" ? "Received" : c.status === "IN_PROGRESS" ? "WAJIBU in contact" : "Closed"}
                      </span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <section>
          <h2 style={{ fontSize: 28, marginBottom: 14 }}>Latest notifications</h2>
          {notes.length === 0 ? (
            <div className="pt-empty">You&rsquo;re all caught up.</div>
          ) : (
            <ul className="pt-note">
              {notes.map((n) => (
                <li key={n.id} className={n.readAt ? "read" : ""}>
                  <b>{n.title}</b>
                  {n.body && <span>{n.body}</span>}
                </li>
              ))}
            </ul>
          )}
          <p className="pt-hint" style={{ marginTop: 12 }}><Link href="/portal/notifications" style={{ textDecoration: "underline" }}>All notifications</Link></p>
        </section>
      </div>
    </main>
  );
}
