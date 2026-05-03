"use client";
import { useState } from "react";
import { Trash2, Loader2, CheckCircle2, ShieldAlert } from "lucide-react";

export default function CleanupTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{success: boolean, msg: string} | null>(null);

  const handleDelete = async () => {
    if (!url) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/delete-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      
      if (res.ok) {
        setResult({ success: true, msg: data.message });
        setUrl("");
      } else {
        setResult({ success: false, msg: data.error });
      }
    } catch (err: any) {
      setResult({ success: false, msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center p-5">
       <div className="max-w-xl w-full bg-[#111] border border-red-500/20 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] -mr-16 -mt-16 pointer-events-none" />
          
          <div className="flex items-center gap-4 mb-6 text-red-500 relative z-10">
             <ShieldAlert size={32} />
             <h1 className="text-2xl font-black uppercase tracking-widest">Privacy Cleanup</h1>
          </div>
          <p className="text-white/40 mb-8 text-sm font-medium leading-relaxed relative z-10">
            Paste the secure Cloudinary ZIP URL from the orders database below to permanently wipe all associated customer photos from the cloud server. <strong className="text-red-500/80">This action cannot be undone.</strong>
          </p>

          <div className="space-y-6 relative z-10">
             <textarea 
               value={url}
               onChange={(e) => setUrl(e.target.value)}
               placeholder="Paste ZIP URL or Order Tag here..."
               className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-sm focus:outline-none focus:border-red-500/50 min-h-[120px] break-all font-mono transition-all placeholder:text-white/20"
             />

             <button
               onClick={handleDelete}
               disabled={!url || loading}
               className="w-full bg-red-600/90 hover:bg-red-500 disabled:opacity-50 disabled:hover:bg-red-600/90 text-white font-black uppercase tracking-widest text-sm py-5 rounded-2xl transition-all flex justify-center items-center gap-3 shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]"
             >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                {loading ? "Deleting Securely..." : "Permanently Delete Photos"}
             </button>

             {result && (
                <div className={`p-4 rounded-xl border flex items-start gap-3 text-sm font-bold animate-in fade-in slide-in-from-bottom-2 ${result.success ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-red-500/10 border-red-500/20 text-red-500"}`}>
                   <div className="mt-0.5">
                     {result.success ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
                   </div>
                   <p className="leading-relaxed">{result.msg}</p>
                </div>
             )}
          </div>
       </div>
     </div>
  );
}
