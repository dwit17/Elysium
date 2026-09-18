'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '@/components/ui/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

export default function PhilosophyTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const quoteBoxRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Timeline for Left Column & Quote
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        end: 'bottom 25%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.from(leftColRef.current?.querySelectorAll('.reveal-item') || [], {
      y: 40,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out',
    })
      .from(
        dividerRef.current,
        {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.6'
      )
      .from(
        quoteBoxRef.current,
        {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        },
        '-=0.7'
      )
      .from(
        pillarsRef.current?.querySelectorAll('.pillar-item') || [],
        {
          y: 35,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.5'
      );

    // Subtle parallax on the quote box during scroll
    gsap.to(quoteBoxRef.current, {
      y: -25,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="py-28 bg-[#000000] text-white border-t border-stone-800/80 px-6 md:px-12 lg:px-24 relative overflow-hidden"
    >
      {/* Subtle Background Glow Accent */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-stone-900/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Header */}
          <div ref={leftColRef} className="lg:col-span-5 space-y-6">
            <span className="reveal-item text-[10px] tracking-[0.45em] uppercase text-stone-400 font-mono block">
              Philosophical Foundation
            </span>
            <h2 className="reveal-item text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-white leading-tight font-sans">
              Designed for silence. Built for generations.
            </h2>
            <div ref={dividerRef} className="w-12 h-[1px] bg-stone-600 my-6" />
            <p className="reveal-item text-sm text-stone-400 leading-relaxed font-light max-w-md">
              At Elysium, we believe a home is a sanctuary where objects shouldn’t compete for attention. Our pieces are formed slowly with deep respect for raw earth mediums, letting each raw element radiate a quiet, elegant dignity.
            </p>
            <div className="reveal-item pt-4">
              <MagneticButton dataCursor="explore">
                <Link
                  href="/philosophy"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white hover:text-stone-300 font-medium transition-colors"
                >
                  Read Full Philosophy <ArrowUpRight className="w-4 h-4" />
                </Link>
              </MagneticButton>
            </div>
          </div>

          {/* Right Column Pillars Preview */}
          <div className="lg:col-span-7 space-y-8">
            <div
              ref={quoteBoxRef}
              className="bg-stone-900/60 p-8 md:p-10 border border-stone-800/90 text-white relative backdrop-blur-sm rounded-xs shadow-2xl transition-all duration-300 hover:border-stone-700"
            >
              <span className="absolute top-2 left-6 text-7xl font-serif text-stone-700/60 pointer-events-none select-none">
                “
              </span>
              <p className="text-lg md:text-xl font-light italic text-stone-300 leading-relaxed relative z-10 pl-4">
                The hand of the artisan creates a conversation with raw geological history. When you hold a vessel or rest on a carved console, you are interacting with limestone that lay quiet for five epochs before it was curated for your home.
              </p>
              <div className="mt-6 flex items-center justify-end space-x-3">
                <span className="h-[1px] w-8 bg-stone-500" />
                <span className="text-[10px] tracking-widest uppercase text-stone-400 font-mono">
                  Elysium Atelier
                </span>
              </div>
            </div>

            <div ref={pillarsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="pillar-item space-y-2 border-l border-stone-800/80 pl-4 hover:border-stone-500 transition-colors duration-300">
                <span className="text-xs font-mono text-stone-500 font-bold block">01</span>
                <h3 className="text-xs font-semibold tracking-wider text-white uppercase font-sans">
                  Purity of Origin
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed font-light">
                  Unrefined travertine, iron-dense clay, and slow-grown timber without synthetic coatings.
                </p>
              </div>

              <div className="pillar-item space-y-2 border-l border-stone-800/80 pl-4 hover:border-stone-500 transition-colors duration-300">
                <span className="text-xs font-mono text-stone-500 font-bold block">02</span>
                <h3 className="text-xs font-semibold tracking-wider text-white uppercase font-sans">
                  Wabi-Sabi Aesthetics
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed font-light">
                  Embracing organic fissures, geomorphic voids, and natural fire-speckled clay voices.
                </p>
              </div>

              <div className="pillar-item space-y-2 border-l border-stone-800/80 pl-4 hover:border-stone-500 transition-colors duration-300">
                <span className="text-xs font-mono text-stone-500 font-bold block">03</span>
                <h3 className="text-xs font-semibold tracking-wider text-white uppercase font-sans">
                  Silent Geometry
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed font-light">
                  Favoring quiet stillness—simple low proportions anchoring a room with calm authority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
