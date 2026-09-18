'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Sparkles, Feather, ArrowDown } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createWhatsAppLink } from '@/lib/whatsapp';
import MagneticButton from '@/components/ui/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

const MANIFESTO_PARAGRAPH_1 =
  'Silence is not the absence of sound. It is the presence of architectural gravity.';

const MANIFESTO_PARAGRAPH_2 =
  'When you touch a console of raw travertine or an unglazed vessel, you interact with limestone that lay quiet for five geological epochs before it was shaped for your sanctuary.';

const MANIFESTO_PARAGRAPH_3 =
  'We do not design to occupy space. We design to give space stillness, dignity, and generational permanence.';

const PILLARS = [
  {
    num: '01',
    title: 'Purity of Origin',
    icon: ShieldCheck,
    desc: 'Unrefined travertine from Italian quarries, iron-dense riverbed clay, and slow-grown timber. We forbid synthetic fillers, polymer sealants, and industrial coatings. The material speaks in its purest geological voice.',
    badge: 'ZERO SYNTHETICS',
  },
  {
    num: '02',
    title: 'Wabi-Sabi Geometrics',
    icon: Sparkles,
    desc: 'We celebrate natural mineral voids, geomorphic fissures, and pit-fire speckles. These are not defects; they are the indelible fingerprint of raw earth sculpted by human hands.',
    badge: 'NATURAL VOIDS',
  },
  {
    num: '03',
    title: 'Silent Gravity',
    icon: Feather,
    desc: 'Low-slung proportions, clean monolithic joinery, and soft light absorption. Our pieces never compete for attention; they anchor the room with an unwavering, serene presence.',
    badge: 'TIMELESS PROPORTIONS',
  },
];

export default function PhilosophyPage() {
  const whatsappUrl = createWhatsAppLink();

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const pinnedManifestoRef = useRef<HTMLElement>(null);
  const wordsContainer1Ref = useRef<HTMLParagraphElement>(null);
  const wordsContainer2Ref = useRef<HTMLParagraphElement>(null);
  const wordsContainer3Ref = useRef<HTMLParagraphElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const progressBadgeRef = useRef<HTMLSpanElement>(null);
  const pillarsSectionRef = useRef<HTMLElement>(null);
  const ctaSectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // 1. Hero Entrance Animation
      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl
        .from('.hero-reveal', {
          y: 45,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
        })
        .from(
          '.hero-line',
          {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.6'
        );

      // 2. Peryton-Style Pinned Scroll-Driven Typographic Fill Engine
      const p1Words = wordsContainer1Ref.current?.querySelectorAll('.manifesto-word') || [];
      const p2Words = wordsContainer2Ref.current?.querySelectorAll('.manifesto-word') || [];
      const p3Words = wordsContainer3Ref.current?.querySelectorAll('.manifesto-word') || [];
      const allWords = [...p1Words, ...p2Words, ...p3Words];
      const totalWords = allWords.length;

      // Set initial dim ghost styling for unread words
      gsap.set(allWords, { opacity: 0.2, color: '#78716c' });

      // Master Pinned ScrollTrigger for the Manifesto
      ScrollTrigger.create({
        trigger: pinnedManifestoRef.current,
        start: 'top top',
        end: '+=250%',
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          // Update Progress Badge & Line
          if (progressBadgeRef.current) {
            progressBadgeRef.current.textContent = `${Math.round(progress * 100)}%`;
          }
          if (progressLineRef.current) {
            progressLineRef.current.style.width = `${progress * 100}%`;
          }

          // Compute exact illuminated word index
          const activeIndex = Math.min(
            Math.floor(progress * totalWords * 1.05),
            totalWords
          );

          allWords.forEach((wordEl, idx) => {
            const htmlEl = wordEl as HTMLElement;
            if (idx <= activeIndex) {
              htmlEl.style.opacity = '1';
              htmlEl.style.color = '#ffffff';
              htmlEl.style.textShadow = '0 0 20px rgba(255,255,255,0.4)';
              htmlEl.style.transform = 'translateY(0px)';
            } else {
              htmlEl.style.opacity = '0.2';
              htmlEl.style.color = '#78716c';
              htmlEl.style.textShadow = 'none';
              htmlEl.style.transform = 'translateY(2px)';
            }
          });
        },
      });

      // 3. Three Pillars Staggered Reveal
      gsap.from('.pillar-card', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: pillarsSectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      // 4. CTA Reveal
      gsap.from('.cta-reveal', {
        y: 35,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ctaSectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="pt-24 bg-[#050505] text-white selection:bg-white selection:text-black">
      {/* ------------------------------------------------------------------
          1. Hero Section
      ------------------------------------------------------------------ */}
      <section
        ref={heroRef}
        className="px-6 md:px-12 lg:px-24 py-20 md:py-28 max-w-7xl mx-auto border-b border-stone-800/80 relative overflow-hidden"
      >
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-stone-800/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="space-y-6 max-w-4xl relative z-10">
          <div className="flex items-center space-x-3 hero-reveal">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span className="text-[10px] tracking-[0.45em] uppercase text-stone-400 font-mono">
              THE ELYSIUM ETHOS & AESTHETIC DOCTRINE
            </span>
          </div>

          <h1 className="hero-reveal text-4xl sm:text-6xl lg:text-7xl font-light tracking-[0.08em] leading-[1.1] text-white uppercase font-sans">
            Designed for Silence. <br />
            <span className="italic font-serif text-stone-300">Built for Generations.</span>
          </h1>

          <div className="hero-line w-20 h-[1.5px] bg-stone-500 my-6" />

          <p className="hero-reveal text-sm sm:text-base text-stone-300 leading-relaxed font-light max-w-2xl pt-2">
            At Elysium, we believe a home is a sanctuary where objects shouldn’t compete for attention. Our pieces are formed slowly with deep respect for raw earth mediums, letting each raw element radiate quiet, architectural authority.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          2. Groundbreaking Peryton-Style Pinned Scroll Typography Section
      ------------------------------------------------------------------ */}
      <section
        ref={pinnedManifestoRef}
        className="relative w-full h-screen bg-[#070707] text-white border-b border-stone-800/80 overflow-hidden select-none flex flex-col justify-between py-10"
      >
        {/* Ambient Film-Style Radial Lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-stone-800/30 rounded-full blur-[160px] pointer-events-none" />

        {/* Decorative Architectural Hairlines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#29252418_1px,transparent_1px),linear-gradient(to_bottom,#29252418_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none opacity-60" />

        {/* Top Header Tag & Realtime Reading Percentage */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-24 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-[10px] tracking-[0.45em] uppercase text-stone-400 font-mono">
              MANIFESTO • CINEMATIC SCROLL READING
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase">
              READING PROGRESS
            </span>
            <span
              ref={progressBadgeRef}
              className="text-xs font-mono font-bold text-white px-3 py-1 bg-stone-900 border border-stone-700 rounded-xs shadow-lg"
            >
              0%
            </span>
          </div>
        </div>

        {/* Pinned Typographic Stage: 3 Phased Statements */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 lg:px-24 my-auto w-full space-y-10">
          {/* Statement 1: Lead Headline */}
          <p
            ref={wordsContainer1Ref}
            className="text-2xl sm:text-4xl lg:text-5xl font-light font-sans tracking-wide leading-[1.3] text-stone-300"
          >
            {MANIFESTO_PARAGRAPH_1.split(' ').map((word, idx) => (
              <span
                key={idx}
                className="manifesto-word inline-block mr-2.5 transition-[opacity,color,text-shadow,transform] duration-150"
              >
                {word}
              </span>
            ))}
          </p>

          <div className="w-12 h-[1px] bg-stone-700" />

          {/* Statement 2: Tactile Geology */}
          <p
            ref={wordsContainer2Ref}
            className="text-lg sm:text-2xl lg:text-3xl font-light font-sans tracking-wide leading-[1.4] text-stone-300 max-w-4xl"
          >
            {MANIFESTO_PARAGRAPH_2.split(' ').map((word, idx) => (
              <span
                key={idx}
                className="manifesto-word inline-block mr-2 transition-[opacity,color,text-shadow,transform] duration-150"
              >
                {word}
              </span>
            ))}
          </p>

          {/* Statement 3: Architectural Conclusion */}
          <p
            ref={wordsContainer3Ref}
            className="text-base sm:text-xl lg:text-2xl font-light italic font-serif tracking-wide leading-relaxed text-stone-300 max-w-3xl pt-2"
          >
            {MANIFESTO_PARAGRAPH_3.split(' ').map((word, idx) => (
              <span
                key={idx}
                className="manifesto-word inline-block mr-1.5 transition-[opacity,color,text-shadow,transform] duration-150"
              >
                {word}
              </span>
            ))}
          </p>
        </div>

        {/* Bottom Tray Progress Indicator */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-24 space-y-3">
          <div className="w-full h-[2px] bg-stone-900 relative overflow-hidden rounded-full border border-stone-800/60">
            <div
              ref={progressLineRef}
              className="absolute top-0 bottom-0 left-0 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] transition-[width] duration-75"
              style={{ width: '0%' }}
            />
          </div>

          <div className="flex justify-between items-center text-[9px] font-mono tracking-[0.25em] text-stone-400 uppercase">
            <span>↓ SCROLL TO ILLUMINATE WORDS • ↑ SCROLL TO DIM</span>
            <span className="flex items-center gap-1.5 text-stone-300">
              <span>CONTINUOUS TIME-SCROLL</span>
              <ArrowDown className="w-3 h-3 animate-bounce" />
            </span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          3. Value Pillars
      ------------------------------------------------------------------ */}
      <section
        ref={pillarsSectionRef}
        className="px-6 md:px-12 lg:px-24 py-28 max-w-7xl mx-auto border-b border-stone-800/80"
      >
        <div className="mb-16 space-y-3">
          <span className="text-[10px] tracking-[0.45em] uppercase text-stone-400 font-mono block">
            CORE FOUNDATION
          </span>
          <h2 className="text-3xl sm:text-5xl font-light tracking-wide text-white uppercase font-sans">
            Three Pillars of Design
          </h2>
          <p className="text-xs text-stone-400 tracking-wider font-light max-w-md">
            The foundational ethos governing every piece chiseled, thrown, and finished in our atelier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.num}
                className="pillar-card group space-y-6 bg-stone-900/60 p-8 md:p-10 border border-stone-800/90 rounded-xs backdrop-blur-sm transition-all duration-500 hover:border-stone-600 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between"
                data-cursor="explore"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xs bg-stone-950 border border-stone-800 flex items-center justify-center text-white group-hover:border-stone-600 transition-colors">
                      <Icon className="w-5 h-5 text-stone-300 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-stone-400 px-2.5 py-1 bg-stone-950 border border-stone-800">
                      {pillar.badge}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-stone-400 block tracking-widest">
                    PILLAR {pillar.num}
                  </span>

                  <h3 className="text-xl sm:text-2xl font-light text-white uppercase tracking-wider font-sans">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-stone-400 leading-relaxed font-light">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-stone-800/80">
                  <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-stone-500 group-hover:text-stone-300 transition-colors">
                    ELYSIUM STANDARDS →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------------
          4. Call to Enquire
      ------------------------------------------------------------------ */}
      <section
        ref={ctaSectionRef}
        className="px-6 md:px-12 lg:px-24 py-28 max-w-7xl mx-auto text-center space-y-8"
      >
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="cta-reveal text-[10px] font-mono tracking-[0.4em] uppercase text-stone-400 block">
            VISIT THE ATELIER
          </span>
          <h2 className="cta-reveal text-3xl sm:text-5xl font-light tracking-wide text-white uppercase font-sans">
            Experience the Philosophy in Person
          </h2>
          <p className="cta-reveal text-xs sm:text-sm text-stone-400 max-w-lg mx-auto font-light leading-relaxed">
            Visit our 4,500 sq. ft. Display Atelier in Rajkot to run your hands across our raw travertine slabs, or connect with our curators online.
          </p>
        </div>

        <div className="cta-reveal flex flex-wrap justify-center gap-4 pt-4">
          <MagneticButton dataCursor="explore">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-white text-black text-xs font-semibold uppercase tracking-[0.25em] inline-flex items-center gap-2 hover:bg-stone-200 transition-colors shadow-lg"
            >
              Enquire via WhatsApp <ArrowUpRight className="w-4 h-4" />
            </a>
          </MagneticButton>

          <MagneticButton dataCursor="explore">
            <Link
              href="/artisan-pieces"
              className="px-8 py-3.5 border border-stone-700 text-stone-200 text-xs uppercase tracking-[0.25em] hover:bg-white hover:text-black transition-all"
            >
              Explore Collection
            </Link>
          </MagneticButton>
        </div>
      </section>
    </div>
  );
}
