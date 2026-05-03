"use client";
import { Check } from "lucide-react";

const STEPS = [
  { n: 1, label: "Selection" },
  { n: 2, label: "Upload" },
  { n: 3, label: "Details" },
  { n: 4, label: "Summary" },
];

export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="w-full max-w-sm mx-auto mb-12 px-4">
      <div className="flex items-center justify-between relative">
        {/* Track */}
        <div className="absolute top-[18px] left-0 right-0 h-[1px] bg-white/10 z-0" />
        <div
          className="absolute top-[18px] left-0 h-[1px] bg-[#c1121f] z-0 transition-all duration-1000 shadow-[0_0_10px_rgba(193,18,31,0.8)]"
          style={{ width: `${((current - 1) / (STEPS.length - 1)) * 100}%` }}
        />
        
        {STEPS.map(({ n, label }) => {
          const done = n < current;
          const active = n === current;
          
          return (
            <div key={n} className="flex flex-col items-center gap-3 relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ${
                  done
                    ? "bg-[#c1121f] text-white shadow-lg shadow-[#c1121f]/20 scale-90"
                    : active
                    ? "bg-black border-2 border-[#e63946] text-[#e63946] scale-110 shadow-[0_0_20px_rgba(230,57,70,0.4)]"
                    : "bg-[#0c0c0c] border border-white/10 text-white/10"
                }`}
              >
                {done ? (
                  <Check size={16} strokeWidth={4} />
                ) : (
                  <span className={`text-[11px] font-black ${active ? "text-[#e63946]" : "text-white/20"}`}>
                    {n}
                  </span>
                )}
              </div>
              <span 
                className={`text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-500 ${
                  active ? "text-white" : "text-white/20"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
