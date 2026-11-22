"use client";
import Link from "next/link";

export default function CookieBanner() {
  return (
    <>
<div id="cookie-banner" role="dialog" aria-label="Cookie consent" aria-live="polite"><div className="cb-inner"><div className="cb-left"><div className="cb-icon">🍪</div><div><p className="cb-title">We use cookies</p><p className="cb-text">We use essential cookies to make this site work. With your consent, we may also use analytics cookies to improve your experience. <Link href="/privacy">Read our Privacy Policy</Link>.</p></div></div><div className="cb-actions"><button className="cb-decline" id="cbDecline">Decline</button>{" "}<button className="cb-accept" id="cbAccept">Accept All</button></div></div></div>
    </>
  );
}
