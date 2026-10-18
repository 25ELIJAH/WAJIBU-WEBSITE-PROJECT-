export const CSS: string[] = [
  `
/* ── RESET ── */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Inter',system-ui,sans-serif;color:#1A2521;background:#fff;-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{text-decoration:none;color:inherit}
img{max-width:100%;display:block}
button{font-family:inherit;cursor:pointer}
ul{list-style:none}

/* ── VARS ── */
:root{
  --gd:#0A3D2A;--gdp:#072B1E;--gold:#D4A017;--golds:#E5C46A;--cream:#F8F5F0;
  --serif:'Cormorant Garamond',Georgia,serif;--sans:'Inter',system-ui,sans-serif;
  --tr:0.3s ease;--nh:90px;
}
@media(max-width:768px){:root{--nh:72px}}

/* ── SCROLL PROGRESS ── */
#spb{position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,var(--gold),var(--golds));z-index:9999;width:0;pointer-events:none}

/* ── ANIMATIONS ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes lglow{0%,100%{opacity:.4;transform:scale(.95)}50%{opacity:1;transform:scale(1.1)}}
@keyframes lspin{to{transform:rotate(360deg)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes drawRing{to{stroke-dashoffset:0}}
@keyframes drawCheck{to{stroke-dashoffset:100}}
@keyframes pFloat{0%{transform:translateY(0) scale(1);opacity:1}100%{transform:translateY(var(--py,-180px)) translateX(var(--px,0px)) scale(0);opacity:0}}
@keyframes overlayIn{from{opacity:0}to{opacity:1}}
@keyframes cardUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
@keyframes letterIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.rv{opacity:0;transform:translateY(28px);transition:opacity .7s ease,transform .7s ease}
.rv.vis{opacity:1;transform:translateY(0)}

/* ── NAVBAR ── */
#navbar{position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:1000;height:62px;width:calc(100% - 40px);max-width:1080px;border-radius:100px;display:flex;align-items:center;padding:0 8px;background:rgba(255,255,255,0.07);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.18);box-shadow:0 4px 24px rgba(0,0,0,0.15),inset 0 1px 0 rgba(255,255,255,0.08);transition:background 0.6s cubic-bezier(0.16,1,0.3,1),border-color 0.6s cubic-bezier(0.16,1,0.3,1),box-shadow 0.6s cubic-bezier(0.16,1,0.3,1)}
#navbar.scrolled,#navbar:hover{background:rgba(7,43,30,0.96);border-color:rgba(212,160,23,0.22);box-shadow:0 8px 48px rgba(0,0,0,0.45)}
.nav-inner{width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px}
.logo-wrap{display:flex;align-items:center;gap:11px;text-decoration:none}
.logo-ring-wrap{position:relative;width:50px;height:50px;flex-shrink:0}
.logo-img{width:50px;height:50px;border-radius:50%;object-fit:cover;object-position:center;position:relative;z-index:2;display:block;will-change:transform;transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1)}
.logo-ring{position:absolute;inset:-4px;border-radius:50%;background:conic-gradient(from 0deg,transparent 0deg,#D4A017 60deg,#E5C46A 120deg,transparent 180deg,transparent 240deg,#D4A017 300deg,transparent 360deg);animation:logoSpin 4s linear infinite;will-change:transform;z-index:1}
.logo-ring::after{content:'';position:absolute;inset:3px;border-radius:50%;background:var(--gdp)}
.logo-glow{position:absolute;inset:-8px;border-radius:50%;background:radial-gradient(circle,rgba(212,160,23,0.3) 0%,transparent 70%);animation:logoGlow 2.5s ease-in-out infinite;will-change:opacity,transform;z-index:0}
.logo-name{font-family:var(--serif);font-size:22px;font-weight:700;color:#fff;letter-spacing:3px;line-height:1}
.logo-tag{font-size:8px;font-weight:400;letter-spacing:2px;color:var(--golds);text-transform:uppercase;margin-top:3px}
.logo-wrap:hover .logo-img{transform:scale(1.07)}
.logo-wrap:hover .logo-ring{animation-duration:1.2s}
@keyframes logoSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes logoGlow{0%,100%{opacity:0.4;transform:scale(0.95)}50%{opacity:1;transform:scale(1.1)}}
.goo-nav-wrap{position:relative;display:flex;align-items:center}
.goo-layer{position:absolute;inset:-8px;pointer-events:none;overflow:visible}
.goo-blob{position:absolute;height:calc(100% + 16px);top:-8px;background:rgba(212,160,23,0.22);border-radius:100px;left:0;width:0;transition:left 0.5s cubic-bezier(0.34,1.56,0.64,1),width 0.5s cubic-bezier(0.34,1.56,0.64,1),opacity 0.3s ease;opacity:0}
.goo-nav-wrap:hover .goo-blob{opacity:1}
.nav-menu{display:flex;align-items:center;gap:2px;list-style:none;position:relative;z-index:1}
.nav-menu a{font-size:12px;font-weight:500;letter-spacing:1.1px;text-transform:uppercase;color:rgba(255,255,255,0.92);padding:9px 15px;border-radius:100px;display:block;white-space:nowrap;transition:color 0.3s ease;text-shadow:0 1px 8px rgba(0,0,0,0.6)}
.nav-menu a:hover{color:var(--gold)}
.nav-menu a[aria-current="page"]{color:var(--golds)}
.nav-cta{background:linear-gradient(135deg,var(--gold),var(--golds));color:var(--gdp)!important;padding:11px 22px;border-radius:50px;font-size:12px;font-weight:600;letter-spacing:0.8px;flex-shrink:0;display:inline-flex;align-items:center;gap:8px;transition:all 0.3s ease;box-shadow:0 4px 20px rgba(212,160,23,0.3)}
.nav-cta:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(212,160,23,0.5)}
.nav-burger{display:none;width:44px;height:44px;background:none;border:none;cursor:pointer;color:#fff;align-items:center;justify-content:center;position:relative;z-index:1100;flex-shrink:0}
.burger-box{display:flex;flex-direction:column;gap:5px}
.burger-line{display:block;width:24px;height:1.5px;background:currentColor;transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);border-radius:2px}
body.mo{overflow:hidden}

/* ── HERO ── */
.cher{min-height:44vh;background:linear-gradient(135deg,var(--gdp) 0%,var(--gd) 60%,#0d4a32 100%);display:flex;align-items:flex-end;padding:calc(var(--nh) + 56px) 5% 56px;position:relative;overflow:hidden}
.cher::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='.018'%3E%3Ccircle cx='40' cy='40' r='1'/%3E%3C/g%3E%3C/svg%3E");pointer-events:none}
.cher::after{content:'';position:absolute;top:-40%;right:-10%;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(212,160,23,.07) 0%,transparent 65%);pointer-events:none}
.chin{max-width:1200px;margin:0 auto;width:100%;position:relative;z-index:1}
.chey{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--golds);font-weight:500;margin-bottom:18px;display:flex;align-items:center;gap:12px}
.chey::before{content:'';width:28px;height:1px;background:var(--golds)}
.cht{font-family:var(--serif);font-size:clamp(46px,6vw,82px);font-weight:700;color:#fff;line-height:1.04;margin-bottom:18px}
.chs{font-size:16px;color:rgba(255,255,255,.6);max-width:540px;line-height:1.7;font-weight:300}
.chst{display:flex;gap:28px;margin-top:36px;flex-wrap:wrap}
.chsi{display:flex;align-items:center;gap:10px;font-size:13px;color:rgba(255,255,255,.6)}
.chsd{width:6px;height:6px;border-radius:50%;background:var(--gold);flex-shrink:0}

/* ── MAIN GRID ── */
.cmain{padding:80px 5%;background:#fff}
.cgrid{display:grid;grid-template-columns:1.05fr .95fr;gap:56px;max-width:1200px;margin:0 auto;align-items:start}

/* ── FORMS COL ── */
.fhey{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--gold);font-weight:500;margin-bottom:12px}
.fht{font-family:var(--serif);font-size:34px;font-weight:700;color:var(--gdp);line-height:1.15;margin-bottom:30px}
.ftabs{display:flex;gap:0;background:rgba(10,61,42,.07);border-radius:50px;padding:4px;margin-bottom:32px}
.ftb{flex:1;padding:12px 14px;border-radius:50px;border:none;background:transparent;color:rgba(10,61,42,.5);font-size:13px;font-weight:600;cursor:pointer;transition:all var(--tr);letter-spacing:.4px}
.ftb.active{background:linear-gradient(135deg,var(--gold),var(--golds));color:var(--gdp);box-shadow:0 4px 16px rgba(212,160,23,.3)}
.fpanel{display:none}
.fpanel.active{display:block;animation:fadeUp .4s ease}
.frow{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
.fg{display:flex;flex-direction:column;gap:5px}
.fg.full{grid-column:1/-1}
.fl{font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:rgba(10,61,42,.55)}
.fi,.fsl,.fta{width:100%;padding:13px 17px;border:1.5px solid rgba(10,61,42,.12);border-radius:10px;font-size:14px;font-family:var(--sans);color:var(--gdp);background:#fff;transition:all var(--tr);outline:none;-webkit-appearance:none}
.fsl{background-image:url("data:image/svg+xml,%3Csvg width='12' height='7' viewBox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%230A3D2A' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:40px;cursor:pointer}
.fi:focus,.fsl:focus,.fta:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(212,160,23,.12)}
.fi::placeholder,.fta::placeholder{color:rgba(10,61,42,.3)}
.fta{resize:vertical;min-height:120px;line-height:1.6}
.fck{display:flex;align-items:flex-start;gap:11px;margin-top:10px}
.fck input{width:17px;height:17px;border:1.5px solid rgba(10,61,42,.2);border-radius:4px;cursor:pointer;flex-shrink:0;accent-color:var(--gold);margin-top:2px}
.fck label{font-size:12px;color:rgba(10,61,42,.6);line-height:1.55}
.fck label a{color:var(--gold);text-decoration:underline}
.fsub{width:100%;padding:15px 32px;background:linear-gradient(135deg,var(--gold),var(--golds));color:var(--gdp);border:none;border-radius:50px;font-size:14px;font-weight:700;letter-spacing:.5px;cursor:pointer;transition:all var(--tr);display:flex;align-items:center;justify-content:center;gap:10px;margin-top:22px;box-shadow:0 6px 24px rgba(212,160,23,.3)}
.fsub:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(212,160,23,.45)}
.fsub svg{transition:transform var(--tr)}
.fsub:hover svg{transform:translateX(4px)}
.fsucc{display:none;text-align:center;padding:44px 28px;background:rgba(10,61,42,.04);border-radius:16px;border:1px solid rgba(10,61,42,.1)}
.fsucc.show{display:block;animation:fadeUp .4s ease}
.fsucc-ic{width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--golds));display:flex;align-items:center;justify-content:center;margin:0 auto 18px}
.fsucc h3{font-family:var(--serif);font-size:26px;color:var(--gdp);margin-bottom:8px}
.fsucc p{font-size:13px;color:rgba(10,61,42,.6);line-height:1.7}

/* ── PROFILE COL ── */
.pcol{display:flex;flex-direction:column;gap:20px;position:sticky;top:calc(var(--nh) + 20px)}
.pcard{border-radius:20px;overflow:hidden;background:var(--gdp);box-shadow:0 24px 64px rgba(7,43,30,.25);position:relative;transition:box-shadow .4s ease}
.pcard:hover{box-shadow:0 32px 80px rgba(7,43,30,.4),0 0 0 2px rgba(212,160,23,.4)}
.pimgw{position:relative;overflow:hidden;aspect-ratio:2/3;min-height:480px;max-height:700px;width:100%}
.pimg{width:100%;height:100%;object-fit:cover;object-position:center top;transition:transform .8s cubic-bezier(.25,.46,.45,.94),filter .8s ease;display:block}
.pcard:hover .pimg{transform:scale(1.06);filter:brightness(1.06) contrast(1.03)}
/* hover handled in pimg block above */
.pgrad{position:absolute;inset:0;background:linear-gradient(to top,rgba(7,43,30,.98) 0%,rgba(7,43,30,.35) 45%,transparent 75%);pointer-events:none}
/* star cover — blends with dark desk at bottom-right */
.pimgw::after{content:'';position:absolute;bottom:0;right:0;width:120px;height:80px;background:radial-gradient(ellipse at bottom right,#1a0f08 10%,transparent 70%);z-index:2;pointer-events:none}
.pbadge{position:absolute;top:18px;left:18px;z-index:3;background:linear-gradient(135deg,var(--gold),var(--golds));color:var(--gdp);font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:6px 14px;border-radius:50px;box-shadow:0 4px 16px rgba(212,160,23,.4);opacity:0;transform:translateY(-10px);transition:all .4s ease}
.pcard:hover .pbadge{opacity:1;transform:translateY(0)}
.pinfo{padding:26px 26px 30px;position:relative}
.pinfo::before{content:'';position:absolute;top:0;left:26px;right:26px;height:1px;background:linear-gradient(90deg,var(--gold),transparent)}
.pname{font-family:var(--serif);font-size:26px;font-weight:700;color:#fff;margin-bottom:4px}
.ptitle{font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:var(--golds);margin-bottom:14px;font-weight:500}
.pbio{font-size:13px;color:rgba(255,255,255,.5);line-height:1.7;font-weight:300;margin-bottom:20px}
.pacts{display:flex;gap:10px;flex-wrap:wrap}
.pab{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:50px;font-size:12px;font-weight:600;transition:all var(--tr);letter-spacing:.3px}
.pab-g{background:linear-gradient(135deg,var(--gold),var(--golds));color:var(--gdp)}
.pab-g:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(212,160,23,.4)}
.pab-o{background:rgba(255,255,255,.08);color:rgba(255,255,255,.75);border:1px solid rgba(255,255,255,.12)}
.pab-o:hover{background:rgba(255,255,255,.14);color:#fff}

/* ── BOOKING CARD (below Samuel) ── */
.meetcard{background:var(--gdp);border-radius:20px;padding:28px;box-shadow:0 16px 48px rgba(7,43,30,.2)}
.mc-ey{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:var(--golds);font-weight:600;margin-bottom:10px}
.mc-t{font-family:var(--serif);font-size:24px;font-weight:700;color:#fff;margin-bottom:6px}
.mc-sub{font-size:13px;color:rgba(255,255,255,.45);line-height:1.6;margin-bottom:22px}

/* Meeting type cards */
.mtypes{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:22px}
.mtype{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border:1.5px solid rgba(255,255,255,.12);border-radius:12px;cursor:pointer;transition:all .3s;text-align:center;position:relative}
.mtype input[type=radio]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
.mtype-ic{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;margin-bottom:2px;transition:all .3s}
.mtype-lbl{font-size:12px;font-weight:600;color:rgba(255,255,255,.65);letter-spacing:.3px;transition:color .3s;line-height:1.3}
.mtype-det{font-size:10px;color:rgba(255,255,255,.3);line-height:1.3;transition:color .3s}
.mtype:hover,.mtype.sel{border-color:var(--gold);background:rgba(212,160,23,.08)}
.mtype:hover .mtype-ic,.mtype.sel .mtype-ic{background:rgba(212,160,23,.2)}
.mtype:hover .mtype-lbl,.mtype.sel .mtype-lbl{color:var(--golds)}
.mtype:hover .mtype-det,.mtype.sel .mtype-det{color:rgba(212,160,23,.6)}

/* Booking form fields */
.mfi,.mfsl,.mfta{width:100%;padding:12px 15px;border:1.5px solid rgba(255,255,255,.12);border-radius:10px;font-size:13px;font-family:var(--sans);color:#fff;background:rgba(255,255,255,.05);transition:all var(--tr);outline:none;-webkit-appearance:none;margin-bottom:10px}
.mfsl{background-image:url("data:image/svg+xml,%3Csvg width='12' height='7' viewBox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23E5C46A' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:38px;cursor:pointer}
.mfsl option{background:#0A3D2A;color:#fff}
.mfi:focus,.mfsl:focus,.mfta:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(212,160,23,.15)}
.mfi::placeholder,.mfta::placeholder{color:rgba(255,255,255,.25)}
.mfi[type=date]{color-scheme:dark}
.mfrow{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.mfrow .mfi{margin-bottom:0}
.mfta{resize:vertical;min-height:80px;line-height:1.5;margin-bottom:0}
.mfl{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.4);font-weight:600;margin-bottom:5px;display:block}
.mfg{margin-bottom:10px}
.mbsub{width:100%;padding:14px;background:linear-gradient(135deg,var(--gold),var(--golds));color:var(--gdp);border:none;border-radius:50px;font-size:14px;font-weight:700;letter-spacing:.5px;cursor:pointer;transition:all var(--tr);display:flex;align-items:center;justify-content:center;gap:10px;margin-top:16px;box-shadow:0 6px 24px rgba(212,160,23,.3)}
.mbsub:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(212,160,23,.5)}
.mbsub svg{transition:transform var(--tr)}
.mbsub:hover svg{transform:translateX(4px)}

/* ── JAW-DROPPING SUCCESS OVERLAY ── */
#sov{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;opacity:0;visibility:hidden;transition:opacity .5s ease,visibility .5s ease;overflow:hidden}
#sov.on{opacity:1;visibility:visible}
.sov-bg{position:absolute;inset:0;background:linear-gradient(135deg,#041a11 0%,var(--gdp) 40%,var(--gd) 100%)}
.sov-in{position:relative;z-index:2;text-align:center;padding:40px 24px;max-width:520px;width:90%}
.sov-ring{margin:0 auto 28px;display:block}
.sov-ring-circle{fill:none;stroke:rgba(212,160,23,.2);stroke-width:3}
.sov-ring-arc{fill:none;stroke:url(#goldGrad);stroke-width:3;stroke-linecap:round;stroke-dasharray:314;stroke-dashoffset:314;transition:none}
.sov-ring-arc.go{animation:drawRing .9s cubic-bezier(.4,0,.2,1) .2s forwards}
.sov-check{fill:none;stroke:var(--golds);stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:100;stroke-dashoffset:100}
.sov-check.go{animation:drawCheck .5s ease .95s forwards}
.sov-title{font-family:var(--serif);font-size:clamp(32px,5vw,52px);font-weight:700;margin-bottom:10px;background:linear-gradient(90deg,#D4A017,#fff,#E5C46A,#D4A017);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 2.5s linear .8s infinite;opacity:0;transition:opacity .5s ease .6s}
.sov-title.go{opacity:1}
.sov-sub{font-size:15px;color:rgba(255,255,255,.6);line-height:1.7;margin-bottom:28px;opacity:0;transition:opacity .6s ease 1.1s}
.sov-sub.go{opacity:1}
.sov-card{background:rgba(255,255,255,.06);border:1px solid rgba(212,160,23,.25);border-radius:16px;padding:22px 28px;margin-bottom:28px;opacity:0;transform:translateY(30px);transition:opacity .6s ease 1.4s,transform .6s ease 1.4s}
.sov-card.go{opacity:1;transform:translateY(0)}
.sov-card-row{display:flex;align-items:center;gap:14px;font-size:14px;color:rgba(255,255,255,.75);margin-bottom:12px}
.sov-card-row:last-child{margin-bottom:0}
.sov-card-ic{width:32px;height:32px;border-radius:50%;background:rgba(212,160,23,.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--gold)}
.sov-ref{font-size:11px;letter-spacing:2px;color:rgba(255,255,255,.3);margin-bottom:20px;opacity:0;transition:opacity .5s ease 1.7s}
.sov-ref.go{opacity:1}
.sov-btn{display:inline-flex;align-items:center;gap:10px;padding:14px 30px;border-radius:50px;background:linear-gradient(135deg,var(--gold),var(--golds));color:var(--gdp);font-size:14px;font-weight:700;border:none;cursor:pointer;transition:all var(--tr);opacity:0;transition:opacity .5s ease 2s,transform var(--tr),box-shadow var(--tr);box-shadow:0 6px 24px rgba(212,160,23,.3)}
.sov-btn.go{opacity:1}
.sov-btn:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(212,160,23,.5)}
.sov-part{position:absolute;border-radius:50%;background:var(--gold);animation:pFloat var(--dur) ease-out var(--del) both;pointer-events:none;z-index:1}

/* ── QUICK CONTACT ── */
.qcont{background:var(--cream);border-radius:16px;padding:22px 26px}
.qc-ey{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);font-weight:600;margin-bottom:14px}
.qc-row{display:flex;align-items:center;gap:12px;font-size:13px;color:rgba(10,61,42,.7);margin-bottom:11px;line-height:1.4}
.qc-row:last-child{margin-bottom:0}
.qc-ic{width:32px;height:32px;border-radius:50%;background:rgba(10,61,42,.08);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--gd)}
.qc-row a{color:var(--gd);font-weight:500;transition:color var(--tr)}
.qc-row a:hover{color:var(--gold)}

/* ── FOOTER ── */
#ftr{background:var(--gdp);padding:60px 5% 0;color:rgba(255,255,255,.7)}
.fgrid{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1.8fr 1fr 1fr 1.5fr;gap:40px;padding-bottom:32px;border-bottom:1px solid rgba(255,255,255,.07);align-items:start;width:100%;overflow:visible}
.fgrid>*{min-width:0}
.fmiss{font-size:13px;line-height:1.65;color:rgba(255,255,255,.55);margin:12px 0 14px}
.fsocs{display:flex;gap:10px}
.fsoc{width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.5);transition:all var(--tr)}
.fsoc:hover{border-color:var(--gold);color:var(--gold)}
.fcol h4{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#fff;font-weight:600;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid rgba(212,160,23,.2)}
.fcol li{margin-bottom:8px}
.fcol a{font-size:13px;color:rgba(255,255,255,.55);transition:color var(--tr)}
.fcol a:hover{color:var(--golds)}
.fci{display:flex;align-items:flex-start;gap:10px;font-size:13px;color:rgba(255,255,255,.55);margin-bottom:10px;line-height:1.5}
.fci svg{color:var(--gold);flex-shrink:0;margin-top:2px}
.fci a{color:inherit;transition:color var(--tr)}
.fci a:hover{color:var(--golds)}
.nlform{display:flex;overflow:hidden;border-radius:50px;border:1px solid rgba(255,255,255,.12);margin-top:8px}
.nlform input{flex:1;padding:10px 14px;background:rgba(255,255,255,.05);border:none;outline:none;color:#fff;font-size:12px;font-family:var(--sans)}
.nlform input::placeholder{color:rgba(255,255,255,.3)}
.nlform button{padding:10px 14px;background:var(--gold);color:var(--gdp);border:none;cursor:pointer;transition:background var(--tr)}
.nlform button:hover{background:var(--golds)}
.fbot{max-width:1200px;margin:0 auto;padding:18px 0;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
.fleg{display:flex;gap:20px;flex-wrap:wrap}
.fleg a{font-size:12px;color:rgba(255,255,255,.35);transition:color var(--tr)}
.fleg a:hover{color:var(--golds)}
.fbld{font-size:12px;color:rgba(255,255,255,.35);width:100%;padding-top:8px;border-top:1px solid rgba(255,255,255,.06)}
.fbld a{color:rgba(255,255,255,.5);text-decoration:none;transition:color var(--tr)}
.fbld a:hover{color:var(--golds)}
.fcopy{font-size:12px;color:rgba(255,255,255,.35)}

/* ── RESPONSIVE ── */
@media(max-width:1100px){
  .cgrid{grid-template-columns:1fr;gap:44px}
  .pcol{position:static}
  .pimgw{min-height:380px;max-height:560px}
  .mtypes{grid-template-columns:repeat(3,1fr)}
  .fgrid{grid-template-columns:1fr 1fr;gap:28px}
}
@media(max-width:768px){
  .ni{height:56px;padding:0 6px 0 12px!important;overflow:visible!important}
  /* logo — mobile sizing */
  .logo-ring-wrap{width:40px!important;height:40px!important;overflow:visible!important}
  .logo-img{width:40px!important;height:40px!important}
  .logo-name{font-size:17px!important;letter-spacing:2px!important}
  .logo-tag{font-size:7px!important;letter-spacing:1.5px!important}
  .cmain{padding:52px 5%}
  .cher{padding:calc(var(--nh)+36px) 5% 44px}
  .cht{font-size:clamp(36px,7vw,54px)}
  .chst{gap:18px}
  .frow{grid-template-columns:1fr}
  .mfrow{grid-template-columns:1fr}
  .mfrow .mfi{margin-bottom:0}
  .fgrid{grid-template-columns:1fr;gap:22px}
  .fbot{flex-direction:column;align-items:flex-start;gap:8px}
  .fleg{flex-wrap:wrap;gap:12px}
}
@media(max-width:480px){
  .cher{padding:calc(var(--nh)+28px) 20px 36px}
  .cht{font-size:32px}
  .chst{flex-direction:column;gap:10px}
  .chsi{font-size:12px}
  .cmain{padding:40px 20px}
  .ftabs{flex-direction:column;border-radius:12px}
  .ftb{border-radius:10px;padding:13px}
  .pinfo{padding:20px 20px 24px}
  .pname{font-size:22px}
  .meetcard{padding:22px 18px}
  .mtypes{grid-template-columns:repeat(3,1fr);gap:7px}
  .mtype{padding:11px 5px}
  .mtype-det{display:none}
  .qcont{padding:18px}
  #ftr{padding:36px 20px 0}
  .nlform{flex-direction:column;border-radius:10px}
  .nlform input{border-radius:10px 10px 0 0;padding:12px 14px}
  .nlform button{border-radius:0 0 10px 10px;padding:12px;justify-content:center;display:flex;align-items:center;gap:6px}
}
`,
];
