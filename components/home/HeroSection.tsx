"use client";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { WHATSAPP_URL } from "@/lib/constants";
import Magnetic from "@/components/ui/Magnetic";

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.play().catch(() => {});
    const handleEnded = () => setVideoEnded(true);
    vid.addEventListener("ended", handleEnded);
    return () => vid.removeEventListener("ended", handleEnded);
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-center justify-center">
      {/* ── Video background ─────────────────────── */}
      <div className={`absolute inset-0 ${videoEnded ? "breathe" : ""}`}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── Gradient overlays ────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10" />
      
      {/* Seamless bottom fade to eliminate hard cuts */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0c0c0c] to-transparent z-15" />

      {/* ── Content ──────────────────────────────── */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-4 fade-up -translate-y-10">
          Your Journey,{" "}
          <span className="block grad-text italic">Beautifully Preserved</span>
        </h1>

        <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-8 fade-up delay-200">
          Turn your travel photos into stunning premium photobooks. Crafted on
          archival paper, delivered to your door in days.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center fade-up delay-300">
          <Magnetic>
            <Link
              href="/order"
              className="gold-shimmer text-white font-bold text-base px-8 py-4 rounded-full shadow-xl hover:shadow-cherry/40 transition-all duration-300 min-w-[200px]"
            >
              Create My Book
            </Link>
          </Magnetic>

          <Magnetic>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp font-semibold text-base px-8 py-4 rounded-full min-w-[200px]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat with Us
            </a>
          </Magnetic>
        </div>

      </div>

      {/* ── Scroll indicator ─────────────────────── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/40">
        <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
