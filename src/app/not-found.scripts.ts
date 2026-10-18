export const SCRIPTS: string[] = [
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
];
