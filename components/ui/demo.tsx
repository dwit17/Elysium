// author: Khoa Phan <https://www.pldkhoa.dev>
// source: https://21st.dev/?qt=card&preview=%2F%40danielpetho%2Fcomponents%2Fstacking-cards

"use client";

import { useRef } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import StackingCards, {
  StackingCardItem,
} from "@/components/ui/stacking-cards";

const cards = [
  {
    bgColor: "bg-[#18181b]",
    tag: "01 / ARCHITECTURAL ANCHOR",
    title: "Unsealed Tivoli Travertine",
    description:
      "Unfilled geomorphic mineral pores and stratified cross-cut veins. Hand-chiseled from single limestone monoliths to absorb incident acoustic reflections while anchoring living spaces with raw tactile gravity.",
    image: "/images/atelier_materials.jpg",
  },
  {
    bgColor: "bg-[#27201c]",
    tag: "02 / TACTILE HARMONY",
    title: "Pit-Fired Silicate Clay",
    description:
      "Sculpted on manual kickwheels from Saurashtra alluvial riverbed deposits. Deliberately unglazed so its micro-capillary network breathes in natural equilibrium with ambient air, casting soft matte shadows.",
    image: "/images/story_clay_vessel.jpg",
  },
  {
    bgColor: "bg-[#1c1d18]",
    tag: "03 / LIVING TIMBER",
    title: "Slow-Grown Northern Oak",
    description:
      "Slow-grown white oak celebrating dense fibrous annual rings. Seasoned across multiple winters and buffed exclusively with unrefined desert beeswax and cold-pressed linseed oil for an enduring satin handfeel.",
    image: "/images/maker_tools.jpg",
  },
  {
    bgColor: "bg-[#1a1b1e]",
    tag: "04 / MONOLITHIC RELIEVO",
    title: "Pulverized Mineral Plaster",
    description:
      "Natural hydraulic lime compounded with fine volcanic silicate ash. Applied by hand trowels in delicate relief sweeps to craft non-reflective sculptural surfaces that softly diffuse room illumination.",
    image: "/images/story_plaster_relief.jpg",
  },
  {
    bgColor: "bg-[#161618]",
    tag: "05 / ATELIER PROVENANCE",
    title: "Architectural Harmonies",
    description:
      "The confluence of stone, fire-cured clay, brushed bronze, and slow-grown timber. Every piece engineered as a timeless spatial monolith designed to outlive trends and age with unmatched distinction.",
    image: "/images/chapter_living_room.jpg",
  },
];

export default function StackingCardsDemo() {
  const container = useRef<HTMLDivElement>(null);

  return (
    <div
      className="min-h-screen bg-[#060608] overflow-auto text-white"
      ref={container}
    >
      <StackingCards
        totalCards={cards.length}
        scrollOptions={{ container: container }}
        scaleMultiplier={0.035}
      >
        <div className="relative h-[120px] w-full z-10 text-xl md:text-2xl font-light uppercase flex flex-col justify-center items-center text-amber-400 tracking-[0.3em] whitespace-pre">
          <span>MATERIALITY ARCHIVE</span>
          <span className="text-xs text-stone-500 font-mono tracking-widest mt-1">Scroll to inspect &darr;</span>
        </div>
        {cards.map(({ bgColor, tag, description, image, title }, index) => {
          return (
            <StackingCardItem key={index} index={index} className="h-[100vh] flex items-center justify-center">
              <div
                className={cn(
                  bgColor,
                  "h-[78%] sm:h-[72%] flex-col sm:flex-row aspect-video px-8 py-10 flex w-11/12 max-w-6xl rounded-3xl mx-auto relative border border-stone-800 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden",
                )}
              >
                <div className="flex-1 flex flex-col justify-center pr-0 sm:pr-8">
                  <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-amber-400 mb-2">{tag}</span>
                  <h3 className="font-serif font-light text-2xl sm:text-4xl text-white mb-4 tracking-wide leading-tight">{title}</h3>
                  <p className="text-xs sm:text-sm font-light text-stone-300 leading-relaxed">{description}</p>
                </div>

                <div className="w-full sm:w-1/2 rounded-2xl aspect-video relative overflow-hidden border border-stone-800/80 mt-6 sm:mt-0">
                  <Image
                    src={image}
                    alt={title}
                    className="object-cover brightness-95 contrast-105"
                    fill
                  />
                </div>
              </div>
            </StackingCardItem>
          );
        })}

        <div className="w-full h-40 relative overflow-hidden flex items-center justify-center">
          <span className="text-sm font-mono tracking-[0.4em] uppercase text-stone-600">
            ELYSIUM ATELIER &bull; MATERIALITY SUITE
          </span>
        </div>
      </StackingCards>
    </div>
  );
}
