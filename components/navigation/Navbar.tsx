'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { createWhatsAppLink } from '@/lib/whatsapp';
import { BRAND_INFO } from '@/lib/constants';

const NAV_LINKS = [
  { name: 'Philosophy', href: '/philosophy' },
  { name: 'Artisan Pieces', href: '/artisan-pieces' },
  { name: 'Materiality', href: '/materiality' },
  { name: 'Our Story', href: '/our-story' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const whatsappUrl = createWhatsAppLink();

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-sans ${
          scrolled
            ? 'bg-black/85 backdrop-blur-md py-4 border-b border-white/10 shadow-2xl'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo & Subtitle */}
          <Link href="/" className="group flex items-center gap-4 cursor-pointer">
            <img
              src="/images/logo.png"
              alt={BRAND_INFO.name}
              className="h-10 md:h-12 w-auto filter invert opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            />
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold tracking-[0.35em] text-white uppercase leading-tight">
                {BRAND_INFO.name}
              </span>
              <span className="text-[8px] tracking-[0.4em] text-stone-400 uppercase font-mono">
                HOME DECOR
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            <div className="flex space-x-8 text-xs font-medium tracking-[0.2em] uppercase text-stone-300">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative py-1 transition-colors duration-300 hover:text-white ${
                      isActive ? 'text-white' : 'text-stone-400'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Primary Enquire Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white text-black text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-stone-200 hover:scale-[1.02]"
            >
              Enquire
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center space-x-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white text-black text-[10px] font-semibold tracking-[0.15em] uppercase"
            >
              Enquire
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24 px-8 flex flex-col justify-between pb-12 lg:hidden"
          >
            <div className="flex flex-col space-y-6">
              <span className="text-[9px] uppercase tracking-[0.4em] text-stone-500 font-mono">
                Menu Navigation
              </span>
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xl font-light uppercase tracking-[0.25em] transition-colors ${
                      isActive ? 'text-white font-normal pl-2 border-l-2 border-white' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="space-y-6 pt-8 border-t border-stone-800">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-[0.3em] text-stone-500 font-mono block">
                  Studio Atelier
                </span>
                <p className="text-xs text-stone-400 font-light">
                  {BRAND_INFO.showroomSize} • {BRAND_INFO.city}
                </p>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-white text-black text-xs uppercase tracking-[0.25em] font-semibold text-center block"
              >
                Enquire via WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
