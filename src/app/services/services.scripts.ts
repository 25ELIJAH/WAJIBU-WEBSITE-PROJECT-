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
    // Scroll progress
    const scrollBar = document.getElementById('scroll-progress');
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const d = document.documentElement;
          scrollBar.style.width = (window.scrollY / (d.scrollHeight - window.innerHeight) * 100) + '%';
          // Sticky tabs active state
          updateActiveTabs();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Sticky service tabs — highlight active on scroll
    const sections = ['strategy','compliance','reporting','training','audits','advisory'];
    const tabs = document.querySelectorAll('.svc-tab');
    function updateActiveTabs() {
      let current = sections[0];
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 160) current = id;
      });
      tabs.forEach(t => t.classList.toggle('active', t.dataset.target === current));
    }

    // Tab click → smooth scroll
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = document.getElementById(tab.dataset.target);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // Scroll reveal
    const revealEls = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    revealEls.forEach(el => obs.observe(el));

    // FAQ accordion
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
        q.setAttribute('aria-expanded', !isOpen);
      });
    });

    // Mobile drawer — handled by MOBILE MENU JS block below

    // Newsletter
    document.getElementById('newsletterForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const input = this.querySelector('input');
      if (input.value && input.checkValidity()) {
        const btn = this.querySelector('button');
        btn.innerHTML = '✓'; btn.style.background = '#4a8c6a'; input.value = '';
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
    var btn = document.getElementById('burgerBtn');
    var drawer = document.getElementById('mobileDrawer');
    var backdrop = document.getElementById('mdBackdrop');
    var closeBtn = document.getElementById('mdClose');
    var isOpen = false;

    function openMenu(){
      isOpen = true;
      drawer.classList.add('open');
      btn.classList.add('active');
      btn.setAttribute('aria-expanded','true');
      drawer.setAttribute('aria-hidden','false');
      document.body.classList.add('menu-open');
    }
    function closeMenu(){
      isOpen = false;
      drawer.classList.remove('open');
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded','false');
      drawer.setAttribute('aria-hidden','true');
      document.body.classList.remove('menu-open');
    }

    if(btn) btn.addEventListener('click', function(){ isOpen ? closeMenu() : openMenu(); });
    if(closeBtn) closeBtn.addEventListener('click', closeMenu);
    if(backdrop) backdrop.addEventListener('click', closeMenu);

    // Close on link click
    if(drawer) drawer.querySelectorAll('.md-link,.md-cta').forEach(function(a){
      a.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', function(e){
      if(e.key==='Escape' && isOpen) closeMenu();
    });

    // Click ripple on md-link
    if(drawer) drawer.querySelectorAll('.md-link').forEach(function(link){
      link.addEventListener('click', function(e){
        var r = document.createElement('span');
        r.style.cssText = 'position:absolute;border-radius:50%;background:rgba(212,160,23,0.15);pointer-events:none;width:20px;height:20px;transform:scale(0);animation:mdRipple 0.5s ease;left:'+e.offsetX+'px;top:'+e.offsetY+'px;margin-left:-10px;margin-top:-10px;';
        this.appendChild(r);
        setTimeout(function(){ r.remove(); }, 520);
      });
    });
  })();
  `,
  `
  /* Goo blob tracker */
  (function(){
    const wrap = document.getElementById('gooNavWrap');
    const blob = document.getElementById('gooBlob');
    if (!wrap || !blob) return;
    const links = wrap.querySelectorAll('.nav-menu a');
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        const wr = wrap.getBoundingClientRect();
        const lr = link.getBoundingClientRect();
        blob.style.left = (lr.left - wr.left) + 'px';
        blob.style.width = lr.width + 'px';
      });
    });
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
