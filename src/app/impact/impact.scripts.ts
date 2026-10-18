export const SCRIPTS: string[] = [
  `
    // Passive event listeners for scroll performance
    (function(){
      var supportsPassive = false;
      try { window.addEventListener('test',null,Object.defineProperty({},'passive',{get:function(){supportsPassive=true}})); } catch(e){}
      window._passiveOpt = supportsPassive ? {passive:true} : false;
    })();
    // Preload critical images above fold
    if ('IntersectionObserver' in window === false) {
      document.querySelectorAll('img[loading="lazy"]').forEach(function(img){ img.src = img.src; });
    }
  `,
  `
'use strict';

/* Scroll progress */
const sp = document.getElementById('sp');
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(() => { const d = document.documentElement; sp.style.width = (window.scrollY / (d.scrollHeight - window.innerHeight) * 100) + '%'; ticking = false; }); ticking = true; }
}, { passive: true });

/* Scroll reveal */
const rvObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); rvObs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.rv').forEach(el => rvObs.observe(el));

/* Counter animation */
const counters = document.querySelectorAll('.counter[data-target]');
const cObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dur = 1800;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(ease * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    cObs.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(el => cObs.observe(el));

/* Bar chart animation */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.bar-item').forEach((item, i) => {
      const pct = item.dataset.pct;
      setTimeout(() => {
        item.querySelector('.bar-fill').style.width = pct + '%';
      }, i * 120);
    });
    barObs.unobserve(e.target);
  });
}, { threshold: 0.3 });
const barChart = document.getElementById('barChart');
if (barChart) barObs.observe(barChart);

/* Timeline fill animation */
const tlObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const wrap = document.querySelector('.tl-wrap');
    const fill = document.getElementById('tlFill');
    if (wrap && fill) {
      fill.style.height = wrap.offsetHeight + 'px';
    }
    tlObs.unobserve(e.target);
  });
}, { threshold: 0.1 });
const tlWrap = document.querySelector('.tl-wrap');
if (tlWrap) tlObs.observe(tlWrap);

/* Mobile drawer — full panel */
(function(){
  const burger = document.getElementById('burgerBtn');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('mdBackdrop');
  const closeBtn = document.getElementById('mdClose');
  if (!burger || !drawer) return;
  function openDrawer() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    burger.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    burger.classList.remove('active');
    document.body.style.overflow = '';
  }
  burger.addEventListener('click', () => drawer.classList.contains('open') ? closeDrawer() : openDrawer());
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);
  drawer.querySelectorAll('.md-link').forEach(a => a.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
})();

/* Goo blob tracker */
(function(){
  const wrap = document.getElementById('gooNavWrap');
  const blob = document.getElementById('gooBlob');
  if (!wrap || !blob) return;
  const links = wrap.querySelectorAll('.nm a, .nav-menu a');
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const wr = wrap.getBoundingClientRect();
      const lr = link.getBoundingClientRect();
      blob.style.left = (lr.left - wr.left) + 'px';
      blob.style.width = lr.width + 'px';
    });
  });
})();

/* Footer newsletter */
document.getElementById('ftNl').addEventListener('submit', function(e) {
  e.preventDefault();
  const input = this.querySelector('input');
  if (input.value && /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(input.value)) {
    const btn = this.querySelector('button');
    btn.innerHTML = '✓'; btn.style.background = '#2d7a4f'; input.value = '';
    setTimeout(() => { btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'; btn.style.background = ''; }, 3000);
  }
});
`,
  `
(function() {
  'use strict';

  // ── COOKIE BANNER ────────────────────────────────
  const banner = document.getElementById('cookie-banner');
  const consent = localStorage.getItem('wajibu_cookie_consent');
  if (!consent && banner) {
    setTimeout(() => banner.classList.add('show'), 1200);
  }
  const acceptBtn = document.getElementById('cbAccept');
  const declineBtn = document.getElementById('cbDecline');
  if (acceptBtn) acceptBtn.addEventListener('click', () => {
    localStorage.setItem('wajibu_cookie_consent', 'accepted');
    banner.classList.remove('show');
  });
  if (declineBtn) declineBtn.addEventListener('click', () => {
    localStorage.setItem('wajibu_cookie_consent', 'declined');
    banner.classList.remove('show');
  });

  // ── BACK TO TOP ──────────────────────────────────
  const btt = document.getElementById('btt');
  window.addEventListener('scroll', () => {
    if (btt) btt.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
  if (btt) {
    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
`,
  `
(function(){
  var sp=document.createElement('div');sp.id='wj-progress';document.body.prepend(sp);
  window.addEventListener('scroll',function(){var d=document.documentElement;sp.style.width=(window.scrollY/(d.scrollHeight-d.clientHeight)*100)+'%'},{passive:true});
  var cd=document.createElement('div');cd.className='wj-cur';
  var cr=document.createElement('div');cr.className='wj-ring';
  document.body.appendChild(cd);document.body.appendChild(cr);
  var mx=0,my=0,rx=0,ry=0;
  window.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;cd.style.left=mx+'px';cd.style.top=my+'px'},{passive:true});
  (function loop(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;cr.style.left=Math.round(rx)+'px';cr.style.top=Math.round(ry)+'px';requestAnimationFrame(loop)})();
  document.querySelectorAll('a[class*="cta"],a[class*="btn"],button[class*="btn"]').forEach(function(b){
    b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;b.style.transform='translate('+(x*7)+'px,'+(y*4)+'px) scale(1.03)'});
    b.addEventListener('mouseleave',function(){b.style.transform=''});
  });
  document.querySelectorAll('.service-card,.stat-item,.case-card,.hook-card,.mvv-card,.ps,.evidence-card,.service-info-card').forEach(function(c){
    c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform='perspective(800px) rotateY('+(x*8)+'deg) rotateX('+(-y*6)+'deg) translateZ(8px)';c.style.boxShadow='0 '+(8+Math.abs(y)*22)+'px '+(32+Math.abs(x)*20)+'px rgba(0,0,0,0.22),0 0 '+(20+Math.abs(x+y)*12)+'px rgba(212,160,23,0.07)'});
    c.addEventListener('mouseleave',function(){c.style.transform='';c.style.boxShadow=''});
  });
  var sio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target,t=el.innerText,n=parseFloat(t.replace(/[^0-9.]/g,''));if(isNaN(n)||n===0)return;var pre=t.match(/^[^0-9]*/)[0],suf=t.replace(/^[^0-9]*[0-9.,]+/,''),dur=1600,s=performance.now();(function f(now){var p=Math.min((now-s)/dur,1),ease=1-Math.pow(1-p,3),v=n*ease,disp=v>=10?Math.round(v).toLocaleString():(Math.round(v*10)/10)+'';el.innerText=pre+disp+suf;if(p<1)requestAnimationFrame(f)})(performance.now());sio.unobserve(el)})},{threshold:0.7});
  document.querySelectorAll('.stat-number,.stat-num,.hsp-num').forEach(function(el){sio.observe(el)});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target;el.classList.remove('wj-glitch');var ws=el.innerText.trim().split(' ');el.innerHTML=ws.map(function(w,i){return'<span style="display:inline-block;overflow:hidden;vertical-align:bottom"><span style="display:inline-block;transform:translateY(105%);animation:wjCharUp 0.6s cubic-bezier(0.16,1,0.3,1) '+(i*.065).toFixed(3)+'s forwards">'+w+'</span></span> '}).join('');setTimeout(function(){el.classList.add('wj-glitch')},1600);io.unobserve(el)})},{threshold:0.35});
  document.querySelectorAll('.section-title:not(.hero-headline)').forEach(function(el){el.classList.add('wj-glitch');io.observe(el)});
  document.querySelectorAll('a[href="/contact"],a[href*="contact"]').forEach(function(b){b.classList.add('wj-pulse-cta')});
})();
`,
];
