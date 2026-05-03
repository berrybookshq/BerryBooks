"use client";

export default function QuoteSection() {
  return (
    <section className="pt-20 pb-16 px-5 bg-[#0c0c0c] relative">
      <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
        <div className="relative fade-up">
          <p className="font-hindi text-4xl md:text-5xl lg:text-6xl text-white/90 leading-relaxed mb-6 font-medium">
            &quot;बाबू मोशाय, जिंदगी बड़ी होनी चाहिए...
          </p>
          <p className="font-hindi text-4xl md:text-5xl lg:text-6xl grad-text leading-relaxed">
            लंबी तो कुत्ते की दुम भी होती है।&quot;
          </p>
          <div className="mt-8 text-white/30 text-xs tracking-[0.3em] uppercase">
            — Anand (1971) · Our Core Principle
          </div>
        </div>
      </div>
    </section>
  );
}
