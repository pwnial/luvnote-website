import { motion, AnimatePresence } from "motion/react";
import { Heart, Battery, Signal, Wifi } from "lucide-react";

interface PhoneWidgetProps {
  message: string;
  isUpdating?: boolean;
}

export function PhoneWidget({ message, isUpdating }: PhoneWidgetProps) {
  return (
    <div className="relative">
      {/* iPhone Frame — matches hero phone style */}
      <div className="bg-[#1a1a1a] border border-[#333] rounded-[3rem] p-2.5 w-[280px] mx-auto shadow-[0_25px_60px_-10px_rgba(0,0,0,0.6)]">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1a1a1a] rounded-b-2xl z-10">
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-[#0a0a0a] rounded-full" />
        </div>

        {/* Screen */}
        <div className="bg-[#1d2021] rounded-[2.5rem] overflow-hidden relative">
          {/* Status Bar */}
          <div className="px-6 pt-4 pb-2 flex items-center justify-between text-[#ebdbb2]/60 text-xs">
            <div className="font-extralight">9:41</div>
            <div className="flex items-center gap-1">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-4 h-3" />
            </div>
          </div>

          {/* Home Screen Content */}
          <div className="px-4 py-6 min-h-[480px]">
            {/* Date */}
            <div className="text-center mb-6">
              <div className="text-5xl font-extralight text-[#ebdbb2] mb-1 tracking-tight">Monday</div>
              <div className="text-lg text-[#928374] font-light">February 19</div>
            </div>

            {/* Widget */}
            <motion.div
              key={message}
              initial={isUpdating ? { scale: 0.96, opacity: 0.5 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
              className="bg-[#3c3836]/70 backdrop-blur-2xl border border-[#ebdbb2]/8 rounded-2xl p-4 mb-6"
            >
              <p className="text-sm text-[#ebdbb2]/85 leading-relaxed mb-3">{message}</p>
              <div className="flex items-center gap-1.5">
                <Heart className="w-2.5 h-2.5 text-[#ebdbb2]/60 fill-[#ebdbb2]/60" />
                <span className="text-[9px] font-semibold text-[#ebdbb2]/60">Luv</span>
                <span className="text-[9px] text-[#ebdbb2]/30 ml-auto">just now</span>
              </div>
            </motion.div>

            {/* App Icons Grid */}
            <div className="grid grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className="w-14 h-14 bg-[#ebdbb2]/5 rounded-2xl border border-[#ebdbb2]/5" />
                  <div className="w-8 h-1 bg-[#ebdbb2]/10 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Home Indicator */}
          <div className="pb-2 flex justify-center">
            <div className="w-28 h-1 bg-[#ebdbb2]/20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
