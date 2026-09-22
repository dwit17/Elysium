import React from 'react';
import { Layout } from '../components/layout/Layout';
import { BRAND, createWhatsAppLink } from '../data/brand';
import { CRAFT_STEPS } from '../data/products';

export const OurStory: React.FC = () => {
  const whatsappUrl = createWhatsAppLink();

  return (
    <Layout currentPath="/our-story">
      <div className="pt-28 pb-24 bg-black text-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <section className="py-12 border-b border-stone-800 space-y-6 max-w-4xl">
            <span className="text-[10px] tracking-[0.45em] uppercase text-amber-500 font-mono block">THE ATELIER JOURNEY</span>
            <h1 className="text-4xl sm:text-6xl font-light tracking-wide text-white uppercase font-sans">Our Story &amp; Provenance</h1>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-light pt-2">Elysium was founded as a quiet reaction against mass production and artificial coatings. We collaborate directly with master artisans across Rajkot, Volterra, Tuscany, and the Peloponnese to curate timeless home objects sculpted from raw limestone, organic clay, and slow-grown white oak.</p>
          </section>

          <section className="py-20 border-b border-stone-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-[10px] tracking-[0.4em] uppercase text-amber-500 font-mono block">PHYSICAL ATELIER SHOWROOM</span>
                <h2 className="text-3xl sm:text-4xl font-light text-white uppercase">{BRAND.showroomSize}</h2>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-light">Located in Rajkot, Gujarat, our 4,500 sq. ft. Display Atelier invites collectors to experience raw travertine, stoneware clay, and plaster lighting under natural light.</p>
                <div className="space-y-2 pt-2 text-xs font-mono text-stone-300">
                  <p>📍 {BRAND.address}</p>
                  <p>⏰ {BRAND.timing}</p>
                </div>
              </div>
              <div className="lg:col-span-6">
                <div className="wooden-art-frame aspect-[16/10] w-full relative overflow-hidden rounded-sm">
                  <img
                    src="/images/photo-1600121848594-d8644e57abab"
                    alt="Showroom"
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-85"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="py-24 border-b border-stone-800">
            <div className="mb-16 space-y-3 max-w-2xl">
              <span className="text-[10px] tracking-[0.45em] uppercase text-amber-500 font-mono block">CHRONOLOGY OF CREATION</span>
              <h2 className="text-3xl sm:text-4xl font-light tracking-wide text-white uppercase font-sans">From Quarry &amp; Earth to Home</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {CRAFT_STEPS.map(step => (
                <div key={step.step} className="bg-stone-900/60 p-8 border border-stone-800 space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold text-stone-500">PHASE {step.step} • {step.duration}</span>
                    <h3 className="text-xl font-light tracking-wide text-white uppercase">{step.name}</h3>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed font-light">{step.description}</p>
                  <div className="pt-4 border-t border-stone-800 text-[10px] font-mono text-stone-400">
                    Supervisor: {step.artisanRole}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="py-20 text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-light tracking-wide text-white uppercase font-sans">Connect With Our Curators</h2>
            <p className="text-xs text-stone-400 max-w-md mx-auto font-light leading-relaxed">Whether sourcing for a single residential sanctuary or a complete trade project, our team is available for direct consultation.</p>
            <div className="pt-2">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-slide-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.25em] inline-flex items-center gap-2 shadow-lg">
                <span>Start Consultation via WhatsApp</span>
                <span className="btn-arrow">&rarr;</span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default OurStory;
