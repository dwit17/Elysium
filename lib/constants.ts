export interface Product {
  slug: string;
  name: string;
  category: 'Furniture' | 'Sculpture' | 'Lighting' | 'Vessels';
  material: string;
  artisan: string;
  description: string;
  story: string;
  dimensions?: string;
  weight?: string;
  origin?: string;
  image: string;
  featured?: boolean;
}

export interface MaterialItem {
  id: string;
  name: string;
  category: string;
  description: string;
  tactileSignature: string;
  characteristics: string[];
  macroImage: string;
  lightAngleDefault: number;
}

export interface CraftStep {
  step: string;
  title: string;
  duration: string;
  description: string;
  tools: string[];
  supervisor: string;
  image: string;
}

export const BRAND_INFO = {
  name: 'ELYSIUM',
  fullName: 'ELYSIUM HOME DECOR',
  tagline: 'Artisan Minimalist Home Decor',
  heroStatement: 'Sculpted by nature’s hand, refined by patient artisans. Earth-bound designs featuring travertine, unglazed clay, and aged oak wood of absolute purity.',
  whatsappNumber: '918799587361',
  phoneDisplay: '8799587361',
  phoneTel: '+918799587361',
  email: 'enquire@elysiumhomedecor.in',
  address: 'Shree Bhaichand Mehta Ind. Area, Plot no. 29, Behind Hotel Krishna Park, Opposite KICH INDUSTRIES, Vavdi, Rajkot, Gujarat 360004',
  city: 'Rajkot, Gujarat, India',
  showroomSize: '4,500 sq. ft. Display Atelier',
  timing: 'Monday to Sunday: 9:30 AM – 7:30 PM',
  studioNo: '029 • Rajkot',
  tactility: 'Raw / Wabi-Sabi',
  inception: 'Rajkot / Volterra',
  domain: 'https://elysiumhomedecor.in',
};

export const ARTISAN_PRODUCTS: Product[] = [
  {
    slug: 'caelum-vessel',
    name: 'Caelum Vessel',
    category: 'Vessels',
    material: 'Organic Stoneware Clay',
    artisan: 'Matteo Ghiberti',
    description: 'A hand-turned vessel formed from raw iron-dense silicate clay, unglazed to preserve earthy tactility.',
    story: 'Extracted from riverbeds and aged in open-air pits for three months, the Caelum Vessel is thrown on a manual kickwheel. Each subtle surface ripple reflects the artisan’s hand.',
    dimensions: '32cm (H) x 24cm (W)',
    weight: '4.8 kg',
    origin: 'Tuscany / Atelier Rajkot',
    image: '/images/photo-1612196808214-b8e1d6145a8c',
    featured: true,
  },
  {
    slug: 'solis-travertine-console',
    name: 'Solis Travertine Console',
    category: 'Furniture',
    material: 'Super Fine Travertine Stone',
    artisan: 'Sandro Moretti',
    description: 'Architectural console carved from solid Italian travertine slabs with natural geomorphic veining.',
    story: 'Selected for its delicate honeyed pores and natural limestone stratification, the Solis Console requires 40 hours of precision hand chiseling to establish clean, continuous physical joins.',
    dimensions: '85cm (H) x 160cm (W) x 42cm (D)',
    weight: '68 kg',
    origin: 'Volterra Quarry / Rajkot Atelier',
    image: '/images/photo-1616486338812-3dadae4b4ace',
    featured: true,
  },
  {
    slug: 'estia-pendant-light',
    name: 'Estia Pendant Light',
    category: 'Lighting',
    material: 'Textured Lime Plaster Finish',
    artisan: 'Eleni Kora',
    description: 'Minimalist dome pendant emitting a warm downlight through hand-troweled lime plaster.',
    story: 'Constructed around a light wire skeleton and built up layer by layer with pulverized pumice and natural hydraulic lime. The exterior retains a soft, matte velvet feel.',
    dimensions: '45cm (Dia) x 38cm (H)',
    weight: '3.2 kg',
    origin: 'Peloponnese / Rajkot Atelier',
    image: '/images/photo-1507473885765-e6ed057f782c',
    featured: true,
  },
  {
    slug: 'monolith-lounge-chair',
    name: 'Monolith Lounge Chair',
    category: 'Furniture',
    material: 'Sculptural White Oak',
    artisan: 'Kenji Yoshino',
    description: 'Low-slung, solid timber chair carved from slow-grown northern white oak.',
    story: 'Inspired by Japanese joinery and brutalist architectural forms. Hand-buffed with organic mountain beeswax and linseed oil, exposing the dense, fibrous grain.',
    dimensions: '72cm (H) x 78cm (W) x 80cm (D)',
    weight: '24 kg',
    origin: 'Rajkot Studio',
    image: '/images/photo-1592078615290-033ee584e267',
    featured: true,
  },
  {
    slug: 'terra-plaster-relief',
    name: 'Terra Plaster Relief',
    category: 'Sculpture',
    material: 'Mineral Plaster & Ash',
    artisan: 'Elysium Collective',
    description: 'Monochromatic wall sculpture exploring light, depth, and shadow through natural plaster planes.',
    story: 'Constructed with layered plaster and volcanic silicate ash. Light across the room shifts the subtle shadow lines throughout the day.',
    dimensions: '120cm (H) x 90cm (W) x 6cm (D)',
    weight: '14.5 kg',
    origin: 'Rajkot Studio',
    image: '/images/photo-1615529182904-14819c35db37',
    featured: true,
  },
  {
    slug: 'aura-alabaster-bowl',
    name: 'Aura Alabaster Bowl',
    category: 'Vessels',
    material: 'Translucent Travertine Stone',
    artisan: 'Lorenzo Vane',
    description: 'Shallow stone bowl hollowed by hand from select dense travertine.',
    story: 'Each bowl features subtle geomorphic mineral voids that highlight the natural age of the raw stone block.',
    dimensions: '14cm (H) x 36cm (Dia)',
    weight: '6.2 kg',
    origin: 'Tuscany / Rajkot Atelier',
    image: '/images/photo-1578749556568-bc2c40e68b61',
    featured: false,
  },
  {
    slug: 'chronos-storage-jar',
    name: 'Chronos Storage Jar',
    category: 'Vessels',
    material: 'Unglazed Organic Clay',
    artisan: 'Dimitris Vance',
    description: 'Tall storage vessel with raw tactile exterior and hand-fitted ceramic stopper.',
    story: 'Pit-fired at low temperatures to allow natural smoke marbling across the clay surface.',
    dimensions: '48cm (H) x 26cm (Dia)',
    weight: '7.5 kg',
    origin: 'Rajkot Studio',
    image: '/images/photo-1600121848594-d8644e57abab',
    featured: false,
  },
  {
    slug: 'nidus-block-stool',
    name: 'Nidus Block Stool',
    category: 'Furniture',
    material: 'Sculptural White Oak',
    artisan: 'Stefan Meyer',
    description: 'Solid timber block carved with subtle concave seat ergonomics.',
    story: 'Milled from a single beam of seasoned white oak. Shou Sugi Ban char treatment emphasizes deep ring texture.',
    dimensions: '46cm (H) x 34cm (W) x 34cm (D)',
    weight: '18 kg',
    origin: 'Rajkot Studio',
    image: '/images/photo-1567538096630-e0c55bd6374c',
    featured: false,
  },
];

export const MATERIALS: MaterialItem[] = [
  {
    id: 'travertine',
    name: 'Travertine Stone',
    category: 'Medium 01',
    description: 'Unrefined geomorphic limestone formed by mineral springs, harvested in raw blocks and hand-chiseled to preserve natural voids.',
    tactileSignature: 'Cool, porous geomorphic surface with deep stratified mineral veins.',
    characteristics: [
      'Unfilled natural pores and limestone strata',
      'Harvested from historical quarries',
      'Zero synthetic resin sealing',
    ],
    macroImage: '/images/photo-1616486338812-3dadae4b4ace',
    lightAngleDefault: 135,
  },
  {
    id: 'clay',
    name: 'Organic Stoneware Clay',
    category: 'Medium 02',
    description: 'Iron-rich stoneware clay gathered from riverbeds, hand-turned on kickwheels and pit-fired at low temperatures.',
    tactileSignature: 'Earthy, matte texture with delicate fire-speckled variation.',
    characteristics: [
      'High mineral and iron oxide content',
      'Naturally breathable porous clay',
      'Hand-turned without high-speed electric wheels',
    ],
    macroImage: '/images/photo-1612196808214-b8e1d6145a8c',
    lightAngleDefault: 90,
  },
  {
    id: 'oak',
    name: 'Crafted Oak Timber',
    category: 'Medium 03',
    description: 'Heirloom white oak grown slowly in cooler climates to foster dense annual ring patterns and fibrous resilience.',
    tactileSignature: 'Warm, fibrous satin grain carved and wax-rubbed by hand.',
    characteristics: [
      'Dense, tight annual ring configurations',
      'Shou Sugi Ban smoke option natural tannins',
      'Organic mountain beeswax polish',
    ],
    macroImage: '/images/photo-1592078615290-033ee584e267',
    lightAngleDefault: 180,
  },
  {
    id: 'plaster',
    name: 'Textured Lime Plaster',
    category: 'Medium 04',
    description: 'Hydraulic lime combined with pulverized pumice stone, applied layer upon layer with hand trowels for a matte velvet finish.',
    tactileSignature: 'Soft, stone-like warmth that gently diffuses incident light.',
    characteristics: [
      'Breathable mineral composition',
      'Hand-troweled multi-coat application',
      'Absorbs and diffuses ambient room lighting',
    ],
    macroImage: '/images/photo-1507473885765-e6ed057f782c',
    lightAngleDefault: 45,
  },
];

export const CRAFT_STEPS: CraftStep[] = [
  {
    step: '01',
    title: 'Extraction & Selection',
    duration: '2 to 3 days per block',
    description: 'Our raw blocks are sourced directly from independent historical quarries in Tuscany and the Peloponnese, picking only blocks showing robust natural fault lines.',
    tools: ['Pneumatic splitting wedges', 'Diamond-tipped hand saws', 'Traditional iron picks'],
    supervisor: 'Sandro Moretti',
    image: '/images/photo-1616486338812-3dadae4b4ace(1)',
  },
  {
    step: '02',
    title: 'Precision Sculpting',
    duration: '15 to 30 hours per piece',
    description: 'Artisans execute shaping using traditional manual processes—chisels for stone, kickwheels for clay, and ancient copper saws for wood joints, keeping wood-glues and chemical compounds out of our processes.',
    tools: ['Manual kickwheels', 'Tempered iron flat chisels', 'Traditional copper joints'],
    supervisor: 'Kenji Yoshino & Matteo Ghiberti',
    image: '/images/photo-1612196808214-b8e1d6145a8c',
  },
  {
    step: '03',
    title: 'Tactile Hand Buffing',
    duration: '5 to 8 days of drying & curing',
    description: 'Instead of synthetic coatings, we hand-rub surfaces with pulverized pumice stone, linseed oil, and organic desert wax. This preserves natural wood breathing and the limestone aroma.',
    tools: ['Pulverized pumice stones', 'Purified natural mountain beeswax', 'Broad brush fiber rags'],
    supervisor: 'Eleni Kora',
    image: '/images/photo-1507473885765-e6ed057f782c(1)',
  },
];
