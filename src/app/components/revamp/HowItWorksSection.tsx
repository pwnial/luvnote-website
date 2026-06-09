import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Plus, PenLine, Sparkles } from "lucide-react";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const STEPS = [
  { n: "1", icon: Plus, title: "Add the Luv widget", body: "Both partners add it to their home screen." },
  { n: "2", icon: PenLine, title: "Write a message", body: "Type what's on your mind." },
  { n: "3", icon: Sparkles, title: "It appears instantly", body: "Right on their lock screen widget." },
];

export function HowItWorksSection({ id }: { id?: string }) {
  const reduce = useReducedMotion();
  const lineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: lineRef, offset: ["start 80%", "center 55%"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const reveal = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 30, filter: "blur(8px)" },
          whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
          viewport: { once: true, margin: "-15%" },
          transition: { duration: 0.7, ease: EASE, delay },
        };

  return (
    <section id={id} className="relative py-28 md:py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-grid-theme opacity-40 pointer-events-none -z-10" aria-hidden />
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 top-24 w-[640px] h-[420px] blur-[70px] pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_center,rgba(211,134,155,0.10),transparent_70%)]"
      />

      <div className="max-w-[1200px] mx-auto">
        {/* heading */}
        <motion.div {...reveal()} className="text-center max-w-[700px] mx-auto mb-20 md:mb-28">
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-rose-matte block mb-5">
            How it works
          </span>
          <h2 className="text-silver-matte text-4xl md:text-6xl font-bold tracking-tighter leading-[1.05]">
            Their home screen.
            <br />
            <span className="text-rose-matte">Your love notes.</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* LEFT: animated step timeline */}
          <div ref={lineRef} className="relative pl-12 order-2 lg:order-1">
            {/* draw-in connector line */}
            <motion.div
              aria-hidden
              style={reduce ? undefined : { scaleY: lineScale }}
              className="absolute left-[15px] top-3 bottom-3 w-px origin-top bg-gradient-to-b from-[#d3869b]/70 via-[#ebdbb2]/25 to-[#d3869b]/70"
            />
            <div className="flex flex-col gap-12">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div key={s.n} {...reveal(i * 0.12)} className="relative">
                    {/* node */}
                    <div className="absolute -left-12 top-0.5 w-8 h-8 rounded-full widget-depth border border-[#d3869b]/40 flex items-center justify-center shadow-[0_0_18px_rgba(211,134,155,0.25)]">
                      <Icon className="w-4 h-4 text-[#d3869b]" />
                    </div>
                    <div className="font-mono text-[11px] tracking-[0.3em] text-[#928374] mb-2">STEP {s.n}</div>
                    <h3 className="text-3d-matte text-xl md:text-2xl font-bold tracking-tight mb-2">{s.title}</h3>
                    <p className="text-[#a89984] leading-relaxed max-w-[40ch]">{s.body}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: the lock-screen payoff */}
          <motion.div {...reveal(0.1)} className="flex justify-center order-1 lg:order-2">
            <div className="relative cinematic-float">
              <div aria-hidden className="absolute -inset-6 rounded-[3rem] bg-[#d3869b]/15 blur-2xl" />
              <div
                className="relative w-[262px] rounded-[2.6rem] p-2 bg-[#100c0b]"
                style={{
                  boxShadow:
                    "inset 0 0 0 2px #5b504a, inset 0 0 0 7px #000, 0 40px 80px -15px rgba(0,0,0,0.9), 0 15px 25px -5px rgba(0,0,0,0.7)",
                }}
              >
                <div
                  className="relative rounded-[2.1rem] overflow-hidden h-[524px]"
                  style={{
                    background:
                      "radial-gradient(120% 75% at 50% -8%, rgba(211,134,155,0.30) 0%, rgba(60,40,52,0) 55%), linear-gradient(180deg,#1c1512,#120c0b)",
                  }}
                >
                  {/* dynamic island */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[94px] h-[26px] bg-black rounded-full flex items-center justify-end px-3 z-20">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#b8bb26] shadow-[0_0_8px_rgba(184,187,38,0.9)] animate-pulse" />
                  </div>

                  {/* time */}
                  <div className="pt-12 text-center [text-shadow:0_1px_3px_rgba(0,0,0,0.55)]">
                    <div className="text-[13px] text-[#ebdbb2]/70">Monday, June 8</div>
                    <div className="text-[58px] leading-none text-[#fbf1c7]" style={{ fontWeight: 200 }}>
                      9:41
                    </div>
                  </div>

                  {/* the note arrives */}
                  <motion.div
                    {...(reduce
                      ? {}
                      : {
                          initial: { opacity: 0, y: 16, filter: "blur(6px)" },
                          whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
                          viewport: { once: true, margin: "-20%" },
                          transition: { duration: 0.7, ease: EASE, delay: 0.55 },
                        })}
                    className="mt-8 px-7 [text-shadow:0_1px_3px_rgba(0,0,0,0.55)]"
                  >
                    <p className="text-[13px] text-white/95 mb-1 max-w-[170px]">thinking of you right now</p>
                    <div className="flex items-center gap-1.5 max-w-[170px]">
                      <svg className="w-2.5 h-2.5 text-white fill-white" viewBox="0 0 24 24" aria-hidden>
                        <path d="M12 21s-7.5-4.9-10-9.3C.5 8.4 2 4.8 5.5 4.8c2 0 3.3 1.2 4.1 2.4l.4.6.4-.6c.8-1.2 2.1-2.4 4.1-2.4 3.5 0 5 3.6 3.5 6.9C19.5 16.1 12 21 12 21z" />
                      </svg>
                      <span className="text-[10px] font-semibold text-white lowercase">luv</span>
                      <span className="text-[9px] text-white/45 ml-auto">just now</span>
                    </div>
                  </motion.div>

                  {/* home bar */}
                  <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-white/25 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
