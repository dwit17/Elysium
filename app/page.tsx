import React from 'react';
import ImageSequenceHero from '@/components/hero/ImageSequenceHero';
import PhilosophyTeaser from '@/components/sections/PhilosophyTeaser';
import ManifestoTypewriter from '@/components/sections/ManifestoTypewriter';
import FeaturedPieces from '@/components/sections/FeaturedPieces';
import StoryTeaser from '@/components/sections/StoryTeaser';

export default function HomePage() {
  return (
    <>
      <ImageSequenceHero />
      <PhilosophyTeaser />
      <ManifestoTypewriter />
      <FeaturedPieces />
      <StoryTeaser />
    </>
  );
}
