import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Product } from '../types';
import { createWhatsAppLink } from '../data/brand';

interface PieceDetailProps {
  product: Product;
}

export const PieceDetail: React.FC<PieceDetailProps> = ({ product }) => {
  const whatsappUrl = createWhatsAppLink(product.name);

  return (
    <Layout currentPath={`/artisan-pieces/${product.slug}`}>
      <div className="pt-28 pb-24 bg-black text-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="mb-8">
            <a href="/artisan-pieces" className="text-xs font-mono uppercase tracking-[0.2em] text-stone-400 hover:text-amber-300 transition-colors">&larr; Back to Artisan Collection</a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Image */}
            <div className="lg:col-span-7">
              <div className="baroque-box-frame overflow-hidden rounded-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto max-h-[70vh] object-cover object-center"
                />
              </div>
            </div>

            {/* Right Column: Information & Specs */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2 border-b border-stone-800 pb-6">
                <span className="text-[10px] tracking-[0.4em] uppercase text-amber-500 font-mono block">ARTISAN EDITION</span>
                <h1 className="text-3xl sm:text-4xl font-light tracking-wide text-white uppercase font-sans">{product.name}</h1>
                <p className="text-xs font-mono text-stone-400 uppercase tracking-widest pt-1">{product.material} • Formed by {product.artisan}</p>
                <div className="text-xl font-mono text-amber-400 pt-3">{product.price}</div>
              </div>

              <div className="space-y-4 text-xs text-stone-300 leading-relaxed font-light">
                <p>{product.description}</p>
                <p>{product.story}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-stone-800">
                <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-stone-400">Technical Specifications</h3>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono text-stone-300">
                  <div>
                    <span className="text-stone-500 block text-[10px]">DIMENSIONS</span>
                    <span>{product.dimensions}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">WEIGHT</span>
                    <span>{product.weight}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">PROVENANCE</span>
                    <span>{product.origin}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">CATEGORY</span>
                    <span>{product.category}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-slide-white block w-full py-3.5 text-center text-xs uppercase tracking-[0.25em] font-semibold">
                  <span>Enquire via WhatsApp &rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PieceDetail;
