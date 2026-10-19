import Link from "next/link";
import { db } from "@/lib/portal/db";
import { requireUser } from "@/lib/portal/session";
import FlashBox from "./FlashBox";

export const metadata = { title: "Admin overview" };
export const dynamic = "force-dynamic";

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ pw?: string }> }) {
  const user = await requireUser("ADMIN");
  const { pw } = await searchParams;

  const [pending, charities, companies, published, newConns, openConns, recent] = await Promise.all([
    db.accessRequest.count({ where: { status: "PENDING" } }),
    db.organisation.count({ where: { type: "CHARITY" } }),
    db.organisation.count({ where: { type: "COMPANY" } }),
    db.charityProfile.count({ where: { published: true } }),
    db.connection.count({ where: { status: "NEW" } }),
    db.connection.count({ where: { status: { in: ["NEW", "IN_PROGRESS"] } } }),
    db.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const stats = [
    { n: pending, l: "Access requests waiting", href: "/admin/requests" },
    { n: newConns, l: "New connection requests", href: "/admin/connections" },
    { n: charities, l: `Charities (${published} published)`, href: "/admin/organisations?type=CHARITY" },
    { n: companies, l: "Companies", href: "/admin/organisations?type=COMPANY" },
  ];

  return (
    <main className="pt-main">
      <p className="pt-eyebrow">WAJIBU administration</p>
      <h1 className="pt-title">Welcome, {user.name.split(" ")[0]}</h1>
      <p className="pt-sub">{openConns} connection request{openConns === 1 ? "" : "s"} currently open.</p>
      {pw && <div className="pt-msg ok">Your password has been updated.</div>}
      <FlashBox />

      <div className="pt-grid cols3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {stats.map((s) => (
          <Link key={s.l} href={s.href} className="pt-card">
            <div className="pt-stat">{s.n}</div>
            <div className="pt-stat-l">{s.l}</div>
          </Link>
        ))}
      </div>

      <h2 style={{ fontSize: 28, margin: "40px 0 14px" }}>Latest activity</h2>
      {recent.length === 0 ? (
        <div className="pt-empty">Nothing yet.</div>
      ) : (
        <ul className="pt-note">
          {recent.map((n) => (
            <li key={n.id} className={n.readAt ? "read" : ""}>
              <b>{n.href ? <Link href={n.href}>{n.title}</Link> : n.title}</b>
              {n.body && <span>{n.body}</span>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
