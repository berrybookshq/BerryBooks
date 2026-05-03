"use client";
import { useState, useRef, useEffect } from "react";

export default function BeforeAfter() {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Initial slight hint movement
  useEffect(() => {
    const timer = setTimeout(() => {
      setPosition(45);
      setTimeout(() => setPosition(55), 300);
      setTimeout(() => setPosition(50), 600);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleMove = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    let clientX;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pos);
  };

  useEffect(() => {
    const stopDragging = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", stopDragging);
      window.addEventListener("touchmove", handleMove, { passive: false });
      window.addEventListener("touchend", stopDragging);
    }
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", stopDragging);
    };
  }, [isDragging]);

  return (
    <section className="py-16 px-5 bg-[#0c0c0c] relative">
      <div className="max-w-5xl mx-auto text-center mb-16 fade-up">
        <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">
          From Chaos to <span className="grad-text italic">Clarity</span>
        </h2>
        <p className="text-white/60 text-lg">
          Slide to see how your digital clutter transforms into a beautiful narrative.
        </p>
      </div>

      <div className="max-w-4xl mx-auto relative group">
        {/* Persistent Labels above the slider */}
        <div className="flex justify-between w-full max-w-xs md:max-w-md mx-auto mb-4 px-3 text-xs md:text-sm font-semibold tracking-wider uppercase">
           <span className="text-white/50 text-center w-1/2">Your Gallery</span>
           <span className="text-cherry-light text-center w-1/2">Your Photobook</span>
        </div>

        <div 
          ref={containerRef}
          className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-3xl overflow-hidden glass touch-none border border-white/5 cursor-col-resize"
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
        >
          {/* Right Image (After) - Photobook */}
          <div className="absolute inset-0 w-full h-full bg-[#111]">
            <img 
              src="/after.jpeg" 
              alt="Beautiful Photobook" 
              className="w-full h-full object-contain object-center p-2"
              draggable="false"
            />
          </div>

          {/* Left Image (Before) - Messy Gallery */}
          <div 
            className="absolute inset-0 w-full h-full z-10 pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            {/* A dark overlay matching the padding of the Right Image so they fit in the same bounding box */}
            <img 
               src="/gallery.jpeg"
               alt="Phone Gallery"
               className="w-full h-full object-contain object-center p-2 filter saturate-50 brightness-75 opacity-90"
               draggable="false"
            />

            {/* Slider Divider Line */}
            <div className="absolute top-0 bottom-0 right-0 w-1.5 bg-gradient-to-b from-cherry to-cherry-light shadow-[0_0_20px_rgba(230,57,70,0.6)]">
               {/* Slider Handle */}
               <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl pointer-events-auto cursor-col-resize hover:scale-110 transition-transform hidden sm:flex border-4 border-cherry-light">
                 <svg className="w-6 h-6 text-cherry" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 9h8M8 15h8" />
                 </svg>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
