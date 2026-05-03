import type { Metadata } from "next";
import { Outfit, Playfair_Display, Yatra_One } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { AuthProvider } from "@/hooks/useAuth";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"],
});

const yatra = Yatra_One({
  weight: "400",
  subsets: ["devanagari"],
  variable: "--font-hindi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BerryBooks — Turn Your Memories Into Premium Printed Books",
  description:
    "Create stunning printed photobooks from your travel memories. Premium quality, shipped within 48-72 hours across India.",
  keywords:
    "travel photobook, photo book printing, custom photobook India, travel memories, premium photobook, berrybooks",
  openGraph: {
    title: "BerryBooks — Premium Printed Memories",
    description:
      "Turn your travel photos into beautiful hardcover photobooks. Printed on 170 GSM glossy art paper.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable} ${yatra.variable}`}>
      <body
        className="antialiased"
        style={{
          backgroundColor: "#0a0a0f",
          color: "#ffffff",
          fontFamily: "var(--font-outfit), sans-serif",
        }}
      >
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}
