'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Clock, ArrowUpRight, Sparkles, Lightbulb } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BRAND_INFO } from '@/lib/constants';
import { createWhatsAppLink } from '@/lib/whatsapp';
import { BellNotify } from '@/components/ui/bell-notify';
import MagneticButton from '@/components/ui/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const whatsappUrl = createWhatsAppLink();
  const [isLit, setIsLit] = useState(true);

  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footer,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.from(headerRef.current?.querySelectorAll('.footer-reveal') || [], {
      y: 40,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out',
    }).from(
      columnsRef.current?.querySelectorAll('.footer-col') || [],
      {
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
      },
      '-=0.5'
    );
  }, { scope: footerRef });

  return (
    <footer
      ref={footerRef}
      className="footer-fullscreen bg-black select-none text-stone-900 font-sans overflow-hidden relative"
    >
      {/* 100vh Full-Bleed Container */}
      <div
        className={`footer-decor-fullscreen px-6 sm:px-12 md:px-16 lg:px-24 py-8 sm:py-10 md:py-12 transition-all duration-700 ${
          isLit ? '' : 'footer-night-mode'
        }`}
      >
        {/* Background Wabi-Sabi Flatlay Image (Full Bleed) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="/images/footer-decor-bg.jpg"
            alt="Elysium Wabi-Sabi Decor Flatlay Background"
            fill
            priority
            className={`object-cover object-center transition-all duration-700 ${
              isLit
                ? 'brightness-[1.04] contrast-[1.02] saturate-[1.05]'
                : 'brightness-[0.32] contrast-[1.15] saturate-[0.85]'
            }`}
          />

          {/* Wide Room-Filling Ambient Warm Light Wash from Hanging Lamp */}
          <div
            id="footer-light-beam"
            className={`transition-opacity duration-700 pointer-events-none ${
              isLit ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>

        {/* HANGING COMPONENT LAMP (Clean Minimalist Atelier Lamp in open space) */}
        <div className="footer-hanging-lamp">
          <BellNotify
            isOn={isLit}
            onToggle={(nextState) => setIsLit(nextState)}
            size={200}
            baseColor="#78716c"
            showButton={false}
            className="w-full h-full"
          />
        </div>

        {/* Top Status & Light Toggle Button */}
        <div className="relative z-20 flex items-center justify-between pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-[11px] font-mono uppercase tracking-[0.2em] text-white border border-white/20 shadow-md">
            <Sparkles
              className={`w-3.5 h-3.5 transition-colors ${
                isLit ? 'text-amber-400' : 'text-stone-500'
              }`}
            />
            <span>
              Studio No. 029 • {isLit ? 'Atelier Illuminated' : 'Night Mode (Dimmed)'}
            </span>
          </div>

          <button
            onClick={() => setIsLit(!isLit)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-full text-[11px] font-mono tracking-wider transition-all duration-200 border border-white/30 cursor-pointer shadow-md mr-36 sm:mr-56 md:mr-72"
          >
            <Lightbulb
              className={`w-3.5 h-3.5 ${
                isLit ? 'text-amber-300 fill-amber-300' : 'text-stone-400'
              }`}
            />
            <span>{isLit ? 'Light ON' : 'Light OFF'}</span>
          </button>
        </div>

        {/* Content Overlay */}
        <div ref={contentRef} className="relative z-20 space-y-12">
          {/* Header Title Section */}
          <div ref={headerRef} className="max-w-xl sm:max-w-2xl space-y-3">
            <span
              className={`footer-reveal text-[10px] font-mono uppercase tracking-[0.3em] block transition-colors duration-500 ${
                isLit ? 'text-stone-700 font-semibold' : 'text-stone-400'
              }`}
            >
              {BRAND_INFO.fullName}
            </span>

            <h2
              className={`footer-reveal text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-[1.15] transition-colors duration-500 ${
                isLit ? 'text-stone-900 font-normal' : 'text-stone-100 font-light'
              }`}
            >
              Sculpting raw earth <br />
              <span
                className={`italic font-serif ${
                  isLit ? 'text-stone-800' : 'text-stone-300'
                }`}
              >
                into timeless living sanctuaries
              </span>
            </h2>
          </div>

          {/* Main Footer Links & Info Grid */}
          <div
            ref={columnsRef}
            className={`grid grid-cols-1 md:grid-cols-12 gap-10 pt-8 border-t transition-colors duration-500 ${
              isLit ? 'border-stone-400/60' : 'border-stone-800'
            }`}
          >
            {/* Column 1: Brand Info & Address */}
            <div className="footer-col md:col-span-5 space-y-5">
              <span
                className={`text-xs uppercase tracking-[0.3em] font-mono block font-semibold transition-colors ${
                  isLit ? 'text-stone-800' : 'text-white'
                }`}
              >
                Atelier Display
              </span>
              <p
                className={`text-xs font-light leading-relaxed max-w-sm transition-colors ${
                  isLit ? 'text-stone-800 font-normal' : 'text-stone-400'
                }`}
              >
                {BRAND_INFO.showroomSize}. Curated handcrafted decor pieces for discerning
                interiors in India and worldwide.
              </p>

              <div className="space-y-2 pt-2">
                <span
                  className={`text-[10px] uppercase tracking-[0.25em] font-mono block transition-colors ${
                    isLit ? 'text-stone-700 font-semibold' : 'text-stone-500'
                  }`}
                >
                  Atelier Address
                </span>
                <p
                  className={`flex items-start gap-2 text-xs font-light leading-relaxed max-w-sm transition-colors ${
                    isLit ? 'text-stone-900 font-normal' : 'text-stone-300'
                  }`}
                >
                  <MapPin
                    className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                      isLit ? 'text-amber-800' : 'text-amber-500'
                    }`}
                  />
                  <span>{BRAND_INFO.address}</span>
                </p>
              </div>
            </div>

            {/* Column 2: Contact & Hours */}
            <div className="footer-col md:col-span-4 space-y-5">
              <span
                className={`text-[10px] uppercase tracking-[0.25em] font-mono block transition-colors ${
                  isLit ? 'text-stone-700 font-semibold' : 'text-stone-500'
                }`}
              >
                Enquiries & Contact
              </span>

              <div className="text-xs space-y-2.5 font-light">
                <p
                  className={`flex items-center gap-2 transition-colors ${
                    isLit ? 'text-stone-900 font-normal' : 'text-stone-300'
                  }`}
                >
                  <Phone
                    className={`w-3.5 h-3.5 ${
                      isLit ? 'text-amber-800' : 'text-amber-500'
                    }`}
                  />
                  <a href={`tel:${BRAND_INFO.phoneDisplay}`} className="hover:underline font-medium">
                    +91 {BRAND_INFO.phoneDisplay}
                  </a>
                </p>
                <p
                  className={`transition-colors ${
                    isLit ? 'text-stone-800' : 'text-stone-400'
                  }`}
                >
                  Email:{' '}
                  <span
                    className={
                      isLit ? 'text-stone-950 font-medium' : 'text-stone-200'
                    }
                  >
                    {BRAND_INFO.email}
                  </span>
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <span
                  className={`text-[10px] uppercase tracking-[0.25em] font-mono block transition-colors ${
                    isLit ? 'text-stone-700 font-semibold' : 'text-stone-500'
                  }`}
                >
                  Showroom Hours
                </span>
                <p
                  className={`flex items-center gap-2 text-xs font-light transition-colors ${
                    isLit ? 'text-stone-900 font-normal' : 'text-stone-300'
                  }`}
                >
                  <Clock
                    className={`w-3.5 h-3.5 ${
                      isLit ? 'text-amber-800' : 'text-amber-500'
                    }`}
                  />
                  <span>{BRAND_INFO.timing}</span>
                </p>
              </div>
            </div>

            {/* Column 3: Navigation Links */}
            <div className="footer-col md:col-span-3 space-y-5">
              <span
                className={`text-[10px] uppercase tracking-[0.25em] font-mono block transition-colors ${
                  isLit ? 'text-stone-700 font-semibold' : 'text-stone-500'
                }`}
              >
                Navigation
              </span>
              <ul
                className={`space-y-2.5 text-xs tracking-wider transition-colors ${
                  isLit ? 'text-stone-800 font-medium' : 'text-stone-400 font-light'
                }`}
              >
                <li>
                  <Link
                    href="/philosophy"
                    className="hover:text-amber-800 hover:underline transition-colors"
                  >
                    Philosophy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/artisan-pieces"
                    className="hover:text-amber-800 hover:underline transition-colors"
                  >
                    Artisan Collection
                  </Link>
                </li>
                <li>
                  <Link
                    href="/materiality"
                    className="hover:text-amber-800 hover:underline transition-colors"
                  >
                    Tactile Materiality
                  </Link>
                </li>
                <li>
                  <Link
                    href="/our-story"
                    className="hover:text-amber-800 hover:underline transition-colors"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-amber-800 hover:underline transition-colors"
                  >
                    Contact & Enquiries
                  </Link>
                </li>
              </ul>

              <div className="pt-2">
                <MagneticButton dataCursor="explore">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[10px] uppercase tracking-[0.2em] transition-all duration-300 shadow-md ${
                      isLit
                        ? 'bg-stone-900 text-white hover:bg-black'
                        : 'bg-white text-black hover:bg-stone-200'
                    }`}
                  >
                    WhatsApp Direct <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Strip */}
        <div
          className={`relative z-20 pt-8 mt-10 border-t flex flex-col sm:flex-row items-center justify-between text-[10px] uppercase tracking-[0.2em] font-mono transition-colors duration-500 gap-4 ${
            isLit ? 'border-stone-400/60 text-stone-800 font-semibold' : 'border-stone-800 text-stone-500'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isLit ? 'bg-emerald-600 animate-pulse' : 'bg-stone-600'
              }`}
            />
            <span>
              © {new Date().getFullYear()} {BRAND_INFO.fullName}. ALL RIGHTS RESERVED.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span>RAJKOT • VOLTERRA • INTERNATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
