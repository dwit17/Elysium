import React from 'react';
import { Layout } from '../components/layout/Layout';
import { MATERIALS } from '../data/products';

export const MaterialityLab: React.FC = () => {
  return (
    <Layout currentPath="/materiality">
      <div className="pt-28 pb-24 bg-black text-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="max-w-2xl mb-16 space-y-4">
            <span className="text-[10px] tracking-[0.45em] uppercase text-amber-500 font-mono block">MEDIUM EXPLORATION</span>
            <h1 className="text-4xl sm:text-6xl font-light tracking-wide text-white uppercase font-sans">Tactile Materiality</h1>
            <p className="text-xs sm:text-sm text-stone-400 tracking-wider font-light leading-relaxed">Interact with our raw geomorphic stones, clay types, timber, and plant-based finishes.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-stone-400 block mb-2">Primary Mediums</span>
              {MATERIALS.map((m, idx) => (
                <div key={m.id} className="baroque-box-frame p-5">
                  <div className={`material-card space-y-2 cursor-pointer transition-all hover:border-amber-400/60 ${idx === 0 ? 'active-material' : ''}`} data-material-id={m.id} data-macro-img={m.macroImage} data-default-angle={m.defaultLightAngle} data-name={m.name}>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-stone-500 uppercase">{m.category}</span>
                      <span className="text-[9px] font-mono text-amber-500 tracking-wider">Default {m.defaultLightAngle}°</span>
                    </div>
                    <h3 className="text-base font-light text-white">{m.name}</h3>
                    <p className="text-xs text-stone-400 leading-relaxed font-light">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-7">
              <div className="baroque-box-frame p-8 flex flex-col justify-between h-full">
                <div className="flex justify-between items-center text-[10px] uppercase font-mono text-stone-400 border-b border-stone-800 pb-4 mb-6">
                  <span id="material-title-display">Travertine Stone</span>
                  <span id="light-angle-display">Incident Angle: 135°</span>
                </div>

                <div className="flex items-center justify-center p-4">
                  <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                    <img
                      id="material-preview-img"
                      src="/images/atelier_materials.jpg"
                      alt="Material preview"
                      className="w-full h-full object-cover grayscale brightness-90 transition-all duration-500 rounded-sm"
                    />
                    <div id="material-light-overlay" className="absolute inset-4 pointer-events-none mix-blend-overlay transition-all duration-300" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.75) 100%)' }}></div>
                    <button id="macro-zoom-btn" className="absolute top-6 right-6 text-xs font-mono uppercase text-stone-300 bg-black/80 backdrop-blur-md px-3 py-1.5 border border-stone-800 hover:bg-stone-900 transition-colors z-30">Macro Zoom</button>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-stone-800 mt-6">
                  <span className="text-xs text-stone-400 font-mono block">Rotate light angle to reveal surface crevices</span>
                  <input id="light-angle-slider" type="range" min="0" max="360" defaultValue="135" className="w-full accent-amber-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MaterialityLab;
