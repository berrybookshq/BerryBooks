"use client";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants";
import Link from "next/link";

export default function HowItWorks() {
  return (
    <section className="py-16 px-5 bg-[#06060e] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-950/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div className="h-px w-12 bg-cherry-light/40" />
          <span className="text-cherry-light text-xs uppercase tracking-[0.25em] font-medium">Process</span>
          <div className="h-px w-12 bg-cherry-light/40" />
        </div>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-4">
          Ready in <span className="grad-text italic">4 Simple Steps</span>
        </h2>
        <p className="text-white/50 text-center text-lg mb-16 max-w-xl mx-auto">
          No design skills needed. We handle everything — you just pick and upload.
        </p>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-cherry-light/30 to-transparent" />

          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <div
              key={step.step}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-7 text-center relative border border-white/10 hover:border-cherry-light/30 transition-all duration-300 hover:-translate-y-1 group"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Step number badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#111] border border-white/10 text-white/40 text-[11px] font-black flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:border-cherry-light/50 group-hover:text-cherry-light">
                {i + 1}
              </div>
              <div className="text-5xl mb-4 mt-2">{step.icon}</div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link
            href="/order"
            className="gold-shimmer text-white font-bold text-base px-8 py-4 rounded-full shadow-xl hover:shadow-cherry/40 transition-all duration-300 min-w-[200px]"
          >
            Create
          </Link>
        </div>
      </div>
    </section>
  );
}
