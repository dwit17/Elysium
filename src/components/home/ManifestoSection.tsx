import React from 'react';

export const ManifestoSection: React.FC = () => {
  const manifestoHeadingWords = "Every Piece Begins With a Name.".split(" ");

  return (
    <section className="section-manifesto relative bg-[#030303] border-t border-stone-800 text-white z-10 overflow-hidden py-20 sm:py-24 lg:py-28 px-6 md:px-12 lg:px-20">
      {/* Ambient Radial Glow Accent */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left 7 Cols: Split-Text Manifesto */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 relative">
            <div className="flex items-center justify-between">
              <span className="manifesto-eyebrow text-[10px] font-mono tracking-[0.45em] uppercase text-amber-500 block">
                THE ATELIER PHILOSOPHY • RAJKOT
              </span>
            </div>

            <h2 className="manifesto-heading text-2xl sm:text-4xl lg:text-5xl font-light tracking-wide text-white uppercase font-serif leading-tight">
              {manifestoHeadingWords.map((w, idx) => (
                <span key={idx} className="manifesto-word inline-block">{w}&nbsp;</span>
              ))}
            </h2>

            <div className="manifesto-divider w-16 h-px bg-gradient-to-r from-amber-500 via-stone-600 to-transparent"></div>

            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-xl">
              <p className="manifesto-para manifesto-para-1">
                I began working with raw stone and untamed clay because I could no longer endure surfaces designed to conceal their origin. Synthetic sealants, chemical lacquers, industrial veneers—they silence the medium. At Elysium, we listen first. We let the stone fissure where it must, let the unglazed clay breathe, and let the white oak reveal decades of patient growth rings.
              </p>
              <p className="manifesto-para manifesto-para-2">
                Rajkot is where this quiet reverence lives. In our 4,500 sq. ft. Vavdi sanctuary, generational stone-carvers and master sculptors know the temper of a raw block before the chisel ever strikes.
              </p>
            </div>

            {/* Signature Line with Coordinates */}
            <div className="manifesto-signature pt-1 border-l-2 border-amber-500/50 pl-4 space-y-0.5">
              <span className="text-xs sm:text-sm text-stone-200 font-light italic block leading-snug">— Lead Artisan &amp; Founder, Elysium Atelier</span>
              <div className="flex items-center gap-3 text-[9px] font-mono tracking-widest text-stone-500 uppercase">
                <span>Vavdi, Rajkot</span>
                <span>•</span>
                <span className="text-amber-400/80">22.2587° N, 70.8022° E</span>
              </div>
            </div>

            {/* Links */}
            <div className="manifesto-links pt-1 flex flex-wrap items-center gap-4 text-[10.5px] font-medium uppercase tracking-[0.25em]">
              <a href="/our-story" className="manifesto-link btn-slide-white px-4 py-2 text-[10px] font-semibold tracking-[0.2em] shadow-md">
                <span>Read Our Full Story</span>
                <span className="btn-arrow ml-2">&rarr;</span>
              </a>
              <a href="/philosophy" className="manifesto-link btn-slide-subtle px-4 py-2 text-[10px] font-semibold tracking-[0.2em]">
                <span>Read Philosophy</span>
                <span className="btn-arrow ml-2">&rarr;</span>
              </a>
            </div>
          </div>

          {/* Right 5 Cols: Interactive 3D Perspective Tilt Card with Specular Glare */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="manifesto-tilt-container relative w-full max-w-sm perspective-[1200px]" id="manifesto-tilt-card">
              <div className="manifesto-portrait-wrap relative overflow-hidden bg-stone-950 shadow-2xl transition-transform duration-200 ease-out will-change-transform rounded-sm">
                <div className="manifesto-portrait-clip aspect-[4/5] sm:aspect-[3/4] relative overflow-hidden max-h-[50vh] img-skeleton-wrap">
                  <div className="img-skeleton-placeholder"></div>
                  <img
                    src="/images/maker_portrait.jpg"
                    alt="Lead Artisan at work in the Elysium Rajkot Atelier"
                    className="manifesto-portrait-img image-blur-up w-full h-full object-cover filter contrast-105 brightness-95"
                    style={{ objectPosition: 'center 25%' }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none z-10"></div>
                  {/* Dynamic Mouse Glare Element */}
                  <div className="tilt-glare absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 z-20"></div>
                  {/* Initial clip-path overlay mask */}
                  <div className="manifesto-portrait-mask absolute inset-0 bg-[#030303] z-10" style={{ clipPath: 'inset(0 100% 0 0)' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
