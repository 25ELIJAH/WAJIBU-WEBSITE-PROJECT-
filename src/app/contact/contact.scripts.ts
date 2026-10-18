export const SCRIPTS: string[] = [
  `
'use strict';

/* ── ACCESS KEY (assembled at runtime) ── */
(function(){
  var p=['a8cb','ade8','-','e327','-4107','-9cbc','-5049a8e5','6d72'];
  var k=p.join('');
  ['enqKey','bookKey','meetKey'].forEach(function(id){
    var el=document.getElementById(id);
    if(el)el.value=k;
  });
})();

/* ── SCROLL PROGRESS + BTT ── */
var spb=document.getElementById('spb');
var btt=document.getElementById('btt');
var navEl=document.getElementById('navbar');
window.addEventListener('scroll',function(){
  var d=document.documentElement;
  var pct=window.scrollY/(d.scrollHeight-window.innerHeight)*100;
  if(spb)spb.style.width=pct+'%';
  if(navEl)navEl.classList.toggle('scrolled',window.scrollY>80);
  if(btt){
    var show=window.scrollY>400;
    btt.style.opacity=show?'1':'0';
    btt.style.visibility=show?'visible':'hidden';
    btt.style.transform=show?'translateY(0)':'translateY(12px)';
  }
},{passive:true});
if(btt)btt.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});

/* ── SCROLL REVEAL ── */
var rvObs=new IntersectionObserver(function(entries){
  entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('vis');rvObs.unobserve(e.target);}});
},{threshold:.1});
document.querySelectorAll('.rv').forEach(function(el){rvObs.observe(el);});

/* ── GOOEY BLOB ── */
(function(){
  var wrap=document.getElementById('gooNavWrap');
  var blob=document.getElementById('gooBlob');
  if(!wrap||!blob)return;
  wrap.querySelectorAll('.nav-menu a').forEach(function(link){
    link.addEventListener('mouseenter',function(){
      var wr=wrap.getBoundingClientRect();
      var lr=link.getBoundingClientRect();
      blob.style.left=(lr.left-wr.left)+'px';
      blob.style.width=lr.width+'px';
    });
  });
})();

/* ── MOBILE DRAWER ── */
(function(){
  var btn=document.getElementById('burgerBtn');
  var drawer=document.getElementById('mobileDrawer');
  var bk=document.getElementById('mdBackdrop');
  var cl=document.getElementById('mdClose');
  if(!btn||!drawer)return;
  function open(){drawer.classList.add('open');btn.classList.add('open');btn.setAttribute('aria-expanded','true');drawer.setAttribute('aria-hidden','false');document.body.classList.add('mo');}
  function close(){drawer.classList.remove('open');btn.classList.remove('open');btn.setAttribute('aria-expanded','false');drawer.setAttribute('aria-hidden','true');document.body.classList.remove('mo');}
  btn.addEventListener('click',function(){drawer.classList.contains('open')?close():open();});
  if(cl)cl.addEventListener('click',close);
  if(bk)bk.addEventListener('click',close);
  drawer.querySelectorAll('.md-link').forEach(function(a){a.addEventListener('click',close);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
})();

/* ── FORM TABS ── */
var tabBtns=document.querySelectorAll('.ftb');
var panels=document.querySelectorAll('.fpanel');
tabBtns.forEach(function(btn,i){
  btn.addEventListener('click',function(){
    tabBtns.forEach(function(b){b.classList.remove('active');b.setAttribute('aria-selected','false');});
    panels.forEach(function(p){p.classList.remove('active');});
    btn.classList.add('active');btn.setAttribute('aria-selected','true');panels[i].classList.add('active');
  });
});

/* ── MEETING TYPE SELECTOR ── */
var mTypeCards=document.querySelectorAll('.mtype');
var mTypeHidden=document.getElementById('meetTypeHidden');
function updateMeetType(){
  mTypeCards.forEach(function(card){
    var radio=card.querySelector('input[type=radio]');
    if(radio.checked){card.classList.add('sel');if(mTypeHidden)mTypeHidden.value=radio.value;}
    else card.classList.remove('sel');
  });
}
// Set initial
if(mTypeCards.length){mTypeCards[0].classList.add('sel');}
mTypeCards.forEach(function(card){
  card.addEventListener('click',function(){
    mTypeCards.forEach(function(c){c.querySelector('input').checked=false;c.classList.remove('sel');});
    card.querySelector('input').checked=true;
    card.classList.add('sel');
    if(mTypeHidden)mTypeHidden.value=card.querySelector('input').value;
  });
});

/* ── SUCCESS OVERLAY ── */
var sov=document.getElementById('sov');
function spawnParticles(){
  var existing=document.querySelectorAll('.sov-part');
  existing.forEach(function(p){p.remove();});
  var colors=['#D4A017','#E5C46A','#fff','#f0c040','#c8860a'];
  for(var i=0;i<40;i++){
    var p=document.createElement('div');
    p.className='sov-part';
    var size=Math.random()*8+4;
    var x=(Math.random()-0.5)*window.innerWidth*0.9;
    var y=-(Math.random()*window.innerHeight*0.7+80);
    var dur=(Math.random()*1.2+0.8)+'s';
    var del=(Math.random()*0.6)+'s';
    p.style.cssText='width:'+size+'px;height:'+size+'px;background:'+colors[Math.floor(Math.random()*colors.length)]+';left:50%;top:50%;margin-left:'+(x-size/2)+'px;margin-top:'+(y-size/2)+'px;--dur:'+dur+';--del:'+del+';--py:'+y+'px;--px:'+x+'px;';
    sov.appendChild(p);
  }
}
function showSuccess(meetType,refNum){
  var arc=sov.querySelector('.sov-ring-arc');
  var chk=sov.querySelector('.sov-check');
  var title=document.getElementById('sovTitle');
  var sub=document.getElementById('sovSub');
  var card=document.getElementById('sovCard');
  var ref=document.getElementById('sovRef');
  var btn=document.getElementById('sovClose');
  var typeEl=document.getElementById('sovType');
  // Reset
  [arc,chk].forEach(function(el){el.classList.remove('go');});
  [title,sub,card,ref,btn].forEach(function(el){el.classList.remove('go');});
  if(typeEl&&meetType)typeEl.textContent=meetType;
  if(ref)ref.textContent='Reference: WBJ-'+refNum;
  sov.classList.add('on');
  document.body.style.overflow='hidden';
  spawnParticles();
  // Stagger animations
  requestAnimationFrame(function(){
    setTimeout(function(){arc.classList.add('go');},100);
    setTimeout(function(){chk.classList.add('go');},200);
    setTimeout(function(){title.classList.add('go');},600);
    setTimeout(function(){sub.classList.add('go');},1100);
    setTimeout(function(){card.classList.add('go');},1400);
    setTimeout(function(){ref.classList.add('go');},1700);
    setTimeout(function(){btn.classList.add('go');},2000);
  });
}
document.getElementById('sovClose').addEventListener('click',function(){
  sov.classList.remove('on');
  document.body.style.overflow='';
});

/* ── WEB3FORMS SUBMIT ── */
function handleForm(formId,succId,onSuccess){
  var form=document.getElementById(formId);
  var succ=document.getElementById(succId);
  if(!form)return;
  form.addEventListener('submit',async function(e){
    e.preventDefault();
    var ck=form.querySelector('input[type=checkbox]');
    if(ck&&!ck.checked){ck.closest('.fck').style.outline='2px solid #D4A017';return;}
    var btn=form.querySelector('button[type=submit]');
    var orig=btn.innerHTML;
    btn.innerHTML='<svg width="18" height="18" viewBox="0 0 18 18" fill="none" style="animation:spin .8s linear infinite"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.5" stroke-dasharray="28" stroke-dashoffset="10" stroke-linecap="round"/></svg> Sending...';
    btn.disabled=true;
    try{
      var fd=new FormData(form);
      var res=await fetch('https://api.web3forms.com/submit',{method:'POST',body:fd});
      var json=await res.json();
      if(json.success){
        if(onSuccess){onSuccess();}
        else{form.style.display='none';if(succ)succ.classList.add('show');}
      }else{throw new Error('fail');}
    }catch(err){
      btn.innerHTML=orig;btn.disabled=false;
      btn.style.background='linear-gradient(135deg,#c73c3c,#e05555)';
      setTimeout(function(){btn.style.background='';},2800);
    }
  });
}

handleForm('enqForm','enqSucc');
handleForm('bookForm','bookSucc');
handleForm('meetForm',null,function(){
  var mt=document.getElementById('meetTypeHidden');
  var ref=Math.floor(Math.random()*9000+1000);
  document.getElementById('meetSection').style.opacity='0.4';
  document.getElementById('meetSection').style.pointerEvents='none';
  showSuccess(mt?mt.value:'Meeting',ref);
  // Reset after close
  document.getElementById('sovClose').addEventListener('click',function once(){
    document.getElementById('meetSection').style.opacity='';
    document.getElementById('meetSection').style.pointerEvents='';
    document.getElementById('meetForm').reset();
    updateMeetType();
    document.getElementById('sovClose').removeEventListener('click',once);
  },{once:true});
});

/* ── NEWSLETTER ── */
document.getElementById('nlForm').addEventListener('submit',function(e){
  e.preventDefault();
  var inp=this.querySelector('input');
  if(inp.value&&inp.checkValidity()){
    var btn=this.querySelector('button');
    btn.innerHTML='&#10003;';btn.style.background='#2d7a4f';
    inp.value='';
    setTimeout(function(){btn.innerHTML='<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';btn.style.background='';},2800);
  }
});

/* ── COOKIE BANNER ── */
(function(){
  if(localStorage.getItem('wcb'))return;
  var banner=document.createElement('div');
  banner.style.cssText='position:fixed;bottom:-200px;left:0;right:0;z-index:9990;padding:0 20px 20px;transition:bottom .5s cubic-bezier(.16,1,.3,1);pointer-events:none';
  banner.innerHTML='<div style="max-width:960px;margin:0 auto;background:#0d2a1e;border:1px solid rgba(212,160,23,.2);border-radius:14px;padding:18px 22px;display:flex;align-items:center;justify-content:space-between;gap:18px;box-shadow:0 -8px 48px rgba(0,0,0,.3);flex-wrap:wrap"><div style="flex:1;font-size:13px;color:rgba(255,255,255,.6);line-height:1.55">We use essential cookies to make this site work. By continuing you accept our <a href="/privacy" style="color:#D4A017;text-decoration:underline">Privacy Policy</a>.</div><div style="display:flex;gap:10px;flex-shrink:0"><button id="cbD" style="padding:9px 20px;border-radius:50px;border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.6);font-size:13px;cursor:pointer;background:none;font-family:inherit">Decline</button><button id="cbA" style="padding:9px 22px;border-radius:50px;background:linear-gradient(135deg,#D4A017,#E5C46A);color:#072B1E;font-size:13px;font-weight:700;cursor:pointer;border:none;font-family:inherit">Accept</button></div></div>';
  document.body.appendChild(banner);
  setTimeout(function(){banner.style.bottom='0';banner.style.pointerEvents='all';},1200);
  function hide(){banner.style.bottom='-200px';banner.style.pointerEvents='none';}
  document.getElementById('cbA').addEventListener('click',function(){localStorage.setItem('wcb','1');hide();});
  document.getElementById('cbD').addEventListener('click',function(){localStorage.setItem('wcb','0');hide();});
})();
`,
];
