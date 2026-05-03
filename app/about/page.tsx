import type { Metadata } from "next";
import Link from "next/link";
import { WHATSAPP_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us — BerryBooks",
  description: "We're a team of passionate travellers building the best photobook experience in India.",
};

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#0a0a0f]">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-5 text-center py-16">
        <div className="inline-flex items-center gap-2 bg-cherry-light/10 border border-cherry-light/20 text-cherry-light text-xs font-medium px-4 py-1.5 rounded-full mb-6">
          Our Story
        </div>
        <h1 className="font-serif text-5xl md:text-6xl font-bold mb-5">
          Built by <span className="grad-text italic">Travellers,</span>
          <br />
          for Travellers
        </h1>
        <p className="text-white/60 text-xl max-w-2xl mx-auto leading-relaxed">
          We got tired of watching our most beautiful photos just…sit in a camera roll.
          So we built BerryBooks — the fastest, most beautiful way to print your travels.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-5">
        {/* Mission */}
        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 md:p-16 mb-10 relative overflow-hidden border border-white/10">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-cherry-light/5 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-3xl">
            <div className="text-cherry-light text-xs uppercase tracking-widest mb-4 font-medium">Our Mission</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              Every journey deserves to be{" "}
              <span className="grad-text italic">seen, felt, and touched.</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-6">
              In a world drowning in digital noise, we believe physical photographs create the deepest emotional connections.
              A printed photobook on your shelf is worth a thousand Instagram posts.
            </p>
            <p className="text-white/60 text-lg leading-relaxed">
              We combine premium print technology with the simplest ordering experience in India — because preserving
              memories shouldn&apos;t be complicated.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            {
              icon: "🏔️",
              title: "Born from Wanderlust",
              desc: "Every feature we build comes from our own travel experiences and the frustration of memories left unpublished.",
            },
            {
              icon: "🎨",
              title: "Obsessed with Quality",
              desc: "We use only archival-grade paper, premium inks, and third-party quality audits on every batch we produce.",
            },
            {
              icon: "💛",
              title: "Customer-First Always",
              desc: "Not happy with your book? We reprint. No questions, no hassle. Your satisfaction is our only metric.",
            },
          ].map((v) => (
            <div key={v.title} className="bg-white/[0.03] backdrop-blur-md rounded-2xl p-7 border border-white/5 hover:border-cherry-light/20 transition-colors">
              <div className="text-4xl mb-4">{v.icon}</div>
              <h3 className="font-serif text-xl font-bold mb-3">{v.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        </div>


        {/* CTA */}
        <div className="text-center">
          <Link href="/order" className="inline-block gold-shimmer text-white font-bold px-10 py-4 rounded-full hover:scale-105 transition-transform text-lg mr-4">
            Create My Book
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp font-semibold px-8 py-3.5 rounded-full text-lg"
          >
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Chat on WhatsApp
          </a>
        </div>
    </div>
  );
}
