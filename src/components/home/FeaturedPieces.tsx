import React from 'react';
import { PRODUCTS } from '../../data/products';
import { createWhatsAppLink } from '../../data/brand';

export const FeaturedPieces: React.FC = () => {
  const featured = PRODUCTS.slice(0, 4);

  return (
    <section className="section-featured-pieces relative bg-black border-t border-stone-800 text-white z-10 overflow-hidden py-20 sm:py-24 lg:py-28 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-800 pb-3">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-[0.45em] uppercase text-amber-500 block">
              CURATED COLLECTION • PERMANENT SANCTUARY
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-wide text-white uppercase font-serif">
              Featured Pieces
            </h2>
          </div>
          <a href="/artisan-pieces" className="btn-slide-white inline-flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-[0.25em] font-semibold self-start md:self-auto">
            <span>View Full Collection</span>
            <span className="btn-arrow">&rarr;</span>
          </a>
        </div>

        {/* 4 Flagship Products Horizontal Grid */}
        <div className="featured-pieces-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p, idx) => (
            <div key={idx} className="featured-piece-card group flex flex-col justify-between bg-stone-950 p-3 sm:p-4 space-y-3 transition-all duration-300 shadow-xl rounded-sm" data-row={idx}>
              <div className="space-y-2.5">
                <div className="featured-piece-img-wrap relative w-full aspect-[4/3] overflow-hidden bg-stone-900 rounded-sm img-skeleton-wrap">
                  <div className="img-skeleton-placeholder"></div>
                  <img
                    src={p.image}
                    alt={`${p.name} - Handcrafted by ${p.artisan}`}
                    className="featured-piece-img image-blur-up w-full h-full object-cover object-center filter contrast-105 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    loading="lazy"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-baseline gap-2 min-h-[26px]">
                    <a href={`/artisan-pieces/${p.slug}`} className="relative inline-block product-name-link truncate">
                      <h3 className="text-base sm:text-lg font-light text-white uppercase font-serif tracking-wide truncate group-hover:text-amber-300 transition-colors">
                        {p.name}
                      </h3>
                      <span className="product-gold-underline absolute bottom-0 left-0 w-full h-px bg-amber-400 scale-x-0 origin-left transition-transform duration-300"></span>
                    </a>
                    <span className="text-xs font-mono text-amber-400 font-semibold tracking-wider whitespace-nowrap flex-shrink-0">
                      {p.price}
                    </span>
                  </div>

                  <div className="text-[9px] font-mono text-stone-400 uppercase tracking-widest min-h-[16px] flex items-center">
                    <span>{p.category}</span>
                    <span className="mx-1 text-stone-600">•</span>
                    <span className="truncate">{p.artisan}</span>
                  </div>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="pt-2.5 border-t border-stone-800/80 flex items-center justify-between gap-2 mt-auto">
                <a href={createWhatsAppLink(p.name)} target="_blank" rel="noopener noreferrer" className="btn-slide-white flex-1 text-center py-2 px-2 text-[9px] font-semibold uppercase tracking-[0.2em] shadow-md">
                  <span>Enquire</span>
                  <span className="btn-arrow ml-1">&rarr;</span>
                </a>
                <a href={`/artisan-pieces/${p.slug}`} className="btn-slide-subtle px-3 py-2 text-center text-[9px] font-mono uppercase tracking-widest">
                  <span>Details</span>
                  <span className="btn-arrow ml-1">&rarr;</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Closing Link Strip */}
        <div className="pt-1 text-center">
          <a href="/artisan-pieces" className="btn-slide-white inline-flex items-center gap-3 px-7 py-2.5 text-[10px] uppercase tracking-[0.25em] font-semibold shadow-xl">
            <span>Explore All Atelier Works</span>
            <span className="btn-arrow">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
};
