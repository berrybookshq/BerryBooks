"use client";
import { PRODUCTS, WHATSAPP_URL } from "@/lib/constants";
import type { OrderState } from "@/app/order/page";
import ProductSlider from "@/components/ui/ProductSlider";
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  state: OrderState;
  update: (patch: Partial<OrderState>) => void;
  onNext: () => void;
}

export default function Step1Product({ state, update, onNext }: Props) {
  const selectedProduct = PRODUCTS.find(p => p.id === state.productId);
  const selectedVariant = selectedProduct?.variants.find(v => v.pages === state.variantPages);

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-32">
      {/* ── Size Selection ──────────────────────── */}
      <section className="px-6 pt-10">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 text-center mb-8">Choose Your Size</h2>
        <div className="flex justify-center gap-6">
          {PRODUCTS.map((p) => {
            const isSelected = state.productId === p.id;
            const hasSelection = !!state.productId;
            const isDimmed = hasSelection && !isSelected;

            return (
              <button
                key={p.id}
                onClick={() => update({ productId: p.id, variantPages: 0, couponName: "", discountValue: 0 })}
                className={`
                  px-10 py-6 rounded-3xl border transition-all duration-500 text-center relative
                  ${isSelected 
                    ? "bg-white/[0.08] border-white text-white shadow-[0_0_40px_rgba(255,255,255,0.05)] scale-105 z-10" 
                    : "bg-transparent border-white/20 text-white hover:border-white/30"}
                  ${isDimmed ? "opacity-30 grayscale-[0.8]" : "opacity-100"}
                `}
              >
                <div className="text-3xl font-black tracking-tighter">{p.size}</div>
                <div className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${isSelected ? "opacity-100" : "opacity-60"}`}>{p.dimensions}</div>
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-amber-400 text-black w-6 h-6 rounded-full flex items-center justify-center shadow-lg transform scale-90">
                     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Compact Product Info & Slider ────────── */}
      <AnimatePresence mode="wait">
        {state.productId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-12"
          >
             <div className="text-center px-6">
                <h3 className="text-4xl font-serif font-black text-white mb-2">{selectedProduct?.name}</h3>
                <p className="text-sm text-white/40 max-w-lg mx-auto leading-relaxed">{selectedProduct?.description}</p>
             </div>

             <div className="max-w-md mx-auto aspect-[4/3] glass rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl relative">
                <ProductSlider productId={state.productId} className="w-full h-full" />
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Variant Slider ──────────────────────── */}
      <AnimatePresence mode="wait">
        {state.productId ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative group"
          >
            <div className="flex overflow-x-auto pb-8 pt-4 snap-x hide-scrollbar gap-4 px-6">
               {selectedProduct?.variants.map((v) => {
                 const isSelected = state.variantPages === v.pages;
                 const hasSelection = state.variantPages > 0;
                 const isDimmed = hasSelection && !isSelected;

                 return (
                   <button
                     key={v.pages}
                     onClick={() => update({ variantPages: v.pages })}
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
            {/* Fade masks */}
            {!state.variantPages && (
               <>
                 <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0a0f] to-transparent pointer-events-none z-10" />
                 <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0a0f] to-transparent pointer-events-none z-10" />
               </>
            )}
          </motion.div>
        ) : (
          <div className="py-20 text-center">
             <p className="text-white/10 font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Select Size to Reveal Options</p>
          </div>
        )}
      </AnimatePresence>

      {/* ── Integrated Action Button ─────────── */}
      <AnimatePresence>
        {selectedVariant && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col items-center gap-6 pt-10"
          >
             <div className="h-[1px] w-32 bg-white/10" />
             <button
                onClick={onNext}
                className="group relative flex flex-col items-center gap-4"
              >
                 <div className="gold-shimmer text-white font-bold text-xs uppercase tracking-widest px-12 py-4 h-16 flex items-center justify-center rounded-full shadow-xl hover:shadow-cherry/40 transition-all duration-300 min-w-[200px]">
                    Continue
                 </div>
                 <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] font-sans">{selectedProduct?.size} • <span className="tabular-nums">{state.variantPages}</span> Pages Selected</p>
              </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
