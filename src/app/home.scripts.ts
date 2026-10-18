export const SCRIPTS: string[] = [
  `
    (function(){
      const slides = document.querySelectorAll('.tc-slide');
      const dotsWrap = document.getElementById('tcDots');
      const progress = document.getElementById('tcProgress');
      let cur = 0, timer, startTime, raf, paused = false;
      const INTERVAL = 5000;

      // Build dots
      slides.forEach((_, i) => {
        const d = document.createElement('button');
        d.className = 'tc-dot' + (i===0?' active':'');
        d.setAttribute('role','tab');
        d.setAttribute('aria-label', \`Slide \${i+1}\`);
        d.addEventListener('click', () => { goTo(i); resetTimer(); });
        dotsWrap.appendChild(d);
      });

      function goTo(idx) {
        slides[cur].classList.remove('active');
        document.querySelectorAll('.tc-dot')[cur].classList.remove('active');
        cur = (idx + slides.length) % slides.length;
        slides[cur].classList.add('active');
        document.querySelectorAll('.tc-dot')[cur].classList.add('active');
        progress.style.width = '0%';
      }

      function tick(ts) {
        if (!startTime) startTime = ts;
        const elapsed = ts - startTime;
        const pct = Math.min((elapsed / INTERVAL) * 100, 100);
        progress.style.width = pct + '%';
        if (elapsed >= INTERVAL) { goTo(cur + 1); startTime = ts; }
        if (!paused) raf = requestAnimationFrame(tick);
      }

      function resetTimer() { startTime = null; }
      function startAuto() { paused = false; raf = requestAnimationFrame(tick); }
      function stopAuto() { paused = true; cancelAnimationFrame(raf); }

      document.getElementById('tcPrev').addEventListener('click', () => { goTo(cur-1); resetTimer(); });
      document.getElementById('tcNext').addEventListener('click', () => { goTo(cur+1); resetTimer(); });

      // Pause on hover
      const wrap = document.querySelector('.tc-wrap');
      wrap.addEventListener('mouseenter', stopAuto);
      wrap.addEventListener('mouseleave', () => { startAuto(); });

      // Touch swipe
      let tx = 0;
      wrap.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, {passive:true});
      wrap.addEventListener('touchend', e => {
        const diff = tx - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { goTo(diff > 0 ? cur+1 : cur-1); resetTimer(); }
      }, {passive:true});

      startAuto();
    })();
    `,
  `
    // Scroll progress
    const sp = document.getElementById('scroll-progress');
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const d = document.documentElement;
          sp.style.width = (window.scrollY / (d.scrollHeight - window.innerHeight) * 100) + '%';
          document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 80);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // ── Gooey blob tracking ──────────────────────────────
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

    // Hero init
    const heroBg = document.getElementById('heroBg');
    setTimeout(() => document.getElementById('hero').classList.add('loaded'), 100);

    // ── Parallax on hero background image ──
    (function(){
      const img = document.getElementById('heroBgImg');
      if (!img) return;
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const y = window.scrollY;
            const maxScroll = window.innerHeight;
            if (y <= maxScroll) {
              const shift = (y / maxScroll) * 14; // max 14% downward shift
              img.style.objectPosition = \`center \${35 + shift}%\`;
            }
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    })();

    // Floating leaves
    const wrap = document.getElementById('particlesWrap');
    const leafSVG = \`<svg viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 22C5 18 1 12 3 5c4-1 10 2 13 8-1 4-4 7-6 9z" fill="#4a8c6a" opacity="0.5"/><path d="M10 22L8 12" stroke="#4a8c6a" stroke-width="0.8" opacity="0.4"/></svg>\`;
    for (let i = 0; i < 12; i++) {
      const el = document.createElement('div');
      el.className = 'particle';
      el.style.cssText = \`left:\${Math.random()*100}%;bottom:-20px;width:\${6+Math.random()*10}px;height:\${8+Math.random()*14}px;animation-duration:\${7+Math.random()*10}s;animation-delay:\${Math.random()*8}s;\`;
      el.innerHTML = leafSVG;
      wrap.appendChild(el);
    }

    // Scroll reveal
    const revObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

    // Counters
    const cObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.target);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now-start)/1800, 1);
          const ease = 1-Math.pow(1-p,3);
          el.innerHTML = prefix + Math.round(ease*target) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        cObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-number[data-target]').forEach(el => cObs.observe(el));

    // Carousel
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    let current = 0;
    let autoTimer;
    function goTo(idx) {
      slides[current].classList.remove('active'); dots[current].classList.remove('active'); dots[current].setAttribute('aria-selected','false');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active'); dots[current].classList.add('active'); dots[current].setAttribute('aria-selected','true');
    }
    function startAuto() { autoTimer = setInterval(() => goTo(current+1), 6000); }
    function resetAuto() { clearInterval(autoTimer); startAuto(); }
    document.getElementById('prevBtn').addEventListener('click', () => { goTo(current-1); resetAuto(); });
    document.getElementById('nextBtn').addEventListener('click', () => { goTo(current+1); resetAuto(); });
    dots.forEach((d,i) => d.addEventListener('click', () => { goTo(i); resetAuto(); }));
    startAuto();

    // Mobile drawer
    const burgerBtn = document.getElementById('burgerBtn');
    const drawer = document.getElementById('mobileDrawer');
    let open = false;
    burgerBtn.addEventListener('click', () => {
      open = !open; drawer.classList.toggle('open', open);
      drawer.setAttribute('aria-hidden', !open); burgerBtn.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      open = false; drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true');
      burgerBtn.setAttribute('aria-expanded','false'); document.body.style.overflow = '';
    }));

    // Newsletter
    document.getElementById('newsletterForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const input = this.querySelector('input');
      if (input.value && input.checkValidity()) {
        const btn = this.querySelector('button');
        const orig = btn.innerHTML;
        btn.innerHTML = '&#10003;'; btn.style.background = '#2d7a4f'; input.value = '';
        setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 3000);
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
    (function() {
      // ── SCROLL PROGRESS ──────────────────────────────────────
      var sp = document.createElement('div');
      sp.id = 'wj-progress';
      document.body.prepend(sp);
      window.addEventListener('scroll', function() {
        var d = document.documentElement;
        sp.style.width = (window.scrollY / (d.scrollHeight - d.clientHeight) * 100) + '%';
      }, { passive: true });

      // ── CURSOR GLOW ───────────────────────────────────────────
      var cd = document.createElement('div'); cd.className = 'wj-cur';
      var cr = document.createElement('div'); cr.className = 'wj-ring';
      document.body.appendChild(cd); document.body.appendChild(cr);
      var mx = 0, my = 0, rx = 0, ry = 0;
      window.addEventListener('mousemove', function(e) {
        mx = e.clientX; my = e.clientY;
        cd.style.left = mx + 'px'; cd.style.top = my + 'px';
      }, { passive: true });
      (function loop() {
        rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
        cr.style.left = Math.round(rx) + 'px'; cr.style.top = Math.round(ry) + 'px';
        requestAnimationFrame(loop);
      })();

      // ── MAGNETIC CTAs ─────────────────────────────────────────
      document.querySelectorAll('.btn-primary, .hero-cta-main, .btn-outline').forEach(function(btn) {
        btn.addEventListener('mousemove', function(e) {
          var r = btn.getBoundingClientRect();
          var x = e.clientX - r.left - r.width / 2;
          var y = e.clientY - r.top - r.height / 2;
          btn.style.transform = 'translate(' + (x * 0.18) + 'px,' + (y * 0.22) + 'px) scale(1.03)';
        });
        btn.addEventListener('mouseleave', function() { btn.style.transform = ''; });
      });

      // ── CARD 3D TILT ─────────────────────────────────────────
      document.querySelectorAll('.service-card, .stat-item').forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
          var r = card.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - 0.5;
          var y = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = 'perspective(700px) rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 8) + 'deg) translateZ(6px)';
          card.style.boxShadow = '0 ' + (8 + Math.abs(y) * 18) + 'px ' + (28 + Math.abs(x) * 18) + 'px rgba(0,0,0,0.18), 0 0 ' + (16 + Math.abs(x + y) * 10) + 'px rgba(212,160,23,0.06)';
        });
        card.addEventListener('mouseleave', function() {
          card.style.transform = ''; card.style.boxShadow = '';
        });
      });

      // ── STAT GLOW ON SCROLL ───────────────────────────────────
      var cObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting) {
            e.target.style.animation = 'wjPulseGold 0.8s ease forwards';
            cObs.unobserve(e.target);
          }
        });
      }, { threshold: 0.8 });
      document.querySelectorAll('.stat-number, .hsp-num').forEach(function(el) { cObs.observe(el); });

      // ── WORD-BY-WORD HEADLINE REVEAL ──────────────────────────
      var ioH = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var words = el.innerText.trim().split(' ');
          el.innerHTML = words.map(function(w, i) {
            return '<span style="display:inline-block;overflow:hidden;vertical-align:bottom"><span style="display:inline-block;transform:translateY(105%);animation:wjCharUp 0.55s cubic-bezier(0.16,1,0.3,1) ' + (i * 0.06).toFixed(2) + 's forwards">' + w + '</span></span> ';
          }).join('');
          ioH.unobserve(el);
        });
      }, { threshold: 0.4 });
      document.querySelectorAll('.section-title:not(.hero-headline)').forEach(function(el) { ioH.observe(el); });

    })();
  `,
];
