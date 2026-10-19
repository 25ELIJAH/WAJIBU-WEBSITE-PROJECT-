import type { Metadata } from "next";
import Link from "next/link";
import "./portal.css";
import SiteFooter from "@/components/SiteFooter";
import PortalNav from "./PortalNav";
import { getCurrentUser } from "@/lib/portal/session";
import { db } from "@/lib/portal/db";
import { logout } from "./auth-actions";

const FONTS =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap";

export const metadata: Metadata = {
  title: { default: "WAJIBU Charity Portal", template: "%s | WAJIBU Portal" },
  robots: { index: false, follow: false },
};

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const unread = user ? await db.notification.count({ where: { userId: user.id, readAt: null } }) : 0;

  const links =
    user?.role === "ADMIN"
      ? [
          { href: "/admin", label: "Overview", exact: true },
          { href: "/admin/requests", label: "Requests" },
          { href: "/admin/organisations", label: "Organisations" },
          { href: "/admin/connections", label: "Connections" },
          { href: "/admin/reports", label: "Reports" },
        ]
      : user?.role === "COMPANY"
        ? [
            { href: "/portal", label: "Dashboard", exact: true },
            { href: "/portal/directory", label: "Charity Directory" },
          ]
        : user?.role === "CHARITY"
          ? [{ href: "/portal", label: "My Profile", exact: true }]
          : [];

  return (
    <div className="pt">
      <link rel="stylesheet" href={FONTS} precedence="default" />
      <header className="pt-head">
        <div className="pt-head-in">
          <Link href={user ? (user.role === "ADMIN" ? "/admin" : "/portal") : "/"} className="pt-brand" aria-label="WAJIBU">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/wajibu_logo.jpeg" alt="" width={42} height={42} />
            <span>
              <b>WAJIBU</b>
              <span>Charity Portal</span>
            </span>
          </Link>
          <nav className="pt-nav" aria-label="Portal">
            {user ? (
              <>
                <PortalNav links={links} />
                <Link href="/portal/notifications">
                  Notifications{unread > 0 && <span className="pt-badge">{unread}</span>}
                </Link>
                <Link href="/portal/account">Account</Link>
                <form action={logout}>
                  <button type="submit">Sign out</button>
                </form>
              </>
            ) : (
              <>
                <Link href="/">Main site</Link>
                <Link href="/request-access">Request access</Link>
                <Link href="/login">Sign in</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      {children}
      <SiteFooter />
    </div>
  );
}
