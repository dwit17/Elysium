'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Sliders, Check } from 'lucide-react';
import { MATERIALS, MaterialItem } from '@/lib/constants';
import { createWhatsAppLink } from '@/lib/whatsapp';

export default function MaterialityPage() {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialItem>(MATERIALS[0]);
  const [lightAngle, setLightAngle] = useState<number>(135);
  const [macroZoom, setMacroZoom] = useState<boolean>(false);

  const whatsappUrl = createWhatsAppLink();

  return (
    <div className="pt-28 pb-24 bg-black text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="max-w-2xl mb-16 space-y-4">
          <span className="text-[10px] tracking-[0.45em] uppercase text-stone-400 font-mono block">
            MEDIUM EXPLORATION
          </span>
          <h1 className="text-4xl sm:text-6xl font-light tracking-wide text-white uppercase font-sans">
            Tactile Materiality
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 tracking-wider font-light leading-relaxed">
            Interact with our primary raw geomorphic stones, clay types, timber, and plant-based finishes. Discover how natural lighting alters surface depth and shadows across different angles.
          </p>
        </div>

        {/* Interactive Material Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch mb-24">
          {/* Left Selection Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-stone-400 block mb-2">
                Select Medium to Inspect
              </span>
              <div className="flex flex-col space-y-3">
                {MATERIALS.map((mat) => {
                  const isSelected = selectedMaterial.id === mat.id;
                  return (
                    <button
                      key={mat.id}
                      onClick={() => {
                        setSelectedMaterial(mat);
                        setLightAngle(mat.lightAngleDefault);
                      }}
                      className={`text-left p-5 border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-stone-900 text-white border-white'
                          : 'bg-black text-stone-400 border-stone-800 hover:bg-stone-950 hover:text-stone-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-stone-500">
                          {mat.category}
                        </p>
                        <p className="text-sm font-medium tracking-wide font-sans">
                          {mat.name}
                        </p>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tactile Signature Card */}
            <div className="bg-stone-900/60 p-6 border border-stone-800 space-y-4">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-stone-300" />
                <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400">
                  Tactile Signature
                </span>
              </div>
              <h4 className="text-sm tracking-wide font-medium text-stone-200">
                {selectedMaterial.tactileSignature}
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed font-light">
                {selectedMaterial.description}
              </p>
              <div className="space-y-2 pt-3 border-t border-stone-800">
                <span className="text-[9px] uppercase font-mono tracking-widest text-stone-500 block">
                  Key Characteristics
                </span>
                <ul className="space-y-1.5 text-xs text-stone-400 font-light">
                  {selectedMaterial.characteristics.map((char, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-stone-500 rounded-full" />
                      <span>{char}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Simulation Viewer */}
          <div className="lg:col-span-7 bg-stone-950 p-8 md:p-12 border border-stone-800 flex flex-col justify-between space-y-8 relative">
            <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-widest text-stone-400 border-b border-stone-800 pb-4">
              <span className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5" /> Light Simulation Engine
              </span>
              <span>Incident Angle: {lightAngle}°</span>
            </div>

            {/* Canvas / Image preview block */}
            <div className="flex-grow flex items-center justify-center p-4">
              <div className="relative w-full max-w-md aspect-square bg-stone-900 border border-stone-800 overflow-hidden flex items-center justify-center">
                <div
                  className={`w-64 h-64 relative overflow-hidden flex items-center justify-center border border-white/20 transition-transform duration-500 ${
                    macroZoom ? 'scale-125' : 'scale-100'
                  }`}
                >
                  <img
                    src={selectedMaterial.macroImage}
                    alt={selectedMaterial.name}
                    className="w-full h-full object-cover grayscale brightness-90 opacity-90"
                  />
                  {/* Dynamic lighting overlay gradient controlled by angle slider */}
                  <div
                    className="absolute inset-0 z-10 mix-blend-overlay pointer-events-none transition-all duration-300"
                    style={{
                      background: `linear-gradient(${lightAngle}deg, rgba(255, 255, 255, 0.4) 0%, rgba(0, 0, 0, 0.7) 100%)`,
                    }}
                  />
                </div>

                <div className="absolute bottom-4 left-4 text-[9px] tracking-widest font-mono text-stone-400 bg-black/80 px-3 py-1.5 border border-stone-800 uppercase">
                  Inspect: {selectedMaterial.name}
                </div>

                <button
                  onClick={() => setMacroZoom(!macroZoom)}
                  className="absolute top-4 right-4 text-xs font-mono uppercase tracking-widest text-stone-300 bg-black/80 hover:bg-stone-900 px-3 py-1.5 border border-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {macroZoom ? 'Reset View' : 'Macro Zoom'}
                </button>
              </div>
            </div>

            {/* Slider control */}
            <div className="space-y-3 pt-4 border-t border-stone-800">
              <div className="flex justify-between items-center text-xs text-stone-400 font-mono">
                <span>Rotate light angle to reveal geology crevices</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-[10px] font-mono tracking-widest text-stone-500">0°</span>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={lightAngle}
                  onChange={(e) => setLightAngle(Number(e.target.value))}
                  className="flex-grow accent-white h-1 bg-stone-800 rounded-lg cursor-ew-resize"
                />
                <span className="text-[10px] font-mono tracking-widest text-stone-500">360°</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
