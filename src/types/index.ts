export interface Brand {
  name: string;
  fullName: string;
  tagline: string;
  heroStatement: string;
  whatsappNumber: string;
  phoneDisplay: string;
  phoneTel: string;
  email: string;
  address: string;
  city: string;
  showroomSize: string;
  timing: string;
  studioNo: string;
  domain: string;
}

export interface Product {
  slug: string;
  name: string;
  category: string;
  price: string;
  material: string;
  artisan: string;
  description: string;
  story: string;
  dimensions: string;
  weight: string;
  origin: string;
  image: string;
  featured?: boolean;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  origin: string;
  texture: string;
  lightBehavior: string;
  finish: string;
  description: string;
  defaultLightAngle: number;
  previewImage: string;
  macroImage: string;
  swatchImage: string;
}

export interface CraftStep {
  step: string;
  name: string;
  duration: string;
  artisanRole: string;
  description: string;
  principle: string;
  image: string;
  progress?: string;
}

export interface CollectionCategory {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  linkText: string;
  linkHref: string;
  image: string;
  imageAlt: string;
  ambientThumbs: Array<{
    src: string;
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    size: string;
  }>;
}
