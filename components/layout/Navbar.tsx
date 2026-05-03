"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import { WHATSAPP_URL } from "@/lib/constants";
import AuthModal from "@/components/auth/AuthModal";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/product", label: "Products" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const pathname = usePathname();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/admin") return null;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/80 backdrop-blur-xl border-b border-white/10 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Logo placeholder removed - will add new logo here */}
            <span className="font-serif text-xl font-bold text-white tracking-wide">
              Berry<span className="text-[#e63946]">Books</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === href
                    ? "text-cherry-light"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* CTA & User */}
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setAuthOpen(true)}
              className="text-white/60 hover:text-cherry-light transition-colors"
              aria-label="My Account"
            >
              <User size={22} />
            </button>
            
            <div className="flex items-center gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp font-semibold text-sm px-5 py-2.5 rounded-full"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
              <Link
                href="/order"
                className="gold-shimmer text-white font-bold text-sm px-6 py-2.5 rounded-full shadow-xl hover:shadow-cherry/40 transition-all duration-300"
              >
                Create
              </Link>
            </div>
          </div>

          {/* Mobile Right Icons */}
          <div className="md:hidden flex items-center gap-1">
            <button 
              onClick={() => setAuthOpen(true)}
              className="text-white/60 p-2"
              aria-label="My Account"
            >
              <User size={22} />
            </button>
            <button
              className="text-white p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-black/95 backdrop-blur-xl border-t border-white/10 px-5 py-6 flex flex-col gap-4">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`text-base font-medium py-2 border-b border-white/5 ${
                  pathname === href ? "text-cherry-light" : "text-white/80"
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/order"
              onClick={() => setMenuOpen(false)}
              className="mt-2 text-center gold-shimmer text-white font-semibold px-5 py-3 rounded-full"
            >
              Create My Book
            </Link>
          </div>
        </div>

        {/* Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cherry to-cherry-light origin-left z-50"
          style={{ scaleX }}
        />
      </header>

      {/* Auth & Account Dashboard */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
