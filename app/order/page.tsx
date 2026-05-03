"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import StepIndicator from "@/components/order/StepIndicator";
import Step1Product from "@/components/order/Step1Product";
import Step2Upload from "@/components/order/Step2Upload";
import Step3Lead from "@/components/order/Step3Lead";
import Step4Summary from "@/components/order/Step4Summary";
import { ChevronLeft } from "lucide-react";

export interface OrderState {
  productId: string;
  variantPages: number;
  uploadSessionId: string;
  photos: File[];
  photoUrls: string[];
  skippedUpload: boolean;
  customerName?: string;
  email?: string;
  phone?: string;
  discountType: "percent" | "flat";
  discountValue: number;
  couponName?: string;
  address: {
    house?: string;
    area?: string;
    landmark?: string;
    pincode?: string;
    city?: string;
    state?: string;
  };
}

function OrderContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [state, setState] = useState<OrderState>({
    productId: searchParams.get("product") || "",
    variantPages: Number(searchParams.get("pages")) || 0,
    uploadSessionId: `SESSION-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    photos: [],
    photoUrls: [],
    skippedUpload: false,
    discountType: "percent",
    discountValue: 0,
    address: {}
  });

  // Handle back button behavior
  useEffect(() => {
    const handlePopState = () => {
      if (step > 1) {
        setStep(prev => prev - 1);
        window.history.pushState(null, "", "");
      }
    };
    window.history.pushState(null, "", "");
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [step]);

  const update = (patch: Partial<OrderState>) => setState(prev => ({ ...prev, ...patch }));

  return (
    <main className="min-h-screen bg-[#0c0c0c] text-white pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header / Back */}
        <div className="flex items-center justify-between mb-12">
          {step > 1 ? (
            <button 
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <ChevronLeft size={18} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
            </button>
          ) : (
            <div />
          )}
          
          <div className="text-right">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cherry-light mb-1">BerryBooks</p>
             <p className="text-xs font-bold text-white/20 uppercase tracking-tighter">Creation Engine v2.0</p>
          </div>
        </div>

        <StepIndicator current={step} />

        <div className="mt-16">
          {step === 1 && <Step1Product state={state} update={update} onNext={() => setStep(2)} />}
          {step === 2 && <Step2Upload state={state} update={update} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <Step3Lead state={state} update={update} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
          {step === 4 && <Step4Summary state={state} update={update} onBack={() => setStep(3)} onConfirmed={() => {}} />}
        </div>
      </div>
    </main>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-cherry-light border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OrderContent />
    </Suspense>
  );
}
