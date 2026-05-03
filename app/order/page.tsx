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
        <div className="max-w-md w-full bg-[#111] border border-white/5 rounded-[3rem] p-12 text-center space-y-10 shadow-2xl">
          <div className="space-y-4">
             <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <LogIn size={32} className="text-white/60" />
             </div>
            <h1 className="text-3xl font-serif font-black tracking-tight">Sign in to <span className="grad-text">Continue</span></h1>
            <p className="text-white/40 text-sm font-medium">
              Please sign in to your account to start creating your photobook.
            </p>
          </div>

          <button 
            onClick={signInWithGoogle}
            className="w-full h-16 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-4 hover:bg-white/90 transition-all shadow-xl active:scale-95"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/10">Secure Authentication via Supabase</p>
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
