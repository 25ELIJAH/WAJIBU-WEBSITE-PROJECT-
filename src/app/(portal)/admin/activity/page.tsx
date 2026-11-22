import Link from "next/link";
import { db } from "@/lib/portal/db";
import { requireUser } from "@/lib/portal/session";

export const metadata = { title: "Activity log" };
export const dynamic = "force-dynamic";

/** Filter chips -> the action prefixes they cover (actions are recorded as "area.verb"). */
const AREAS: Record<string, { label: string; prefixes: string[] }> = {
  signins: { label: "Sign-ins", prefixes: ["login", "logout"] },
  passwords: { label: "Passwords", prefixes: ["password", "user.reset"] },
  orgs: { label: "Organisations", prefixes: ["org.", "charity.", "company.", "photo.", "sector.", "staff.", "request."] },
  matching: { label: "Matching", prefixes: ["connection.", "shortlist."] },
  deletions: { label: "Deletions & exports", prefixes: ["deletion.", "report.", "charity.import"] },
};

export default async function ActivityPage({ searchParams }: { searchParams: Promise<{ area?: string }> }) {
  await requireUser("ADMIN");
  const { area } = await searchParams;
  const active = area && AREAS[area] ? area : null;

  const logs = await db.auditLog.findMany({
    where: active ? { OR: AREAS[active].prefixes.map((p) => ({ action: { startsWith: p } })) } : {},
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  const ids = [...new Set(logs.map((l) => l.actorId).filter((x): x is string => !!x))];
  const people = new Map(
    (await db.user.findMany({ where: { id: { in: ids } }, select: { id: true, name: true, email: true } })).map((u) => [u.id, u])
  );

  return (
    <main className="pt-main" id="main">
      <p className="pt-eyebrow">Oversight</p>
      <h1 className="pt-title">Activity log</h1>
      <p className="pt-sub">A record of sign-ins, account changes, approvals, deletions and exports. Showing the latest 200 entries.</p>

      <div className="pt-subnav">
        <Link href="/admin/activity" className={`pt-chip${!active ? " on" : ""}`}>Everything</Link>
        {Object.entries(AREAS).map(([k, v]) => (
          <Link key={k} href={`/admin/activity?area=${k}`} className={`pt-chip${active === k ? " on" : ""}`}>{v.label}</Link>
        ))}
      </div>

      {logs.length === 0 ? (
        <div className="pt-empty">Nothing recorded yet.</div>
      ) : (
        <div className="pt-tablewrap">
          <table className="pt-table">
            <thead><tr><th>When</th><th>Who</th><th>Action</th><th>Detail</th></tr></thead>
            <tbody>
              {logs.map((l) => {
                const who = l.actorId ? people.get(l.actorId) : null;
                return (
                  <tr key={l.id}>
                    <td style={{ whiteSpace: "nowrap" }}>{l.createdAt.toLocaleString("en-GB")}</td>
                    <td>{who ? <>{who.name}<br /><span className="pt-hint">{who.email}</span></> : <span className="pt-hint">{l.actorId ? "Removed user" : "Not signed in"}</span>}</td>
                    <td><code>{l.action}</code></td>
                    <td style={{ wordBreak: "break-word" }}>{l.detail}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
