"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  Loader2, 
  Trash2, 
  Plus, 
  ShieldCheck, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  RefreshCw
} from "lucide-react";
import { uploadToCloudinary } from "@/services/cloudinaryService";

interface CloudPhoto {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
}

export default function CloudCurationPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  
  const [photos, setPhotos] = useState<CloudPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ t: string; type: 's' | 'e' } | null>(null);

  const fetchPhotos = async () => {
    try {
      // First check if the session is still active
      const orderRes = await fetch(`/api/orders/${sessionId}`);
      const orderData = await orderRes.json();
      
      if (orderData.photos_deleted) {
        setIsDeleted(true);
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/photos/${sessionId}`);
      const data = await res.json();
      if (data.photos) {
        setPhotos(data.photos);
      }
    } catch (err) {
      console.error("Fetch photos failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) fetchPhotos();
  }, [sessionId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setMsg(null);

    try {
      const uploadPromises = files.map(file => uploadToCloudinary(file, sessionId));
      const results = await Promise.all(uploadPromises);
      
      // Optimistic Update: Add new photos to the grid immediately
      const newPhotos: CloudPhoto[] = results.map((url, i) => ({
        public_id: `temp-${Date.now()}-${i}`,
        secure_url: url,
        width: 1000,
        height: 1000
      }));
      
      setPhotos(prev => [...newPhotos, ...prev]);
      setMsg({ t: `Successfully added ${files.length} new photos.`, type: 's' });
      
      // Refresh from cloud after a few seconds to get official IDs
      setTimeout(() => fetchPhotos(), 3000);

    } catch (err) {
      setMsg({ t: "Failed to upload some photos. Please try again.", type: 'e' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (publicId: string) => {
    if (!window.confirm("Remove this photo from the cloud?")) return;
    
    setDeletingId(publicId);
    try {
      const res = await fetch("/api/photos/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId })
      });
      if (res.ok) {
        setPhotos(prev => prev.filter(p => p.public_id !== publicId));
      }
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
        <Loader2 className="animate-spin text-cherry-light" size={48} />
      </div>
    );
  }

  if (isDeleted) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#111] border border-red-500/20 rounded-[3rem] p-12 text-center space-y-8 shadow-2xl shadow-red-500/10">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
            <ShieldCheck size={48} />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-serif font-black tracking-tight text-white">Privacy Protocol <span className="text-red-500">Active</span></h1>
            <p className="text-white/40 text-sm leading-relaxed">
              This photobook session has been completed and all associated assets have been **permanently wiped** from our cloud servers. 
              <br/><br/>
              To protect your privacy, this link is now inactive and cannot be restored.
            </p>
          </div>
          <div className="pt-8 border-t border-white/5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">BerryBooks Data Privacy Verified</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cherry-light/10 border border-cherry-light/20 rounded-full text-cherry-light text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck size={14} /> Cloud Curation Center
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tighter">Manage Your <span className="grad-text italic">Artifacts</span></h1>
            <p className="text-white/40 font-medium max-w-xl">
              This is your private, secure cloud workspace. You can view, add, or remove photos here. No files are stored locally; everything stays encrypted in the cloud.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
             <button 
               onClick={() => { setLoading(true); fetchPhotos(); }}
               disabled={loading}
               className="h-16 px-8 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all border border-white/5 flex items-center justify-center gap-3"
             >
               <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
               Sync Cloud
             </button>

             <input 
               type="file" 
               id="add-more" 
               multiple 
               hidden 
               onChange={handleFileUpload} 
               accept="image/*"
             />
             <button 
               onClick={() => document.getElementById('add-more')?.click()}
               disabled={uploading}
               className="gold-shimmer text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50"
             >
               {uploading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
               {uploading ? "Adding to Cloud..." : "Add More Photos"}
             </button>
          </div>
        </div>

        {msg && (
           <div className={`mb-12 p-6 rounded-[2rem] border flex items-center gap-4 animate-in fade-in slide-in-from-top-4 ${msg.type === 's' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
              {msg.type === 's' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
              <p className="text-sm font-bold uppercase tracking-wide">{msg.t}</p>
           </div>
        )}

        {/* Photos Grid */}
        {photos.length === 0 ? (
          <div className="bg-[#111] border border-white/5 rounded-[3rem] p-20 text-center space-y-6">
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/20">
                <ImageIcon size={40} />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-black">No artifacts found.</h3>
                <p className="text-white/30 text-sm">Start by adding some photos to your cloud curation center.</p>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {photos.map((photo) => (
              <div key={photo.public_id} className="group relative aspect-square rounded-[2rem] overflow-hidden bg-[#111] border border-white/5 transition-all hover:border-cherry-light/30 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cherry-light/10">
                 <img 
                   src={photo.secure_url} 
                   alt="Artifact" 
                   className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500"
                 />
                 
                 {/* Delete Overlay */}
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                    <button 
                      onClick={() => handleDelete(photo.public_id)}
                      disabled={deletingId === photo.public_id}
                      className="w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl flex items-center justify-center transition-all shadow-xl disabled:opacity-50 active:scale-90"
                    >
                      {deletingId === photo.public_id ? <Loader2 className="animate-spin" size={24} /> : <Trash2 size={24} />}
                    </button>
                 </div>

                 {/* Corner Badge */}
                 <div className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 opacity-60 group-hover:opacity-100 transition-opacity">
                    <LayoutGrid size={12} className="text-white/60" />
                 </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="text-center md:text-left">
                 <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">Total Artifacts</p>
                 <p className="text-2xl font-black tracking-tighter">{photos.length} Photos Stored</p>
              </div>
              <div className="w-px h-12 bg-white/5" />
              <div className="text-center md:text-left">
                 <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">Session Protocol</p>
                 <p className="text-xs font-bold text-cherry-light uppercase tracking-tight font-mono">{sessionId.slice(0, 12)}...</p>
              </div>
           </div>

           <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Cloud Security Verified • BerryBooks Artifact Engine</p>
        </div>

      </div>
    </div>
  );
}
