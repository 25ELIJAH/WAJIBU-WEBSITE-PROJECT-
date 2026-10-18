export const CSS: string[] = [
  `
    :root {
      --gd:#0A3D2A; --gdp:#072B1E;
      --gold:#D4A017; --golds:#E5C46A;
      --cream:#F8F5F0; --white:#FFFFFF;
      --char:#1A2521; --gray:#7B8580;
      --serif:'Cormorant Garamond',Georgia,serif;
      --sans:'Inter',system-ui,sans-serif;
      --nh:90px; --tr:0.35s cubic-bezier(0.4,0,0.2,1);
    }
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
    body{font-family:var(--sans);color:var(--char);background:var(--gdp);overflow-x:hidden;-webkit-font-smoothing:antialiased}
    img{max-width:100%;display:block}
    a{text-decoration:none;color:inherit}
    ul{list-style:none}
    button{cursor:pointer;border:none;background:none;font-family:inherit}

    /* SCROLL PROGRESS */
    #sp{position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,var(--gold),var(--golds));width:0%;z-index:9999}

    /* NAVBAR — global.css handles floating pill/glass styles */
    .ni{width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px}
    .nl{display:flex;align-items:center;gap:12px;text-decoration:none}
    .nl .lrw{position:relative;width:50px;height:50px;flex-shrink:0}
    .nl .limg{width:50px;height:50px;border-radius:50%;object-fit:cover;object-position:center 18%;position:relative;z-index:2;display:block;transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1);will-change:transform}
    .nl:hover .limg{transform:scale(1.07)}
    .nl .lring{position:absolute;inset:-4px;border-radius:50%;background:conic-gradient(from 0deg,transparent 0deg,#D4A017 60deg,#E5C46A 120deg,transparent 180deg,transparent 240deg,#D4A017 300deg,transparent 360deg);animation:lspin 4s linear infinite;will-change:transform;z-index:1}
    .nl .lring::after{content:'';position:absolute;inset:3px;border-radius:50%;background:#072B1E}
    .nl .lglow{position:absolute;inset:-8px;border-radius:50%;background:radial-gradient(circle,rgba(212,160,23,0.3) 0%,transparent 70%);animation:lglow 2.5s ease-in-out infinite;will-change:opacity,transform;z-index:0}
    @keyframes lspin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes lglow{0%,100%{opacity:0.4;transform:scale(0.95)}50%{opacity:1;transform:scale(1.1)}}
    .lname{font-family:var(--serif);font-size:22px;font-weight:700;color:var(--white);letter-spacing:3px;line-height:1}
    .ltag{font-size:8px;font-weight:400;letter-spacing:2px;color:var(--golds);text-transform:uppercase;margin-top:3px}
    /* nm/nc/nbg/mdr handled by global.css */

    /* ═══════════════════════════════════
       MAIN PAGE — dark green canvas
    ═══════════════════════════════════ */
    .page-wrap{min-height:100vh;background:var(--gdp);padding-top:var(--nh)}

    /* HERO */
    #hero{
      min-height:100vh;position:relative;
      display:flex;align-items:center;justify-content:center;
      text-align:center;overflow:hidden;
      background:linear-gradient(160deg,var(--gdp) 0%,#0d3d28 50%,var(--gdp) 100%);
      padding:var(--nh) 0 60px;
    }

    /* Animated grid lines */
    .grid-lines{
      position:absolute;inset:0;pointer-events:none;overflow:hidden;
    }
    .gl-h,.gl-v{position:absolute;background:rgba(212,160,23,0.04)}
    .gl-h{left:0;right:0;height:1px}
    .gl-v{top:0;bottom:0;width:1px}

    /* Orbs */
    .orb{position:absolute;border-radius:50%;filter:blur(100px);pointer-events:none}
    .orb-1{width:600px;height:600px;background:radial-gradient(circle,rgba(10,61,42,0.8) 0%,transparent 70%);top:-100px;left:-150px;animation:orbDrift1 18s ease-in-out infinite}
    .orb-2{width:400px;height:400px;background:radial-gradient(circle,rgba(212,160,23,0.06) 0%,transparent 70%);top:20%;right:-100px;animation:orbDrift2 22s ease-in-out infinite}
    .orb-3{width:300px;height:300px;background:radial-gradient(circle,rgba(212,160,23,0.05) 0%,transparent 70%);bottom:10%;left:10%;animation:orbDrift3 16s ease-in-out infinite}
    @keyframes orbDrift1{0%,100%{transform:translate(0,0)}50%{transform:translate(40px,30px)}}
    @keyframes orbDrift2{0%,100%{transform:translate(0,0)}50%{transform:translate(-30px,40px)}}
    @keyframes orbDrift3{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,-30px)}}

    /* Floating gold particles */
    .dot{position:absolute;width:2px;height:2px;border-radius:50%;background:var(--gold);opacity:0;animation:dotFloat linear infinite}
    @keyframes dotFloat{0%{opacity:0;transform:translateY(0) scale(0)}20%{opacity:0.6}80%{opacity:0.3}100%{opacity:0;transform:translateY(-60vh) scale(1.5)}}

    /* Hero content */
    .hero-inner{
      position:relative;z-index:2;
      max-width:860px;padding:var(--nh) 5% 0;
      display:flex;flex-direction:column;align-items:center;gap:0;
    }

    .hero-badge{
      display:inline-flex;align-items:center;gap:10px;
      background:rgba(212,160,23,0.08);
      border:1px solid rgba(212,160,23,0.2);
      border-radius:50px;padding:8px 20px;
      font-size:11px;letter-spacing:3px;text-transform:uppercase;
      color:var(--golds);font-weight:500;
      margin-bottom:24px;
      opacity:0;animation:fadeUp 0.7s 0.2s ease forwards;
    }
    .hero-badge-dot{width:6px;height:6px;border-radius:50%;background:var(--gold);animation:pulse 2s ease-in-out infinite}
    @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.7)}}

    .hero-title{
      font-family:var(--serif);
      font-size:clamp(38px,5.5vw,72px);
      font-weight:700;line-height:1.05;
      color:var(--white);
      margin-bottom:20px;
      letter-spacing:-1px;
      opacity:0;animation:fadeUp 0.9s 0.4s cubic-bezier(0.16,1,0.3,1) forwards;
    }
    .hero-title .gold-word{
      font-style:italic;color:var(--gold);
      position:relative;display:inline-block;
    }
    .hero-title .gold-word::after{
      content:'';position:absolute;bottom:-4px;left:0;right:0;height:1.5px;
      background:linear-gradient(90deg,transparent,var(--gold),transparent);
      animation:lineGrow 1s 1.2s ease forwards;transform:scaleX(0);transform-origin:center;
    }
    @keyframes lineGrow{to{transform:scaleX(1)}}

    .hero-sub{
      font-size:clamp(15px,1.6vw,18px);
      color:rgba(255,255,255,0.55);
      font-weight:300;line-height:1.7;
      max-width:540px;margin-bottom:32px;
      opacity:0;animation:fadeUp 0.8s 0.7s ease forwards;
    }

    /* Coming soon countdown style display */
    .coming-strip{
      display:flex;align-items:center;gap:0;
      border:1px solid rgba(212,160,23,0.15);
      border-radius:12px;overflow:hidden;
      margin-bottom:32px;
      opacity:0;animation:fadeUp 0.8s 0.9s ease forwards;
      background:rgba(255,255,255,0.02);
      backdrop-filter:blur(10px);
    }
    .cs-item{
      padding:18px 28px;text-align:center;
      border-right:1px solid rgba(212,160,23,0.1);
      transition:background var(--tr);
    }
    .cs-item:last-child{border-right:none}
    .cs-item:hover{background:rgba(212,160,23,0.05)}
    .cs-num{
      font-family:var(--serif);font-size:clamp(22px,3vw,34px);
      font-weight:700;color:var(--gold);line-height:1;
      margin-bottom:5px;
    }
    .cs-label{
      font-size:9px;letter-spacing:2px;text-transform:uppercase;
      color:rgba(255,255,255,0.35);font-weight:500;
    }

    /* CTA row */
    .hero-ctas{
      display:flex;align-items:center;gap:16px;flex-wrap:wrap;justify-content:center;
      opacity:0;animation:fadeUp 0.8s 1.0s ease forwards;
    }
    .btn-notify{
      background:linear-gradient(135deg,var(--gold),var(--golds));
      color:var(--gdp);padding:16px 40px;border-radius:50px;
      font-size:14px;font-weight:700;letter-spacing:0.5px;
      display:inline-flex;align-items:center;gap:10px;
      transition:all var(--tr);box-shadow:0 6px 32px rgba(212,160,23,0.35);
    }
    .btn-notify:hover{transform:translateY(-3px);box-shadow:0 14px 44px rgba(212,160,23,0.5)}
    .btn-notify svg{transition:transform var(--tr)}
    .btn-notify:hover svg{transform:translateX(3px)}
    .btn-ghost{
      display:inline-flex;align-items:center;gap:8px;
      padding:16px 32px;border:1px solid rgba(255,255,255,0.15);
      border-radius:50px;font-size:14px;color:rgba(255,255,255,0.7);
      font-weight:400;transition:all var(--tr);
    }
    .btn-ghost:hover{border-color:var(--gold);color:var(--golds);background:rgba(212,160,23,0.05)}

    /* ═══════════════════════════════════
       TOPIC HOOKS SECTION
    ═══════════════════════════════════ */
    #hooks{padding:100px 5%;background:var(--gdp);position:relative}
    .hooks-inner{max-width:1200px;margin:0 auto}
    .hooks-header{text-align:center;margin-bottom:72px}
    .hooks-eyebrow{
      font-size:11px;letter-spacing:3px;text-transform:uppercase;
      color:var(--gold);font-weight:500;margin-bottom:16px;
      display:flex;align-items:center;justify-content:center;gap:12px;
    }
    .hooks-eyebrow::before,.hooks-eyebrow::after{content:'';width:28px;height:1px;background:var(--gold)}
    .hooks-title{
      font-family:var(--serif);font-size:clamp(32px,4vw,54px);
      font-weight:600;color:var(--white);margin-bottom:16px;line-height:1.15;
    }
    .hooks-sub{font-size:16px;color:rgba(255,255,255,0.45);font-weight:300;max-width:500px;margin:0 auto;line-height:1.7}

    /* Hook cards */
    .hooks-grid{
      display:grid;grid-template-columns:repeat(3,1fr);gap:24px;
      margin-bottom:48px;
    }
    .hook-card{
      background:rgba(255,255,255,0.03);
      border:1px solid rgba(255,255,255,0.06);
      border-radius:12px;padding:36px 28px;
      position:relative;overflow:hidden;
      transition:all 0.4s ease;
      cursor:default;
    }
    .hook-card::before{
      content:'';position:absolute;inset:0;
      background:linear-gradient(135deg,rgba(212,160,23,0.06) 0%,transparent 60%);
      opacity:0;transition:opacity 0.4s ease;
    }
    .hook-card::after{
      content:'';position:absolute;bottom:0;left:0;right:0;height:2px;
      background:linear-gradient(90deg,transparent,var(--gold),transparent);
      transform:scaleX(0);transform-origin:center;
      transition:transform 0.5s ease;
    }
    .hook-card:hover{
      border-color:rgba(212,160,23,0.2);
      transform:translateY(-6px);
      box-shadow:0 20px 60px rgba(0,0,0,0.3);
    }
    .hook-card:hover::before{opacity:1}
    .hook-card:hover::after{transform:scaleX(1)}
    .hook-num{
      font-family:var(--serif);font-size:48px;font-weight:700;
      color:rgba(212,160,23,0.12);line-height:1;
      margin-bottom:20px;transition:color 0.3s;
    }
    .hook-card:hover .hook-num{color:rgba(212,160,23,0.25)}
    .hook-icon{
      width:44px;height:44px;border-radius:10px;
      background:rgba(212,160,23,0.08);
      display:flex;align-items:center;justify-content:center;
      margin-bottom:18px;transition:background 0.3s;
    }
    .hook-card:hover .hook-icon{background:rgba(212,160,23,0.15)}
    .hook-icon svg{color:var(--gold)}
    .hook-title{
      font-family:var(--serif);font-size:22px;font-weight:600;
      color:var(--white);margin-bottom:12px;line-height:1.2;
    }
    .hook-desc{
      font-size:14px;color:rgba(255,255,255,0.45);
      line-height:1.7;font-weight:300;
    }
    .hook-tag{
      display:inline-block;margin-top:20px;
      font-size:10px;letter-spacing:1.5px;text-transform:uppercase;
      color:var(--gold);font-weight:600;
      padding:4px 12px;border:1px solid rgba(212,160,23,0.2);border-radius:50px;
    }

    /* Large feature hook */
    .hook-featured{
      background:rgba(255,255,255,0.03);
      border:1px solid rgba(255,255,255,0.06);
      border-radius:12px;padding:52px 48px;
      display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;
      position:relative;overflow:hidden;
      transition:all 0.4s ease;
    }
    .hook-featured::before{
      content:'';position:absolute;top:-60px;right:-60px;
      width:300px;height:300px;border-radius:50%;
      background:radial-gradient(circle,rgba(212,160,23,0.06) 0%,transparent 70%);
      pointer-events:none;
    }
    .hook-featured:hover{border-color:rgba(212,160,23,0.18);box-shadow:0 24px 80px rgba(0,0,0,0.3)}
    .hf-label{
      font-size:10px;letter-spacing:2.5px;text-transform:uppercase;
      color:var(--gold);font-weight:600;margin-bottom:16px;
    }
    .hf-title{
      font-family:var(--serif);font-size:clamp(28px,3vw,42px);
      font-weight:700;color:var(--white);line-height:1.15;margin-bottom:20px;
    }
    .hf-title em{color:var(--gold);font-style:italic}
    .hf-desc{
      font-size:15px;color:rgba(255,255,255,0.5);
      line-height:1.75;font-weight:300;margin-bottom:28px;
    }
    .hf-topics{display:flex;flex-wrap:wrap;gap:8px}
    .hf-topic{
      padding:6px 14px;border:1px solid rgba(212,160,23,0.15);
      border-radius:50px;font-size:11px;color:rgba(255,255,255,0.55);
      transition:all var(--tr);
    }
    .hf-topic:hover{border-color:var(--gold);color:var(--golds)}
    .hf-right{position:relative}
    .hf-stat-stack{display:flex;flex-direction:column;gap:16px}
    .hf-stat{
      background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);
      border-radius:10px;padding:20px 24px;
      display:flex;align-items:center;gap:16px;
      transition:all var(--tr);
    }
    .hf-stat:hover{background:rgba(212,160,23,0.05);border-color:rgba(212,160,23,0.15);transform:translateX(6px)}
    .hf-stat-num{font-family:var(--serif);font-size:28px;font-weight:700;color:var(--gold);line-height:1;min-width:70px}
    .hf-stat-text{font-size:13px;color:rgba(255,255,255,0.5);line-height:1.4}

    /* ═══════════════════════════════════
       NOTIFY SECTION
    ═══════════════════════════════════ */
    #notify{
      padding:100px 5%;
      background:linear-gradient(135deg,rgba(10,61,42,0.4) 0%,var(--gdp) 100%);
      border-top:1px solid rgba(255,255,255,0.04);
      text-align:center;position:relative;overflow:hidden;
    }
    #notify::before{
      content:'';position:absolute;top:50%;left:50%;
      transform:translate(-50%,-50%);
      width:600px;height:600px;border-radius:50%;
      background:radial-gradient(circle,rgba(212,160,23,0.05) 0%,transparent 70%);
      pointer-events:none;
    }
    .notify-inner{position:relative;z-index:1;max-width:620px;margin:0 auto}
    .notify-icon{
      width:72px;height:72px;border-radius:50%;
      background:rgba(212,160,23,0.08);
      border:1px solid rgba(212,160,23,0.2);
      display:flex;align-items:center;justify-content:center;
      margin:0 auto 28px;
      animation:bellRing 4s ease-in-out infinite;
    }
    .notify-icon svg{color:var(--gold)}
    @keyframes bellRing{
      0%,90%,100%{transform:rotate(0deg)}
      92%{transform:rotate(-12deg)}
      94%{transform:rotate(12deg)}
      96%{transform:rotate(-8deg)}
      98%{transform:rotate(8deg)}
    }
    .notify-title{
      font-family:var(--serif);font-size:clamp(32px,4vw,50px);
      font-weight:700;color:var(--white);margin-bottom:16px;line-height:1.1;
    }
    .notify-title span{color:var(--gold);font-style:italic}
    .notify-sub{
      font-size:16px;color:rgba(255,255,255,0.5);
      font-weight:300;line-height:1.7;margin-bottom:40px;
    }
    .notify-form{
      display:flex;gap:0;border-radius:50px;overflow:hidden;
      border:1px solid rgba(255,255,255,0.1);
      background:rgba(255,255,255,0.04);
      max-width:480px;margin:0 auto 14px;
      transition:border-color var(--tr);
    }
    .notify-form:focus-within{border-color:rgba(212,160,23,0.35)}
    .notify-form input{
      flex:1;padding:15px 24px;background:transparent;
      border:none;outline:none;color:var(--white);
      font-size:14px;font-family:var(--sans);
    }
    .notify-form input::placeholder{color:rgba(255,255,255,0.3)}
    .notify-form button{
      padding:12px 24px;background:linear-gradient(135deg,var(--gold),var(--golds));
      color:var(--gdp);font-size:13px;font-weight:700;
      border-radius:0 50px 50px 0;transition:opacity var(--tr);letter-spacing:0.5px;
      cursor:pointer;
    }
    .notify-form button:hover{opacity:0.9}
    .notify-note{font-size:12px;color:rgba(255,255,255,0.3)}

    /* ═══════════════════════════════════
       FOOTER
    ═══════════════════════════════════ */
    #footer{background:var(--gdp);padding:36px 5% 0;color:rgba(255,255,255,0.7)}
    .footer-grid{
      display:grid;grid-template-columns:1.8fr 1fr 1fr 1.5fr;
      gap:40px;max-width:1200px;margin:0 auto;
      padding-bottom:28px;align-items:start;
    }
    .footer-mission{font-size:12.5px;line-height:1.55;color:rgba(255,255,255,0.55);margin:10px 0 12px;max-width:220px}
    .footer-socials{display:flex;gap:10px}
    .social-btn{width:32px;height:32px;border-radius:50%;border:1px solid rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.5);transition:all var(--tr)}
    .social-btn:hover{border-color:var(--gold);color:var(--gold)}
    .footer-col h4{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--white);font-weight:600;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid rgba(212,160,23,0.2)}
    .footer-col li{margin-bottom:7px}
    .footer-col a{font-size:13px;color:rgba(255,255,255,0.52);transition:color var(--tr)}
    .footer-col a:hover{color:var(--golds)}
    .footer-contact-item{display:flex;align-items:flex-start;gap:10px;font-size:13px;color:rgba(255,255,255,0.52);margin-bottom:8px;line-height:1.45}
    .footer-contact-item svg{color:var(--gold);flex-shrink:0;margin-top:1px}
    .footer-nl{display:flex;overflow:hidden;border-radius:50px;border:1px solid rgba(255,255,255,0.12);margin-top:10px}
    .footer-nl input{flex:1;padding:9px 14px;background:rgba(255,255,255,0.05);border:none;outline:none;color:var(--white);font-size:12px;font-family:var(--sans)}
    .footer-nl input::placeholder{color:rgba(255,255,255,0.3)}
    .footer-nl button{padding:9px 14px;background:var(--gold);color:var(--gdp);border-radius:0 50px 50px 0;cursor:pointer;transition:background var(--tr)}
    .footer-nl button:hover{background:var(--golds)}
    .footer-bot{max-width:1200px;margin:0 auto;padding:14px 0;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;border-top:1px solid rgba(255,255,255,0.07)}
    .footer-copy{font-size:12px;color:rgba(255,255,255,0.32)}
    .footer-leg{display:flex;gap:18px}
    .footer-leg a{font-size:12px;color:rgba(255,255,255,0.32);transition:color var(--tr)}
    .footer-leg a:hover{color:var(--golds)}

    /* REVEAL */
    .rv{opacity:0;transform:translateY(32px);transition:opacity 0.7s ease,transform 0.7s ease}
    .rv.vis{opacity:1;transform:translateY(0)}

    /* RESPONSIVE */
    @media(max-width:1024px){
      .hooks-grid{grid-template-columns:1fr 1fr}
      .hook-featured{grid-template-columns:1fr;gap:36px}
      .footer-grid{grid-template-columns:1fr 1fr;gap:24px}
    }
    @media(max-width:768px){
      :root{--nh:72px}
      .nm,.nc{display:none}
      .nbg{display:flex}
      .hooks-grid{grid-template-columns:1fr}
      .coming-strip{flex-direction:column}
      .cs-item{border-right:none;border-bottom:1px solid rgba(212,160,23,0.1);padding:16px 24px}
      .cs-item:last-child{border-bottom:none}
      .hero-ctas{flex-direction:column;align-items:center}
      .footer-grid{grid-template-columns:1fr 1fr;gap:20px}
    }
    @media(max-width:480px){
      .footer-grid{grid-template-columns:1fr}
    }
    @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  `,
  `
    /* ── BURGER BUTTON ──────────────────────────────── */
    .nav-burger {
      display: none;
      width: 44px; height: 44px;
      background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.22);
      border-radius: 50%;
      cursor: pointer; align-items: center; justify-content: center;
      z-index: 1100; position: relative;
      flex-shrink: 0;
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      transition: background 0.4s cubic-bezier(0.34,1.56,0.64,1), border-color 0.4s ease, border-radius 0.4s cubic-bezier(0.34,1.56,0.64,1), transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
    }
    .nav-burger:hover { background: rgba(212,160,23,0.18); border-color: rgba(212,160,23,0.5); transform: scale(1.08); }
    .nav-burger.active { background: rgba(212,160,23,0.22); border-color: #D4A017; border-radius: 14px; }
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
