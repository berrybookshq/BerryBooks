import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — BerryBooks",
  description: "Terms of service and refund policy for BerryBooks customized photobooks.",
};

export default function TermsPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#0a0a0f]">
      <div className="max-w-4xl mx-auto px-5 py-16">
        <h1 className="font-serif text-5xl md:text-6xl font-bold mb-8">
          Terms & <span className="grad-text italic">Conditions</span>
        </h1>
        
        <div className="glass rounded-3xl p-8 md:p-12 space-y-10 text-white/70 leading-relaxed">
          
          <section>
            <h2 className="text-white text-2xl font-bold mb-4">1. Product Customization</h2>
            <p>
              BerryBooks specializes in personalized photobooks. Each product is manufactured specifically according to the photos and options selected by the customer. By placing an order, you acknowledge that you are responsible for the quality, resolution, and ownership of the images uploaded to our platform.
            </p>
          </section>

          <section className="bg-berry-light/5 border border-berry-light/20 p-6 rounded-2xl">
            <h2 className="text-berry-light text-2xl font-bold mb-4">2. No Return & No Refund Policy</h2>
            <p className="text-white/90">
              Due to the highly customized nature of our products, BerryBooks does <strong>not</strong> offer any returns or refunds once an order has been submitted for production. Each book is unique to you and cannot be resold.
            </p>
            <p className="mt-4">
              <strong>Exceptions:</strong> We only provide replacements if the product arrives with a manufacturing defect or is damaged during transit. In such cases, you must notify us via WhatsApp or Email within 24 hours of delivery with photographic evidence.
            </p>
          </section>

          <section>
            <h2 className="text-white text-2xl font-bold mb-4">3. Order Processing & Dispatch</h2>
            <p>
              Orders are typically dispatched within 48-72 hours of final layout confirmation. While we strive to meet these timelines, BerryBooks is not liable for delays caused by third-party courier services or unforeseen circumstances (force majeure).
            </p>
          </section>

          <section>
            <h2 className="text-white text-2xl font-bold mb-4">4. Intellectual Property</h2>
            <p>
              You retain all rights to the photos you upload. However, by using our service, you grant BerryBooks a non-exclusive license to process and print these images for the sole purpose of fulfilling your order. We will never use your personal photos for marketing or public display without your explicit written consent.
            </p>
          </section>

          <section>
            <h2 className="text-white text-2xl font-bold mb-4">5. Pricing & Payments</h2>
            <p>
              All prices listed on the website are inclusive of GST and shipping unless stated otherwise. BerryBooks reserves the right to change pricing without prior notice. Production will only begin after full payment has been confirmed via our shared payment links.
            </p>
          </section>

          <section>
            <h2 className="text-white text-2xl font-bold mb-4">6. Jurisdiction</h2>
            <p>
              These terms are governed by the laws of India. Any disputes arising from the use of this service shall be subject to the exclusive jurisdiction of the courts located in Ahmedabad, Gujarat.
            </p>
          </section>

          <div className="pt-10 border-t border-white/10 text-sm text-white/30">
            Last Updated: April 2026 · BerryBooks India
          </div>
        </div>
      </div>
    </div>
  );
}
