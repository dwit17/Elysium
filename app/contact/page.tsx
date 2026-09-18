'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapPin, Phone, Mail, Clock, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { BRAND_INFO, ARTISAN_PRODUCTS } from '@/lib/constants';
import { createWhatsAppLink } from '@/lib/whatsapp';

function ContactFormContent() {
  const searchParams = useSearchParams();
  const pieceFromQuery = searchParams.get('piece') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pieceReference: pieceFromQuery,
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (pieceFromQuery) {
      setFormData((prev) => ({ ...prev, pieceReference: pieceFromQuery }));
    }
  }, [pieceFromQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappUrl = createWhatsAppLink(formData.pieceReference || undefined);

  return (
    <div className="pt-28 pb-24 bg-black text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-[10px] tracking-[0.45em] uppercase text-stone-400 font-mono block">
            ENQUIRIES & CONSULTATIONS
          </span>
          <h1 className="text-4xl sm:text-6xl font-light tracking-wide text-white uppercase font-sans">
            Contact Elysium
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 tracking-wider font-light leading-relaxed">
            We operate on an enquiry basis to ensure each artisan piece is carefully suited to your architectural space. Reach out via WhatsApp or submit your details below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Info & WhatsApp */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-stone-900/60 p-8 border border-stone-800 space-y-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-stone-400 block">
                Instant Communication
              </span>
              <h3 className="text-xl font-light tracking-wide text-white uppercase">
                WhatsApp Direct Line
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed font-light">
                Connect directly with our atelier team for instant availability, trade terms, and custom dimensions.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-white text-black text-xs font-semibold uppercase tracking-[0.25em] inline-flex items-center justify-center gap-2 hover:bg-stone-200 transition-colors"
              >
                OPEN WHATSAPP CHAT <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            {/* Atelier Info */}
            <div className="space-y-6 p-8 border border-stone-800 bg-black">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-stone-500 block">
                Atelier Coordinates
              </span>

              <div className="space-y-4 text-xs text-stone-300 font-light">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-[10px] text-stone-500 uppercase block">Showroom Address</span>
                    <span className="leading-relaxed block pt-0.5">{BRAND_INFO.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-[10px] text-stone-500 uppercase block">Direct Line</span>
                    <a href={`tel:${BRAND_INFO.phoneDisplay}`} className="hover:text-white transition-colors block pt-0.5">
                      +91 {BRAND_INFO.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-[10px] text-stone-500 uppercase block">Email Enquiries</span>
                    <span className="block pt-0.5">{BRAND_INFO.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-[10px] text-stone-500 uppercase block">Operating Hours</span>
                    <span className="block pt-0.5">{BRAND_INFO.timing}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-stone-950 p-8 md:p-12 border border-stone-800 space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-stone-400 block">
              Formal Enquiry Form
            </span>
            <h2 className="text-2xl font-light tracking-wide text-white uppercase font-sans">
              Send an Enquiry
            </h2>

            {submitted ? (
              <div className="py-12 text-center space-y-4 bg-stone-900/40 border border-stone-800 p-8">
                <CheckCircle2 className="w-12 h-12 text-white mx-auto" />
                <h3 className="text-lg font-light uppercase tracking-wider text-white">
                  Enquiry Received
                </h3>
                <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. An Elysium atelier curator will review your enquiry and get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 border border-stone-700 text-xs font-mono uppercase tracking-widest text-stone-300 hover:text-white hover:bg-stone-800"
                >
                  Submit Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase text-stone-400 block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full bg-stone-900 border border-stone-800 p-3.5 text-white placeholder-stone-600 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase text-stone-400 block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="eleanor@example.com"
                      className="w-full bg-stone-900 border border-stone-800 p-3.5 text-white placeholder-stone-600 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase text-stone-400 block">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-stone-900 border border-stone-800 p-3.5 text-white placeholder-stone-600 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase text-stone-400 block">
                      Piece Reference (Optional)
                    </label>
                    <select
                      value={formData.pieceReference}
                      onChange={(e) => setFormData({ ...formData, pieceReference: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 p-3.5 text-white focus:outline-none focus:border-white transition-colors"
                    >
                      <option value="">General Collection Enquiry</option>
                      {ARTISAN_PRODUCTS.map((p) => (
                        <option key={p.slug} value={p.name}>
                          {p.name} ({p.category})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase text-stone-400 block">
                    Your Message / Custom Requirements *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your space, dimensions, or specific piece interest..."
                    className="w-full bg-stone-900 border border-stone-800 p-3.5 text-white placeholder-stone-600 focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-white text-black text-xs font-semibold uppercase tracking-[0.25em] hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  SUBMIT FORM ENQUIRY
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-stone-500">Loading...</div>}>
      <ContactFormContent />
    </Suspense>
  );
}
