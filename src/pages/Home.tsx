import React from 'react';
import { HeroCanvas } from '../components/home/HeroCanvas';
import { ManifestoSection } from '../components/home/ManifestoSection';
import { HorizontalGallery } from '../components/home/HorizontalGallery';
import { MaterialityInterlude } from '../components/home/MaterialityInterlude';
import { LivingSanctuarySection } from '../components/home/LivingSanctuarySection';
import { CraftJourney } from '../components/home/CraftJourney';
import { FeaturedPieces } from '../components/home/FeaturedPieces';
import { TrustVoice } from '../components/home/TrustVoice';
import { Layout } from '../components/layout/Layout';

export const Home: React.FC = () => {
  return (
    <Layout currentPath="/">
      <HeroCanvas />
      <ManifestoSection />
      <HorizontalGallery />
      <MaterialityInterlude />
      <LivingSanctuarySection />
      <CraftJourney />
      <FeaturedPieces />
      <TrustVoice />
    </Layout>
  );
};

export default Home;
