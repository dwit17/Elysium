const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Development Live Reload via SSE
const liveReloadClients = new Set();
if (process.env.NODE_ENV !== 'production') {
  app.get('/dev/live-reload', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    liveReloadClients.add(res);
    req.on('close', () => liveReloadClients.delete(res));
  });

  app.get('/dev/ping', (req, res) => res.send('ok'));

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
    fs.watch(publicDir, { recursive: true }, (eventType, filename) => {
      if (filename && /\.(css|js|html)$/i.test(filename)) {
        broadcastReload();
      }
    });
  }
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
    image: '/images/photo-1612196808214-b8e1d6145a8c',
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
    image: '/images/photo-1616486338812-3dadae4b4ace',
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
    image: '/images/photo-1507473885765-e6ed057f782c',
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
    image: '/images/photo-1592078615290-033ee584e267',
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
    image: '/images/photo-1615529182904-14819c35db37',
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
    image: '/images/photo-1578749556568-bc2c40e68b61',
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
    image: '/images/photo-1600121848594-d8644e57abab',
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
    image: '/images/photo-1567538096630-e0c55bd6374c',
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
    macroImage: '/images/photo-1616486338812-3dadae4b4ace',
    lightAngleDefault: 135,
  },
  {
    id: 'clay',
    name: 'Organic Stoneware Clay',
    category: 'Medium 02',
    description: 'Iron-rich stoneware clay gathered from riverbeds, hand-turned on kickwheels and pit-fired at low temperatures.',
    tactileSignature: 'Earthy, matte texture with delicate fire-speckled variation.',
    characteristics: ['High mineral and iron oxide content', 'Naturally breathable porous clay', 'Hand-turned without high-speed electric wheels'],
    macroImage: '/images/photo-1612196808214-b8e1d6145a8c',
    lightAngleDefault: 90,
  },
  {
    id: 'oak',
    name: 'Crafted Oak Timber',
    category: 'Medium 03',
    description: 'Heirloom white oak grown slowly in cooler climates to foster dense annual ring patterns and fibrous resilience.',
    tactileSignature: 'Warm, fibrous satin grain carved and wax-rubbed by hand.',
    characteristics: ['Dense, tight annual ring configurations', 'Shou Sugi Ban smoke option natural tannins', 'Organic mountain beeswax polish'],
    macroImage: '/images/photo-1592078615290-033ee584e267',
    lightAngleDefault: 180,
  },
  {
    id: 'plaster',
    name: 'Textured Lime Plaster',
    category: 'Medium 04',
    description: 'Hydraulic lime combined with pulverized pumice stone, applied layer upon layer with hand trowels for a matte velvet finish.',
    tactileSignature: 'Soft, stone-like warmth that gently diffuses incident light.',
    characteristics: ['Breathable mineral composition', 'Hand-troweled multi-coat application', 'Absorbs and diffuses ambient room lighting'],
    macroImage: '/images/photo-1507473885765-e6ed057f782c',
    lightAngleDefault: 45,
  },
];

const CRAFT_STEPS = [
  {
    step: '01',
    title: 'Extraction & Selection',
    duration: '2 to 3 days per block',
    description: 'Our raw blocks are sourced directly from independent historical quarries in Tuscany and the Peloponnese, picking only blocks showing robust natural fault lines.',
    tools: ['Pneumatic splitting wedges', 'Diamond-tipped hand saws', 'Traditional iron picks'],
    supervisor: 'Sandro Moretti',
  },
  {
    step: '02',
    title: 'Precision Sculpting',
    duration: '15 to 30 hours per piece',
    description: 'Artisans execute shaping using traditional manual processes—chisels for stone, kickwheels for clay, and ancient copper saws for wood joints, keeping wood-glues and chemical compounds out of our processes.',
    tools: ['Manual kickwheels', 'Tempered iron flat chisels', 'Traditional copper joints'],
    supervisor: 'Kenji Yoshino & Matteo Ghiberti',
  },
  {
    step: '03',
    title: 'Tactile Hand Buffing',
    duration: '5 to 8 days of drying & curing',
    description: 'Instead of synthetic coatings, we hand-rub surfaces with pulverized pumice stone, linseed oil, and organic desert wax. This preserves natural wood breathing and the limestone aroma.',
    tools: ['Pulverized pumice stones', 'Purified natural mountain beeswax', 'Broad brush fiber rags'],
    supervisor: 'Eleni Kora',
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:site_name" content="${BRAND.fullName}">
  <meta property="og:image" content="${BRAND.domain}/images/photo-1600121848594-d8644e57abab">
  <link rel="stylesheet" href="/css/tailwind.min.css">
  <link rel="stylesheet" href="/css/elysium.css">
  <script type="application/ld+json">${JSON.stringify(orgSchema)}</script>
</head>
<body class="bg-black text-white selection:bg-white selection:text-black">
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

  <!-- Sticky Header -->
  <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-sans header-blur py-4">
    <div class="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
      <a href="/" class="flex items-center gap-4 cursor-pointer">
        <img src="/images/logo.png" alt="ELYSIUM" class="h-10 md:h-12 w-auto filter invert opacity-90">
        <div class="flex flex-col">
          <span class="text-xs font-semibold tracking-[0.35em] text-white uppercase leading-tight">${BRAND.name}</span>
          <span class="text-[8px] tracking-[0.4em] text-stone-400 uppercase font-mono">HOME DECOR</span>
        </div>
      </a>

      <nav class="hidden lg:flex items-center space-x-8 text-xs font-medium tracking-[0.2em] uppercase text-stone-400">
        <a href="/philosophy" class="hover:text-white transition-colors ${path === '/philosophy' ? 'text-white border-b-2 border-white pb-1' : ''}">Philosophy</a>
        <a href="/artisan-pieces" class="hover:text-white transition-colors ${path === '/artisan-pieces' ? 'text-white border-b-2 border-white pb-1' : ''}">Artisan Pieces</a>
        <a href="/materiality" class="hover:text-white transition-colors ${path === '/materiality' ? 'text-white border-b-2 border-white pb-1' : ''}">Materiality</a>
        <a href="/our-story" class="hover:text-white transition-colors ${path === '/our-story' ? 'text-white border-b-2 border-white pb-1' : ''}">Our Story</a>
        <a href="/contact" class="hover:text-white transition-colors ${path === '/contact' ? 'text-white border-b-2 border-white pb-1' : ''}">Contact</a>
        <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="px-5 py-2.5 bg-white text-black text-[11px] font-semibold tracking-[0.2em] uppercase transition-all hover:bg-stone-200">Enquire</a>
      </nav>

      <div class="flex lg:hidden items-center space-x-3">
        <button id="mobile-menu-btn" class="lg:hidden text-white p-2" aria-label="Toggle Menu">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile Drawer -->
  <div id="mobile-menu-drawer" class="hidden fixed inset-0 z-50 bg-black bg-opacity-95 pt-24 px-8 flex flex-col justify-between pb-12">
    <div class="flex justify-between items-center mb-8">
      <span class="text-xs uppercase tracking-[0.4em] text-stone-500 font-mono">Menu Navigation</span>
      <button id="mobile-menu-close-btn" class="text-white text-2xl">&times;</button>
    </div>
    <nav class="flex flex-col space-y-6 text-xl font-light uppercase tracking-[0.25em]">
      <a href="/philosophy" class="text-stone-300 hover:text-white">Philosophy</a>
      <a href="/artisan-pieces" class="text-stone-300 hover:text-white">Artisan Pieces</a>
      <a href="/materiality" class="text-stone-300 hover:text-white">Materiality</a>
      <a href="/our-story" class="text-stone-300 hover:text-white">Our Story</a>
      <a href="/contact" class="text-stone-300 hover:text-white">Contact</a>
    </nav>
    <div class="pt-8 border-t border-stone-800">
      <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="w-full block text-center py-4 bg-white text-black text-xs uppercase tracking-[0.25em] font-semibold">Enquire via WhatsApp</a>
    </div>
  </div>

  <!-- Page Content -->
  <main class="flex-grow">${content}</main>

  <!-- Footer -->
  <footer class="footer-fullscreen bg-black select-none text-stone-900 font-sans overflow-hidden relative">
    <div id="footer-decor-container" class="footer-decor-fullscreen px-6 sm:px-12 md:px-16 lg:px-24 py-8 sm:py-10 md:py-12 transition-all duration-700">
      
      <!-- Background Wabi-Sabi Flatlay Image (Full Bleed) -->
      <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          id="footer-bg-img"
          src="/images/footer-decor-bg.jpg"
          alt="Elysium Wabi-Sabi Decor Flatlay Background"
          class="w-full h-full object-cover object-center transition-all duration-700 brightness-[1.04] contrast-[1.02] saturate-[1.05]"
        />
        <div id="footer-light-beam"></div>
      </div>

      <!-- Hanging Animated Lamp (Clean Minimalist Atelier Lamp in open space) -->
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
      <div class="relative z-20 flex items-center justify-between pb-6">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-[11px] font-mono uppercase tracking-[0.2em] text-white border border-white/20 shadow-md">
          <span id="footer-status-dot" class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span id="footer-status-text">Studio No. 029 • Atelier Illuminated</span>
        </div>
      </div>

      <!-- Content Overlay -->
      <div class="relative z-20 space-y-12">
        <div class="max-w-2xl space-y-3">
          <span id="footer-brand-title" class="text-[10px] font-mono uppercase tracking-[0.3em] block text-stone-700 font-semibold transition-colors duration-500">${BRAND.fullName}</span>
          <h2 id="footer-hero-head" class="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-[1.15] text-stone-900 font-normal transition-colors duration-500">
            Sculpting raw earth <br />
            <span id="footer-hero-sub" class="italic font-serif text-stone-800 transition-colors duration-500">into timeless living sanctuaries</span>
          </h2>
        </div>

        <div id="footer-grid-border" class="grid grid-cols-1 md:grid-cols-12 gap-10 pt-8 border-t border-stone-400/60 transition-colors duration-500">
          <div class="md:col-span-5 space-y-5">
            <span class="footer-lbl text-xs uppercase tracking-[0.3em] font-mono block font-semibold text-stone-800">Atelier Display</span>
            <p class="footer-txt text-xs font-light leading-relaxed max-w-sm text-stone-800 font-normal">${BRAND.showroomSize}. Curated handcrafted decor pieces for discerning interiors in India and worldwide.</p>
            <div class="space-y-2 pt-2">
              <span class="footer-lbl text-[10px] uppercase tracking-[0.25em] font-mono block text-stone-700 font-semibold">Atelier Address</span>
              <p class="footer-txt text-xs font-light leading-relaxed max-w-sm text-stone-900 font-normal">📍 ${BRAND.address}</p>
            </div>
          </div>

          <div class="md:col-span-4 space-y-5">
            <span class="footer-lbl text-[10px] uppercase tracking-[0.25em] font-mono block text-stone-700 font-semibold">Enquiries & Contact</span>
            <div class="text-xs space-y-2.5 font-light">
              <p class="footer-txt text-stone-900 font-normal">📞 <a href="tel:${BRAND.phoneDisplay}" class="hover:underline font-medium">+91 ${BRAND.phoneDisplay}</a></p>
              <p class="footer-txt text-stone-800">Email: ${BRAND.email}</p>
            </div>
            <div class="space-y-2 pt-2">
              <span class="footer-lbl text-[10px] uppercase tracking-[0.25em] font-mono block text-stone-700 font-semibold">Showroom Hours</span>
              <p class="footer-txt text-xs text-stone-900 font-normal">⏰ ${BRAND.timing}</p>
            </div>
          </div>

          <div class="md:col-span-3 space-y-5">
            <span class="footer-lbl text-[10px] uppercase tracking-[0.25em] font-mono block text-stone-700 font-semibold">Navigation</span>
            <ul class="space-y-2.5 text-xs text-stone-800 font-medium">
              <li><a href="/philosophy" class="hover:underline">Philosophy</a></li>
              <li><a href="/artisan-pieces" class="hover:underline">Artisan Collection</a></li>
              <li><a href="/materiality" class="hover:underline">Tactile Materiality</a></li>
              <li><a href="/our-story" class="hover:underline">Our Story</a></li>
              <li><a href="/contact" class="hover:underline">Contact & Enquiries</a></li>
            </ul>
            <div class="pt-2">
              <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg text-[10px] uppercase tracking-[0.2em] shadow-md hover:bg-black">
                WhatsApp Direct &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>

      <div id="footer-bottom-strip" class="relative z-20 pt-8 mt-10 border-t border-stone-400/60 flex flex-col sm:flex-row items-center justify-between text-[10px] uppercase tracking-[0.2em] font-mono text-stone-800 font-semibold gap-4">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          <span>© ${new Date().getFullYear()} ${BRAND.fullName}. ALL RIGHTS RESERVED.</span>
        </div>
        <div class="flex items-center gap-6">
          <span>RAJKOT • VOLTERRA • INTERNATIONAL</span>
        </div>
      </div>

    </div>
  </footer>

  <script>
    (function() {
      var isLit = true;
      var btn = document.getElementById('footer-bulb-btn');
      var bell = document.getElementById('footer-bell-container');
      var container = document.getElementById('footer-decor-container');
      var img = document.getElementById('footer-bg-img');
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

        if (isLit) {
          if(container) container.classList.remove('footer-night-mode');
          if(img) img.style.filter = 'brightness(1.04) contrast(1.02) saturate(1.05)';
          if(beam) beam.style.opacity = '1';
          if(statusTxt) statusTxt.innerText = 'Studio No. 029 • Atelier Illuminated';
          if(statusDot) statusDot.className = 'w-2 h-2 rounded-full bg-amber-400 animate-ping';
        } else {
          if(container) container.classList.add('footer-night-mode');
          if(img) img.style.filter = 'brightness(0.3) contrast(1.15) saturate(0.8)';
          if(beam) beam.style.opacity = '0';
          if(statusTxt) statusTxt.innerText = 'Studio No. 029 • Night Mode (Dimmed)';
          if(statusDot) statusDot.className = 'w-2 h-2 rounded-full bg-stone-600';
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

  <!-- GSAP, ScrollTrigger & Lenis (Local Vendor Bundles) -->
  <script src="/js/vendor/gsap.min.js"></script>
  <script src="/js/vendor/ScrollTrigger.min.js"></script>
  <script src="/js/vendor/lenis.min.js"></script>

  <script src="/js/main.js"></script>
  ${isHeroPage ? '<script src="/js/heroCanvas.js"></script>' : ''}
  <script src="/js/homeAnimations.js"></script>
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

      <!-- Hero Preloader Overlay -->
      <div id="hero-preloader">
        <span class="text-xs uppercase tracking-[0.45em] text-stone-400 font-mono">ELYSIUM</span>
        <h2 class="text-xl sm:text-2xl font-light tracking-[0.2em] uppercase text-stone-200 mt-2">A SPACE IN MOTION</h2>
        <div class="preloader-track">
          <div id="preloader-progress-bar"></div>
        </div>
        <span id="preloader-progress-text" class="text-[10px] font-mono tracking-widest text-stone-500">INITIALIZING SPACE 0%</span>
      </div>

      <!-- Main Hero Overlay UI -->
      <div class="hero-overlay-ui">
        <div class="h-16"></div>
        <div class="max-w-2xl space-y-6 interactive-element">
          <div class="space-y-3">
            <h1 class="text-4xl sm:text-6xl lg:text-7xl font-light tracking-[0.12em] leading-tight text-white uppercase font-sans">ELYSIUM</h1>
            <p class="text-sm sm:text-base font-light text-stone-300 max-w-lg leading-relaxed tracking-wide">${BRAND.heroStatement}</p>
          </div>
          <div class="flex flex-wrap items-center gap-4 pt-2">
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="px-8 py-3.5 bg-white text-black text-xs font-semibold uppercase tracking-[0.25em] inline-flex items-center gap-2 hover:bg-stone-200 transition-colors">ENQUIRE NOW &rarr;</a>
            <a href="/artisan-pieces" class="px-6 py-3.5 border border-white border-opacity-30 text-white text-xs uppercase tracking-[0.25em] hover:bg-white hover:bg-opacity-10 transition-colors">EXPLORE</a>
          </div>
        </div>

        <div class="flex justify-between items-end border-t border-white border-opacity-10 pt-4 interactive-element">
          <div id="scroll-progress-text" class="text-[9px] font-mono tracking-widest text-stone-400 uppercase">SCROLL PROGRESS: 0%</div>
          <div class="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-mono text-stone-300">SCROLL TO DISCOVER ↓</div>
        </div>
      </div>
    </div>
  </div>`;

  // SECTION 1: Brand Story / Philosophy
  const sectionBrandStory = `
  <section class="section-brand-story py-28 sm:py-36 px-6 md:px-12 lg:px-24 border-t border-stone-800">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        <!-- Left: Poetic Brand Copy -->
        <div class="lg:col-span-6 space-y-8">
          <div class="story-eyebrow text-amber-500 font-mono text-[10px] sm:text-xs tracking-[0.4em] uppercase">
            <span class="eyebrow-word">THE</span>
            <span class="eyebrow-word">ELYSIUM</span>
            <span class="eyebrow-word">DESIGN</span>
            <span class="eyebrow-word">PHILOSOPHY</span>
          </div>

          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-white uppercase font-sans leading-tight">
            Global Design Sensibility, <br>
            <span class="italic font-serif text-stone-300">Rooted in Rajkot Craftsmanship</span>
          </h2>

          <div class="w-16 h-px bg-stone-700"></div>

          <div class="space-y-5 text-sm sm:text-base text-stone-300 font-light leading-relaxed">
            <p class="story-copy-block">
              We believe a home should never compete for attention. In a world saturated with synthetic gloss and mass replication, Elysium creates tactile sanctuaries anchored by the raw quiet of organic earth mediums.
            </p>
            <p class="story-copy-block">
              Our collection harmonizes historic Mediterranean restraint—honed limestone, pit-fired stoneware, and unsealed white oak—with the precision and generational artistry of our master sculptors at our Rajkot atelier.
            </p>
            <p class="story-copy-block">
              Every curve, fissure, and shadow line is intentional. Crafted without synthetic lacquers or chemical adhesives, each piece celebrates the natural wabi-sabi spirit of timeless living spaces.
            </p>
          </div>

          <div class="pt-4 story-copy-block">
            <a href="/philosophy" class="inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-white hover:text-amber-400 font-medium transition-colors border-b border-white/40 pb-1 hover:border-amber-400">
              Read Our Full Design Philosophy &rarr;
            </a>
          </div>
        </div>

        <!-- Right: Stacked Overlapping Parallax Images -->
        <div class="lg:col-span-6">
          <div class="story-images-wrap">
            <!-- Background Image (Moves slower on scroll) -->
            <div class="story-bg-frame story-bg-img">
              <div class="aspect-[4/5] relative overflow-hidden">
                <img
                  src="/images/photo-1615529182904-14819c35db37"
                  alt="Terra Plaster Wall Relief by Elysium Artisans"
                  class="w-full h-full object-cover object-center filter grayscale contrast-105"
                  loading="lazy"
                />
              </div>
              <div class="p-4 bg-stone-950 border-t border-stone-800 flex justify-between items-center text-[10px] font-mono tracking-widest text-stone-400 uppercase">
                <span>01 • Wall Relief</span>
                <span>Mineral Plaster</span>
              </div>
            </div>

            <!-- Foreground Overlapping Image (Moves faster on scroll) -->
            <div class="story-fg-frame story-fg-img">
              <div class="aspect-[3/4] relative overflow-hidden">
                <img
                  src="/images/photo-1612196808214-b8e1d6145a8c"
                  alt="Caelum Handcrafted Stoneware Vessel"
                  class="w-full h-full object-cover object-center filter contrast-110"
                  loading="lazy"
                />
              </div>
              <div class="p-4 bg-stone-900 border-t border-stone-700 flex justify-between items-center text-[10px] font-mono tracking-widest text-stone-300 uppercase">
                <span>02 • Caelum Vessel</span>
                <span>Organic Clay</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>`;

  // SECTION 2: Collections Showcase (The Chapter Feature)
  const sectionCollectionsShowcase = `
  <section class="section-collections-showcase bg-black">
    ${collectionCategories.map((cat, idx) => `
      <div id="${cat.id}" class="collection-chapter min-h-screen py-24 sm:py-32 px-6 md:px-12 lg:px-24 border-t border-stone-800/80 relative flex items-center">
        
        <!-- Ambient Floating Decorative Thumbnails (Continuous Gentle Drift) -->
        ${cat.ambientThumbs.map(t => `
          <div class="ambient-thumb ${t.size} overflow-hidden" style="top: ${t.top}; ${t.left ? `left: ${t.left};` : ''} ${t.right ? `right: ${t.right};` : ''} opacity: 0.22;">
            <img src="${t.src}" alt="Elysium Ambient Detail" class="w-full h-full object-cover grayscale" loading="lazy" />
          </div>
        `).join('')}

        <div class="max-w-7xl mx-auto w-full relative z-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <!-- Category Image Column (Pinned during scroll on Desktop) -->
            <div class="lg:col-span-7 ${idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}">
              <div class="chapter-pinned-col relative">
                <div class="relative overflow-hidden aspect-[4/3] sm:aspect-[16/10] border border-stone-800 bg-stone-950 shadow-2xl group">
                  <img
                    src="${cat.image}"
                    alt="${cat.imageAlt}"
                    class="w-full h-full object-cover object-center filter contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div class="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[10px] font-mono tracking-widest uppercase text-stone-300">
                    <span>${cat.eyebrow} • COLLECTION</span>
                    <span>ATELIER RAJKOT</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Category Descriptive Content Column -->
            <div class="lg:col-span-5 ${idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'} space-y-6">
              <span class="chapter-detail-elem text-[10px] font-mono tracking-[0.45em] uppercase text-amber-500 block">${cat.eyebrow}</span>
              
              <!-- Masked Oversized Category Name Reveal -->
              <div class="chapter-title-mask">
                <h2 class="chapter-title-inner text-4xl sm:text-5xl lg:text-6xl font-light tracking-wide text-white uppercase font-sans leading-tight">
                  ${cat.title}
                </h2>
              </div>

              <div class="w-12 h-px bg-stone-700 chapter-detail-elem"></div>

              <p class="chapter-detail-elem text-sm sm:text-base text-stone-300 font-light leading-relaxed max-w-md">
                ${cat.description}
              </p>

              <div class="pt-4 chapter-detail-elem">
                <a href="${cat.linkHref}" class="btn-wipe-secondary inline-flex items-center gap-3 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.25em]">
                  ${cat.linkText} &rarr;
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    `).join('')}
  </section>`;

  // SECTION 3: Craftsmanship / Why Us
  const sectionCraftsmanship = `
  <section class="section-craftsmanship py-28 sm:py-36 px-6 md:px-12 lg:px-24 border-t border-stone-800">
    <div class="max-w-7xl mx-auto space-y-20">
      
      <!-- Section Header -->
      <div class="max-w-3xl space-y-4">
        <span class="text-[10px] tracking-[0.45em] uppercase text-amber-500 font-mono block">THE ELYSIUM STANDARD</span>
        <h2 class="text-3xl sm:text-5xl font-light tracking-wide text-white uppercase font-sans">
          Purity in Sourcing. <br>
          <span class="italic font-serif text-stone-300">Mastery in Execution.</span>
        </h2>
        <p class="text-sm text-stone-400 font-light leading-relaxed max-w-2xl">
          Every piece in the Elysium collection is an uncompromising dialogue between raw geological medium and centuries-old artisan techniques.
        </p>
      </div>

      <!-- 4-Column Trust Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <!-- Pillar 01 -->
        <div class="craft-trust-col craft-trust-card p-8 bg-stone-950/80 border border-stone-800 flex flex-col justify-between space-y-6">
          <div class="space-y-4">
            <div class="w-10 h-10 rounded-full border border-stone-700 flex items-center justify-center text-amber-400 font-mono text-xs">
              01
            </div>
            <h3 class="text-lg font-light tracking-wider text-white uppercase font-sans">Handpicked Materials</h3>
            <p class="text-xs text-stone-400 font-light leading-relaxed">
              Zero artificial resins, chemical glues, or faux veneers. We harvest unrefined travertine, iron-rich clays, and aged white oak with organic certification.
            </p>
          </div>
          <span class="text-[10px] font-mono text-stone-500 uppercase tracking-widest">100% RAW MEDIUMS</span>
        </div>

        <!-- Pillar 02 -->
        <div class="craft-trust-col craft-trust-card p-8 bg-stone-950/80 border border-stone-800 flex flex-col justify-between space-y-6">
          <div class="space-y-4">
            <div class="w-10 h-10 rounded-full border border-stone-700 flex items-center justify-center text-amber-400 font-mono text-xs">
              02
            </div>
            <h3 class="text-lg font-light tracking-wider text-white uppercase font-sans">Assembled in Rajkot</h3>
            <p class="text-xs text-stone-400 font-light leading-relaxed">
              Our dedicated 4,500 sq. ft. atelier in Rajkot serves as the physical home where raw blocks are hand-cut, joined, and buffed with natural mountain beeswax.
            </p>
          </div>
          <span class="text-[10px] font-mono text-stone-500 uppercase tracking-widest">LOCAL MASTER ATELIER</span>
        </div>

        <!-- Pillar 03 -->
        <div class="craft-trust-col craft-trust-card p-8 bg-stone-950/80 border border-stone-800 flex flex-col justify-between space-y-6">
          <div class="space-y-4">
            <div class="w-10 h-10 rounded-full border border-stone-700 flex items-center justify-center text-amber-400 font-mono text-xs">
              03
            </div>
            <h3 class="text-lg font-light tracking-wider text-white uppercase font-sans">Multi-Point Curation</h3>
            <p class="text-xs text-stone-400 font-light leading-relaxed">
              Every individual piece undergoes rigorous tactile balance, weight distribution, and fissure integrity evaluations before leaving our workshop.
            </p>
          </div>
          <span class="text-[10px] font-mono text-stone-500 uppercase tracking-widest">LIFETIME STRUCTURAL INTEGRITY</span>
        </div>

        <!-- Pillar 04 -->
        <div class="craft-trust-col craft-trust-card p-8 bg-stone-950/80 border border-stone-800 flex flex-col justify-between space-y-6">
          <div class="space-y-4">
            <div class="w-10 h-10 rounded-full border border-stone-700 flex items-center justify-center text-amber-400 font-mono text-xs">
              04
            </div>
            <h3 class="text-lg font-light tracking-wider text-white uppercase font-sans">Direct From Artisans</h3>
            <p class="text-xs text-stone-400 font-light leading-relaxed">
              We maintain direct, transparent partnerships with generational stone-carvers and ceramicists, ensuring genuine provenance and ethical value.
            </p>
          </div>
          <span class="text-[10px] font-mono text-stone-500 uppercase tracking-widest">FAIR ARTISAN TRADE</span>
        </div>

      </div>

      <!-- Stat Counter Bar (Scrolled into view counter animation) -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-stone-800/80">
        
        <div class="stat-counter-box p-6 text-center space-y-2">
          <div class="text-3xl sm:text-4xl lg:text-5xl font-light text-white font-sans tracking-tight">
            <span class="stat-number-counter text-amber-400" data-target="500">0</span>+
          </div>
          <span class="text-[10px] sm:text-xs font-mono tracking-widest text-stone-400 uppercase block">Residences Transformed</span>
        </div>

        <div class="stat-counter-box p-6 text-center space-y-2">
          <div class="text-3xl sm:text-4xl lg:text-5xl font-light text-white font-sans tracking-tight">
            <span class="stat-number-counter text-amber-400" data-target="10">0</span>+
          </div>
          <span class="text-[10px] sm:text-xs font-mono tracking-widest text-stone-400 uppercase block">Years Sourcing Antiquities</span>
        </div>

        <div class="stat-counter-box p-6 text-center space-y-2">
          <div class="text-3xl sm:text-4xl lg:text-5xl font-light text-white font-sans tracking-tight">
            <span class="stat-number-counter text-amber-400" data-target="4500">0</span>
          </div>
          <span class="text-[10px] sm:text-xs font-mono tracking-widest text-stone-400 uppercase block">Sq. Ft. Atelier in Rajkot</span>
        </div>

        <div class="stat-counter-box p-6 text-center space-y-2">
          <div class="text-3xl sm:text-4xl lg:text-5xl font-light text-white font-sans tracking-tight">
            <span class="stat-number-counter text-amber-400" data-target="100">0</span>%
          </div>
          <span class="text-[10px] sm:text-xs font-mono tracking-widest text-stone-400 uppercase block">Chemical-Free Handcraft</span>
        </div>

      </div>

    </div>
  </section>`;

  // SECTION 4: Featured Products Grid
  const sectionFeaturedProducts = `
  <section class="section-featured-products py-28 sm:py-36 px-6 md:px-12 lg:px-24 border-t border-stone-800">
    <div class="max-w-7xl mx-auto space-y-16">
      
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-800 pb-8">
        <div class="space-y-3">
          <span class="text-[10px] tracking-[0.45em] uppercase text-amber-500 font-mono block">BESTSELLING ATELIER PIECES</span>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-white uppercase font-sans">Featured Collection</h2>
        </div>
        <a href="/artisan-pieces" class="btn-wipe-secondary inline-flex items-center gap-3 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] self-start md:self-auto">
          View Complete Catalogue &rarr;
        </a>
      </div>

      <!-- Responsive Product Grid (3 col desktop, 2 col tablet, 1 col mobile) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        ${featuredProducts.map(p => `
          <div class="product-grid-card product-card-hover group flex flex-col justify-between h-full p-4">
            
            <div class="space-y-4">
              <!-- Image with Hover Zoom Container -->
              <div class="product-card-img-wrap">
                <img
                  src="${p.image}"
                  alt="${p.name} - Handcrafted by ${p.artisan}"
                  class="product-card-img"
                  loading="lazy"
                />
                
                <!-- Quick Hover Action Overlay -->
                <div class="product-card-overlay">
                  <a href="/artisan-pieces/${p.slug}" class="px-6 py-3 bg-white text-black text-xs font-semibold uppercase tracking-[0.2em] hover:bg-stone-200 transition-colors shadow-lg">
                    View Product Details &rarr;
                  </a>
                </div>
              </div>

              <!-- Product Details -->
              <div class="space-y-2 pt-2">
                <div class="flex justify-between items-baseline gap-2">
                  <a href="/artisan-pieces/${p.slug}">
                    <h3 class="text-base font-medium text-white group-hover:text-amber-300 transition-colors uppercase tracking-wider">${p.name}</h3>
                  </a>
                  <span class="text-xs font-mono text-amber-400 font-semibold tracking-wider">${p.price}</span>
                </div>
                <p class="text-xs text-stone-400 font-light line-clamp-2">${p.description}</p>
                <div class="text-[10px] font-mono text-stone-500 uppercase tracking-widest">
                  ${p.material} • By ${p.artisan}
                </div>
              </div>
            </div>

            <!-- Footer Card Links -->
            <div class="pt-4 mt-4 flex items-center justify-between border-t border-stone-800/80">
              <a href="${createWhatsAppLink(p.name)}" target="_blank" rel="noopener noreferrer" class="text-[10px] uppercase tracking-[0.2em] text-stone-300 hover:text-amber-400 transition-colors inline-flex items-center gap-1 font-medium">
                Enquire via WhatsApp &rarr;
              </a>
              <a href="/artisan-pieces/${p.slug}" class="text-[10px] font-mono uppercase tracking-widest text-stone-500 hover:text-white transition-colors">
                Specs &rarr;
              </a>
            </div>

          </div>
        `).join('')}
      </div>

    </div>
  </section>`;

  // SECTION 5: CTA / Get in Touch Strip
  const sectionCtaStrip = `
  <section class="section-cta-strip py-32 sm:py-44 px-6 md:px-12 lg:px-24 border-t border-stone-800 text-center relative flex items-center justify-center">
    
    <!-- Background Subtle Parallax Image & Radial Vignette -->
    <div class="cta-bg-parallax"></div>

    <div class="max-w-4xl mx-auto space-y-8 relative z-10 cta-content">
      <span class="cta-fade-elem text-[10px] sm:text-xs tracking-[0.5em] uppercase text-amber-400 font-mono block">
        FROM FIVE, EVERYTHING BEGINS
      </span>

      <h2 class="cta-fade-elem text-4xl sm:text-6xl lg:text-7xl font-light tracking-wide text-white uppercase font-sans leading-tight">
        Bring This Home.
      </h2>

      <p class="cta-fade-elem text-sm sm:text-base text-stone-300 font-light max-w-xl mx-auto leading-relaxed">
        Experience raw tactile grandeur in person at our 4,500 sq. ft. display atelier in Rajkot, or connect directly with our curators for custom residential and bespoke sourcing consultations.
      </p>

      <div class="cta-fade-elem flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
        <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-wipe-primary w-full sm:w-auto px-9 py-4 font-semibold text-xs uppercase tracking-[0.25em] shadow-xl inline-flex items-center justify-center gap-2">
          Consult on WhatsApp &rarr;
        </a>
        <a href="/artisan-pieces" class="btn-wipe-secondary w-full sm:w-auto px-9 py-4 font-semibold text-xs uppercase tracking-[0.25em] inline-flex items-center justify-center gap-2">
          Browse Full Catalogue
        </a>
      </div>

      <div class="cta-fade-elem pt-6 text-[10px] font-mono tracking-widest text-stone-500 uppercase">
        SHOWROOM VISITS BY APPOINTMENT & DIRECT ATELIER CONSULTATIONS
      </div>
    </div>

  </section>`;

  // Render combined page with the 5 sections between Hero and Footer
  res.send(renderPage({
    title: 'Elysium | Artisan Minimalist Home Decor, Handcrafted in India',
    description: BRAND.heroStatement,
    path: '/',
    content: heroSection + sectionBrandStory + sectionCollectionsShowcase + sectionCraftsmanship + sectionFeaturedProducts + sectionCtaStrip,
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
        <button class="category-btn active" data-category="All">All</button>
        <button class="category-btn" data-category="Furniture">Furniture</button>
        <button class="category-btn" data-category="Sculpture">Sculpture</button>
        <button class="category-btn" data-category="Lighting">Lighting</button>
        <button class="category-btn" data-category="Vessels">Vessels</button>
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
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="w-full block text-center py-4 bg-white text-black text-xs font-semibold uppercase tracking-[0.25em] hover:bg-stone-200 transition-colors shadow-lg">Enquire via WhatsApp &rarr;</a>
            <a href="/contact?piece=${encodeURIComponent(product.name)}" class="w-full block text-center py-3.5 border border-stone-700 text-stone-300 text-xs uppercase tracking-[0.25em] hover:bg-white hover:bg-opacity-10 transition-colors">Submit Form Enquiry</a>
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
          ${CRAFT_STEPS.map(step => `
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
          <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="px-8 py-3.5 bg-white text-black text-xs font-semibold uppercase tracking-[0.25em] inline-flex items-center gap-2 hover:bg-stone-200 transition-colors shadow-lg">Start Consultation via WhatsApp &rarr;</a>
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
              <a href="${createWhatsAppLink(pieceName)}" target="_blank" rel="noopener noreferrer" class="w-full block text-center py-4 bg-white text-black text-xs font-semibold uppercase tracking-[0.25em] hover:bg-stone-200 transition-colors shadow-md">OPEN WHATSAPP CHAT &rarr;</a>
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
                <button type="submit" class="w-full py-4 bg-white text-black text-xs font-semibold uppercase tracking-[0.25em] hover:bg-stone-200 transition-colors shadow-md">SUBMIT FORM ENQUIRY</button>
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
          <a href="/" class="px-6 py-3 bg-white text-black text-xs font-semibold uppercase tracking-[0.2em] hover:bg-stone-200 transition-colors">Return to Home</a>
          <a href="/artisan-pieces" class="px-6 py-3 border border-stone-700 text-white text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">Explore Collection</a>
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
          <a href="/" class="px-6 py-3 bg-white text-black text-xs font-semibold uppercase tracking-[0.2em] hover:bg-stone-200 transition-colors">Return to Home</a>
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

