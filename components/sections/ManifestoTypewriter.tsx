'use client';

import React, { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const MANIFESTO_TEXT =
  'Every curve is carved by patience. Every surface holds silence. We do not manufacture objects; we carve quiet sanctuaries out of stone, timber, and earth — designed not to fill space, but to give it stillness.';

const KEYWORDS = [
  { label: 'TRAVERTINE', origin: 'Tivoli Quarry' },
  { label: 'AGED TIMBER', origin: 'Sustainably Felled' },
  { label: 'VOLCANIC CLAY', origin: 'Deccan Plateau' },
  { label: 'CAST BRONZE', origin: 'Lost-Wax Cast' },
];

export default function ManifestoTypewriter() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLParagraphElement>(null);
  const progressBadgeRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const keywordsRef = useRef<HTMLDivElement>(null);
  const bgGlowRef = useRef<HTMLDivElement>(null);

  // Split text into individual character spans
  const characters = MANIFESTO_TEXT.split('');

  useEffect(() => {
    // Refresh ScrollTrigger after DOM mounts
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const textContainer = textContainerRef.current;
      if (!section || !textContainer) return;

      const charElements = textContainer.querySelectorAll('.type-char');
      const totalChars = charElements.length;

      // Initial state: visible as muted stone typography
      gsap.set(charElements, { opacity: 0.35, color: '#78716c' });
      gsap.set(keywordsRef.current?.children || [], { opacity: 0, y: 15 });

      // Master Pinned ScrollTrigger for Typewriting Up & Down
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=160%',
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = self.progress;

            // Update Progress Percentage Badge
            if (progressBadgeRef.current) {
              progressBadgeRef.current.textContent = `${Math.round(progress * 100)}%`;
            }
            // Update Progress Bar Line
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${progress * 100}%`;
            }

            // Calculate active character index based on scroll position
            const activeIndex = Math.min(
              Math.floor(progress * totalChars * 1.05),
              totalChars
            );

            // Dynamically highlight active vs pending characters on scroll up & down
            charElements.forEach((el, index) => {
              const htmlEl = el as HTMLElement;
              if (index <= activeIndex) {
                htmlEl.style.opacity = '1';
                htmlEl.style.color = '#ffffff';
                htmlEl.style.textShadow = '0 0 16px rgba(255,255,255,0.4)';
              } else {
                htmlEl.style.opacity = '0.35';
                htmlEl.style.color = '#78716c';
                htmlEl.style.textShadow = 'none';
              }
            });

            // Ambient background glow intensity based on scroll progress
            if (bgGlowRef.current) {
              gsap.set(bgGlowRef.current, {
                scale: 1 + progress * 0.5,
                opacity: 0.25 + progress * 0.45,
              });
            }
          },
        },
      });

      // Keywords reveal towards the end of scroll
      tl.to(
        keywordsRef.current?.children || [],
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.3,
          ease: 'power2.out',
        },
        0.75
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#060606] text-white border-t border-stone-800/80 overflow-hidden select-none flex flex-col justify-between py-12"
    >
      {/* Background Architectural Accent & Glow */}
      <div
        ref={bgGlowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-stone-700/20 rounded-full blur-[140px] pointer-events-none transition-transform"
      />

      {/* Decorative Subtle Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#29252415_1px,transparent_1px),linear-gradient(to_bottom,#29252415_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-50" />

      {/* Top Header Bar */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-24 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-[10px] tracking-[0.45em] uppercase text-stone-400 font-mono">
            02 • THE ARCHITECTURAL MANIFESTO
          </span>
        </div>

        {/* Live Scroll Typing Progress Badge */}
        <div className="flex items-center space-x-3">
          <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase">
            TYPED
          </span>
          <span
            ref={progressBadgeRef}
            className="text-xs font-mono font-semibold text-white px-3 py-1 bg-stone-900/90 border border-stone-700 rounded-xs shadow-md"
          >
            0%
          </span>
        </div>
      </div>

      {/* Main Center Typewriter Text Stage */}
      <div
        ref={containerRef}
        className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 lg:px-24 my-auto w-full py-8"
      >
        <div className="space-y-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-[1px] bg-stone-500" />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-stone-400">
              CORE PHILOSOPHY
            </span>
          </div>

          {/* Typewriter Interactive Text Container */}
          <p
            ref={textContainerRef}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light font-sans tracking-wide leading-[1.38] text-stone-300"
          >
            {characters.map((char, index) => (
              <span
                key={index}
                className="type-char transition-[opacity,color,text-shadow] duration-100 inline"
              >
                {char}
              </span>
            ))}
            {/* Blinking Luxury Caret */}
            <span className="inline-block w-[3px] h-[0.9em] bg-white ml-2 align-middle animate-[pulse_1s_infinite] shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
          </p>

          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-stone-400 block pt-2">
            — ELYSIUM SANCTUARY PRINCIPLE NO. 01
          </span>
        </div>
      </div>

      {/* Bottom Tray: Material Highlights + Scroll Progress Line */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-24 space-y-4">
        {/* Material Origin Highlights */}
        <div
          ref={keywordsRef}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-stone-800"
        >
          {KEYWORDS.map((kw, i) => (
            <div key={i} className="space-y-1">
              <span className="text-[9px] font-mono tracking-widest text-stone-400 block uppercase">
                {kw.origin}
              </span>
              <span className="text-xs font-mono font-semibold tracking-wider text-stone-200 block uppercase">
                {kw.label}
              </span>
            </div>
          ))}
        </div>

        {/* Global Scrubbed Progress Line */}
        <div className="w-full h-[2px] bg-stone-900 relative overflow-hidden rounded-full mt-4 border border-stone-800/50">
          <div
            ref={progressBarRef}
            className="absolute top-0 bottom-0 left-0 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-[width] duration-75"
            style={{ width: '0%' }}
          />
        </div>

        <div className="flex justify-between items-center text-[9px] font-mono tracking-[0.25em] text-stone-400 uppercase pt-1">
          <span>↓ SCROLL DOWN TO TYPE • ↑ SCROLL UP TO REVERSE</span>
          <span className="flex items-center gap-1.5 text-stone-300">
            <span>SCROLL CONTROLLED</span>
            <ArrowDown className="w-3 h-3 animate-bounce" />
          </span>
        </div>
      </div>
    </section>
  );
}
