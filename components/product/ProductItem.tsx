"use client";
import { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/constants";
import ProductSlider from "@/components/ui/ProductSlider";

export default function ProductItem({ product, idx }: { product: Product; idx: number }) {
  // Default to the first variant (12 pages)
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

  return (
    <div
      className={`glass rounded-3xl overflow-hidden mb-10 flex flex-col ${
        idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* Visual panel */}
      <div className={`md:w-2/5 flex flex-col justify-center bg-[#0d0d12] relative rounded-t-3xl ${idx % 2 === 0 ? "md:rounded-tr-none md:rounded-l-3xl" : "md:rounded-tl-none md:rounded-r-3xl"} overflow-hidden border-white/5`}>
        <div className="w-full aspect-video relative z-10 border-y md:border-y-0 border-white/5">
          <ProductSlider productId={product.id} className="w-full h-full absolute inset-0" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-80 z-20 pointer-events-none" />
        <div className="absolute bottom-6 left-6 z-30 pointer-events-none">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-2">Visual Prototype</p>
           <h4 className="text-3xl font-serif font-black text-white italic">{product.name}</h4>
        </div>
      </div>

      {/* Info panel */}
      <div className="md:w-3/5 p-8 md:p-12">
        <h2 className="font-serif text-3xl font-bold mb-2">{product.name}</h2>
        <p className="text-white/50 mb-2">{product.dimensions}</p>
        <p className="text-white/70 mb-8 text-lg">{product.description}</p>

        {/* Dynamic Info Row */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-4 bg-white/[0.03] rounded-2xl px-6 py-4 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center text-xl">📸</div>
            <div>
              <div className="text-white text-sm font-black uppercase tracking-widest">Recommended: {selectedVariant.minPhotos}–{selectedVariant.maxPhotos} Photos</div>
              <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-0.5">Optimized for {selectedVariant.pages} pages</div>
            </div>
          </div>
        </div>

        {/* Variants Selection */}
        <div className="space-y-4 mb-10">
          <h3 className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-black">Select Configuration</h3>
          <div className="flex overflow-x-auto gap-4 pb-8 pt-4 snap-x hide-scrollbar scroll-smooth">
            {product.variants.map((v) => {
              const isSelected = selectedVariant.pages === v.pages;
              const isDimmed = !isSelected;
              
              return (
                <button
                  key={v.pages}
                  onClick={() => setSelectedVariant(v)}
                  className={`
                    shrink-0 w-[140px] p-6 rounded-[2rem] border transition-all duration-500 snap-center flex flex-col items-center text-center relative
                    ${isSelected 
                      ? "bg-white/[0.08] border-amber-400 shadow-2xl shadow-amber-900/10 scale-110 z-10 opacity-100" 
                      : "bg-[#111115] border-white/15 hover:border-white/25"}
                    ${isDimmed ? "opacity-30 grayscale-[0.8] scale-95" : "opacity-100"}
                  `}
                >
                  <div className={`text-[9px] font-black uppercase tracking-[0.2em] mb-3 ${isSelected ? "text-amber-400" : "text-white/20"}`}>
                    {v.label}
                  </div>
                  
                  <div className="text-xl font-black mb-1">{v.pages} pages</div>
                  
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-5 font-sans">
                    Up to {v.maxPhotos} photos
                  </div>

                  <div className={`text-lg font-black ${isSelected ? "text-amber-400" : "text-amber-400/60"}`}>
                    ₹{v.price.toLocaleString("en-IN")}
                  </div>

                  {isSelected && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 text-black px-3 py-1 rounded-full text-[8px] font-black tracking-widest shadow-xl">
                       SELECTED
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <Link
          href={`/order?product=${product.id}&pages=${selectedVariant.pages}`}
          className="gold-shimmer text-white font-bold text-base px-8 py-4 rounded-full shadow-xl hover:shadow-cherry/40 transition-all duration-300 min-w-[200px]"
        >
          Create
        </Link>
      </div>
    </div>
  );
}
