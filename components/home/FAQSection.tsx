"use client";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "How many photos can I include in my book?",
    a: "The photo limit depends on your chosen book size and page count. For A4 books, you can include up to 48 photos (24-page version). For A5 books, the limit is up to 36 photos. Our system will guide you during the upload process!",
  },
  {
    q: "What is your return and refund policy?",
    a: "Since every BerryBook is custom-made with your personal photos, we cannot accept returns or provide refunds once production has started. However, if your book arrives damaged or has a printing defect, we will gladly provide a free replacement. Your satisfaction is our priority!",
  },
  {
    q: "How long does it take to receive my book?",
    a: "We are proud of our speed! Once your photos are finalized, we dispatch your book within 48-72 hours. Delivery across India usually takes an additional 3-5 business days depending on your location.",
  },
  {
    q: "Can I choose my own design or template?",
    a: "Yes! After you upload your photos, our team will coordinate with you on WhatsApp to share template options. We have several premium, travel-inspired designs to choose from.",
  },
  {
    q: "Is the paper quality really premium?",
    a: "Absolutely. We use 170 GSM archival-grade art paper with a matte finish. This is much thicker and more durable than standard photo albums, designed to last for decades without yellowing.",
  },
  {
    q: "Do I need to pay upfront?",
    a: "Payment is processed once our designers have reviewed your photos and confirmed the layout. We will share a secure payment link or UPI details via WhatsApp during the final step of your order.",
  },
  {
    q: "Is my data and photos secure?",
    a: "Your privacy is our utmost priority. All photos uploaded to BerryBooks are used strictly for template design and printing. Once your order is shipped and you confirm receipt, all your photos are permanently deleted from our servers and database to ensure 100% confidentiality.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 px-5 bg-[#0a0a0f]" id="faq">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div className="h-px w-12 bg-berry/40" />
          <span className="text-white/40 text-xs uppercase tracking-[0.25em] font-medium flex items-center gap-2">
            <HelpCircle size={14} className="text-berry" /> Common Questions
          </span>
          <div className="h-px w-12 bg-berry/40" />
        </div>
        
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-16">
          Everything You <span className="grad-text italic">Need to Know</span>
        </h2>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div 
              key={i} 
              className={`bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === i ? "border-white/20 ring-1 ring-white/10" : "hover:border-white/20"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full py-5 px-6 flex items-center justify-between text-left group"
              >
                <span className={`text-lg font-medium transition-colors ${openIndex === i ? "text-berry-light" : "text-white/80 group-hover:text-white"}`}>
                  {faq.q}
                </span>
                <ChevronDown 
                  className={`text-white/40 transition-transform duration-300 ${openIndex === i ? "rotate-180 text-berry-light" : ""}`} 
                  size={20} 
                />
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === i ? "max-h-52 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 text-white/50 text-base leading-relaxed">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
