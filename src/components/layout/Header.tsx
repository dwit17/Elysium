import React from 'react';
import { createWhatsAppLink } from '../../data/brand';

interface HeaderProps {
  currentPath?: string;
}

export const Header: React.FC<HeaderProps> = ({ currentPath = '/' }) => {
  const whatsappUrl = createWhatsAppLink();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-sans header-blur py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <a href="/" className="flex items-center gap-4 cursor-pointer">
            <img src="/images/logo.png" alt="ELYSIUM" className="h-10 md:h-12 w-auto filter invert opacity-90" />
          </a>

          <nav className="hidden lg:flex items-center space-x-8 text-xs font-medium tracking-[0.2em] uppercase text-stone-400">
            <a href="/philosophy" className={`hover:text-white transition-colors ${currentPath === '/philosophy' ? 'text-white border-b-2 border-white pb-1' : ''}`}>Philosophy</a>
            <a href="/artisan-pieces" className={`hover:text-white transition-colors ${currentPath === '/artisan-pieces' ? 'text-white border-b-2 border-white pb-1' : ''}`}>Artisan Pieces</a>
            <a href="/materiality" className={`hover:text-white transition-colors ${currentPath === '/materiality' ? 'text-white border-b-2 border-white pb-1' : ''}`}>Materiality</a>
            <a href="/our-story" className={`hover:text-white transition-colors ${currentPath === '/our-story' ? 'text-white border-b-2 border-white pb-1' : ''}`}>Our Story</a>
            <a href="/contact" className={`hover:text-white transition-colors ${currentPath === '/contact' ? 'text-white border-b-2 border-white pb-1' : ''}`}>Contact</a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-slide-white px-5 py-2 text-[11px] font-semibold tracking-[0.2em] uppercase"><span>Enquire</span></a>
          </nav>

          <div className="flex lg:hidden items-center space-x-3">
            <button id="mobile-menu-btn" className="lg:hidden text-white p-2" aria-label="Toggle Menu" aria-expanded="false" aria-controls="mobile-menu-drawer">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div id="mobile-menu-drawer" className="hidden fixed inset-0 z-50 bg-black bg-opacity-95 pt-24 px-8 flex flex-col justify-between pb-12">
        <div className="flex justify-between items-center mb-8">
          <span className="text-xs uppercase tracking-[0.4em] text-stone-500 font-mono">Menu Navigation</span>
          <button id="mobile-menu-close-btn" className="text-white text-2xl">&times;</button>
        </div>
        <nav className="flex flex-col space-y-6 text-xl font-light uppercase tracking-[0.25em]">
          <a href="/philosophy" className="text-stone-300 hover:text-white">Philosophy</a>
          <a href="/artisan-pieces" className="text-stone-300 hover:text-white">Artisan Pieces</a>
          <a href="/materiality" className="text-stone-300 hover:text-white">Materiality</a>
          <a href="/our-story" className="text-stone-300 hover:text-white">Our Story</a>
          <a href="/contact" className="text-stone-300 hover:text-white">Contact</a>
        </nav>
        <div className="pt-8 border-t border-stone-800">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-slide-white w-full py-3.5 text-center text-xs uppercase tracking-[0.25em] font-semibold"><span>Enquire via WhatsApp</span></a>
        </div>
      </div>
    </>
  );
};
