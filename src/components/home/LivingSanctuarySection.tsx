import React from 'react';

export const LivingSanctuarySection: React.FC = () => {
  return (
    <section
      className="section-living-sanctuary relative bg-[#040404] border-t border-stone-800/80 text-white py-20 sm:py-28 lg:py-32 px-6 md:px-12 lg:px-20 overflow-hidden"
      id="living-sanctuary-container"
    >
      <div className="max-w-7xl mx-auto w-full space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end border-b border-stone-800/60 pb-6">
          <div className="lg:col-span-8 space-y-2">
            <span className="text-[10px] font-mono tracking-[0.45em] uppercase text-amber-500 block">
              SPATIAL LIVING SANCTUARY &bull; LIVING FORM 01
            </span>
            <h2 className="text-3xl sm:text-5xl font-light tracking-wide text-white uppercase font-sans leading-tight">
              Elysium Spatial Living Sanctuary
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Form 01 — Hand-chiseled travertine, pit-fired ceramic volumes, and honest joinery curated inside our Vavdi, Rajkot display atelier.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7 relative">
            <div className="process-showcase-frame relative aspect-[16/10] w-full overflow-hidden bg-stone-950 rounded-sm border border-stone-800 shadow-2xl img-skeleton-wrap group">
              <div className="img-skeleton-placeholder" />
              <img
                src="/images/chapter_living_room.jpg"
                alt="Elysium Spatial Living Sanctuary"
                className="image-blur-up w-full h-full object-cover object-center filter contrast-105 brightness-95 transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-stone-300">
                <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md border border-stone-800 rounded-xs">Living Form 01</span>
                <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md border border-stone-800 rounded-xs">Atelier Rajkot</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              <div className="space-y-2 border-l-2 border-amber-500/80 pl-4">
                <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest">01 &bull; GROUNDING CENTER</span>
                <h3 className="text-lg font-light text-white uppercase font-sans">Solis Travertine Console</h3>
                <p className="text-xs text-stone-400 font-light leading-relaxed">
                  Monolithic 1800mm console carved from single-source Italian limestone with unfilled geomorphic pores.
                </p>
              </div>

              <div className="space-y-2 border-l-2 border-stone-800 pl-4 hover:border-stone-600 transition-colors">
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">02 &bull; TACTILE VESSEL</span>
                <h3 className="text-lg font-light text-white uppercase font-sans">Unglazed Stoneware Clay</h3>
                <p className="text-xs text-stone-400 font-light leading-relaxed">
                  Iron-dense riverbed clay pit-fired for smoke-speckled texture and natural breathable porosity.
                </p>
              </div>

              <div className="space-y-2 border-l-2 border-stone-800 pl-4 hover:border-stone-600 transition-colors">
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">03 &bull; AMBIENT SHADOW</span>
                <h3 className="text-lg font-light text-white uppercase font-sans">Mineral Plaster Relievo</h3>
                <p className="text-xs text-stone-400 font-light leading-relaxed">
                  Pulverized pumice &amp; lime wall planes catching incident morning and evening daylight.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-stone-800/80">
              <a href="/materiality" className="btn-slide-white px-6 py-3.5 text-[9.5px] font-semibold uppercase tracking-[0.2em] shadow-lg">
                <span>Explore Materiality</span>
                <span className="btn-arrow ml-2">&rarr;</span>
              </a>
              <a href="/our-story" className="btn-slide-subtle px-6 py-3.5 text-[9.5px] font-semibold uppercase tracking-[0.2em]">
                <span>Our Provenance</span>
                <span className="btn-arrow ml-2">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LivingSanctuarySection;
