import React from 'react';
import { Layout } from '../components/layout/Layout';

export const Terms: React.FC = () => {
  return (
    <Layout currentPath="/terms">
      <div className="pt-32 pb-24 max-w-4xl mx-auto px-6 text-white min-h-[60vh]">
        <h1 className="text-3xl font-light uppercase">Terms of Service</h1>
        <p className="text-xs text-stone-400 mt-6 leading-relaxed">
          All pieces are handcrafted from raw natural materials. Natural voids and fissures are inherent characteristics of wabi-sabi hand craftsmanship.
        </p>
      </div>
    </Layout>
  );
};

export default Terms;
