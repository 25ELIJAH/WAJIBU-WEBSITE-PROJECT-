"use client";

export default function SharedStyles3() {
  return (
    <>
<style dangerouslySetInnerHTML={{ __html: `
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
` }} />
    </>
  );
}
