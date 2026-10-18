export const CSS: string[] = [
  `
    @keyframes ls{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes lg{0%,100%{opacity:0.4;transform:scale(0.95)}50%{opacity:1;transform:scale(1.1)}}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{font-family:'Inter',system-ui,sans-serif;color:#1A2521;background:#fff;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
    a{text-decoration:none;color:inherit}
    @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
    .rv{opacity:0;transform:translateY(28px);transition:opacity 0.7s ease,transform 0.7s ease}
    .rv.vis{opacity:1;transform:translateY(0)}
  `,
  `
    :root{--gd:#0A3D2A;--gdp:#072B1E;--gold:#D4A017;--golds:#E5C46A;--serif:'Cormorant Garamond',Georgia,serif;}
    body{background:var(--gdp);min-height:100vh;display:flex;flex-direction:column;}
    .hero-404{
      flex:1;display:flex;align-items:center;justify-content:center;
      text-align:center;padding:120px 5% 80px;position:relative;overflow:hidden;
    }
    .orb{position:absolute;border-radius:50%;filter:blur(100px);pointer-events:none;}
    .orb1{width:500px;height:500px;background:radial-gradient(circle,rgba(10,61,42,0.7) 0%,transparent 70%);top:-150px;left:-150px;animation:od1 15s ease-in-out infinite;}
    .orb2{width:400px;height:400px;background:radial-gradient(circle,rgba(212,160,23,0.06) 0%,transparent 70%);bottom:-100px;right:-100px;animation:od2 18s ease-in-out infinite;}
    @keyframes od1{0%,100%{transform:translate(0,0)}50%{transform:translate(30px,20px)}}
    @keyframes od2{0%,100%{transform:translate(0,0)}50%{transform:translate(-25px,30px)}}
    .inner-404{position:relative;z-index:1;max-width:600px;}
    .num-404{
      font-family:var(--serif);font-size:clamp(100px,18vw,180px);
      font-weight:700;line-height:1;
      background:linear-gradient(135deg,rgba(212,160,23,0.15),rgba(212,160,23,0.06));
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
      margin-bottom:0;letter-spacing:-4px;
      animation:fadeUp 0.8s 0.1s ease both;
    }
    .gold-line{width:80px;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:0 auto 24px;animation:fadeUp 0.6s 0.3s ease both;opacity:0;}
    .title-404{font-family:var(--serif);font-size:clamp(28px,4vw,44px);font-weight:600;color:#fff;margin-bottom:16px;animation:fadeUp 0.8s 0.4s ease both;opacity:0;}
    .sub-404{font-size:16px;color:rgba(255,255,255,0.5);font-weight:300;line-height:1.7;margin-bottom:40px;animation:fadeUp 0.8s 0.55s ease both;opacity:0;}
    .links-404{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;animation:fadeUp 0.8s 0.7s ease both;opacity:0;}
    .btn-home{background:linear-gradient(135deg,var(--gold),var(--golds));color:var(--gdp);padding:14px 32px;border-radius:50px;font-size:14px;font-weight:700;display:inline-flex;align-items:center;gap:8px;box-shadow:0 6px 28px rgba(212,160,23,0.35);transition:all 0.3s;}
    .btn-home:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(212,160,23,0.5);}
    .btn-link{padding:14px 28px;border:1px solid rgba(255,255,255,0.15);border-radius:50px;font-size:14px;color:rgba(255,255,255,0.65);transition:all 0.3s;}
    .btn-link:hover{border-color:var(--gold);color:var(--golds);}
    .quick-links{margin-top:52px;animation:fadeUp 0.8s 0.85s ease both;opacity:0;}
    .quick-links p{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:16px;}
    .quick-links-grid{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;}
    .ql{padding:7px 16px;border:1px solid rgba(255,255,255,0.08);border-radius:50px;font-size:12px;color:rgba(255,255,255,0.45);transition:all 0.3s;}
    .ql:hover{border-color:rgba(212,160,23,0.3);color:var(--golds);}
  `,
  `
    /* ── BURGER BUTTON ──────────────────────────────── */
    .nav-burger {
      display: none;
      width: 44px; height: 44px;
      background: none; border: none;
      cursor: pointer; padding: 4px;
      z-index: 1100; position: relative;
      flex-shrink: 0;
    }
    .burger-box {
      width: 28px; height: 20px;
      display: flex; flex-direction: column;
      justify-content: space-between;
      margin: 0 auto;
    }
    .burger-line {
      display: block; width: 100%; height: 1.8px;
      background: #fff; border-radius: 2px;
      transform-origin: center;
      transition: transform 0.4s cubic-bezier(0.77,0,0.18,1),
                  opacity 0.3s ease,
                  width 0.4s ease;
    }
    /* Active state — X */
    .nav-burger.active .bl-1 { transform: translateY(9px) rotate(45deg); }
    .nav-burger.active .bl-2 { opacity: 0; width: 0; }
    .nav-burger.active .bl-3 { transform: translateY(-9px) rotate(-45deg); }

    /* Hover ripple */
    .nav-burger::after {
      content: '';
      position: absolute; inset: 0;
      border-radius: 50%;
      background: rgba(212,160,23,0.12);
      transform: scale(0); opacity: 0;
      transition: transform 0.35s ease, opacity 0.35s ease;
    }
    .nav-burger:hover::after { transform: scale(1); opacity: 1; }

    /* ── BACKDROP ───────────────────────────────────── */
    .md-backdrop {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.55);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      opacity: 0; visibility: hidden;
      transition: opacity 0.35s ease, visibility 0.35s ease;
      z-index: 1090;
    }

    /* ── PANEL ──────────────────────────────────────── */
    .mobile-drawer {
      position: fixed; inset: 0;
      z-index: 1095;
      pointer-events: none;
    }
    .mobile-drawer.open { pointer-events: all; }
    .mobile-drawer.open .md-backdrop {
      opacity: 1; visibility: visible;
    }

    .md-panel {
      position: fixed; top: 0; right: 0;
      width: min(360px, 90vw); height: 100dvh;
      background: #072B1E;
      display: flex; flex-direction: column;
      padding: 0;
      transform: translateX(100%);
      transition: transform 0.45s cubic-bezier(0.77,0,0.18,1);
      box-shadow: -8px 0 60px rgba(0,0,0,0.5);
      overflow: hidden;
      will-change: transform;
      border-left: 1px solid rgba(212,160,23,0.1);
    }
    .mobile-drawer.open .md-panel {
      transform: translateX(0);
    }

    /* Gold shimmer line on top of panel */
    .md-panel::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent, #D4A017, #E5C46A, #D4A017, transparent);
      opacity: 0;
      transition: opacity 0.5s ease 0.3s;
    }
    .mobile-drawer.open .md-panel::before { opacity: 1; }

    /* ── PANEL HEADER ───────────────────────────────── */
    .md-header {
      display: flex; align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      flex-shrink: 0;
    }
    .md-logo-wrap {
      display: flex; align-items: center; gap: 10px;
    }
    .md-logo-ring {
      width: 32px; height: 32px; border-radius: 50%;
      background: conic-gradient(from 0deg, transparent, #D4A017 120deg, #E5C46A 180deg, transparent 260deg);
      animation: mdSpin 4s linear infinite;
      flex-shrink: 0;
    }
    @keyframes mdSpin { to { transform: rotate(360deg); } }
    .md-logo-text {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 18px; font-weight: 700;
      color: #fff; letter-spacing: 3px;
    }
    .md-close {
      width: 40px; height: 40px; border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.12);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; background: none; color: rgba(255,255,255,0.6);
      transition: all 0.3s ease; flex-shrink: 0;
    }
    .md-close:hover {
      border-color: #D4A017; color: #D4A017;
      background: rgba(212,160,23,0.08);
      transform: rotate(90deg);
    }

    /* ── NAV LIST ───────────────────────────────────── */
    .md-list {
      list-style: none;
      padding: 16px 0; margin: 0;
      flex: 1; overflow-y: auto;
    }
    .md-item {
      opacity: 0;
      transform: translateX(32px);
      transition: opacity 0.4s ease calc(var(--i) * 60ms + 100ms),
                  transform 0.4s cubic-bezier(0.16,1,0.3,1) calc(var(--i) * 60ms + 100ms);
    }
    .mobile-drawer.open .md-item {
      opacity: 1; transform: translateX(0);
    }
    .md-link {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 28px;
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 26px; font-weight: 600;
      color: rgba(255,255,255,0.75);
      text-decoration: none;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      position: relative; overflow: hidden;
      transition: color 0.3s ease, padding-left 0.3s ease;
    }
    /* Gold left-slide on hover */
    .md-link::before {
      content: '';
      position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
      background: linear-gradient(180deg, #D4A017, #E5C46A);
      transform: scaleY(0); transform-origin: bottom;
      transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
    }
    /* Arrow that appears on hover */
    .md-link::after {
      content: '→';
      font-size: 18px; color: #D4A017;
      opacity: 0; transform: translateX(-8px);
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .md-link:hover {
      color: #E5C46A;
      padding-left: 36px;
    }
    .md-link:hover::before { transform: scaleY(1); }
    .md-link:hover::after { opacity: 1; transform: translateX(0); }

    /* Active tap effect */
    .md-link:active { background: rgba(212,160,23,0.06); }

    /* ── CTA AREA ───────────────────────────────────── */
    .md-cta-wrap {
      padding: 20px 24px 28px;
      border-top: 1px solid rgba(255,255,255,0.07);
      flex-shrink: 0;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.4s ease 0.55s, transform 0.4s ease 0.55s;
    }
    .mobile-drawer.open .md-cta-wrap {
      opacity: 1; transform: translateY(0);
    }
    .md-cta {
      display: flex; align-items: center; justify-content: center; gap: 10px;
      width: 100%; padding: 16px 24px;
      background: linear-gradient(135deg, #D4A017, #E5C46A);
      color: #072B1E; border-radius: 50px;
      font-size: 15px; font-weight: 700;
      text-decoration: none;
      box-shadow: 0 6px 28px rgba(212,160,23,0.35);
      transition: all 0.3s ease;
      margin-bottom: 16px;
    }
    .md-cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 36px rgba(212,160,23,0.5);
    }
    .md-cta:active { transform: translateY(0) scale(0.98); }

    .md-contact-strip {
      display: flex; flex-direction: column; gap: 8px;
    }
    .md-contact-item {
      display: flex; align-items: center; gap: 10px;
      font-size: 13px; color: rgba(255,255,255,0.45);
      text-decoration: none;
      transition: color 0.3s;
    }
    .md-contact-item:hover { color: #E5C46A; }
    .md-contact-item svg { flex-shrink: 0; }

    /* ── DECORATIVE ORB ─────────────────────────────── */
    .md-orb {
      position: absolute; bottom: -80px; right: -80px;
      width: 220px; height: 220px; border-radius: 50%;
      background: radial-gradient(circle, rgba(212,160,23,0.06) 0%, transparent 70%);
      pointer-events: none;
      animation: mdOrb 6s ease-in-out infinite;
    }
    @keyframes mdOrb {
      0%,100% { transform: scale(1); opacity: 0.6; }
      50% { transform: scale(1.15); opacity: 1; }
    }

    /* ── BODY LOCK when open ────────────────────────── */
    body.menu-open { overflow: hidden; }

    /* ── SHOW ON MOBILE/TABLET ──────────────────────── */
    @media (max-width: 1024px) {
      .nav-burger { display: flex !important; align-items: center; justify-content: center; }
    }
  `,
  `
  /* ═══════════════════════════════════════
     COOKIE BANNER
  ═══════════════════════════════════════ */
  #cookie-banner {
    position: fixed; bottom: -200px; left: 0; right: 0;
    z-index: 9990; padding: 0 20px 20px;
    transition: bottom 0.5s cubic-bezier(0.16,1,0.3,1);
    pointer-events: none;
  }
  #cookie-banner.show {
    bottom: 0; pointer-events: all;
  }
  .cb-inner {
    max-width: 960px; margin: 0 auto;
    background: #0d2a1e;
    border: 1px solid rgba(212,160,23,0.2);
    border-radius: 14px; padding: 20px 24px;
    display: flex; align-items: center;
    justify-content: space-between; gap: 20px;
    box-shadow: 0 -8px 48px rgba(0,0,0,0.3);
    flex-wrap: wrap;
  }
  .cb-left { display: flex; align-items: flex-start; gap: 14px; flex: 1; }
  .cb-icon { font-size: 24px; flex-shrink: 0; margin-top: 2px; }
  .cb-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 16px; font-weight: 600; color: #fff;
    margin-bottom: 4px;
  }
  .cb-text {
    font-size: 13px; color: rgba(255,255,255,0.55);
    line-height: 1.55; font-weight: 300;
  }
  .cb-text a { color: #D4A017; text-decoration: underline; }
  .cb-actions { display: flex; gap: 10px; flex-shrink: 0; align-items: center; }
  .cb-decline {
    padding: 10px 22px; border-radius: 50px;
    border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.6); font-size: 13px;
    font-weight: 500; cursor: pointer; background: none;
    transition: all 0.3s; font-family: inherit;
  }
  .cb-decline:hover { border-color: rgba(255,255,255,0.35); color: #fff; }
  .cb-accept {
    padding: 10px 24px; border-radius: 50px;
    background: linear-gradient(135deg, #D4A017, #E5C46A);
    color: #072B1E; font-size: 13px; font-weight: 700;
    cursor: pointer; border: none; transition: all 0.3s;
    font-family: inherit; box-shadow: 0 4px 16px rgba(212,160,23,0.3);
  }
  .cb-accept:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(212,160,23,0.45); }

  /* ═══════════════════════════════════════
     BACK TO TOP
  ═══════════════════════════════════════ */
  #btt {
    position: fixed; bottom: 24px; right: 24px;
    width: 46px; height: 46px; border-radius: 50%;
    background: linear-gradient(135deg, #D4A017, #E5C46A);
    color: #072B1E; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    z-index: 900; opacity: 0; visibility: hidden;
    transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
    box-shadow: 0 4px 20px rgba(212,160,23,0.4);
    transform: translateY(12px);
  }
  #btt.show {
    opacity: 1; visibility: visible; transform: translateY(0);
  }
  #btt:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 32px rgba(212,160,23,0.55);
  }

  @media (max-width: 768px) {
    .cb-inner { flex-direction: column; gap: 16px; }
    .cb-actions { width: 100%; justify-content: flex-end; }
    #btt { bottom: 20px; right: 16px; width: 42px; height: 42px; }
  }
`,
  `
  @keyframes mdRipple { to { transform: scale(12); opacity: 0; } }
  `,
];
