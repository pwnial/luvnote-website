import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Battery, Signal, Wifi, Send } from "lucide-react";
import Counter from "./Counter";

// Slot-machine rolling digit
const DIGIT_H = 52;
const DIGIT_W = DIGIT_H * 0.55;

function RollingDigit({ value, isColon }: { value: number; isColon?: boolean }) {
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

// Always renders 5 slots: [tens hour] [ones hour] [:] [tens min] [ones min]
// When hour < 10, the tens-hour slot smoothly collapses its width to 0
function RollingTime({ time }: { time: string }) {
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);

  const hTens = Math.floor(h / 10); // 0 or 1
  const hOnes = h % 10;
  const mTens = Math.floor(m / 10);
  const mOnes = m % 10;

  const showHourTens = hTens > 0;

  return (
    <div className="flex items-center justify-center">
      {/* Hour tens — animates width so layout shifts smoothly */}
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

const messages = [
  "thinking of you right now",
  "miss your face",
  "you make everything better",
  "can't wait to see you",
  "you're my favorite notification",
  "wish you were here",
];

// Realistic 12-hour clock times
const TIMES = [
  "9:41", "9:52", "10:03", "10:17", "10:28", "10:44",
  "10:56", "11:08", "11:19", "11:33", "11:47", "11:58",
  "12:09", "12:21", "12:34", "12:48", "12:59",
];
let timeIndex = 0;
function generateRandomTime(): string {
  timeIndex = (timeIndex + 1) % TIMES.length;
  return TIMES[timeIndex];
}

function timeParts(time: string): { h: number; m: number } {
  const [h, m] = time.split(":").map(Number);
  return { h, m };
}

/*
  TIMING (consistent cycle, ~10s total):
  
  0ms      — cycle starts, composer empty, placeholder showing
  800ms    — typing begins
  ~3800ms  — typing ends (3s typing window, speed adapts to message length)
  4800ms   — send button fully lit for 1s
  4800ms   — SEND fires: button press animation
  5300ms   — widget updates, time rolls, heart pops, composer clears
  6500ms   — heart pop fades
  8000ms   — idle pause
  10000ms  — next cycle
*/

const CYCLE_MS = 10000;
const TYPE_START = 800;
const TYPE_DURATION = 3000; // always 3s to type regardless of length
const SEND_FIRE = 4800;
const WIDGET_UPDATE = 5300;
const HEART_FADE = 6800;

export function HeroPhones() {
  const [widgetMessage, setWidgetMessage] = useState(messages[0]);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"idle" | "typing" | "ready" | "sending" | "sent">("idle");
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [currentTime, setCurrentTime] = useState("9:41");
  const indexRef = useRef(0);
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const runCycle = useCallback(() => {
    const nextIdx = (indexRef.current + 1) % messages.length;
    const nextMsg = messages[nextIdx];
    const charDelay = TYPE_DURATION / nextMsg.length;

    // Phase: idle (composer shows placeholder)
    setTyped("");
    setPhase("idle");

    // Time rolls right before typing
    const t0 = setTimeout(() => {
      setCurrentTime(generateRandomTime());
    }, 400);

    // Start typing
    const t1 = setTimeout(() => {
      setPhase("typing");
      let i = 0;
      typingRef.current = setInterval(() => {
        i++;
        if (i <= nextMsg.length) {
          setTyped(nextMsg.slice(0, i));
        }
        if (i >= nextMsg.length) {
          if (typingRef.current) clearInterval(typingRef.current);
          setPhase("ready");
        }
      }, charDelay);
    }, TYPE_START);

    // Send fires
    const t2 = setTimeout(() => {
      setPhase("sending");
    }, SEND_FIRE);

    // Widget updates
    const t3 = setTimeout(() => {
      setWidgetMessage(nextMsg);
      setShowHeartPop(true);
      setPhase("sent");
      setTyped("");
      indexRef.current = nextIdx;
    }, WIDGET_UPDATE);

    // Heart fades
    const t4 = setTimeout(() => {
      setShowHeartPop(false);
      setPhase("idle");
    }, HEART_FADE);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      if (typingRef.current) clearInterval(typingRef.current);
    };
  }, []);

  useEffect(() => {
    // Run first cycle after a short initial delay
    let cleanup = runCycle();
    const interval = setInterval(() => {
      cleanup();
      cleanup = runCycle();
    }, CYCLE_MS);
    return () => {
      cleanup();
      clearInterval(interval);
    };
  }, [runCycle]);

  const { h: timeH, m: timeM } = timeParts(currentTime);
  const isSendActive = phase === "ready" || phase === "sending" || phase === "sent";
  const isSendPressed = phase === "sending";

  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-6 max-w-[600px] mx-auto">
        {/* ==================== LEFT PHONE — SENDER ==================== */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="relative"
        >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="bg-[#1a1a1a] border border-[#333] rounded-[2.5rem] p-2 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.6)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1a1a1a] rounded-b-2xl z-10">
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-[#0a0a0a] rounded-full" />
            </div>

            <div className="bg-[#282828] rounded-[2.2rem] overflow-hidden relative">
              <div className="px-6 pt-4 pb-1 flex items-center justify-end text-[#ebdbb2]/60 text-[10px]">
                <div className="flex items-center gap-1">
                  <Signal className="w-2.5 h-2.5" />
                  <Wifi className="w-2.5 h-2.5" />
                  <Battery className="w-3.5 h-2.5" />
                </div>
              </div>

              <div className="px-4 py-3 min-h-[420px] flex flex-col">
                {/* Partner Header */}
                <div className="flex flex-col items-center mb-5">
                  <div className="w-14 h-14 rounded-xl bg-[#ebdbb2]/8 border border-[#ebdbb2]/15 flex items-center justify-center mb-2.5">
                    <Heart className="w-6 h-6 text-[#ebdbb2] fill-[#ebdbb2]" />
                  </div>
                  <div className="text-[10px] text-[#ebdbb2]/50 mb-0.5">Sending to</div>
                  <div className="text-sm font-semibold text-[#ebdbb2]">Your Partner</div>
                </div>

                {/* Live Widget Preview */}
                <div className="mb-4 px-2.5 py-2.5">
                  <p className="text-[11px] text-[#ebdbb2]/70 leading-relaxed min-h-[36px]">
                    {typed || widgetMessage}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Heart className="w-2 h-2 text-[#ebdbb2]/50 fill-[#ebdbb2]/50" />
                    <span className="text-[8px] font-semibold text-[#ebdbb2]/50">Luv</span>
                  </div>
                </div>

                {/* Composer */}
                <div className="flex-1 flex flex-col justify-end">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-semibold text-[#ebdbb2]/50">Write Your Message</span>
                    <span className="text-[8px] text-[#ebdbb2]/35">{typed.length}/500</span>
                  </div>

                  <div className="bg-[#ebdbb2]/5 border border-[#ebdbb2]/15 rounded-xl p-3 mb-2.5 min-h-[70px]">
                    {typed ? (
                      <p className="text-[11px] text-[#ebdbb2] leading-relaxed">
                        {typed}
                        {phase === "typing" && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.45, repeat: Infinity, repeatType: "reverse" }}
                            className="inline-block w-[1px] h-[13px] bg-[#ebdbb2] ml-[1px] align-middle"
                          />
                        )}
                      </p>
                    ) : (
                      <p className="text-[11px] text-[#ebdbb2]/35 leading-relaxed">
                        Share something sweet...
                      </p>
                    )}
                  </div>

                  <motion.div
                    animate={
                      isSendPressed
                        ? { scale: [1, 0.93, 1], transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] } }
                        : { scale: 1, transition: { duration: 0.2 } }
                    }
                    className={`w-full rounded-xl py-2.5 flex items-center justify-center gap-1.5 text-[11px] font-semibold transition-colors duration-300 ${
                      isSendActive
                        ? "bg-[#ebdbb2] text-[#282828]"
                        : "bg-[#ebdbb2]/30 text-[#282828]/40"
                    }`}
                    style={{ willChange: "transform" }}
                  >
                    <Send className="w-3 h-3" style={{ transform: "rotate(-30deg)" }} />
                    Send Message
                  </motion.div>
                </div>

                <div className="pt-2.5 flex justify-center">
                  <div className="w-24 h-1 bg-[#ebdbb2]/20 rounded-full" />
                </div>
              </div>
            </div>
          </div>
          </motion.div>
          <div className="text-center mt-3 text-xs text-[#928374]">You</div>
        </motion.div>

        {/* ==================== RIGHT PHONE — RECEIVER ==================== */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="relative"
        >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="bg-[#1a1a1a] border border-[#333] rounded-[2.5rem] p-2 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.6)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1a1a1a] rounded-b-2xl z-10">
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-[#0a0a0a] rounded-full" />
            </div>

            <div className="bg-[#1d2021] rounded-[2.2rem] overflow-hidden relative">
              <div className="px-6 pt-4 pb-1 flex items-center justify-end text-[#ebdbb2]/60 text-[10px]">
                <div className="flex items-center gap-1">
                  <Signal className="w-2.5 h-2.5" />
                  <Wifi className="w-2.5 h-2.5" />
                  <Battery className="w-3.5 h-2.5" />
                </div>
              </div>

              <div className="px-4 py-4 min-h-[420px] flex flex-col">
                {/* Rolling Time */}
                <div className="text-center mb-1.5">
                  <div className="flex items-center justify-center">
                    <RollingTime time={currentTime} />
                  </div>
                  <div className="text-[13px] text-[#d5c4a1] font-medium mt-0.5">Monday, February 19</div>
                </div>

                {/* Widget */}
                <div className="mt-6 mb-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={widgetMessage}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1.0] }}
                      className="bg-[#3c3836]/70 backdrop-blur-2xl border border-[#ebdbb2]/8 rounded-2xl px-3.5 py-3 relative"
                      style={{ willChange: "transform, opacity" }}
                    >
                      <AnimatePresence>
                        {showHeartPop && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] }}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#ebdbb2] rounded-full flex items-center justify-center shadow-lg"
                          >
                            <Heart className="w-2.5 h-2.5 text-[#282828] fill-[#282828]" />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <p className="text-[11px] text-[#ebdbb2]/85 leading-relaxed min-h-[36px]">
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

                {/* Lock Screen Bottom */}
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
          <div className="text-center mt-3 text-xs text-[#928374]">Your Partner</div>
        </motion.div>
      </div>

      {/* Connection Line */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
      >
        <div className="w-[500px] h-px bg-gradient-to-r from-transparent via-[#ebdbb2]/15 to-transparent" />
      </motion.div>
    </div>
  );
}
