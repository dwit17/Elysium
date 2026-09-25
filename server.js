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

function renderProductImage({ src, alt, href = '', className = '', imgClassName = '', aspect = 'aspect-w-3 aspect-h-4' }) {
  const content = `
    <div class="product-img-container ${aspect} ${className}">
      <img src="${src}" alt="${alt}" class="${imgClassName}" />
    </div>`;

  if (href) {
    return `<a href="${href}" class="block group">${content}</a>`;
  }
  return content;
}

function renderBaroqueBox({ content, className = '' }) {
  return `
  <div class="wooden-art-frame ${className}">
    <div class="wood-light-sheen"></div>
    <div class="wooden-inner-mat"></div>
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

  <!-- Sticky Header (Task 2) -->
  <header class="site-header fixed top-0 left-0 right-0 z-50 font-sans transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center w-full h-full">
      <a href="/" class="header-logo-wrap flex items-center gap-3 cursor-pointer" aria-label="Elysium Home">
        <img src="/images/logo.png" alt="ELYSIUM" class="h-9 md:h-11 w-auto">
      </a>

      <nav class="header-nav-wrap hidden lg:flex items-center space-x-8 text-[13px] font-medium tracking-[0.14em] uppercase text-stone-800">
        <a href="/philosophy" class="hover:text-black transition-colors ${path === '/philosophy' ? 'text-black font-semibold' : ''}">Philosophy</a>
        <a href="/artisan-pieces" class="hover:text-black transition-colors ${path === '/artisan-pieces' ? 'text-black font-semibold' : ''}">Artisan Pieces</a>
        <a href="/materiality" class="hover:text-black transition-colors ${path === '/materiality' ? 'text-black font-semibold' : ''}">Materiality</a>
        <a href="/our-story" class="hover:text-black transition-colors ${path === '/our-story' ? 'text-black font-semibold' : ''}">Our Story</a>
        <a href="/contact" class="hover:text-black transition-colors ${path === '/contact' ? 'text-black font-semibold' : ''}">Contact</a>
        <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary header-enquire-btn"><span>Enquire</span></a>
      </nav>

      <div class="flex lg:hidden items-center">
        <button id="mobile-menu-btn" class="text-black p-3" aria-label="Open Navigation Menu" aria-expanded="false" aria-controls="mobile-menu-drawer">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile Menu Drawer (Task 2) -->
  <div id="mobile-menu-drawer" class="hidden fixed inset-0 z-50 bg-[#ececec] text-[#111111] pt-20 px-8 flex flex-col justify-between pb-12" role="dialog" aria-modal="true" aria-label="Site Navigation">
    <div class="flex justify-end items-center mb-8">
      <button id="mobile-menu-close-btn" class="text-black text-3xl p-3" aria-label="Close Navigation Menu">&times;</button>
    </div>
    <nav class="flex flex-col space-y-6 text-2xl font-light uppercase tracking-[0.2em]">
      <a href="/philosophy" class="text-stone-900 hover:text-black transition-colors">Philosophy</a>
      <a href="/artisan-pieces" class="text-stone-900 hover:text-black transition-colors">Artisan Pieces</a>
      <a href="/materiality" class="text-stone-900 hover:text-black transition-colors">Materiality</a>
      <a href="/our-story" class="text-stone-900 hover:text-black transition-colors">Our Story</a>
      <a href="/contact" class="text-stone-900 hover:text-black transition-colors">Contact</a>
    </nav>
    <div class="pt-8 border-t border-stone-300">
      <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary w-full text-center py-3.5 text-xs uppercase tracking-[0.2em] font-semibold"><span>Enquire via WhatsApp</span></a>
    </div>
  </div>

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

      <!-- Content Overlay: Clean 3 Columns -->
      <div class="relative z-20 space-y-6 lg:space-y-8 my-auto">
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-t transition-colors duration-500" id="footer-grid-border">
          <div class="max-w-2xl space-y-2">
            <span id="footer-brand-title" class="text-[11px] font-mono uppercase tracking-[0.3em] block font-semibold transition-colors duration-500">${BRAND.fullName}</span>
            <h2 id="footer-hero-head" class="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-[1.15] transition-colors duration-500">
              Sculpting raw earth <br />
              <span id="footer-hero-sub" class="transition-colors duration-500">into timeless living sanctuaries</span>
            </h2>
          </div>
          <div>
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary inline-flex items-center gap-2">
              <span>WhatsApp Direct</span>
              <span class="btn-arrow">&rarr;</span>
            </a>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 pt-4">
          <div class="md:col-span-5 space-y-3">
            <span class="footer-lbl text-xs uppercase tracking-[0.3em] font-mono block font-semibold">Visit</span>
            <p class="footer-txt text-xs font-light leading-relaxed max-w-sm">${BRAND.address}</p>
            <p class="footer-txt text-xs font-light pt-1">${BRAND.timing}</p>
          </div>

          <div class="md:col-span-4 space-y-3">
            <span class="footer-lbl text-xs uppercase tracking-[0.25em] font-mono block font-semibold">Contact</span>
            <div class="text-xs space-y-2 font-light">
              <p class="footer-txt"><a href="tel:${BRAND.phoneDisplay}" class="hover:underline font-medium">+91 ${BRAND.phoneDisplay}</a></p>
              <p class="footer-txt"><a href="mailto:${BRAND.email}" class="hover:underline">${BRAND.email}</a></p>
            </div>
          </div>

          <div class="md:col-span-3 space-y-3">
            <span class="footer-lbl text-xs uppercase tracking-[0.25em] font-mono block font-semibold">Navigate</span>
            <ul class="space-y-2 text-xs font-medium">
              <li><a href="/philosophy" class="hover:underline transition-colors">Philosophy</a></li>
              <li><a href="/artisan-pieces" class="hover:underline transition-colors">Artisan Pieces</a></li>
              <li><a href="/materiality" class="hover:underline transition-colors">Materiality</a></li>
              <li><a href="/our-story" class="hover:underline transition-colors">Our Story</a></li>
              <li><a href="/contact" class="hover:underline transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div id="footer-bottom-strip" class="relative z-20 pt-4 mt-4 border-t flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono uppercase tracking-[0.18em] font-semibold gap-4 transition-colors duration-500">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          <span>© ${new Date().getFullYear()} ${BRAND.fullName}. ALL RIGHTS RESERVED.</span>
        </div>
        <div class="flex items-center gap-6">
          <a href="/privacy-policy" class="hover:underline transition-colors">Privacy</a>
          <a href="/terms" class="hover:underline transition-colors">Terms</a>
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

  <!-- GSAP, ScrollTrigger, Lenis & SplitType (Local Vendor Bundles) -->
  <script src="/js/vendor/gsap.min.js"></script>
  <script src="/js/vendor/ScrollTrigger.min.js"></script>
  <script src="/js/vendor/split-type.min.js"></script>
  <script src="/js/vendor/lenis.min.js"></script>

  <script src="/js/main.js"></script>
  <script src="/js/clickSpark.js?v=1.0"></script>
  <script src="/js/footerLightRays.js"></script>
  ${isHeroPage ? '<script src="/js/heroCanvas.js"></script>' : ''}
  <script src="/js/homeAnimations.js?v=6.0"></script>
  <script>
    (function() {
      if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        var isNavigating = false;
        window.addEventListener('beforeunload', function() {
          isNavigating = true;
        });

        try {
          var es = new EventSource('/dev/live-reload');
          es.onmessage = function(e) {
            if (e.data === 'reload' && !isNavigating) {
              location.reload();
            }
          };
          es.onerror = function() {
            if (isNavigating) {
              try { es.close(); } catch(e) {}
            }
          };
        } catch (err) {}
      }
    })();
  </script>
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

  // SECTION 2: 1:1 LUSION RECREATION (NARRATIVE TYPOGRAPHY -> WARPING 3D RIBBON & QUAD -> DOCKED ATELIER REEL)
  const sectionManifestoAndExpedition = `
  <section id="section-lusion-reel" class="section-lusion-reel relative w-full overflow-visible select-none z-20" aria-label="Elysium Atelier Philosophy and Showreel">
    
    <!-- Pinned Viewport Container (Locks in for the entire scroll sequence) -->
    <div id="lusion-reel-stage" class="lusion-reel-stage relative w-full h-screen overflow-hidden flex flex-col justify-between">
      
      <!-- 1. Dominant Typography & Intro Narrative (Headline, Paragraph, Pill CTA) -->
      <div id="lusion-reel-intro" class="lusion-reel-intro absolute inset-0 w-full h-full pointer-events-none z-20 flex flex-col justify-between">
        
        <!-- Top Section: Eyebrow + Huge 2-Line Headline -->
        <div class="lusion-reel-top-block w-full">
          <span class="lusion-reel-eyebrow font-mono uppercase tracking-[0.45em] text-stone-600 block mb-2 sm:mb-3">
            THE ATELIER
          </span>
          <div class="lusion-reel-title-block">
            <div class="lusion-reel-title-line line-1">
              <span class="lusion-title-text">Every Piece</span>
            </div>
            <div class="lusion-reel-title-line line-2">
              <span class="lusion-title-text">Begins with a Name.</span>
            </div>
          </div>
        </div>

        <!-- Right-Anchored Paragraph and Pill Button -->
        <div class="lusion-reel-content-block">
          <p class="lusion-reel-desc font-light">
            We combine volcanic silicate ash, unsealed Italian travertine, and aged timber of absolute purity. From architectural stone monoliths to tactile vessels, every creation is hand-sculpted for eternity.
          </p>
          <div class="pt-5 sm:pt-6 pointer-events-auto">
            <a href="/our-story" id="lusion-reel-approach-btn" class="lusion-pill-btn inline-flex items-center group" data-magnetic="true">
              <span class="lusion-pill-dot"></span>
              <span class="lusion-pill-text">EXPLORE ATELIER PROVENANCE</span>
            </a>
          </div>
        </div>

      </div>

      <!-- 2. Hardware-Accelerated WebGL Liquid Canvas Layer (Z-20 to sit ON TOP of SVG path) -->
      <canvas id="lusion-webgl-canvas" class="lusion-webgl-canvas absolute inset-0 w-full h-full block z-20 pointer-events-none" data-src="/images/atelier-immersive.jpg"></canvas>

      <!-- 2.5. Interactive Scroll-Triggered SVG Drawing Path Layer (Z-10 behind image) -->
      <div id="lusion-reel-svg-container" class="lusion-line-container absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible" aria-hidden="true">
        <svg
          id="lusion-reel-svg"
          class="lusion-svg-line w-full h-full"
          viewBox="0 0 1920 1080"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <!-- Luxury Black-Grey Monochromatic Ribbon Gradient -->
            <linearGradient id="lusionRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#141416" />
              <stop offset="35%" stop-color="#2a2a2e" />
              <stop offset="70%" stop-color="#4a4a52" />
              <stop offset="100%" stop-color="#18181b" />
            </linearGradient>
          </defs>

          <!-- Solid Crisp 3D Ribbon Tube starting from top-left screen edge (34px Bold Stroke) -->
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

      <!-- 3. Docked Reel Overlay UI ("PLAY ▶ ATELIER" & 5-Column Registration Marks) -->
      <div id="lusion-reel-ui" class="lusion-reel-ui absolute inset-0 w-full h-full pointer-events-none z-30 flex flex-col justify-center items-center opacity-0">
        
        <!-- Registration '+' Marks Top Row (5 columns evenly spaced across frame width) -->
        <div class="lusion-reg-row lusion-reg-top absolute flex justify-between pointer-events-none">
          <span class="lusion-reg-plus">+</span>
          <span class="lusion-reg-plus">+</span>
          <span class="lusion-reg-plus">+</span>
          <span class="lusion-reg-plus">+</span>
          <span class="lusion-reg-plus">+</span>
        </div>

        <!-- Central "PLAY ▶ ATELIER" Text Reveal and Play Pill -->
        <div id="lusion-play-trigger" class="lusion-play-cta-wrap flex items-center justify-center pointer-events-auto cursor-pointer">
          <span class="lusion-play-word lusion-word-left">PLAY</span>
          
          <!-- Center Floating Play Pill Button -->
          <button id="lusion-play-pill" class="lusion-play-pill mx-4 sm:mx-8 flex items-center justify-center transition-transform hover:scale-105" aria-label="Play Atelier Showreel">
            <svg class="w-6 h-6 text-black fill-current translate-x-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>

          <span class="lusion-play-word lusion-word-right">ATELIER</span>
        </div>

        <!-- Registration '+' Marks Bottom Row (5 columns evenly spaced) -->
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

  <!-- FULLSCREEN HIGH-DEFINITION VIDEO / SHOWREEL MODAL -->
  <div id="lusion-video-modal" class="lusion-video-modal fixed inset-0 z-[9999] bg-black/95 backdrop-blur-3xl flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-400">
    <button id="lusion-modal-close" class="lusion-modal-close absolute top-6 right-8 text-white/80 hover:text-white font-mono text-xs uppercase tracking-[0.3em] flex items-center gap-2 cursor-pointer z-50">
      <span>CLOSE</span>
      <span class="text-lg">&times;</span>
    </button>

    <div class="relative w-[92vw] max-w-6xl aspect-video rounded-2xl overflow-hidden bg-stone-950 shadow-2xl border border-stone-800">
      <div id="lusion-modal-carousel" class="absolute inset-0 w-full h-full overflow-hidden">
        <img id="lusion-modal-img" src="/images/chapter_living_room.jpg" alt="Elysium Atelier Showreel Frame" class="w-full h-full object-cover transition-opacity duration-400" />
      </div>

      <div class="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white/80 text-[11px] font-mono tracking-widest pointer-events-none z-20">
        <span>ELYSIUM ATELIER &bull; RAJKOT SANCTUARY</span>
        <span id="lusion-modal-timer">00:01 / 00:06</span>
      </div>
    </div>
  </div>`;

  // SECTION 3: SPATIAL LIVING SANCTUARY • ARCHITECTURAL PROGRESSION (100VH STACKING CARDS DECK)
  const sectionLivingSanctuary = `
  <section class="elysium-stack-section relative bg-[#070708] border-t border-stone-800/80 text-white select-none overflow-hidden" id="spatial-sanctuary-container" aria-label="Spatial Living Sanctuary • Architectural Progression">
    
    <!-- Pinned Stacking Viewport Stage (100vh) - Clean, perfectly centered stage -->
    <div class="elysium-stack-stage relative w-full h-screen overflow-hidden flex items-center justify-center" id="sanctuary-stack-stage">
      
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
  </section>`;

  // SECTION 4: THE ARCHITECTURAL LINE SANCTUARY (User Provided Vector Art)
  let sanctuaryInlineSvg = '';
  try {
    sanctuaryInlineSvg = fs.readFileSync(path.join(__dirname, 'public', 'svg-section4.svg'), 'utf8');
  } catch (e) {
    sanctuaryInlineSvg = `<svg id="sanctuary-line-art-svg" viewBox="0 48 2048 1700" class="w-full h-auto max-h-[92svh] select-none mx-auto block"></svg>`;
  }

  const sectionLineArtScroll = `
  <section class="section-scroll-draw relative min-h-[100svh] h-[100svh] w-full flex items-center justify-center overflow-hidden" id="section-scroll-draw" aria-label="Architectural Sanctuary • Line Drawing Process">
    <!-- Visually hidden accessible description for screen readers -->
    <div class="sr-only">
      Minimalist single-line vector illustration of a living sanctuary featuring an armchair, floor lamp, side table with succulent houseplant, and a tropical potted plant, drawn dynamically in black line contours as you scroll.
    </div>

    <!-- Edge-to-edge SVG viewport stage -->
    <div class="sanctuary-svg-wrapper w-full h-full flex items-center justify-center" id="sanctuary-svg-container" style="opacity: 0;">
      ${sanctuaryInlineSvg}
    </div>
  </section>`;

  // SECTION 5: THE CURATED EDITORIAL COLLECTION (Natural Height Grid)
  const sectionFeaturedPieces = `
  <section class="section-featured-pieces relative bg-black border-t border-stone-800 text-white z-10 overflow-hidden py-12 sm:py-16 lg:py-20 px-6 md:px-12 lg:px-20">
    <div class="max-w-7xl mx-auto w-full space-y-6 my-auto">
      
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-800 pb-3">
        <div class="space-y-1">
          <span class="text-[11px] font-mono tracking-[0.3em] uppercase text-stone-400 block">
            FEATURED PIECES
          </span>
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-light tracking-wide text-white uppercase">
            Curated Collection
          </h2>
        </div>
        <a href="/artisan-pieces" class="btn-primary text-xs">
          <span>View Full Collection</span>
          <span class="btn-arrow ml-2">&rarr;</span>
        </a>
      </div>

      <!-- 4 Flagship Products Horizontal Grid -->
      <div class="featured-pieces-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        ${PRODUCTS.slice(0, 4).map((p, idx) => `
          <a href="/artisan-pieces/${p.slug}" class="featured-piece-card group flex flex-col justify-between bg-stone-950 p-4 space-y-3 transition-all duration-300 rounded-2xl border border-stone-800/60 hover:border-stone-600 block text-white no-underline" data-row="${idx}">
            
            <div class="space-y-3">
              <div class="featured-piece-img-wrap relative w-full aspect-[4/3] overflow-hidden bg-stone-900 rounded-2xl">
                <img
                  src="${p.image}"
                  alt="${p.name}"
                  class="featured-piece-img w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div class="space-y-1">
                <div class="flex justify-between items-baseline gap-2">
                  <h3 class="text-base font-light text-white uppercase tracking-wide truncate group-hover:text-stone-300 transition-colors">
                    ${p.name}
                  </h3>
                  <span class="text-xs font-mono text-stone-300 font-semibold tracking-wider whitespace-nowrap">
                    ${p.price}
                  </span>
                </div>

                <div class="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                  <span>${p.category}</span>
                </div>
              </div>
            </div>

            <!-- Single Secondary CTA -->
            <div class="pt-3 border-t border-stone-800/80 flex items-center justify-between mt-auto">
              <span class="text-xs font-medium uppercase tracking-wider text-stone-300 group-hover:text-white transition-colors">View Details &rarr;</span>
            </div>

          </a>
        `).join('')}
      </div>

    </div>
  </section>`;

  // SECTION 6: THE CLIENT VOICE & DUAL-AXIS INFINITE MARQUEE (Calibrated)
  const factualStatementsRow1 = [
    "4,500 SQ. FT. ATELIER — VAVDI, RAJKOT",
    "100% RAW, UNSEALED MATERIALS",
    "DIRECT ARTISAN PARTNERSHIPS",
    "NO SYNTHETIC LACQUERS OR ADHESIVES"
  ];
  const quoteRawText = "The travertine console feels less like placed furniture and more like a permanent piece of architecture. It brings a profound, grounding stillness to our living space.";

  const sectionTrustVoice = `
  <section class="section-trust-voice relative bg-[#030303] border-t border-stone-800 text-white overflow-hidden" id="trust-voice-container">
    
    <!-- 1. Horizontal Text Stream Viewport -->
    <div class="Horizontal relative w-full h-[100svh] overflow-hidden bg-[#030303] flex items-center" id="trust-horizontal-wrapper">
      
      <div class="absolute top-8 left-6 md:left-12 lg:left-20 z-20 pointer-events-none">
        <span class="trust-eyebrow text-[11px] font-mono tracking-[0.3em] uppercase text-stone-400 block">
          VOICES
        </span>
      </div>

      <!-- Horizontal Text Stream -->
      <div class="Horizontal__container w-full">
        <h3 class="Horizontal__text text-3xl sm:text-5xl lg:text-6xl font-light select-none tracking-tight whitespace-nowrap text-stone-200" id="trust-horizontal-stream">
          “${quoteRawText}”
        </h3>
      </div>

      <!-- Bottom Attribution -->
      <div class="absolute bottom-8 left-6 right-6 md:left-12 md:right-12 lg:left-20 lg:right-20 z-20 flex justify-between items-center text-[10px] font-mono tracking-widest text-stone-400 uppercase border-t border-white/10 pt-3 pointer-events-none">
        <span>Interior Architecture Studio, Mumbai</span>
      </div>

    </div>

    <!-- 2. Sculptural Frosted Glass Testimonial Component with Animated Stone Fragments -->
    <div class="section-testimonial-stage relative w-full py-16 sm:py-20 lg:py-24 px-6 sm:px-10 lg:px-16 overflow-hidden flex flex-col items-center justify-center border-t border-stone-800/80 bg-black min-h-[100svh]" id="trust-testimonial-stage">
      
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
      <div id="elysium-testimonial-card" class="testimonial-card relative z-10 w-full max-w-2xl bg-stone-950/80 backdrop-blur-2xl border border-stone-800 rounded-2xl p-8 sm:p-12 text-center shadow-2xl overflow-visible will-change-[transform,opacity]">
        
        <!-- Top Custom Architectural Botanical Mandala Emblem with Circular Portrait -->
        <div class="testimonial-wreath-wrap relative w-56 sm:w-64 h-auto mx-auto mb-6 flex items-center justify-center">
          
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

        <!-- Crossfading Text Content Container -->
        <div id="testimonial-content-container" class="space-y-4">
          <h3 id="testimonial-headline" class="testimonial-headline text-3xl sm:text-4xl font-light text-stone-950 tracking-wide leading-tight">
            “Grounded.”
          </h3>

          <p id="testimonial-quote" class="testimonial-quote text-sm sm:text-base text-stone-700 font-light leading-relaxed max-w-xl mx-auto">
            “Elysium delivered a custom travertine console that transformed our living room into a monolithic living sanctuary with unmatched tactile reverence.”
          </p>

          <div id="testimonial-attribution-block" class="testimonial-attribution pt-4">
            <div class="text-xs sm:text-sm text-stone-600">
              <strong id="testimonial-author" class="font-medium text-stone-950">Sarah P.</strong>
              <span class="text-stone-400 mx-1">•</span>
              <span id="testimonial-project" class="text-stone-500">South Bombay</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Navigation Dots -->
      <div class="testimonial-dots flex items-center justify-center gap-2.5 mt-8 relative z-20" id="testimonial-dots-nav">
        <button class="testimonial-dot active w-2.5 h-2.5 rounded-full bg-stone-950 transition-all cursor-pointer" data-idx="0" aria-label="Testimonial 1"></button>
        <button class="testimonial-dot w-2.5 h-2.5 rounded-full bg-stone-300 hover:bg-stone-500 transition-all cursor-pointer" data-idx="1" aria-label="Testimonial 2"></button>
        <button class="testimonial-dot w-2.5 h-2.5 rounded-full bg-stone-300 hover:bg-stone-500 transition-all cursor-pointer" data-idx="2" aria-label="Testimonial 3"></button>
      </div>

    </div>

  </section>`;

  // Render combined page with breathtaking 100vh interactive body sections between Hero and Footer
  res.send(renderPage({
    title: 'Elysium | Artisan Minimalist Home Decor, Handcrafted in India',
    description: BRAND.heroStatement,
    path: '/',
    content: heroSection + sectionManifestoAndExpedition + sectionLivingSanctuary + sectionLineArtScroll + sectionFeaturedPieces + sectionTrustVoice,
    isHeroPage: true,
  }));
});

// 2. Philosophy Page Route
app.get('/philosophy', (req, res) => {
  const content = `
  <div class="pt-28 pb-24 bg-black text-white">
    <section class="px-6 md:px-12 lg:px-24 py-16 max-w-7xl mx-auto border-b border-stone-800">
      <span class="text-[10px] tracking-[0.45em] uppercase text-amber-500 font-mono block">THE ELYSIUM ETHOS</span>
      <h1 class="text-4xl sm:text-6xl font-light tracking-wide leading-tight text-white uppercase font-sans mt-4">Designed for Silence. Built for Generations.</h1>
      <p class="text-sm sm:text-base text-stone-300 leading-relaxed font-light pt-4 max-w-3xl">At Elysium, we believe a home is a sanctuary where objects shouldn’t compete for attention. Our pieces are formed slowly with deep respect for raw earth mediums, letting each raw element radiate a quiet, elegant dignity.</p>
    </section>

    <section class="px-6 md:px-12 lg:px-24 py-24 max-w-7xl mx-auto border-b border-stone-800">
      <h2 class="text-3xl font-light tracking-wide text-white uppercase font-sans mb-12">Three Pillars of Design</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        ${renderBaroqueBox({
    content: `
            <span class="text-xs font-mono font-bold text-amber-500 block mb-3">PILLAR 01</span>
            <h3 class="text-xl font-light text-white uppercase mb-2">Purity of Origin</h3>
            <p class="text-xs text-stone-400 leading-relaxed font-light">We source only unrefined travertine, premium iron-dense clay, and slow-grow timber without synthetic coatings or chemical glues.</p>
          `,
    className: 'p-8'
  })}
        ${renderBaroqueBox({
    content: `
            <span class="text-xs font-mono font-bold text-amber-500 block mb-3">PILLAR 02</span>
            <h3 class="text-xl font-light text-white uppercase mb-2">Wabi-Sabi Aesthetics</h3>
            <p class="text-xs text-stone-400 leading-relaxed font-light">We embrace organic cracks, natural geomorphic voids, and firing speckles as the individual voice of the medium.</p>
          `,
    className: 'p-8'
  })}
        ${renderBaroqueBox({
    content: `
            <span class="text-xs font-mono font-bold text-amber-500 block mb-3">PILLAR 03</span>
            <h3 class="text-xl font-light text-white uppercase mb-2">Silent Geometry</h3>
            <p class="text-xs text-stone-400 leading-relaxed font-light">Simple low proportions, continuous physical cuts, and soft light absorption anchoring a room with calm authority.</p>
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
  <div class="pt-28 pb-24 bg-black text-white min-h-screen">
    <div class="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
      <div class="mb-16 space-y-4">
        <span class="text-[10px] tracking-[0.45em] uppercase text-amber-500 font-mono block">ARTISAN CATALOGUE</span>
        <h1 class="text-4xl sm:text-6xl font-light tracking-wide text-white uppercase font-sans">Handcrafted Collection</h1>
      </div>

      <div id="category-filter-bar" class="flex flex-wrap gap-3 pb-12 mb-12 border-b border-stone-800">
        <button class="category-btn active" data-category="All"><span>All</span></button>
        <button class="category-btn" data-category="Furniture"><span>Furniture</span></button>
        <button class="category-btn" data-category="Sculpture"><span>Sculpture</span></button>
        <button class="category-btn" data-category="Lighting"><span>Lighting</span></button>
        <button class="category-btn" data-category="Vessels"><span>Vessels</span></button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        ${PRODUCTS.map(p => `
          <div class="product-card group cursor-pointer flex flex-col justify-between space-y-4 h-full" data-category="${p.category}">
            <div class="space-y-4">
              ${renderProductImage({
    src: p.image,
    alt: p.name,
    href: `/artisan-pieces/${p.slug}`,
    imgClassName: 'absolute inset-0 w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-700',
    aspect: 'w-full aspect-[3/4] relative overflow-hidden'
  })}
              <div class="space-y-1">
                <a href="/artisan-pieces/${p.slug}"><h3 class="text-sm font-medium text-white hover:text-amber-200 transition-colors">${p.name}</h3></a>
                <p class="text-[11px] font-mono text-stone-400 uppercase tracking-wider">${p.material} • By ${p.artisan}</p>
              </div>
            </div>
            <div class="pt-2 flex items-center justify-between border-t border-stone-800/50">
              <a href="${createWhatsAppLink(p.name)}" target="_blank" rel="noopener noreferrer" class="text-[10px] uppercase tracking-[0.2em] text-stone-400 hover:text-amber-300 transition-colors">Enquire &rarr;</a>
              <a href="/artisan-pieces/${p.slug}" class="text-[10px] font-mono uppercase tracking-widest text-stone-500 hover:text-stone-300">Specs &rarr;</a>
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
      content: '<div class="pt-32 pb-32 text-center text-white"><h1 class="text-2xl font-mono">PIECE NOT FOUND</h1><a href="/artisan-pieces" class="mt-4 inline-block text-xs font-mono uppercase underline">Back to collection</a></div>',
    }));
  }

  const whatsappUrl = createWhatsAppLink(product.name);

  const content = `
  <div class="pt-28 pb-24 bg-black text-white min-h-screen">
    <div class="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
      <div class="mb-8"><a href="/artisan-pieces" class="text-xs font-mono uppercase tracking-[0.2em] text-stone-400 hover:text-amber-300 transition-colors">&larr; Back to Artisan Collection</a></div>
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div class="lg:col-span-7">
          ${renderProductImage({
    src: product.image,
    alt: product.name,
    aspect: 'w-full aspect-[4/5] relative overflow-hidden',
    imgClassName: 'absolute inset-0 w-full h-full object-cover object-center'
  })}
        </div>
        <div class="lg:col-span-5 space-y-8">
          <div class="space-y-3">
            <span class="text-[10px] tracking-[0.4em] uppercase text-amber-500 font-mono block">ARTISAN EDITION</span>
            <h1 class="text-3xl sm:text-4xl font-light tracking-wide text-white uppercase font-sans">${product.name}</h1>
            <p class="text-xs font-mono text-stone-400 uppercase tracking-widest pt-1">${product.material} • Crafted by ${product.artisan}</p>
          </div>
          
          ${renderBaroqueBox({
    content: `
              <p class="text-xs text-stone-300 leading-relaxed font-light">${product.description}</p>
              <div class="w-full h-px bg-stone-800 my-4"></div>
              <p class="text-xs text-stone-400 italic">“${product.story}”</p>
            `,
    className: 'p-6'
  })}

          <div class="space-y-4 pt-2">
            <h3 class="text-xs font-mono uppercase tracking-[0.25em] text-stone-400">Technical Specifications</h3>
            <div class="grid grid-cols-2 gap-4 text-xs font-mono">
              ${renderBaroqueBox({
    content: `<span class="text-[9px] text-stone-500 block">Dimensions</span><span class="text-stone-200 mt-1 block">${product.dimensions}</span>`,
    className: 'p-4'
  })}
              ${renderBaroqueBox({
    content: `<span class="text-[9px] text-stone-500 block">Approx. Weight</span><span class="text-stone-200 mt-1 block">${product.weight}</span>`,
    className: 'p-4'
  })}
              ${renderBaroqueBox({
    content: `<span class="text-[9px] text-stone-500 block">Provenance</span><span class="text-stone-200 mt-1 block">${product.origin}</span>`,
    className: 'p-4 col-span-2'
  })}
            </div>
          </div>
          <div class="pt-4 space-y-4">
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary w-full py-3.5 text-center text-xs font-semibold uppercase tracking-[0.25em] shadow-lg"><span>Enquire via WhatsApp</span><span class="btn-arrow ml-2">&rarr;</span></a>
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
  <div class="pt-28 pb-24 bg-black text-white min-h-screen">
    <div class="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
      <div class="max-w-2xl mb-16 space-y-4">
        <span class="text-[10px] tracking-[0.45em] uppercase text-amber-500 font-mono block">MEDIUM EXPLORATION</span>
        <h1 class="text-4xl sm:text-6xl font-light tracking-wide text-white uppercase font-sans">Tactile Materiality</h1>
        <p class="text-xs sm:text-sm text-stone-400 tracking-wider font-light leading-relaxed">Interact with our raw geomorphic stones, clay types, timber, and plant-based finishes.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        <div class="lg:col-span-5 space-y-4">
          <span class="text-[9px] font-mono uppercase tracking-[0.3em] text-stone-400 block mb-2">Primary Mediums</span>
          ${MATERIALS.map((m, idx) => `
            ${renderBaroqueBox({
    content: `
                <div class="material-card space-y-2 cursor-pointer transition-all hover:border-amber-400/60 ${idx === 0 ? 'active-material' : ''}" data-material-id="${m.id}" data-macro-img="${m.macroImage}" data-default-angle="${m.lightAngleDefault}" data-name="${m.name}">
                  <div class="flex justify-between items-center">
                    <span class="text-[10px] font-mono text-stone-500 uppercase">${m.category}</span>
                    <span class="text-[9px] font-mono text-amber-500 tracking-wider">Default ${m.lightAngleDefault}°</span>
                  </div>
                  <h3 class="text-base font-light text-white">${m.name}</h3>
                  <p class="text-xs text-stone-400 leading-relaxed font-light">${m.description}</p>
                </div>
              `,
    className: 'p-5'
  })}
          `).join('')}
        </div>

        <div class="lg:col-span-7">
          ${renderBaroqueBox({
    content: `
              <div class="flex justify-between items-center text-[10px] uppercase font-mono text-stone-400 border-b border-stone-800 pb-4 mb-6">
                <span id="material-title-display">Travertine Stone</span>
                <span id="light-angle-display">Incident Angle: 135°</span>
              </div>

              <div class="flex items-center justify-center p-4">
                <div class="relative w-full max-w-md aspect-square flex items-center justify-center">
                  ${renderProductImage({
      src: '/images/photo-1616486338812-3dadae4b4ace',
      alt: 'Material preview',
      aspect: 'w-full h-full',
      imgClassName: 'w-full h-full object-cover grayscale brightness-90 transition-all duration-500'
    })}
                  <div id="material-light-overlay" class="absolute inset-4 pointer-events-none mix-blend-overlay transition-all duration-300" style="background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.75) 100%);"></div>
                  <button id="macro-zoom-btn" class="absolute top-6 right-6 text-xs font-mono uppercase text-stone-300 bg-black/80 backdrop-blur-md px-3 py-1.5 border border-stone-800 hover:bg-stone-900 transition-colors z-30">Macro Zoom</button>
                </div>
              </div>

              <div class="space-y-3 pt-6 border-t border-stone-800 mt-6">
                <span class="text-xs text-stone-400 font-mono block">Rotate light angle to reveal surface crevices</span>
                <input id="light-angle-slider" type="range" min="0" max="360" value="135" class="w-full accent-amber-500">
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
    description: 'The materials and sourcing philosophy behind Elysium’s artisan home decor.',
    path: '/materiality',
    content,
  }));
});

// 6. Our Story Route
app.get('/our-story', (req, res) => {
  const whatsappUrl = createWhatsAppLink();
  const content = `
  <div class="pt-28 pb-24 bg-black text-white min-h-screen">
    <div class="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
      <section class="py-12 border-b border-stone-800 space-y-6 max-w-4xl">
        <span class="text-[10px] tracking-[0.45em] uppercase text-amber-500 font-mono block">THE ATELIER JOURNEY</span>
        <h1 class="text-4xl sm:text-6xl font-light tracking-wide text-white uppercase font-sans">Our Story & Provenance</h1>
        <p class="text-sm sm:text-base text-stone-300 leading-relaxed font-light pt-2">Elysium was founded as a quiet reaction against mass production and artificial coatings. We collaborate directly with master artisans across Rajkot, Volterra, Tuscany, and the Peloponnese to curate timeless home objects sculpted from raw limestone, organic clay, and slow-grown white oak.</p>
      </section>

      <section class="py-20 border-b border-stone-800">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div class="lg:col-span-6 space-y-6">
            <span class="text-[10px] tracking-[0.4em] uppercase text-amber-500 font-mono block">PHYSICAL ATELIER SHOWROOM</span>
            <h2 class="text-3xl sm:text-4xl font-light text-white uppercase">${BRAND.showroomSize}</h2>
            <p class="text-xs sm:text-sm text-stone-400 leading-relaxed font-light">Located in Rajkot, Gujarat, our 4,500 sq. ft. Display Atelier invites collectors to experience raw travertine, stoneware clay, and plaster lighting under natural light.</p>
            <div class="space-y-2 pt-2 text-xs font-mono text-stone-300">
              <p>📍 ${BRAND.address}</p>
              <p>⏰ ${BRAND.timing}</p>
            </div>
          </div>
          <div class="lg:col-span-6">
            ${renderProductImage({
    src: '/images/photo-1600121848594-d8644e57abab',
    alt: 'Showroom',
    aspect: 'w-full aspect-[16/10] relative overflow-hidden',
    imgClassName: 'absolute inset-0 w-full h-full object-cover grayscale opacity-85'
  })}
          </div>
        </div>
      </section>

      <section class="py-24 border-b border-stone-800">
        <div class="mb-16 space-y-3 max-w-2xl">
          <span class="text-[10px] tracking-[0.45em] uppercase text-amber-500 font-mono block">CHRONOLOGY OF CREATION</span>
          <h2 class="text-3xl sm:text-4xl font-light tracking-wide text-white uppercase font-sans">From Quarry & Earth to Home</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${[
            { step: '01', title: 'Extraction & Selection', duration: '2 to 3 days per block', description: 'Our raw blocks are sourced directly from independent historical quarries in Tuscany and the Peloponnese, picking only blocks showing robust natural fault lines.', supervisor: 'Sandro Moretti' },
            { step: '02', title: 'Precision Sculpting', duration: '15 to 30 hours per piece', description: 'Artisans execute shaping using traditional manual processes—chisels for stone, kickwheels for clay, and ancient copper saws for wood joints, keeping wood-glues and chemical compounds out of our processes.', supervisor: 'Kenji Yoshino & Matteo Ghiberti' },
            { step: '03', title: 'Tactile Hand Buffing', duration: '5 to 8 days of drying & curing', description: 'Instead of synthetic coatings, we hand-rub surfaces with pulverized pumice stone, linseed oil, and organic desert wax. This preserves natural wood breathing and the limestone aroma.', supervisor: 'Eleni Kora' }
          ].map(step => `
            <div class="bg-stone-900/60 p-8 border border-stone-800 space-y-6">
              <div class="space-y-2">
                <span class="text-xs font-mono font-bold text-stone-500">PHASE ${step.step} • ${step.duration}</span>
                <h3 class="text-xl font-light tracking-wide text-white uppercase">${step.title}</h3>
              </div>
              <p class="text-xs text-stone-400 leading-relaxed font-light">${step.description}</p>
              <div class="pt-4 border-t border-stone-800 text-[10px] font-mono text-stone-400">
                Supervisor: ${step.supervisor}
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="py-20 text-center space-y-6">
        <h2 class="text-2xl sm:text-3xl font-light tracking-wide text-white uppercase font-sans">Connect With Our Curators</h2>
        <p class="text-xs text-stone-400 max-w-md mx-auto font-light leading-relaxed">Whether sourcing for a single residential sanctuary or a complete trade project, our team is available for direct consultation.</p>
        <div class="pt-2">
          <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.25em] inline-flex items-center gap-2 shadow-lg"><span>Start Consultation via WhatsApp</span><span class="btn-arrow">&rarr;</span></a>
        </div>
      </section>
    </div>
  </div>`;

  res.send(renderPage({
    title: 'Our Story | The Elysium Journey',
    description: 'How Elysium started, and the artisan partners behind every piece in the collection.',
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
  <div class="pt-28 pb-24 bg-black text-white min-h-screen">
    <div class="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
      <div class="max-w-3xl mb-16 space-y-4">
        <span class="text-[10px] tracking-[0.45em] uppercase text-amber-500 font-mono block">ENQUIRIES & CONSULTATIONS</span>
        <h1 class="text-4xl sm:text-6xl font-light tracking-wide text-white uppercase font-sans">Contact Elysium</h1>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div class="lg:col-span-5 space-y-8">
          ${renderBaroqueBox({
    content: `
              <span class="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-500 block mb-2">Instant Communication</span>
              <h3 class="text-xl font-light text-white uppercase mb-4">WhatsApp Direct Line</h3>
              <a href="${createWhatsAppLink(pieceName)}" target="_blank" rel="noopener noreferrer" class="btn-primary w-full py-3.5 text-center text-xs font-semibold uppercase tracking-[0.25em] shadow-md"><span>OPEN WHATSAPP CHAT</span><span class="btn-arrow ml-2">&rarr;</span></a>
            `,
    className: 'p-8'
  })}

          ${renderBaroqueBox({
    content: `
              <div class="space-y-4 text-xs font-mono text-stone-300">
                <p><span class="text-stone-500 block">ADDRESS</span>${BRAND.address}</p>
                <p><span class="text-stone-500 block">PHONE</span>+91 ${BRAND.phoneDisplay}</p>
                <p><span class="text-stone-500 block">HOURS</span>${BRAND.timing}</p>
              </div>
            `,
    className: 'p-8'
  })}
        </div>

        <div class="lg:col-span-7">
          ${renderBaroqueBox({
    content: `
              <h2 class="text-2xl font-light tracking-wide text-white uppercase mb-6">Send an Enquiry</h2>
              <div id="form-success-alert" class="hidden p-6 bg-stone-900 border border-stone-800 text-center mb-6">
                <h3 class="text-lg font-light text-white uppercase">Enquiry Received</h3>
                <p class="text-xs text-stone-400 mt-2">Thank you. An atelier curator will respond within 24 hours.</p>
              </div>
              <form id="contact-form" class="space-y-6 text-xs">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <input type="text" name="fullName" required placeholder="Full Name *" class="w-full bg-stone-900 border border-stone-800 p-3.5 text-white focus:border-amber-400 outline-none transition-colors">
                  <input type="email" name="email" required placeholder="Email Address *" class="w-full bg-stone-900 border border-stone-800 p-3.5 text-white focus:border-amber-400 outline-none transition-colors">
                </div>
                <textarea id="contact-message" name="message" required rows="5" placeholder="Your Message..." class="w-full bg-stone-900 border border-stone-800 p-3.5 text-white focus:border-amber-400 outline-none transition-colors">${initialMessage}</textarea>
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
    content: '<div class="pt-32 pb-24 max-w-4xl mx-auto px-6 text-white"><h1 class="text-3xl font-light uppercase">Privacy Policy</h1><p class="text-xs text-stone-400 mt-6 leading-relaxed">At Elysium, we collect personal information solely to process artisan decor enquiries and consultations. We do not share data with third parties.</p></div>',
  }));
});

app.get('/terms', (req, res) => {
  res.send(renderPage({
    title: 'Terms of Service | Elysium Home Decor',
    description: 'Terms of service for Elysium Home Decor.',
    path: '/terms',
    content: '<div class="pt-32 pb-24 max-w-4xl mx-auto px-6 text-white"><h1 class="text-3xl font-light uppercase">Terms of Service</h1><p class="text-xs text-stone-400 mt-6 leading-relaxed">All pieces are handcrafted from raw natural materials. Natural voids and fissures are inherent characteristics of wabi-sabi hand craftsmanship.</p></div>',
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
      <div class="pt-36 pb-32 max-w-2xl mx-auto px-6 text-center text-white min-h-[60vh] flex flex-col justify-center items-center space-y-6">
        <span class="text-[10px] font-mono tracking-[0.4em] uppercase text-stone-400 block">ERROR 404</span>
        <h1 class="text-4xl sm:text-5xl font-light uppercase tracking-wide">Sanctuary Not Found</h1>
        <p class="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">The page you are looking for may have moved or no longer exists in our atelier catalogue.</p>
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
      <div class="pt-36 pb-32 max-w-2xl mx-auto px-6 text-center text-white min-h-[60vh] flex flex-col justify-center items-center space-y-6">
        <span class="text-[10px] font-mono tracking-[0.4em] uppercase text-stone-400 block">ERROR 500</span>
        <h1 class="text-4xl sm:text-5xl font-light uppercase tracking-wide">Atelier Disruption</h1>
        <p class="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">Our atelier system encountered an unexpected condition. Please refresh or return home.</p>
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

