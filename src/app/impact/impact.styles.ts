export const CSS: string[] = [
  `
    :root{
      --gd:#0A3D2A;--gdp:#072B1E;--gold:#D4A017;--golds:#E5C46A;
      --cream:#F8F5F0;--white:#FFFFFF;--char:#1A2521;--gray:#7B8580;
      --serif:'Cormorant Garamond',Georgia,serif;
      --sans:'Inter',system-ui,sans-serif;
      --nh:90px;--tr:0.35s cubic-bezier(0.4,0,0.2,1);
    }
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{font-family:var(--sans);color:var(--char);background:var(--white);overflow-x:hidden;-webkit-font-smoothing:antialiased}
    img{max-width:100%;display:block}
    a{text-decoration:none;color:inherit}
    ul{list-style:none}
    button{cursor:pointer;border:none;background:none;font-family:inherit}

    /* SCROLL PROGRESS */
    #sp{position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,var(--gold),var(--golds));width:0%;z-index:9999}

    /* NAVBAR — positioning/bg handled by global.css gooey pill */
    .ni{width:100%;display:flex;align-items:center;justify-content:space-between}
    .nl{display:flex;align-items:center;gap:10px}
    /* ── WAJIBU LOGO — Animated ───────────────────────────── */
    .nl { display: flex; align-items: center; gap: 12px; text-decoration: none; }
    .nav-logo-wrap {
      position: relative; width: 52px; height: 52px; flex-shrink: 0;
    }
    .nav-logo-img {
      width: 52px; height: 52px; border-radius: 50%;
      object-fit: cover; object-position: center 18%;
      display: block; position: relative; z-index: 2;
      transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
    }
    .nav-logo-ring {
      position: absolute; inset: -4px; border-radius: 50%;
      background: conic-gradient(from 0deg, transparent 0deg, #D4A017 60deg, #E5C46A 120deg, transparent 180deg, transparent 240deg, #D4A017 300deg, transparent 360deg);
      animation: logoSpin 4s linear infinite; z-index: 1;
    }
    .nav-logo-ring::after {
      content: ''; position: absolute; inset: 3px; border-radius: 50%;
      background: #072B1E;
    }
    .nav-logo-glow {
      position: absolute; inset: -8px; border-radius: 50%;
      background: radial-gradient(circle, rgba(212,160,23,0.35) 0%, transparent 70%);
      animation: logoGlow 2.5s ease-in-out infinite; z-index: 0;
    }
    @keyframes logoSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes logoGlow { 0%,100%{opacity:0.4;transform:scale(0.95)} 50%{opacity:1;transform:scale(1.1)} }
    .nl:hover .nav-logo-img { transform: scale(1.08); }
    .nl:hover .nav-logo-ring { animation-duration: 1.2s; }
    .nl:hover .nav-logo-glow { opacity: 1; animation-duration: 0.8s; }
    .nln{font-family:var(--serif);font-size:22px;font-weight:700;color:var(--white);letter-spacing:3px;line-height:1}
    .nlt{font-size:8px;font-weight:400;letter-spacing:2px;color:var(--golds);text-transform:uppercase;margin-top:2px}
    /* .nm, .nc, .nbg, .md — handled by global.css */

    /* SHARED */
    .si{max-width:1200px;margin:0 auto}
    .ey{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--gold);font-weight:500;margin-bottom:16px;display:flex;align-items:center;gap:12px}
    .ey::before{content:'';width:28px;height:1px;background:var(--gold)}
    .stitle{font-family:var(--serif);font-size:clamp(36px,4vw,60px);font-weight:600;line-height:1.12;color:var(--gd);margin-bottom:18px}
    .rv{opacity:0;transform:translateY(28px);transition:opacity 0.7s ease,transform 0.7s ease}
    .rv.vis{opacity:1;transform:translateY(0)}
    .breadcrumb{background:var(--cream);padding:16px 5%;border-bottom:1px solid rgba(10,61,42,0.07)}
    .bci{max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:8px}
    .bci a,.bci span{font-size:12px;color:var(--gray)}
    .bci a:hover{color:var(--gd)}
    .bci .sep{color:var(--gold)}
    .bci .cur{color:var(--gd);font-weight:500}

    /* PAGE HERO */
    #hero{padding-top:var(--nh);background:linear-gradient(135deg,var(--gdp) 0%,var(--gd) 100%);position:relative;overflow:hidden}
    #hero::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.018'%3E%3Ccircle cx='40' cy='40' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")}
    .hero-inner{max-width:1200px;margin:0 auto;padding:90px 5% 80px;position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
    .hero-ey{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--golds);font-weight:500;margin-bottom:20px;display:flex;align-items:center;gap:12px}
    .hero-ey::before{content:'';width:28px;height:1px;background:var(--golds)}
    .hero-title{font-family:var(--serif);font-size:clamp(46px,5.5vw,76px);font-weight:600;color:var(--white);line-height:1.06;margin-bottom:22px}
    .hero-title .gld{color:var(--gold);font-style:italic}
    .hero-sub{font-size:17px;color:rgba(255,255,255,0.68);font-weight:300;line-height:1.75;max-width:460px}
    .hero-right{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .hero-stat-card{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:28px 22px;transition:all var(--tr)}
    .hero-stat-card:hover{background:rgba(255,255,255,0.08);border-color:rgba(212,160,23,0.25);transform:translateY(-3px)}
    .hsc-num{font-family:var(--serif);font-size:40px;font-weight:700;color:var(--gold);line-height:1;margin-bottom:6px}
    .hsc-label{font-size:13px;color:rgba(255,255,255,0.55);line-height:1.4}

    /* IMPACT NUMBERS BAR */
    #numbers{background:var(--gd);padding:0}
    .numbers-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr)}
    .num-item{padding:52px 32px;text-align:center;border-right:1px solid rgba(255,255,255,0.07);position:relative;overflow:hidden}
    .num-item:last-child{border-right:none}
    .num-item::after{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--gold),var(--golds));transform:scaleX(0);transition:transform var(--tr)}
    .num-item:hover::after{transform:scaleX(1)}
    .num-icon{margin:0 auto 16px;width:44px;height:44px;border-radius:12px;background:rgba(212,160,23,0.1);display:flex;align-items:center;justify-content:center}
    .num-icon svg{color:var(--gold)}
    .counter{font-family:var(--serif);font-size:clamp(40px,4vw,56px);font-weight:700;color:var(--gold);line-height:1;margin-bottom:10px}
    .num-label{font-size:13px;color:rgba(255,255,255,0.55);line-height:1.5}

    /* CASE STUDIES */
    #cases{padding:110px 5%;background:var(--white)}
    .cases-header{text-align:center;margin-bottom:72px}
    .cases-header .ey{justify-content:center}
    .cases-header .ey::before{display:none}
    .cases-header .ey::after{content:'';width:28px;height:1px;background:var(--gold)}
    .case-card{display:grid;grid-template-columns:1fr 1fr;gap:0;border-radius:12px;overflow:hidden;box-shadow:0 8px 60px rgba(10,61,42,0.1);margin-bottom:60px;border:1px solid rgba(10,61,42,0.07)}
    .case-card:last-child{margin-bottom:0}
    .case-card.flip{direction:rtl}
    .case-card.flip>*{direction:ltr}
    .case-img-wrap{position:relative;overflow:hidden;min-height:440px}
    .case-img{width:100%;height:100%;object-fit:cover;transition:transform 0.7s ease}
    .case-card:hover .case-img{transform:scale(1.04)}
    .case-sector-badge{position:absolute;top:20px;left:20px;background:var(--gold);color:var(--gdp);padding:6px 14px;border-radius:50px;font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase}
    .case-content{background:var(--white);padding:52px 48px;display:flex;flex-direction:column;justify-content:center}
    .case-card:nth-child(even) .case-content{background:var(--cream)}
    .case-tag{font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);font-weight:600;margin-bottom:16px}
    .case-title{font-family:var(--serif);font-size:clamp(24px,2.5vw,34px);font-weight:600;color:var(--gd);line-height:1.2;margin-bottom:18px}
    .case-challenge{font-size:14px;color:var(--gray);line-height:1.75;font-weight:300;margin-bottom:24px}
    .case-results{display:flex;flex-direction:column;gap:10px;margin-bottom:32px}
    .case-result-item{display:flex;align-items:flex-start;gap:12px}
    .case-result-icon{width:24px;height:24px;border-radius:50%;background:rgba(10,61,42,0.07);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
    .case-result-icon svg{color:var(--gold)}
    .case-result-text{font-size:14px;color:var(--char);line-height:1.5}
    .case-result-text strong{color:var(--gd);font-weight:600}
    .case-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:32px;padding:20px 0;border-top:1px solid rgba(10,61,42,0.07);border-bottom:1px solid rgba(10,61,42,0.07)}
    .case-metric{text-align:center}
    .case-metric-num{font-family:var(--serif);font-size:28px;font-weight:700;color:var(--gd);line-height:1}
    .case-metric-label{font-size:11px;color:var(--gray);margin-top:4px;line-height:1.3}
    .case-quote{background:rgba(10,61,42,0.04);border-left:3px solid var(--gold);padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:28px}
    .case-quote p{font-family:var(--serif);font-size:16px;font-style:italic;color:var(--gd);line-height:1.6}
    .case-quote cite{font-size:12px;color:var(--gray);font-style:normal;margin-top:8px;display:block}
    .btn-case{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:var(--gd);transition:gap var(--tr),color var(--tr)}
    .btn-case:hover{gap:14px;color:var(--gold)}

    /* BEFORE / AFTER */
    #before-after{padding:110px 5%;background:var(--gdp);position:relative;overflow:hidden}
    #before-after::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.015'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")}
    .ba-inner{max-width:1200px;margin:0 auto;position:relative;z-index:1}
    .ba-header{text-align:center;margin-bottom:64px}
    .ba-header .ey{justify-content:center;color:var(--golds)}
    .ba-header .ey::before{display:none}
    .ba-header .ey::after{content:'';width:28px;height:1px;background:var(--golds)}
    .ba-header .stitle{color:var(--white)}
    .ba-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
    .ba-card{border-radius:10px;overflow:hidden;border:1px solid rgba(255,255,255,0.07)}
    .ba-card-header{background:rgba(255,255,255,0.04);padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.07)}
    .ba-card-header h4{font-family:var(--serif);font-size:18px;font-weight:600;color:var(--white);margin-bottom:4px}
    .ba-card-header p{font-size:12px;color:rgba(255,255,255,0.45)}
    .ba-rows{padding:0}
    .ba-row{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid rgba(255,255,255,0.05)}
    .ba-row:last-child{border-bottom:none}
    .ba-col{padding:16px 20px}
    .ba-col.before{background:rgba(229,62,62,0.04);border-right:1px solid rgba(255,255,255,0.05)}
    .ba-col.after{background:rgba(45,122,79,0.08)}
    .ba-col-label{font-size:9px;letter-spacing:2px;text-transform:uppercase;font-weight:600;margin-bottom:6px}
    .ba-col.before .ba-col-label{color:rgba(229,62,62,0.6)}
    .ba-col.after .ba-col-label{color:rgba(100,200,140,0.7)}
    .ba-col-value{font-family:var(--serif);font-size:22px;font-weight:600;line-height:1}
    .ba-col.before .ba-col-value{color:rgba(255,255,255,0.4)}
    .ba-col.after .ba-col-value{color:var(--gold)}
    .ba-col-desc{font-size:11px;color:rgba(255,255,255,0.35);margin-top:4px;line-height:1.4}

    /* TIMELINE */
    #timeline{padding:110px 5%;background:var(--cream)}
    .tl-header{text-align:center;margin-bottom:72px}
    .tl-header .ey{justify-content:center}
    .tl-header .ey::before{display:none}
    .tl-header .ey::after{content:'';width:28px;height:1px;background:var(--gold)}
    .tl-wrap{position:relative;max-width:900px;margin:0 auto}
    .tl-line{position:absolute;left:50%;transform:translateX(-50%);top:0;bottom:0;width:1px;background:rgba(10,61,42,0.1)}
    .tl-line-fill{position:absolute;left:50%;transform:translateX(-50%);top:0;width:2px;background:linear-gradient(to bottom,var(--gold),var(--golds));transition:height 1.5s ease}
    .tl-item{display:grid;grid-template-columns:1fr 60px 1fr;gap:0;margin-bottom:56px;align-items:start}
    .tl-item:last-child{margin-bottom:0}
    .tl-left{padding-right:40px;text-align:right}
    .tl-right{padding-left:40px}
    .tl-empty{padding:0}
    .tl-dot-wrap{display:flex;justify-content:center;padding-top:4px}
    .tl-dot{width:16px;height:16px;border-radius:50%;background:var(--white);border:3px solid var(--gold);transition:all var(--tr);position:relative;z-index:1}
    .tl-item.vis .tl-dot{background:var(--gold)}
    .tl-year{font-size:11px;font-weight:700;letter-spacing:2px;color:var(--gold);text-transform:uppercase;margin-bottom:8px}
    .tl-event-title{font-family:var(--serif);font-size:20px;font-weight:600;color:var(--gd);margin-bottom:8px;line-height:1.2}
    .tl-event-desc{font-size:14px;color:var(--gray);line-height:1.7;font-weight:300}
    .tl-stat{display:inline-block;background:rgba(10,61,42,0.07);border-radius:50px;padding:5px 14px;font-size:12px;font-weight:600;color:var(--gd);margin-top:10px}

    /* TESTIMONIALS */
    #testimonials{padding:110px 5%;background:var(--white)}
    .test-header{text-align:center;margin-bottom:64px}
    .test-header .ey{justify-content:center}
    .test-header .ey::before{display:none}
    .test-header .ey::after{content:'';width:28px;height:1px;background:var(--gold)}
    .test-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
    .test-card.featured{grid-column:1/-1;display:grid;grid-template-columns:64px 1fr;gap:24px;align-items:start}
    .test-card.featured .test-quote{font-size:21px}
    .test-card.featured .test-mark{position:static;opacity:0.15;line-height:0.8;margin-top:6px}
    .test-card{background:var(--cream);border:1px solid rgba(10,61,42,0.07);border-radius:10px;padding:36px 30px;position:relative;transition:all var(--tr)}
    .test-card:hover{border-color:rgba(212,160,23,0.25);box-shadow:0 16px 48px rgba(10,61,42,0.09);transform:translateY(-4px)}
    .test-stars{display:flex;gap:3px;margin-bottom:20px}
    .test-stars svg{color:var(--gold)}
    .test-quote{font-family:var(--serif);font-size:18px;font-style:italic;color:var(--char);line-height:1.65;margin-bottom:28px;font-weight:400}
    .test-mark{position:absolute;top:24px;right:28px;font-family:var(--serif);font-size:72px;color:var(--gold);opacity:0.12;line-height:1}
    .test-author{display:flex;align-items:center;gap:14px;padding-top:22px;border-top:1px solid rgba(10,61,42,0.07)}
    .test-avatar{width:48px;height:48px;min-width:48px;border-radius:50%;object-fit:cover;object-position:top center;border:2px solid rgba(212,160,23,0.25);background:rgba(10,61,42,0.08)}
    .test-name{font-size:14px;font-weight:600;color:var(--gd)}
    .test-role{font-size:12px;color:var(--gray);margin-top:2px}

    /* CHARTS / VISUAL DATA */
    #data-viz{padding:110px 5%;background:var(--gd)}
    .dv-inner{max-width:1200px;margin:0 auto}
    .dv-header{text-align:center;margin-bottom:72px}
    .dv-header .ey{justify-content:center;color:var(--golds)}
    .dv-header .ey::before{display:none}
    .dv-header .ey::after{content:'';width:28px;height:1px;background:var(--golds)}
    .dv-header .stitle{color:var(--white)}
    .dv-grid{display:grid;grid-template-columns:1fr 1fr;gap:32px}
    .dv-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:36px 32px}
    .dv-card h4{font-family:var(--serif);font-size:20px;font-weight:600;color:var(--white);margin-bottom:6px}
    .dv-card p{font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:28px;line-height:1.5}
    /* Bar chart */
    .bar-chart{display:flex;flex-direction:column;gap:14px}
    .bar-item{display:flex;flex-direction:column;gap:6px}
    .bar-label-row{display:flex;justify-content:space-between;align-items:center}
    .bar-label{font-size:12px;color:rgba(255,255,255,0.6)}
    .bar-value{font-size:12px;font-weight:600;color:var(--gold)}
    .bar-track{height:8px;background:rgba(255,255,255,0.07);border-radius:4px;overflow:hidden}
    .bar-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,var(--gold),var(--golds));width:0;transition:width 1.4s cubic-bezier(0.4,0,0.2,1)}
    /* Donut chart */
    .donut-wrap{display:flex;align-items:center;gap:32px}
    .donut-svg{flex-shrink:0}
    .donut-legend{display:flex;flex-direction:column;gap:12px;flex:1}
    .donut-item{display:flex;align-items:center;gap:10px}
    .donut-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
    .donut-item-label{font-size:13px;color:rgba(255,255,255,0.65)}
    .donut-item-val{font-size:13px;font-weight:600;color:var(--gold);margin-left:auto}

    /* SDGS */
    #sdgs{padding:80px 5%;background:var(--cream)}
    .sdgs-inner{max-width:1200px;margin:0 auto}
    .sdg-header{margin-bottom:48px}
    .sdg-grid{display:flex;flex-wrap:wrap;gap:12px}
    .sdg-badge{display:flex;align-items:center;gap:10px;padding:12px 18px;border-radius:8px;font-size:13px;font-weight:500;color:var(--white);transition:transform var(--tr)}
    .sdg-badge:hover{transform:translateY(-2px)}
    .sdg-badge span{font-size:11px;font-weight:700;letter-spacing:0.5px}

    /* CTA */
    #cta{background:linear-gradient(135deg,var(--gold) 0%,#b8860b 50%,var(--golds) 100%);padding:90px 5%;text-align:center;position:relative;overflow:hidden}
    #cta::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Ccircle cx='40' cy='40' r='20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")}
    .cta-i{position:relative;max-width:700px;margin:0 auto}
    .cta-ey{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(7,43,30,0.7);font-weight:600;margin-bottom:14px}
    #cta h2{font-family:var(--serif);font-size:clamp(36px,4vw,54px);font-weight:700;color:var(--gdp);margin-bottom:16px;line-height:1.1}
    #cta p{font-size:17px;color:rgba(7,43,30,0.75);font-weight:300;margin-bottom:40px;line-height:1.6}
    .btn-dark{background:var(--gdp);color:var(--white);padding:18px 44px;border-radius:50px;font-size:14px;font-weight:600;letter-spacing:0.8px;display:inline-flex;align-items:center;gap:10px;transition:all var(--tr);box-shadow:0 8px 30px rgba(7,43,30,0.3)}
    .btn-dark:hover{transform:translateY(-3px);box-shadow:0 16px 45px rgba(7,43,30,0.4)}
    .btn-dark svg{transition:transform var(--tr)}
    .btn-dark:hover svg{transform:translateX(4px)}

    /* FOOTER */
    #ft{background:var(--gdp);padding:90px 5% 0}
    .ftg{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1.8fr 1fr 1fr 1.5fr;gap:60px;padding-bottom:60px;border-bottom:1px solid rgba(255,255,255,0.07)}
    .ft-miss{font-size:14px;line-height:1.75;color:rgba(255,255,255,0.55);margin-top:20px;margin-bottom:28px}
    .ft-soc{display:flex;gap:12px}
    .sb{width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.5);transition:all var(--tr)}
    .sb:hover{border-color:var(--gold);color:var(--gold)}
    .ft-col h4{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--white);font-weight:600;margin-bottom:24px;padding-bottom:12px;border-bottom:1px solid rgba(212,160,23,0.2)}
    .ft-col li{margin-bottom:12px}
    .ft-col a{font-size:14px;color:rgba(255,255,255,0.55);transition:color var(--tr)}
    .ft-col a:hover{color:var(--golds)}
    .ft-ci{display:flex;align-items:flex-start;gap:12px;font-size:14px;color:rgba(255,255,255,0.55);margin-bottom:14px;line-height:1.5}
    .ft-ci svg{color:var(--gold);flex-shrink:0;margin-top:2px}
    .ft-nl{display:flex;overflow:hidden;border-radius:50px;border:1px solid rgba(255,255,255,0.12);margin-top:14px}
    .ft-nl input{flex:1;padding:12px 18px;background:rgba(255,255,255,0.05);border:none;outline:none;color:var(--white);font-size:13px;font-family:var(--sans)}
    .ft-nl input::placeholder{color:rgba(255,255,255,0.3)}
    .ft-nl button{padding:12px 20px;background:var(--gold);color:var(--gdp);border-radius:0 50px 50px 0;transition:background var(--tr)}
    .ft-nl button:hover{background:var(--golds)}
    .ft-bot{max-width:1200px;margin:0 auto;padding:24px 0;display:flex;justify-content:space-between;flex-wrap:wrap;gap:16px}
    .ft-copy{font-size:13px;color:rgba(255,255,255,0.35)}
    .ft-leg{display:flex;gap:24px}
    .ft-leg a{font-size:13px;color:rgba(255,255,255,0.35);transition:color var(--tr)}
    .ft-leg a:hover{color:var(--golds)}

    /* RESPONSIVE */
    @media(max-width:1024px){.hero-inner{grid-template-columns:1fr}.hero-right{display:none}.case-card,.case-card.flip{grid-template-columns:1fr;direction:ltr}.case-img-wrap{min-height:280px}.ba-grid{grid-template-columns:1fr}.dv-grid{grid-template-columns:1fr}.test-grid{grid-template-columns:repeat(2,1fr)}.test-card.featured{grid-template-columns:1fr}.numbers-inner{grid-template-columns:repeat(2,1fr)}.ftg{grid-template-columns:1fr 1fr;gap:40px}}
    @media(max-width:768px){:root{--nh:72px}.nm,.nc{display:none}.nbg{display:flex}.tl-wrap{padding:0 16px}.tl-item{grid-template-columns:1fr 40px 1fr}.tl-left{padding-right:20px}.tl-right{padding-left:20px}.case-content{padding:32px 24px}.test-grid{grid-template-columns:1fr}.test-card.featured{grid-template-columns:1fr}.numbers-inner{grid-template-columns:1fr}.num-item{border-right:none;border-bottom:1px solid rgba(255,255,255,0.06)}.ftg{grid-template-columns:1fr;gap:36px}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
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
