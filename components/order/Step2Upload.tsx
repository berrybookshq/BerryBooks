"use client";
import { useState, useEffect, useCallback } from "react";
import { PRODUCTS } from "@/lib/constants";
import type { OrderState } from "@/app/order/page";
import { UploadCloud, X, AlertCircle, Loader2 } from "lucide-react";
import { uploadToCloudinary } from "@/services/cloudinaryService";
import { motion } from "framer-motion";

interface Props {
  state: OrderState;
  update: (patch: Partial<OrderState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Upload({ state, update, onNext, onBack }: Props) {
  const currentProduct = PRODUCTS.find((p) => p.id === state.productId);
  const currentVariant = currentProduct?.variants.find((v) => v.pages === state.variantPages);

  const hardStop = currentVariant?.internalMax || 100;
  const recommendedRange = `${currentVariant?.minPhotos}–${currentVariant?.maxPhotos}`;

  const [uploadingIndices, setUploadingIndices] = useState<Set<number>>(new Set());

  const handleSkip = () => {
    update({ skippedUpload: true });
    onNext();
  };

  const processFiles = async (newFiles: File[]) => {
    if (newFiles.length === 0) return;
    
    const spaceLeft = hardStop - state.photos.length;
    const allowedFiles = newFiles.slice(0, spaceLeft);
    if (allowedFiles.length === 0) return;

    const startIndex = state.photos.length;
    
    // Optimistically update UI
    update({ 
      photos: [...state.photos, ...allowedFiles], 
      skippedUpload: false 
    });

    const newIndices = allowedFiles.map((_, i) => startIndex + i);
    setUploadingIndices(prev => new Set([...prev, ...newIndices]));

    const urls = [...(state.photoUrls || [])];
    
    await Promise.all(
      allowedFiles.map(async (file, idx) => {
        const actualIndex = startIndex + idx;
        try {
          const url = await uploadToCloudinary(file, state.uploadSessionId);
          urls[actualIndex] = url;
        } catch (e) {
          console.error("Upload failed for", file.name, e);
          // Fallback to local URL if upload fails so user can still preview
          urls[actualIndex] = URL.createObjectURL(file);
        } finally {
          setUploadingIndices(prev => {
            const next = new Set(prev);
            next.delete(actualIndex);
            return next;
          });
        }
      })
    );

    update({ photoUrls: urls });
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      processFiles(files);
    },
    [state.photos, update, hardStop, state.photoUrls]
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = state.photos.filter((_, i) => i !== index);
    const newUrls = (state.photoUrls || []).filter((_, i) => i !== index);
    update({ photos: newPhotos, photoUrls: newUrls });
  };

  // Preview URLs
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    // Prefer the uploaded URL (or its fallback), otherwise create a local one immediately
    const urls = state.photos.map((file, i) => {
      return (state.photoUrls && state.photoUrls[i]) || URL.createObjectURL(file);
    });
    setPreviews(urls);
    
    // Cleanup local object URLs to avoid memory leaks
    return () => {
      urls.forEach(url => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [state.photos, state.photoUrls]);


  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="font-serif text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Upload Memories</h2>
        <p className="text-white/40 text-sm max-w-sm mx-auto font-medium">
          You chose <span className="text-white">{currentProduct?.size} {currentProduct?.name}</span> with <span className="text-white">{state.variantPages} Pages</span>.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="glass-cherry border border-cherry-light/30 text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-[0_0_20px_rgba(255,34,80,0.15)] animate-pulse">
          Recommended Photos: {recommendedRange}
        </div>
      </div>

      {/* Upload Zone */}
      <div
        className="w-full h-56 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center hover:bg-white/[0.03] hover:border-cherry-light/30 transition-all cursor-pointer group relative overflow-hidden"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cherry-light/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <UploadCloud className="w-12 h-12 text-white/20 mb-4 group-hover:text-cherry-light/80 transition-colors" />
        <p className="text-white/80 font-black uppercase tracking-widest text-xs mb-2">Tap to Select or Drag</p>
        <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">JPG, PNG, HEIC formats</p>
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />
      </div>

      {/* Progress & Hints */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-[10px] px-2 font-black uppercase tracking-widest">
          <span className={`${state.photos.length >= hardStop ? 'text-cherry-light underline decoration-2 underline-offset-4' : 'text-white/40'}`}>
            {state.photos.length} Uploaded
          </span>
          <button 
            onClick={() => update({ photos: [] })} 
            className="text-white/20 hover:text-white transition-colors"
            style={{ display: state.photos.length > 0 ? 'block' : 'none' }}
          >
            Reset All
          </button>
        </div>

        {state.photos.length >= hardStop && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-start gap-4 bg-cherry-light p-6 rounded-[2rem] shadow-xl shadow-cherry-light/20 border-t border-white/20"
          >
            <div className="shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <AlertCircle className="text-white w-4 h-4" />
            </div>
            <p className="text-white text-xs font-black leading-relaxed uppercase tracking-tight">
              You’ve reached the upload limit for this photobook size. 
              <span className="block opacity-60 font-medium mt-1 normal-case tracking-normal">Please remove some photos or contact us for a custom book.</span>
            </p>
          </motion.div>
        )}
      </div>

      {state.photos.length > 0 && state.photos.length < currentVariant!.minPhotos && (
        <div className="flex items-start gap-3 bg-[#111] border border-white/10 rounded-xl p-3 mb-6">
          <AlertCircle className="text-cherry-light/60 w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-white/70 text-xs">
            Tip: For the best {state.variantPages}-page layout, we recommend uploading at least {currentVariant!.minPhotos} photos. 
            Don&apos;t worry, you can always send more to our team on WhatsApp later!
          </p>
        </div>
      )}

      {/* Preview Grid */}
      {state.photos.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {previews.map((src, i) => (
            <div key={i} className="relative aspect-square rounded-[1.25rem] overflow-hidden group bg-black/40 border border-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="Upload preview" className={`w-full h-full object-cover transition-all ${uploadingIndices.has(i) ? 'opacity-40 grayscale blur-[2px]' : ''}`} />
              
              {uploadingIndices.has(i) && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Loader2 className="animate-spin text-white" size={24} />
                </div>
              )}

              <button
                onClick={(e) => { e.stopPropagation(); removePhoto(i); }}
                disabled={uploadingIndices.has(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-cherry-light rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md disabled:opacity-0"
              >
                <X size={12} className="text-white" />
              </button>
            </div>
          ))}
          {/* Add more tile */}
          {state.photos.length < hardStop && (
            <div 
              onClick={() => document.getElementById("file-upload")?.click()}
              className="relative aspect-square rounded-[1.25rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-white/10 hover:text-white/30 hover:border-white/20 hover:bg-white/[0.02] transition-all cursor-pointer"
            >
              <UploadCloud size={20} className="mb-1" />
              <span className="text-[9px] font-black uppercase tracking-widest">Add more</span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4 mt-10 max-w-sm mx-auto">
        <button
          onClick={onNext}
          disabled={state.photos.length === 0 || uploadingIndices.size > 0}
          className="h-16 gold-shimmer text-white font-bold text-xs uppercase tracking-widest px-8 rounded-full shadow-xl hover:shadow-cherry/40 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed w-full flex items-center justify-center gap-2"
        >
          {uploadingIndices.size > 0 ? (
            <><Loader2 className="animate-spin" size={18} /> Uploading...</>
          ) : (
            "Continue"
          )}
        </button>
        
        <button
          onClick={handleSkip}
          className="w-full h-16 bg-white/[0.03] hover:bg-white/[0.06] text-white/40 font-bold uppercase tracking-widest text-[10px] rounded-full border border-white/5 transition-all"
        >
          Skip & Send via WhatsApp Later
        </button>
      </div>
    </div>
  );
}
