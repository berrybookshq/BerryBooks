"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import StepIndicator from "@/components/order/StepIndicator";
import Step1Product from "@/components/order/Step1Product";
import Step2Upload from "@/components/order/Step2Upload";
import Step3Lead from "@/components/order/Step3Lead";
import Step4Summary from "@/components/order/Step4Summary";
import { ChevronLeft, LogIn, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

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

  const { user, loading: authLoading, signInWithGoogle } = useAuth();

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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-cherry-light border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#0c0c0c] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#111] border border-white/5 rounded-[3rem] p-12 text-center space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cherry-light/5 blur-[50px] -mr-16 -mt-16" />
          
          <div className="w-20 h-20 bg-cherry-light/10 border border-cherry-light/20 rounded-full flex items-center justify-center mx-auto text-cherry-light">
            <ShieldCheck size={40} />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-serif font-black tracking-tight">Identity <span className="text-cherry-light">Required</span></h1>
            <p className="text-white/40 text-sm leading-relaxed">
              To ensure your memories are stored securely in your private cloud, please sign in before starting your photobook.
            </p>
          </div>

          <button 
            onClick={signInWithGoogle}
            className="w-full h-16 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-white/90 transition-all shadow-xl active:scale-95"
          >
            <LogIn size={18} />
            Sign in with Google
          </button>

          <div className="pt-4 border-t border-white/5">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">BerryBooks Secure Protocol</p>
          </div>
        </div>
      </main>
    );
  }

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
