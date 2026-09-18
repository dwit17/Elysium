'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CRAFT_STEPS, BRAND_INFO } from '@/lib/constants';
import MagneticButton from '@/components/ui/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

export default function StoryTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Header reveal
    gsap.from(headerRef.current?.querySelectorAll('.header-reveal') || [], {
      y: 40,
      opacity: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: headerRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    // Cards staggered sequence with subtle scale up
    const cards = cardsRef.current?.querySelectorAll('.step-card') || [];
    gsap.from(cards, {
      y: 50,
      opacity: 0,
      scale: 0.97,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cardsRef.current,
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="py-28 bg-[#000000] text-white border-t border-stone-800/80 px-6 md:px-12 lg:px-24 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div
          ref={headerRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16"
        >
          <div className="lg:col-span-6 space-y-4">
            <span className="header-reveal text-[10px] tracking-[0.45em] uppercase text-stone-400 font-mono block">
              The Atelier Way
            </span>
            <h2 className="header-reveal text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-white font-sans">
              Craft Chronology
            </h2>
            <p className="header-reveal text-xs text-stone-400 tracking-wider font-light leading-relaxed max-w-md">
              Observe the meticulous intervals required to sculpt, dry, kiln, and hand-wax raw limestone, aged timber, and volcanic clay slabs in our {BRAND_INFO.showroomSize}.
            </p>
          </div>

          <div className="lg:col-span-6 lg:text-right header-reveal">
            <MagneticButton dataCursor="explore">
              <Link
                href="/our-story"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] px-6 py-3 border border-stone-700 text-stone-200 hover:text-black hover:bg-white transition-all duration-300 rounded-xs"
              >
                Discover Our Story <ArrowUpRight className="w-4 h-4" />
              </Link>
            </MagneticButton>
          </div>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CRAFT_STEPS.map((step) => (
            <div
              key={step.step}
              className="step-card bg-stone-900/60 border border-stone-800/90 p-8 space-y-6 flex flex-col justify-between rounded-xs backdrop-blur-sm transition-all duration-500 hover:border-stone-600 hover:-translate-y-1 shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-stone-400">
                    PHASE {step.step}
                  </span>
                  <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">
                    {step.duration}
                  </span>
                </div>

                <h3 className="text-xl font-light tracking-wide text-white uppercase font-sans">
                  {step.title}
                </h3>

                <p className="text-xs text-stone-400 leading-relaxed font-light">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-800/80 space-y-2">
                <span className="text-[9px] uppercase font-mono tracking-widest text-stone-500 block">
                  Primary Tools
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {step.tools.map((tool) => (
                    <span
                      key={tool}
                      className="text-[9px] font-mono px-2 py-1 bg-stone-950 text-stone-400 border border-stone-800/90"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
