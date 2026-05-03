"use client";
import { useState } from "react";
import { WHATSAPP_URL } from "@/lib/constants";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with Firebase/email service
    setSubmitted(true);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#0a0a0f]">
      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-5">
            Let&apos;s <span className="grad-text italic">Talk</span>
          </h1>
          <p className="text-white/60 text-xl max-w-xl mx-auto">
            Have a question, a bulk order, or just want to say hi? We&apos;re here.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="glass rounded-2xl p-7">
              <h3 className="font-serif text-xl font-bold mb-6">Contact Details</h3>
              <div className="space-y-5">
                {[
                  { icon: <Phone size={18} />, label: "WhatsApp / Phone", value: "+91 78802 70373", href: WHATSAPP_URL },
                  { icon: <Mail size={18} />, label: "Email", value: "hello@berrybooks.in", href: "mailto:hello@berrybooks.in" },
                  { icon: <MapPin size={18} />, label: "Location", value: "India (Ships Pan India)", href: "#" },
                ].map((c) => (
                  <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-cherry-light/10 border border-cherry-light/20 flex items-center justify-center text-cherry-light shrink-0 group-hover:bg-cherry-light/20 transition-colors">
                      {c.icon}
                    </div>
                    <div>
                      <div className="text-white/40 text-xs mb-0.5">{c.label}</div>
                      <div className="text-white font-medium">{c.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA card */}
            <div className="glass rounded-2xl p-7 border border-green-500/20">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle size={24} className="text-green-400" />
                <h3 className="font-semibold text-white text-lg">Fastest Response</h3>
              </div>
              <p className="text-white/50 text-sm mb-5">
                We typically respond within 30 minutes on WhatsApp — it&apos;s the fastest way to reach us.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5C] text-white font-semibold px-6 py-3 rounded-full transition-all hover:scale-105 w-fit"
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>

            {/* Hours */}
            <div className="glass rounded-2xl p-7">
              <h3 className="font-semibold text-white mb-4">Support Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-white/50">Mon – Sat</span><span className="text-white">9 AM – 8 PM</span></div>
                <div className="flex justify-between"><span className="text-white/50">Sunday</span><span className="text-white">11 AM – 5 PM</span></div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="glass rounded-2xl p-8">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="text-6xl mb-5">✅</div>
                <h3 className="font-serif text-2xl font-bold mb-3">Message Received!</h3>
                <p className="text-white/60 mb-6">We&apos;ll get back to you within 24 hours. Or ping us on WhatsApp for a faster response.</p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5C] text-white font-semibold px-6 py-3 rounded-full transition-all hover:scale-105"
                >
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Chat on WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-serif text-xl font-bold mb-2">Send us a Message</h3>
                {[
                  { id: "name", label: "Full Name", type: "text", placeholder: "Rahul Sharma" },
                  { id: "email", label: "Email", type: "email", placeholder: "rahul@example.com" },
                  { id: "phone", label: "Phone / WhatsApp", type: "tel", placeholder: "+91 98765 43210" },
                ].map((field) => (
                  <div key={field.id}>
                    <label className="text-white/60 text-sm mb-1.5 block">{field.label}</label>
                    <input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={(form as Record<string, string>)[field.id]}
                      onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                      required
                      className="w-full bg-white/5 border border-white/10 focus:border-cherry-light/50 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-white/60 text-sm mb-1.5 block">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Tell us how we can help..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    className="w-full bg-white/5 border border-white/10 focus:border-cherry-light/50 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full gold-shimmer text-white font-bold py-4 rounded-full hover:scale-105 transition-transform"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
