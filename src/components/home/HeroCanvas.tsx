import React from 'react';
import { BRAND, createWhatsAppLink } from '../../data/brand';

export const HeroCanvas: React.FC = () => {
  const whatsappUrl = createWhatsAppLink();

  return (
    <div id="hero-scroll-container">
      <div className="hero-sticky-viewport">
        <canvas id="hero-canvas"></canvas>
        <div className="hero-vignette"></div>

        {/* Hero Preloader Overlay */}
        <div id="hero-preloader">
          <span className="text-xs uppercase tracking-[0.45em] text-stone-400 font-mono">ELYSIUM</span>
          <h2 className="text-xl sm:text-2xl font-light tracking-[0.2em] uppercase text-stone-200 mt-2">A SPACE IN MOTION</h2>
          <div className="preloader-track">
            <div id="preloader-progress-bar"></div>
          </div>
          <span id="preloader-progress-text" className="text-[10px] font-mono tracking-widest text-stone-500">INITIALIZING SPACE 0%</span>
        </div>

        {/* Main Hero Overlay UI */}
        <div className="hero-overlay-ui">
          <div className="h-16"></div>
          <div className="max-w-2xl space-y-6 interactive-element">
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-[0.12em] leading-tight text-white uppercase font-sans">ELYSIUM</h1>
              <p className="text-sm sm:text-base font-light text-stone-300 max-w-lg leading-relaxed tracking-wide">{BRAND.heroStatement}</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 bg-white text-black text-xs font-semibold uppercase tracking-[0.25em] inline-flex items-center gap-2 hover:bg-stone-200 transition-colors" data-magnetic="true">ENQUIRE NOW &rarr;</a>
              <a href="/artisan-pieces" className="px-6 py-3.5 border border-white border-opacity-30 text-white text-xs uppercase tracking-[0.25em] hover:bg-white hover:bg-opacity-10 transition-colors" data-magnetic="true">EXPLORE</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
