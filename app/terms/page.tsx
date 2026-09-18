import React from 'react';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import { BRAND_INFO } from '@/lib/constants';

export const metadata: Metadata = generatePageMetadata(
  'Terms of Service | Elysium Home Decor',
  'Terms of service and atelier craft guidelines for Elysium Home Decor.',
  '/terms'
);

export default function TermsPage() {
  return (
    <div className="pt-28 pb-24 bg-black text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <h1 className="text-3xl font-light uppercase tracking-wider mb-8">
          Terms of Service
        </h1>
        <div className="space-y-6 text-xs text-stone-400 leading-relaxed font-light">
          <p>
            Welcome to {BRAND_INFO.fullName}. By exploring our digital showroom and initiating enquiries, you agree to the following terms.
          </p>
          <h2 className="text-sm uppercase text-white font-medium tracking-wide">
            1. Artisan Handcrafted Variations (Wabi-Sabi)
          </h2>
          <p>
            Each piece is crafted by hand using unrefined travertine limestone, stoneware clay, and natural white oak. Natural geomorphic voids, mineral fissures, and firing speckles are inherent characteristics of hand craftsmanship, not defects.
          </p>
          <h2 className="text-sm uppercase text-white font-medium tracking-wide">
            2. Enquiry-Based Model
          </h2>
          <p>
            This digital showroom serves as an editorial catalogue. Prices and custom specifications are confirmed individually via direct WhatsApp or email consultation.
          </p>
        </div>
      </div>
    </div>
  );
}
