export const CSS: string[] = [
  `
    /* ── Variables ─────────────────────────────────────────── */
    :root {
      --gd: #0A3D2A; --gdp: #072B1E;
      --gold: #D4A017; --golds: #E5C46A; --goldl: #f0d48a;
      --cream: #F8F5F0; --white: #FFFFFF;
      --char: #1A2521; --gray: #7B8580;
      --serif: 'Cormorant Garamond', Georgia, serif;
      --sans: 'Inter', system-ui, sans-serif;
      --nh: 90px;
      --tr: 0.35s cubic-bezier(0.4,0,0.2,1);
    }

    /* ── Reset ──────────────────────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
    body { font-family: var(--sans); color: var(--char); background: var(--white); overflow-x: hidden; -webkit-font-smoothing: antialiased; -webkit-tap-highlight-color: transparent; }
    img { max-width: 100%; display: block; }
    a { text-decoration: none; color: inherit; }
    ul { list-style: none; }
    button { cursor: pointer; border: none; background: none; font-family: inherit; }

    /* ── Scroll Progress ────────────────────────────────────── */
    #scroll-progress { position: fixed; top: 0; left: 0; height: 2px; background: linear-gradient(90deg, var(--gold), var(--golds)); width: 0%; z-index: 9999; transition: width 0.1s linear; }

    /* ── LOGO ───────────────────────────────────────────────── */
    .logo-wrap {
      display: flex; align-items: center; gap: 11px;
      text-decoration: none;
    }
    .logo-ring-wrap {
      position: relative; width: 50px; height: 50px; flex-shrink: 0;
    }
    .logo-img {
      width: 50px; height: 50px; border-radius: 50%;
      object-fit: cover; object-position: center 18%;
      position: relative; z-index: 2; display: block;
      will-change: transform;
      transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
    }
    .logo-ring {
      position: absolute; inset: -4px; border-radius: 50%;
      background: conic-gradient(from 0deg, transparent 0deg, #D4A017 60deg, #E5C46A 120deg, transparent 180deg, transparent 240deg, #D4A017 300deg, transparent 360deg);
      animation: logoSpin 4s linear infinite;
      will-change: transform; z-index: 1;
    }
    .logo-ring::after {
      content: ''; position: absolute; inset: 3px; border-radius: 50%; background: var(--gdp);
    }
    .logo-glow {
      position: absolute; inset: -8px; border-radius: 50%;
      background: radial-gradient(circle, rgba(212,160,23,0.3) 0%, transparent 70%);
      animation: logoGlow 2.5s ease-in-out infinite;
      will-change: opacity, transform; z-index: 0;
    }
    .logo-name {
      font-family: var(--serif); font-size: 22px; font-weight: 700;
      color: var(--white); letter-spacing: 3px; line-height: 1;
    }
    .logo-tag {
      font-size: 8px; font-weight: 400; letter-spacing: 2px;
      color: var(--golds); text-transform: uppercase; margin-top: 3px;
    }
    .logo-wrap:hover .logo-img { transform: scale(1.07); }
    .logo-wrap:hover .logo-ring { animation-duration: 1.2s; }
    @keyframes logoSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes logoGlow { 0%,100% { opacity:0.4; transform:scale(0.95); } 50% { opacity:1; transform:scale(1.1); } }

    /* ── NAVBAR ─────────────────────────────────────────────── */
    #navbar {
      position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
      z-index: 1000; height: 62px;
      width: calc(100% - 40px); max-width: 1080px;
      border-radius: 100px; display: flex; align-items: center; padding: 0 8px;
      background: rgba(255,255,255,0.07);
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255,255,255,0.18);
      box-shadow: 0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08);
      transition: background 0.6s cubic-bezier(0.16,1,0.3,1),
                  border-color 0.6s cubic-bezier(0.16,1,0.3,1),
                  box-shadow 0.6s cubic-bezier(0.16,1,0.3,1);
    }
    #navbar.scrolled, #navbar:hover {
      background: rgba(7,43,30,0.96);
      border-color: rgba(212,160,23,0.22);
      box-shadow: 0 8px 48px rgba(0,0,0,0.45);
    }
    .nav-inner { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 8px; }

    /* ── GOOEY BLOB LAYER ── */
    .goo-nav-wrap { position: relative; display: flex; align-items: center; }
    .goo-layer { position: absolute; inset: -8px; pointer-events: none; filter: url(#goo-nav); overflow: visible; }
    .goo-blob {
      position: absolute; height: calc(100% + 16px); top: -8px;
      background: rgba(212,160,23,0.22); border-radius: 100px;
      left: 0; width: 0;
      transition: left 0.5s cubic-bezier(0.34,1.56,0.64,1),
                  width 0.5s cubic-bezier(0.34,1.56,0.64,1),
                  opacity 0.3s ease;
      opacity: 0;
    }
    .goo-nav-wrap:hover .goo-blob { opacity: 1; }

    .nav-menu { display: flex; align-items: center; gap: 2px; list-style: none; position: relative; z-index: 1; }
    .nav-menu a {
      font-size: 12px; font-weight: 500; letter-spacing: 1.1px;
      text-transform: uppercase; color: rgba(255,255,255,0.92);
      padding: 9px 15px; border-radius: 100px; display: block; white-space: nowrap;
      transition: color 0.3s ease;
      text-shadow: 0 1px 8px rgba(0,0,0,0.6);
    }
    .nav-menu a:hover { color: var(--gold); }
    .nav-menu a[aria-current="page"] { color: var(--golds); }

    .nav-cta {
      background: linear-gradient(135deg, var(--gold), var(--golds));
      color: var(--gdp) !important; padding: 11px 22px; border-radius: 50px;
      font-size: 12px; font-weight: 600; letter-spacing: 0.8px; flex-shrink: 0;
      display: inline-flex; align-items: center; gap: 8px;
      transition: all 0.3s ease; box-shadow: 0 4px 20px rgba(212,160,23,0.3);
    }
    .nav-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(212,160,23,0.5); }
    .nav-cta svg { transition: transform 0.3s ease; }
    .nav-cta:hover svg { transform: translateX(3px); }

    .nav-burger {
      display: none; width: 44px; height: 44px; background: none; border: none;
      cursor: pointer; color: var(--white); align-items: center; justify-content: center;
      position: relative; z-index: 1100; flex-shrink: 0;
    }
    .burger-box { display: flex; flex-direction: column; gap: 5px; }
    .burger-line { display: block; width: 24px; height: 1.5px; background: currentColor; transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1); border-radius: 2px; }

    /* ── SHARED UTILITIES ───────────────────────────────────── */
    .section-inner { max-width: 1200px; margin: 0 auto; }
    .section-eyebrow { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--gold); font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 12px; }
    .section-eyebrow::before { content: ''; width: 28px; height: 1px; background: var(--gold); }
    .section-title { font-family: var(--serif); font-size: clamp(36px,4vw,60px); font-weight: 600; line-height: 1.12; color: var(--gd); margin-bottom: 18px; }
    .section-sub { font-size: 17px; color: var(--gray); font-weight: 300; max-width: 560px; line-height: 1.7; margin-bottom: 60px; }
    .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; will-change: opacity, transform; }
    .reveal.visible { opacity: 1; transform: translateY(0); }

    /* ── HERO — base rules (detail overridden by inline hero <style> block below) ── */
    .btn-primary { background: linear-gradient(135deg, var(--gold), var(--golds)); color: var(--gdp); padding: 16px 36px; border-radius: 50px; font-size: 14px; font-weight: 600; letter-spacing: 0.8px; display: inline-flex; align-items: center; gap: 10px; transition: all var(--tr); box-shadow: 0 6px 30px rgba(212,160,23,0.4); }
    .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 14px 40px rgba(212,160,23,0.55); }
    .btn-primary svg { transition: transform var(--tr); }
    .btn-primary:hover svg { transform: translateX(4px); }
    .btn-secondary { display: inline-flex; align-items: center; gap: 12px; color: var(--white); font-size: 14px; font-weight: 500; letter-spacing: 0.5px; transition: color var(--tr); }
    .btn-secondary:hover { color: var(--golds); }
    .play-circle { width: 48px; height: 48px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center; transition: all var(--tr); }
    .btn-secondary:hover .play-circle { border-color: var(--gold); background: rgba(212,160,23,0.1); }
    .hero-scroll span { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.5); }
    .scroll-line { width: 1px; height: 48px; background: linear-gradient(to bottom, var(--gold), transparent); animation: scrollPulse 2s ease-in-out infinite; }
    @keyframes scrollPulse { 0%,100% { opacity:1; transform:scaleY(1); } 50% { opacity:0.4; transform:scaleY(0.7); } }

    /* ── TRUST BAR ──────────────────────────────────────────── */
    #trust-bar { background: var(--cream); border-top: 1px solid rgba(212,160,23,0.2); border-bottom: 1px solid rgba(212,160,23,0.2); padding: 32px 5%; }
    .trust-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
    .trust-label { font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--gray); font-weight: 500; border-right: 1px solid rgba(212,160,23,0.3); padding-right: 28px; white-space: nowrap; }
    .trust-items { display: flex; align-items: center; gap: 36px; flex-wrap: wrap; flex: 1; justify-content: space-around; }
    .trust-item { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 500; color: var(--char); letter-spacing: 0.5px; }
    .trust-icon { width: 32px; height: 32px; background: rgba(10,61,42,0.06); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .trust-icon svg { color: var(--gold); }

    /* ── SERVICES ───────────────────────────────────────────── */
    #services { padding: 100px 5%; background: var(--white); }
    .services-header { text-align: center; margin-bottom: 60px; }
    .services-header .section-eyebrow { justify-content: center; }
    .services-header .section-eyebrow::before { display: none; }
    .services-header .section-eyebrow::after { content: ''; width: 28px; height: 1px; background: var(--gold); }
    .services-header .section-sub { margin: 0 auto; }
    .services-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 28px; max-width: 1200px; margin: 0 auto; }
    .service-card { background: var(--white); border: 1px solid rgba(10,61,42,0.08); border-radius: 8px; padding: 40px 32px; position: relative; overflow: hidden; transition: all var(--tr); }
    .service-card::before { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 3px; background: linear-gradient(90deg, var(--gold), var(--golds)); transition: width var(--tr); }
    .service-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(10,61,42,0.12); border-color: rgba(212,160,23,0.3); }
    .service-card:hover::before { width: 100%; }
    .service-card-icon { width: 52px; height: 52px; margin-bottom: 24px; background: rgba(10,61,42,0.05); border-radius: 12px; display: flex; align-items: center; justify-content: center; transition: background var(--tr); }
    .service-card:hover .service-card-icon { background: rgba(212,160,23,0.1); }
    .service-card-icon svg { color: var(--gold); }
    .service-card h3 { font-family: var(--serif); font-size: 22px; font-weight: 600; color: var(--gd); margin-bottom: 14px; }
    .service-card p { font-size: 14px; color: var(--gray); line-height: 1.75; margin-bottom: 28px; }
    .service-link { font-size: 13px; font-weight: 500; color: var(--gd); letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 8px; transition: gap var(--tr), color var(--tr); }
    .service-link:hover { gap: 14px; color: var(--gold); }

    /* ── IMPACT NUMBERS ─────────────────────────────────────── */
    #impact-numbers { background: linear-gradient(135deg, var(--gdp) 0%, var(--gd) 100%); padding: 90px 5%; position: relative; overflow: hidden; }
    #impact-numbers::before { content: ''; position: absolute; inset: 0; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
    .impact-header { text-align: center; margin-bottom: 64px; }
    .impact-header .section-eyebrow { justify-content: center; color: var(--golds); }
    .impact-header .section-eyebrow::before { display: none; }
    .impact-header .section-eyebrow::after { content: ''; width: 28px; height: 1px; background: var(--golds); }
    .impact-header .section-title { color: var(--white); }
    .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 2px; max-width: 1200px; margin: 0 auto; }
    .stat-item { text-align: center; padding: 50px 24px; border-right: 1px solid rgba(255,255,255,0.06); }
    .stat-item:last-child { border-right: none; }
    .stat-icon { margin: 0 auto 20px; }
    .stat-icon svg { color: var(--gold); }
    .stat-number { font-family: var(--serif); font-size: clamp(42px,4.5vw,64px); font-weight: 700; color: var(--gold); line-height: 1; margin-bottom: 12px; letter-spacing: -1px; }
    .stat-label { font-size: 13px; color: rgba(255,255,255,0.6); font-weight: 400; letter-spacing: 0.5px; line-height: 1.5; }

    /* ── ABOUT ──────────────────────────────────────────────── */
    #about { padding: 100px 5%; background: var(--cream); }
    .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; max-width: 1200px; margin: 0 auto; }
    .about-image-wrap { position: relative; }
    .about-img { width: 100%; height: 560px; object-fit: cover; border-radius: 8px; }
    .about-image-wrap::before { content: ''; position: absolute; top: -20px; left: -20px; right: 20px; bottom: 20px; border: 1px solid rgba(212,160,23,0.3); border-radius: 8px; z-index: 0; pointer-events: none; }
    .about-img { position: relative; z-index: 1; }
    .about-badge { position: absolute; bottom: -24px; right: -24px; z-index: 2; background: var(--gold); color: var(--gdp); padding: 20px 28px; border-radius: 8px; text-align: center; }
    .about-badge-num { font-family: var(--serif); font-size: 36px; font-weight: 700; line-height: 1; }
    .about-badge-text { font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin-top: 4px; }
    .about-content { padding-right: 20px; }
    .about-body { font-size: 16px; color: var(--gray); line-height: 1.85; margin-bottom: 24px; font-weight: 300; }
    .about-values { display: flex; gap: 12px; flex-wrap: wrap; margin: 32px 0 40px; }
    .about-value-tag { background: rgba(10,61,42,0.06); color: var(--gd); padding: 8px 18px; border-radius: 50px; font-size: 12px; font-weight: 500; letter-spacing: 0.5px; border: 1px solid rgba(10,61,42,0.1); }
    .btn-outline { display: inline-flex; align-items: center; gap: 10px; border: 1.5px solid var(--gd); color: var(--gd); padding: 14px 32px; border-radius: 50px; font-size: 13px; font-weight: 600; letter-spacing: 0.8px; transition: all var(--tr); }
    .btn-outline:hover { background: var(--gd); color: var(--white); transform: translateY(-2px); }
    .btn-outline svg { transition: transform var(--tr); }
    .btn-outline:hover svg { transform: translateX(4px); }

    /* ── PROCESS ────────────────────────────────────────────── */
    #process { padding: 100px 5%; background: var(--white); }
    .process-header { text-align: center; max-width: 1200px; margin: 0 auto 70px; }
    .process-header .section-eyebrow { justify-content: center; }
    .process-header .section-eyebrow::before { display: none; }
    .process-header .section-eyebrow::after { content: ''; width: 28px; height: 1px; background: var(--gold); }
    .process-header .section-sub { margin: 0 auto; }
    .process-steps { display: grid; grid-template-columns: repeat(6,1fr); position: relative; max-width: 1200px; margin: 0 auto; }
    .process-steps::before { content: ''; position: absolute; top: 36px; left: calc(100%/12); right: calc(100%/12); height: 1px; background: linear-gradient(90deg, var(--gold), var(--golds), var(--gold)); z-index: 0; }
    .process-step { text-align: center; padding: 0 12px; position: relative; z-index: 1; }
    .step-circle { width: 72px; height: 72px; border-radius: 50%; background: var(--white); border: 1.5px solid var(--gold); margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; flex-direction: column; transition: all var(--tr); }
    .step-circle:hover { background: var(--gold); transform: scale(1.08); }
    .step-num { font-family: var(--serif); font-size: 10px; color: var(--gold); font-weight: 600; letter-spacing: 1px; transition: color var(--tr); }
    .step-circle:hover .step-num { color: var(--gdp); }
    .step-circle svg { color: var(--gold); transition: color var(--tr); }
    .step-circle:hover svg { color: var(--gdp); }
    .step-title { font-family: var(--serif); font-size: 16px; font-weight: 600; color: var(--gd); margin-bottom: 8px; }
    .step-desc { font-size: 12px; color: var(--gray); line-height: 1.6; }

    /* ── TESTIMONIALS ───────────────────────────────────────── */
    #testimonials { padding: 100px 5%; background: var(--cream); }
    .testimonials-header { text-align: center; margin-bottom: 60px; }
    .testimonials-header .section-eyebrow { justify-content: center; }
    .testimonials-header .section-eyebrow::before { display: none; }
    .testimonials-header .section-eyebrow::after { content: ''; width: 28px; height: 1px; background: var(--gold); }
    .testimonial-carousel { max-width: 1200px; margin: 0 auto; }
    .testimonial-track { overflow: hidden; border-radius: 8px; }
    .testimonial-slide { display: none; background: var(--white); padding: 60px 64px; border-radius: 8px; box-shadow: 0 4px 40px rgba(10,61,42,0.06); }
    .testimonial-slide.active { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
    .testimonial-quote-mark { font-family: var(--serif); font-size: 120px; line-height: 0.6; color: var(--gold); opacity: 0.25; margin-bottom: 24px; }
    .testimonial-text { font-family: var(--serif); font-size: 22px; font-weight: 400; font-style: italic; color: var(--char); line-height: 1.6; margin-bottom: 36px; }
    .testimonial-stars { display: flex; gap: 4px; margin-bottom: 20px; }
    .testimonial-stars svg { color: var(--gold); }
    .testimonial-author-name { font-size: 15px; font-weight: 600; color: var(--gd); }
    .testimonial-author-role { font-size: 13px; color: var(--gray); margin-top: 3px; }
    .testimonial-logos-side { display: flex; flex-direction: column; gap: 24px; align-items: flex-start; }
    .testimonial-logos-side h4 { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--gray); font-weight: 500; margin-bottom: 8px; }
    .logos-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 20px; width: 100%; }
    .logo-item { background: var(--cream); border-radius: 8px; padding: 16px 20px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(10,61,42,0.07); font-family: var(--serif); font-size: 14px; font-weight: 600; color: var(--gray); transition: all var(--tr); min-height: 56px; }
    .logo-item:hover { border-color: var(--gold); color: var(--gd); }
    .carousel-nav { display: flex; align-items: center; justify-content: center; gap: 20px; margin-top: 40px; }
    .carousel-btn { width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid rgba(10,61,42,0.2); display: flex; align-items: center; justify-content: center; transition: all var(--tr); cursor: pointer; color: var(--gd); }
    .carousel-btn:hover { background: var(--gd); color: var(--white); border-color: var(--gd); }
    .carousel-dots { display: flex; gap: 8px; }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(10,61,42,0.15); transition: all var(--tr); cursor: pointer; }
    .dot.active { background: var(--gold); width: 24px; border-radius: 4px; }

    /* ── CTA BANNER ─────────────────────────────────────────── */
    #cta-banner { background: linear-gradient(135deg, var(--gold) 0%, #b8860b 50%, var(--golds) 100%); padding: 90px 5%; text-align: center; position: relative; overflow: hidden; }
    #cta-banner::before { content: ''; position: absolute; inset: 0; background: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Ccircle cx='40' cy='40' r='20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
    .cta-inner { position: relative; max-width: 700px; margin: 0 auto; }
    .cta-eyebrow { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: rgba(7,43,30,0.7); font-weight: 600; margin-bottom: 16px; }
    #cta-banner h2 { font-family: var(--serif); font-size: clamp(38px,4vw,58px); font-weight: 700; color: var(--gdp); margin-bottom: 18px; line-height: 1.1; }
    #cta-banner p { font-size: 17px; color: rgba(7,43,30,0.75); font-weight: 300; margin-bottom: 44px; line-height: 1.6; }
    .btn-dark { background: var(--gdp); color: var(--white); padding: 18px 44px; border-radius: 50px; font-size: 14px; font-weight: 600; letter-spacing: 0.8px; display: inline-flex; align-items: center; gap: 10px; transition: all var(--tr); box-shadow: 0 8px 30px rgba(7,43,30,0.3); }
    .btn-dark:hover { transform: translateY(-3px); box-shadow: 0 16px 45px rgba(7,43,30,0.4); }
    .btn-dark svg { transition: transform var(--tr); }
    .btn-dark:hover svg { transform: translateX(4px); }

    /* ── FOOTER ─────────────────────────────────────────────── */
    #footer { background: var(--gdp); padding: 60px 5% 0; color: rgba(255,255,255,0.7); }
    .footer-grid {
      max-width: 1200px; margin: 0 auto;
      display: grid; grid-template-columns: 1.8fr 1fr 1fr 1.5fr;
      gap: 40px; padding-bottom: 32px;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      align-items: start; width: 100%;
    }
    .footer-grid > * { min-width: 0; overflow: hidden; }
    .footer-mission { font-size: 13px; line-height: 1.65; color: rgba(255,255,255,0.55); margin: 12px 0 14px; max-width: 100%; }
    .footer-socials { display: flex; gap: 10px; }
    .social-btn { width: 34px; height: 34px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.5); transition: all var(--tr); }
    .social-btn:hover { border-color: var(--gold); color: var(--gold); }
    .footer-col h4 { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--white); font-weight: 600; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid rgba(212,160,23,0.2); }
    .footer-col li { margin-bottom: 8px; }
    .footer-col a { font-size: 13px; color: rgba(255,255,255,0.55); transition: color var(--tr); }
    .footer-col a:hover { color: var(--golds); }
    .footer-contact-item { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: rgba(255,255,255,0.55); margin-bottom: 10px; line-height: 1.5; }
    .footer-contact-item svg { color: var(--gold); flex-shrink: 0; margin-top: 2px; }
    .newsletter-form { display: flex; overflow: hidden; border-radius: 50px; border: 1px solid rgba(255,255,255,0.12); margin-top: 10px; }
    .newsletter-form input { flex: 1; padding: 10px 16px; background: rgba(255,255,255,0.05); border: none; outline: none; color: var(--white); font-size: 12px; font-family: var(--sans); }
    .newsletter-form input::placeholder { color: rgba(255,255,255,0.3); }
    .newsletter-form button { padding: 10px 16px; background: var(--gold); color: var(--gdp); font-size: 13px; font-weight: 600; border-radius: 0 50px 50px 0; transition: background var(--tr); cursor: pointer; }
    .newsletter-form button:hover { background: var(--golds); }
    .footer-bottom { max-width: 1200px; margin: 0 auto; padding: 18px 0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
    .footer-copyright { font-size: 12px; color: rgba(255,255,255,0.35); }
    .footer-legal { display: flex; gap: 20px; flex-wrap: wrap; }
    .footer-legal a { font-size: 12px; color: rgba(255,255,255,0.35); transition: color var(--tr); }
    .footer-legal a:hover { color: var(--golds); }
    .footer-reg { font-size: 12px; color: rgba(255,255,255,0.4); letter-spacing: 0.5px; width: 100%; text-align: center; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06); }

    /* ── MOBILE DRAWER ──────────────────────────────────────── */
    @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }

    /* ── RESPONSIVE ─────────────────────────────────────────── */
    @media (max-width: 1024px) {
      .services-grid { grid-template-columns: repeat(2,1fr); }
      .stats-grid { grid-template-columns: repeat(2,1fr); }
      .process-steps { grid-template-columns: repeat(3,1fr); gap: 30px; }
      .process-steps::before { display: none; }
      .about-grid { grid-template-columns: 1fr; gap: 48px; }
      .about-content { padding-right: 0; }
      .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
      .testimonial-slide.active { grid-template-columns: 1fr; }
      .testimonial-logos-side { display: none; }
    }
    @media (max-width: 768px) {
      :root { --nh: 72px; }
      .nav-menu, .nav-cta { display: none; }
      .nav-burger { display: flex; }
      .services-grid { grid-template-columns: 1fr; }
      .stats-grid { grid-template-columns: 1fr 1fr; }
      .stat-item { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); }
      .trust-label { border-right: none; padding-right: 0; }
      .testimonial-slide { padding: 36px 24px; }
      .footer-grid { grid-template-columns: 1fr !important; gap: 22px !important; }
      .footer-bottom { flex-direction: column; align-items: flex-start; gap: 8px; }
      .footer-bottom .footer-reg { align-self: center; text-align: center; }
      .footer-legal { flex-wrap: wrap; gap: 12px; }
    }
    @media (max-width: 480px) {
      .services-grid { grid-template-columns: 1fr; }
      .stats-grid { grid-template-columns: 1fr 1fr; }
      .process-steps { grid-template-columns: repeat(2,1fr); }
      .hero-actions { flex-direction: column; align-items: center; }
      .footer-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
      .footer-mission { max-width: 100%; }
      #footer { padding: 36px 20px 0 !important; }
      .footer-col h4 { font-size: 10px; }
      .newsletter-form { flex-direction: column; border-radius: 10px; }
      .newsletter-form input { border-radius: 10px 10px 0 0; padding: 12px 16px; }
      .newsletter-form button { border-radius: 0 0 10px 10px; width: 100%; padding: 12px 16px; justify-content: center; display: flex; align-items: center; gap: 6px; }
      .footer-bottom { flex-direction: column; align-items: flex-start; gap: 6px; }
      .footer-bottom .footer-reg { align-self: center; text-align: center; }
      .footer-legal { flex-wrap: wrap; gap: 10px; }
      .footer-contact-item { font-size: 13px; word-break: break-word; }
    }
  `,
  `/* ── mobile menu CSS lives in global.css ── */
    .disabled-x {
      display: none;
      width: 44px; height: 44px;
      background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.22);
      border-radius: 50%;
      cursor: pointer; align-items: center; justify-content: center;
      z-index: 1100; position: relative;
      flex-shrink: 0;
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      transition: background 0.4s cubic-bezier(0.34,1.56,0.64,1),
                  border-color 0.4s ease,
                  border-radius 0.4s cubic-bezier(0.34,1.56,0.64,1),
                  transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
    }
    .nav-burger:hover {
      background: rgba(212,160,23,0.18); border-color: rgba(212,160,23,0.5);
      transform: scale(1.08);
    }
    .nav-burger.active {
      background: rgba(212,160,23,0.22); border-color: #D4A017; border-radius: 14px;
    }
    .burger-box {
      width: 22px; height: 16px;
      display: flex; flex-direction: column;
      justify-content: space-between;
      margin: 0 auto;
    }
    .burger-line {
      display: block; width: 100%; height: 1.5px;
      background: #fff; border-radius: 2px;
      transform-origin: center;
      transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1),
                  opacity 0.3s ease,
                  width 0.4s ease;
    }
    /* Active state — morphs to X */
    .nav-burger.active .bl-1 { transform: translateY(7.25px) rotate(45deg); }
    .nav-burger.active .bl-2 { opacity: 0; width: 0; }
    .nav-burger.active .bl-3 { transform: translateY(-7.25px) rotate(-45deg); }

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
    /* ═══════════════════════════════════════════
       HERO — LONDON PHOTO · LEFT-ALIGNED
    ═══════════════════════════════════════════ */
    #hero {
      height: 100vh; min-height: 700px;
      position: relative;
      display: flex; align-items: center; justify-content: flex-start;
      overflow: hidden;
      box-sizing: border-box;
      padding-top: 90px;
    }

    /* ── Background photo ── */
    .hero-bg {
      position: absolute; inset: 0;
      overflow: hidden; background: #072B1E;
    }
    /* Ken Burns — slow drift across London skyline */
    @keyframes kenBurns {
      0%   { transform: scale(1.0) translate(0%,   0%);   }
      25%  { transform: scale(1.06) translate(-1.2%, -0.8%); }
      50%  { transform: scale(1.12) translate(-2.5%, 0.6%);  }
      75%  { transform: scale(1.07) translate(-1%, 1.2%);   }
      100% { transform: scale(1.0) translate(0%,   0%);   }
    }
    .hero-bg-img {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      object-fit: cover; object-position: center 35%;
      animation: kenBurns 22s ease-in-out infinite;
      filter: brightness(0.88) saturate(1.18) contrast(1.04);
      will-change: transform;
    }

    /* Left-to-right gradient: dark green dominates left for text, fades right so London shines */
    .hero-bg::after {
      content: ''; position: absolute; inset: 0; z-index: 1; pointer-events: none;
      background:
        linear-gradient(to right,  rgba(4,26,17,0.97) 0%, rgba(7,43,30,0.88) 30%, rgba(7,43,30,0.55) 55%, rgba(7,43,30,0.12) 100%),
        linear-gradient(to bottom, rgba(7,43,30,0.3) 0%, transparent 40%, rgba(4,20,12,0.75) 100%);
    }

    /* Subtle light-sweep shimmer across image */
    @keyframes lightSweep {
      0%   { transform: translateX(-100%) skewX(-15deg); opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: 1; }
      100% { transform: translateX(280%) skewX(-15deg); opacity: 0; }
    }
    .hero-sweep {
      position: absolute; inset: 0; z-index: 2; pointer-events: none; overflow: hidden;
    }
    .hero-sweep::after {
      content: '';
      position: absolute; top: 0; left: 0;
      width: 35%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.025), transparent);
      animation: lightSweep 9s ease-in-out 2s infinite;
    }

    /* Fog */
    .hero-fog { position: absolute; inset: 0; z-index: 2; pointer-events: none;
      background: radial-gradient(ellipse at 20% 60%, rgba(7,43,30,0.18) 0%, transparent 60%);
    }

    /* Particles */
    .particles-wrap { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 2; }
    .particle { position: absolute; opacity: 0; animation: floatLeaf linear infinite; }
    @keyframes floatLeaf { 0%{opacity:0;transform:translateY(0) rotate(0deg);} 10%{opacity:0.5;} 90%{opacity:0.3;} 100%{opacity:0;transform:translateY(-110vh) rotate(360deg);} }

    /* Gold vertical accent line on left */
    .hero-accent-line {
      position: absolute; z-index: 3; pointer-events: none;
      left: clamp(28px, 6%, 90px);
      top: 18%; bottom: 18%;
      width: 1.5px;
      background: linear-gradient(to bottom, transparent 0%, rgba(212,160,23,0.7) 30%, rgba(212,160,23,0.9) 60%, transparent 100%);
      opacity: 0;
      animation: fadeIn 1s 2.2s ease forwards;
    }
    .hero-accent-line::before {
      content: '';
      position: absolute; top: -4px; left: -3px;
      width: 7px; height: 7px;
      background: var(--gold);
      border-radius: 50%;
      box-shadow: 0 0 12px 4px rgba(212,160,23,0.6);
    }

    /* Soft orbs */
    .hero-orb { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 2; }
    .hero-orb-1 { width: 520px; height: 520px; background: radial-gradient(circle, rgba(212,160,23,0.12) 0%, transparent 70%); top: -140px; right: -80px; animation: orbDrift1 14s ease-in-out infinite; }
    .hero-orb-2 { width: 380px; height: 380px; background: radial-gradient(circle, rgba(7,43,30,0.5) 0%, transparent 70%); bottom: -80px; left: -40px; animation: orbDrift2 17s ease-in-out infinite; }
    @keyframes orbDrift1 { 0%,100%{transform:translate(0,0);} 50%{transform:translate(-30px,20px);} }
    @keyframes orbDrift2 { 0%,100%{transform:translate(0,0);} 50%{transform:translate(20px,-25px);} }

    /* ── Content — LEFT ALIGNED ── */
    .hero-content {
      position: relative; z-index: 4;
      display: flex; flex-direction: column;
      align-items: flex-start;
      text-align: left;
      padding: 0 5% 0 clamp(48px, 8%, 120px);
      max-width: 720px;
      gap: 0;
    }

    /* Headline */
    .hero-headline {
      font-family: var(--serif);
      font-size: clamp(40px, 5.8vw, 82px);
      font-weight: 700;
      line-height: 1.05;
      color: var(--white);
      margin: 0 0 4px;
      letter-spacing: -1px;
      text-shadow: 0 2px 40px rgba(0,0,0,0.5);
    }
    .hero-word { display: inline-block; }
    .hero-word-1 {
      opacity: 0;
      transform: translateY(36px);
      animation: wordUp 0.9s 0.3s cubic-bezier(0.16,1,0.3,1) forwards;
    }
    .hero-word-2 {
      opacity: 0;
      transform: translateY(36px);
      animation: wordUp 0.9s 0.55s cubic-bezier(0.16,1,0.3,1) forwards;
    }
    @keyframes wordUp { to { opacity:1; transform:translateY(0); } }

    /* Gold shimmer */
    .gold-shimmer {
      font-style: italic;
      color: var(--gold);
      position: relative;
      display: inline-block;
    }
    .gold-shimmer::after {
      content: 'Evidenced.';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, #b8860b 0%, #D4A017 30%, #f0d48a 52%, #D4A017 70%, #b8860b 100%);
      background-size: 250% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 3.5s linear 1.2s infinite;
    }
    @keyframes shimmer { from{background-position:250% center;} to{background-position:-250% center;} }

    /* Thin gold divider */
    .hero-divider {
      width: 280px; height: 1px;
      background: rgba(255,255,255,0.1);
      margin: 26px 0 22px;
      overflow: hidden; border-radius: 1px;
      opacity: 0;
      animation: fadeIn 0.5s 1s ease forwards;
    }
    .hero-divider-fill {
      height: 100%; width: 0;
      background: linear-gradient(90deg, var(--gold), var(--golds), var(--gold));
      animation: dividerSlide 1s 1.1s ease forwards;
    }
    @keyframes dividerSlide { to { width: 100%; } }
    @keyframes fadeIn { to { opacity: 1; } }

    /* Tag line */
    .hero-tag {
      font-size: 11px; letter-spacing: 4px;
      text-transform: uppercase;
      color: var(--golds);
      font-weight: 500; margin: 0 0 18px;
      opacity: 0;
      animation: fadeUp 0.7s 1.2s ease forwards;
    }

    /* Subheadline */
    .hero-subhead {
      font-size: clamp(15px, 1.6vw, 19px);
      color: rgba(255,255,255,0.72);
      font-weight: 300; line-height: 1.7;
      margin: 0 0 36px;
      max-width: 500px;
      opacity: 0;
      animation: fadeUp 0.8s 1.4s ease forwards;
      text-shadow: 0 1px 12px rgba(0,0,0,0.4);
    }

    /* Stats pill — left-aligned */
    .hero-stats {
      display: flex; align-items: center;
      background: rgba(255,255,255,0.06);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 60px;
      padding: 14px 32px 14px 24px;
      margin-bottom: 40px;
      opacity: 0;
      animation: fadeUp 0.8s 1.6s ease forwards;
    }
    .hero-stat-pill { text-align: left; padding: 0 20px; }
    .hsp-num { display: block; font-family: var(--serif); font-size: 20px; font-weight: 700; color: var(--gold); line-height: 1; }
    .hsp-label { display: block; font-size: 9px; letter-spacing: 1.2px; color: rgba(255,255,255,0.45); text-transform: uppercase; margin-top: 3px; }
    .hero-stat-divider { width: 1px; height: 32px; background: rgba(255,255,255,0.14); flex-shrink: 0; }

    /* CTA */
    .hero-actions {
      opacity: 0;
      animation: fadeUp 0.8s 1.85s ease forwards;
    }
    .hero-cta-main {
      padding: 16px 48px; font-size: 14px; letter-spacing: 0.8px;
      box-shadow: 0 8px 36px rgba(212,160,23,0.45);
    }
    .hero-cta-main:hover { transform: translateY(-3px); box-shadow: 0 16px 52px rgba(212,160,23,0.6); }

    /* Scroll indicator — aligned with left content */
    .hero-scroll {
      position: absolute; bottom: 28px;
      left: clamp(48px, 8%, 120px);
      z-index: 4;
      opacity: 0;
      animation: fadeIn 0.8s 2.6s ease forwards;
    }
    .scroll-line {
      width: 1px; height: 48px;
      background: linear-gradient(to bottom, var(--gold), transparent);
      animation: scrollPulse 2.2s ease-in-out infinite;
    }
    @keyframes scrollPulse { 0%,100%{opacity:1;transform:scaleY(1)} 50%{opacity:0.3;transform:scaleY(0.5)} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

    /* Mobile */
    @media (max-width: 768px) {
      #hero { justify-content: flex-start; }
      .hero-content { padding: 0 24px 0 28px; max-width: 100%; }
      .hero-headline { font-size: clamp(36px,10vw,60px); letter-spacing:-0.5px; }
      .hero-stats { padding: 12px 16px 12px 14px; }
      .hero-stat-pill { padding: 0 12px; }
      .hsp-num { font-size: 17px; }
      .hero-divider { width: 200px; }
      .hero-accent-line { left: 16px; }
      .hero-scroll { left: 28px; }
    }
    @media (max-width: 480px) {
      .hero-headline { font-size: clamp(32px,11vw,48px); }
      .hero-stats { flex-direction: column; align-items: flex-start; border-radius: 16px; gap: 10px; padding: 14px 20px; }
      .hero-stat-divider { width: 36px; height: 1px; }
    }
  `,
  `
      #testimonials { padding: 100px 5%; background: var(--cream, #F8F5F0); }
      .testimonials-header { text-align: center; margin-bottom: 56px; }
      .tc-wrap { max-width: 820px; margin: 0 auto; }
      .tc-track-outer { overflow: hidden; border-radius: 16px; }
      .tc-track { position: relative; }
      .tc-slide {
        display: none; background: var(--white, #fff);
        padding: 52px 56px; border-radius: 16px;
        box-shadow: 0 4px 48px rgba(10,61,42,0.08);
        position: relative; overflow: hidden;
        animation: tcFadeIn 0.5s ease;
      }
      .tc-slide::before {
        content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
        background: linear-gradient(90deg, transparent, #D4A017, #E5C46A, #D4A017, transparent);
      }
      .tc-slide.active { display: block; }
      @keyframes tcFadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
      .tc-quote-mark {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 80px; line-height: 0.6; color: #D4A017;
        opacity: 0.18; margin-bottom: 20px; display: block;
      }
      .tc-stars { color: #D4A017; font-size: 16px; letter-spacing: 3px; margin-bottom: 20px; }
      .tc-text {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: clamp(18px,2vw,23px); font-style: italic;
        color: #1A2521; line-height: 1.65; margin-bottom: 32px; font-weight: 400;
      }
      .tc-author { display: flex; align-items: center; gap: 14px; padding-top: 24px; border-top: 1px solid rgba(10,61,42,0.07); }
      .tc-avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(212,160,23,0.25); flex-shrink: 0; }
      .tc-name { font-size: 15px; font-weight: 600; color: #0A3D2A; }
      .tc-role { font-size: 13px; color: #7B8580; margin-top: 2px; }
      .tc-controls { display: flex; align-items: center; justify-content: center; gap: 20px; margin-top: 32px; }
      .tc-btn {
        width: 44px; height: 44px; border-radius: 50%;
        border: 1.5px solid rgba(10,61,42,0.15);
        display: flex; align-items: center; justify-content: center;
        color: #0A3D2A; cursor: pointer; background: var(--white,#fff);
        transition: all 0.3s ease;
      }
      .tc-btn:hover { background: #0A3D2A; color: #fff; border-color: #0A3D2A; transform: scale(1.05); }
      .tc-dots { display: flex; gap: 8px; align-items: center; }
      .tc-dot {
        width: 8px; height: 8px; border-radius: 50%;
        background: rgba(10,61,42,0.15); cursor: pointer;
        transition: all 0.35s ease; border: none;
      }
      .tc-dot.active { background: #D4A017; width: 24px; border-radius: 4px; }
      .tc-progress-wrap { height: 2px; background: rgba(10,61,42,0.07); border-radius: 2px; margin-top: 20px; overflow: hidden; }
      .tc-progress { height: 100%; background: linear-gradient(90deg, #D4A017, #E5C46A); border-radius: 2px; width: 0; transition: width 0.1s linear; }
      @media (max-width: 768px) { .tc-slide { padding: 32px 24px; } .tc-text { font-size: 17px; } }
    `,
  `
    /* Force footer to ALWAYS be horizontal 4 columns — no collapsing */
    #footer, #ft {
      padding: 32px 5% 0 !important;
    }
    #footer .footer-grid,
    #footer .ftg,
    #ft .footer-grid,
    #ft .ftg,
    footer .footer-grid,
    footer .ftg {
      display: grid !important;
      grid-template-columns: 1.8fr 1fr 1fr 1.5fr !important;
      grid-auto-flow: column !important;
      gap: 40px !important;
      padding-bottom: 24px !important;
      max-width: 1200px !important;
      margin: 0 auto !important;
      align-items: start !important;
      /* Kill any flex that might be interfering */
      flex-direction: unset !important;
      flex-wrap: unset !important;
    }
    /* Each column stays in its lane */
    #footer .footer-grid > *,
    #footer .ftg > *,
    #ft .footer-grid > *,
    #ft .ftg > *,
    footer .footer-grid > *,
    footer .ftg > * {
      min-width: 0 !important;
      width: 100% !important;
    }
    /* Tighten internals */
    #footer .footer-mission, #ft .ft-miss {
      font-size: 12.5px !important;
      line-height: 1.55 !important;
      margin: 10px 0 12px !important;
      max-width: 100% !important;
    }
    #footer .footer-col h4, #ft .ft-col h4 {
      margin-bottom: 12px !important;
      padding-bottom: 8px !important;
      white-space: nowrap !important;
    }
    #footer .footer-col li, #ft .ft-col li { margin-bottom: 6px !important; }
    #footer .footer-contact-item, #ft .ft-ci { margin-bottom: 8px !important; }
    #footer .footer-bottom, #ft .ft-bot {
      padding: 14px 0 !important;
      max-width: 1200px !important;
      margin: 0 auto !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      flex-wrap: wrap !important;
    }
    #footer .newsletter-form input, #ft .ft-nl input,
    #ft .ft-nl-form input, #ft .footer-nl-form input {
      padding: 9px 14px !important;
    }
    #footer .newsletter-form button, #ft .ft-nl button,
    #ft .ft-nl-form button, #ft .footer-nl-form button {
      padding: 9px 14px !important;
    }

    /* Only collapse on small tablets and below */
    @media (max-width: 768px) {
      #footer .footer-grid, #ft .footer-grid,
      #footer .ftg, #ft .ftg,
      footer .footer-grid, footer .ftg {
        grid-template-columns: 1fr 1fr !important;
        gap: 24px !important;
      }
    }
    @media (max-width: 480px) {
      #footer .footer-grid, #ft .footer-grid,
      #footer .ftg, #ft .ftg,
      footer .footer-grid, footer .ftg {
        grid-template-columns: 1fr !important;
        gap: 18px !important;
      }
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
    /* ── SCROLL PROGRESS + CURSOR ───────────────────────── */
    #wj-progress{position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,#D4A017,#E5C46A,#D4A017);width:0%;z-index:10000;pointer-events:none}
    .wj-cur{position:fixed;width:24px;height:24px;border-radius:50%;background:radial-gradient(circle,rgba(212,160,23,0.35) 0%,transparent 70%);pointer-events:none;z-index:9998;transform:translate(-50%,-50%);mix-blend-mode:screen}
    .wj-ring{position:fixed;width:48px;height:48px;border:1px solid rgba(212,160,23,0.18);border-radius:50%;pointer-events:none;z-index:9997;transform:translate(-50%,-50%)}

    /* ── MAGNETIC CTA GLOW ───────────────────────────────── */
    .btn-primary, .hero-cta-main {
      position: relative; overflow: hidden;
    }
    .btn-primary::before, .hero-cta-main::before {
      content: '';
      position: absolute; inset: -2px;
      background: conic-gradient(from var(--a, 0deg), var(--gold,#D4A017), #f0d48a, var(--gold,#D4A017));
      border-radius: inherit;
      animation: wjSpin 3s linear infinite;
      opacity: 0; transition: opacity 0.3s;
      z-index: -1;
    }
    @property --a { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
    @keyframes wjSpin { to { --a: 360deg; } }
    .btn-primary:hover::before, .hero-cta-main:hover::before { opacity: 1; }

    /* ── CARD 3D TILT ────────────────────────────────────── */
    .service-card, .stat-item, .mvv-card {
      transform-style: preserve-3d;
      will-change: transform;
      transition: transform 0.15s ease, box-shadow 0.15s ease !important;
    }

    /* ── STAGGERED WORD REVEAL ON HEADLINES ─────────────── */
    .wj-word-reveal .wj-word {
      display: inline-block; overflow: hidden; vertical-align: bottom;
    }
    .wj-word .wj-char {
      display: inline-block;
      transform: translateY(110%);
      animation: wjCharUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards;
    }
    @keyframes wjCharUp { to { transform: translateY(0); } }

    /* ── GOLD SCAN LINE ON SECTION ENTER ────────────────── */
    .wj-scan::after {
      content: '';
      position: absolute; left: 0; right: 0; top: 0; height: 2px;
      background: linear-gradient(90deg, transparent, var(--gold,#D4A017), transparent);
      opacity: 0;
      pointer-events: none;
    }
    .wj-scan.scanned::after {
      animation: wjScanLine 0.8s ease forwards;
    }
    @keyframes wjScanLine {
      0% { top: 0; opacity: 0.8; }
      100% { top: 100%; opacity: 0; }
    }

    /* ── FLOATING ENFORCEMENT BADGE ─────────────────────── */
    #wj-alert-badge {
      position: fixed; top: 90px; right: 20px; z-index: 1000;
      background: rgba(7,40,26,0.95); backdrop-filter: blur(16px);
      border: 1px solid rgba(212,160,23,0.35);
      border-radius: 8px; padding: 14px 18px; max-width: 260px;
      transform: translateX(300px);
      transition: transform 0.6s cubic-bezier(0.34,1.56,0.64,1);
      box-shadow: 0 8px 40px rgba(0,0,0,0.4);
    }
    #wj-alert-badge.show { transform: translateX(0); }
    .wj-badge-tag {
      font-size: 9px; font-weight: 700; letter-spacing: 2px;
      text-transform: uppercase; color: #e84040;
      margin-bottom: 6px; display: flex; align-items: center; gap: 5px;
    }
    .wj-badge-tag::before { content: '●'; animation: wjBlink 1.2s ease-in-out infinite; }
    .wj-badge-text {
      font-size: 12px; color: rgba(255,255,255,0.8); line-height: 1.5;
    }
    .wj-badge-text strong { color: var(--gold,#D4A017); }
    .wj-badge-close {
      position: absolute; top: 8px; right: 10px;
      background: none; border: none; color: rgba(255,255,255,0.35);
      cursor: pointer; font-size: 14px; line-height: 1;
      padding: 2px 4px;
    }
    .wj-badge-close:hover { color: rgba(255,255,255,0.7); }

    /* ── HEADLINE GOLD PULSE ─────────────────────────────── */
    @keyframes wjPulseGold {
      0%,100% { text-shadow: 0 0 20px rgba(212,160,23,0); }
      50% { text-shadow: 0 0 40px rgba(212,160,23,0.5), 0 0 80px rgba(212,160,23,0.15); }
    }

    /* ── SERVICE CARD GRADIENT BORDER PULSE ─────────────── */
    .service-card {
      position: relative;
    }
    .service-card::before {
      content: '';
      position: absolute; inset: -1px;
      border-radius: inherit;
      background: linear-gradient(135deg, transparent 40%, rgba(212,160,23,0.4) 50%, transparent 60%);
      background-size: 300% 300%;
      opacity: 0;
      transition: opacity 0.4s;
      pointer-events: none;
      z-index: 0;
      animation: wjBorderMove 3s linear infinite;
    }
    .service-card:hover::before { opacity: 1; }
    @keyframes wjBorderMove {
      0% { background-position: 0% 0%; }
      100% { background-position: 300% 300%; }
    }

    /* ── TYPEWRITER CURSOR ───────────────────────────────── */
    .wj-cursor::after {
      content: '|';
      color: var(--gold,#D4A017);
      animation: wjBlink 0.8s step-end infinite;
    }
  `,
];
