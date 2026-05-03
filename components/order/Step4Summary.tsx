"use client";
import React, { useState } from "react";
import { PRODUCTS, WHATSAPP_NUMBER } from "@/lib/constants";
import type { OrderState } from "@/app/order/page";
import { createOrder } from "@/services/orderService";
import { validateCoupon } from "@/services/couponService";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { 
  Loader2, 
  CheckCircle2, 
  Tag, 
  Ticket, 
  ChevronLeft, 
  ShieldCheck,
  Smartphone,
  Info
} from "lucide-react";

interface Props {
  state: OrderState;
  update: (patch: Partial<OrderState>) => void;
  onBack: () => void;
  onConfirmed: () => void;
}

export default function Step4Summary({ state, update, onBack, onConfirmed }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [couponInput, setCouponInput] = useState(state.couponName || "");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMsg, setCouponMsg] = useState<{ t: string; type: "s" | "e" } | null>(null);
  const [orderDetails, setOrderDetails] = useState<{ id: string; url: string } | null>(null);

  const product = PRODUCTS.find((p) => p.id === state.productId);
  const variant = product?.variants.find((v) => v.pages === state.variantPages);
  const basePrice = variant?.price || 0;
  
  const discountAmount = state.discountType === "percent" 
    ? Math.round((basePrice * state.discountValue) / 100)
    : state.discountValue;
    
  const finalPrice = Math.max(0, basePrice - discountAmount);

  const handleApplyCoupon = async () => {
    if (!couponInput) return;
    setCouponLoading(true);
    setCouponMsg(null);

    const coupon = await validateCoupon(couponInput, state.productId);
    
    if (coupon) {
      update({ 
        couponName: coupon.name, 
        discountType: coupon.discount_type,
        discountValue: coupon.discount_value 
      });
      const label = coupon.discount_type === 'percent' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`;
      setCouponMsg({ t: `Success! ${label} discount applied.`, type: "s" });
    } else {
      setCouponMsg({ t: "Invalid, expired, or not applicable for this book.", type: "e" });
      update({ couponName: "", discountValue: 0, discountType: "percent" });
    }
    setCouponLoading(false);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const fullAddress = `${state.address.house}, ${state.address.area}, ${state.address.landmark ? state.address.landmark + ", " : ""}${state.address.city}, ${state.address.state} - ${state.address.pincode}`;

      let finalPhotoUrls = state.skippedUpload ? [] : state.photoUrls.filter(Boolean);
      
      if (!state.skippedUpload && finalPhotoUrls.length > 0) {
        try {
          const res = await fetch('/api/generate-zip', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tag: state.uploadSessionId })
          });
          const data = await res.json();
          if (data.secure_url) {
            finalPhotoUrls = [data.secure_url];
          }
        } catch (err) {
          console.error("Failed to generate zip url:", err);
        }
      }

      const orderId = await createOrder({
        id: state.uploadSessionId,
        customer_name: state.customerName || "",
        customer_id: user?.id,
        customer_email: user?.email || "",
        phone: state.phone || "",
        address: fullAddress,
        city: state.address.city || "",
        state: state.address.state || "",
        pincode: state.address.pincode || "",
        size: product?.name || state.productId,
        pages: state.variantPages,
        photosCount: state.skippedUpload ? 0 : state.photos.length,
        photo_urls: finalPhotoUrls,
        upload_session_id: state.uploadSessionId,
        total_price: finalPrice,
        coupon_code: state.couponName || "",
        discount_applied: discountAmount || 0,
      });

      const textLines = [
        `*New BerryBooks Order Confirmation*`,
        ``,
        `Order ID: *${orderId}*`,
        `Client: ${state.customerName}`,
        `Book: ${product?.name}`,
        `Specs: ${state.variantPages} Pages`,
        `Price: ₹${finalPrice}`,
        state.couponName ? `Coupon Applied: ${state.couponName} (-${state.discountType === 'percent' ? state.discountValue + '%' : '₹' + state.discountValue})` : "",
        ``,
        `Address: ${state.address.city}, ${state.address.state}`,
        ``,
        `Hi! I've confirmed my order summary. Please share the timeline.`
      ].filter(Boolean);

      const messageContent = encodeURIComponent(textLines.join("\n"));
      const finalUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${messageContent}`;

      setOrderDetails({ id: orderId, url: finalUrl });
      onConfirmed();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (orderDetails) {
    return (
      <div className="text-center py-6">
        <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-500 shadow-2xl shadow-emerald-500/10">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-4xl font-serif font-black mb-4">Confirmed!</h2>
        <p className="text-white/40 mb-10 max-w-sm mx-auto leading-relaxed">
          Order ID: <span className="text-white font-mono font-bold tracking-widest">{orderDetails.id}</span>
          <br />
          Your memories have been successfully queued for creation.
        </p>

        <a
          href={orderDetails.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp w-full font-semibold text-base py-4 rounded-full shadow-xl"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Complete on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-10 font-sans">
      <div className="text-center space-y-4">
        <h2 className="font-serif text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Order Summary</h2>
        <p className="text-white/40 text-sm max-w-xs mx-auto font-medium">Double check your order details before confirming.</p>
      </div>

      {/* Product Card */}
      <div className="bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden">
         <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-white/[0.02] to-transparent">
            <div>
               <div className="text-cherry-light text-[10px] font-black uppercase tracking-[0.3em] mb-2">Book Selection</div>
               <h4 className="text-xl md:text-2xl font-serif font-black text-white">{product?.name}</h4>
               <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1 font-sans">
                 <span className="tabular-nums">{state.variantPages}</span> Pages • <span className="tabular-nums">{state.photos.length}</span> Photos
               </p>
            </div>
            <div className="text-right">
               <div className="text-white/20 text-[10px] font-black uppercase tracking-widest mb-1">Price</div>
               <p className="text-xl md:text-2xl font-black text-white tracking-tighter font-sans tabular-nums">₹{basePrice.toLocaleString("en-IN")}</p>
            </div>
         </div>

         {/* Coupon Sector */}
         <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
               <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em] flex items-center gap-2">
                  <Ticket size={12} className="text-cherry-light" />
                  Coupon Code
               </p>
               {state.discountValue > 0 && <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Applied</span>}
            </div>
            <div className="flex gap-2">
               <input 
                 type="text" 
                 placeholder="CODE" 
                 value={couponInput}
                 onChange={(e) => setCouponInput(e.target.value)}
                 className="flex-1 min-w-0 h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-black text-white focus:outline-none focus:border-cherry-light transition-all uppercase placeholder:text-white/10"
               />
               <button 
                 onClick={handleApplyCoupon}
                 disabled={couponLoading || !couponInput}
                 className="w-24 h-14 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all disabled:opacity-30 whitespace-nowrap"
               >
                 {couponLoading ? <Loader2 className="animate-spin" size={16} /> : "Apply"}
               </button>
            </div>
            {couponMsg && (
               <p 
                 className={`animate-in fade-in slide-in-from-top-2 duration-300 text-[10px] font-black uppercase tracking-widest px-4 py-3 rounded-xl border ${couponMsg.type === 's' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10' : 'bg-red-500/10 text-red-500 border-red-500/10'}`}
               >
                 {couponMsg.t}
               </p>
            )}
         </div>
      </div>

      {/* Pricing Summary */}
      <div className="bg-white/5 rounded-[2.5rem] p-8 space-y-5 border border-white/5 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-cherry-light/5 blur-[50px] -mr-16 -mt-16" />
         
         <div className="flex justify-between text-[11px] font-bold uppercase tracking-[0.2em] font-sans">
            <span className="text-white/30">Subtotal</span>
            <span className="text-white tabular-nums">₹{basePrice.toLocaleString("en-IN")}</span>
         </div>
         {discountAmount > 0 && (
           <div className="flex justify-between text-[11px] font-bold uppercase tracking-[0.2em] font-sans">
              <span className="text-emerald-500">
                Discount ({state.discountType === "percent" ? `${state.discountValue}%` : `₹${state.discountValue}`})
              </span>
              <span className="text-emerald-500 tabular-nums">-₹{discountAmount.toLocaleString("en-IN")}</span>
           </div>
         )}
         <div className="flex justify-between text-[11px] font-bold uppercase tracking-[0.2em] font-sans">
            <span className="text-white/30">Shipping</span>
            <span className="text-emerald-500 font-black">FREE</span>
         </div>
         <div className="h-px bg-white/5 my-6" />
         <div className="flex justify-between items-end">
            <div>
               <div className="text-white/20 text-[10px] font-black uppercase tracking-widest mb-1">Final Amount</div>
               <span className="text-xl md:text-2xl font-serif font-black text-white">Grand Total</span>
            </div>
            <span className="text-3xl md:text-4xl font-black text-white tracking-tighter font-sans tabular-nums">₹{finalPrice.toLocaleString("en-IN")}</span>
         </div>
      </div>

      <div className="flex items-center gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-[2rem]">
         <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0">
            <ShieldCheck size={18} className="text-[#25D366]" />
         </div>
         <p className="text-[10px] text-white/40 leading-relaxed font-bold uppercase tracking-tight">
            Order verification & payment link will be shared on <span className="text-[#25D366]">WhatsApp</span>.
         </p>
      </div>

      <div className="pt-4">
        <button
          onClick={handleFinalSubmit}
          disabled={loading}
          className="w-full h-16 gold-shimmer text-white gap-2 font-bold text-xs uppercase tracking-widest px-8 rounded-full shadow-xl hover:shadow-cherry/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Confirm Order"}
        </button>
      </div>
    </div>
  );
}
