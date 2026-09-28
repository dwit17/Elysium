const express = require('express');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' || process.env.VERCEL === '1' ? '30d' : 0,
  etag: true,
}));

// Development Live Reload via SSE (Local environment only)
const liveReloadClients = new Set();
if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
  app.get('/dev/live-reload', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    liveReloadClients.add(res);
    req.on('close', () => liveReloadClients.delete(res));
  });

  app.get('/dev/ping', (req, res) => res.send('ok'));
  app.get('/favicon.ico', (req, res) => res.status(204).end());

  let reloadDebounceTimer = null;
  const broadcastReload = () => {
    if (reloadDebounceTimer) clearTimeout(reloadDebounceTimer);
    reloadDebounceTimer = setTimeout(() => {
      liveReloadClients.forEach(client => {
        try { client.write('data: reload\n\n'); } catch (e) {
          liveReloadClients.delete(client);
        }
      });
    }, 300);
  };

  const publicDir = path.join(__dirname, 'public');
  if (fs.existsSync(publicDir)) {
    try {
      fs.watch(publicDir, { recursive: true }, (eventType, filename) => {
        if (filename && /\.(css|js|html)$/i.test(filename)) {
          broadcastReload();
        }
      });
    } catch (e) {
      console.warn('[Elysium Dev] Watcher init skipped:', e.message);
    }
  }
}

// Testimonial Mandala SVG Inner Content
let TESTIMONIAL_SVG_INNER = '';
try {
  const rawSvg = fs.readFileSync(path.join(__dirname, 'public', 'testimonial-svg.svg'), 'utf8');
  const match = rawSvg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  TESTIMONIAL_SVG_INNER = match ? match[1] : rawSvg;
} catch (e) {
  console.warn('[Elysium] Error loading testimonial-svg.svg:', e.message);
}

// Brand Constants Data
const BRAND = {
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
  domain: 'https://elysiumhomedecor.in',
};

function createWhatsAppLink(productName) {
  let text = `Hello Elysium, I would like to enquire about your artisan home decor collection.`;
  if (productName) {
    text = `Hello Elysium, I am interested in inquiring about the "${productName}" piece from your collection. Could you please share more details and availability?`;
  }
  return `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

const PRODUCTS = [
  {
    slug: 'caelum-vessel',
    name: 'Caelum Vessel',
    category: 'Vessels',
    price: '₹18,500',
    material: 'Organic Stoneware Clay',
    artisan: 'Matteo Ghiberti',
    description: 'A hand-turned vessel formed from raw iron-dense silicate clay, unglazed to preserve earthy tactility.',
    story: 'Extracted from riverbeds and aged in open-air pits for three months, the Caelum Vessel is thrown on a manual kickwheel. Each subtle surface ripple reflects the artisan’s hand.',
    dimensions: '32cm (H) x 24cm (W)',
    weight: '4.8 kg',
    origin: 'Tuscany / Atelier Rajkot',
    image: '/images/story_clay_vessel.jpg',
    featured: true,
  },
  {
    slug: 'solis-travertine-console',
    name: 'Solis Travertine Console',
    category: 'Furniture',
    price: '₹64,000',
    material: 'Super Fine Travertine Stone',
    artisan: 'Sandro Moretti',
    description: 'Architectural console carved from solid Italian travertine slabs with natural geomorphic veining.',
    story: 'Selected for its delicate honeyed pores and natural limestone stratification, the Solis Console requires 40 hours of precision hand chiseling to establish clean, continuous physical joins.',
    dimensions: '85cm (H) x 160cm (W) x 42cm (D)',
    weight: '68 kg',
    origin: 'Volterra Quarry / Rajkot Atelier',
    image: '/images/chapter_living_room.jpg',
    featured: true,
  },
  {
    slug: 'estia-pendant-light',
    name: 'Estia Pendant Light',
    category: 'Lighting',
    price: '₹22,000',
    material: 'Textured Lime Plaster Finish',
    artisan: 'Eleni Kora',
    description: 'Minimalist dome pendant emitting a warm downlight through hand-troweled lime plaster.',
    story: 'Constructed around a light wire skeleton and built up layer by layer with pulverized pumice and natural hydraulic lime. The exterior retains a soft, matte velvet feel.',
    dimensions: '45cm (Dia) x 38cm (H)',
    weight: '3.2 kg',
    origin: 'Peloponnese / Rajkot Atelier',
    image: '/images/chapter_lighting.jpg',
    featured: true,
  },
  {
    slug: 'monolith-lounge-chair',
    name: 'Monolith Lounge Chair',
    category: 'Furniture',
    price: '₹48,000',
    material: 'Sculptural White Oak',
    artisan: 'Kenji Yoshino',
    description: 'Low-slung, solid timber chair carved from slow-grown northern white oak.',
    story: 'Inspired by Japanese joinery and brutalist architectural forms. Hand-buffed with organic mountain beeswax and linseed oil, exposing the dense, fibrous grain.',
    dimensions: '72cm (H) x 78cm (W) x 80cm (D)',
    weight: '24 kg',
    origin: 'Rajkot Studio',
    image: '/images/chapter_bedroom.jpg',
    featured: true,
  },
  {
    slug: 'terra-plaster-relief',
    name: 'Terra Plaster Relief',
    category: 'Sculpture',
    price: '₹32,000',
    material: 'Mineral Plaster & Ash',
    artisan: 'Elysium Collective',
    description: 'Monochromatic wall sculpture exploring light, depth, and shadow through natural plaster planes.',
    story: 'Constructed with layered plaster and volcanic silicate ash. Light across the room shifts the subtle shadow lines throughout the day.',
    dimensions: '120cm (H) x 90cm (W) x 6cm (D)',
    weight: '14.5 kg',
    origin: 'Rajkot Studio',
    image: '/images/story_plaster_relief.jpg',
    featured: true,
  },
  {
    slug: 'aura-alabaster-bowl',
    name: 'Aura Alabaster Bowl',
    category: 'Vessels',
    price: '₹14,000',
    material: 'Translucent Travertine Stone',
    artisan: 'Lorenzo Vane',
    description: 'Shallow stone bowl hollowed by hand from select dense travertine.',
    story: 'Each bowl features subtle geomorphic mineral voids that highlight the natural age of the raw stone block.',
    dimensions: '14cm (H) x 36cm (Dia)',
    weight: '6.2 kg',
    origin: 'Tuscany / Rajkot Atelier',
    image: '/images/atelier_materials.jpg',
    featured: true,
  },
  {
    slug: 'chronos-storage-jar',
    name: 'Chronos Storage Jar',
    category: 'Vessels',
    price: '₹16,500',
    material: 'Unglazed Organic Clay',
    artisan: 'Dimitris Vance',
    description: 'Tall storage vessel with raw tactile exterior and hand-fitted ceramic stopper.',
    story: 'Pit-fired at low temperatures to allow natural smoke marbling across the clay surface.',
    dimensions: '48cm (H) x 26cm (Dia)',
    weight: '7.5 kg',
    origin: 'Rajkot Studio',
    image: '/images/chapter_decor_accents.jpg',
    featured: false,
  },
  {
    slug: 'nidus-block-stool',
    name: 'Nidus Block Stool',
    category: 'Furniture',
    price: '₹26,000',
    material: 'Sculptural White Oak',
    artisan: 'Stefan Meyer',
    description: 'Solid timber block carved with subtle concave seat ergonomics.',
    story: 'Milled from a single beam of seasoned white oak. Shou Sugi Ban char treatment emphasizes deep ring texture.',
    dimensions: '46cm (H) x 34cm (W) x 34cm (D)',
    weight: '18 kg',
    origin: 'Rajkot Studio',
    image: '/images/chapter_dining.jpg',
    featured: false,
  },
];

const MATERIALS = [
  {
    id: 'travertine',
    name: 'Travertine Stone',
    category: 'Medium 01',
    description: 'Unrefined geomorphic limestone formed by mineral springs, harvested in raw blocks and hand-chiseled to preserve natural voids.',
    tactileSignature: 'Cool, porous geomorphic surface with deep stratified mineral veins.',
    characteristics: ['Unfilled natural pores and limestone strata', 'Harvested from historical quarries', 'Zero synthetic resin sealing'],
    macroImage: '/images/atelier_materials.jpg',
    lightAngleDefault: 135,
  },
  {
    id: 'clay',
    name: 'Organic Stoneware Clay',
    category: 'Medium 02',
    description: 'Iron-rich stoneware clay gathered from riverbeds, hand-turned on kickwheels and pit-fired at low temperatures.',
    tactileSignature: 'Earthy, matte texture with delicate fire-speckled variation.',
    characteristics: ['High mineral and iron oxide content', 'Naturally breathable porous clay', 'Hand-turned without high-speed electric wheels'],
    macroImage: '/images/story_clay_vessel.jpg',
    lightAngleDefault: 90,
  },
  {
    id: 'oak',
    name: 'Crafted Oak Timber',
    category: 'Medium 03',
    description: 'Heirloom white oak grown slowly in cooler climates to foster dense annual ring patterns and fibrous resilience.',
    tactileSignature: 'Warm, fibrous satin grain carved and wax-rubbed by hand.',
    characteristics: ['Dense, tight annual ring configurations', 'Shou Sugi Ban smoke option natural tannins', 'Organic mountain beeswax polish'],
    macroImage: '/images/maker_tools.jpg',
    lightAngleDefault: 180,
  },
  {
    id: 'plaster',
    name: 'Textured Lime Plaster',
    category: 'Medium 04',
    description: 'Hydraulic lime combined with pulverized pumice stone, applied layer upon layer with hand trowels for a matte velvet finish.',
    tactileSignature: 'Soft, stone-like warmth that gently diffuses incident light.',
    characteristics: ['Breathable mineral composition', 'Hand-troweled multi-coat application', 'Absorbs and diffuses ambient room lighting'],
    macroImage: '/images/story_plaster_relief.jpg',
    lightAngleDefault: 45,
  },
];

const MARQUEE_IMAGES = [
  {
    src: '/images-marquee/pexels-artbovich-6758245.webp',
    alt: 'Artisan Ceramic Sculpture and Handcrafted Form',
  },
  {
    src: '/images-marquee/pexels-cottonbro-4503266.webp',
    alt: 'Stone Masonry Atelier and Raw Material Sculpting',
  },
  {
    src: '/images-marquee/pexels-dropshado-34428636.webp',
    alt: 'Minimalist Architectural Geometry and Natural Lighting',
  },
  {
    src: '/images-marquee/pexels-efnanyll-16052116.webp',
    alt: 'Hand-Turned Terra Vessel with Mineral Patina',
  },
  {
    src: '/images-marquee/pexels-helloaesthe-16039832.webp',
    alt: 'Curated Aesthetic Living Interior and Sculptural Accents',
  },
  {
    src: '/images-marquee/pexels-icaro-breno-53443986-31858862.webp',
    alt: 'Raw Travertine Geomorphic Texture and Natural Pores',
  },
  {
    src: '/images-marquee/pexels-karola-g-5978722.webp',
    alt: 'Artisan Hand-Formed Stoneware Craftsmanship',
  },
  {
    src: '/images-marquee/pexels-karola-g-7193706.webp',
    alt: 'Tactile Earthenware Vessels and Studio Ceramics',
  },
  {
    src: '/images-marquee/pexels-leah-newhouse-50725-6480707%20(1).webp',
    alt: 'Sculpted Organic Clay Silhouette and Gentle Shadows',
  },
  {
    src: '/images-marquee/pexels-stephen-leonardi-587681991-37923286.webp',
    alt: 'Monolithic Mountain Quarry Stratification and Raw Slate',
  },
  {
    src: '/images-marquee/pexels-thevisionaryvows-33331303.webp',
    alt: 'Earthy Textured Lime Plaster Surface and Warm Tones',
  },
  {
    src: '/images-marquee/pexels-yusramizgingunay-15948887.webp',
    alt: 'Quiet Monastic Living Sanctuary with Handcrafted Stone',
  },
];

function renderProductImage({ src, alt, href = '', className = '', imgClassName = '', id = '', aspect = 'aspect-w-3 aspect-h-4' }) {
  const idAttr = id ? `id="${id}"` : '';
  const content = `
    <div class="product-img-container ${aspect} ${className}">
      <img src="${src}" alt="${alt}" class="${imgClassName}" ${idAttr} />
    </div>`;

  if (href) {
    return `<a href="${href}" class="block group">${content}</a>`;
  }
  return content;
}

function renderBaroqueBox({ content, className = '' }) {
  return `
  <div class="bg-white rounded-2xl border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-300 ${className}">
    <div class="relative z-10">${content}</div>
  </div>`;
}

// Master HTML Shell Generator
function renderPage({ title, description, path, content, isHeroPage = false }) {
  const canonical = `${BRAND.domain}${path === '/' ? '' : path}`;
  const whatsappUrl = createWhatsAppLink();

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND.fullName,
    url: BRAND.domain,
    logo: `${BRAND.domain}/images/logo.png`,
    description: BRAND.heroStatement,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shree Bhaichand Mehta Ind. Area, Plot no. 29, Behind Hotel Krishna Park, Opposite KICH INDUSTRIES, Vavdi',
      addressLocality: 'Rajkot',
      addressRegion: 'Gujarat',
      postalCode: '360004',
      addressCountry: 'IN',
    },
    telephone: BRAND.phoneTel,
    email: BRAND.email,
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:site_name" content="${BRAND.fullName}">
  <meta property="og:image" content="${BRAND.domain}/images/photo-1600121848594-d8644e57abab">
  <link rel="preload" href="/fonts/Geist-Light.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="preload" href="/fonts/Geist-Medium.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=STIX+Two+Text:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">
  ${isHeroPage ? '<link rel="preload" href="/hero-frames/ezgif-frame-001.jpg" as="image" fetchpriority="high">' : ''}
  <link rel="stylesheet" href="/css/tailwind.min.css">
  <link rel="stylesheet" href="/css/elysium.css?v=6.0">
  <script type="application/ld+json">${JSON.stringify(orgSchema)}</script>
</head>
<body class="bg-[#ececec] text-[#111111] selection:bg-black selection:text-white antialiased overflow-x-hidden">
  <!-- Master Wood & Brass Inlay Vector Definition -->
  <svg style="display: none;" xmlns="http://www.w3.org/2000/svg">
    <symbol id="wood-brass-inlay-symbol" viewBox="0 0 60 60">
      <g fill="currentColor" stroke="currentColor" stroke-width="0.8" stroke-linejoin="round">
        <path d="M 6,6 C 18,5 34,7 48,10 C 50,11 48,15 44,14 C 36,12 24,11 16,13 C 18,17 22,19 28,18 C 30,18 31,21 28,22 C 20,23 15,19 13,15 C 10,22 9,32 11,44 C 10,48 6,46 6,42 C 5,30 5,16 6,6 Z" opacity="0.95" />
        <path d="M 6,6 C 5,18 7,34 10,48 C 11,50 15,48 14,44 C 12,36 11,24 13,16 C 17,18 19,22 18,28 C 18,30 21,31 22,28 C 23,20 19,15 15,13 C 22,10 32,9 44,11 C 48,10 46,6 42,6 C 30,5 16,5 6,6 Z" opacity="0.95" />
        <path d="M 24,24 C 20,20 20,15 24,12 C 28,15 28,20 24,24 Z" fill="#ffd700" />
        <path d="M 24,24 C 28,20 33,20 36,24 C 33,28 28,28 24,24 Z" fill="#ffd700" />
        <path d="M 24,24 C 20,28 20,33 24,36 C 28,33 28,28 24,24 Z" fill="#ffd700" />
        <path d="M 24,24 C 20,20 15,20 12,24 C 15,28 20,28 24,24 Z" fill="#ffd700" />
        <circle cx="24" cy="24" r="2.5" fill="#fff5cc" />
        <path d="M 48,10 C 52,8 56,12 52,14 C 48,16 46,12 48,10 Z" fill="#ffd700" />
        <path d="M 10,48 C 8,52 12,56 14,52 C 16,48 12,46 10,48 Z" fill="#ffd700" />
        <circle cx="8" cy="8" r="1.5" fill="#fff" />
        <circle cx="38" cy="11" r="1.2" fill="#fff" />
        <circle cx="11" cy="38" r="1.2" fill="#fff" />
      </g>
    </symbol>
  </svg>

  <!-- Sticky Header (Mobile Rebuilt & Desktop Refined) -->
  <header class="site-header fixed top-0 left-0 right-0 z-50 font-sans transition-all duration-300">
    <div class="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center w-full h-16 md:h-20">
      <a href="/" class="header-logo-wrap flex items-center gap-3 cursor-pointer py-2 active:opacity-75 transition-opacity" aria-label="Elysium Home">
        <img src="/images/logo.png" alt="ELYSIUM" class="h-8 md:h-11 w-auto">
      </a>

      <!-- Desktop Navigation Bar -->
      <nav class="header-nav-wrap hidden lg:flex items-center space-x-8 text-[13px] font-medium tracking-[0.14em] uppercase text-stone-800">
        <a href="/philosophy" class="hover:text-black transition-colors ${path === '/philosophy' ? 'text-black font-semibold' : ''}">Philosophy</a>
        <a href="/artisan-pieces" class="hover:text-black transition-colors ${path === '/artisan-pieces' ? 'text-black font-semibold' : ''}">Artisan Pieces</a>
        <a href="/materiality" class="hover:text-black transition-colors ${path === '/materiality' ? 'text-black font-semibold' : ''}">Materiality</a>
        <a href="/our-story" class="hover:text-black transition-colors ${path === '/our-story' ? 'text-black font-semibold' : ''}">Our Story</a>
        <a href="/contact" class="hover:text-black transition-colors ${path === '/contact' ? 'text-black font-semibold' : ''}">Contact</a>
        <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary header-enquire-btn"><span>Enquire</span></a>
      </nav>

      <!-- Mobile Hamburger Button (<768px, 48px min tap target) -->
      <div class="flex lg:hidden items-center">
        <button id="mobile-menu-btn" class="text-black p-3.5 -mr-2 rounded-full active:bg-black/10 active:scale-95 transition-all flex items-center justify-center min-w-[48px] min-h-[48px]" aria-label="Open Navigation Menu" aria-expanded="false" aria-controls="mobile-menu-drawer">
          <svg class="w-6 h-6 stroke-current" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile Menu Full-Screen Overlay (100svh, 48px+ tap targets) -->
  <div id="mobile-menu-drawer" class="hidden fixed inset-0 z-[100] bg-[#ececec] text-[#111111] h-[100svh] min-h-[100svh] w-full flex flex-col justify-between p-6 sm:p-8 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Site Navigation">
    <div class="flex justify-between items-center w-full pt-1 pb-4 border-b border-black/[0.08]">
      <a href="/" class="flex items-center gap-2 active:opacity-75" aria-label="Elysium Home">
        <img src="/images/logo.png" alt="ELYSIUM" class="h-8 w-auto">
      </a>
      <button id="mobile-menu-close-btn" class="text-black min-w-[48px] min-h-[48px] rounded-full flex items-center justify-center text-3xl font-light active:bg-black/10 active:scale-95 transition-all" aria-label="Close Navigation Menu">&times;</button>
    </div>

    <nav class="flex flex-col py-6 space-y-3 font-light uppercase tracking-[0.18em]">
      <a href="/philosophy" class="mobile-nav-link text-stone-900 active:text-stone-500 min-h-[52px] flex items-center text-2xl border-b border-black/[0.04] transition-colors">Philosophy</a>
      <a href="/artisan-pieces" class="mobile-nav-link text-stone-900 active:text-stone-500 min-h-[52px] flex items-center text-2xl border-b border-black/[0.04] transition-colors">Artisan Pieces</a>
      <a href="/materiality" class="mobile-nav-link text-stone-900 active:text-stone-500 min-h-[52px] flex items-center text-2xl border-b border-black/[0.04] transition-colors">Materiality</a>
      <a href="/our-story" class="mobile-nav-link text-stone-900 active:text-stone-500 min-h-[52px] flex items-center text-2xl border-b border-black/[0.04] transition-colors">Our Story</a>
      <a href="/contact" class="mobile-nav-link text-stone-900 active:text-stone-500 min-h-[52px] flex items-center text-2xl border-b border-black/[0.04] transition-colors">Contact</a>
    </nav>

    <div class="pt-6 border-t border-black/[0.08] space-y-4">
      <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary w-full min-h-[52px] flex items-center justify-center text-center py-4 text-xs uppercase tracking-[0.2em] font-semibold rounded-full active:scale-[0.98] transition-transform">
        <span class="flex items-center gap-2">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
          Enquire via WhatsApp
        </span>
      </a>
    </div>
  </div>

  <!-- Mobile Floating Action Button (FAB) for WhatsApp (Always visible on mobile) -->
  <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" id="mobile-whatsapp-fab" class="mobile-whatsapp-fab md:hidden fixed bottom-6 right-5 z-40 w-13 h-13 min-w-[50px] min-h-[50px] rounded-full bg-[#181816] text-white flex items-center justify-center shadow-2xl border border-white/20 active:scale-90 transition-transform" aria-label="Quick WhatsApp Enquiry">
    <svg class="w-6 h-6 fill-current text-emerald-400" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
  </a>

  <!-- Page Content -->
  <main class="flex-grow">${content}</main>

  <!-- Master Interactive 100svh Footer with Volumetric Light Rays & Hanging Lamp -->
  <footer class="footer-fullscreen bg-black select-none text-stone-900 font-sans overflow-hidden relative min-h-[100svh] flex flex-col justify-between">
    <div id="footer-decor-container" class="footer-decor-fullscreen px-6 sm:px-12 md:px-16 lg:px-24 py-8 sm:py-10 md:py-12 transition-all duration-700 flex-grow flex flex-col justify-between">
      
      <!-- Pure Atmospheric Dark Canvas + Volumetric WebGL Light Rays -->
      <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div id="footer-rays-layer" class="absolute inset-0 z-10 pointer-events-none"></div>
        <div id="footer-light-beam"></div>
      </div>

      <!-- Hanging Animated Lamp (Click to Toggle Atelier Lighting) -->
      <div id="footer-bulb-btn" class="footer-hanging-lamp" title="Click lamp to toggle Atelier lighting">
        <div class="bell-root w-full h-full" style="font-size: calc(200px * 0.01); --_size: 200px; --base-clr: #78716c; --degofrot: 0.8;">
          <div id="footer-bell-container" class="bell-container" role="button" aria-pressed="true" tabindex="0">
            <div class="rope"></div>
            <div class="bell-top"></div>
            <div class="bell-base"></div>
            <div class="left-glow"></div>
            <div class="left-glow2"></div>
            <div class="r-glow"></div>
            <div class="r-glow2"></div>
            <div class="mid-ring"></div>
            <div class="mid-ring small"></div>
            <div class="glow"></div>
            <div class="glow2"></div>
            <div class="bell-buff-t"></div>
            <div class="bell-buff"></div>
            <div class="bell-btm"></div>
            <div class="bell-btm2"></div>
          </div>
        </div>
      </div>

      <!-- Light Control Indicator Banner -->
      <div class="relative z-20 flex items-center justify-between pb-4">
        <div id="footer-status-badge" class="inline-flex items-center gap-2 px-3.5 py-1.5 bg-black/10 backdrop-blur-md rounded-full text-[11px] font-mono uppercase tracking-[0.2em] text-[#181816] border border-black/10 shadow-sm transition-colors duration-500">
          <span id="footer-status-dot" class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          <span id="footer-status-text">Studio No. 029 • Atelier Illuminated</span>
        </div>
      </div>

      <!-- Content Overlay: Clean Vertical Stack on Mobile, 3 Columns on Desktop -->
      <div class="relative z-20 space-y-8 lg:space-y-8 my-auto w-full">
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-t transition-colors duration-500" id="footer-grid-border">
          <div class="w-full lg:max-w-2xl space-y-3 text-center lg:text-left">
            <span id="footer-brand-title" class="text-[11px] font-mono uppercase tracking-[0.3em] block font-semibold transition-colors duration-500">${BRAND.fullName}</span>
            <h2 id="footer-hero-head" class="text-[clamp(1.6rem,6.5vw,2.75rem)] font-light tracking-tight leading-[1.15] transition-colors duration-500 max-w-xl mx-auto lg:mx-0">
              Sculpting raw earth <br />
              <span id="footer-hero-sub" class="transition-colors duration-500">into timeless living sanctuaries</span>
            </h2>
          </div>
          <div class="w-full lg:w-auto">
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary w-full lg:w-auto min-h-[48px] py-3.5 px-8 flex items-center justify-center text-center gap-2 text-xs uppercase tracking-wider font-semibold rounded-full active:scale-[0.98] transition-transform">
              <span>WhatsApp Direct</span>
              <span class="btn-arrow">&rarr;</span>
            </a>
          </div>
        </div>

        <!-- Visit / Contact / Navigate: Single Column on Mobile with 32px Vertical Gap -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8 lg:gap-10 pt-2">
          <div class="md:col-span-5 space-y-3">
            <span class="footer-lbl text-xs uppercase tracking-[0.25em] font-mono block font-semibold text-stone-500">Visit</span>
            <p class="footer-txt text-xs font-light leading-relaxed max-w-sm">${BRAND.address}</p>
            <p class="footer-txt text-xs font-light pt-1 text-stone-600">${BRAND.timing}</p>
          </div>

          <div class="md:col-span-4 space-y-3">
            <span class="footer-lbl text-xs uppercase tracking-[0.25em] font-mono block font-semibold text-stone-500">Contact</span>
            <div class="text-xs space-y-2 font-light">
              <p class="footer-txt"><a href="tel:${BRAND.phoneTel}" class="hover:underline font-medium py-1.5 inline-block active:opacity-75">+91 ${BRAND.phoneDisplay}</a></p>
              <p class="footer-txt"><a href="mailto:${BRAND.email}" class="hover:underline py-1.5 inline-block active:opacity-75">${BRAND.email}</a></p>
            </div>
          </div>

          <div class="md:col-span-3 space-y-3">
            <span class="footer-lbl text-xs uppercase tracking-[0.25em] font-mono block font-semibold text-stone-500">Navigate</span>
            <ul class="space-y-3 md:space-y-2 text-xs font-medium">
              <li><a href="/philosophy" class="hover:underline transition-colors py-1 inline-block active:opacity-75">Philosophy</a></li>
              <li><a href="/artisan-pieces" class="hover:underline transition-colors py-1 inline-block active:opacity-75">Artisan Pieces</a></li>
              <li><a href="/materiality" class="hover:underline transition-colors py-1 inline-block active:opacity-75">Materiality</a></li>
              <li><a href="/our-story" class="hover:underline transition-colors py-1 inline-block active:opacity-75">Our Story</a></li>
              <li><a href="/contact" class="hover:underline transition-colors py-1 inline-block active:opacity-75">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom Bar: Small text, centered, wraps cleanly to two lines -->
      <div id="footer-bottom-strip" class="relative z-20 pt-6 mt-6 border-t flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono uppercase tracking-[0.16em] font-medium gap-3 sm:gap-4 transition-colors duration-500 text-center">
        <div class="flex items-center justify-center gap-2 flex-wrap">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
          <span>© ${new Date().getFullYear()} ${BRAND.fullName}. ALL RIGHTS RESERVED.</span>
        </div>
        <div class="flex items-center justify-center gap-6 pb-2 sm:pb-0">
          <a href="/privacy-policy" class="hover:underline transition-colors py-1">Privacy</a>
          <a href="/terms" class="hover:underline transition-colors py-1">Terms</a>
        </div>
      </div>

    </div>
  </footer>

  <!-- Footer Lighting Toggle Script -->
  <script>
    (function() {
      var isLit = true;
      var btn = document.getElementById('footer-bulb-btn');
      var bell = document.getElementById('footer-bell-container');
      var container = document.getElementById('footer-decor-container');
      var beam = document.getElementById('footer-light-beam');
      var statusTxt = document.getElementById('footer-status-text');
      var statusDot = document.getElementById('footer-status-dot');

      function toggleLighting() {
        isLit = !isLit;
        
        if (bell) {
          if (isLit) {
            bell.classList.remove('off');
            bell.setAttribute('aria-pressed', 'true');
          } else {
            bell.classList.add('off');
            bell.setAttribute('aria-pressed', 'false');
          }
        }

        if (typeof window.setFooterLightRaysActive === 'function') {
          window.setFooterLightRaysActive(isLit);
        }

        var badge = document.getElementById('footer-status-badge');
        if (isLit) {
          if(container) container.classList.remove('footer-night-mode');
          if(beam) beam.style.opacity = '1';
          if(statusTxt) statusTxt.innerText = 'Studio No. 029 • Atelier Illuminated';
          if(statusDot) statusDot.className = 'w-2 h-2 rounded-full bg-amber-500 animate-ping';
          if(badge) badge.className = 'inline-flex items-center gap-2 px-3.5 py-1.5 bg-black/10 backdrop-blur-md rounded-full text-[11px] font-mono uppercase tracking-[0.2em] text-[#181816] border border-black/10 shadow-sm transition-colors duration-500';
        } else {
          if(container) container.classList.add('footer-night-mode');
          if(beam) beam.style.opacity = '0';
          if(statusTxt) statusTxt.innerText = 'Studio No. 029 • Night Mode (Dimmed)';
          if(statusDot) statusDot.className = 'w-2 h-2 rounded-full bg-stone-700';
          if(badge) badge.className = 'inline-flex items-center gap-2 px-3.5 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-[11px] font-mono uppercase tracking-[0.2em] text-white border border-white/20 shadow-md transition-colors duration-500';
        }
      }

      if (btn) {
        btn.addEventListener('click', toggleLighting);
      }
      if (bell) {
        bell.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleLighting();
          }
        });
      }
    })();
  </script>

  <!-- GSAP, ScrollTrigger, MotionPathPlugin, Lenis & SplitType (Local Vendor Bundles) -->
  <script src="/js/vendor/gsap.min.js"></script>
  <script src="/js/vendor/ScrollTrigger.min.js"></script>
  <script src="/js/vendor/MotionPathPlugin.min.js"></script>
  <script src="/js/vendor/split-type.min.js"></script>
  <script src="/js/vendor/lenis.min.js"></script>

  <script src="/js/main.js"></script>
  <script src="/js/clickSpark.js?v=1.0"></script>
  <script src="/js/footerLightRays.js"></script>
  ${isHeroPage ? '<script src="/js/heroCanvas.js"></script>' : ''}
  <script src="/js/homeAnimations.js?v=6.0"></script>
</body>
</html>`;
}

// 1. Home Page Route with 5 Core Interactive Sections
app.get('/', (req, res) => {
  const whatsappUrl = createWhatsAppLink();
  const featuredProducts = PRODUCTS.filter(p => p.featured).slice(0, 6);

  // Categories for Section 2 (Collections Showcase)
  const collectionCategories = [
    {
      id: 'living-room',
      title: 'Living Room',
      eyebrow: 'CHAPTER 01',
      description: 'Architectural consoles in natural Italian travertine, low-slung lounge chairs, and hand-carved stone plinths anchoring the central home with quiet dignity.',
      linkText: 'Explore Living Room',
      linkHref: '/artisan-pieces',
      image: '/images/photo-1616486338812-3dadae4b4ace',
      imageAlt: 'Living Room Travertine Console & Minimalist Decor',
      ambientThumbs: [
        { src: '/images/photo-1612196808214-b8e1d6145a8c', top: '12%', left: '8%', size: 'w-16 h-16' },
        { src: '/images/photo-1578749556568-bc2c40e68b61', top: '72%', left: '14%', size: 'w-20 h-20' },
        { src: '/images/photo-1592078615290-033ee584e267', top: '20%', right: '10%', size: 'w-16 h-16' },
        { src: '/images/photo-1507473885765-e6ed057f782c', top: '78%', right: '15%', size: 'w-18 h-18' },
        { src: '/images/photo-1600121848594-d8644e57abab', top: '45%', left: '4%', size: 'w-14 h-14' },
      ],
    },
    {
      id: 'bedroom',
      title: 'Bedroom',
      eyebrow: 'CHAPTER 02',
      description: 'Serene minimalist silhouettes and tactile bedside forms crafted from solid seasoned oak and matte mineral plaster for restorative rest.',
      linkText: 'Explore Bedroom',
      linkHref: '/artisan-pieces',
      image: '/images/photo-1592078615290-033ee584e267',
      imageAlt: 'Sculptural White Oak Bedroom Seating and Plaster Relief',
      ambientThumbs: [
        { src: '/images/photo-1615529182904-14819c35db37', top: '15%', left: '10%', size: 'w-20 h-20' },
        { src: '/images/photo-1616486338812-3dadae4b4ace', top: '68%', left: '7%', size: 'w-16 h-16' },
        { src: '/images/photo-1567538096630-e0c55bd6374c', top: '22%', right: '8%', size: 'w-18 h-18' },
        { src: '/images/photo-1612196808214-b8e1d6145a8c', top: '75%', right: '12%', size: 'w-16 h-16' },
      ],
    },
    {
      id: 'dining',
      title: 'Dining',
      eyebrow: 'CHAPTER 03',
      description: 'Monolithic block tables, hand-turned vessel centerpieces, and seating with authentic wabi-sabi timber joins.',
      linkText: 'Explore Dining',
      linkHref: '/artisan-pieces',
      image: '/images/photo-1567538096630-e0c55bd6374c',
      imageAlt: 'Sculptural Oak Block Stool and Handcrafted Dining Decor',
      ambientThumbs: [
        { src: '/images/photo-1578749556568-bc2c40e68b61', top: '18%', left: '12%', size: 'w-16 h-16' },
        { src: '/images/photo-1600121848594-d8644e57abab', top: '65%', left: '8%', size: 'w-20 h-20' },
        { src: '/images/photo-1616486338812-3dadae4b4ace', top: '15%', right: '14%', size: 'w-16 h-16' },
        { src: '/images/photo-1507473885765-e6ed057f782c', top: '80%', right: '9%', size: 'w-18 h-18' },
      ],
    },
    {
      id: 'lighting',
      title: 'Lighting',
      eyebrow: 'CHAPTER 04',
      description: 'Pendant domes hand-troweled in pulverized pumice and lime plaster, diffusing incident room lighting with soft ambient warmth.',
      linkText: 'Explore Lighting',
      linkHref: '/artisan-pieces',
      image: '/images/photo-1507473885765-e6ed057f782c',
      imageAlt: 'Estia Textured Lime Plaster Pendant Light',
      ambientThumbs: [
        { src: '/images/photo-1612196808214-b8e1d6145a8c', top: '14%', left: '9%', size: 'w-16 h-16' },
        { src: '/images/photo-1615529182904-14819c35db37', top: '70%', left: '15%', size: 'w-18 h-18' },
        { src: '/images/photo-1592078615290-033ee584e267', top: '25%', right: '11%', size: 'w-20 h-20' },
        { src: '/images/photo-1578749556568-bc2c40e68b61', top: '75%', right: '6%', size: 'w-16 h-16' },
      ],
    },
    {
      id: 'decor-accents',
      title: 'Decor Accents',
      eyebrow: 'CHAPTER 05',
      description: 'Tactile stoneware vessels, relief sculptures, and raw alabaster bowls shaped by the patient touch of master craftsmen.',
      linkText: 'Explore Decor Accents',
      linkHref: '/artisan-pieces',
      image: '/images/photo-1612196808214-b8e1d6145a8c',
      imageAlt: 'Caelum Unglazed Stoneware Clay Vessel',
      ambientThumbs: [
        { src: '/images/photo-1615529182904-14819c35db37', top: '10%', left: '14%', size: 'w-20 h-20' },
        { src: '/images/photo-1600121848594-d8644e57abab', top: '65%', left: '8%', size: 'w-16 h-16' },
        { src: '/images/photo-1578749556568-bc2c40e68b61', top: '20%', right: '8%', size: 'w-18 h-18' },
        { src: '/images/photo-1616486338812-3dadae4b4ace', top: '78%', right: '12%', size: 'w-16 h-16' },
      ],
    },
  ];

  // HERO: Brand Opening Canvas
  const heroSection = `
  <div id="hero-scroll-container">
    <div class="hero-sticky-viewport">
      <canvas id="hero-canvas"></canvas>
      <div class="hero-vignette"></div>

      <!-- Minimal Hero Preloader (Logo only, Task 4) -->
      <div id="hero-preloader">
        <span class="text-sm uppercase tracking-[0.45em] text-stone-300 font-medium">ELYSIUM</span>
        <div class="preloader-track mt-4">
          <div id="preloader-progress-bar"></div>
        </div>
      </div>
    </div>
  </div>`;

  // SECTION 2: 1:1 LUSION RECREATION (HERO ON MOBILE: THE ATELIER / EVERY PIECE BEGINS WITH A NAME)
  const sectionManifestoAndExpedition = `
  <section id="section-lusion-reel" class="section-lusion-reel relative w-full overflow-visible select-none z-20" aria-label="Elysium Atelier Philosophy and Showreel">
    
    <!-- Static Mobile Background Picture Element (<768px, saves battery/data, zero video lag) -->
    <picture class="lusion-mobile-hero-bg absolute inset-0 w-full h-full pointer-events-none hidden max-md:block z-0">
      <source media="(max-width: 767px)" srcset="/images/atelier-immersive.jpg">
      <img src="/images/atelier-immersive.jpg" alt="Elysium Atelier Sanctuary" class="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.02]">
    </picture>
    <div class="lusion-mobile-hero-overlay absolute inset-0 bg-gradient-to-b from-[#ececec]/90 via-[#ececec]/75 to-[#ececec]/95 pointer-events-none hidden max-md:block z-[1]"></div>

    <!-- Pinned Viewport Container (Locks in on Desktop, 100svh Natural Flow on Mobile) -->
    <div id="lusion-reel-stage" class="lusion-reel-stage relative w-full h-screen overflow-hidden flex flex-col justify-between">
      
      <!-- 1. Dominant Typography & Intro Narrative (Headline, Paragraph, Pill CTA) -->
      <div id="lusion-reel-intro" class="lusion-reel-intro absolute inset-0 w-full h-full pointer-events-none z-20 flex flex-col justify-between">
        
        <!-- Top Section: Clamped Headline -->
        <div class="lusion-reel-top-block w-full">
          <div class="lusion-reel-title-block">
            <div class="lusion-reel-title-line line-1">
              <span class="lusion-title-text">Every Piece</span>
            </div>
            <div class="lusion-reel-title-line line-2">
              <span class="lusion-title-text">Begins with a Name.</span>
            </div>
          </div>
        </div>

        <!-- Paragraph and Pill Button (Stacked on mobile with thumb-sized button) -->
        <div class="lusion-reel-content-block">
          <p class="lusion-reel-desc font-light">
            We combine volcanic silicate ash, unsealed Italian travertine, and aged timber of absolute purity. From architectural stone monoliths to tactile vessels, every creation is hand-sculpted for eternity.
          </p>
          <div class="pt-5 sm:pt-6 pointer-events-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a href="/our-story" id="lusion-reel-approach-btn" class="lusion-pill-btn inline-flex items-center justify-center group w-full sm:w-auto min-h-[48px] active:scale-[0.98] transition-transform text-center" data-magnetic="true">
              <span class="lusion-pill-text">EXPLORE ATELIER PROVENANCE</span>
            </a>
            <!-- Mobile Direct Play Showreel Button -->
            <button id="lusion-mobile-play-btn" class="sm:hidden min-h-[48px] px-6 py-3.5 rounded-full bg-stone-900 text-white text-xs uppercase tracking-[0.18em] font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-transform" aria-label="Play Atelier Showreel">
              <svg class="w-4 h-4 fill-current text-white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              <span>Play Atelier Showreel</span>
            </button>
          </div>
        </div>

      </div>

      <!-- 2. Hardware-Accelerated WebGL Liquid Canvas Layer (Desktop only, hidden on mobile) -->
      <canvas id="lusion-webgl-canvas" class="lusion-webgl-canvas absolute inset-0 w-full h-full block z-20 pointer-events-none hidden md:block" data-src="/images/atelier-immersive.jpg"></canvas>

      <!-- 2.5. Interactive Scroll-Triggered SVG Drawing Path Layer (Desktop only) -->
      <div id="lusion-reel-svg-container" class="lusion-line-container absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible hidden md:block" aria-hidden="true">
        <svg
          id="lusion-reel-svg"
          class="lusion-svg-line w-full h-full"
          viewBox="0 0 1920 1080"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="lusionRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#141416" />
              <stop offset="35%" stop-color="#2a2a2e" />
              <stop offset="70%" stop-color="#4a4a52" />
              <stop offset="100%" stop-color="#18181b" />
            </linearGradient>
          </defs>

          <path
            id="lusion-draw-path-core"
            class="lusion-draw-path-core"
            d="M 0,0 C 80,40 480,180 540,460 C 590,720 480,940 320,950 C 170,960 90,830 130,680 C 180,520 480,460 820,520 C 1220,600 1620,720 1950,540"
            stroke="url(#lusionRibbonGrad)"
            stroke-width="34"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <!-- 3. Docked Reel Overlay UI ("PLAY ▶ ATELIER" & 5-Column Registration Marks - Desktop) -->
      <div id="lusion-reel-ui" class="lusion-reel-ui absolute inset-0 w-full h-full pointer-events-none z-30 hidden md:flex flex-col justify-center items-center opacity-0">
        
        <div class="lusion-reg-row lusion-reg-top absolute flex justify-between pointer-events-none">
          <span class="lusion-reg-plus">+</span>
          <span class="lusion-reg-plus">+</span>
          <span class="lusion-reg-plus">+</span>
          <span class="lusion-reg-plus">+</span>
          <span class="lusion-reg-plus">+</span>
        </div>

        <div id="lusion-play-trigger" class="lusion-play-cta-wrap flex items-center justify-center pointer-events-auto cursor-pointer">
          <span class="lusion-play-word lusion-word-left">PLAY</span>
          
          <button id="lusion-play-pill" class="lusion-play-pill mx-4 sm:mx-8 flex items-center justify-center transition-transform hover:scale-105" aria-label="Play Atelier Showreel">
            <svg class="w-6 h-6 text-black fill-current translate-x-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>

          <span class="lusion-play-word lusion-word-right">ATELIER</span>
        </div>

        <div class="lusion-reg-row lusion-reg-bottom absolute flex justify-between pointer-events-none">
          <span class="lusion-reg-plus">+</span>
          <span class="lusion-reg-plus">+</span>
          <span class="lusion-reg-plus">+</span>
          <span class="lusion-reg-plus">+</span>
          <span class="lusion-reg-plus">+</span>
        </div>

      </div>

    </div>

  </section>

  <!-- FULLSCREEN HIGH-DEFINITION VIDEO / SHOWREEL MODAL (100svh on mobile, large 48px tap targets, native controls) -->
  <div id="lusion-video-modal" class="lusion-video-modal fixed inset-0 z-[9999] bg-black/95 backdrop-blur-3xl flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-400 h-[100svh] w-full p-0 md:p-6" role="dialog" aria-modal="true" aria-label="Atelier Showreel Video Player">
    <!-- Large Corner Close Button (min 48px tap target) -->
    <button id="lusion-modal-close" class="lusion-modal-close fixed top-4 right-4 md:top-6 md:right-8 w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-stone-900/80 hover:bg-stone-800 text-white flex items-center justify-center text-2xl font-light cursor-pointer z-[10000] border border-white/20 active:scale-90 transition-transform" aria-label="Close Showreel Video">
      &times;
    </button>

    <div class="relative w-full h-full md:w-[92vw] md:max-w-6xl md:aspect-video md:h-auto rounded-none md:rounded-2xl overflow-hidden bg-black md:bg-stone-950 shadow-2xl md:border md:border-stone-800 flex items-center justify-center">
      <!-- Native Mobile Video Player with Controls -->
      <video id="lusion-modal-video" class="w-full h-full object-contain" playsinline controls preload="metadata" poster="/images/chapter_living_room.jpg">
        <source src="/video/atelier-showreel.mp4" type="video/mp4">
        Your browser does not support HTML5 video.
      </video>

      <!-- Visual Fallback Montage Carousel if native video isn't loaded -->
      <div id="lusion-modal-carousel" class="absolute inset-0 w-full h-full overflow-hidden pointer-events-none hidden">
        <img id="lusion-modal-img" src="/images/chapter_living_room.jpg" alt="Elysium Atelier Showreel Frame" class="w-full h-full object-cover transition-opacity duration-400" />
      </div>

      <div class="absolute bottom-4 left-6 right-6 hidden md:flex items-center justify-between text-white/80 text-[11px] font-mono tracking-widest pointer-events-none z-20">
        <span>ELYSIUM ATELIER &bull; RAJKOT SANCTUARY</span>
        <span id="lusion-modal-timer">SHOWREEL &bull; ARTISAN CRAFT</span>
      </div>
    </div>
  </div>`;

  // SECTION 3: SPATIAL LIVING SANCTUARY • ARCHITECTURAL PROGRESSION (100VH STACKING CARDS DECK)
  const sectionLivingSanctuary = `
  <section class="elysium-stack-section relative bg-[#070708] border-t border-stone-800/80 text-white select-none overflow-hidden" id="spatial-sanctuary-container" aria-label="Spatial Living Sanctuary • Architectural Progression">
    
    <!-- Desktop Pinned Stacking Viewport Stage (100vh) - Hidden on Mobile (<768px) -->
    <div class="elysium-stack-stage relative w-full h-screen overflow-hidden hidden md:flex items-center justify-center" id="sanctuary-stack-stage">
      
      <!-- The 100vh Stacking Cards Arena -->
      <div class="elysium-stack-arena relative w-full h-full overflow-hidden flex items-center justify-center" id="sanctuary-stack-arena">
        
        <!-- CARD 01: Travertine (Bright: Warm Italian Limestone) -->
        <article class="elysium-stack-card" data-card-idx="0" aria-label="Travertine — The Guiding Stone">
          <div class="elysium-stack-slab card-mat-travertine card-theme-light">
            <div class="elysium-stack-shade"></div>

            <div class="elysium-stack-content">
              <h3 class="elysium-stack-title">The Guiding Stone</h3>
              <p class="elysium-stack-desc">
                Hand-chiseled from monolithic Italian limestone, each block retains its geomorphic pores and stratified veins, anchoring the room with enduring raw mass and quiet architectural reverence.
              </p>
            </div>

            <div class="elysium-stack-media">
              <img src="/images/chapter_living_room.jpg" alt="Travertine Sanctuary Console" class="elysium-stack-img" loading="eager" />
            </div>
          </div>
        </article>

        <!-- CARD 02: Stoneware (Dark: Smoked Raw Clay & Obsidian) -->
        <article class="elysium-stack-card" data-card-idx="1" aria-label="Stoneware — Unglazed Vessels">
          <div class="elysium-stack-slab card-mat-stoneware card-theme-dark">
            <div class="elysium-stack-shade"></div>

            <div class="elysium-stack-content">
              <h3 class="elysium-stack-title">Unglazed Stoneware</h3>
              <p class="elysium-stack-desc">
                Sculpted on manual kickwheels from iron-dense riverbed clay and fired at 1,240&deg;C in wood-reduction pits. The raw porous surface breathes in equilibrium with ambient space.
              </p>
            </div>

            <div class="elysium-stack-media">
              <img src="/images/story_clay_vessel.jpg" alt="Unglazed Stoneware Vessels" class="elysium-stack-img" loading="lazy" />
            </div>
          </div>
        </article>

        <!-- CARD 03: Mineral Plaster (Bright: Neutral Architectural Plaster) -->
        <article class="elysium-stack-card" data-card-idx="2" aria-label="Mineral Plaster Relievo">
          <div class="elysium-stack-slab card-mat-plaster card-theme-light">
            <div class="elysium-stack-shade"></div>

            <div class="elysium-stack-content">
              <h3 class="elysium-stack-title">Mineral Relievo</h3>
              <p class="elysium-stack-desc">
                Hand-troweled in successive strata of volcanic pumice and lime plaster. Zero-glare matte velvet surfaces project soft daylight gradients throughout the sanctuary.
              </p>
            </div>

            <div class="elysium-stack-media">
              <img src="/images/story_plaster_relief.jpg" alt="Mineral Plaster Relievo" class="elysium-stack-img" loading="lazy" />
            </div>
          </div>
        </article>

        <!-- CARD 04: Aged Oak (Dark: Smoked Oak & Charcoal) -->
        <article class="elysium-stack-card" data-card-idx="3" aria-label="Aged Oak & Beeswax">
          <div class="elysium-stack-slab card-mat-oak card-theme-dark">
            <div class="elysium-stack-shade"></div>

            <div class="elysium-stack-content">
              <h3 class="elysium-stack-title">Aged Oak &amp; Beeswax</h3>
              <p class="elysium-stack-desc">
                United through blind mortise and tenon joinery with zero hardware fasteners or toxic adhesives. Finished with hand-buffed organic beeswax for living tactile warmth.
              </p>
            </div>

            <div class="elysium-stack-media">
              <img src="/images/atelier_materials.jpg" alt="Aged Oak Woodcraft" class="elysium-stack-img" loading="lazy" />
            </div>
          </div>
        </article>

        <!-- CARD 05: Spatial Synthesis (Bright: Warm Mineral Stone) -->
        <article class="elysium-stack-card" data-card-idx="4" aria-label="Spatial Synthesis">
          <div class="elysium-stack-slab card-mat-synthesis card-theme-light">
            <div class="elysium-stack-shade"></div>

            <div class="elysium-stack-content">
              <h3 class="elysium-stack-title">Spatial Synthesis</h3>
              <p class="elysium-stack-desc">
                Where monolithic stone, breathable earthenware, and unlacquered timber exist in mutual restraint—transitioning from architecture into an enduring sanctuary of stillness.
              </p>
            </div>

            <div class="elysium-stack-media">
              <img src="/images/chapter_bedroom.jpg" alt="Spatial Synthesis Sanctuary" class="elysium-stack-img" loading="lazy" />
            </div>
          </div>
        </article>

      </div>

    </div>

    <!-- Mobile Normal-Flow Vertical Stack (<768px: image top, heading, paragraph, 24px sides, 48px gap, zero pinning) -->
    <div class="mobile-story-chapters block md:hidden px-6 py-14 space-y-12 bg-[#070708]">
      <div class="text-center pb-2">
        <span class="text-[10px] font-mono tracking-[0.35em] uppercase text-stone-500 block mb-1">PROVENANCE &amp; MATERIALITY</span>
        <h2 class="text-2xl font-light text-white uppercase tracking-wider">Story Chapters</h2>
      </div>

      <!-- Chapter 01 -->
      <article class="mobile-story-chapter space-y-4" data-chapter="1">
        <div class="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-stone-900 border border-stone-800/80 shadow-lg">
          <img src="/images/chapter_living_room.jpg" alt="Travertine Sanctuary Console" class="w-full h-full object-cover" loading="lazy">
        </div>
        <div>
          <span class="text-[10px] font-mono tracking-[0.28em] uppercase text-stone-500 block mb-1.5 font-semibold">CHAPTER 01 • TRAVERTINE</span>
          <h3 class="text-xl sm:text-2xl font-light text-white uppercase tracking-wide mb-2">The Guiding Stone</h3>
          <p class="text-sm font-light text-stone-400 leading-relaxed">
            Hand-chiseled from monolithic Italian limestone, each block retains its geomorphic pores and stratified veins, anchoring the room with enduring raw mass and quiet architectural reverence.
          </p>
        </div>
      </article>

      <!-- Chapter 02 -->
      <article class="mobile-story-chapter space-y-4" data-chapter="2">
        <div class="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-stone-900 border border-stone-800/80 shadow-lg">
          <img src="/images/story_clay_vessel.jpg" alt="Unglazed Stoneware Vessels" class="w-full h-full object-cover" loading="lazy">
        </div>
        <div>
          <span class="text-[10px] font-mono tracking-[0.28em] uppercase text-stone-500 block mb-1.5 font-semibold">CHAPTER 02 • STONEWARE</span>
          <h3 class="text-xl sm:text-2xl font-light text-white uppercase tracking-wide mb-2">Unglazed Stoneware</h3>
          <p class="text-sm font-light text-stone-400 leading-relaxed">
            Sculpted on manual kickwheels from iron-dense riverbed clay and fired at 1,240&deg;C in wood-reduction pits. The raw porous surface breathes in equilibrium with ambient space.
          </p>
        </div>
      </article>

      <!-- Chapter 03 -->
      <article class="mobile-story-chapter space-y-4" data-chapter="3">
        <div class="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-stone-900 border border-stone-800/80 shadow-lg">
          <img src="/images/story_plaster_relief.jpg" alt="Mineral Plaster Relievo" class="w-full h-full object-cover" loading="lazy">
        </div>
        <div>
          <span class="text-[10px] font-mono tracking-[0.28em] uppercase text-stone-500 block mb-1.5 font-semibold">CHAPTER 03 • MINERAL RELIEVO</span>
          <h3 class="text-xl sm:text-2xl font-light text-white uppercase tracking-wide mb-2">Mineral Relievo</h3>
          <p class="text-sm font-light text-stone-400 leading-relaxed">
            Hand-troweled in successive strata of volcanic pumice and lime plaster. Zero-glare matte velvet surfaces project soft daylight gradients throughout the sanctuary.
          </p>
        </div>
      </article>

      <!-- Chapter 04 -->
      <article class="mobile-story-chapter space-y-4" data-chapter="4">
        <div class="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-stone-900 border border-stone-800/80 shadow-lg">
          <img src="/images/atelier_materials.jpg" alt="Aged Oak Woodcraft" class="w-full h-full object-cover" loading="lazy">
        </div>
        <div>
          <span class="text-[10px] font-mono tracking-[0.28em] uppercase text-stone-500 block mb-1.5 font-semibold">CHAPTER 04 • AGED OAK</span>
          <h3 class="text-xl sm:text-2xl font-light text-white uppercase tracking-wide mb-2">Aged Oak &amp; Beeswax</h3>
          <p class="text-sm font-light text-stone-400 leading-relaxed">
            United through blind mortise and tenon joinery with zero hardware fasteners or toxic adhesives. Finished with hand-buffed organic beeswax for living tactile warmth.
          </p>
        </div>
      </article>

      <!-- Chapter 05 -->
      <article class="mobile-story-chapter space-y-4" data-chapter="5">
        <div class="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-stone-900 border border-stone-800/80 shadow-lg">
          <img src="/images/chapter_bedroom.jpg" alt="Spatial Synthesis Sanctuary" class="w-full h-full object-cover" loading="lazy">
        </div>
        <div>
          <span class="text-[10px] font-mono tracking-[0.28em] uppercase text-stone-500 block mb-1.5 font-semibold">CHAPTER 05 • SYNTHESIS</span>
          <h3 class="text-xl sm:text-2xl font-light text-white uppercase tracking-wide mb-2">Spatial Synthesis</h3>
          <p class="text-sm font-light text-stone-400 leading-relaxed">
            Where monolithic stone, breathable earthenware, and unlacquered timber exist in mutual restraint—transitioning from architecture into an enduring sanctuary of stillness.
          </p>
        </div>
      </article>
    </div>
  </section>`;

  // SECTION 4: THE ARCHITECTURAL LINE SANCTUARY (Flowing Vector Scroll-Draw)
  // Inlines the multi-stroke architectural vector art from disk for organic stroke-by-stroke drawing
  let sanctuarySvgContent = '';
  try {
    const multiSvgPath = path.join(__dirname, 'public', 'Vector-2-multi.svg');
    sanctuarySvgContent = fs.readFileSync(multiSvgPath, 'utf8');
  } catch (e) {
    console.error('Error reading Vector-2-multi.svg:', e);
  }

  // Fallback if file read fails
  if (!sanctuarySvgContent) {
    sanctuarySvgContent = `<svg id="sanctuary-line-art-svg" xmlns="http://www.w3.org/2000/svg" viewBox="-300 -60 1220 550" class="w-full h-auto max-h-[86vh] select-none mx-auto block overflow-visible" fill="none">
      <path id="sanctuary-floor-lead" class="sanctuary-stroke" d="M -300 456 L 920 456" stroke="#111111" stroke-width="2.2" />
    </svg>`;
  }

  // SECTION 4: THE ARCHITECTURAL LINE SANCTUARY (Edge-to-Edge Fluid Wave Scroll-Draw)
  const sectionLineArtScroll = `
  <section class="section-scroll-draw relative w-full bg-[#ececec] overflow-hidden select-none" id="section-scroll-draw" aria-label="Architectural Sanctuary Line Drawing" role="region">

    <!-- 100vh Viewport Stage pinned by ScrollTrigger -->
    <div class="scroll-draw-stage relative w-full h-[100vh] h-[100svh] flex items-center justify-center overflow-hidden px-0" id="scroll-draw-sticky">

      <!-- Edge-to-Edge Full-Width Vector Stage -->
      <div class="sanctuary-svg-wrapper relative w-full h-full flex items-center justify-center overflow-visible" id="sanctuary-svg-container">
        ${sanctuarySvgContent}
      </div>

    </div><!-- /scroll-draw-sticky -->

  </section><!-- /section-scroll-draw -->`;

  // SECTION 5: THE CURATED EDITORIAL COLLECTION (Redomedia Section 3 Architecture & 3D Flip)
  const sectionFeaturedPieces = `
  <section class="featured-pin section-featured-pieces relative bg-[#ececec] border-t border-black/[0.08] text-[#111111] z-10 overflow-hidden" id="section-curated-collection">
    
    <!-- 100vh Sticky Viewport Stage pinned by ScrollTrigger -->
    <div class="pin-inner featured-pin-inner featured-split-stage relative w-full h-[100vh] h-[100svh] flex flex-col justify-between items-center py-6 sm:py-8 lg:py-10 px-4 sm:px-8 lg:px-16 overflow-hidden" id="featured-split-sticky">

      <!-- Section Header (Redomedia STIX Two Text Italic Serif) -->
      <header class="featured-header text-center w-full max-w-4xl mx-auto flex-shrink-0 z-10" id="featured-section-header">
        <span class="eyebrow featured-eyebrow text-stone-500 font-mono tracking-[0.3em] uppercase text-[10px]">Curated Collection · Architectural Horology</span>
        <h2 class="featured-title text-[#111111]"><span class="italic font-normal">Where</span> are you in your horological journey?</h2>
      </header>

      <!-- Center 3D Perspective Stage (Perspective: 1200px) -->
      <div class="stage featured-stage featured-perspective-wrapper my-auto py-2 z-10" id="featured-perspective-stage">
        
        <div class="featured-cards-track" id="featured-cards-track">
          
          <!-- Card 1: Left Panel (Solarium Horologe - Brushed Titanium / Silver Gradient) -->
          <div class="card featured-card featured-flip-card group" id="featured-card-1" data-card-index="0" aria-label="Solarium Horologe">
            <div class="card-inner featured-flip-inner">
              
              <!-- Front Face: Left 1/3 Slice of Clock & Art Panorama -->
              <div class="card-front featured-card-front">
                <img
                  src="/images/curated_clock_slice_1.jpg"
                  alt="Solarium Horologe - Chiseled Limestone and Raw Brass"
                  class="featured-slice-img"
                  loading="eager"
                  draggable="false"
                />
              </div>

              <!-- Back Face: Platinum/Titanium Silver Gradient (Redomedia Card 1 Aesthetic) -->
              <div class="card-back featured-card-back card-back-silver">
                <div class="card-noise-overlay" aria-hidden="true"></div>
                
                <div class="card-back-top">
                  <div class="card-back-icon">
                    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="16" cy="16" r="13"></circle>
                      <line x1="16" y1="3" x2="16" y2="7"></line>
                      <line x1="16" y1="25" x2="16" y2="29"></line>
                      <line x1="3" y1="16" x2="7" y2="16"></line>
                      <line x1="25" y1="16" x2="29" y2="16"></line>
                      <line x1="16" y1="16" x2="23" y2="9"></line>
                      <circle cx="16" cy="16" r="2.5" fill="currentColor"></circle>
                    </svg>
                  </div>
                  <span class="card-back-badge">01 • VOLTERRA</span>
                </div>

                <div class="card-back-body">
                  <h3 class="card-back-title">Solarium<br>Horologe</h3>
                  <p class="card-back-copy">Hand-chiseled limestone and raw patinated brass, capturing the eternal geometry of light and architectural time.</p>
                </div>

                <div class="card-back-bottom">
                  <div class="card-back-meta-row">
                    <span class="card-back-spec">Limestone &amp; Raw Brass</span>
                    <span class="card-back-price">₹36,500</span>
                  </div>
                  <a href="${createWhatsAppLink('Solarium Wall Horologe')}" target="_blank" rel="noopener" class="card-back-cta">
                    <span>Enquire Atelier</span>
                    <span>&rarr;</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

          <!-- Card 2: Center Panel (Aethelgard Monolith - Signature Redomedia Crimson / Ruby Scarlet Gradient) -->
          <div class="card featured-card featured-flip-card group" id="featured-card-2" data-card-index="1" aria-label="Aethelgard Monolith">
            <div class="card-inner featured-flip-inner">
              
              <!-- Front Face: Center 1/3 Slice of Clock & Art Panorama -->
              <div class="card-front featured-card-front">
                <img
                  src="/images/curated_clock_slice_2.jpg"
                  alt="Aethelgard Monolith - Tuscan Travertine and Deadbeat Escapement"
                  class="featured-slice-img"
                  loading="eager"
                  draggable="false"
                />
              </div>

              <!-- Back Face: Architectural Patinated Copper & Burnished Bronze Gradient -->
              <div class="card-back featured-card-back card-back-copper">
                <div class="card-noise-overlay" aria-hidden="true"></div>
                
                <div class="card-back-top">
                  <div class="card-back-icon">
                    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="10" y="4" width="12" height="12" rx="2"></rect>
                      <circle cx="16" cy="10" r="3"></circle>
                      <line x1="16" y1="16" x2="16" y2="25"></line>
                      <circle cx="16" cy="26" r="3.5" fill="currentColor"></circle>
                    </svg>
                  </div>
                  <span class="card-back-badge">02 • RAJKOT</span>
                </div>

                <div class="card-back-body">
                  <h3 class="card-back-title">Aethelgard<br>Monolith</h3>
                  <p class="card-back-copy">Free-standing column of Tuscan travertine, revealing an exposed floating deadbeat pendulum escapement.</p>
                </div>

                <div class="card-back-bottom">
                  <div class="card-back-meta-row">
                    <span class="card-back-spec">Travertine &amp; Patinated Copper</span>
                    <span class="card-back-price">₹54,000</span>
                  </div>
                  <a href="${createWhatsAppLink('Aethelgard Monolith Clock')}" target="_blank" rel="noopener" class="card-back-cta">
                    <span>Enquire Atelier</span>
                    <span>&rarr;</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

          <!-- Card 3: Right Panel (Celestial Artifice - Stealth Obsidian Onyx Gradient) -->
          <div class="card featured-card featured-flip-card group" id="featured-card-3" data-card-index="2" aria-label="Celestial Artifice">
            <div class="card-inner featured-flip-inner">
              
              <!-- Front Face: Right 1/3 Slice of Clock & Art Panorama -->
              <div class="card-front featured-card-front">
                <img
                  src="/images/curated_clock_slice_3.jpg"
                  alt="Celestial Artifice - Sculptural Volcanic Stoneware and Gold Leaf"
                  class="featured-slice-img"
                  loading="eager"
                  draggable="false"
                />
              </div>

              <!-- Back Face: Stealth Obsidian Onyx Gradient (Redomedia Card 3 Aesthetic) -->
              <div class="card-back featured-card-back card-back-obsidian">
                <div class="card-noise-overlay" aria-hidden="true"></div>
                
                <div class="card-back-top">
                  <div class="card-back-icon">
                    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <ellipse cx="16" cy="16" rx="13" ry="5.5" transform="rotate(-25 16 16)"></ellipse>
                      <ellipse cx="16" cy="16" rx="13" ry="5.5" transform="rotate(35 16 16)"></ellipse>
                      <circle cx="16" cy="16" r="3" fill="currentColor"></circle>
                    </svg>
                  </div>
                  <span class="card-back-badge">03 • PELOPONNESE</span>
                </div>

                <div class="card-back-body">
                  <h3 class="card-back-title">Celestial<br>Artifice</h3>
                  <p class="card-back-copy">Double-sided volcanic stoneware with twin celestial dials, lapis lazuli wash, and 24-karat gold leaf accents.</p>
                </div>

                <div class="card-back-bottom">
                  <div class="card-back-meta-row">
                    <span class="card-back-spec">Volcanic Clay &amp; Gold</span>
                    <span class="card-back-price">₹42,000</span>
                  </div>
                  <a href="${createWhatsAppLink('Celestial Dual-Dial Artifice')}" target="_blank" rel="noopener" class="card-back-cta">
                    <span>Enquire Atelier</span>
                    <span>&rarr;</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div><!-- /featured-cards-track -->

      </div><!-- /featured-perspective-wrapper -->

    </div><!-- /featured-split-sticky -->

  </section>`;

  // SECTION 6: THE CLIENT VOICE & TESTIMONIAL STAGE (Calibrated for Mobile & Desktop)
  const quoteRawText = "The travertine console feels less like placed furniture and more like a permanent piece of architecture. It brings a profound, grounding stillness to our living space.";

  const sectionTrustVoice = `
  <section class="section-trust-voice relative bg-[#030303] border-t border-stone-800 text-white overflow-hidden" id="trust-voice-container">
    
    <!-- 1. Text Stream Viewport (Responsive clamped text on mobile, stream on desktop) -->
    <div class="Horizontal relative w-full h-auto min-h-[300px] md:h-[100svh] overflow-hidden bg-[#030303] flex flex-col justify-center py-12 px-6 md:px-12 lg:px-20" id="trust-horizontal-wrapper">
      
      <!-- Quote Text Stream (Smooth character scatter on scroll) -->
      <div class="Horizontal__container w-full my-auto py-6">
        <h3 class="Horizontal__text text-[clamp(2.2rem,6vw,5rem)] font-light select-none tracking-tight whitespace-normal md:whitespace-nowrap text-stone-100 leading-snug md:leading-tight" id="trust-horizontal-stream">
          “${quoteRawText}”
        </h3>
      </div>

    </div>

    <!-- 2. Sculptural Frosted Glass Testimonial Component with Animated Stone Fragments -->
    <div class="section-testimonial-stage relative w-full py-14 sm:py-20 lg:py-24 px-5 sm:px-10 lg:px-16 overflow-hidden flex flex-col items-center justify-center border-t border-stone-800/80 bg-black min-h-[auto] md:min-h-[100svh]" id="trust-testimonial-stage">
      
      <!-- Full-Bleed Blurred Atelier Stone Backdrop -->
      <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/images/atelier_materials.jpg"
          alt="Elysium Stone Atelier Texture"
          class="w-full h-full object-cover object-center filter blur-xl brightness-[0.25] contrast-125 scale-110"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/90 via-black/75 to-black"></div>
      </div>

      <!-- Center Floating Frosted Glass Card -->
      <div id="elysium-testimonial-card" class="testimonial-card relative z-10 w-full max-w-2xl bg-stone-950/80 backdrop-blur-2xl border border-stone-800 rounded-2xl p-6 sm:p-12 text-center shadow-2xl overflow-visible will-change-[transform,opacity]">
        
        <!-- Top Custom Architectural Botanical Mandala Emblem with Circular Portrait -->
        <div class="testimonial-wreath-wrap relative w-44 sm:w-64 h-auto mx-auto mb-5 sm:mb-6 flex items-center justify-center">
          
          <svg class="testimonial-frame-svg w-full h-auto pointer-events-none z-10 overflow-visible text-stone-900 drop-shadow-[0_2px_12px_rgba(0,0,0,0.06)] select-none" viewBox="0 0 1280 1271" fill="none">
            
            <defs>
              <clipPath id="testimonial-circle-clip">
                <circle id="testimonial-portrait-circle" cx="640" cy="635.5" r="290" />
              </clipPath>
            </defs>

            <!-- 1. Central Circular Portrait Photo (Fixed and upright) -->
            <g class="testimonial-portrait-wrap will-change-[opacity,transform]" id="testimonial-portrait-wrap" style="transform-origin: 640px 635.5px;">
              <circle cx="640" cy="635.5" r="290" fill="#141210" />
              <image
                id="testimonial-portrait-img"
                href="/images/maker_portrait.jpg"
                xlink:href="/images/maker_portrait.jpg"
                x="350"
                y="345.5"
                width="580"
                height="580"
                clip-path="url(#testimonial-circle-clip)"
                preserveAspectRatio="xMidYMid slice"
                class="filter contrast-105 brightness-95"
              />
              <circle cx="640" cy="635.5" r="290" stroke="#111111" stroke-width="4" fill="none" opacity="0.35" />
            </g>

            <!-- 2. Rotating Ornate Mandala Ring -->
            <g class="stone-fragment stone-frag-mandala" id="testimonial-mandala-ring" fill="#000000" style="transform-origin: 640px 635.5px; will-change: transform;">
              ${TESTIMONIAL_SVG_INNER}
            </g>

          </svg>

        </div>

        <!-- Content Container -->
        <div id="testimonial-content-container" class="space-y-3 sm:space-y-4">
          <h3 id="testimonial-headline" class="testimonial-headline text-2xl sm:text-4xl font-light text-stone-950 tracking-wide leading-tight">
            “Grounded.”
          </h3>

          <p id="testimonial-quote" class="testimonial-quote text-sm sm:text-base text-stone-700 font-light leading-relaxed max-w-xl mx-auto">
            “Elysium delivered a custom travertine console that transformed our living room into a monolithic living sanctuary with unmatched tactile reverence.”
          </p>

          <div id="testimonial-attribution-block" class="testimonial-attribution pt-3 sm:pt-4">
            <div class="text-xs sm:text-sm text-stone-600">
              <strong id="testimonial-author" class="font-medium text-stone-950">Sarah P.</strong>
              <span class="text-stone-400 mx-1">•</span>
              <span id="testimonial-project" class="text-stone-500">South Bombay</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Navigation Dots (Min 44px tap targets for mobile thumbs) -->
      <div class="testimonial-dots flex items-center justify-center gap-2 mt-6 sm:mt-8 relative z-20" id="testimonial-dots-nav">
        <button class="testimonial-dot active min-w-[36px] min-h-[36px] flex items-center justify-center p-2 cursor-pointer" data-idx="0" aria-label="Testimonial 1">
          <span class="w-2.5 h-2.5 rounded-full bg-stone-950 transition-all block"></span>
        </button>
        <button class="testimonial-dot min-w-[36px] min-h-[36px] flex items-center justify-center p-2 cursor-pointer" data-idx="1" aria-label="Testimonial 2">
          <span class="w-2.5 h-2.5 rounded-full bg-stone-300 transition-all block"></span>
        </button>
        <button class="testimonial-dot min-w-[36px] min-h-[36px] flex items-center justify-center p-2 cursor-pointer" data-idx="2" aria-label="Testimonial 3">
          <span class="w-2.5 h-2.5 rounded-full bg-stone-300 transition-all block"></span>
        </button>
      </div>

    </div>

  </section>`;

  // SECTION 7: STACKED SVG CASCADE & CONVERSATION CTA (Unified Typographic Vector Architecture)
  const E_path = "M 0 40 L 82 40 L 82 59 L 20 59 L 20 91 L 72 91 L 72 109 L 20 109 L 20 141 L 82 141 L 82 160 L 0 160 Z";
  const L_path = "M 0 40 L 20 40 L 20 141 L 76 141 L 76 160 L 0 160 Z";
  const Y_path = "M 0 40 L 24 40 L 46 88 L 68 40 L 92 40 L 56 102 L 56 160 L 36 160 L 36 102 Z";
  const S_path = "M 80 66 C 80 50 63 40 42 40 C 20 40 2 52 2 70 C 2 87 16 96 36 101 L 48 104 C 68 108 82 116 82 131 C 82 148 64 160 42 160 C 20 160 4 149 4 134 L 24 134 C 24 140 31 142 42 142 C 52 142 62 136 62 129 C 62 118 51 113 32 108 L 22 105 C 8 101 22 84 22 70 C 22 58 31 59 42 59 C 53 59 60 62 60 66 L 80 66 Z";
  const I_path = "M 0 40 L 20 40 L 20 160 L 0 160 Z";
  const U_path = "M 0 40 L 20 40 L 20 118 C 20 132 30 141 44 141 C 58 141 68 132 68 118 L 68 40 L 88 40 L 88 118 C 88 144 69 160 44 160 C 19 160 0 144 0 118 Z";
  const M_path = "M 0 40 L 22 40 L 57 114 L 92 40 L 114 40 L 114 160 L 94 160 L 94 76 L 65 136 L 49 136 L 20 76 L 20 160 L 0 160 Z";

  const sectionElysiumContact = `
  <section class="section-elysium-contact" id="section-elysium-contact" aria-label="Elysium Contact & Commissions" role="region">

    <!-- 100vh Sticky Viewport Stage pinned by ScrollTrigger -->
    <div class="elysium-contact-pin-inner" id="elysium-contact-sticky">

      <!-- Minimal Top Bar: Contact | Year -->
      <div class="elysium-contact-topbar">
        <span>Contact</span>
        <span>${new Date().getFullYear()}</span>
      </div>

      <!-- Center SVG Spotlight Stage -->
      <div class="svg-spotlight-stage" id="svg-spotlight-stage">
        
        <!-- 6 Identical Stacked SVG Layers Pinned Exactly Over Each Other -->
        <div class="svg-stack" id="elysium-svg-stack">
          
          <!-- Layer 1 (Bottom Back) -->
          <svg class="elysium-svg-layer layer-1" viewBox="0 0 1100 200" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <g class="elysium-glyph-group">
              <path d="${E_path}" transform="translate(117, 0)" />
              <path d="${L_path}" transform="translate(253, 0)" />
              <path d="${Y_path}" transform="translate(373, 0)" />
              <path class="bg-layer-s" d="${S_path}" transform="translate(513, 0)" />
              <path d="${I_path}" transform="translate(653, 0)" />
              <path d="${U_path}" transform="translate(729, 0)" />
              <path d="${M_path}" transform="translate(869, 0)" />
            </g>
          </svg>

          <!-- Layer 2 -->
          <svg class="elysium-svg-layer layer-2" viewBox="0 0 1100 200" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <g class="elysium-glyph-group">
              <path d="${E_path}" transform="translate(117, 0)" />
              <path d="${L_path}" transform="translate(253, 0)" />
              <path d="${Y_path}" transform="translate(373, 0)" />
              <path class="bg-layer-s" d="${S_path}" transform="translate(513, 0)" />
              <path d="${I_path}" transform="translate(653, 0)" />
              <path d="${U_path}" transform="translate(729, 0)" />
              <path d="${M_path}" transform="translate(869, 0)" />
            </g>
          </svg>

          <!-- Layer 3 -->
          <svg class="elysium-svg-layer layer-3" viewBox="0 0 1100 200" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <g class="elysium-glyph-group">
              <path d="${E_path}" transform="translate(117, 0)" />
              <path d="${L_path}" transform="translate(253, 0)" />
              <path d="${Y_path}" transform="translate(373, 0)" />
              <path class="bg-layer-s" d="${S_path}" transform="translate(513, 0)" />
              <path d="${I_path}" transform="translate(653, 0)" />
              <path d="${U_path}" transform="translate(729, 0)" />
              <path d="${M_path}" transform="translate(869, 0)" />
            </g>
          </svg>

          <!-- Layer 4 -->
          <svg class="elysium-svg-layer layer-4" viewBox="0 0 1100 200" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <g class="elysium-glyph-group">
              <path d="${E_path}" transform="translate(117, 0)" />
              <path d="${L_path}" transform="translate(253, 0)" />
              <path d="${Y_path}" transform="translate(373, 0)" />
              <path class="bg-layer-s" d="${S_path}" transform="translate(513, 0)" />
              <path d="${I_path}" transform="translate(653, 0)" />
              <path d="${U_path}" transform="translate(729, 0)" />
              <path d="${M_path}" transform="translate(869, 0)" />
            </g>
          </svg>

          <!-- Layer 5 -->
          <svg class="elysium-svg-layer layer-5" viewBox="0 0 1100 200" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <g class="elysium-glyph-group">
              <path d="${E_path}" transform="translate(117, 0)" />
              <path d="${L_path}" transform="translate(253, 0)" />
              <path d="${Y_path}" transform="translate(373, 0)" />
              <path class="bg-layer-s" d="${S_path}" transform="translate(513, 0)" />
              <path d="${I_path}" transform="translate(653, 0)" />
              <path d="${U_path}" transform="translate(729, 0)" />
              <path d="${M_path}" transform="translate(869, 0)" />
            </g>
          </svg>

          <!-- Layer 6 (Frontmost Primary Layer with Isolated S Group in identical position) -->
          <svg class="elysium-svg-layer layer-6 layer-front" id="elysium-front-svg" viewBox="0 0 1100 200" preserveAspectRatio="xMidYMid meet">
            <!-- Background base letters remaining in place: E, L, Y, I, U, M -->
            <g class="svg-static-letters" id="svg-static-letters">
              <path class="let-e" d="${E_path}" transform="translate(117, 0)" />
              <path class="let-l" d="${L_path}" transform="translate(253, 0)" />
              <path class="let-y" d="${Y_path}" transform="translate(373, 0)" />
              <path class="let-i" d="${I_path}" transform="translate(653, 0)" />
              <path class="let-u" d="${U_path}" transform="translate(729, 0)" />
              <path class="let-m" d="${M_path}" transform="translate(869, 0)" />
            </g>

            <!-- Isolated Letter S Group (Identically positioned at translate(513, 0)) -->
            <g class="isolated-s-group" id="isolated-s-group" transform="translate(513, 0)">
              <path class="svg-hero-s" id="svg-hero-s" d="${S_path}" />
            </g>
          </svg>

          <!-- The Morphing Scramble CTA Button (Coordinates dynamically anchored to S) -->
          <a href="/contact" 
             class="elysium-cta-box" 
             id="elysium-cta-box" 
             aria-label="Start a conversation with us">
            <span class="cta-phrase-wrap" id="cta-phrase-wrap">
              <span class="cta-leading-s" id="cta-leading-s">S</span><span class="cta-remainder" id="cta-remainder">TART A CONVERSATION WITH US</span>
            </span>
          </a>

        </div><!-- /svg-stack -->

      </div><!-- /svg-spotlight-stage -->

    </div><!-- /elysium-contact-sticky -->

  </section><!-- /section-elysium-contact -->`;

  // Render combined page with breathtaking 100vh interactive body sections between Hero and Footer
  res.send(renderPage({
    title: 'Elysium | Artisan Minimalist Home Decor, Handcrafted in India',
    description: BRAND.heroStatement,
    path: '/',
    content: heroSection + sectionManifestoAndExpedition + sectionLivingSanctuary + sectionLineArtScroll + sectionFeaturedPieces + sectionTrustVoice + sectionElysiumContact,
    isHeroPage: true,
  }));
});

// 2. Philosophy Page Route
app.get('/philosophy', (req, res) => {
  const content = `
  <div class="pt-28 pb-24 bg-[#ececec] text-[#111111]">
    <section class="px-6 md:px-12 lg:px-24 py-16 max-w-7xl mx-auto border-b border-black/[0.08]">
      <span class="text-[11px] tracking-[0.35em] uppercase text-stone-500 font-mono font-semibold block">THE ELYSIUM ETHOS</span>
      <h1 class="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-tight text-[#111111] uppercase font-sans mt-3">Designed for Silence. Built for Generations.</h1>
      <p class="text-sm sm:text-base text-stone-600 leading-relaxed font-light pt-4 max-w-3xl">At Elysium, we believe a home is a sanctuary where objects shouldn’t compete for attention. Our pieces are formed slowly with deep respect for raw earth mediums, letting each raw element radiate a quiet, elegant dignity.</p>
    </section>

    <section class="px-6 md:px-12 lg:px-24 py-20 max-w-7xl mx-auto">
      <h2 class="text-2xl sm:text-3xl font-medium tracking-tight text-[#111111] uppercase font-sans mb-10">Three Pillars of Design</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        ${renderBaroqueBox({
    content: `
            <span class="text-xs font-mono font-bold text-stone-500 block mb-3">PILLAR 01</span>
            <h3 class="text-xl font-medium text-[#111111] uppercase mb-2">Purity of Origin</h3>
            <p class="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">We source only unrefined travertine, premium iron-dense clay, and slow-grow timber without synthetic coatings or chemical glues.</p>
          `,
    className: 'p-8'
  })}
        ${renderBaroqueBox({
    content: `
            <span class="text-xs font-mono font-bold text-stone-500 block mb-3">PILLAR 02</span>
            <h3 class="text-xl font-medium text-[#111111] uppercase mb-2">Wabi-Sabi Aesthetics</h3>
            <p class="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">We embrace organic cracks, natural geomorphic voids, and firing speckles as the individual voice of the medium.</p>
          `,
    className: 'p-8'
  })}
        ${renderBaroqueBox({
    content: `
            <span class="text-xs font-mono font-bold text-stone-500 block mb-3">PILLAR 03</span>
            <h3 class="text-xl font-medium text-[#111111] uppercase mb-2">Silent Geometry</h3>
            <p class="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">Simple low proportions, continuous physical cuts, and soft light absorption anchoring a room with calm authority.</p>
          `,
    className: 'p-8'
  })}
      </div>
    </section>
  </div>`;

  res.send(renderPage({
    title: 'Our Philosophy | Elysium Home Decor',
    description: 'Restraint, craftsmanship, and longevity — the philosophy behind every Elysium piece.',
    path: '/philosophy',
    content,
  }));
});

// 3. Artisan Pieces Collection Route
app.get('/artisan-pieces', (req, res) => {
  const content = `
  <div class="pt-28 pb-24 bg-[#ececec] text-[#111111] min-h-screen">
    <div class="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
      <div class="mb-12 space-y-3">
        <span class="text-[11px] tracking-[0.35em] uppercase text-stone-500 font-mono font-semibold block">ARTISAN CATALOGUE</span>
        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#111111] uppercase font-sans">Handcrafted Collection</h1>
        <p class="text-xs sm:text-sm text-stone-600 tracking-wider font-light pt-1 max-w-2xl">Each edition is individually sculpted by master artisans using unsealed stone, volcanic clay, and native seasoned oak.</p>
      </div>

      <div id="category-filter-bar" class="flex flex-wrap gap-3 pb-8 mb-10 border-b border-black/[0.08]">
        <button class="category-btn active" data-category="All"><span>All</span></button>
        <button class="category-btn" data-category="Furniture"><span>Furniture</span></button>
        <button class="category-btn" data-category="Sculpture"><span>Sculpture</span></button>
        <button class="category-btn" data-category="Lighting"><span>Lighting</span></button>
        <button class="category-btn" data-category="Vessels"><span>Vessels</span></button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        ${PRODUCTS.map(p => `
          <div class="product-card group cursor-pointer flex flex-col justify-between space-y-4 h-full bg-white p-4 rounded-2xl border border-black/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300" data-category="${p.category}">
            <div class="space-y-3">
              ${renderProductImage({
    src: p.image,
    alt: p.name,
    href: `/artisan-pieces/${p.slug}`,
    imgClassName: 'absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105',
    aspect: 'w-full aspect-[3/4] relative overflow-hidden rounded-xl bg-stone-100'
  })}
              <div class="space-y-1">
                <a href="/artisan-pieces/${p.slug}"><h3 class="text-base font-medium text-[#111111] hover:text-stone-700 transition-colors">${p.name}</h3></a>
                <p class="text-[11px] font-mono text-stone-500 uppercase tracking-wider">${p.material} • By ${p.artisan}</p>
                <p class="text-xs sm:text-sm font-mono text-[#111111] font-semibold tracking-wider pt-0.5">${p.price}</p>
              </div>
            </div>
            <div class="pt-3 flex items-center justify-between border-t border-black/[0.06] mt-auto">
              <a href="${createWhatsAppLink(p.name)}" target="_blank" rel="noopener noreferrer" class="text-[11px] font-medium uppercase tracking-[0.16em] text-[#111111] hover:text-stone-600 transition-colors">Enquire &rarr;</a>
              <a href="/artisan-pieces/${p.slug}" class="text-[11px] font-mono uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors">Specs &rarr;</a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>`;

  res.send(renderPage({
    title: 'Artisan Pieces | Handcrafted Home Decor Collection',
    description: 'Browse Elysium’s curated collection of handcrafted home decor made by skilled artisans.',
    path: '/artisan-pieces',
    content,
  }));
});

// 4. Product Detail Route
app.get('/artisan-pieces/:slug', (req, res) => {
  const product = PRODUCTS.find(p => p.slug === req.params.slug);
  if (!product) {
    return res.status(404).send(renderPage({
      title: 'Piece Not Found | Elysium',
      description: 'The requested artisan piece could not be found.',
      path: '/artisan-pieces',
      content: '<div class="pt-32 pb-32 text-center text-[#111111] bg-[#ececec] min-h-[60vh] flex flex-col justify-center items-center"><h1 class="text-2xl font-mono uppercase">PIECE NOT FOUND</h1><a href="/artisan-pieces" class="mt-4 inline-block text-xs font-mono uppercase underline text-stone-600 hover:text-black">Back to collection</a></div>',
    }));
  }

  const whatsappUrl = createWhatsAppLink(product.name);

  const content = `
  <div class="pt-28 pb-24 bg-[#ececec] text-[#111111] min-h-screen">
    <div class="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
      <div class="mb-8"><a href="/artisan-pieces" class="text-xs font-mono uppercase tracking-[0.2em] text-stone-500 hover:text-[#111111] transition-colors">&larr; Back to Artisan Collection</a></div>
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div class="lg:col-span-7">
          <div class="rounded-2xl border border-black/[0.08] shadow-[0_12px_36px_rgba(0,0,0,0.06)] overflow-hidden bg-white">
            ${renderProductImage({
    src: product.image,
    alt: product.name,
    aspect: 'w-full aspect-[4/5] relative overflow-hidden',
    imgClassName: 'absolute inset-0 w-full h-full object-cover object-center'
  })}
          </div>
        </div>
        <div class="lg:col-span-5 space-y-6">
          <div class="space-y-2">
            <span class="text-[11px] tracking-[0.35em] uppercase text-stone-500 font-mono font-semibold block">ARTISAN EDITION</span>
            <h1 class="text-3xl sm:text-4xl font-medium tracking-tight text-[#111111] uppercase font-sans">${product.name}</h1>
            <p class="text-xs font-mono text-stone-500 uppercase tracking-widest pt-1">${product.material} • Crafted by ${product.artisan}</p>
            <p class="text-xl font-mono font-semibold text-[#111111] pt-1">${product.price}</p>
          </div>
          
          ${renderBaroqueBox({
    content: `
              <p class="text-xs sm:text-sm text-stone-700 leading-relaxed font-light">${product.description}</p>
              <div class="w-full h-px bg-black/[0.06] my-4"></div>
              <p class="text-xs text-stone-500 italic font-light">“${product.story}”</p>
            `,
    className: 'p-6'
  })}

          <div class="space-y-3 pt-1">
            <h3 class="text-xs font-mono uppercase tracking-[0.25em] text-stone-500 font-semibold">Technical Specifications</h3>
            <div class="grid grid-cols-2 gap-3 text-xs font-mono">
              ${renderBaroqueBox({
    content: `<span class="text-[10px] text-stone-500 uppercase block font-semibold">Dimensions</span><span class="text-[#111111] font-medium mt-1 block">${product.dimensions}</span>`,
    className: 'p-4'
  })}
              ${renderBaroqueBox({
    content: `<span class="text-[10px] text-stone-500 uppercase block font-semibold">Approx. Weight</span><span class="text-[#111111] font-medium mt-1 block">${product.weight}</span>`,
    className: 'p-4'
  })}
              ${renderBaroqueBox({
    content: `<span class="text-[10px] text-stone-500 uppercase block font-semibold">Provenance</span><span class="text-[#111111] font-medium mt-1 block">${product.origin}</span>`,
    className: 'p-4 col-span-2'
  })}
            </div>
          </div>
          <div class="pt-3 space-y-3">
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary w-full py-3.5 text-center text-xs font-semibold uppercase tracking-[0.25em] shadow-md"><span>Enquire via WhatsApp</span><span class="btn-arrow ml-2">&rarr;</span></a>
            <a href="/contact?piece=${encodeURIComponent(product.name)}" class="btn-primary w-full py-3 text-center text-xs uppercase tracking-[0.25em]"><span>Submit Form Enquiry</span></a>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  res.send(renderPage({
    title: `${product.name} | Elysium Artisan Home Decor`,
    description: product.description,
    path: `/artisan-pieces/${product.slug}`,
    content,
  }));
});

// 5. Materiality Route
app.get('/materiality', (req, res) => {
  const content = `
  <div class="pt-28 pb-24 bg-[#ececec] text-[#111111] min-h-screen">
    <div class="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
      <div class="max-w-2xl mb-12 space-y-3">
        <span class="text-[11px] tracking-[0.35em] uppercase text-stone-500 font-mono font-semibold block">MEDIUM EXPLORATION</span>
        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#111111] uppercase font-sans">Tactile Materiality</h1>
        <p class="text-xs sm:text-sm text-stone-600 tracking-wider font-light leading-relaxed">Interact with our raw geomorphic stones, clay types, timber, and plant-based finishes under simulated incident light.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        <div class="lg:col-span-5 space-y-4">
          <span class="text-[10px] font-mono uppercase tracking-[0.3em] text-stone-500 font-semibold block mb-2">Primary Mediums</span>
          ${MATERIALS.map((m, idx) => `
            ${renderBaroqueBox({
    content: `
                <div class="material-card space-y-2 cursor-pointer transition-all ${idx === 0 ? 'active-material' : ''}" data-material-id="${m.id}" data-macro-img="${m.macroImage}" data-default-angle="${m.lightAngleDefault}" data-name="${m.name}">
                  <div class="flex justify-between items-center">
                    <span class="text-[10px] font-mono text-stone-500 uppercase">${m.category}</span>
                    <span class="text-[10px] font-mono text-stone-700 font-semibold tracking-wider">Default ${m.lightAngleDefault}°</span>
                  </div>
                  <h3 class="text-base font-medium text-[#111111]">${m.name}</h3>
                  <p class="text-xs text-stone-600 leading-relaxed font-light">${m.description}</p>
                </div>
              `,
    className: 'p-5 cursor-pointer hover:border-black/30'
  })}
          `).join('')}
        </div>

        <div class="lg:col-span-7">
          ${renderBaroqueBox({
    content: `
              <div class="flex justify-between items-center text-xs uppercase font-mono text-stone-600 font-semibold border-b border-black/[0.08] pb-4 mb-6">
                <span id="material-title-display">Travertine Stone</span>
                <span id="light-angle-display">Incident Angle: 135°</span>
              </div>

              <div class="flex items-center justify-center p-2 sm:p-4">
                <div class="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden border border-black/[0.08] flex items-center justify-center bg-stone-100 shadow-inner">
                  ${renderProductImage({
      src: '/images/photo-1616486338812-3dadae4b4ace',
      alt: 'Material preview',
      aspect: 'w-full h-full',
      id: 'material-preview-img',
      imgClassName: 'w-full h-full object-cover transition-all duration-500'
    })}
                  <div id="material-light-overlay" class="absolute inset-0 pointer-events-none mix-blend-overlay transition-all duration-300" style="background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.75) 100%);"></div>
                  <button id="macro-zoom-btn" class="btn-primary absolute top-4 right-4 text-xs font-mono uppercase px-3 py-1.5 z-30 shadow-md"><span>Macro Zoom</span></button>
                </div>
              </div>

              <div class="space-y-3 pt-6 border-t border-black/[0.08] mt-6">
                <span class="text-xs text-stone-600 font-mono block">Rotate light angle to reveal surface crevices</span>
                <input id="light-angle-slider" type="range" min="0" max="360" value="135" class="w-full accent-stone-900 cursor-pointer">
              </div>
            `,
    className: 'p-8 flex flex-col justify-between'
  })}
        </div>
      </div>
    </div>
  </div>`;

  res.send(renderPage({
    title: 'Materiality | Sustainable Craft & Materials | Elysium',
    description: 'The materials and sourcing philosophy behind Elysium sculptural furniture.',
    path: '/materiality',
    content
  }));
});

// 6. Our Story Route — Elysium Atelier Story Experience
app.get('/our-story', (req, res) => {
  const whatsappUrl = createWhatsAppLink();

  // Structured Story Content Object (Clean luxury editorial without noisy eyebrows)
  const STORY_CONTENT = {
    hero: {
      headline: 'Sculpting Time, Earth & Sanctuary',
      subtitle: 'Where raw mineral fault lines meet patient artisanal masonry.'
    },
    mission: {
      statement: 'Our mission is to return the modern living space to the quiet, grounding authenticity of raw earth and patient handcraft.',
      revealParagraph: 'We do not believe in synthetic finishes, rushed assembly lines, or fleeting trends. Every console, vessel, plinth, and light sculpture in our atelier begins as raw mountain travertine, riverbed stoneware clay, or seasoned timber. Formed by human hands over weeks of tactile sculpting, each piece carries the quiet soul of natural imperfection into your sanctuary.'
    },
    pillars: {
      title: 'Our foundational craft principles:',
      cards: [
        {
          title: 'Geological Provenance',
          desc: 'Sourcing untreated mineral blocks directly from historical quarries in Tuscany and the Peloponnese.',
          iconSvg: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-[#111111]">
            <path d="M4 32L16 12L24 24L30 15L36 32H4Z" />
            <path d="M16 12L20 6L26 15" stroke-dasharray="2 3" />
            <path d="M10 26H22" stroke-dasharray="2 2" />
          </svg>`
        },
        {
          title: 'Wabi-Sabi Tactility',
          desc: 'Embracing natural mineral voids, fissure stratifications, and unglazed earthy textures.',
          iconSvg: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-[#111111]">
            <circle cx="20" cy="20" r="14" stroke-dasharray="3 4" />
            <path d="M14 18C16 15 24 15 26 18C28 21 24 26 20 26C16 26 12 21 14 18Z" />
            <circle cx="20" cy="20" r="2.5" fill="currentColor" />
          </svg>`
        },
        {
          title: 'Zero Synthetic Sealants',
          desc: 'Buffed solely with pulverized volcanic pumice stone, cold-pressed linseed oil, and raw desert beeswax.',
          iconSvg: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-[#111111]">
            <path d="M20 4C20 4 8 16 8 24C8 30.627 13.373 36 20 36C26.627 36 32 30.627 32 24C32 16 20 4 20 4Z" />
            <path d="M20 14V28M20 28L15 23M20 28L25 23" />
          </svg>`
        },
        {
          title: 'Master Guild Collaboration',
          desc: 'Direct partnerships with independent stone sculptors, kickwheel ceramicists, and joinery masters.',
          iconSvg: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-[#111111]">
            <path d="M8 32V20L16 12L24 20V32H8Z" />
            <path d="M24 20L32 12V32H24" />
            <circle cx="16" cy="18" r="3" />
          </svg>`
        }
      ]
    },
    method: {
      paragraph: 'By working intimately with solitary quarry masters and studio ceramicists across Rajkot, Volterra, and the Peloponnese, we preserve slow artisanal techniques that modern manufacturing has abandoned. Every contour is shaped by chisel, kickwheel, and ancient saws—leaving the stone breathable and the clay alive.'
    },
    cta: {
      headline: 'Create your sanctuary.',
      subtitle: 'Consult directly with our atelier curators for bespoke spatial placement.',
      buttonText: 'START CONSULTATION'
    }
  };

  const content = `
  <div id="story-page-container" class="story-page-wrapper pt-28 sm:pt-32 pb-24 relative selection:bg-black selection:text-white overflow-hidden">

    <!-- Top Hero Area (Refined First 100vh Luxury Editorial Composition) -->
    <div class="relative pb-10 sm:pb-16 text-center">
      <div class="max-w-3xl mx-auto px-4 sm:px-8">
        <h1 class="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#111111] uppercase leading-[1.1]">
          ${STORY_CONTENT.hero.headline}
        </h1>
        <p class="text-sm sm:text-base text-stone-500 font-light mt-4 max-w-md mx-auto leading-relaxed">
          ${STORY_CONTENT.hero.subtitle}
        </p>
      </div>

      <!-- Contained Architectural Hero Sanctuary Image with Balanced Proportions -->
      <div id="story-hero-img-wrap" class="mt-8 sm:mt-10 max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-6">
        <div class="relative w-full h-[260px] sm:h-[340px] md:h-[390px] rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-black/[0.08] bg-stone-200">
          <img src="/images/story/hero_atelier.jpg" alt="Elysium Minimalist Living Sanctuary" class="w-full h-full object-cover object-center" fetchpriority="high">
          <div class="absolute inset-0 bg-gradient-to-t from-black/[0.04] to-transparent"></div>
        </div>
      </div>
    </div>

    <!-- The Journey Atelier Experience Container with Generous Top Clearance -->
    <div id="story-journey" class="journey max-w-[1240px] mx-auto px-6 sm:px-12 md:px-16 relative mt-16 sm:mt-24 md:mt-32">

      <!-- Dynamic Dual-Track SVG Path Overlay -->
      <div id="story-flight-path-wrap" class="dash-journey pointer-events-none" aria-hidden="true">
        <svg id="story-flight-svg" class="w-full h-full" preserveAspectRatio="none" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: visible;">
          <defs>
            <mask id="story-flight-mask" maskUnits="userSpaceOnUse">
              <path id="story-flight-mask-path" d="" fill="none" stroke="#ffffff" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
            </mask>
          </defs>
          <!-- 1. Base light grey dashed path -->
          <path id="story-flight-base-path" d="" fill="none" stroke="rgba(17, 17, 17, 0.16)" stroke-width="1.2" stroke-dasharray="4 6" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
          <!-- 2. Darker drawn portion following scroll progress -->
          <path id="story-flight-active-path" d="" fill="none" stroke="#111111" stroke-width="1.2" stroke-dasharray="4 6" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" mask="url(#story-flight-mask)" />
        </svg>
      </div>

      <!-- Traveling Flight Node (Sleek 34px size with dynamic forward directional chevron) -->
      <div id="story-flight-node" class="plane plane-journey pointer-events-none" aria-hidden="true" style="position: absolute; top: 0; left: 0; width: 34px !important; height: 34px !important; min-width: 34px !important; min-height: 34px !important; max-width: 34px !important; max-height: 34px !important; z-index: 25; will-change: transform; pointer-events: none;">
        <svg viewBox="0 0 40 40" fill="none" style="width: 34px; height: 34px; display: block; overflow: visible;">
          <circle cx="20" cy="20" r="17" stroke="#111111" stroke-width="1.1" stroke-dasharray="3 3.5" opacity="0.85" />
          <circle cx="20" cy="20" r="10" fill="#ffffff" stroke="#111111" stroke-width="1.1" />
          <path d="M 15 14.5 L 26 20 L 15 25.5 L 17.5 20 Z" fill="#111111" />
        </svg>
      </div>

      <!-- Content Sections inside Journey with generous inter-section clearance (Zero Overlap) -->
      <div class="relative z-10 space-y-32 sm:space-y-40 md:space-y-48">

        <!-- Section 1: Workshop Image & Philosophy Mission -->
        <div id="story-row-1" class="space-y-10 sm:space-y-12">
          <!-- Curated Atelier Workshop Image with Contained Sizing -->
          <div id="story-workshop-wrap" class="max-w-3xl mx-auto">
            <div class="relative w-full h-[240px] sm:h-[320px] md:h-[360px] rounded-2xl overflow-hidden border border-black/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.05)] bg-white">
              <img src="/images/story/atelier_workshop.jpg" alt="Elysium Sculpture Atelier Workshop" class="w-full h-full object-cover" data-parallax="" loading="lazy">
            </div>
          </div>

          <!-- Philosophy Mission Two-Column Grid -->
          <div id="story-mission-section" class="max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-2">
            <div class="lg:col-span-6 space-y-3">
              <h2 class="text-2xl sm:text-3xl md:text-4xl font-light text-[#111111] leading-[1.2]">
                ${STORY_CONTENT.mission.statement}
              </h2>
            </div>

            <div class="lg:col-span-6 lg:pt-1 journey-item-1">
              <p id="story-mission-reveal" class="text-base sm:text-lg font-light leading-relaxed text-[#111111]">
                ${STORY_CONTENT.mission.revealParagraph}
              </p>
            </div>
          </div>
        </div>

        <!-- Section 2: Foundational Craft Principles (Heading + 4 Cards) -->
        <div id="story-principles-section" class="max-w-3xl mx-auto">
          <div class="mb-6 sm:mb-8">
            <h2 class="text-xl sm:text-2xl md:text-3xl font-light text-[#111111]">
              ${STORY_CONTENT.pillars.title}
            </h2>
          </div>

          <div id="story-principles-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            ${STORY_CONTENT.pillars.cards.map(card => `
              <div class="story-card story-card-interactive p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <div class="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-100 mb-4">
                    ${card.iconSvg}
                  </div>
                  <h3 class="text-base font-medium text-[#111111] mb-2">${card.title}</h3>
                  <p class="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">${card.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Section 3: Our Craft Method (Photo Left + Narrative Right) -->
        <div id="story-method-section" class="max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div class="lg:col-span-5">
            <div class="rounded-2xl overflow-hidden border border-black/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.05)] bg-white aspect-[4/3] max-w-xs sm:max-w-sm mx-auto lg:max-w-none">
              <img src="/images/story/craft_hands.jpg" alt="Artisan stone masonry hand chiseling" class="w-full h-full object-cover" data-parallax="" loading="lazy">
            </div>
          </div>

          <div id="story-method-card" class="lg:col-span-7 journey-item-2">
            <p class="text-base sm:text-lg font-light text-[#111111] leading-relaxed">
              ${STORY_CONTENT.method.paragraph}
            </p>
          </div>
        </div>

        <!-- Section 4: 5-Slide Interactive Atelier Carousel -->
        <div id="story-carousel-section" class="max-w-3xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch" id="story-carousel-container">
            <!-- Slide Image -->
            <div class="lg:col-span-5">
              <div class="rounded-2xl overflow-hidden border border-black/[0.08] shadow-sm bg-white h-[260px] sm:h-[320px] md:h-[360px] max-w-sm mx-auto lg:max-w-none">
                <img id="carousel-slide-img" src="/images/story/carousel_quarry.jpg" alt="Historical travertine quarry" class="w-full h-full object-cover" loading="lazy">
              </div>
            </div>

            <!-- Slide Content Card -->
            <div class="lg:col-span-7">
              <div class="story-carousel-card h-full min-h-[260px] sm:min-h-[320px] md:min-h-[360px]">
                <div>
                  <h3 id="carousel-slide-title" class="text-2xl sm:text-3xl font-light tracking-tight text-[#111111]">
                    Raw Earth Extraction
                  </h3>
                </div>

                <div class="pt-6 border-t border-black/[0.08] space-y-4">
                  <p id="carousel-slide-desc" class="text-sm text-stone-600 font-light leading-relaxed max-w-lg">
                    Sourcing monolithic blocks of porous travertine directly from historical quarries with untouched sedimentary lines.
                  </p>

                  <div class="flex items-center justify-between pt-2">
                    <div class="flex items-center gap-2.5" role="tablist" aria-label="Craft Milestones">
                      <button class="story-carousel-dot active bg-[#111111] scale-125" data-index="0" role="tab" aria-selected="true" aria-label="Slide 1"></button>
                      <button class="story-carousel-dot bg-[#111111]/20" data-index="1" role="tab" aria-selected="false" aria-label="Slide 2"></button>
                      <button class="story-carousel-dot bg-[#111111]/20" data-index="2" role="tab" aria-selected="false" aria-label="Slide 3"></button>
                      <button class="story-carousel-dot bg-[#111111]/20" data-index="3" role="tab" aria-selected="false" aria-label="Slide 4"></button>
                      <button class="story-carousel-dot bg-[#111111]/20" data-index="4" role="tab" aria-selected="false" aria-label="Slide 5"></button>
                    </div>

                    <div class="flex items-center gap-3">
                      <button id="story-carousel-prev" class="story-carousel-btn" aria-label="Previous Slide">
                        <svg class="w-4 h-4 transform rotate-180" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                      </button>
                      <button id="story-carousel-next" class="story-carousel-btn" aria-label="Next Slide">
                        <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 5: CTA Box -->
        <div id="story-cta-section" class="max-w-3xl mx-auto pt-2">
          <div id="story-cta-box" class="story-cta-box flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="space-y-1.5">
              <h2 class="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#111111] uppercase">
                ${STORY_CONTENT.cta.headline}
              </h2>
              <p class="text-base sm:text-xl font-light text-stone-600">
                ${STORY_CONTENT.cta.subtitle}
              </p>
            </div>

            <div>
              <a id="story-cta-btn" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary min-h-[48px] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] rounded-full shadow-md">
                <span>${STORY_CONTENT.cta.buttonText}</span>
                <span class="btn-arrow ml-2">&rarr;</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Story Interactive Client Script -->
    <script src="/js/storyAnimations.js?v=7.0"></script>
  </div>`;

  res.send(renderPage({
    title: 'Our Story & Provenance | Handcrafted Minimalist Sanctuary | Elysium',
    description: 'The story behind Elysium: raw geological provenance, wabi-sabi stone masonry, wheel-thrown ceramics, and slow artisan handcraft.',
    path: '/our-story',
    content,
  }));
});

// 7. Contact Route
app.get('/contact', (req, res) => {
  const pieceName = req.query.piece ? String(req.query.piece) : '';
  const initialMessage = pieceName
    ? `Hello Elysium, I am interested in inquiring about the "${pieceName}" piece from your artisan collection. Could you please share more details and availability?`
    : '';

  const content = `
  <div class="pt-28 pb-24 bg-[#ececec] text-[#111111] min-h-screen">
    <div class="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
      <div class="max-w-3xl mb-12 space-y-3">
        <span class="text-[11px] tracking-[0.35em] uppercase text-stone-500 font-mono font-semibold block">ENQUIRIES & CONSULTATIONS</span>
        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#111111] uppercase font-sans">Contact Elysium</h1>
        <p class="text-xs sm:text-sm text-stone-600 tracking-wider font-light pt-1">Direct communication with our atelier curators for piece inquiries, trade commissions, and showroom appointments.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div class="lg:col-span-5 space-y-6">
          ${renderBaroqueBox({
    content: `
              <span class="text-[10px] font-mono uppercase tracking-[0.3em] text-stone-500 font-semibold block mb-2">Instant Communication</span>
              <h3 class="text-xl font-medium text-[#111111] uppercase mb-4">WhatsApp Direct Line</h3>
              <a href="${createWhatsAppLink(pieceName)}" target="_blank" rel="noopener noreferrer" class="btn-primary w-full py-3.5 text-center text-xs font-semibold uppercase tracking-[0.25em] shadow-md"><span>OPEN WHATSAPP CHAT</span><span class="btn-arrow ml-2">&rarr;</span></a>
            `,
    className: 'p-8'
  })}

          ${renderBaroqueBox({
    content: `
              <div class="space-y-4 text-xs font-mono text-stone-700">
                <p><span class="text-stone-500 block uppercase font-semibold text-[10px] mb-1">ADDRESS</span>${BRAND.address}</p>
                <p><span class="text-stone-500 block uppercase font-semibold text-[10px] mb-1">PHONE</span>+91 ${BRAND.phoneDisplay}</p>
                <p><span class="text-stone-500 block uppercase font-semibold text-[10px] mb-1">HOURS</span>${BRAND.timing}</p>
              </div>
            `,
    className: 'p-8'
  })}
        </div>

        <div class="lg:col-span-7">
          ${renderBaroqueBox({
    content: `
              <h2 class="text-2xl font-medium tracking-tight text-[#111111] uppercase mb-6">Send an Enquiry</h2>
              <div id="form-success-alert" class="hidden p-6 bg-[#ececec] border border-black/[0.1] rounded-xl text-center mb-6">
                <h3 class="text-lg font-medium text-[#111111] uppercase">Enquiry Received</h3>
                <p class="text-xs text-stone-600 mt-2">Thank you. An atelier curator will respond within 24 hours.</p>
              </div>
              <form id="contact-form" class="space-y-5 text-xs">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-[10px] font-mono uppercase tracking-wider text-stone-500 mb-1.5 font-semibold">Full Name *</label>
                    <input type="text" name="fullName" required placeholder="Your full name" class="w-full bg-white border border-stone-300 p-3.5 text-[#111111] rounded-lg focus:border-black outline-none transition-colors">
                  </div>
                  <div>
                    <label class="block text-[10px] font-mono uppercase tracking-wider text-stone-500 mb-1.5 font-semibold">Email Address *</label>
                    <input type="email" name="email" required placeholder="name@domain.com" class="w-full bg-white border border-stone-300 p-3.5 text-[#111111] rounded-lg focus:border-black outline-none transition-colors">
                  </div>
                </div>
                <div>
                  <label class="block text-[10px] font-mono uppercase tracking-wider text-stone-500 mb-1.5 font-semibold">Your Message *</label>
                  <textarea id="contact-message" name="message" required rows="5" placeholder="Share your enquiry, required dimensions, or custom specifications..." class="w-full bg-white border border-stone-300 p-3.5 text-[#111111] rounded-lg focus:border-black outline-none transition-colors">${initialMessage}</textarea>
                </div>
                <button type="submit" class="btn-primary w-full py-4 text-center text-xs font-semibold uppercase tracking-[0.25em] shadow-md"><span>SUBMIT FORM ENQUIRY</span></button>
              </form>
            `,
    className: 'p-8'
  })}
        </div>
      </div>
    </div>
  </div>`;

  res.send(renderPage({
    title: 'Contact Elysium | Enquire About Artisan Home Decor',
    description: 'Get in touch with Elysium to enquire about our handcrafted home decor collection.',
    path: '/contact',
    content,
  }));
});

// Legal Routes
app.get('/privacy-policy', (req, res) => {
  res.send(renderPage({
    title: 'Privacy Policy | Elysium Home Decor',
    description: 'Privacy policy for Elysium Home Decor.',
    path: '/privacy-policy',
    content: `
      <div class="pt-32 pb-24 max-w-4xl mx-auto px-6 text-[#111111]">
        ${renderBaroqueBox({
          content: `
            <span class="text-[11px] tracking-[0.35em] uppercase text-stone-500 font-mono font-semibold block mb-2">LEGAL COMPLIANCE</span>
            <h1 class="text-3xl sm:text-4xl font-medium uppercase tracking-tight text-[#111111]">Privacy Policy</h1>
            <p class="text-xs sm:text-sm text-stone-600 mt-6 leading-relaxed font-light">At Elysium, we collect personal information solely to process artisan decor enquiries, order fulfillment, and client consultations. We do not sell or share data with third parties.</p>
          `,
          className: 'p-8 sm:p-12'
        })}
      </div>
    `,
  }));
});

app.get('/terms', (req, res) => {
  res.send(renderPage({
    title: 'Terms of Service | Elysium Home Decor',
    description: 'Terms of service for Elysium Home Decor.',
    path: '/terms',
    content: `
      <div class="pt-32 pb-24 max-w-4xl mx-auto px-6 text-[#111111]">
        ${renderBaroqueBox({
          content: `
            <span class="text-[11px] tracking-[0.35em] uppercase text-stone-500 font-mono font-semibold block mb-2">TERMS & CONDITIONS</span>
            <h1 class="text-3xl sm:text-4xl font-medium uppercase tracking-tight text-[#111111]">Terms of Service</h1>
            <p class="text-xs sm:text-sm text-stone-600 mt-6 leading-relaxed font-light">All pieces are handcrafted from raw natural materials including unsealed travertine stone, iron-dense clay, and seasoned timber. Natural voids, fissures, and color variations are inherent characteristics of wabi-sabi hand craftsmanship.</p>
          `,
          className: 'p-8 sm:p-12'
        })}
      </div>
    `,
  }));
});

// SEO & Deliverable Static Files
app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  const urls = ['/', '/philosophy', '/artisan-pieces', '/materiality', '/our-story', '/contact', ...PRODUCTS.map(p => `/artisan-pieces/${p.slug}`)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(u => `<url><loc>${BRAND.domain}${u}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`).join('\n')}
</urlset>`;
  res.send(xml);
});

app.get('/robots.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  res.send(`User-agent: *\nAllow: /\nSitemap: ${BRAND.domain}/sitemap.xml`);
});

app.get('/llms.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  res.sendFile(path.join(__dirname, 'public', 'llms.txt'));
});

app.get('/llms-full.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  res.sendFile(path.join(__dirname, 'public', 'llms-full.txt'));
});

// 404 Catch-all handler
app.use((req, res) => {
  res.status(404).send(renderPage({
    title: '404 - Page Not Found | Elysium',
    description: 'The requested page could not be found.',
    path: req.path,
    content: `
      <div class="pt-36 pb-32 max-w-2xl mx-auto px-6 text-center text-[#111111] min-h-[60vh] flex flex-col justify-center items-center space-y-6">
        <span class="text-[11px] font-mono tracking-[0.4em] uppercase text-stone-500 font-semibold block">ERROR 404</span>
        <h1 class="text-4xl sm:text-5xl font-medium uppercase tracking-tight text-[#111111]">Sanctuary Not Found</h1>
        <p class="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed font-light">The page you are looking for may have moved or no longer exists in our atelier catalogue.</p>
        <div class="pt-4 flex flex-wrap justify-center gap-4">
          <a href="/" class="btn-primary">Return to Home</a>
          <a href="/artisan-pieces" class="btn-primary">Explore Collection</a>
        </div>
      </div>
    `,
  }));
});

// Global 500 Error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).send(renderPage({
    title: '500 - Server Error | Elysium',
    description: 'An unexpected error occurred.',
    path: req.path,
    content: `
      <div class="pt-36 pb-32 max-w-2xl mx-auto px-6 text-center text-[#111111] min-h-[60vh] flex flex-col justify-center items-center space-y-6">
        <span class="text-[11px] font-mono tracking-[0.4em] uppercase text-stone-500 font-semibold block">ERROR 500</span>
        <h1 class="text-4xl sm:text-5xl font-medium uppercase tracking-tight text-[#111111]">Atelier Disruption</h1>
        <p class="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed font-light">Our atelier system encountered an unexpected condition. Please refresh or return home.</p>
        <div class="pt-4">
          <a href="/" class="btn-primary">Return to Home</a>
        </div>
      </div>
    `,
  }));
});

if (process.env.VERCEL !== '1') {
  const server = app.listen(PORT, () => {
    console.log(`[Elysium Node Server] Listening on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = Number(PORT) + 1;
      console.warn(`[Elysium] Port ${PORT} is in use, falling back to port ${nextPort}...`);
      app.listen(nextPort, () => {
        console.log(`[Elysium Node Server] Listening on http://localhost:${nextPort}`);
      });
    } else {
      console.error('[Elysium Server Error]', err);
    }
  });
}

module.exports = app;

