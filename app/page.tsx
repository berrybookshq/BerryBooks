import HeroSection from "@/components/home/HeroSection";
import QuoteSection from "@/components/home/QuoteSection";
import BeforeAfter from "@/components/home/BeforeAfter";
import StorySection from "@/components/home/StorySection";
import ProductCards from "@/components/home/ProductCards";
import HowItWorks from "@/components/home/HowItWorks";
import FAQSection from "@/components/home/FAQSection";
import FinalCTA from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <QuoteSection />
      <BeforeAfter />
      <StorySection />
      <ProductCards />
      <HowItWorks />
      <FAQSection />
      <FinalCTA />
    </>
  );
}
