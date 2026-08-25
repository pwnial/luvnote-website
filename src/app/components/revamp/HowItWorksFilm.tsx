import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Signal, Wifi, Battery, Send } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const NOTE = "thinking of you right now";

// Deterministic typing rhythm — identical reveal forward & back under scrub.
const COST = (() => {
  const stops: number[] = [];
  let acc = 0;
  for (let i = 0; i < NOTE.length; i++) {
    const c = NOTE[i];
    let w = 1;
    if (c === " ") w += 1.6;
    if (",.!?".includes(c)) w += 3.4;
    if (i === 7) w += 4.2;
    acc += w;
    stops.push(acc);
  }
  return { stops, total: acc };
})();

// ── Rolling lock-screen clock (ported from HeroPhones, reference-sized) ──
const DIGIT_H = 64;
const DIGIT_W = DIGIT_H * 0.55;

function RollingDigit({ value = 0, isColon, reduce }: { value?: number; isColon?: boolean; reduce?: boolean }) {
  if (isColon) {
    return <div className="flex items-center justify-center text-[#fbf1c7] font-extralight" style={{ fontSize: DIGIT_H, lineHeight: 1, width: DIGIT_W * 0.55, height: DIGIT_H }}>:</div>;
  }
  if (reduce) {
    return <div className="flex items-center justify-center text-[#fbf1c7] font-extralight" style={{ fontSize: DIGIT_H, lineHeight: 1, width: DIGIT_W, height: DIGIT_H }}>{value}</div>;
  }
  return (
    <div className="relative overflow-hidden" style={{ height: DIGIT_H, width: DIGIT_W }}>
      <motion.div animate={{ y: -value * DIGIT_H }} transition={{ type: "spring", stiffness: 35, damping: 12, mass: 0.8 }} style={{ willChange: "transform" }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div key={n} className="flex items-center justify-center text-[#fbf1c7] font-extralight" style={{ height: DIGIT_H, fontSize: DIGIT_H, lineHeight: 1, letterSpacing: "-1px" }}>{n}</div>
        ))}
      </motion.div>
    </div>
  );
}

function RollingTime({ time, reduce }: { time: string; reduce?: boolean }) {
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  return (
    <div className="flex items-center justify-center">
      {Math.floor(h / 10) > 0 && <RollingDigit value={Math.floor(h / 10)} reduce={reduce} />}
      <RollingDigit value={h % 10} reduce={reduce} />
      <RollingDigit isColon reduce={reduce} />
      <RollingDigit value={Math.floor(m / 10)} reduce={reduce} />
      <RollingDigit value={m % 10} reduce={reduce} />
    </div>
  );
}

// Exact reference bezel/materials from luv-instagram-hero.html
const STYLES = `
  .hiw-reveal { visibility: hidden; }
  .iphone {
    background: #100c0b;
    box-shadow: inset 0 0 0 2px #5b504a, inset 0 0 0 7px #000, 0 50px 90px -15px rgba(0,0,0,0.9), 0 18px 30px -5px rgba(0,0,0,0.7);
  }
  .hw { position:absolute; left:-3px; width:3px; background:linear-gradient(90deg,#3a322e,#14100e); border-radius:4px 0 0 4px;
        box-shadow:-2px 0 5px rgba(0,0,0,0.8), inset -1px 0 1px rgba(255,255,255,0.12), inset 1px 0 2px rgba(0,0,0,0.8); }
  .hw.r { left:auto; right:-3px; transform:scaleX(-1); }
  .screen { position:absolute; inset:7px; border-radius:2.5rem; overflow:hidden; box-shadow: inset 0 0 15px rgba(0,0,0,1); }
  .wallpaper { position:absolute; inset:0;
    background:
      radial-gradient(120% 75% at 50% -8%, rgba(211,134,155,0.32) 0%, rgba(60,40,52,0) 55%),
      radial-gradient(110% 70% at 50% 118%, rgba(184,187,38,0.10) 0%, transparent 60%),
      linear-gradient(180deg,#1c1512 0%,#120c0b 100%); }
  .compose-bg { position:absolute; inset:0; background:linear-gradient(180deg,#262321 0%,#171413 100%); }
  .glare { position:absolute; inset:0; background:linear-gradient(110deg,rgba(255,255,255,0.07) 0%,rgba(255,255,255,0) 45%); pointer-events:none; z-index:40; }
  .island { position:absolute; top:5px; left:50%; transform:translateX(-50%); width:100px; height:28px; background:#000; border-radius:999px; z-index:50;
    display:flex; align-items:center; justify-content:flex-end; padding:0 12px; box-shadow:inset 0 -1px 2px rgba(255,255,255,0.1); }
  .island .island-dot { width:6px; height:6px; border-radius:50%; background:#b8bb26; box-shadow:0 0 8px rgba(184,187,38,0.9); }
  .floor-shadow { background: radial-gradient(ellipse at center, rgba(0,0,0,0.62) 0%, transparent 70%); filter: blur(24px); }
  .annot-line { background: linear-gradient(to right, #d3869b, transparent); }
  .fit-scale { transform: scale(var(--fit, 1)); transition: transform 0.2s ease; will-change: transform; }
  .scroll-bob { animation: scroll-bob 1.8s ease-in-out infinite; }
  @keyframes scroll-bob { 0%, 100% { transform: translateY(0); opacity: 0.45; } 50% { transform: translateY(5px); opacity: 0.95; } }
`;

export function HowItWorksFilm() {
  const root = useRef<HTMLDivElement>(null);
  const composeText = useRef<HTMLSpanElement>(null);
  const widgetPreview = useRef<HTMLSpanElement>(null);
  const charCount = useRef<HTMLSpanElement>(null);
  const recvNote = useRef<HTMLSpanElement>(null);
  const [reduce] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [time, setTime] = useState("9:41");

  useEffect(() => {
    const proto = { p: 0 };
    const clock = { v: 0 };
    const setType = (p: number) => {
      const target = p * COST.total;
      let n = 0;
      while (n < NOTE.length && COST.stops[n] <= target) n++;
      if (composeText.current) composeText.current.textContent = NOTE.slice(0, n);
      if (widgetPreview.current) widgetPreview.current.textContent = NOTE.slice(0, Math.max(0, n - 1)) || "…";
      if (charCount.current) charCount.current.textContent = `${n}/96`;
    };
    const setFit = () => {
      if (root.current) root.current.style.setProperty("--fit", String(Math.min(1.32, Math.max(0.74, (window.innerHeight - 150) / 580))));
    };
    setFit();
    window.addEventListener("resize", setFit);

    const ctx = gsap.context(() => {
      gsap.set(".hiw-reveal", { visibility: "visible" });

      if (reduce) {
        setType(1);
        if (recvNote.current) recvNote.current.textContent = NOTE;
        gsap.set(".send-pill", { backgroundColor: "#ebdbb2", color: "#282828" });
        gsap.set([".send-glow", ".compose-caret", ".compose-placeholder", ".glow-ring"], { autoAlpha: 0 });
        gsap.set(".sender-phone", { y: -40, autoAlpha: 0.2 });
        gsap.set(".recv-phone", { x: 0, y: 0, scale: 1, rotateX: 0, autoAlpha: 1 });
        gsap.set([".recv-wrap", ".recv-widget", ".recv-note-text", ".recv-stamp", ".heart-pop"], { autoAlpha: 1, scale: 1, y: 0, filter: "blur(0px)" });
        gsap.set([".annot", ".annot-1", ".annot-2", ".annot-3", ".eyebrow-2"], { autoAlpha: 1, x: 0, filter: "blur(0px)" });
        gsap.set([".eyebrow-1", ".finale"], { autoAlpha: 0 });
        gsap.set(".scroll-hint", { autoAlpha: 0 });
        return;
      }

      gsap.set(".recv-wrap", { autoAlpha: 1 });
      gsap.set(".recv-phone", { y: 150, autoAlpha: 0, scale: 0.96 });
      gsap.set([".annot-1", ".annot-2", ".annot-3", ".eyebrow-2", ".finale", ".send-glow", ".glow-ring", ".heart-pop", ".recv-stamp"], { autoAlpha: 0 });
      gsap.set(".send-pill-inner", { scale: 1 });
      gsap.set(".send-pill", { backgroundColor: "rgba(235,219,178,0.18)", color: "rgba(40,40,40,0.45)" });
      gsap.set(".recv-widget", { autoAlpha: 0, y: 10, filter: "blur(6px)" });
      gsap.set(".recv-note-text", { autoAlpha: 0.4, y: 3 });
      gsap.set(".heart-pop", { scale: 0, rotate: -20, autoAlpha: 0 });
      gsap.set(".compose-caret", { autoAlpha: 1 });
      setType(0);

      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "+=6500", pin: true, scrub: 1, anticipatePin: 1 } });

      // ===== ACT 1 — WRITE + SEND =====
      tl.to(".scroll-hint", { autoAlpha: 0, duration: 0.3 }, 0.1)
        .to(".compose-placeholder", { autoAlpha: 0, duration: 0.25 }, 0.3)
        .fromTo(proto, { p: 0 }, { p: 1, duration: 2.4, ease: "none", immediateRender: false, onUpdate: () => setType(proto.p) }, 0.35)
        .to(".compose-caret", { autoAlpha: 0, duration: 0.18 }, 2.85)
        .to(".send-pill", { backgroundColor: "#ebdbb2", color: "#282828", duration: 0.4, ease: "power2.out" }, 2.85)
        .fromTo(".send-glow", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, immediateRender: false }, 2.95)
        .fromTo(".send-glow", { scale: 1 }, { scale: 1.04, duration: 0.5, immediateRender: false }, 2.95)
        .to(".send-pill-inner", { scale: 0.94, duration: 0.12, ease: "power2.in" }, 3.15)
        .to(".send-pill-inner", { scale: 1, duration: 0.16, ease: "back.out(3)" }, 3.27)
        .to(".send-glow", { autoAlpha: 0, duration: 0.2 }, 3.4);

      // ===== HANDOFF — keep the press, then a clean cross-rise to the new phone =====
      tl.to(".eyebrow-1", { autoAlpha: 0, duration: 0.4 }, 3.55)
        .to(".sender-phone", { y: -110, scale: 0.95, autoAlpha: 0, duration: 0.85, ease: "power2.inOut" }, 3.6)
        .to(".recv-phone", { y: 0, autoAlpha: 1, scale: 1, duration: 1.05, ease: "power3.out" }, 3.8);

      // ===== ACT 2 — LANDING cascade (borderless widget) =====
      tl.fromTo(".eyebrow-2", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, immediateRender: false }, 4.6)
        .add(() => { if (recvNote.current) recvNote.current.textContent = NOTE; }, 4.85)
        .fromTo(".recv-phone .island-dot", { scale: 1 }, { scale: 1.6, duration: 0.3, ease: "power2.out", immediateRender: false }, 4.86)
        .fromTo(".recv-widget", { autoAlpha: 0, y: 10, filter: "blur(6px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power3.out", immediateRender: false }, 4.9)
        .to(clock, { v: 1, duration: 0.01, ease: "none", immediateRender: false, onUpdate: () => setTime(clock.v > 0.5 ? "9:42" : "9:41") }, 4.92)
        .fromTo(".recv-note-text", { autoAlpha: 0.4, y: 3 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out", immediateRender: false }, 4.95)
        .fromTo(".glow-ring", { autoAlpha: 0.7, scale: 0.8 }, { autoAlpha: 0, scale: 1.5, duration: 0.95, ease: "power2.out", immediateRender: false }, 4.98)
        .fromTo(".heart-pop", { autoAlpha: 0, scale: 0, rotate: -20 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2.6)", immediateRender: false }, 5.08)
        .to(".recv-phone .island-dot", { scale: 1, duration: 0.5, ease: "power2.inOut" }, 5.16)
        .fromTo(".recv-stamp", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, immediateRender: false }, 5.25);

      // ===== SLIDE-LEFT + callouts =====
      tl.to(".recv-phone", { x: -300, scale: 0.92, duration: 1.15, ease: "power3.inOut" }, 5.85)
        .to(".eyebrow-2", { autoAlpha: 0, y: -8, duration: 0.4 }, 5.85);
      [".annot-1", ".annot-2", ".annot-3"].forEach((a, i) => {
        tl.fromTo(a, { autoAlpha: 0, x: 40, filter: "blur(8px)" }, { autoAlpha: 1, x: 0, filter: "blur(0px)", duration: 0.7, ease: "power3.out", immediateRender: false }, 6.5 + i * 0.85);
      });

      // ===== FINALE =====
      tl.to([".recv-phone", ".annot"], { autoAlpha: 0, duration: 0.6 }, 9.4)
        .set(".finale", { autoAlpha: 1 }, 9.4)
        .fromTo(".finale-inner", { autoAlpha: 0, scale: 0.92, filter: "blur(20px)" }, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1, ease: "expo.out", immediateRender: false }, 9.5);
    }, root);

    return () => { window.removeEventListener("resize", setFit); ctx.revert(); };
  }, [reduce]);

  const HW = () => (
    <>
      <span className="hw" style={{ top: 120, height: 25 }} />
      <span className="hw" style={{ top: 160, height: 45 }} />
      <span className="hw" style={{ top: 220, height: 45 }} />
      <span className="hw r" style={{ top: 170, height: 70 }} />
    </>
  );
  const StatusBar = () => (
    <div className="absolute top-0 right-0 px-5 pt-2.5 flex items-center gap-1 text-[#ebdbb2]/65 z-30">
      <Signal className="w-2.5 h-2.5" /><Wifi className="w-2.5 h-2.5" /><Battery className="w-3.5 h-2.5" />
    </div>
  );

  return (
    <div ref={root} className="relative w-screen h-screen overflow-hidden bg-[#1f1b18] text-[#fbf1c7]" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="film-grain absolute inset-0 z-50 pointer-events-none" aria-hidden />
      <div className="scroll-hint fixed bottom-7 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2 pointer-events-none">
        <span className="font-mono text-[10px] tracking-[0.3em] text-[#ebdbb2]/45 uppercase">Scroll</span>
        <svg className="scroll-bob w-4 h-4 text-[#ebdbb2]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" /></svg>
      </div>

      {/* eyebrows (compact, single line) */}
      <div className="eyebrow-1 absolute top-[5%] left-1/2 -translate-x-1/2 flex items-baseline gap-3 z-30">
        <span className="font-mono text-[10px] tracking-[0.32em] text-rose-matte uppercase">Step 01</span>
        <span className="text-silver-matte text-xl md:text-2xl font-bold tracking-tight">Write it</span>
      </div>
      <div className="eyebrow-2 absolute top-[5%] left-1/2 -translate-x-1/2 flex items-baseline gap-3 z-30">
        <span className="font-mono text-[10px] tracking-[0.32em] text-rose-matte uppercase">Step 02</span>
        <span className="text-silver-matte text-xl md:text-2xl font-bold tracking-tight">It appears</span>
      </div>

      {/* ================= SENDER (compose) ================= */}
      <div className="sender-wrap absolute inset-0 flex items-center justify-center z-10">
        <div className="fit-scale">
          <div className="sender-phone hiw-reveal relative iphone rounded-[3rem]" style={{ width: 280, height: 580 }}>
            <HW />
            <div className="floor-shadow absolute left-1/2 -translate-x-1/2 -bottom-8 w-[82%] h-14 pointer-events-none" aria-hidden />
            <div className="screen">
              <div className="compose-bg" aria-hidden />
              <div className="glare" aria-hidden />
              <div className="island"><span className="island-dot" /></div>
              <StatusBar />
              <div className="relative z-10 w-full h-full flex flex-col px-4 pt-12 pb-5">
                {/* partner header */}
                <div className="flex flex-col items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-[#ebdbb2]/15 flex items-center justify-center mb-2 shadow-lg shadow-black/40" style={{ background: "linear-gradient(145deg,#d3869b,#7e5563)" }}>
                    {/* TODO: swap for Kate's real pfp once dir provided: <img src="/kate.jpg" className="w-full h-full object-cover" /> */}
                    <span className="text-[18px] font-semibold text-[#fbf1c7]">K</span>
                  </div>
                  <div className="text-[9px] text-[#ebdbb2]/45 mb-0.5 tracking-wide uppercase">Sending to</div>
                  <div className="text-[13px] font-semibold text-[#ebdbb2]">Kate</div>
                </div>
                {/* live preview (borderless) */}
                <div className="mb-3 px-1">
                  <p className="text-[11px] text-[#ebdbb2]/55 leading-relaxed min-h-[34px]"><span ref={widgetPreview}>…</span></p>
                  <div className="flex items-center gap-1 mt-1"><Heart className="w-2 h-2 text-[#ebdbb2]/35 fill-[#ebdbb2]/35" /><span className="text-[8px] font-semibold text-[#ebdbb2]/35">luv</span></div>
                </div>
                {/* composer */}
                <div className="flex-1 flex flex-col justify-end relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[8px] font-medium text-[#ebdbb2]/40 tracking-wide uppercase">Message</span>
                    <span ref={charCount} className="text-[8px] text-[#ebdbb2]/35 tabular-nums">0/96</span>
                  </div>
                  <div className="compose-box relative bg-[#ebdbb2]/[0.04] border border-[#ebdbb2]/15 rounded-xl p-3 mb-2.5 min-h-[64px]">
                    <p className="text-[11px] text-[#ebdbb2] leading-relaxed"><span ref={composeText} /><span className="compose-caret inline-block w-[1.5px] h-[12px] bg-[#ebdbb2] align-middle ml-[1px]" /></p>
                    <p className="compose-placeholder absolute top-3 left-3 text-[11px] text-[#ebdbb2]/30 leading-relaxed pointer-events-none">Share something sweet…</p>
                  </div>
                  <div className="relative">
                    <div className="send-glow absolute inset-0 rounded-xl" style={{ boxShadow: "0 0 0 1px rgba(235,219,178,0.45), 0 0 24px 4px rgba(235,219,178,0.25)" }} aria-hidden />
                    <div className="send-pill relative w-full rounded-xl py-2.5 flex items-center justify-center text-[11px] font-semibold" style={{ backgroundColor: "rgba(235,219,178,0.18)", color: "rgba(40,40,40,0.45)" }}>
                      <div className="send-pill-inner flex items-center justify-center gap-1.5"><Send className="w-3 h-3" style={{ transform: "rotate(-30deg)" }} />Send Message</div>
                    </div>
                  </div>
                </div>
                <div className="pt-2 flex justify-center"><div className="w-24 h-1 bg-[#ebdbb2]/25 rounded-full" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RECEIVER (lock screen — exact reference) ================= */}
      <div className="recv-wrap absolute inset-0 flex items-center justify-center z-10">
        <div className="fit-scale">
          <div className="recv-phone hiw-reveal relative iphone rounded-[3rem]" style={{ width: 280, height: 580 }}>
            <HW />
            <div className="floor-shadow absolute left-1/2 -translate-x-1/2 -bottom-8 w-[82%] h-14 pointer-events-none" aria-hidden />
            <div className="screen">
              <div className="wallpaper" aria-hidden />
              <div className="glare" aria-hidden />
              <div className="island"><span className="island-dot" /></div>
              <StatusBar />
              <div className="relative z-10 w-full h-full flex flex-col" style={{ padding: "48px 16px 28px" }}>
                <div className="text-center mt-1 mb-6">
                  <div className="text-[13px] text-[#ebdbb2]/70 font-medium" style={{ letterSpacing: "0.3px" }}>Monday, June 9</div>
                  <div className="flex items-center justify-center mt-0.5"><RollingTime time={time} reduce={reduce} /></div>
                </div>
                {/* borderless lock-screen widget */}
                <div className="recv-widget self-start mb-3 max-w-[170px] text-left relative" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.55)" }}>
                  <div className="glow-ring absolute -inset-3 rounded-2xl pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(211,134,155,0.4), transparent 70%)" }} aria-hidden />
                  <p className="recv-note-text relative text-[11px] leading-[1.35] text-white/95 mb-1"><span ref={recvNote} /></p>
                  <div className="relative flex items-center gap-1">
                    <span className="heart-pop inline-flex"><Heart className="w-2.5 h-2.5 text-white fill-white" /></span>
                    <span className="text-[10px] font-semibold text-white">luv</span>
                    <span className="recv-stamp text-[9px] text-white/45 ml-auto">just now</span>
                  </div>
                </div>
                <div className="mt-auto flex justify-center"><span className="w-[110px] h-1 rounded-full bg-white/25" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= callouts ================= */}
      <div className="annot absolute inset-y-0 right-0 w-1/2 hidden lg:flex flex-col justify-center gap-12 pr-[8%] pl-8 z-20">
        <div className="annot-1">
          <div className="annot-line h-px w-12 mb-4" />
          <h3 className="text-3d-matte text-2xl md:text-3xl font-bold tracking-tight mb-2">Designed for a glance.</h3>
          <p className="text-[#a89984] leading-relaxed max-w-[40ch]">When iOS refreshes the widget, your latest note can be waiting on their lock screen without a notification banner to clear.</p>
        </div>
        <div className="annot-2">
          <div className="annot-line h-px w-12 mb-4" />
          <h3 className="text-3d-matte text-2xl md:text-3xl font-bold tracking-tight mb-2">Made for one connection.</h3>
          <p className="text-[#a89984] leading-relaxed max-w-[40ch]">One active partner at a time. Notes are stored by Luv so the app can deliver them to your connected person.</p>
        </div>
        <div className="annot-3">
          <div className="annot-line h-px w-12 mb-4" />
          <h3 className="text-3d-matte text-2xl md:text-3xl font-bold tracking-tight mb-2">Sent in a tap.</h3>
          <p className="text-[#a89984] leading-relaxed max-w-[40ch]">Luv stores the note when you send it. Widget timing depends on connectivity, Apple&apos;s background delivery, and iOS refresh scheduling.</p>
        </div>
      </div>

      {/* ================= finale ================= */}
      <div className="finale absolute inset-0 z-30 flex items-center justify-center">
        <div className="finale-inner text-center px-6">
          <div className="font-mono text-[11px] tracking-[0.32em] text-rose-matte uppercase mb-5">the whole point</div>
          <h2 className="text-silver-matte text-4xl md:text-6xl font-bold tracking-tighter leading-[1.05] mb-5">Be on their mind.<br />Be on their <span className="text-rose-matte">lock screen.</span></h2>
          <p className="text-[#a89984] text-lg mb-9">One tap from you. All day on them.</p>
          <a href="https://apps.apple.com/app/id6763015481" target="_blank" rel="noopener noreferrer" className="btn-modern-light inline-flex items-center gap-3 px-8 py-4 rounded-[1.25rem]">
            <svg viewBox="0 0 384 512" className="w-7 h-7" fill="currentColor" aria-hidden><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" /></svg>
            <span className="flex flex-col items-start leading-none"><span className="text-[10px] font-mono uppercase tracking-wider opacity-70">Download on the</span><span className="text-[17px] font-semibold -mt-0.5">App Store</span></span>
          </a>
          <p className="mt-12 font-mono text-[11px] tracking-[0.15em] text-[#928374] uppercase">built with <span className="text-[#d3869b]">love</span> by one dev in New York</p>
        </div>
      </div>
    </div>
  );
}
