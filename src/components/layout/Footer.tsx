import React from 'react';
import { BRAND, createWhatsAppLink } from '../../data/brand';

export const Footer: React.FC = () => {
  const whatsappUrl = createWhatsAppLink();

  return (
    <footer className="footer-fullscreen bg-black select-none text-stone-900 font-sans overflow-hidden relative">
      <div id="footer-decor-container" className="footer-decor-fullscreen px-6 sm:px-12 md:px-16 lg:px-24 py-8 sm:py-10 md:py-12 transition-all duration-700">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            id="footer-bg-img"
            src="/images/footer-decor-bg.jpg"
            alt="Elysium Wabi-Sabi Decor Flatlay Background"
            className="w-full h-full object-cover object-center transition-all duration-700 brightness-[1.04] contrast-[1.02] saturate-[1.05]"
          />
          <div id="footer-light-beam"></div>
        </div>

        {/* Hanging Animated Lamp */}
        <div id="footer-bulb-btn" className="footer-hanging-lamp" title="Click lamp to toggle Atelier lighting">
          <div className="bell-root w-full h-full" style={{ fontSize: 'calc(200px * 0.01)' }}>
            <div id="footer-bell-container" className="bell-container" role="button" aria-pressed="true" tabIndex={0}>
              <div className="rope"></div>
              <div className="bell-top"></div>
              <div className="bell-base"></div>
              <div className="left-glow"></div>
              <div className="left-glow2"></div>
              <div className="r-glow"></div>
              <div className="r-glow2"></div>
              <div className="mid-ring"></div>
              <div className="mid-ring small"></div>
              <div className="glow"></div>
              <div className="glow2"></div>
              <div className="bell-buff-t"></div>
              <div className="bell-buff"></div>
              <div className="bell-btm"></div>
              <div className="bell-btm2"></div>
            </div>
          </div>
        </div>

        {/* Light Control Indicator Banner */}
        <div className="relative z-20 flex items-center justify-between pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-[11px] font-mono uppercase tracking-[0.2em] text-white border border-white/20 shadow-md">
            <span id="footer-status-dot" className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span id="footer-status-text">Studio No. 029 • Atelier Illuminated</span>
          </div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-20 space-y-12">
          <div className="max-w-2xl space-y-3">
            <span id="footer-brand-title" className="text-[10px] font-mono uppercase tracking-[0.3em] block text-stone-700 font-semibold transition-colors duration-500">{BRAND.fullName}</span>
            <h2 id="footer-hero-head" className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-[1.15] text-stone-900 font-normal transition-colors duration-500">
              Sculpting raw earth <br />
              <span id="footer-hero-sub" className="italic font-serif text-stone-800 transition-colors duration-500">into timeless living sanctuaries</span>
            </h2>
          </div>

          <div id="footer-grid-border" className="grid grid-cols-1 md:grid-cols-12 gap-10 pt-8 border-t border-stone-400/60 transition-colors duration-500">
            <div className="md:col-span-5 space-y-5">
              <span className="footer-lbl text-xs uppercase tracking-[0.3em] font-mono block font-semibold text-stone-800">Atelier Display</span>
              <p className="footer-txt text-xs font-light leading-relaxed max-w-sm text-stone-800 font-normal">{BRAND.showroomSize}. Curated handcrafted decor pieces for discerning interiors in India and worldwide.</p>
              <div className="space-y-2 pt-2">
                <span className="footer-lbl text-[10px] uppercase tracking-[0.25em] font-mono block text-stone-700 font-semibold">Atelier Address</span>
                <p className="footer-txt text-xs font-light leading-relaxed max-w-sm text-stone-900 font-normal">📍 {BRAND.address}</p>
              </div>
            </div>

            <div className="md:col-span-4 space-y-5">
              <span className="footer-lbl text-[10px] uppercase tracking-[0.25em] font-mono block text-stone-700 font-semibold">Enquiries & Contact</span>
              <div className="text-xs space-y-2.5 font-light">
                <p className="footer-txt text-stone-900 font-normal">📞 <a href={`tel:${BRAND.phoneDisplay}`} className="hover:underline font-medium">+91 {BRAND.phoneDisplay}</a></p>
                <p className="footer-txt text-stone-800">Email: {BRAND.email}</p>
              </div>
              <div className="space-y-2 pt-2">
                <span className="footer-lbl text-[10px] uppercase tracking-[0.25em] font-mono block text-stone-700 font-semibold">Showroom Hours</span>
                <p className="footer-txt text-xs text-stone-900 font-normal">⏰ {BRAND.timing}</p>
              </div>
            </div>

            <div className="md:col-span-3 space-y-5">
              <span className="footer-lbl text-[10px] uppercase tracking-[0.25em] font-mono block text-stone-700 font-semibold">Navigation</span>
              <ul className="space-y-2.5 text-xs text-stone-800 font-medium">
                <li><a href="/philosophy" className="hover:underline">Philosophy</a></li>
                <li><a href="/artisan-pieces" className="hover:underline">Artisan Collection</a></li>
                <li><a href="/materiality" className="hover:underline">Tactile Materiality</a></li>
                <li><a href="/our-story" className="hover:underline">Our Story</a></li>
                <li><a href="/contact" className="hover:underline">Contact & Enquiries</a></li>
              </ul>
              <div className="pt-2">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg text-[10px] uppercase tracking-[0.2em] shadow-md hover:bg-black">
                  WhatsApp Direct &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>

        <div id="footer-bottom-strip" className="relative z-20 pt-8 mt-10 border-t border-stone-400/60 flex flex-col sm:flex-row items-center justify-between text-[10px] uppercase tracking-[0.2em] font-mono text-stone-800 font-semibold gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>© {new Date().getFullYear()} {BRAND.fullName}. ALL RIGHTS RESERVED.</span>
          </div>
          <div className="flex items-center gap-6">
            <span>RAJKOT • VOLTERRA • INTERNATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
