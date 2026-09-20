'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ARTISAN_PRODUCTS } from '@/lib/constants';
import { createWhatsAppLink } from '@/lib/whatsapp';
import MagneticButton from '@/components/ui/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedPieces() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const featured = ARTISAN_PRODUCTS.filter((p) => p.featured).slice(0, 4);

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

    // Product cards staggered entrance
    const cards = gridRef.current?.querySelectorAll('.product-card') || [];
    gsap.from(cards, {
      y: 60,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: gridRef.current,
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
    });

    // Image Parallax within each card
    const images = gridRef.current?.querySelectorAll('.parallax-img') || [];
    images.forEach((img) => {
      gsap.fromTo(
        img,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: img.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="py-28 bg-[#000000] text-white border-t border-stone-800/80 px-6 md:px-12 lg:px-24 relative"
    >
      <div className="max-w-7xl mx-auto">
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-stone-800/80 pb-8"
        >
          <div className="space-y-3">
            <span className="header-reveal text-[10px] tracking-[0.45em] uppercase text-stone-400 font-mono block">
              Artisan Collection
            </span>
            <h2 className="header-reveal text-3xl lg:text-5xl font-light tracking-wide text-white uppercase font-sans">
              Selected Pieces
            </h2>
            <p className="header-reveal text-stone-400 text-xs tracking-wider max-w-sm mt-1 font-sans font-light">
              Crafted in limited numbers, cataloged with individual archive coordinates and artisan signatures.
            </p>
          </div>

          <div className="header-reveal">
            <MagneticButton dataCursor="explore">
              <Link
                href="/artisan-pieces"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] px-6 py-3 border border-stone-700 text-stone-200 hover:text-black hover:bg-white transition-all duration-300 rounded-xs"
              >
                View Full Collection <ArrowUpRight className="w-4 h-4" />
              </Link>
            </MagneticButton>
          </div>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((product) => {
            const whatsappUrl = createWhatsAppLink(product.name);
            return (
              <div
                key={product.slug}
                className="product-card group cursor-pointer flex flex-col justify-between space-y-4 h-full"
                data-cursor="view"
              >
                <div className="space-y-4">
                  <Link
                    href={`/artisan-pieces/${product.slug}`}
                    className="block relative aspect-[3/4] w-full bg-stone-900 overflow-hidden rounded-xs"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="parallax-img absolute inset-0 w-full h-[120%] -top-[10%] object-cover object-center transition-[filter,transform] duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0 opacity-85 group-hover:opacity-100"
                    />
                    <div className="absolute top-4 left-4 text-[8px] uppercase tracking-[0.25em] text-white bg-black/80 px-2.5 py-1 backdrop-blur-sm font-mono z-10">
                      {product.category}
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 z-10">
                      <div className="w-full flex items-center justify-between text-white">
                        <span className="text-[10px] tracking-[0.2em] uppercase font-mono">
                          View Details
                        </span>
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>

                  <div className="space-y-1">
                    <Link href={`/artisan-pieces/${product.slug}`}>
                      <h3 className="text-sm font-medium text-white tracking-wide hover:text-stone-300 transition-colors font-sans line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-[11px] font-mono text-stone-400 uppercase tracking-wider line-clamp-1">
                      {product.material} • By {product.artisan}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-stone-800/50">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-stone-400 hover:text-white transition-colors"
                  >
                    Enquire <ArrowUpRight className="w-3 h-3" />
                  </a>
                  <Link
                    href={`/artisan-pieces/${product.slug}`}
                    className="text-[10px] font-mono uppercase tracking-widest text-stone-500 hover:text-stone-300 transition-colors"
                  >
                    Specs →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
