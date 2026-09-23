import React from 'react';

export const ManifestoSection: React.FC = () => {
  const manifestoHeadingWords = "Every Piece Begins With a Name.".split(" ");

  return (
    <section className="section-manifesto relative bg-[#030303] border-t border-stone-800 text-white z-10 overflow-hidden py-20 sm:py-24 lg:py-28 px-6 md:px-12 lg:px-20">
      {/* Ambient Radial Glow Accent */}
      <div className="manifesto-parallax-bg absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" data-scroll-speed="-0.15"></div>

      {/* Interactive Scroll-Triggered SVG Drawing Line Layer (Lusion.co Inspired) */}
      <div className="manifesto-line-container absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <svg
          className="manifesto-svg-line w-full h-full"
          viewBox="0 0 2135 1318"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Lusion-inspired Gold/Amber Luxury Gradient */}
            <linearGradient id="manifestoStrokeGradReact" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="25%" stopColor="#fbbf24" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="1" />
              <stop offset="85%" stopColor="#d97706" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#fef3c7" stopOpacity="0.4" />
            </linearGradient>

            {/* Multi-stage Glow Filter */}
            <filter id="manifestoGlowReact" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ambient Diffuse Glowing Aura Path */}
          <path
            className="manifesto-draw-path-aura"
            d="M8.81226 17.9429C8.81226 17.9429 1005.34 507.443 879.812 836.443C828.301 971.455 468.264 1202.77 329.312 1242.44C162.887 1289.96 -4.06923 923.35 226.812 788.443C481.813 639.443 645.734 1197.94 994.812 1197.94C1117.31 1197.94 1227.81 1102.44 1346.31 1015.94C1490.53 910.667 1600.81 1108.44 1658.31 1242.44C1736.5 1424.65 2100.67 1082.64 2114.31 1280.44"
            stroke="url(#manifestoStrokeGradReact)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#manifestoGlowReact)"
            opacity="0.32"
          />

          {/* Core Precision Vector Stroke */}
          <path
            className="manifesto-draw-path"
            d="M8.81226 17.9429C8.81226 17.9429 1005.34 507.443 879.812 836.443C828.301 971.455 468.264 1202.77 329.312 1242.44C162.887 1289.96 -4.06923 923.35 226.812 788.443C481.813 639.443 645.734 1197.94 994.812 1197.94C1117.31 1197.94 1227.81 1102.44 1346.31 1015.94C1490.53 910.667 1600.81 1108.44 1658.31 1242.44C1736.5 1424.65 2100.67 1082.64 2114.31 1280.44"
            stroke="url(#manifestoStrokeGradReact)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Luminous Leading Edge Light Particle / Orb */}
          <g className="manifesto-path-head" style={{ opacity: 0 }}>
            <circle cx="0" cy="0" r="16" fill="#fbbf24" opacity="0.35" filter="url(#manifestoGlowReact)" />
            <circle cx="0" cy="0" r="7" fill="#fef3c7" opacity="0.8" />
            <circle cx="0" cy="0" r="3" fill="#ffffff" />
          </g>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left 7 Cols: Split-Text Manifesto */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 relative manifesto-parallax-content" data-scroll-speed="0.06">
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
          <div className="lg:col-span-5 relative flex justify-center manifesto-parallax-card" data-scroll-speed="-0.06">
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
