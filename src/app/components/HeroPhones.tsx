import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Battery, Signal, Wifi, Send } from "lucide-react";

// ──────────────────────────────────────────────────────────────────────────
// Rolling time digits
// ──────────────────────────────────────────────────────────────────────────

const DIGIT_H = 52;
const DIGIT_W = DIGIT_H * 0.55;

function RollingDigit({ value = 0, isColon }: { value?: number; isColon?: boolean }) {
  if (isColon) {
    return (
      <div
        className="flex items-center justify-center text-[#ebdbb2] font-extralight"
        style={{ fontSize: DIGIT_H, lineHeight: 1, width: DIGIT_W * 0.55, height: DIGIT_H }}
      >
        :
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden" style={{ height: DIGIT_H, width: DIGIT_W }}>
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none" style={{ height: 10, background: "linear-gradient(to bottom, #1d2021, transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none" style={{ height: 10, background: "linear-gradient(to top, #1d2021, transparent)" }} />
      <motion.div
        animate={{ y: -value * DIGIT_H }}
        transition={{ type: "spring", stiffness: 35, damping: 12, mass: 0.8 }}
        style={{ willChange: "transform" }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div
            key={n}
            className="flex items-center justify-center text-[#ebdbb2] font-extralight"
            style={{ height: DIGIT_H, fontSize: DIGIT_H, lineHeight: 1 }}
          >
            {n}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function RollingTime({ time }: { time: string }) {
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);

  const hTens = Math.floor(h / 10);
  const hOnes = h % 10;
  const mTens = Math.floor(m / 10);
  const mOnes = m % 10;

  const showHourTens = hTens > 0;

  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={{
          width: showHourTens ? DIGIT_W : 0,
          opacity: showHourTens ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 40, damping: 14, mass: 0.6 }}
        className="overflow-hidden"
        style={{ height: DIGIT_H }}
      >
        <RollingDigit value={hTens} />
      </motion.div>
      <RollingDigit value={hOnes} />
      <RollingDigit isColon />
      <RollingDigit value={mTens} />
      <RollingDigit value={mOnes} />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Content
// ──────────────────────────────────────────────────────────────────────────

const messages = [
  "thinking of you right now",
  "miss your face",
  "you make everything better",
  "can't wait to see you",
  "you're my favorite notification",
  "wish you were here",
];

const TIMES = [
  "9:41", "9:52", "10:03", "10:17", "10:28", "10:44",
  "10:56", "11:08", "11:19", "11:33", "11:47", "11:58",
  "12:09", "12:21", "12:34", "12:48", "12:59",
];
let timeIndex = 0;
function nextTime(): string {
  timeIndex = (timeIndex + 1) % TIMES.length;
  return TIMES[timeIndex];
}

// ──────────────────────────────────────────────────────────────────────────
// Cycle phases
// ──────────────────────────────────────────────────────────────────────────
//
// idle    — composer empty, cursor breathing softly
// typing  — characters appearing with variable rhythm
// ready   — typing done, send button glowing in anticipation
// sending — button compresses, message lifting off
// transit — message in flight between phones (~500ms beam)
// landed  — message arrived on receiver (widget scales in, glow ring, heart pop)
// dwell   — viewer reads the lock-screen (post-land, before reset)

type Phase = "idle" | "typing" | "ready" | "sending" | "transit" | "landed" | "dwell";

// Total cycle window ≈ 12s — within that, typing length varies by message.
const CYCLE_MS = 12000;
const TYPE_START_DELAY = 700;        // ms from cycle start to first keystroke
const READY_HOLD = 500;              // dwell on "ready" before pressing send
const SEND_COMPRESS = 220;           // button press duration
const TRANSIT_DURATION = 550;        // connection beam window
const LANDED_HOLD = 1000;            // glow ring + receiver pulse
const DWELL_DURATION = 2400;         // viewer reads the result
const FADE_OUT_DURATION = 400;       // composer text fades to idle

// Per-character timing for the variable-rhythm typer.
const CHAR_BASE_MS = 55;
const CHAR_JITTER_MS = 90;
const SPACE_EXTRA_MS = 90;
const PUNCT_EXTRA_MS = 240;
const THINKING_PAUSE_MS = 420;
const THINKING_PROBABILITY = 0.45;   // chance of one pause per message

// ──────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────

export function HeroPhones() {
  const [widgetMessage, setWidgetMessage] = useState(messages[0]);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [currentTime, setCurrentTime] = useState("9:41");

  // Mouse parallax — normalized -1..1 around container center
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const indexRef = useRef(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // ── Variable-rhythm typing ──────────────────────────────────────────────
  const typeMessage = useCallback(
    (msg: string, onDone: () => void) => {
      // Pick one moment in the message for a "thinking pause"
      const thinkingIndex =
        Math.random() < THINKING_PROBABILITY
          ? Math.floor(msg.length * (0.4 + Math.random() * 0.3))
          : -1;

      const step = (i: number) => {
        if (i >= msg.length) {
          onDone();
          return;
        }
        setTyped(msg.slice(0, i + 1));

        let delay = CHAR_BASE_MS + Math.random() * CHAR_JITTER_MS;
        const justTyped = msg[i];
        if (justTyped === " ") delay += SPACE_EXTRA_MS;
        if (justTyped === "," || justTyped === ".") delay += PUNCT_EXTRA_MS;
        if (i === thinkingIndex) delay += THINKING_PAUSE_MS;

        const t = setTimeout(() => step(i + 1), delay);
        timersRef.current.push(t);
      };

      const t0 = setTimeout(() => step(0), 0);
      timersRef.current.push(t0);
    },
    []
  );

  // ── Cycle orchestration ────────────────────────────────────────────────
  const runCycle = useCallback(() => {
    const nextIdx = (indexRef.current + 1) % messages.length;
    const nextMsg = messages[nextIdx];

    setTyped("");
    setPhase("idle");

    // Schedule each beat. All timers tracked for cleanup.
    const schedule = (delay: number, fn: () => void) => {
      const t = setTimeout(fn, delay);
      timersRef.current.push(t);
    };

    let cursor = TYPE_START_DELAY;

    schedule(cursor, () => {
      setPhase("typing");
      typeMessage(nextMsg, () => {
        setPhase("ready");
        schedule(READY_HOLD, () => {
          setPhase("sending");
          // Clear composer the moment send fires — message "leaves" instantly,
          // even while the send button is still compressing.
          setTyped("");
          schedule(SEND_COMPRESS, () => {
            setPhase("transit");
            schedule(TRANSIT_DURATION, () => {
              // Message lands on receiver
              setPhase("landed");
              setWidgetMessage(nextMsg);
              setCurrentTime(nextTime());
              indexRef.current = nextIdx;
              schedule(LANDED_HOLD, () => {
                setPhase("dwell");
                schedule(DWELL_DURATION, () => {
                  // Fade composer back to idle for next cycle
                  setTyped("");
                  setPhase("idle");
                });
              });
            });
          });
        });
      });
    });
  }, [typeMessage]);

  useEffect(() => {
    runCycle();
    const interval = setInterval(() => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      runCycle();
    }, CYCLE_MS);
    return () => {
      clearInterval(interval);
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [runCycle]);

  // ── Mouse parallax ─────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setParallax({
        x: Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2))),
        y: Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2))),
      });
    };
    const onLeave = () => setParallax({ x: 0, y: 0 });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // ── Derived flags ──────────────────────────────────────────────────────
  const isSendActive =
    phase === "ready" ||
    phase === "sending" ||
    phase === "transit" ||
    phase === "landed" ||
    phase === "dwell";
  const isSendPressed = phase === "sending";
  const isSendGlowing = phase === "ready";
  const isLanded = phase === "landed";
  const showCursor = phase === "typing";

  // Phone tilt — base inward tilt + mouse parallax tilt
  const senderTilt = `perspective(1200px) rotateY(${8 + parallax.x * 1.4}deg) rotateX(${-parallax.y * 1.4}deg)`;
  const receiverTilt = `perspective(1200px) rotateY(${-8 + parallax.x * 1.4}deg) rotateX(${-parallax.y * 1.4}deg) scale(${isLanded ? 1.005 : 1})`;

  // Phone box shadow — stacked for natural light falloff + grounded floor shadow
  const phoneShadow =
    "0 2px 4px -1px rgba(0,0,0,0.4)," +
    "0 8px 16px -4px rgba(0,0,0,0.5)," +
    "0 30px 60px -15px rgba(0,0,0,0.7)," +
    "inset 0 1px 0 0 rgba(255,255,255,0.04)";

  return (
    <div ref={containerRef} className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-6 max-w-[600px] mx-auto">
        {/* ============ SENDER PHONE (luv app) ============ */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="relative"
        >
          {/* Floor shadow */}
          <div
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2 bottom-[-30px] w-[70%] h-[40px] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, transparent 70%)",
              filter: "blur(12px)",
            }}
          />

          {/* Tilt + parallax wrapper */}
          <div
            style={{
              transform: senderTilt,
              transition: "transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)",
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-[2.5rem] p-2 relative"
                style={{ boxShadow: phoneShadow }}
              >
                {/* Dynamic island */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1a1a1a] rounded-b-2xl z-10">
                  <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-[#0a0a0a] rounded-full" />
                </div>

                <div className="bg-[#282828] rounded-[2.2rem] overflow-hidden relative">
                  <div className="px-6 pt-4 pb-1 flex items-center justify-end text-[#ebdbb2]/60 text-[10px] relative z-10">
                    <div className="flex items-center gap-1">
                      <Signal className="w-2.5 h-2.5" />
                      <Wifi className="w-2.5 h-2.5" />
                      <Battery className="w-3.5 h-2.5" />
                    </div>
                  </div>

                  <div className="px-4 py-3 min-h-[420px] flex flex-col relative z-10">
                    {/* Partner header */}
                    <div className="flex flex-col items-center mb-5">
                      <div className="w-14 h-14 rounded-xl bg-[#ebdbb2]/8 border border-[#ebdbb2]/15 flex items-center justify-center mb-2.5">
                        <Heart className="w-6 h-6 text-[#ebdbb2] fill-[#ebdbb2]" />
                      </div>
                      <div className="text-[10px] text-[#ebdbb2]/45 mb-0.5 tracking-wide uppercase">Sending to</div>
                      <div className="text-sm font-semibold text-[#ebdbb2]">Your Partner</div>
                    </div>

                    {/* Live widget preview (mirrors what's being typed) */}
                    <div className="mb-4 px-2.5 py-2.5">
                      <p className="text-[11px] text-[#ebdbb2]/55 leading-relaxed min-h-[36px]">
                        {typed || widgetMessage}
                      </p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Heart className="w-2 h-2 text-[#ebdbb2]/35 fill-[#ebdbb2]/35" />
                        <span className="text-[8px] font-semibold text-[#ebdbb2]/35">Luv</span>
                      </div>
                    </div>

                    {/* Composer */}
                    <div className="flex-1 flex flex-col justify-end">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-medium text-[#ebdbb2]/40 tracking-wide uppercase">Message</span>
                        <motion.span
                          animate={{ opacity: phase === "typing" || phase === "ready" ? 0.6 : 0.3 }}
                          className="text-[8px] text-[#ebdbb2]/35 tabular-nums"
                        >
                          {typed.length}/96
                        </motion.span>
                      </div>

                      <div className="bg-[#ebdbb2]/[0.04] border border-[#ebdbb2]/15 rounded-xl p-3 mb-2.5 min-h-[70px]">
                        {typed ? (
                          <p className="text-[11px] text-[#ebdbb2] leading-relaxed">
                            {typed}
                            {showCursor && (
                              <motion.span
                                animate={{ opacity: [1, 0.35, 1] }}
                                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                                className="inline-block w-[1.5px] h-[12px] bg-[#ebdbb2] ml-[1.5px] align-middle"
                              />
                            )}
                          </p>
                        ) : (
                          <p className="text-[11px] text-[#ebdbb2]/30 leading-relaxed">
                            Share something sweet…
                            <motion.span
                              animate={{ opacity: [0.5, 0.15, 0.5] }}
                              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                              className="inline-block w-[1.5px] h-[12px] bg-[#ebdbb2]/40 ml-[1.5px] align-middle"
                            />
                          </p>
                        )}
                      </div>

                      <motion.div
                        animate={
                          isSendPressed
                            ? { scale: 0.94, transition: { duration: 0.18, ease: [0.25, 0.1, 0.25, 1.0] } }
                            : { scale: 1, transition: { duration: 0.25 } }
                        }
                        style={{ willChange: "transform" }}
                      >
                        <motion.div
                          animate={{
                            backgroundColor: isSendActive ? "#ebdbb2" : "rgba(235,219,178,0.18)",
                            boxShadow: isSendGlowing
                              ? "0 0 0 1px rgba(235,219,178,0.45), 0 0 24px 4px rgba(235,219,178,0.25)"
                              : "0 0 0 0 rgba(235,219,178,0)",
                            color: isSendActive ? "#282828" : "rgba(40,40,40,0.45)",
                          }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          className="w-full rounded-xl py-2.5 flex items-center justify-center gap-1.5 text-[11px] font-semibold"
                        >
                          <Send className="w-3 h-3" style={{ transform: "rotate(-30deg)" }} />
                          Send Message
                        </motion.div>
                      </motion.div>
                    </div>

                    <div className="pt-2.5 flex justify-center">
                      <div className="w-24 h-1 bg-[#ebdbb2]/20 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="text-center mt-3 text-xs text-[#928374]">You</div>
        </motion.div>

        {/* ============ RECEIVER PHONE (lock screen) ============ */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="relative"
        >
          {/* Floor shadow */}
          <div
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2 bottom-[-30px] w-[70%] h-[40px] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, transparent 70%)",
              filter: "blur(12px)",
            }}
          />

          {/* Tilt + parallax wrapper */}
          <div
            style={{
              transform: receiverTilt,
              transition: "transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)",
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-[2.5rem] p-2 relative"
                style={{ boxShadow: phoneShadow }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1a1a1a] rounded-b-2xl z-10">
                  <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-[#0a0a0a] rounded-full" />
                </div>

                <div className="bg-[#1d2021] rounded-[2.2rem] overflow-hidden relative">
                  <div className="px-6 pt-4 pb-1 flex items-center justify-end text-[#ebdbb2]/60 text-[10px] relative z-10">
                    <div className="flex items-center gap-1">
                      <Signal className="w-2.5 h-2.5" />
                      <Wifi className="w-2.5 h-2.5" />
                      <Battery className="w-3.5 h-2.5" />
                    </div>
                  </div>

                  <div className="px-4 py-4 min-h-[420px] flex flex-col relative z-10">
                    {/* Rolling time */}
                    <div className="text-center mb-1.5">
                      <div className="flex items-center justify-center">
                        <RollingTime time={currentTime} />
                      </div>
                      <div className="text-[13px] text-[#d5c4a1] font-medium mt-0.5">Monday, February 19</div>
                    </div>

                    {/* Widget with land animation + glow ring */}
                    <div className="mt-6 mb-auto relative">
                      <AnimatePresence>
                        {isLanded && (
                          <motion.div
                            key="glowring"
                            initial={{ scale: 0.85, opacity: 0.7 }}
                            animate={{ scale: 1.35, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
                            className="absolute inset-0 rounded-2xl pointer-events-none"
                            style={{
                              boxShadow:
                                "0 0 0 2px rgba(235,219,178,0.4), 0 0 36px 6px rgba(235,219,178,0.25)",
                            }}
                          />
                        )}
                      </AnimatePresence>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={widgetMessage}
                          initial={{ opacity: 0, scale: 0.92, y: 6 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98, y: -4 }}
                          transition={{
                            type: "spring",
                            stiffness: 240,
                            damping: 22,
                            mass: 0.7,
                          }}
                          className="bg-[#3c3836]/70 backdrop-blur-2xl border border-[#ebdbb2]/8 rounded-2xl px-3.5 py-3 relative"
                          style={{ willChange: "transform, opacity" }}
                        >
                          {/* Heart pop on land */}
                          <AnimatePresence>
                            {isLanded && (
                              <motion.div
                                key="heart"
                                initial={{ scale: 0, opacity: 0, rotate: -20 }}
                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                exit={{ scale: 0, opacity: 0, rotate: 20 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 360,
                                  damping: 18,
                                  mass: 0.6,
                                }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-[#ebdbb2] rounded-full flex items-center justify-center shadow-lg"
                                style={{
                                  boxShadow:
                                    "0 4px 12px rgba(0,0,0,0.35), 0 0 16px 2px rgba(235,219,178,0.35)",
                                }}
                              >
                                <Heart className="w-3 h-3 text-[#282828] fill-[#282828]" />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <p className="text-[11px] text-[#ebdbb2]/90 leading-relaxed min-h-[36px]">
                            {widgetMessage}
                          </p>
                          <div className="flex items-center gap-1 mt-2">
                            <Heart className="w-2 h-2 text-[#ebdbb2]/60 fill-[#ebdbb2]/60" />
                            <span className="text-[8px] font-semibold text-[#ebdbb2]/60">Luv</span>
                            <span className="text-[8px] text-[#ebdbb2]/30 ml-auto">just now</span>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Lock screen bottom buttons */}
                    <div className="flex items-center justify-between px-4 pt-4">
                      <div className="w-10 h-10 bg-[#ebdbb2]/8 backdrop-blur-lg rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#ebdbb2]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6l1 7H8L9 3zM12 10v8M10 18h4" />
                        </svg>
                      </div>
                      <div className="w-10 h-10 bg-[#ebdbb2]/8 backdrop-blur-lg rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#ebdbb2]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <circle cx="12" cy="13" r="3" />
                        </svg>
                      </div>
                    </div>

                    <div className="pt-2.5 flex justify-center">
                      <div className="w-24 h-1 bg-[#ebdbb2]/20 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="text-center mt-3 text-xs text-[#928374]">Your Partner</div>
        </motion.div>
      </div>
    </div>
  );
}
