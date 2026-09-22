import React from 'react';

export const KeyholeSection: React.FC = () => {
  return (
    <section className="section-keyhole relative bg-[#020202] border-t border-stone-800 text-white py-16 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-4">
        <span className="text-[10px] font-mono tracking-[0.45em] uppercase text-amber-500 block">
          PORTAL TO PURITY
        </span>
        <h2 className="text-2xl sm:text-4xl font-light tracking-wide text-white uppercase font-serif">
          The Spatial Keyhole
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 font-light max-w-xl">
          An architectural aperture framing light, material tactility, and the quiet stillness of our Rajkot sanctuary.
        </p>
      </div>
    </section>
  );
};
