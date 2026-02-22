import { useState } from "react";

const devices = [
  { label: "iPhone 15 Pro", w: 393, h: 852 },
  { label: "iPhone SE", w: 320, h: 568 },
  { label: "iPad", w: 768, h: 1024 },
  { label: "iPad Pro", w: 1024, h: 1366 },
];

export function DebugDevicePreview() {
  const [active, setActive] = useState<number | null>(null);

  if (active === null) {
    return (
      <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[200] flex gap-1 bg-[#1d2021]/90 border border-[#504945] rounded-full px-3 py-1.5 text-[10px] text-[#928374]">
        {devices.map((d, i) => (
          <button
            key={d.label}
            onClick={() => setActive(i)}
            className="px-2 py-0.5 rounded-full hover:bg-[#504945] hover:text-[#ebdbb2] transition-colors cursor-pointer"
          >
            {d.label}
          </button>
        ))}
      </div>
    );
  }

  const device = devices[active];
  // Scale to fit in viewport with padding
  const maxH = window.innerHeight - 80;
  const maxW = window.innerWidth - 80;
  const scale = Math.min(maxH / device.h, maxW / device.w, 1);

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 flex flex-col items-center justify-center">
      {/* Controls */}
      <div className="flex gap-1 mb-4 bg-[#1d2021]/90 border border-[#504945] rounded-full px-3 py-1.5 text-[10px] text-[#928374]">
        {devices.map((d, i) => (
          <button
            key={d.label}
            onClick={() => setActive(i)}
            className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
              i === active ? "bg-[#504945] text-[#ebdbb2]" : "hover:bg-[#504945] hover:text-[#ebdbb2]"
            }`}
          >
            {d.label}
          </button>
        ))}
        <button
          onClick={() => setActive(null)}
          className="px-2 py-0.5 rounded-full hover:bg-[#cc241d]/50 hover:text-[#ebdbb2] transition-colors cursor-pointer ml-1"
        >
          ✕ Close
        </button>
      </div>

      {/* Device label */}
      <div className="text-[10px] text-[#928374] mb-2">
        {device.label} — {device.w}×{device.h} ({Math.round(scale * 100)}%)
      </div>

      {/* Device frame */}
      <div
        className="bg-[#1a1a1a] rounded-[3rem] p-3 shadow-2xl border border-[#333]"
        style={{
          width: device.w * scale + 24,
          height: device.h * scale + 24,
        }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1a1a1a] rounded-b-2xl z-10" style={{ top: 12 * scale }}>
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-[#0a0a0a] rounded-full" />
        </div>

        <iframe
          src="/"
          className="rounded-[2.5rem] bg-[#282828]"
          style={{
            width: device.w,
            height: device.h,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            border: "none",
          }}
        />
      </div>
    </div>
  );
}
