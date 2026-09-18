import React from 'react';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import { BRAND_INFO } from '@/lib/constants';

export const metadata: Metadata = generatePageMetadata(
  'Privacy Policy | Elysium Home Decor',
  'Privacy policy and data governance for Elysium Home Decor.',
  '/privacy-policy'
);

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-28 pb-24 bg-black text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <h1 className="text-3xl font-light uppercase tracking-wider mb-8">
          Privacy Policy
        </h1>
        <div className="space-y-6 text-xs text-stone-400 leading-relaxed font-light">
          <p>
            At {BRAND_INFO.fullName}, we respect your privacy. We collect personal information solely to process your artisan decor enquiries, direct communications, and showroom appointments.
          </p>
          <h2 className="text-sm uppercase text-white font-medium tracking-wide">
            1. Data Collection
          </h2>
          <p>
            When you submit an enquiry form or message us via WhatsApp, we receive your name, email address, phone number, and message context. We do not sell or rent your personal information to third parties.
          </p>
          <h2 className="text-sm uppercase text-white font-medium tracking-wide">
            2. Usage
          </h2>
          <p>
            Your information is used strictly to respond to inquiries, arrange consultations, and coordinate product fulfillment for your space.
          </p>
          <h2 className="text-sm uppercase text-white font-medium tracking-wide">
            3. Contact
          </h2>
          <p>
            For privacy inquiries, please reach out directly at {BRAND_INFO.email} or call +91 {BRAND_INFO.phoneDisplay}.
          </p>
        </div>
      </div>
    </div>
  );
}
