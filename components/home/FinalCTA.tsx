"use client";
import Link from "next/link";
import { WHATSAPP_URL } from "@/lib/constants";

export default function FinalCTA() {
  return (
    <section className="py-20 px-5 bg-[#06060e] relative overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[400px] bg-amber-500/8 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-cherry-light/10 border border-cherry-light/20 text-cherry-light text-xs font-medium px-4 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-cherry-light animate-pulse" />
          Limited Time: Free shipping on all orders
        </div>

        <h2 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6">
          Your Next Adventure
          <span className="block grad-text italic">Deserves a Book.</span>
        </h2>

        <p className="text-white/60 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          Stop letting your best photos gather digital dust. Create a photobook that
          will be treasured for decades — starting at just{" "}
          <span className="text-cherry-light font-bold">₹799</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/order"
            className="gold-shimmer text-white font-bold text-base px-8 py-4 rounded-full shadow-xl hover:shadow-cherry/40 transition-all duration-300 min-w-[200px]"
          >
            Create
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp font-semibold text-base px-8 py-4 rounded-full min-w-[200px]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat with Us
          </a>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-white/40 text-xs">
          {["🚚 Pan India Delivery", "🏆 Premium Quality", "💳 Secure Payments", "🔁 Easy Reorder", "📦 Safe Packaging"].map((b) => (
            <span key={b}>{b}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
