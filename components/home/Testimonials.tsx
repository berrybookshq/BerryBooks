"use client";
import { TESTIMONIALS } from "@/lib/constants";

export default function Testimonials() {
  return (
    <section className="py-24 px-5 bg-[#0a0a0f]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div className="h-px w-12 bg-cherry-light/40" />
          <span className="text-cherry-light text-xs uppercase tracking-[0.25em] font-medium">Reviews</span>
          <div className="h-px w-12 bg-cherry-light/40" />
        </div>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-4">
          Loved by <span className="grad-text italic">Travellers Across India</span>
        </h2>
        <p className="text-white/50 text-center text-lg mb-14 max-w-xl mx-auto">
          Don&apos;t take our word for it — here&apos;s what our customers say.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-6 flex flex-col gap-4 border border-white/10 hover:border-cherry-light/20 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} className="text-cherry-light text-sm">★</span>
                ))}
              </div>

              <p className="text-white/80 text-sm leading-relaxed flex-1 italic">
                &quot;{t.text}&quot;
              </p>

              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cherry-light to-orange-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{t.name}</div>
                  <div className="text-cherry-light text-xs">{t.city} · {t.trip}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Aggregate rating */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-cherry-light text-2xl">★</span>
            ))}
          </div>
          <div className="text-white/70 text-lg">
            <span className="text-white font-bold">4.9</span> / 5 based on 500+ reviews
          </div>
        </div>
      </div>
    </section>
  );
}
