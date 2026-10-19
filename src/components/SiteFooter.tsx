"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { newsletterSubmit } from "@/lib/legacy-handlers";

const EMAIL = "Admin1@wajibu.uk";
const PHONE_DISPLAY = "+44 7369 252639";
const PHONE_HREF = "tel:+447369252639";
const MAIL_HREF = `https://mail.google.com/mail/?view=cm&to=${EMAIL}`;

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/insights", label: "Insights" },
  { href: "/impact", label: "Impact" },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Portal Login" },
];

// Home and Contact originally listed the three core engagements; every other page listed six.
// The Services page has sections with ids diagnose, architect and evidence (originally titled
// ESG Strategy, Compliance and ESG Reporting). Training, ESG Audits and Advisory are not shown
// as sections there, so they link to the Services page itself.
const SERVICES_CORE = [
  { href: "/services#diagnose", label: "Diagnose" },
  { href: "/services#architect", label: "Architect" },
  { href: "/services#evidence", label: "Evidence" },
];

const SERVICES_FULL = [
  { href: "/services#diagnose", label: "ESG Strategy" },
  { href: "/services#architect", label: "Compliance" },
  { href: "/services#evidence", label: "ESG Reporting" },
  { href: "/services", label: "Training" },
  { href: "/services", label: "ESG Audits" },
  { href: "/services", label: "Advisory" },
];

const LEGAL = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy#cookies", label: "Cookies" },
  { href: "/sitemap.xml", label: "Sitemap", plain: true },
];

const arrow = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DEFAULT_MISSION =
  "ESG & Social Responsibility Compliance · FCA · CSRD · Consumer Duty · Modern Slavery Act";

/** `mission` lets a page keep its original one-line description. */
export default function SiteFooter({
  mission = DEFAULT_MISSION,
  services = "full",
}: {
  mission?: string;
  services?: "core" | "full";
}) {
  const serviceLinks = services === "core" ? SERVICES_CORE : SERVICES_FULL;
  const pathname = usePathname();
  const cur = (href: string) => (pathname === href ? ("page" as const) : undefined);

  return (
    <footer className="sf" role="contentinfo" aria-label="Site footer">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="sf-grid">
        <div className="sf-brand">
          <Link href="/" className="sf-logo" aria-label="WAJIBU Home">
            <span className="sf-ring-wrap">
              <span className="sf-glow" />
              <span className="sf-ring" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/wajibu_logo.jpeg" alt="WAJIBU" className="sf-logo-img" width={42} height={42} decoding="async" />
            </span>
            <span>
              <span className="sf-name">WAJIBU</span>
              <span className="sf-tag">Environmental &bull; Social &bull; Governance</span>
            </span>
          </Link>
          <p className="sf-mission">{mission}</p>
          <div className="sf-socials">
            <a href={MAIL_HREF} target="_blank" rel="noopener noreferrer" className="sf-social" aria-label="Email WAJIBU">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M1 6l7 4 7-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </a>
            <a href={PHONE_HREF} className="sf-social" aria-label={`Call WAJIBU on ${PHONE_DISPLAY}`}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 3h3l1 3-1.5 1.5A8 8 0 009.5 10l1.5-1.5 3 1v3a1 1 0 01-1 1A13 13 0 012 2a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </a>
          </div>
        </div>

        <nav className="sf-col" aria-label="Quick links">
          <h4>Quick Links</h4>
          <ul>
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={cur(l.href)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="sf-col" aria-label="Services">
          <h4>Services</h4>
          <ul>
            {serviceLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sf-col">
          <h4>Contact Us</h4>
          <address className="sf-contact">
            <div className="sf-item">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 2C5.8 2 4 3.8 4 6c0 3.5 4 8 4 8s4-4.5 4-8c0-2.2-1.8-4-4-4z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              <span>66 Paul Street, London EC2A 4NA</span>
            </div>
            <div className="sf-item">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M1 6l7 4 7-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <a href={MAIL_HREF} target="_blank" rel="noopener noreferrer">
                {EMAIL}
              </a>
            </div>
            <div className="sf-item">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 3h3l1 3-1.5 1.5A8 8 0 009.5 10l1.5-1.5 3 1v3a1 1 0 01-1 1A13 13 0 012 2a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
              <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
            </div>
          </address>
          <p className="sf-news-text">Stay updated with ESG insights.</p>
          <form className="sf-news" onSubmit={newsletterSubmit} noValidate>
            <input type="email" placeholder="Your email address" aria-label="Newsletter email" autoComplete="email" required />
            <button type="submit" aria-label="Subscribe">
              {arrow}
            </button>
          </form>
        </div>
      </div>

      <div className="sf-bottom">
        <p className="sf-copy">&copy; 2026 WAJIBU. All rights reserved.</p>
        <nav className="sf-legal" aria-label="Legal links">
          {LEGAL.map((l) =>
            l.plain ? (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ) : (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            )
          )}
        </nav>
        <p className="sf-reg">WAJIBU LTD &middot; Company Registration No. 17247586 &middot; Registered in England</p>
      </div>
    </footer>
  );
}

const CSS = `
html{scroll-padding-top:120px}
.sf{background:#072B1E;color:rgba(255,255,255,.7);padding:64px 5% 0;font-family:'Inter',system-ui,sans-serif;position:relative;z-index:1}
.sf *{box-sizing:border-box}
.sf a{color:inherit;text-decoration:none}
.sf ul{list-style:none;margin:0;padding:0}
.sf-grid{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1.6fr 1fr 1fr 1.5fr;gap:48px;padding-bottom:40px;border-bottom:1px solid rgba(255,255,255,.08);align-items:start}
.sf-grid>*{min-width:0}
.sf-logo{display:inline-flex;align-items:center;gap:12px;margin-bottom:18px}
.sf-ring-wrap{position:relative;width:42px;height:42px;flex-shrink:0;display:block}
.sf-glow{position:absolute;inset:-8px;border-radius:50%;background:radial-gradient(circle,rgba(212,160,23,.3) 0%,transparent 70%);animation:sfGlow 2.5s ease-in-out infinite;z-index:0}
.sf-ring{position:absolute;inset:-4px;border-radius:50%;background:conic-gradient(from 0deg,transparent 0deg,#D4A017 60deg,#E5C46A 120deg,transparent 180deg,transparent 240deg,#D4A017 300deg,transparent 360deg);animation:sfSpin 4s linear infinite;z-index:1}
.sf-ring::after{content:'';position:absolute;inset:3px;border-radius:50%;background:#072B1E}
.sf-logo-img{position:relative;z-index:2;display:block;width:42px;height:42px;border-radius:50%;object-fit:cover;object-position:center 18%}
.sf-name{display:block;font-family:'Cormorant Garamond',Georgia,serif;font-size:21px;font-weight:700;color:#fff;letter-spacing:2.5px;line-height:1}
.sf-tag{display:block;font-size:8px;letter-spacing:2px;color:#E5C46A;text-transform:uppercase;margin-top:4px}
.sf-mission{font-size:13.5px;line-height:1.7;color:rgba(255,255,255,.62);margin:0 0 20px;max-width:340px}
.sf-socials{display:flex;gap:10px}
.sf-social{width:38px;height:38px;border-radius:50%;border:1px solid rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.6);transition:all .3s}
.sf-social:hover,.sf-social:focus-visible{border-color:#D4A017;color:#D4A017;transform:translateY(-2px)}
.sf-col h4{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#fff;font-weight:600;margin:0 0 18px;padding-bottom:12px;border-bottom:1px solid rgba(212,160,23,.25)}
.sf-col li{margin-bottom:4px}
.sf-col li a{display:inline-block;font-size:14px;color:rgba(255,255,255,.65);padding:5px 0;transition:color .25s,transform .25s}
.sf-col li a:hover,.sf-col li a:focus-visible,.sf-col li a[aria-current="page"]{color:#E5C46A}
.sf-col li a:hover{transform:translateX(3px)}
.sf-contact{font-style:normal;margin:0 0 4px}
.sf-item{display:flex;align-items:flex-start;gap:12px;font-size:14px;line-height:1.55;color:rgba(255,255,255,.65);margin-bottom:12px}
.sf-item svg{color:#D4A017;flex-shrink:0;margin-top:4px}
.sf-item a{transition:color .25s;overflow-wrap:anywhere}
.sf-item a:hover,.sf-item a:focus-visible{color:#E5C46A}
.sf-news-text{font-size:13px;color:rgba(255,255,255,.55);margin:18px 0 10px}
.sf-news{display:flex;overflow:hidden;border-radius:50px;border:1px solid rgba(255,255,255,.18);max-width:360px}
.sf-news:focus-within{border-color:#D4A017}
.sf-news input{flex:1;min-width:0;padding:12px 18px;background:rgba(255,255,255,.05);border:0;outline:0;color:#fff;font-size:14px;font-family:inherit}
.sf-news input::placeholder{color:rgba(255,255,255,.4)}
.sf-news button{padding:0 20px;background:#D4A017;color:#072B1E;border:0;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .25s}
.sf-news button:hover,.sf-news button:focus-visible{background:#E5C46A}
.sf-bottom{max-width:1200px;margin:0 auto;padding:22px 0;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px 24px}
.sf-copy{margin:0;font-size:12.5px;color:rgba(255,255,255,.5)}
.sf-legal{display:flex;gap:6px 24px;flex-wrap:wrap}
.sf-legal a{font-size:12.5px;color:rgba(255,255,255,.5);padding:4px 0;transition:color .25s}
.sf-legal a:hover,.sf-legal a:focus-visible{color:#E5C46A}
.sf-reg{margin:6px 0 0;padding-top:14px;border-top:1px solid rgba(255,255,255,.07);width:100%;text-align:center;font-size:12px;letter-spacing:.5px;color:rgba(255,255,255,.45)}
@keyframes sfSpin{to{transform:rotate(360deg)}}
@keyframes sfGlow{0%,100%{opacity:.4;transform:scale(.95)}50%{opacity:1;transform:scale(1.1)}}
@media (max-width:1024px){
  .sf{padding-top:52px}
  .sf-grid{grid-template-columns:1fr 1fr 1.5fr;gap:40px 32px}
  .sf-brand{grid-column:1/-1}
  .sf-mission{max-width:520px}
}
@media (max-width:640px){
  .sf{padding:44px 20px 0}
  .sf-grid{grid-template-columns:1fr 1fr;gap:32px 20px;padding-bottom:32px}
  .sf-col:last-child{grid-column:1/-1}
  .sf-col li a{padding:8px 0;font-size:14.5px}
  .sf-item{font-size:14.5px;align-items:center}
  .sf-item svg{margin-top:0}
  .sf-item a{display:inline-block;padding:11px 0}
  .sf-news{max-width:none}
  .sf-news input{padding:14px 18px}
  .sf-bottom{flex-direction:column;align-items:flex-start;gap:10px}
  .sf-legal{gap:4px 20px}
  .sf-legal a{padding:8px 0}
  .sf-reg{text-align:left}
}
@media (max-width:380px){
  .sf-grid{grid-template-columns:1fr}
}
@media (prefers-reduced-motion:reduce){.sf-glow,.sf-ring{animation:none}}
`;
