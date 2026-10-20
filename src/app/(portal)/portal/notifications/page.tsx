import Link from "next/link";
import { db } from "@/lib/portal/db";
import { requireUser } from "@/lib/portal/session";
import { markAllRead } from "../actions";

export const metadata = { title: "Notifications" };
export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await requireUser();
  const notes = await db.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 100 });
  const unread = notes.filter((n) => !n.readAt).length;

  return (
    <main className="pt-main" id="main">
      <p className="pt-eyebrow">Inbox</p>
      <h1 className="pt-title">Notifications</h1>
      {unread > 0 && (
        <form action={markAllRead} style={{ marginBottom: 20 }}>
          <button type="submit" className="pt-btn small dark">Mark all {unread} as read</button>
        </form>
      )}
      {notes.length === 0 ? (
        <div className="pt-empty">No notifications yet.</div>
      ) : (
        <ul className="pt-note">
          {notes.map((n) => (
            <li key={n.id} className={n.readAt ? "read" : ""}>
              <b>{n.href ? <Link href={n.href}>{n.title}</Link> : n.title}</b>
              {n.body && <span>{n.body}</span>}
              <span style={{ display: "block", marginTop: 4, fontSize: 12 }}>{n.createdAt.toLocaleString("en-GB")}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
