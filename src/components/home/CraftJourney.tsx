import React from 'react';
import { CRAFT_STEPS } from '../../data/products';

export const CraftJourney: React.FC = () => {
  return (
    <section className="section-craft-journey relative bg-[#060606] border-t border-stone-800 text-white z-10 overflow-hidden py-20 sm:py-24 lg:py-28 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto w-full space-y-6 sm:space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end border-b border-stone-800 pb-4">
          <div className="lg:col-span-8 space-y-1">
            <span className="text-[10px] font-mono tracking-[0.45em] uppercase text-stone-500 block">
              CHRONOLOGY &bull; ATELIER CRAFT
            </span>
            <h2 className="text-2xl sm:text-4xl font-light tracking-wide text-white uppercase font-sans leading-tight">
              From Raw Earth <span className="italic text-stone-400">to Living Sanctuary.</span>
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Three rigorous stages. Zero shortcuts. Every raw block is hand-sculpted in Rajkot, buffed with organic beeswax, and individually catalogued.
            </p>
          </div>
        </div>

        <div className="craft-timeline-container relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 relative pl-8 sm:pl-10">
            <svg className="craft-svg-track absolute left-3 top-3 bottom-6 w-1 h-[calc(100%-1.5rem)] overflow-visible" aria-hidden="true">
              <line x1="2" y1="0" x2="2" y2="100%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
              <line id="craft-scrub-line" x1="2" y1="0" x2="2" y2="100%" stroke="#d4af37" strokeWidth="2.5" strokeDasharray="1000" strokeDashoffset="1000" />
            </svg>

            <div className="space-y-6 sm:space-y-7">
              {CRAFT_STEPS.slice(0, 3).map((step, idx) => (
                <div key={idx} className="craft-stage-item relative" data-stage={idx}>
                  <div className="craft-stage-dot absolute -left-[27px] sm:-left-[39px] top-1 w-3.5 h-3.5 rounded-full bg-black border-2 border-stone-600 transition-colors duration-400 flex items-center justify-center">
                    <span className="craft-dot-inner w-1.5 h-1.5 rounded-full bg-stone-700 transition-all duration-400" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-baseline gap-3">
                      <span className="craft-stage-num text-base sm:text-lg font-mono text-amber-500 font-semibold tracking-wider inline-block">{step.step}</span>
                      <h3 className="craft-stage-title text-sm sm:text-base font-light text-white uppercase font-sans tracking-wide">{step.name}</h3>
                    </div>

                    <p className="craft-stage-desc text-xs text-stone-300 font-light leading-relaxed max-w-lg">{step.description}</p>

                    <div className="craft-stage-meta flex flex-wrap gap-3 text-[9px] font-mono text-stone-500 uppercase tracking-widest pt-0.5">
                      <span>Duration: {step.duration}</span>
                      <span>&bull;</span>
                      <span>Supervisor: {step.artisanRole}</span>
                    </div>

                    {idx === 1 && (
                      <div className="atelier-stat-badge mt-2 p-2.5 bg-stone-900/80 flex items-center gap-3 max-w-sm shadow-lg border border-stone-800/80 rounded-xs">
                        <div className="text-xl sm:text-2xl font-light text-amber-400 font-mono" id="atelier-sqft-counter">0</div>
                        <div className="text-[8.5px] font-mono tracking-widest text-stone-400 uppercase leading-snug">
                          <span>SQ. FT. DISPLAY ATELIER</span><br />
                          <span className="text-stone-500">Vavdi, Rajkot, Gujarat</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="transformation-card bg-stone-950 shadow-2xl rounded-sm overflow-hidden border border-stone-800">
              <div id="split-curtain-container" className="split-curtain-viewport relative aspect-[4/3] max-h-[46vh] overflow-hidden cursor-ew-resize rounded-sm select-none img-skeleton-wrap" role="slider" aria-valuemin={0} aria-valuemax={100} aria-valuenow={50}>
                <div className="img-skeleton-placeholder" />
                <img
                  src="/images/atelier_materials.jpg"
                  alt="Raw Geomorphic Travertine Block"
                  className="image-blur-up absolute inset-0 w-full h-full object-cover object-center filter contrast-115 brightness-90 pointer-events-none"
                />

                <div id="split-curtain-clip" className="absolute inset-0 overflow-hidden pointer-events-none z-10" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}>
                  <img
                    src="/images/chapter_living_room.jpg"
                    alt="Finished Solis Travertine Console"
                    className="image-blur-up absolute inset-0 w-full h-full object-cover object-center filter contrast-105 pointer-events-none"
                  />
                </div>

                <div id="split-curtain-handle" className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-[0_0_12px_#f59e0b] pointer-events-none z-20" style={{ left: '50%' }}>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black border-2 border-amber-400 flex items-center justify-center text-[8.5px] text-amber-300 shadow-xl">&harr;</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CraftJourney;
