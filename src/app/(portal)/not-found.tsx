import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function PortalNotFound() {
  return (
    <main className="pt-main narrow" id="main">
      <p className="pt-eyebrow">Charity Portal</p>
      <h1 className="pt-title">Page not found</h1>
      <p className="pt-sub">
        That page does not exist, or you do not have access to it.
      </p>
      <Link href="/portal" className="pt-btn">Back to the portal</Link>
    </main>
  );
}
