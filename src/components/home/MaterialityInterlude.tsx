import React from 'react';

export const MaterialityInterlude: React.FC = () => {
  return (
    <section className="section-materiality-interlude relative bg-black border-t border-stone-800" id="materiality-suite-container">
      <div className="materiality-pinned w-full min-h-screen lg:h-screen overflow-hidden flex flex-col justify-between pt-20 sm:pt-24 pb-8 sm:pb-10 px-6 sm:px-10 lg:px-16 relative">
        {/* Macro Material Images */}
        <div className="materiality-images absolute inset-0 z-0 pointer-events-none">
          <div className="mat-slide mat-slide-0 absolute inset-0 overflow-hidden transition-opacity duration-500">
            <img src="/images/atelier_materials.jpg" alt="Raw Italian Travertine Stone Macro" className="mat-img image-blur-up w-full h-full object-cover object-center filter brightness-90 contrast-110" />
          </div>
          <div className="mat-slide mat-slide-1 absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-500">
            <img src="/images/story_clay_vessel.jpg" alt="Organic Stoneware Clay Macro" className="mat-img image-blur-up w-full h-full object-cover object-center filter brightness-90 contrast-110" />
          </div>
          <div className="mat-slide mat-slide-2 absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-500">
            <img src="/images/maker_tools.jpg" alt="Crafted Oak Timber Macro" className="mat-img image-blur-up w-full h-full object-cover object-center filter brightness-90 contrast-110" />
          </div>
          <div className="mat-slide mat-slide-3 absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-500">
            <img src="/images/story_plaster_relief.jpg" alt="Textured Lime Plaster Finish Macro" className="mat-img image-blur-up w-full h-full object-cover object-center filter brightness-90 contrast-110" />
          </div>
        </div>

        {/* Vignette and Darkening Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/80 pointer-events-none z-10"></div>

        <div className="relative z-20"></div>

        {/* Center: Material Title Reveals */}
        <div className="relative z-20 my-auto text-center space-y-3 pointer-events-none">
          <div className="mat-label-stack relative min-h-[140px] flex items-center justify-center">
            <div className="mat-label mat-label-0 text-center transition-all duration-400">
              <span className="text-[10.5px] font-mono uppercase tracking-[0.4em] text-amber-400 block mb-1">MEDIUM 01</span>
              <h3 className="text-3xl sm:text-5xl lg:text-7xl font-light tracking-wide text-white uppercase font-serif">Travertine Stone</h3>
              <p className="text-xs sm:text-sm font-mono text-stone-300 tracking-widest uppercase mt-2">Unfilled Geomorphic Pores • Zero Synthetic Resin</p>
              <p className="text-xs text-stone-400 font-light max-w-lg mx-auto mt-2 hidden sm:block">Cool, porous geomorphic surface with deep stratified mineral veins hand-chiseled from raw limestone blocks.</p>
            </div>
            <div className="mat-label mat-label-1 text-center absolute opacity-0 transition-all duration-400">
              <span className="text-[10.5px] font-mono uppercase tracking-[0.4em] text-amber-400 block mb-1">MEDIUM 02</span>
              <h3 className="text-3xl sm:text-5xl lg:text-7xl font-light tracking-wide text-white uppercase font-serif">Organic Clay</h3>
              <p className="text-xs sm:text-sm font-mono text-stone-300 tracking-widest uppercase mt-2">Pit-Fired Silicate Stoneware • Breathable Porosity</p>
              <p className="text-xs text-stone-400 font-light max-w-lg mx-auto mt-2 hidden sm:block">Iron-dense riverbed clay thrown on manual kickwheels and wood-pit fired for raw fire-speckled texture.</p>
            </div>
            <div className="mat-label mat-label-2 text-center absolute opacity-0 transition-all duration-400">
              <span className="text-[10.5px] font-mono uppercase tracking-[0.4em] text-amber-400 block mb-1">MEDIUM 03</span>
              <h3 className="text-3xl sm:text-5xl lg:text-7xl font-light tracking-wide text-white uppercase font-serif">Crafted Oak</h3>
              <p className="text-xs sm:text-sm font-mono text-stone-300 tracking-widest uppercase mt-2">Aged White Timber • Beeswax &amp; Linseed Buffing</p>
              <p className="text-xs text-stone-400 font-light max-w-lg mx-auto mt-2 hidden sm:block">Slow-grown northern white oak celebrating dense fibrous annual rings, buffed with organic desert wax.</p>
            </div>
            <div className="mat-label mat-label-3 text-center absolute opacity-0 transition-all duration-400">
              <span className="text-[10.5px] font-mono uppercase tracking-[0.4em] text-amber-400 block mb-1">MEDIUM 04</span>
              <h3 className="text-3xl sm:text-5xl lg:text-7xl font-light tracking-wide text-white uppercase font-serif">Lime Plaster</h3>
              <p className="text-xs sm:text-sm font-mono text-stone-300 tracking-widest uppercase mt-2">Pulverized Pumice • Natural Hydraulic Lime</p>
              <p className="text-xs text-stone-400 font-light max-w-lg mx-auto mt-2 hidden sm:block">Breathable mineral plaster applied in delicate layered coats with hand trowels for a matte velvet warmth.</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar & CTA */}
        <div className="relative z-20 flex justify-end items-center gap-3 pt-3">
          <a href="/materiality" className="materiality-cta btn-slide-white inline-flex items-center gap-3 px-6 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] shadow-lg">
            <span>Explore Full Materiality Lab</span>
            <span className="btn-arrow">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
};
