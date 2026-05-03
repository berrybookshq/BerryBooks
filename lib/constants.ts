// ─────────────────────────────────────────────
// Core product & pricing constants
// ─────────────────────────────────────────────

export const WHATSAPP_NUMBER = "917880270373";
export const WHATSAPP_MESSAGE = "Hi, I want to create a BerryBooks travel photobook.";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export interface ProductVariant {
  pages: number;
  price: number;
  label: string;
  minPhotos: number;
  maxPhotos: number;
  internalMax: number;
  isPopular?: boolean;
  isBestseller?: boolean;
}

export interface Product {
  id: string;
  name: string;
  size: string;
  dimensions: string;
  description: string;
  icon: string;
  accent: string;
  variants: ProductVariant[];
}

export const PRODUCTS: Product[] = [
  {
    id: "a4",
    name: "A4 Photobook",
    size: "A4",
    dimensions: "210 x 297 mm",
    description: "Our most premium flagship offering. Expansive pages that deliver a breathtaking coffee-table experience.",
    icon: "📚",
    accent: "from-cherry to-cherry-light",
    variants: [
      { pages: 12, price: 1299, label: "Starter", minPhotos: 20, maxPhotos: 24, internalMax: 29 },
      { pages: 18, price: 1549, label: "Classic", minPhotos: 32, maxPhotos: 36, internalMax: 41 },
      { pages: 24, price: 1799, label: "Bestseller", minPhotos: 44, maxPhotos: 48, internalMax: 53, isBestseller: true },
      { pages: 30, price: 2049, label: "Premium", minPhotos: 56, maxPhotos: 60, internalMax: 65 },
      { pages: 36, price: 2299, label: "Luxury", minPhotos: 68, maxPhotos: 72, internalMax: 77 },
      { pages: 42, price: 2549, label: "Elite", minPhotos: 80, maxPhotos: 84, internalMax: 89 },
      { pages: 48, price: 2799, label: "Grand", minPhotos: 92, maxPhotos: 96, internalMax: 101 },
    ],
  },
  {
    id: "a5",
    name: "A5 Photobook",
    size: "A5",
    dimensions: "148 x 210 mm",
    description: "A compact, travel-friendly companion. Handy and perfect for keeping everyday moments close.",
    icon: "📖",
    accent: "from-cherry-light to-red-500",
    variants: [
      { pages: 12, price: 799,  label: "Starter", minPhotos: 15, maxPhotos: 18, internalMax: 23 },
      { pages: 18, price: 949,  label: "Classic", minPhotos: 24, maxPhotos: 27, internalMax: 32 },
      { pages: 24, price: 1099,  label: "Most Popular", minPhotos: 33, maxPhotos: 36, internalMax: 41, isPopular: true },
      { pages: 30, price: 1249, label: "Premium", minPhotos: 42, maxPhotos: 45, internalMax: 50 },
      { pages: 36, price: 1399, label: "Luxury", minPhotos: 51, maxPhotos: 54, internalMax: 59 },
      { pages: 42, price: 1549, label: "Elite", minPhotos: 60, maxPhotos: 63, internalMax: 68 },
      { pages: 48, price: 1699, label: "Grand", minPhotos: 69, maxPhotos: 72, internalMax: 77 },
    ],
  },
];

export const TESTIMONIALS = [
  {
    name: "Priya S.",
    city: "Mumbai",
    rating: 5,
    text: "The quality blew me away. Every page felt like a magazine spread. I have ordered three already!",
    trip: "Ladakh, 2024",
    avatar: "PS",
  },
  {
    name: "Arjun M.",
    city: "Bangalore",
    rating: 5,
    text: "Gifted this to my parents for their anniversary. They cried happy tears. Worth every rupee.",
    trip: "Europe Trip",
    avatar: "AM",
  },
  {
    name: "Sneha K.",
    city: "Delhi",
    rating: 5,
    text: "So easy to order and the delivery was super fast. The print quality is absolutely premium.",
    trip: "Goa + Kerala",
    avatar: "SK",
  },
  {
    name: "Rahul T.",
    city: "Pune",
    rating: 5,
    text: "Best way to preserve memories. My Bali trip lives on this beautiful A4 book on my coffee table.",
    trip: "Bali, Indonesia",
    avatar: "RT",
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Choose Your Book",
    desc: "Pick A4 or A5, choose your page count — from 12 up to 48 pages.",
    icon: "📐",
  },
  {
    step: "02",
    title: "Upload Your Photos",
    desc: "Upload photos according to your selected page limits, or skip and send them via WhatsApp.",
    icon: "📸",
  },
  {
    step: "03",
    title: "Checkout via WhatsApp",
    desc: "Complete your order seamlessly and chat with our designers directly.",
    icon: "💬",
  },
  {
    step: "04",
    title: "We Print & Dispatch",
    desc: "Your book is printed on 170 GSM premium paper and dispatched within 48-72 hours.",
    icon: "🚀",
  },
];
