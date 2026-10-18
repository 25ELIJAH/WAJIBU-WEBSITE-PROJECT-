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
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Scroll reveal
    const revealEls = document.querySelectorAll('.reveal');
    new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); }
      });
    }, { threshold: 0.1 }).observe
    ? (() => {
        const obs = new IntersectionObserver((entries) => {
          entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
        }, { threshold: 0.1 });
        revealEls.forEach(el => obs.observe(el));
      })()
    : revealEls.forEach(el => el.classList.add('visible'));

    // Mobile drawer — blob panel
    (function(){
      var btn = document.getElementById('burgerBtn');
      var drawer = document.getElementById('mobileDrawer');
      var backdrop = document.getElementById('mdBackdrop');
      var closeBtn = document.getElementById('mdClose');
      var isOpen = false;
      function openMenu(){ isOpen=true; drawer.classList.add('open'); btn.classList.add('active'); btn.setAttribute('aria-expanded','true'); drawer.setAttribute('aria-hidden','false'); document.body.classList.add('menu-open'); }
      function closeMenu(){ isOpen=false; drawer.classList.remove('open'); btn.classList.remove('active'); btn.setAttribute('aria-expanded','false'); drawer.setAttribute('aria-hidden','true'); document.body.classList.remove('menu-open'); }
      if(btn) btn.addEventListener('click',function(){ isOpen?closeMenu():openMenu(); });
      if(closeBtn) closeBtn.addEventListener('click',closeMenu);
      if(backdrop) backdrop.addEventListener('click',closeMenu);
      if(drawer) drawer.querySelectorAll('.md-link,.md-cta').forEach(function(a){ a.addEventListener('click',closeMenu); });
      document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&isOpen) closeMenu(); });
    })();
    // Gooey blob tracking
    (function(){
      var wrap=document.getElementById('gooNavWrap'); var blob=document.getElementById('gooBlob');
      if(!wrap||!blob) return;
      wrap.querySelectorAll('.nav-menu a').forEach(function(link){
        link.addEventListener('mouseenter',function(){
          var wr=wrap.getBoundingClientRect(); var lr=link.getBoundingClientRect();
          blob.style.left=(lr.left-wr.left)+'px'; blob.style.width=lr.width+'px';
        });
      });
    })();

    // Newsletter
    document.getElementById('newsletterForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const input = this.querySelector('input');
      if (input.value && input.checkValidity()) {
        const btn = this.querySelector('button');
        btn.innerHTML = '✓'; btn.style.background = '#4a8c6a';
        input.value = '';
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
    b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;b.style.transform='translate('+(x*6)+'px,'+(y*3)+'px) scale(1.02)'});
    b.addEventListener('mouseleave',function(){b.style.transform=''});
  });
  document.querySelectorAll('.service-card,.stat-item,.case-card,.hook-card,.mvv-card,.evidence-card,.service-info-card').forEach(function(c){
    c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform='perspective(800px) rotateY('+(x*7)+'deg) rotateX('+(-y*5)+'deg) translateZ(6px)'});
    c.addEventListener('mouseleave',function(){c.style.transform=''});
  });
  var sio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target,t=el.innerText,n=parseFloat(t.replace(/[^0-9.]/g,''));if(isNaN(n)||n===0)return;var pre=t.match(/^[^0-9]*/)[0],suf=t.replace(/^[^0-9]*[0-9.,]+/,''),dur=1600,s=performance.now();(function f(now){var p=Math.min((now-s)/dur,1),ease=1-Math.pow(1-p,3),v=n*ease,disp=v>=10?Math.round(v).toLocaleString():(Math.round(v*10)/10)+'';el.innerText=pre+disp+suf;if(p<1)requestAnimationFrame(f)})(performance.now());sio.unobserve(el)})},{threshold:0.7});
  document.querySelectorAll('.stat-number,.stat-num,.hsp-num').forEach(function(el){sio.observe(el)});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target,ws=el.innerText.trim().split(' ');el.innerHTML=ws.map(function(w,i){return'<span style="display:inline-block;overflow:hidden;vertical-align:bottom"><span style="display:inline-block;transform:translateY(105%);animation:wjCharUp 0.55s cubic-bezier(0.16,1,0.3,1) '+(i*.06).toFixed(3)+'s forwards">'+w+'</span></span> '}).join('');io.unobserve(el)})},{threshold:0.4});
  document.querySelectorAll('.section-title:not(.hero-headline),.hf-title').forEach(function(el){io.observe(el)});
})();
`,
];
