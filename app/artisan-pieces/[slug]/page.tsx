import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, ShieldCheck, MapPin, Tag } from 'lucide-react';
import { ARTISAN_PRODUCTS, BRAND_INFO } from '@/lib/constants';
import { createWhatsAppLink } from '@/lib/whatsapp';
import { generatePageMetadata, getProductSchema, getBreadcrumbSchema } from '@/lib/seo';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ARTISAN_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = ARTISAN_PRODUCTS.find((p) => p.slug === slug);
  if (!product) return {};

  return generatePageMetadata(
    `${product.name} | Artisan Home Decor`,
    product.description,
    `/artisan-pieces/${product.slug}`,
    product.image
  );
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = ARTISAN_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const whatsappUrl = createWhatsAppLink(product.name);
  const productSchema = getProductSchema(product);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Artisan Pieces', path: '/artisan-pieces' },
    { name: product.name, path: `/artisan-pieces/${product.slug}` },
  ]);

  return (
    <div className="pt-28 pb-24 bg-black text-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        {/* Back link */}
        <div className="mb-8">
          <Link
            href="/artisan-pieces"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Artisan Collection
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Product Image */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/5] sm:aspect-[4/5] w-full bg-stone-900 border border-stone-800 overflow-hidden rounded-xs">
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute top-6 left-6 text-[9px] uppercase tracking-[0.25em] text-white bg-black/80 px-3 py-1.5 backdrop-blur-sm font-mono border border-white/10 z-10">
                {product.category}
              </div>
            </div>
          </div>

          {/* Product Info & Enquiry Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.4em] uppercase text-stone-400 font-mono block">
                ARTISAN EDITION
              </span>
              <h1 className="text-3xl sm:text-4xl font-light tracking-wide text-white uppercase font-sans">
                {product.name}
              </h1>
              <p className="text-xs font-mono text-stone-400 uppercase tracking-widest pt-1">
                {product.material} • Crafted by {product.artisan}
              </p>
            </div>

            <div className="p-6 bg-stone-900/50 border border-stone-800 space-y-4">
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                {product.description}
              </p>
              <div className="w-full h-[1px] bg-stone-800" />
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-mono tracking-widest text-stone-500 block">
                  Craft Story
                </span>
                <p className="text-xs text-stone-400 leading-relaxed font-light italic">
                  “{product.story}”
                </p>
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-stone-400">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                {product.dimensions && (
                  <div className="p-4 bg-stone-900/30 border border-stone-800">
                    <span className="text-[9px] text-stone-500 block uppercase">Dimensions</span>
                    <span className="text-stone-200 mt-1 block">{product.dimensions}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="p-4 bg-stone-900/30 border border-stone-800">
                    <span className="text-[9px] text-stone-500 block uppercase">Approx. Weight</span>
                    <span className="text-stone-200 mt-1 block">{product.weight}</span>
                  </div>
                )}
                {product.origin && (
                  <div className="p-4 bg-stone-900/30 border border-stone-800 col-span-2">
                    <span className="text-[9px] text-stone-500 block uppercase">Origin / Provenance</span>
                    <span className="text-stone-200 mt-1 block">{product.origin}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Enquire CTAs */}
            <div className="space-y-4 pt-4 border-t border-stone-800">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-white text-black text-xs font-semibold uppercase tracking-[0.25em] inline-flex items-center justify-center gap-2 hover:bg-stone-200 transition-colors"
              >
                ENQUIRE ABOUT THIS PIECE VIA WHATSAPP <ArrowUpRight className="w-4 h-4" />
              </a>

              <Link
                href={`/contact?piece=${encodeURIComponent(product.name)}`}
                className="w-full py-3.5 border border-stone-700 text-stone-300 text-xs uppercase tracking-[0.25em] inline-flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
              >
                Submit Form Enquiry
              </Link>
            </div>

            <div className="text-[10px] font-mono tracking-widest text-stone-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-stone-400" />
              <span>Direct artisan consultation • Worldwide shipping available</span>
            </div>
          </div>
        </div>

        {/* Other Curated Pieces */}
        {(() => {
          const otherPieces = ARTISAN_PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 4);
          if (otherPieces.length === 0) return null;
          return (
            <div className="mt-28 pt-16 border-t border-stone-800">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <span className="text-[10px] tracking-[0.4em] uppercase text-stone-400 font-mono block">
                    DISCOVER MORE
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-light tracking-wide text-white uppercase font-sans mt-1">
                    Other Curated Pieces
                  </h2>
                </div>
                <Link
                  href="/artisan-pieces"
                  className="text-xs uppercase tracking-[0.2em] font-mono text-stone-400 hover:text-white transition-colors"
                >
                  View All Pieces →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {otherPieces.map((item) => {
                  const itemWhatsapp = createWhatsAppLink(item.name);
                  return (
                    <div key={item.slug} className="group cursor-pointer flex flex-col justify-between space-y-4 h-full">
                      <div className="space-y-4">
                        <Link
                          href={`/artisan-pieces/${item.slug}`}
                          className="block relative aspect-[3/4] w-full bg-stone-900 overflow-hidden rounded-xs border border-stone-800"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0 opacity-85 group-hover:opacity-100"
                          />
                          <div className="absolute top-4 left-4 text-[8px] uppercase tracking-[0.25em] text-white bg-black/80 px-2.5 py-1 backdrop-blur-sm font-mono border border-white/10 z-10">
                            {item.category}
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
                          <Link href={`/artisan-pieces/${item.slug}`}>
                            <h3 className="text-sm font-medium text-white tracking-wide hover:text-stone-300 transition-colors font-sans line-clamp-1">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-[11px] font-mono text-stone-400 uppercase tracking-wider line-clamp-1">
                            {item.material} • By {item.artisan}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-stone-800/50">
                        <a
                          href={itemWhatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-stone-400 hover:text-white transition-colors"
                        >
                          Enquire <ArrowUpRight className="w-3 h-3" />
                        </a>
                        <Link
                          href={`/artisan-pieces/${item.slug}`}
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
          );
        })()}
      </div>
    </div>
  );
}
