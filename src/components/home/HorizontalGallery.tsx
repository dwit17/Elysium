import React from 'react';
import { createWhatsAppLink } from '../../data/brand';

interface Chapter {
  index: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  specs: string[];
  ctaText: string;
  ctaHref: string;
}

export const HorizontalGallery: React.FC = () => {
  const horizontalChapters: Chapter[] = [
    {
      index: '01',
      tag: 'ORIGIN & TERRAIN',
      title: 'Vavdi Atelier, Rajkot',
      subtitle: '4,500 Sq. Ft. Dedicated Sanctuary',
      description: 'Where generational stone sculptors work directly with volcanic silicate ash, unsealed Italian travertine slabs, and aged white timber beams without synthetic binders.',
      image: '/images/chapter_living_room.jpg',
      specs: ['Coordinates: 22.2587° N, 70.8022° E', 'Hand-split limestone strata', 'Zero synthetic resins'],
      ctaText: 'Explore Atelier Provenance',
      ctaHref: '/our-story'
    },
    {
      index: '02',
      tag: 'MEDIUM & FORM',
      title: 'Solis Travertine Console',
      subtitle: 'Super Fine Italian Limestone',
      description: 'Extracted with diamond wire saws and carved over 40 hours of patient hand chiseling to create monolithic structural joins that absorb ambient room lighting.',
      image: '/images/atelier_materials.jpg',
      specs: ['Dimensions: 85cm x 160cm x 42cm', 'Approx. Weight: 68 kg', 'Price: ₹64,000'],
      ctaText: 'Enquire on WhatsApp',
      ctaHref: createWhatsAppLink('Solis Travertine Console')
    },
    {
      index: '03',
      tag: 'EARTH & FIRE',
      title: 'Caelum Stoneware Vessel',
      subtitle: 'Pit-Fired Silicate Clay',
      description: 'Thrown on traditional kickwheels and pit-fired at low temperatures with natural wood smoke to cultivate unique organic marbling across unglazed porous clay.',
      image: '/images/story_clay_vessel.jpg',
      specs: ['Material: Raw Iron-Dense Clay', 'Manual Kickwheel Turned', 'Price: ₹18,500'],
      ctaText: 'View Vessel Details',
      ctaHref: '/artisan-pieces/caelum-vessel'
    },
    {
      index: '04',
      tag: 'TIMBER & TIME',
      title: 'Monolith White Oak Chair',
      subtitle: 'Shou Sugi Ban & Beeswax',
      description: 'Slow-grown northern white oak celebrating fibrous satin grain patterns, buffed by hand with organic mountain beeswax and cold-pressed linseed oil.',
      image: '/images/chapter_bedroom.jpg',
      specs: ['Origin: Rajkot Atelier', 'Zero Chemical Lacquers', 'Price: ₹48,000'],
      ctaText: 'Discover Furniture Series',
      ctaHref: '/artisan-pieces'
    }
  ];

  return (
    <section className="section-horizontal-gallery relative bg-black border-t border-stone-800 overflow-hidden" id="horizontal-suite-container">
      {/* Pinned Viewport Container */}
      <div className="horizontal-pinned-track w-full min-h-screen lg:h-screen flex flex-col justify-center overflow-hidden">
        {/* Horizontal Slides Track */}
        <div className="horizontal-slides-wrapper flex h-full flex-nowrap will-change-transform" id="horizontal-track">
          {horizontalChapters.map((ch, idx) => (
            <div key={idx} className="horizontal-slide-panel flex-shrink-0 w-full lg:w-screen lg:min-w-[100vw] lg:max-w-[100vw] h-full flex items-center px-6 sm:px-12 md:px-16 lg:px-20 py-8 lg:py-6 relative" data-panel={idx}>
              <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                {/* Left Column: Chapter Description & Telemetry */}
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="text-2xl sm:text-4xl font-light text-white uppercase font-serif tracking-wide leading-tight">
                    {ch.title}
                  </h3>
                  <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest block">{ch.subtitle}</span>

                  <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-md">
                    {ch.description}
                  </p>

                  {/* Spec Pill List */}
                  <div className="space-y-1.5 pt-1">
                    {ch.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2.5 text-[10px] font-mono tracking-wider text-stone-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <a href={ch.ctaHref} target={ch.ctaHref.includes('http') ? '_blank' : '_self'} rel="noopener noreferrer" className="btn-slide-white inline-flex items-center gap-3 px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] shadow-lg">
                      <span>{ch.ctaText}</span>
                      <span className="btn-arrow">&rarr;</span>
                    </a>
                  </div>
                </div>

                {/* Right Column: Architectural Frame */}
                <div className="lg:col-span-7 flex justify-center">
                  <div className="horizontal-img-frame relative aspect-[16/10] max-h-[50vh] w-full overflow-hidden bg-stone-950 shadow-2xl rounded-sm group img-skeleton-wrap">
                    <div className="img-skeleton-placeholder"></div>
                    <img
                      src={ch.image}
                      alt={`${ch.title} - Elysium Atelier Handcrafted Decor`}
                      className="image-blur-up w-full h-full object-cover object-center filter contrast-105 transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none z-10"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
