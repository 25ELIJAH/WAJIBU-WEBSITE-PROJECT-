export const CSS: string[] = [
  `@font-face{font-display:swap}`,
  `
    /* ── Variables ─────────────────────────────────── */
    :root {
      --green-dark:   #0A3D2A;
      --green-deeper: #072B1E;
      --gold:         #D4A017;
      --gold-soft:    #E5C46A;
      --cream:        #F8F5F0;
      --white:        #FFFFFF;
      --charcoal:     #1A2521;
      --gray:         #7B8580;
      --font-serif:   'Cormorant Garamond', Georgia, serif;
      --font-sans:    'Inter', system-ui, sans-serif;
      --nav-h:        90px;
      --transition:   0.35s cubic-bezier(0.4,0,0.2,1);
    }

    /* ── Reset ─────────────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: var(--font-sans); color: var(--charcoal); background: var(--white); overflow-x: hidden; -webkit-font-smoothing: antialiased; }
    img { max-width: 100%; display: block; }
    a { text-decoration: none; color: inherit; }
    ul { list-style: none; }
    button { cursor: pointer; border: none; background: none; font-family: inherit; }

    /* ── Scroll Progress ───────────────────────────── */
    #scroll-progress { position: fixed; top: 0; left: 0; height: 2px; background: linear-gradient(90deg, var(--gold), var(--gold-soft)); width: 0%; z-index: 9999; }

    /* ── Navbar — positioning/bg handled by global.css gooey pill ── */
    .nav-inner { width: 100%; display: flex; align-items: center; justify-content: space-between; }
    .nav-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
    /* ── WAJIBU LOGO — Animated ───────────────────────────── */
    .nav-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
    .nav-logo-wrap {
      position: relative;
      width: 52px; height: 52px;
      flex-shrink: 0;
    }
    .nav-logo-img {
      width: 52px; height: 52px;
      border-radius: 50%;
      object-fit: cover;
      object-position: center 18%;
      display: block;
      position: relative; z-index: 2;
      transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
    }
    /* Spinning gold ring */
    .nav-logo-ring {
      position: absolute; inset: -4px;
      border-radius: 50%;
      background: conic-gradient(
        from 0deg,
        transparent 0deg,
        #D4A017 60deg,
        #E5C46A 120deg,
        transparent 180deg,
        transparent 240deg,
        #D4A017 300deg,
        transparent 360deg
      );
      animation: logoSpin 4s linear infinite;
      z-index: 1;
    }
    /* Inner mask to make ring look like border */
    .nav-logo-ring::after {
      content: '';
      position: absolute;
      inset: 3px;
      border-radius: 50%;
      background: var(--gdp, #072B1E);
    }
    /* Glow pulse */
    .nav-logo-glow {
      position: absolute; inset: -8px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(212,160,23,0.35) 0%, transparent 70%);
      animation: logoGlow 2.5s ease-in-out infinite;
      z-index: 0;
    }
    @keyframes logoSpin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes logoGlow {
      0%, 100% { opacity: 0.4; transform: scale(0.95); }
      50%       { opacity: 1;   transform: scale(1.1); }
    }
    .nav-logo:hover .nav-logo-img {
      transform: scale(1.08);
    }
    .nav-logo:hover .nav-logo-ring {
      animation-duration: 1.2s;
    }
    .nav-logo:hover .nav-logo-glow {
      opacity: 1;
      animation-duration: 0.8s;
    }
    /* Footer logo — slightly smaller */
    .footer-logo-wrap .nav-logo-wrap {
      width: 54px; height: 54px;
    }
    .footer-logo-wrap .nav-logo-img {
      width: 54px; height: 54px;
    }
    .footer-logo-wrap .nav-logo-ring::after {
      background: var(--gdp, #072B1E);
    }
    .nav-logo-name { font-family: var(--font-serif); font-size: 22px; font-weight: 700; color: var(--white); letter-spacing: 3px; line-height: 1; }
    .nav-logo-tag { font-size: 8px; font-weight: 400; letter-spacing: 2px; color: var(--gold-soft); text-transform: uppercase; margin-top: 2px; }
    .nav-menu { display: flex; align-items: center; gap: 36px; }
    .nav-menu a { font-size: 13px; font-weight: 500; letter-spacing: 1.2px; text-transform: uppercase; color: rgba(255,255,255,0.82); position: relative; padding-bottom: 4px; transition: color var(--transition); }
    .nav-menu a::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 1px; background: var(--gold); transition: width var(--transition); }
    .nav-menu a:hover, .nav-menu a.active { color: var(--gold-soft); }
    .nav-menu a:hover::after, .nav-menu a.active::after { width: 100%; }
    .nav-cta { background: linear-gradient(135deg, var(--gold), var(--gold-soft)); color: var(--green-deeper) !important; padding: 12px 28px; border-radius: 50px; font-size: 13px !important; font-weight: 600 !important; letter-spacing: 0.8px; display: inline-flex; align-items: center; gap: 8px; transition: all var(--transition) !important; box-shadow: 0 4px 20px rgba(212,160,23,0.3); }
    .nav-cta::after { display: none !important; }
    .nav-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(212,160,23,0.5) !important; }
    /* .nav-burger, .mobile-drawer — handled by mobile-menu-css block below */
    .mobile-drawer a:hover { color: var(--gold-soft); }
    .mobile-drawer-cta { margin-top: 40px; background: linear-gradient(135deg, var(--gold), var(--gold-soft)); color: var(--green-deeper) !important; border-radius: 50px; padding: 18px 36px !important; font-size: 16px !important; font-weight: 600 !important; text-align: center; border: none !important; }

    /* ── Shared ────────────────────────────────────── */
    .section-inner { max-width: 1200px; margin: 0 auto; }
    .section-eyebrow { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--gold); font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 12px; }
    .section-eyebrow::before { content: ''; width: 28px; height: 1px; background: var(--gold); }
    .section-title { font-family: var(--font-serif); font-size: clamp(36px, 4vw, 60px); font-weight: 600; line-height: 1.12; color: var(--green-dark); margin-bottom: 18px; }
    .section-sub { font-size: 17px; color: var(--gray); font-weight: 300; max-width: 560px; line-height: 1.7; }
    .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
    .reveal.visible { opacity: 1; transform: translateY(0); }

    /* ── Page Hero ─────────────────────────────────── */
    #page-hero {
      padding-top: var(--nav-h);
      background: linear-gradient(135deg, var(--green-deeper) 0%, var(--green-dark) 60%, #0d4f35 100%);
      position: relative; overflow: hidden;
    }
    #page-hero::after {
      content: '';
      position: absolute; inset: 0;
      background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.018'%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
    .page-hero-inner {
      max-width: 1200px; margin: 0 auto;
      padding: 100px 5% 90px;
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 80px; align-items: center;
      position: relative; z-index: 1;
    }
    .page-hero-eyebrow { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--gold-soft); font-weight: 500; margin-bottom: 20px; display: flex; align-items: center; gap: 12px; }
    .page-hero-eyebrow::before { content: ''; width: 28px; height: 1px; background: var(--gold-soft); }
    .page-hero-title { font-family: var(--font-serif); font-size: clamp(46px, 5vw, 76px); font-weight: 600; color: var(--white); line-height: 1.08; margin-bottom: 24px; }
    .page-hero-title .gold { color: var(--gold); font-style: italic; }
    .page-hero-sub { font-size: 17px; color: rgba(255,255,255,0.7); font-weight: 300; line-height: 1.7; margin-bottom: 40px; max-width: 460px; }
    .hero-service-pills { display: flex; flex-wrap: wrap; gap: 10px; }
    .hero-pill { padding: 8px 18px; border-radius: 50px; border: 1px solid rgba(212,160,23,0.35); font-size: 12px; font-weight: 500; letter-spacing: 0.5px; color: rgba(255,255,255,0.75); transition: all var(--transition); cursor: pointer; }
    .hero-pill:hover { background: rgba(212,160,23,0.12); border-color: var(--gold); color: var(--gold-soft); }
    .page-hero-right { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .hero-service-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px; padding: 24px 20px;
      transition: all var(--transition);
    }
    .hero-service-card:hover { background: rgba(255,255,255,0.07); border-color: rgba(212,160,23,0.25); transform: translateY(-3px); }
    .hero-service-card svg { color: var(--gold); margin-bottom: 14px; }
    .hero-service-card h4 { font-family: var(--font-serif); font-size: 17px; font-weight: 600; color: var(--white); margin-bottom: 6px; }
    .hero-service-card p { font-size: 12px; color: rgba(255,255,255,0.5); line-height: 1.5; }

    /* ── Breadcrumb ────────────────────────────────── */
    .breadcrumb { background: var(--cream); padding: 16px 5%; border-bottom: 1px solid rgba(10,61,42,0.07); }
    .breadcrumb-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 8px; }
    .breadcrumb a, .breadcrumb span { font-size: 12px; color: var(--gray); letter-spacing: 0.5px; }
    .breadcrumb a:hover { color: var(--green-dark); }
    .breadcrumb .sep { color: var(--gold); }
    .breadcrumb .current { color: var(--green-dark); font-weight: 500; }

    /* ── Services Nav Tabs ─────────────────────────── */
    #services-nav { background: var(--white); border-bottom: 1px solid rgba(10,61,42,0.07); position: sticky; top: var(--nav-h); z-index: 100; }
    .services-nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 5%; display: flex; gap: 0; overflow-x: auto; scrollbar-width: none; }
    .services-nav-inner::-webkit-scrollbar { display: none; }
    .svc-tab { padding: 20px 28px; font-size: 13px; font-weight: 500; letter-spacing: 0.5px; color: var(--gray); white-space: nowrap; border-bottom: 2px solid transparent; transition: all var(--transition); cursor: pointer; }
    .svc-tab:hover { color: var(--green-dark); }
    .svc-tab.active { color: var(--green-dark); border-bottom-color: var(--gold); font-weight: 600; }

    /* ── Service Detail Sections ───────────────────── */
    .service-section { padding: 110px 5%; }
    .service-section:nth-child(even) { background: var(--cream); }
    .service-section:nth-child(odd) { background: var(--white); }

    .service-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
    .service-detail-grid.reverse { direction: rtl; }
    .service-detail-grid.reverse > * { direction: ltr; }

    .service-badge {
      display: inline-flex; align-items: center; gap: 10px;
      background: rgba(10,61,42,0.05); border: 1px solid rgba(212,160,23,0.2);
      padding: 8px 16px; border-radius: 50px;
      font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;
      color: var(--green-dark); margin-bottom: 24px;
    }
    .service-badge svg { color: var(--gold); }

    .service-body { font-size: 16px; color: var(--gray); line-height: 1.85; font-weight: 300; margin-bottom: 22px; }

    .service-deliverables { margin: 36px 0; }
    .service-deliverables h4 { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: var(--green-dark); font-weight: 600; margin-bottom: 18px; }
    .deliverable-list { display: flex; flex-direction: column; gap: 12px; }
    .deliverable-item { display: flex; align-items: flex-start; gap: 12px; font-size: 14px; color: var(--charcoal); line-height: 1.5; }
    .deliverable-check { width: 20px; height: 20px; border-radius: 50%; background: rgba(10,61,42,0.07); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
    .deliverable-check svg { color: var(--gold); }

    .service-cta-row { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; margin-top: 36px; }
    .btn-primary { background: linear-gradient(135deg, var(--gold), var(--gold-soft)); color: var(--green-deeper); padding: 14px 32px; border-radius: 50px; font-size: 13px; font-weight: 600; letter-spacing: 0.8px; display: inline-flex; align-items: center; gap: 8px; transition: all var(--transition); box-shadow: 0 6px 24px rgba(212,160,23,0.35); }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 36px rgba(212,160,23,0.5); }
    .btn-primary svg { transition: transform var(--transition); }
    .btn-primary:hover svg { transform: translateX(4px); }
    .btn-ghost { font-size: 13px; font-weight: 500; color: var(--green-dark); display: inline-flex; align-items: center; gap: 8px; transition: gap var(--transition); }
    .btn-ghost:hover { gap: 14px; color: var(--gold); }

    /* Service visual — image wrapper holds stat overlay, info cards sit below in flow */
    .service-visual { display: flex; flex-direction: column; gap: 16px; }
    .service-img-frame {
      position: relative;           /* overlay anchors to THIS wrapper only */
      border-radius: 8px;
      overflow: hidden;             /* keeps overlay clipped inside image */
    }
    .service-img-frame::before {
      content: ''; position: absolute; top: -16px; left: -16px; right: 16px; bottom: 16px;
      border: 1px solid rgba(212,160,23,0.25); border-radius: 8px; z-index: -1;
      pointer-events: none;
    }
    .service-img { width: 100%; height: 380px; object-fit: cover; display: block; }
    .service-stat-overlay {
      position: absolute; bottom: 0; left: 0; right: 0;  /* full-width bar at image bottom */
      background: rgba(7,43,30,0.88); backdrop-filter: blur(10px);
      padding: 16px 24px;
      border-top: 1px solid rgba(212,160,23,0.2);
      display: flex; align-items: center; gap: 20px;
    }
    .service-stat-overlay .stat-num { font-family: var(--font-serif); font-size: 28px; font-weight: 700; color: var(--gold); line-height: 1; }
    .service-stat-overlay .stat-lbl { font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 3px; }

    /* Info cards — normal block flow, never overlap the image */
    .service-info-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .service-info-card { background: var(--white); border: 1px solid rgba(10,61,42,0.08); border-radius: 8px; padding: 18px 16px; transition: all var(--transition); }
    .service-section:nth-child(even) .service-info-card { background: var(--cream); }
    .service-info-card:hover { border-color: rgba(212,160,23,0.3); box-shadow: 0 8px 24px rgba(10,61,42,0.08); }
    .service-info-card h5 { font-size: 13px; font-weight: 600; color: var(--green-dark); margin-bottom: 6px; }
    .service-info-card p { font-size: 12px; color: var(--gray); line-height: 1.5; }

    /* ── Sectors ───────────────────────────────────── */
    #sectors { padding: 110px 5%; background: var(--green-deeper); position: relative; overflow: hidden; }
    #sectors::before { content: ''; position: absolute; inset: 0; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.015'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
    .sectors-inner { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; }
    .sectors-header { text-align: center; margin-bottom: 64px; }
    .sectors-header .section-eyebrow { justify-content: center; color: var(--gold-soft); }
    .sectors-header .section-eyebrow::before { display: none; }
    .sectors-header .section-eyebrow::after { content: ''; width: 28px; height: 1px; background: var(--gold-soft); }
    .sectors-header .section-title { color: var(--white); }
    .sectors-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .sector-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 32px 24px; text-align: center; transition: all var(--transition); }
    .sector-card:hover { background: rgba(255,255,255,0.08); border-color: rgba(212,160,23,0.25); transform: translateY(-4px); }
    .sector-card svg { color: var(--gold); margin: 0 auto 18px; }
    .sector-card h4 { font-family: var(--font-serif); font-size: 18px; font-weight: 600; color: var(--white); margin-bottom: 10px; }
    .sector-card p { font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.6; }

    /* ── Comparison Table ──────────────────────────── */
    #comparison { padding: 110px 5%; background: var(--cream); }
    .comparison-header { text-align: center; margin-bottom: 64px; }
    .comparison-header .section-eyebrow { justify-content: center; }
    .comparison-header .section-eyebrow::before { display: none; }
    .comparison-header .section-eyebrow::after { content: ''; width: 28px; height: 1px; background: var(--gold); }
    .comparison-table { width: 100%; border-collapse: collapse; background: var(--white); border-radius: 8px; overflow: hidden; box-shadow: 0 4px 40px rgba(10,61,42,0.07); }
    .comparison-table th { background: var(--green-dark); color: var(--white); padding: 20px 24px; font-size: 13px; font-weight: 600; letter-spacing: 0.8px; text-align: left; }
    .comparison-table th:first-child { width: 30%; }
    .comparison-table th.highlight { background: var(--gold); color: var(--green-deeper); }
    .comparison-table td { padding: 16px 24px; font-size: 14px; color: var(--charcoal); border-bottom: 1px solid rgba(10,61,42,0.06); vertical-align: middle; }
    .comparison-table tr:last-child td { border-bottom: none; }
    .comparison-table tr:hover td { background: rgba(10,61,42,0.02); }
    .comparison-table td.highlight { background: rgba(212,160,23,0.04); }
    .check-yes { color: var(--green-dark); font-weight: 600; }
    .check-partial { color: var(--gold); }
    .check-no { color: #ccc; }

    /* ── Process ───────────────────────────────────── */
    #process-strip { padding: 110px 5%; background: var(--white); }
    .process-header { text-align: center; margin-bottom: 72px; }
    .process-header .section-eyebrow { justify-content: center; }
    .process-header .section-eyebrow::before { display: none; }
    .process-header .section-eyebrow::after { content: ''; width: 28px; height: 1px; background: var(--gold); }
    .process-header .section-sub { margin: 0 auto; }
    .process-steps { display: grid; grid-template-columns: repeat(6, 1fr); position: relative; }
    .process-steps::before { content: ''; position: absolute; top: 35px; left: calc(100%/12); right: calc(100%/12); height: 1px; background: linear-gradient(90deg, var(--gold), var(--gold-soft), var(--gold)); z-index: 0; }
    .process-step { text-align: center; padding: 0 10px; position: relative; z-index: 1; }
    .step-circle { width: 70px; height: 70px; border-radius: 50%; background: var(--white); border: 1.5px solid var(--gold); margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; transition: all var(--transition); }
    .step-circle:hover { background: var(--gold); transform: scale(1.08); }
    .step-circle svg { color: var(--gold); transition: color var(--transition); }
    .step-circle:hover svg { color: var(--green-deeper); }
    .step-title { font-family: var(--font-serif); font-size: 15px; font-weight: 600; color: var(--green-dark); margin-bottom: 8px; }
    .step-desc { font-size: 11px; color: var(--gray); line-height: 1.6; }

    /* ── FAQ ───────────────────────────────────────── */
    #faq { padding: 110px 5%; background: var(--cream); }
    .faq-header { text-align: center; margin-bottom: 64px; }
    .faq-header .section-eyebrow { justify-content: center; }
    .faq-header .section-eyebrow::before { display: none; }
    .faq-header .section-eyebrow::after { content: ''; width: 28px; height: 1px; background: var(--gold); }
    .faq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 1000px; margin: 0 auto; }
    .faq-item { background: var(--white); border: 1px solid rgba(10,61,42,0.07); border-radius: 8px; overflow: hidden; }
    .faq-question { padding: 22px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; cursor: pointer; transition: background var(--transition); }
    .faq-question:hover { background: rgba(10,61,42,0.02); }
    .faq-question h4 { font-size: 15px; font-weight: 500; color: var(--green-dark); line-height: 1.4; }
    .faq-icon { width: 28px; height: 28px; border-radius: 50%; border: 1px solid rgba(10,61,42,0.15); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all var(--transition); }
    .faq-icon svg { color: var(--gold); transition: transform var(--transition); }
    .faq-item.open .faq-icon { background: var(--gold); border-color: var(--gold); }
    .faq-item.open .faq-icon svg { transform: rotate(45deg); color: var(--green-deeper); }
    .faq-answer { padding: 0 24px; max-height: 0; overflow: hidden; transition: max-height 0.4s ease, padding 0.3s ease; }
    .faq-item.open .faq-answer { max-height: 200px; padding-bottom: 22px; }
    .faq-answer p { font-size: 14px; color: var(--gray); line-height: 1.7; font-weight: 300; }

    /* ── CTA Banner ────────────────────────────────── */
    #cta-banner { background: linear-gradient(135deg, var(--gold) 0%, #b8860b 50%, var(--gold-soft) 100%); padding: 90px 5%; text-align: center; position: relative; overflow: hidden; }
    #cta-banner::before { content: ''; position: absolute; inset: 0; background: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Ccircle cx='40' cy='40' r='20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
    .cta-inner { position: relative; max-width: 700px; margin: 0 auto; }
    .cta-eyebrow { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: rgba(7,43,30,0.7); font-weight: 600; margin-bottom: 16px; }
    #cta-banner h2 { font-family: var(--font-serif); font-size: clamp(38px, 4vw, 56px); font-weight: 700; color: var(--green-deeper); margin-bottom: 18px; line-height: 1.1; }
    #cta-banner p { font-size: 17px; color: rgba(7,43,30,0.75); font-weight: 300; margin-bottom: 44px; line-height: 1.6; }
    .btn-dark { background: var(--green-deeper); color: var(--white); padding: 18px 44px; border-radius: 50px; font-size: 14px; font-weight: 600; letter-spacing: 0.8px; display: inline-flex; align-items: center; gap: 10px; transition: all var(--transition); box-shadow: 0 8px 30px rgba(7,43,30,0.3); }
    .btn-dark:hover { transform: translateY(-3px); box-shadow: 0 16px 45px rgba(7,43,30,0.4); }
    .btn-dark svg { transition: transform var(--transition); }
    .btn-dark:hover svg { transform: translateX(4px); }

    /* ── Footer ────────────────────────────────────── */
    #footer { background: var(--green-deeper); padding: 90px 5% 0; color: rgba(255,255,255,0.7); }
    .footer-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1.8fr 1fr 1fr 1.5fr; gap: 60px; padding-bottom: 60px; border-bottom: 1px solid rgba(255,255,255,0.07); }
    .footer-mission { font-size: 14px; line-height: 1.75; color: rgba(255,255,255,0.55); margin-top: 20px; margin-bottom: 28px; }
    .footer-socials { display: flex; gap: 12px; }
    .social-btn { width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.5); transition: all var(--transition); }
    .social-btn:hover { border-color: var(--gold); color: var(--gold); }
    .footer-col h4 { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--white); font-weight: 600; margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1px solid rgba(212,160,23,0.2); }
    .footer-col li { margin-bottom: 12px; }
    .footer-col a { font-size: 14px; color: rgba(255,255,255,0.55); transition: color var(--transition); }
    .footer-col a:hover { color: var(--gold-soft); }
    .footer-contact-item { display: flex; align-items: flex-start; gap: 12px; font-size: 14px; color: rgba(255,255,255,0.55); margin-bottom: 16px; line-height: 1.5; }
    .footer-contact-item svg { color: var(--gold); flex-shrink: 0; margin-top: 2px; }
    .newsletter-form { display: flex; overflow: hidden; border-radius: 50px; border: 1px solid rgba(255,255,255,0.12); margin-top: 14px; }
    .newsletter-form input { flex: 1; padding: 12px 18px; background: rgba(255,255,255,0.05); border: none; outline: none; color: var(--white); font-size: 13px; font-family: var(--font-sans); }
    .newsletter-form input::placeholder { color: rgba(255,255,255,0.3); }
    .newsletter-form button { padding: 12px 20px; background: var(--gold); color: var(--green-deeper); font-size: 13px; font-weight: 600; border-radius: 0 50px 50px 0; transition: background var(--transition); }
    .newsletter-form button:hover { background: var(--gold-soft); }
    .footer-bottom { max-width: 1200px; margin: 0 auto; padding: 24px 0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
    .footer-copyright { font-size: 13px; color: rgba(255,255,255,0.35); }
    .footer-legal { display: flex; gap: 24px; }
    .footer-legal a { font-size: 13px; color: rgba(255,255,255,0.35); transition: color var(--transition); }
    .footer-legal a:hover { color: var(--gold-soft); }

    /* ── Responsive ────────────────────────────────── */
    @media (max-width: 1024px) {
      .page-hero-inner { grid-template-columns: 1fr; gap: 40px; }
      .page-hero-right { display: none; }
      .service-detail-grid { grid-template-columns: 1fr; gap: 48px; }
      .service-detail-grid.reverse { direction: ltr; }
      .sectors-grid { grid-template-columns: repeat(2, 1fr); }
      .process-steps { grid-template-columns: repeat(3, 1fr); gap: 28px; }
      .process-steps::before { display: none; }
      .faq-grid { grid-template-columns: 1fr; }
      .footer-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
    }
    @media (max-width: 768px) {
      :root { --nav-h: 72px; }
      .nav-menu, .nav-cta { display: none; }
      .nav-burger { display: flex; }
      .sectors-grid { grid-template-columns: 1fr 1fr; }
      .process-steps { grid-template-columns: repeat(2, 1fr); }
      .service-info-cards { grid-template-columns: 1fr; }
      .comparison-table { font-size: 12px; }
      .comparison-table th, .comparison-table td { padding: 12px 14px; }
      .footer-grid { grid-template-columns: 1fr; gap: 36px; }
    }
    @media (max-width: 480px) {
      .sectors-grid { grid-template-columns: 1fr; }
      .process-steps { grid-template-columns: 1fr; }
    }

    @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  `,
  `
    #footer {
      background: #072B1E;
      padding: 36px 5% 0;
      color: rgba(255,255,255,0.7);
    }
    #footer .footer-grid {
      display: grid !important;
      grid-template-columns: 1.8fr 1fr 1fr 1.5fr !important;
      gap: 40px !important;
      max-width: 1200px !important;
      margin: 0 auto !important;
      padding-bottom: 24px !important;
      align-items: start !important;
    }
    @media (max-width: 900px) {
      #footer .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }
    }
    @media (max-width: 480px) {
      #footer .footer-grid { grid-template-columns: 1fr !important; gap: 18px !important; }
    }
  `,
  `
    @media (min-width: 769px) {
      #navbar .nav-cta,
      #nb .nav-cta { display: inline-flex !important; }
    }
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
  `
/* WAJIBU Animation Suite v3 */
#wj-progress{position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,#D4A017,#E5C46A,#D4A017);width:0%;z-index:10000;pointer-events:none}
.wj-cur{position:fixed;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle,rgba(212,160,23,0.4) 0%,transparent 70%);pointer-events:none;z-index:9998;transform:translate(-50%,-50%);mix-blend-mode:screen}
.wj-ring{position:fixed;width:52px;height:52px;border:1px solid rgba(212,160,23,0.22);border-radius:50%;pointer-events:none;z-index:9997;transform:translate(-50%,-50%)}
@keyframes wjCharUp{to{transform:translateY(0)}}
@keyframes wjPulseRing{0%{transform:scale(1);opacity:0.7}100%{transform:scale(1.8);opacity:0}}
@keyframes wjGlitch{0%,88%,100%{clip-path:none;transform:none}89%{clip-path:polygon(0 18%,100% 18%,100% 22%,0 22%);transform:translateX(-3px)}90%{clip-path:polygon(0 55%,100% 55%,100% 59%,0 59%);transform:translateX(2px)}91%{clip-path:none;transform:none}95%{clip-path:polygon(0 38%,100% 38%,100% 41%,0 41%);transform:translateX(-1px)}96%{clip-path:none;transform:none}}
.wj-glitch{animation:wjGlitch 9s ease-in-out infinite}
.wj-pulse-cta{position:relative}
.wj-pulse-cta::after{content:'';position:absolute;inset:0;border-radius:inherit;border:1.5px solid rgba(212,160,23,0.5);animation:wjPulseRing 2.4s ease-out infinite;pointer-events:none}
`,
];
