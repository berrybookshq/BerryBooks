"use client";
import { useState, useRef } from "react";

export default function ProductSlider({ productId, className }: { productId: string, className?: string }) {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const images = [
    `/products/${productId}/1.jpeg`,
    `/products/${productId}/2.jpeg`,
    `/products/${productId}/3.jpeg`,
    `/products/${productId}/4.jpeg`
  ];

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const width = scrollRef.current.clientWidth;
    setIndex(Math.round(scrollLeft / width));
  };

  return (
    <div className={`relative group flex flex-col items-center justify-center ${className || ""}`}>
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((src, i) => (
          <div key={i} className="w-full h-full shrink-0 snap-center flex items-center justify-center p-0">
            <img src={src} alt={`Product ${i+1}`} className="w-full h-full object-contain drop-shadow-2xl" draggable="false" />
          </div>
        ))}
      </div>
      
      {/* Navigation Dots */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, i) => (
          <div 
            key={i}
            role="button"
            tabIndex={0}
            aria-label={`Go to slide ${i+1}`}
            className={`w-1.5 h-1.5 rounded-full transition-colors cursor-pointer ${index === i ? "bg-white" : "bg-white/30"}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if (scrollRef.current) {
                  scrollRef.current.scrollTo({ left: i * scrollRef.current.clientWidth, behavior: 'smooth' })
                }
              }
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (scrollRef.current) {
                scrollRef.current.scrollTo({ left: i * scrollRef.current.clientWidth, behavior: 'smooth' })
              }
            }}
          />
        ))}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `div::-webkit-scrollbar { display: none; }`}} />
    </div>
  );
}
