import React from 'react';

export const TrustVoice: React.FC = () => {
  const quoteRawText = "The travertine console feels less like placed furniture and more like a permanent piece of architecture. It brings a profound, grounding stillness to our living space.";

  return (
    <section className="section-trust-voice relative bg-[#030303] border-t border-stone-800 text-white overflow-hidden" id="trust-voice-container">
      {/* 1. Horizontal ContainerAnimation Stream Viewport */}
      <div className="Horizontal relative w-full h-screen overflow-hidden bg-[#030303]" id="trust-horizontal-wrapper">
        {/* Subtle Ambient Warm Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/[0.035] rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Eyebrow */}
        <div className="absolute top-8 left-6 md:left-12 lg:left-20 z-20 pointer-events-none">
          <span className="trust-eyebrow text-[10px] font-mono tracking-[0.5em] uppercase text-amber-500 block">
            TRUST &amp; VOICE • LIVING SPACES
          </span>
        </div>

        {/* Horizontal Text Stream */}
        <div className="Horizontal__container w-full">
          <h3 className="Horizontal__text heading-xl select-none" id="trust-horizontal-stream">
            “{quoteRawText}”
          </h3>
        </div>

        {/* Bottom Status Strip & Attribution */}
        <div className="absolute bottom-8 left-6 right-6 md:left-12 md:right-12 lg:left-20 lg:right-20 z-20 flex justify-between items-center text-[9px] font-mono tracking-widest text-stone-500 uppercase border-t border-white/10 pt-3 pointer-events-none">
          <span className="text-amber-300/80">INTERIOR ARCHITECTURE STUDIO — MUMBAI • PRIVATE RESIDENCE COMMISSION</span>
          <span>
            <span className="mouse-device-only">SCROLL TO ADVANCE HORIZONTAL STREAM</span>
            <span className="touch-device-only">SWIPE TO ADVANCE HORIZONTAL STREAM</span>
          </span>
        </div>
      </div>

      {/* 2. Sculptural Frosted Glass Testimonial Component */}
      <div className="section-testimonial-stage relative w-full py-20 sm:py-28 lg:py-32 px-6 sm:px-10 lg:px-16 overflow-hidden flex flex-col items-center justify-center border-t border-stone-800/80 bg-black" id="trust-testimonial-stage">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="/images/atelier_materials.jpg"
            alt="Elysium Stone Atelier Texture"
            className="w-full h-full object-cover object-center filter blur-xl brightness-[0.25] contrast-125 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/75 to-black"></div>
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/[0.05] rounded-full blur-3xl"></div>
        </div>

        <div id="elysium-testimonial-card" className="testimonial-card relative z-10 w-full max-w-2xl bg-stone-950/75 backdrop-blur-2xl border border-amber-500/20 rounded-2xl p-8 sm:p-12 text-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_40px_rgba(212,175,55,0.06)] overflow-visible will-change-[transform,opacity]">
          <div className="testimonial-wreath-wrap relative w-60 sm:w-72 h-auto mx-auto mb-6 flex items-center justify-center">
            <svg className="testimonial-frame-svg w-full h-auto pointer-events-none z-10 overflow-visible text-amber-300 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] select-none" viewBox="0 0 240 180" fill="none">
              <defs>
                <clipPath id="testimonial-circle-clip">
                  <circle id="testimonial-portrait-circle" cx="140" cy="90" r="54" />
                </clipPath>
              </defs>

              <g className="testimonial-portrait-wrap will-change-[opacity,transform]">
                <circle cx="140" cy="90" r="54" fill="#141210" />
                <image
                  id="testimonial-portrait-img"
                  href="/images/maker_portrait.jpg"
                  x="86"
                  y="36"
                  width="108"
                  height="108"
                  clipPath="url(#testimonial-circle-clip)"
                  preserveAspectRatio="xMidYMid slice"
                  className="filter contrast-105 brightness-95"
                />
              </g>

              <circle className="stone-fragment stone-frag-ring text-amber-400/90" cx="140" cy="90" r="54" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          <div id="testimonial-content-container" className="space-y-4">
            <h3 id="testimonial-headline" className="testimonial-headline text-3xl sm:text-4xl lg:text-5xl font-light text-white italic font-serif tracking-wide leading-tight">
              “Grounded.”
            </h3>

            <p id="testimonial-quote" className="testimonial-quote text-sm sm:text-base text-stone-300 font-light leading-relaxed max-w-xl mx-auto font-sans">
              “Elysium delivered a custom travertine console that transformed our living room into <span className="testimonial-highlight-wrap inline-block relative"><span className="testimonial-highlight-bg absolute inset-0 bg-amber-500/20 border border-amber-400/30 rounded-xs"></span><span className="testimonial-highlight-text relative z-10 text-amber-200 font-normal px-1.5">a monolithic living sanctuary</span></span> with unmatched tactile reverence.”
            </p>

            <div id="testimonial-attribution-block" className="testimonial-attribution pt-4">
              <div className="text-xs sm:text-sm text-stone-200 font-sans">
                <strong id="testimonial-author" className="font-semibold text-white">Sarah P.</strong>
                <span className="text-stone-500 mx-1">•</span>
                <span id="testimonial-project" className="text-stone-400">Bespoke Console Commission, South Bombay Residence</span>
              </div>
            </div>
          </div>
        </div>

        <div className="testimonial-dots flex items-center justify-center gap-2.5 mt-8 relative z-20" id="testimonial-dots-nav">
          <button className="testimonial-dot active w-2.5 h-2.5 rounded-full bg-amber-400 transition-all cursor-pointer shadow-[0_0_8px_#f59e0b]" data-idx="0" aria-label="Testimonial 1"></button>
          <button className="testimonial-dot w-2.5 h-2.5 rounded-full bg-stone-700 hover:bg-stone-500 transition-all cursor-pointer" data-idx="1" aria-label="Testimonial 2"></button>
          <button className="testimonial-dot w-2.5 h-2.5 rounded-full bg-stone-700 hover:bg-stone-500 transition-all cursor-pointer" data-idx="2" aria-label="Testimonial 3"></button>
        </div>
      </div>
    </section>
  );
};
