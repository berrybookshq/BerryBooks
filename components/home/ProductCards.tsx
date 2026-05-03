"use client";
import Link from "next/link";
import { PRODUCTS } from "@/lib/constants";
import ProductSlider from "@/components/ui/ProductSlider";
import Tilt from "@/components/ui/Tilt";

export default function ProductCards() {
  return (
    <section className="py-16 px-5 bg-[#0a0a0f]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div className="h-px w-12 bg-cherry-light/40" />
          <span className="text-cherry-light text-xs uppercase tracking-[0.25em] font-medium">Our Products</span>
          <div className="h-px w-12 bg-cherry-light/40" />
        </div>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-4">
          Choose Your <span className="grad-text italic">Perfect Format</span>
        </h2>
        <p className="text-white/50 text-center text-lg mb-14 max-w-xl mx-auto">
          Two premium sizes. Seven page variants each. All printed on archival-quality paper with priority dispatch.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {PRODUCTS.map((product) => (
            <Tilt key={product.id}>
              <div
                className="bg-[#0f0f13] backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-cherry-light/20 transition-all duration-500 h-full group flex flex-col"
              >
                {/* Card header slider */}
                <div className={`aspect-video w-full bg-gradient-to-br ${product.id === 'a4' ? 'from-cherry to-red-950' : 'from-[#1a1a24] to-[#0a0a0f]'} relative overflow-hidden flex items-center justify-center`}>
                  <ProductSlider productId={product.id} className="w-full h-full relative z-10" />
                  {/* Decorative element */}
                  <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-white/5 z-20">
                    {product.size} Edition
                  </div>
                </div>

                <div className="p-8 text-left flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-serif text-3xl font-black text-white mb-2">{product.name}</h3>
                      <p className="text-white/30 text-xs font-bold uppercase tracking-widest">{product.dimensions} • 7 Variants</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] text-white/40 mb-1 uppercase font-bold tracking-widest">Starts At</div>
                      <div className="font-semibold text-2xl text-amber-400 tracking-tighter">₹{product.variants[0].price.toLocaleString("en-IN")}</div>
                    </div>
                  </div>

                  <p className="text-white/60 text-sm mb-10 leading-relaxed">{product.description}</p>

                  <div className="mt-auto text-center">
                    <Link
                      href={`/order?product=${product.id}`}
                      className="gold-shimmer text-white font-bold text-base px-8 py-4 rounded-full shadow-xl hover:shadow-cherry/40 transition-all duration-300 min-w-[200px]"
                    >
                      Create
                    </Link>
                  </div>
                </div>
              </div>
            </Tilt>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/product" className="text-white/50 hover:text-cherry-light text-sm transition-colors underline underline-offset-4">
            View full product details
          </Link>
        </div>
      </div>
    </section>
  );
}
