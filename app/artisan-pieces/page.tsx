'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ARTISAN_PRODUCTS, Product } from '@/lib/constants';
import { createWhatsAppLink } from '@/lib/whatsapp';

const CATEGORIES = ['All', 'Furniture', 'Sculpture', 'Lighting', 'Vessels'];

export default function ArtisanPiecesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredProducts =
    selectedCategory === 'All'
      ? ARTISAN_PRODUCTS
      : ARTISAN_PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="pt-28 pb-24 bg-black text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        {/* Page Header */}
        <div className="mb-16 space-y-4">
          <span className="text-[10px] tracking-[0.45em] uppercase text-stone-400 font-mono block">
            ARTISAN CATALOGUE
          </span>
          <h1 className="text-4xl sm:text-6xl font-light tracking-wide text-white uppercase font-sans">
            Handcrafted Collection
          </h1>
          <p className="text-stone-400 text-xs sm:text-sm tracking-wider max-w-xl font-light leading-relaxed">
            Each item is crafted in limited numbers, cataloged with individual archive coordinates and artisan signatures. Formed from travertine, unglazed clay, ash-silicate, and slow-grown white oak.
          </p>
        </div>

        {/* Category Filter Bar */}
        <div className="flex flex-wrap gap-3 pb-12 mb-12 border-b border-stone-800">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 text-xs font-mono uppercase tracking-[0.2em] transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-black font-semibold'
                    : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800 border border-stone-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Product Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => {
            const whatsappUrl = createWhatsAppLink(product.name);
            return (
              <div key={product.slug} className="group cursor-pointer flex flex-col justify-between space-y-4 h-full">
                <div className="space-y-4">
                  <Link
                    href={`/artisan-pieces/${product.slug}`}
                    className="block relative aspect-[3/4] w-full bg-stone-900 overflow-hidden rounded-xs border border-stone-800"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0 opacity-85 group-hover:opacity-100"
                    />
                    <div className="absolute top-4 left-4 text-[8px] uppercase tracking-[0.25em] text-white bg-black/80 px-2.5 py-1 backdrop-blur-sm font-mono border border-white/10 z-10">
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
    </div>
  );
}
