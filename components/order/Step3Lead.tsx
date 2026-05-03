"use client";
import React, { useState, useEffect } from "react";
import type { OrderState } from "@/app/order/page";
import { MapPin, ChevronRight, ChevronLeft } from "lucide-react";

interface Props {
  state: OrderState;
  update: (patch: Partial<OrderState>) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function Step3Lead({ state, update, onBack, onNext }: Props) {
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Form validity check
  const isFormValid = 
    !!state.customerName &&
    (state.phone?.length || 0) >= 10 &&
    !!state.address.house &&
    !!state.address.area &&
    (state.address.pincode?.length || 0) === 6 &&
    !!state.address.city &&
    !!state.address.state;

  // ── Pincode Lookup ──
  useEffect(() => {
    const fetchPincode = async () => {
      const pin = state.address.pincode;
      if (pin?.length === 6) {
        setPincodeLoading(true);
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
          const data = await res.json();
          if (data[0].Status === "Success") {
            const details = data[0].PostOffice[0];
            update({
              address: {
                ...state.address,
                city: details.District,
                state: details.State,
              }
            });
          }
        } catch (e) {
          console.error("Pincode fetch failed", e);
        } finally {
          setPincodeLoading(false);
        }
      }
    };
    fetchPincode();
  }, [state.address.pincode]);

  const updateAddr = (patch: Partial<OrderState["address"]>) => {
    update({ address: { ...state.address, ...patch } });
  };

  const isInvalid = (field: string) => {
    if (!touched[field]) return false;
    if (field === "phone") return (state.phone?.length || 0) < 10;
    if (field === "pincode") return (state.address.pincode?.length || 0) < 6;
    if (field === "customerName") return !state.customerName;
    return !((state.address as any)[field]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        const index = Array.from(form.elements).indexOf(e.currentTarget);
        const nextElement = form.elements[index + 1] as HTMLElement;
        if (nextElement && nextElement.focus) {
          nextElement.focus();
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) onNext();
  };

  const inputClass = (field: string, extra = "") => `
    w-full bg-white/[0.03] border rounded-[1.5rem] px-6 py-5 text-white text-base placeholder-white/20 focus:outline-none transition-all duration-300 font-medium
    ${isInvalid(field) ? "border-red-500 bg-red-500/5 focus:border-red-500" : "border-white/5 focus:border-cherry-light focus:bg-white/[0.05] shadow-inner"}
    ${extra}
  `;

  return (
    <div className="space-y-10">
      <div className="text-center space-y-4">
        <h2 className="font-serif text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Delivery Details</h2>
        <p className="text-white/40 text-sm max-w-xs mx-auto font-medium">
          Please provide your address for a smooth delivery.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-8">
        <div className="space-y-6">
          <div className="space-y-2 px-1">
            <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              value={state.customerName || ""}
              onKeyDown={handleKeyDown}
              onBlur={() => setTouched(prev => ({ ...prev, customerName: true }))}
              onChange={(e) => update({ customerName: e.target.value })}
              className={inputClass("customerName")}
            />
          </div>

          <div className="space-y-2 px-1">
            <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">WhatsApp Number</label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 font-black text-base">+91</span>
              <input
                type="tel"
                placeholder="98765 43210"
                value={state.phone || ""}
                onKeyDown={handleKeyDown}
                onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
                onChange={(e) => update({ phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                className={inputClass("phone", "pl-16")}
              />
            </div>
          </div>

          <div className="h-px bg-white/5 mx-2" />

          <div className="space-y-4">
            <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
              <MapPin size={12} className="text-cherry-light" /> Shipping Address
            </label>
            
            <input
              type="text"
              placeholder="Flat / House No. / Building *"
              value={state.address.house || ""}
              onKeyDown={handleKeyDown}
              onBlur={() => setTouched(prev => ({ ...prev, house: true }))}
              onChange={(e) => updateAddr({ house: e.target.value })}
              className={inputClass("house")}
            />
            
            <input
              type="text"
              placeholder="Street / Colony / Area *"
              value={state.address.area || ""}
              onKeyDown={handleKeyDown}
              onBlur={() => setTouched(prev => ({ ...prev, area: true }))}
              onChange={(e) => updateAddr({ area: e.target.value })}
              className={inputClass("area")}
            />
            
            <input
              type="text"
              placeholder="Landmark (Optional)"
              value={state.address.landmark || ""}
              onKeyDown={handleKeyDown}
              onChange={(e) => updateAddr({ landmark: e.target.value })}
              className={inputClass("landmark", "border-white/5")} 
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Pincode *"
                  value={state.address.pincode || ""}
                  onKeyDown={handleKeyDown}
                  onBlur={() => setTouched(prev => ({ ...prev, pincode: true }))}
                  onChange={(e) => updateAddr({ pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                  className={inputClass("pincode", "text-center tracking-widest")}
                />
                {pincodeLoading && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-cherry-light/30 border-t-cherry-light rounded-full animate-spin" />}
              </div>
              <input
                type="text"
                placeholder="City *"
                value={state.address.city || ""}
                onBlur={() => setTouched(prev => ({ ...prev, city: true }))}
                onChange={(e) => updateAddr({ city: e.target.value })}
                className={inputClass("city")}
              />
            </div>
            
            <input
              type="text"
              placeholder="State *"
              value={state.address.state || ""}
              onBlur={() => setTouched(prev => ({ ...prev, state: true }))}
              onChange={(e) => updateAddr({ state: e.target.value })}
              className={inputClass("state")}
            />
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full h-16 gold-shimmer text-white font-bold text-xs uppercase tracking-widest px-8 rounded-full shadow-xl hover:shadow-cherry/40 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
