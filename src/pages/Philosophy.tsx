import React from 'react';
import { Layout } from '../components/layout/Layout';

export const Philosophy: React.FC = () => {
  return (
    <Layout currentPath="/philosophy">
      <div className="pt-28 pb-24 bg-black text-white">
        <section className="px-6 md:px-12 lg:px-24 py-16 max-w-7xl mx-auto border-b border-stone-800">
          <span className="text-[10px] tracking-[0.45em] uppercase text-amber-500 font-mono block">THE ELYSIUM ETHOS</span>
          <h1 className="text-4xl sm:text-6xl font-light tracking-wide leading-tight text-white uppercase font-sans mt-4">Designed for Silence. Built for Generations.</h1>
          <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-light pt-4 max-w-3xl">At Elysium, we believe a home is a sanctuary where objects shouldn’t compete for attention. Our pieces are formed slowly with deep respect for raw earth mediums, letting each raw element radiate a quiet, elegant dignity.</p>
        </section>

        <section className="px-6 md:px-12 lg:px-24 py-24 max-w-7xl mx-auto border-b border-stone-800">
          <h2 className="text-3xl font-light tracking-wide text-white uppercase font-sans mb-12">Three Pillars of Design</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="baroque-box-frame p-8">
              <span className="text-xs font-mono font-bold text-amber-500 block mb-3">PILLAR 01</span>
              <h3 className="text-xl font-light text-white uppercase mb-2">Purity of Origin</h3>
              <p className="text-xs text-stone-400 leading-relaxed font-light">We source only unrefined travertine, premium iron-dense clay, and slow-grow timber without synthetic coatings or chemical glues.</p>
            </div>
            <div className="baroque-box-frame p-8">
              <span className="text-xs font-mono font-bold text-amber-500 block mb-3">PILLAR 02</span>
              <h3 className="text-xl font-light text-white uppercase mb-2">Wabi-Sabi Aesthetics</h3>
              <p className="text-xs text-stone-400 leading-relaxed font-light">We embrace organic cracks, natural geomorphic voids, and firing speckles as the individual voice of the medium.</p>
            </div>
            <div className="baroque-box-frame p-8">
              <span className="text-xs font-mono font-bold text-amber-500 block mb-3">PILLAR 03</span>
              <h3 className="text-xl font-light text-white uppercase mb-2">Silent Geometry</h3>
              <p className="text-xs text-stone-400 leading-relaxed font-light">Simple low proportions, continuous physical cuts, and soft light absorption anchoring a room with calm authority.</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Philosophy;
