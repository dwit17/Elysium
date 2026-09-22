import React from 'react';
import { Layout } from '../components/layout/Layout';
import { PRODUCTS } from '../data/products';
import { createWhatsAppLink } from '../data/brand';

export const ArtisanPieces: React.FC = () => {
  return (
    <Layout currentPath="/artisan-pieces">
      <div className="pt-28 pb-24 bg-black text-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="mb-16 space-y-4">
            <span className="text-[10px] tracking-[0.45em] uppercase text-amber-500 font-mono block">ARTISAN CATALOGUE</span>
            <h1 className="text-4xl sm:text-6xl font-light tracking-wide text-white uppercase font-sans">Handcrafted Collection</h1>
          </div>

          <div id="category-filter-bar" className="flex flex-wrap gap-3 pb-12 mb-12 border-b border-stone-800">
            <button className="category-btn active" data-category="All">All</button>
            <button className="category-btn" data-category="Furniture">Furniture</button>
            <button className="category-btn" data-category="Sculpture">Sculpture</button>
            <button className="category-btn" data-category="Lighting">Lighting</button>
            <button className="category-btn" data-category="Vessels">Vessels</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRODUCTS.map(p => (
              <div key={p.slug} className="product-card group cursor-pointer flex flex-col justify-between space-y-4 h-full" data-category={p.category}>
                <div className="space-y-4">
                  <div className="wooden-art-frame aspect-[3/4] w-full relative overflow-hidden rounded-sm">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="absolute inset-0 w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <a href={`/artisan-pieces/${p.slug}`}><h3 className="text-sm font-medium text-white hover:text-amber-200 transition-colors">{p.name}</h3></a>
                    <p className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">{p.material} • By {p.artisan}</p>
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-stone-800/50">
                  <a href={createWhatsAppLink(p.name)} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-[0.2em] text-stone-400 hover:text-amber-300 transition-colors">Enquire &rarr;</a>
                  <a href={`/artisan-pieces/${p.slug}`} className="text-[10px] font-mono uppercase tracking-widest text-stone-500 hover:text-stone-300">Specs &rarr;</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ArtisanPieces;
