import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, MapPin, Clock } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo';
import { BRAND_INFO, CRAFT_STEPS } from '@/lib/constants';
import { createWhatsAppLink } from '@/lib/whatsapp';

export const metadata: Metadata = generatePageMetadata(
  'Our Story | The Elysium Journey',
  'How Elysium started, the 4500 sq ft Rajkot Display Atelier, and the artisan partners behind every piece in the collection.',
  '/our-story'
);

export default function OurStoryPage() {
  const whatsappUrl = createWhatsAppLink();

  return (
    <div className="pt-28 pb-24 bg-black text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        {/* Story Hero */}
        <section className="py-12 border-b border-stone-800 space-y-6 max-w-4xl">
          <span className="text-[10px] tracking-[0.45em] uppercase text-stone-400 font-mono block">
            THE ATELIER JOURNEY
          </span>
          <h1 className="text-4xl sm:text-6xl font-light tracking-wide text-white uppercase font-sans">
            Our Story & Provenance
          </h1>
          <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-light pt-2">
            Elysium was founded as a quiet reaction against mass production and artificial coatings. We collaborate directly with master artisans across Rajkot, Volterra, Tuscany, and the Peloponnese to curate timeless home objects sculpted from raw limestone, organic clay, and slow-grown white oak.
          </p>
        </section>

        {/* Showroom Feature */}
        <section className="py-20 border-b border-stone-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[10px] tracking-[0.4em] uppercase text-stone-400 font-mono block">
                PHYSICAL ATELIER SHOWROOM
              </span>
              <h2 className="text-3xl sm:text-4xl font-light tracking-wide text-white uppercase font-sans">
                {BRAND_INFO.showroomSize}
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-light">
                Located in Rajkot, Gujarat, our 4,500 sq. ft. Display Atelier invites collectors and interior architects to experience the tactility of raw travertine consoles, pit-fired ceramic vessels, and hand-troweled plaster lighting under natural architectural light.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-xs text-stone-300 font-mono">
                  <MapPin className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                  <span>{BRAND_INFO.address}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-300 font-mono">
                  <Clock className="w-4 h-4 text-stone-400 flex-shrink-0" />
                  <span>{BRAND_INFO.timing}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-stone-900 border border-stone-800 aspect-[16/10] overflow-hidden rounded-xs relative">
              <img
                src="/images/photo-1600121848594-d8644e57abab"
                alt="Elysium Showroom Interior"
                className="w-full h-full object-cover grayscale opacity-85"
              />
              <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-1.5 backdrop-blur-sm text-[9px] font-mono tracking-widest text-stone-300 border border-white/10 uppercase">
                Studio No. {BRAND_INFO.studioNo}
              </div>
            </div>
          </div>
        </section>

        {/* Craft Chronology */}
        <section className="py-24 border-b border-stone-800">
          <div className="mb-16 space-y-3 max-w-2xl">
            <span className="text-[10px] tracking-[0.45em] uppercase text-stone-400 font-mono block">
              CHRONOLOGY OF CREATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-light tracking-wide text-white uppercase font-sans">
              From Quarry & Earth to Home
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CRAFT_STEPS.map((step) => (
              <div key={step.step} className="bg-stone-900/60 p-8 border border-stone-800 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-stone-500">
                    PHASE {step.step} • {step.duration}
                  </span>
                  <h3 className="text-xl font-light tracking-wide text-white uppercase">
                    {step.title}
                  </h3>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed font-light">
                  {step.description}
                </p>
                <div className="pt-4 border-t border-stone-800 text-[10px] font-mono text-stone-400">
                  Supervisor: {step.supervisor}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-light tracking-wide text-white uppercase font-sans">
            Connect With Our Curators
          </h2>
          <p className="text-xs text-stone-400 max-w-md mx-auto font-light leading-relaxed">
            Whether sourcing for a single residential sanctuary or a complete trade project, our team is available for direct consultation.
          </p>
          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-white text-black text-xs font-semibold uppercase tracking-[0.25em] inline-flex items-center gap-2 hover:bg-stone-200 transition-colors"
            >
              Start Consultation via WhatsApp <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
