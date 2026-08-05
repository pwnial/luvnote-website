import { motion, useReducedMotion } from "motion/react";
import { Zap, Lock, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const EASE = [0.25, 0.1, 0.25, 1] as const;

type Pillar = { index: string; icon: LucideIcon; filled?: boolean; title: string; body: string };

const PILLARS: Pillar[] = [
  {
    index: "01",
    icon: Zap,
    title: "Instant updates",
    body: "Your words appear on their lock screen the moment you hit send. No notification banners. No inbox to check. Just there — waiting for them.",
  },
  {
    index: "02",
    icon: Lock,
    title: "Private by design",
    body: "Notes are encrypted in transit and at rest by our managed infrastructure. In the app, access is limited to you and your connected partner; Luv processes notes to deliver them.",
  },
  {
    index: "03",
    icon: Heart,
    filled: true,
    title: "Built for two",
    body: "One connection. One widget. No group chats, no social feed. Just a quiet space for you and your person.",
  },
];

export function FeaturesSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative py-28 md:py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-grid-theme opacity-40 pointer-events-none -z-10" aria-hidden />
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 top-12 w-[560px] h-[340px] blur-[60px] pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_center,rgba(211,134,155,0.10),transparent_70%)]"
      />

      <div className="max-w-[1200px] mx-auto">
        {/* header */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center max-w-[640px] mx-auto mb-16 md:mb-20"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-rose-matte block mb-5">Why luv</span>
          <h2 className="text-silver-matte text-4xl md:text-6xl font-bold tracking-tighter leading-[1.05]">
            Why couples <span className="text-rose-matte">love</span> it
          </h2>
        </motion.div>

        {/* 3-up premium cards */}
        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.index}
                initial={reduce ? false : { opacity: 0, y: 44, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.12 }}
                whileHover={reduce ? undefined : { y: -6 }}
                className="group premium-depth-card rounded-3xl p-7 md:p-8 flex flex-col"
              >
                <div className="flex items-center justify-between mb-8">
                  <motion.div
                    whileHover={reduce ? undefined : { scale: 1.08, rotate: p.filled ? 0 : 4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="w-14 h-14 rounded-2xl widget-depth border border-[#d3869b]/20 flex items-center justify-center transition-[box-shadow,border-color] duration-300 group-hover:border-[#d3869b]/45 group-hover:shadow-[0_0_26px_rgba(211,134,155,0.22)]"
                  >
                    <Icon className="w-6 h-6 text-[#d3869b]" {...(p.filled ? { fill: "#d3869b" } : {})} />
                  </motion.div>
                  <span className="font-mono text-[12px] tracking-[0.3em] text-[#928374]">{p.index}</span>
                </div>
                <h3 className="text-[#fbf1c7] text-2xl font-bold tracking-tight mb-3">{p.title}</h3>
                <p className="text-[#ebdbb2]/70 leading-relaxed text-[15px]">{p.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
