"use client";

import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import GooFilter from "@/components/legacy/GooFilter";
import Navbar from "@/components/legacy/Navbar";
import MobileDrawer from "@/components/legacy/MobileDrawer";
import CookieBanner from "@/components/legacy/CookieBanner";
import BackToTop from "@/components/legacy/BackToTop";
import SharedStyles4 from "@/components/legacy/SharedStyles4";
import SharedStyles2 from "@/components/legacy/SharedStyles2";
import { CSS } from "./not-found.styles";
import LegacyScripts from "@/components/LegacyScripts";
import { SCRIPTS } from "./not-found.scripts";

export default function NotFoundPage() {
  return (
    <>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap" />
<style dangerouslySetInnerHTML={{ __html: CSS[0] }} />
<style dangerouslySetInnerHTML={{ __html: CSS[1] }} />
<link rel="stylesheet" href="/global.css" />
<style id="mobile-menu-css" dangerouslySetInnerHTML={{ __html: CSS[2] }} />
<GooFilter />
<Navbar />
<MobileDrawer />
<div className="hero-404"><div className="orb orb1" /><div className="orb orb2" /><div className="inner-404"><div className="num-404">404</div><div className="gold-line" /><h1 className="title-404">This Page Doesn’t Exist</h1><p className="sub-404">The page you’re looking for may have been moved, deleted or never existed. Let’s get you back on track.</p><div className="links-404"><Link href="/" className="btn-home"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8h12M8 3l-6 5 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> Back to Home</Link>{" "}<Link href="/contact" className="btn-link">Speak to Samuel</Link>{" "}<Link href="/services" className="btn-link">Our Services</Link></div><div className="quick-links"><p>Or jump to</p><div className="quick-links-grid"><Link href="/about" className="ql">About</Link>{" "}<Link href="/services#strategy" className="ql">ESG Strategy</Link>{" "}<Link href="/services#compliance" className="ql">Compliance</Link>{" "}<Link href="/services#reporting" className="ql">Reporting</Link>{" "}<Link href="/impact" className="ql">Our Impact</Link>{" "}<Link href="/insights" className="ql">Insights</Link>{" "}<Link href="/contact" className="ql">Contact</Link>{" "}<Link href="/privacy" className="ql">Privacy Policy</Link></div></div></div></div>
<SiteFooter mission="Building responsible futures through strategy, compliance and impact." />
<CookieBanner />
<BackToTop />
<SharedStyles4 />
<SharedStyles2 />
      <LegacyScripts scripts={SCRIPTS} />
    </>
  );
}
