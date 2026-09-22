import React from 'react';
import { Layout } from '../components/layout/Layout';

export const PrivacyPolicy: React.FC = () => {
  return (
    <Layout currentPath="/privacy-policy">
      <div className="pt-32 pb-24 max-w-4xl mx-auto px-6 text-white min-h-[60vh]">
        <h1 className="text-3xl font-light uppercase">Privacy Policy</h1>
        <p className="text-xs text-stone-400 mt-6 leading-relaxed">
          At Elysium, we collect personal information solely to process artisan decor enquiries and consultations. We do not share data with third parties.
        </p>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
