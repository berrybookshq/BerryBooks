import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS } from "@/lib/constants";
import ProductSlider from "@/components/ui/ProductSlider";
import ProductItem from "@/components/product/ProductItem";

export const metadata: Metadata = {
  title: "Our Products — A4 & A5 Premium Photobooks | BerryBooks",
  description: "Choose from A4 or A5 photobooks with up to 48 pages. Premium print quality. Starting at ₹699.",
};

export default function ProductPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#0a0a0f]">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-5 text-center py-16">
        <div className="inline-flex items-center gap-2 bg-cherry-light/10 border border-cherry-light/20 text-cherry-light text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full mb-6">
          Premium Artifacts
        </div>
        <h1 className="font-serif text-5xl md:text-7xl font-black mb-6 leading-tight">
          Two Sizes.{" "}
          <span className="grad-text italic">Seven Capacities.</span>
        </h1>
        <p className="text-white/40 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed">
          Professional-grade photobooks available from 12 to 48 pages. 
          Printed on 170gsm archival paper with a premium matte finish.
        </p>
      </div>

      {/* Products */}
      <div className="max-w-6xl mx-auto px-5">
        {PRODUCTS.map((product, idx) => (
          <ProductItem key={product.id} product={product} idx={idx} />
        ))}

        {/* Features grid */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            { icon: "📄", title: "170gsm Archival Paper", desc: "Museum-quality paper that won't yellow for decades." },
            { icon: "🎨", title: "Matte HD Print", desc: "Vivid, color-accurate printing with true-to-life tones." },
            { icon: "📦", title: "Hardcover Bound", desc: "Durable lay-flat binding that opens perfectly flat." },
            { icon: "🚚", title: "Pan India Delivery", desc: "Shipped within 48 hours to any address in India." },
            { icon: "🔒", title: "Secure Packaging", desc: "Custom-designed boxes to protect every corner." },
            { icon: "♻️", title: "Eco-Conscious", desc: "FSC-certified paper and sustainable ink processes." },
          ].map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6 hover:border-amber-400/20 transition-colors">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h4 className="font-semibold text-white mb-2">{f.title}</h4>
              <p className="text-white/50 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
