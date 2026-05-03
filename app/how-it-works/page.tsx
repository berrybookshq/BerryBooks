import type { Metadata } from "next";
import Link from "next/link";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "How It Works — BerryBooks",
  description: "Create your travel photobook in 4 easy steps. Choose, upload, design, and receive.",
};

const DETAILED_STEPS = [
  {
    step: "01",
    icon: "📐",
    title: "Choose Your Book",
    subtitle: "Pick the perfect format for your story",
    desc: "Select between A4 (210×297mm) or A5 (148×210mm) and pick your page count — from 12 minimal pages for quick trips up to 48 grand pages for lifetime adventures.",
    details: ["A5 carries up to 72 recommended photos", "A4 carries up to 96 recommended photos", "Choice of 7 page-tier variants", "Premium flat-bound hardcover"],
  },
  {
    step: "02",
    icon: "📸",
    title: "Upload Your Photos",
    subtitle: "Your memories, curated",
    desc: "Simply drag and drop your best travel shots. Our system provides a recommended range for your chosen book size to ensure the best design layout.",
    details: ["JPG, PNG, HEIC formats", "Mobile-optimized uploader", "Encrypted file protection", "Curated selection feedback"],
  },
  {
    step: "03",
    icon: "🎨",
    title: "Design & Review",
    subtitle: "Professional design assistance",
    desc: "Once uploaded, our designers craft your book. You'll receive a digital proof via WhatsApp to review and approve before we go to print.",
    details: ["Professional layout design", "Date & caption integration", "Direct designer chat", "Seamless review process"],
  },
  {
    step: "04",
    icon: "🚀",
    title: "Priority Dispatch",
    subtitle: "Premium quality to your doorstep",
    desc: "Approved designs are printed on archival paper and shipped in a custom protective box within 48-72 hours. Receive your book anywhere in India.",
    details: ["48-72Hrs Priority Dispatch", "Free Pan India Shipping", "Custom Protective Box", "Quality Guarantee"],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-5 text-center py-16">
        <h1 className="font-serif text-5xl md:text-6xl font-bold mb-5">
          How It <span className="grad-text italic">Works</span>
        </h1>
        <p className="text-white/60 text-xl max-w-2xl mx-auto">
          From upload to doorstep in 4 simple steps. No design experience needed.
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-5xl mx-auto px-5 space-y-6 mb-20">
        {DETAILED_STEPS.map((step, i) => (
          <div
            key={step.step}
            className={`bg-white/5 backdrop-blur-md rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start border border-white/10 hover:border-cherry-light/20 transition-all duration-300 ${
              i % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Icon + number */}
            <div className="shrink-0 flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cherry-light/20 to-orange-500/20 border border-cherry-light/20 flex items-center justify-center text-4xl">
                {step.icon}
              </div>
              <span className="font-serif text-5xl font-black text-white/10">{step.step}</span>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="text-cherry-light text-xs uppercase tracking-widest mb-2">Step {i + 1}</div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-1">{step.title}</h2>
              <p className="text-cherry-light/70 text-sm mb-4">{step.subtitle}</p>
              <p className="text-white/60 leading-relaxed mb-6">{step.desc}</p>
              <div className="flex flex-wrap gap-2">
                {step.details.map((d) => (
                  <span key={d} className="text-xs bg-white/5 border border-white/10 text-white/60 px-3 py-1.5 rounded-full">
                    ✓ {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center px-5">
        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
          Ready to <span className="grad-text italic">Begin?</span>
        </h2>
        <Link
          href="/order"
          className="inline-block gold-shimmer text-white font-bold px-10 py-4 rounded-full shadow-xl hover:scale-105 transition-all duration-300 text-lg"
        >
          Create My Book
        </Link>
      </div>
    </div>
  );
}
