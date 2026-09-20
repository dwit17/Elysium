const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:site_name" content="${BRAND.fullName}">
  <meta property="og:image" content="${BRAND.domain}/images/photo-1600121848594-d8644e57abab">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Geist+Mono:wght@300;400;500;600&family=Syne:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/tailwind.min.css">
  <link rel="stylesheet" href="/css/elysium.css">
  <script type="application/ld+json">${JSON.stringify(orgSchema)}</script>
</head>
<body class="bg-black text-white selection:bg-white selection:text-black antialiased overflow-x-hidden">
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
        <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-slide-white px-5 py-2 text-[11px] font-semibold tracking-[0.2em] uppercase"><span>Enquire</span></a>
      </nav>

      <div class="flex lg:hidden items-center space-x-3">
        <button id="mobile-menu-btn" class="lg:hidden text-white p-2" aria-label="Toggle Menu" aria-expanded="false" aria-controls="mobile-menu-drawer">
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
      <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-slide-white w-full py-3.5 text-center text-xs uppercase tracking-[0.25em] font-semibold"><span>Enquire via WhatsApp</span></a>
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

  <!-- GSAP, ScrollTrigger, Lenis & SplitType (Local Vendor Bundles) -->
  <script src="/js/vendor/gsap.min.js"></script>
  <script src="/js/vendor/ScrollTrigger.min.js"></script>
  <script src="/js/vendor/split-type.min.js"></script>
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
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="px-8 py-3.5 bg-white text-black text-xs font-semibold uppercase tracking-[0.25em] inline-flex items-center gap-2 hover:bg-stone-200 transition-colors" data-magnetic="true">ENQUIRE NOW &rarr;</a>
            <a href="/artisan-pieces" class="px-6 py-3.5 border border-white border-opacity-30 text-white text-xs uppercase tracking-[0.25em] hover:bg-white hover:bg-opacity-10 transition-colors" data-magnetic="true">EXPLORE</a>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  // SECTION 1: THE ATELIER MANIFESTO & 3D INTERACTIVE TILT SCULPTURE
  // Calibrated for natural height & breathing room (Preserving 100% of copy, signature, and links)
  const manifestoHeadingWords = "Every Piece Begins With a Name.".split(" ");
  const sectionManifesto = `
  <section class="section-manifesto relative bg-[#030303] border-t border-stone-800 text-white z-10 overflow-hidden py-20 sm:py-24 lg:py-28 px-6 md:px-12 lg:px-20">
    
    <!-- Ambient Radial Glow Accent -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-7xl mx-auto w-full">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        
        <!-- Left 7 Cols: Split-Text Manifesto -->
        <div class="lg:col-span-7 space-y-5 sm:space-y-6 relative">
          
          <div class="flex items-center justify-between">
            <span class="manifesto-eyebrow text-[10px] font-mono tracking-[0.45em] uppercase text-amber-500 block">
              THE ATELIER PHILOSOPHY • RAJKOT
            </span>
          </div>

          <h2 class="manifesto-heading text-2xl sm:text-4xl lg:text-5xl font-light tracking-wide text-white uppercase font-serif leading-tight">
            ${manifestoHeadingWords.map(w => `<span class="manifesto-word inline-block">${w}&nbsp;</span>`).join('')}
          </h2>

          <div class="manifesto-divider w-16 h-px bg-gradient-to-r from-amber-500 via-stone-600 to-transparent"></div>

          <div class="space-y-3 sm:space-y-4 text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-xl">
            <p class="manifesto-para manifesto-para-1">
              I began working with raw stone and untamed clay because I could no longer endure surfaces designed to conceal their origin. Synthetic sealants, chemical lacquers, industrial veneers—they silence the medium. At Elysium, we listen first. We let the stone fissure where it must, let the unglazed clay breathe, and let the white oak reveal decades of patient growth rings.
            </p>
            <p class="manifesto-para manifesto-para-2">
              Rajkot is where this quiet reverence lives. In our 4,500 sq. ft. Vavdi sanctuary, generational stone-carvers and master sculptors know the temper of a raw block before the chisel ever strikes.
            </p>
          </div>

          <!-- Signature Line with Coordinates -->
          <div class="manifesto-signature pt-1 border-l-2 border-amber-500/50 pl-4 space-y-0.5">
            <span class="text-xs sm:text-sm text-stone-200 font-light italic block leading-snug">— Lead Artisan &amp; Founder, Elysium Atelier</span>
            <div class="flex items-center gap-3 text-[9px] font-mono tracking-widest text-stone-500 uppercase">
              <span>Vavdi, Rajkot</span>
              <span>•</span>
              <span class="text-amber-400/80">22.2587° N, 70.8022° E</span>
            </div>
          </div>

          <!-- Links -->
          <div class="manifesto-links pt-1 flex flex-wrap items-center gap-4 text-[10.5px] font-medium uppercase tracking-[0.25em]">
            <a href="/our-story" class="manifesto-link btn-slide-white px-4 py-2 text-[10px] font-semibold tracking-[0.2em] shadow-md">
              <span>Read Our Full Story</span>
              <span class="btn-arrow ml-2">&rarr;</span>
            </a>
            <a href="/philosophy" class="manifesto-link btn-slide-subtle px-4 py-2 text-[10px] font-semibold tracking-[0.2em]">
              <span>Read Philosophy</span>
              <span class="btn-arrow ml-2">&rarr;</span>
            </a>
          </div>
        </div>

        <!-- Right 5 Cols: Interactive 3D Perspective Tilt Card with Specular Glare -->
        <div class="lg:col-span-5 relative flex justify-center">
          <div class="manifesto-tilt-container relative w-full max-w-sm perspective-[1200px]" id="manifesto-tilt-card">
            <div class="manifesto-portrait-wrap relative overflow-hidden bg-stone-950 shadow-2xl transition-transform duration-200 ease-out will-change-transform rounded-sm">
              
              <div class="manifesto-portrait-clip aspect-[4/5] sm:aspect-[3/4] relative overflow-hidden max-h-[50vh] img-skeleton-wrap">
                <div class="img-skeleton-placeholder"></div>
                <img
                  src="/images/maker_portrait.jpg"
                  alt="Lead Artisan at work in the Elysium Rajkot Atelier"
                  class="manifesto-portrait-img image-blur-up w-full h-full object-cover filter contrast-105 brightness-95"
                  style="object-position: center 25%;"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none z-10"></div>
                <!-- Dynamic Mouse Glare Element -->
                <div class="tilt-glare absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 z-20"></div>
                <!-- Initial clip-path overlay mask -->
                <div class="manifesto-portrait-mask absolute inset-0 bg-[#030303] z-10" style="clip-path: inset(0 100% 0 0);"></div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  </section>`;

  // SECTION 2: THE PINNED HORIZONTAL ATELIER EXPEDITION (100dvh Pinned Viewport on Desktop, Natural on Mobile)
  const horizontalChapters = [
    {
      index: '01',
      tag: 'ORIGIN & TERRAIN',
      title: 'Vavdi Atelier, Rajkot',
      subtitle: '4,500 Sq. Ft. Dedicated Sanctuary',
      description: 'Where generational stone sculptors work directly with volcanic silicate ash, unsealed Italian travertine slabs, and aged white timber beams without synthetic binders.',
      image: '/images/chapter_living_room.jpg',
      specs: ['Coordinates: 22.2587° N, 70.8022° E', 'Hand-split limestone strata', 'Zero synthetic resins'],
      ctaText: 'Explore Atelier Provenance',
      ctaHref: '/our-story'
    },
    {
      index: '02',
      tag: 'MEDIUM & FORM',
      title: 'Solis Travertine Console',
      subtitle: 'Super Fine Italian Limestone',
      description: 'Extracted with diamond wire saws and carved over 40 hours of patient hand chiseling to create monolithic structural joins that absorb ambient room lighting.',
      image: '/images/atelier_materials.jpg',
      specs: ['Dimensions: 85cm x 160cm x 42cm', 'Approx. Weight: 68 kg', 'Price: ₹64,000'],
      ctaText: 'Enquire on WhatsApp',
      ctaHref: createWhatsAppLink('Solis Travertine Console')
    },
    {
      index: '03',
      tag: 'EARTH & FIRE',
      title: 'Caelum Stoneware Vessel',
      subtitle: 'Pit-Fired Silicate Clay',
      description: 'Thrown on traditional kickwheels and pit-fired at low temperatures with natural wood smoke to cultivate unique organic marbling across unglazed porous clay.',
      image: '/images/story_clay_vessel.jpg',
      specs: ['Material: Raw Iron-Dense Clay', 'Manual Kickwheel Turned', 'Price: ₹18,500'],
      ctaText: 'View Vessel Details',
      ctaHref: '/artisan-pieces/caelum-vessel'
    },
    {
      index: '04',
      tag: 'TIMBER & TIME',
      title: 'Monolith White Oak Chair',
      subtitle: 'Shou Sugi Ban & Beeswax',
      description: 'Slow-grown northern white oak celebrating fibrous satin grain patterns, buffed by hand with organic mountain beeswax and cold-pressed linseed oil.',
      image: '/images/chapter_bedroom.jpg',
      specs: ['Origin: Rajkot Atelier', 'Zero Chemical Lacquers', 'Price: ₹48,000'],
      ctaText: 'Discover Furniture Series',
      ctaHref: '/artisan-pieces'
    }
  ];

  const sectionHorizontalGallery = `
  <section class="section-horizontal-gallery relative bg-black border-t border-stone-800 overflow-hidden" id="horizontal-suite-container">
    
    <!-- Pinned Viewport Container (100dvh on desktop, natural stack on compact) -->
    <div class="horizontal-pinned-track w-full min-h-screen lg:h-screen flex flex-col justify-center overflow-hidden">

      <!-- Horizontal Slides Track (GSAP translates x smoothly on desktop, stacks responsively on mobile) -->
      <div class="horizontal-slides-wrapper flex h-full flex-nowrap will-change-transform" id="horizontal-track">
        ${horizontalChapters.map((ch, idx) => `
          <div class="horizontal-slide-panel flex-shrink-0 w-full lg:w-screen lg:min-w-[100vw] lg:max-w-[100vw] h-full flex items-center px-6 sm:px-12 md:px-16 lg:px-20 py-8 lg:py-6 relative" data-panel="${idx}">
            
            <div class="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
              
              <!-- Left Column: Chapter Description & Telemetry -->
              <div class="lg:col-span-5 space-y-4">
                <h3 class="text-2xl sm:text-4xl font-light text-white uppercase font-serif tracking-wide leading-tight">
                  ${ch.title}
                </h3>
                <span class="text-[11px] font-mono text-amber-400 uppercase tracking-widest block">${ch.subtitle}</span>

                <p class="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-md">
                  ${ch.description}
                </p>

                <!-- Spec Pill List -->
                <div class="space-y-1.5 pt-1">
                  ${ch.specs.map(spec => `
                    <div class="flex items-center gap-2.5 text-[10px] font-mono tracking-wider text-stone-400">
                      <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      <span>${spec}</span>
                    </div>
                  `).join('')}
                </div>

                <div class="pt-2">
                  <a href="${ch.ctaHref}" target="${ch.ctaHref.includes('http') ? '_blank' : '_self'}" rel="noopener noreferrer" class="btn-slide-white inline-flex items-center gap-3 px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] shadow-lg">
                    <span>${ch.ctaText}</span>
                    <span class="btn-arrow">&rarr;</span>
                  </a>
                </div>
              </div>

              <!-- Right Column: Widescreen Architectural Frame -->
              <div class="lg:col-span-7 flex justify-center">
                <div class="horizontal-img-frame relative aspect-[16/10] max-h-[50vh] w-full overflow-hidden bg-stone-950 shadow-2xl rounded-sm group img-skeleton-wrap">
                  <div class="img-skeleton-placeholder"></div>
                  <img
                    src="${ch.image}"
                    alt="${ch.title} - Elysium Atelier Handcrafted Decor"
                    class="image-blur-up w-full h-full object-cover object-center filter contrast-105 transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none z-10"></div>
                </div>
              </div>

            </div>

          </div>
        `).join('')}
      </div>

    </div>
  </section>`;

  // SECTION 3: THE TACTILE MATERIALITY LAB (Sticky 100dvh Viewport on desktop, natural on mobile)
  const sectionMaterialityInterlude = `
  <section class="section-materiality-interlude relative bg-black border-t border-stone-800" id="materiality-suite-container">
    <div class="materiality-pinned w-full min-h-screen lg:h-screen overflow-hidden flex flex-col justify-between pt-20 sm:pt-24 pb-8 sm:pb-10 px-6 sm:px-10 lg:px-16 relative">
      
      <!-- Macro Material Images (4 slices, scaling during active window) -->
      <div class="materiality-images absolute inset-0 z-0 pointer-events-none">
        <div class="mat-slide mat-slide-0 absolute inset-0 overflow-hidden transition-opacity duration-500">
          <img src="/images/atelier_materials.jpg" alt="Raw Italian Travertine Stone Macro" class="mat-img image-blur-up w-full h-full object-cover object-center filter brightness-90 contrast-110" />
        </div>
        <div class="mat-slide mat-slide-1 absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-500">
          <img src="/images/story_clay_vessel.jpg" alt="Organic Stoneware Clay Macro" class="mat-img image-blur-up w-full h-full object-cover object-center filter brightness-90 contrast-110" />
        </div>
        <div class="mat-slide mat-slide-2 absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-500">
          <img src="/images/maker_tools.jpg" alt="Crafted Oak Timber Macro" class="mat-img image-blur-up w-full h-full object-cover object-center filter brightness-90 contrast-110" />
        </div>
        <div class="mat-slide mat-slide-3 absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-500">
          <img src="/images/story_plaster_relief.jpg" alt="Textured Lime Plaster Finish Macro" class="mat-img image-blur-up w-full h-full object-cover object-center filter brightness-90 contrast-110" />
        </div>
      </div>

      <!-- Vignette and Darkening Gradients -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/80 pointer-events-none z-10"></div>

      <!-- Spacer Top -->
      <div class="relative z-20"></div>

      <!-- Center: Synchronized Material Title Reveals in Geist Mono & Cormorant -->
      <div class="relative z-20 my-auto text-center space-y-3 pointer-events-none">
        <div class="mat-label-stack relative min-h-[140px] flex items-center justify-center">
          <div class="mat-label mat-label-0 text-center transition-all duration-400">
            <span class="text-[10.5px] font-mono uppercase tracking-[0.4em] text-amber-400 block mb-1">MEDIUM 01</span>
            <h3 class="text-3xl sm:text-5xl lg:text-7xl font-light tracking-wide text-white uppercase font-serif">Travertine Stone</h3>
            <p class="text-xs sm:text-sm font-mono text-stone-300 tracking-widest uppercase mt-2">Unfilled Geomorphic Pores • Zero Synthetic Resin</p>
            <p class="text-xs text-stone-400 font-light max-w-lg mx-auto mt-2 hidden sm:block">Cool, porous geomorphic surface with deep stratified mineral veins hand-chiseled from raw limestone blocks.</p>
          </div>
          <div class="mat-label mat-label-1 text-center absolute opacity-0 transition-all duration-400">
            <span class="text-[10.5px] font-mono uppercase tracking-[0.4em] text-amber-400 block mb-1">MEDIUM 02</span>
            <h3 class="text-3xl sm:text-5xl lg:text-7xl font-light tracking-wide text-white uppercase font-serif">Organic Clay</h3>
            <p class="text-xs sm:text-sm font-mono text-stone-300 tracking-widest uppercase mt-2">Pit-Fired Silicate Stoneware • Breathable Porosity</p>
            <p class="text-xs text-stone-400 font-light max-w-lg mx-auto mt-2 hidden sm:block">Iron-dense riverbed clay thrown on manual kickwheels and wood-pit fired for raw fire-speckled texture.</p>
          </div>
          <div class="mat-label mat-label-2 text-center absolute opacity-0 transition-all duration-400">
            <span class="text-[10.5px] font-mono uppercase tracking-[0.4em] text-amber-400 block mb-1">MEDIUM 03</span>
            <h3 class="text-3xl sm:text-5xl lg:text-7xl font-light tracking-wide text-white uppercase font-serif">Crafted Oak</h3>
            <p class="text-xs sm:text-sm font-mono text-stone-300 tracking-widest uppercase mt-2">Aged White Timber • Beeswax &amp; Linseed Buffing</p>
            <p class="text-xs text-stone-400 font-light max-w-lg mx-auto mt-2 hidden sm:block">Slow-grown northern white oak celebrating dense fibrous annual rings, buffed with organic desert wax.</p>
          </div>
          <div class="mat-label mat-label-3 text-center absolute opacity-0 transition-all duration-400">
            <span class="text-[10.5px] font-mono uppercase tracking-[0.4em] text-amber-400 block mb-1">MEDIUM 04</span>
            <h3 class="text-3xl sm:text-5xl lg:text-7xl font-light tracking-wide text-white uppercase font-serif">Lime Plaster</h3>
            <p class="text-xs sm:text-sm font-mono text-stone-300 tracking-widest uppercase mt-2">Pulverized Pumice • Natural Hydraulic Lime</p>
            <p class="text-xs text-stone-400 font-light max-w-lg mx-auto mt-2 hidden sm:block">Breathable mineral plaster applied in delicate layered coats with hand trowels for a matte velvet warmth.</p>
          </div>
        </div>
      </div>

      <!-- Bottom Bar & CTA to Materiality Lab -->
      <div class="relative z-20 flex justify-end items-center gap-3 pt-3">
        <a href="/materiality" class="materiality-cta btn-slide-white inline-flex items-center gap-3 px-6 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] shadow-lg">
          <span>Explore Full Materiality Lab</span>
          <span class="btn-arrow">&rarr;</span>
        </a>
      </div>

    </div>
  </section>`;

  // SECTION 4: THE CRAFT JOURNEY & INTERACTIVE BEFORE/AFTER SLIDER (Natural Height)
  const sectionCraftJourney = `
  <section class="section-craft-journey relative bg-[#060606] border-t border-stone-800 text-white z-10 overflow-hidden py-20 sm:py-24 lg:py-28 px-6 md:px-12 lg:px-20">
    <div class="max-w-7xl mx-auto w-full space-y-6 sm:space-y-8">
      
      <!-- Compact Section Header -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end border-b border-stone-800 pb-4">
        <div class="lg:col-span-8 space-y-1">
          <h2 class="text-2xl sm:text-4xl font-light tracking-wide text-white uppercase font-serif leading-tight">
            From Raw Earth <span class="italic text-stone-400">to Living Sanctuary.</span>
          </h2>
        </div>
        <div class="lg:col-span-4">
          <p class="text-xs text-stone-400 font-light leading-relaxed">
            Four rigorous stages. Zero shortcuts. Every raw block is hand-sculpted in Rajkot, buffed with organic beeswax, and individually cataloged.
          </p>
        </div>
      </div>

      <!-- 4-Stage Progressive Timeline with SVG Scrub Line & Split Curtain -->
      <div class="craft-timeline-container relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        <!-- Left 7 Cols: The 4 Steps with SVG Connecting Line -->
        <div class="lg:col-span-7 relative pl-8 sm:pl-10">
          
          <!-- SVG Scrubbed Vertical Line -->
          <svg class="craft-svg-track absolute left-3 top-3 bottom-6 w-1 h-[calc(100%-1.5rem)] overflow-visible" aria-hidden="true">
            <line x1="2" y1="0" x2="2" y2="100%" stroke="rgba(255,255,255,0.1)" stroke-width="2" />
            <line id="craft-scrub-line" x1="2" y1="0" x2="2" y2="100%" stroke="#d4af37" stroke-width="2.5" stroke-dasharray="1000" stroke-dashoffset="1000" />
          </svg>

          <div class="space-y-5 sm:space-y-6">
            ${CRAFT_STEPS.map((step, idx) => `
              <div class="craft-stage-item relative" data-stage="${idx}">
                <!-- Glowing Step Marker Dot -->
                <div class="craft-stage-dot absolute -left-[27px] sm:-left-[39px] top-1 w-3.5 h-3.5 rounded-full bg-black border-2 border-stone-600 transition-colors duration-400 flex items-center justify-center">
                  <span class="craft-dot-inner w-1.5 h-1.5 rounded-full bg-stone-700 transition-all duration-400"></span>
                </div>

                <div class="space-y-1">
                  <div class="flex items-baseline gap-3">
                    <span class="craft-stage-num text-base sm:text-lg font-mono text-amber-500 font-semibold tracking-wider inline-block">${step.step}</span>
                    <h3 class="craft-stage-title text-sm sm:text-base font-light text-white uppercase font-serif tracking-wide">${step.title}</h3>
                  </div>

                  <p class="craft-stage-desc text-xs text-stone-300 font-light leading-relaxed max-w-lg">
                    ${step.description}
                  </p>

                  <div class="craft-stage-meta flex flex-wrap gap-3 text-[9px] font-mono text-stone-500 uppercase tracking-widest pt-0.5">
                    <span>Duration: ${step.duration}</span>
                    <span>•</span>
                    <span>Supervisor: ${step.supervisor}</span>
                  </div>

                  ${idx === 1 ? `
                    <!-- Stage 2 Count-Up Stat: 4,500 Sq. Ft. Atelier -->
                    <div class="atelier-stat-badge mt-1.5 p-2.5 bg-stone-900/80 flex items-center gap-3 max-w-sm shadow-lg">
                      <div class="text-xl sm:text-2xl font-light text-amber-400 font-mono" id="atelier-sqft-counter">0</div>
                      <div class="text-[8.5px] font-mono tracking-widest text-stone-400 uppercase leading-snug">
                        <span>SQ. FT. DISPLAY ATELIER</span><br>
                        <span class="text-stone-500">Vavdi, Rajkot, Gujarat</span>
                      </div>
                    </div>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right 5 Cols: Interactive Draggable & Touch Split-Wipe Transformation Moment -->
        <div class="lg:col-span-5">
          <div class="transformation-card bg-stone-950 shadow-2xl rounded-sm overflow-hidden">
            <!-- Interactive Split-Wipe Curtain Container -->
            <div id="split-curtain-container" class="split-curtain-viewport relative aspect-[4/3] max-h-[46vh] overflow-hidden cursor-ew-resize rounded-sm select-none img-skeleton-wrap" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">
              <div class="img-skeleton-placeholder"></div>
              
              <!-- Raw Medium Image (Background Layer) -->
              <img
                src="/images/atelier_materials.jpg"
                alt="Raw Geomorphic Travertine Block"
                class="image-blur-up absolute inset-0 w-full h-full object-cover object-center filter contrast-115 brightness-90 pointer-events-none"
              />

              <!-- Finished Piece Image (Clipped Foreground Layer) -->
              <div id="split-curtain-clip" class="absolute inset-0 overflow-hidden pointer-events-none z-10" style="clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);">
                <img
                  src="/images/chapter_living_room.jpg"
                  alt="Finished Solis Travertine Console"
                  class="image-blur-up absolute inset-0 w-full h-full object-cover object-center filter contrast-105 pointer-events-none"
                />
              </div>

              <!-- Draggable Divider Bar -->
              <div id="split-curtain-handle" class="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-[0_0_12px_#f59e0b] pointer-events-none z-20" style="left: 50%;">
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black border-2 border-amber-400 flex items-center justify-center text-[8.5px] text-amber-300 shadow-xl">
                  &harr;
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  </section>`;

  // SECTION 5: THE CURATED EDITORIAL COLLECTION (Natural Height Grid)
  const sectionFeaturedPieces = `
  <section class="section-featured-pieces relative bg-black border-t border-stone-800 text-white z-10 overflow-hidden py-20 sm:py-24 lg:py-28 px-6 md:px-12 lg:px-20">
    <div class="max-w-7xl mx-auto w-full space-y-6">
      
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-800 pb-3">
        <div class="space-y-1">
          <span class="text-[10px] font-mono tracking-[0.45em] uppercase text-amber-500 block">
            CURATED COLLECTION • PERMANENT SANCTUARY
          </span>
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-light tracking-wide text-white uppercase font-serif">
            Featured Pieces
          </h2>
        </div>
        <a href="/artisan-pieces" class="btn-slide-white inline-flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-[0.25em] font-semibold self-start md:self-auto">
          <span>View Full Collection</span>
          <span class="btn-arrow">&rarr;</span>
        </a>
      </div>

      <!-- 4 Flagship Products Horizontal Grid (Strict Uniform Proportions) -->
      <div class="featured-pieces-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        ${PRODUCTS.slice(0, 4).map((p, idx) => `
          <div class="featured-piece-card group flex flex-col justify-between bg-stone-950 p-3 sm:p-4 space-y-3 transition-all duration-300 shadow-xl rounded-sm" data-row="${idx}">
            
            <div class="space-y-2.5">
              <!-- Uniform Fixed 4:3 Image Container with Skeleton Placeholder -->
              <div class="featured-piece-img-wrap relative w-full aspect-[4/3] overflow-hidden bg-stone-900 rounded-sm img-skeleton-wrap">
                <div class="img-skeleton-placeholder"></div>
                <img
                  src="${p.image}"
                  alt="${p.name} - Handcrafted by ${p.artisan}"
                  class="featured-piece-img image-blur-up w-full h-full object-cover object-center filter contrast-105 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  loading="lazy"
                />
              </div>

              <!-- Product Info with Fixed Height Alignment -->
              <div class="space-y-1">
                <div class="flex justify-between items-baseline gap-2 min-h-[26px]">
                  <a href="/artisan-pieces/${p.slug}" class="relative inline-block product-name-link truncate">
                    <h3 class="text-base sm:text-lg font-light text-white uppercase font-serif tracking-wide truncate group-hover:text-amber-300 transition-colors">
                      ${p.name}
                    </h3>
                    <span class="product-gold-underline absolute bottom-0 left-0 w-full h-px bg-amber-400 scale-x-0 origin-left transition-transform duration-300"></span>
                  </a>
                  <span class="text-xs font-mono text-amber-400 font-semibold tracking-wider whitespace-nowrap flex-shrink-0">
                    ${p.price}
                  </span>
                </div>

                <div class="text-[9px] font-mono text-stone-400 uppercase tracking-widest min-h-[16px] flex items-center">
                  <span>${p.category}</span>
                  <span class="mx-1 text-stone-600">•</span>
                  <span class="truncate">${p.artisan}</span>
                </div>
              </div>
            </div>

            <!-- Action CTAs: Pinned to bottom of card -->
            <div class="pt-2.5 border-t border-stone-800/80 flex items-center justify-between gap-2 mt-auto">
              <a href="${createWhatsAppLink(p.name)}" target="_blank" rel="noopener noreferrer" class="btn-slide-white flex-1 text-center py-2 px-2 text-[9px] font-semibold uppercase tracking-[0.2em] shadow-md">
                <span>Enquire</span>
                <span class="btn-arrow ml-1">&rarr;</span>
              </a>
              <a href="/artisan-pieces/${p.slug}" class="btn-slide-subtle px-3 py-2 text-center text-[9px] font-mono uppercase tracking-widest">
                <span>Details</span>
                <span class="btn-arrow ml-1">&rarr;</span>
              </a>
            </div>

          </div>
        `).join('')}
      </div>

      <!-- Closing Link Strip -->
      <div class="pt-1 text-center">
        <a href="/artisan-pieces" class="btn-slide-white inline-flex items-center gap-3 px-7 py-2.5 text-[10px] uppercase tracking-[0.25em] font-semibold shadow-xl">
          <span>Explore All Atelier Works</span>
          <span class="btn-arrow">&rarr;</span>
        </a>
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
  const quoteWordsHtml = quoteRawText.split(" ").map((word) => {
    const chars = word.split("").map((c) => `<span class="trust-char inline-block will-change-[opacity,transform,color]">${c}</span>`).join("");
    return `<span class="inline-block whitespace-nowrap">${chars}&nbsp;</span>`;
  }).join("");

  const sectionTrustVoice = `
  <section class="section-trust-voice relative bg-black border-t border-stone-800 text-white overflow-hidden" id="trust-voice-container">
    
    <!-- 1. Pinned Narrative Quote Scrub Viewport (100dvh on desktop) -->
    <div class="abouttt trust-voice-pinned w-full min-h-screen lg:h-screen flex flex-col justify-between pt-24 pb-8 px-6 md:px-12 lg:px-20 overflow-hidden bg-[#030303]" id="trust-voice-pinned-viewport">
      
      <!-- Subtle Ambient Warm Glow -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/[0.035] rounded-full blur-3xl pointer-events-none"></div>

      <!-- Top Eyebrow -->
      <div class="relative z-20 text-center">
        <span class="trust-eyebrow text-[10px] font-mono tracking-[0.5em] uppercase text-amber-500 block">
          TRUST &amp; VOICE • LIVING SPACES
        </span>
      </div>

      <!-- Center: Full-Bleed Testimonial (SplitType ScrollTrigger Scrub) -->
      <div class="relative z-20 max-w-5xl mx-auto px-6 md:px-12 py-4 text-center space-y-6 trust-quote-container my-auto">
        <div class="trust-quote-box relative">
          <span class="text-amber-500/70 font-serif text-3xl sm:text-5xl inline-block -mb-2 mr-1 select-none">&ldquo;</span>
          <h2 id="split-type-text" class="trust-quote-text text-xl sm:text-3xl md:text-4xl lg:text-[42px] font-light text-white font-serif leading-relaxed sm:leading-snug tracking-wide inline">
            ${quoteWordsHtml}
          </h2>
          <span class="text-amber-500/70 font-serif text-3xl sm:text-5xl inline-block -mb-2 ml-1 select-none">&rdquo;</span>
        </div>

        <div class="trust-attribution space-y-2 pt-2">
          <div class="w-16 h-px bg-gradient-to-r from-transparent via-amber-500/70 to-transparent mx-auto mb-3"></div>
          <span class="text-xs sm:text-sm font-mono uppercase tracking-[0.35em] text-amber-300 block">
            Interior Architecture Studio — Mumbai
          </span>
          <span class="text-[9.5px] font-mono tracking-widest text-stone-400 uppercase block">
            Private Residence Architectural Commission • 2026
          </span>
        </div>
      </div>

      <!-- Bottom Status Strip (Adaptive to touch devices) -->
      <div class="relative z-20 flex justify-between items-center text-[9px] font-mono tracking-widest text-stone-500 uppercase border-t border-white/10 pt-3">
        <span>
          <span class="mouse-device-only">SCROLL TO ADVANCE NARRATIVE</span>
          <span class="touch-device-only">SWIPE TO ADVANCE NARRATIVE</span>
        </span>
        <span>ELYSIUM SPATIAL ATELIER</span>
      </div>

    </div>

    <!-- 2. Sculptural Frosted Glass Testimonial Component (Natural Height) -->
    <div class="section-testimonial-stage relative w-full py-20 sm:py-28 lg:py-32 px-6 sm:px-10 lg:px-16 overflow-hidden flex flex-col items-center justify-center border-t border-stone-800/80 bg-black" id="trust-testimonial-stage">
      
      <!-- Full-Bleed Blurred Atelier Stone Backdrop -->
      <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/images/atelier_materials.jpg"
          alt="Elysium Stone Atelier Texture"
          class="w-full h-full object-cover object-center filter blur-xl brightness-[0.25] contrast-125 scale-110"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/90 via-black/75 to-black"></div>
        <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/[0.05] rounded-full blur-3xl"></div>
      </div>

      <!-- Center Floating Frosted Glass Card -->
      <div id="elysium-testimonial-card" class="testimonial-card relative z-10 w-full max-w-2xl bg-stone-950/75 backdrop-blur-2xl border border-amber-500/20 rounded-2xl p-8 sm:p-12 text-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_40px_rgba(212,175,55,0.06)] overflow-visible will-change-[transform,opacity]">
        
        <!-- Top Custom Botanical Wreath Frame with 100% Unobstructed Round Portrait in Circular Frame -->
        <div class="testimonial-wreath-wrap relative w-60 sm:w-72 h-auto mx-auto mb-6 flex items-center justify-center">
          
          <svg class="testimonial-frame-svg w-full h-auto pointer-events-none z-10 overflow-visible text-amber-300 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] select-none" viewBox="0 0 240 180" fill="none">
            
            <defs>
              <!-- Exact Circle Clip Path for Portrait Photo -->
              <clipPath id="testimonial-circle-clip">
                <circle id="testimonial-portrait-circle" cx="140" cy="90" r="54" />
              </clipPath>
            </defs>

            <!-- 1. Central Circular Portrait Photo (100% Round, Zero Overlap Inside Circle) -->
            <g class="testimonial-portrait-wrap will-change-[opacity,transform]">
              <!-- Dark Backing Base Circle -->
              <circle cx="140" cy="90" r="54" fill="#141210" />
              <!-- Pure Round Clipped Image -->
              <image
                id="testimonial-portrait-img"
                href="/images/maker_portrait.jpg"
                x="86"
                y="36"
                width="108"
                height="108"
                clip-path="url(#testimonial-circle-clip)"
                preserveAspectRatio="xMidYMid slice"
                class="filter contrast-105 brightness-95"
              />
            </g>

            <!-- 2. Fragment: Complete Outer Gold Ring Framing the Portrait -->
            <circle class="stone-fragment stone-frag-ring text-amber-400/90" cx="140" cy="90" r="54" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>

            <!-- 3. Fragment: Top Botanical Leaves (Sprouting Upward Along Outer Rim) -->
            <g class="stone-fragment stone-frag-top-leaves text-amber-400" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none">
              <!-- Upward Rose Leaf -->
              <path d="M 86,48 C 76,32 86,16 96,8 C 108,18 110,34 100,46 Z" stroke-width="1.5" fill="#000000" fill-opacity="0.35"/>
              <path d="M 86,48 Q 94,26 96,8" stroke-width="1.3"/>
              <path d="M 90,38 L 84,33 M 92,30 L 86,24 M 94,22 L 89,17 M 92,38 L 99,34 M 94,30 L 102,25 M 95,21 L 102,17" stroke-width="0.9"/>
              
              <!-- Top-Right Leaf -->
              <path d="M 100,44 C 110,30 126,24 138,22 C 138,38 126,50 114,52 Z" stroke-width="1.5" fill="#000000" fill-opacity="0.35"/>
              <path d="M 100,44 Q 119,33 138,22" stroke-width="1.3"/>
              <path d="M 109,39 L 112,32 M 117,35 L 123,29 M 125,30 L 131,24 M 111,43 L 116,48 M 119,40 L 125,45" stroke-width="0.9"/>
              
              <!-- Small Outer Leaf -->
              <path d="M 78,54 C 66,46 66,32 72,24 C 82,30 85,44 82,52 Z" stroke-width="1.3" fill="#000000" fill-opacity="0.35"/>
              <path d="M 78,54 Q 74,38 72,24" stroke-width="1.1"/>
            </g>

            <!-- 4. Fragment: Upper Blooming Rose on Outer Left Perimeter -->
            <g class="stone-fragment stone-frag-rose-top text-amber-300" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none">
              <path d="M 50,52 C 44,42 52,30 66,30 C 80,30 88,42 82,54" stroke-width="1.6" fill="#000000" fill-opacity="0.55"/>
              <path d="M 82,54 C 88,60 86,74 74,78 C 62,82 52,76 50,64" stroke-width="1.6" fill="#000000" fill-opacity="0.55"/>
              <path d="M 50,64 C 40,66 34,54 40,44 C 46,36 58,34 66,36" stroke-width="1.6" fill="#000000" fill-opacity="0.55"/>
              <path d="M 46,50 C 40,58 44,70 54,74 C 64,78 74,74 76,64" stroke-width="1.4"/>
              <path d="M 56,42 C 66,38 76,44 74,54 C 72,64 60,66 52,60" stroke-width="1.4"/>
              <path d="M 62,50 C 58,47 60,57 66,56 C 72,55 70,46 63,44 C 56,43 54,54 60,59 C 66,64 74,60 74,52" stroke-width="1.3"/>
              <circle cx="63" cy="53" r="2.2" stroke-width="1.2" fill="currentColor" fill-opacity="0.25"/>
            </g>

            <!-- 5. Fragment: Side Bud & Berry Sprig Extending Outward -->
            <g class="stone-fragment stone-frag-berries-side text-amber-400/90" stroke="currentColor" stroke-linecap="round" fill="none">
              <path d="M 54,78 Q 38,70 26,58" stroke-width="1.4"/>
              <path d="M 46,74 L 34,68 M 40,80 L 22,78 M 42,86 L 28,92 M 50,90 L 38,98" stroke-width="1.1"/>
              
              <circle cx="26" cy="58" r="3.2" stroke-width="1.3" fill="#000000" fill-opacity="0.6"/>
              <circle cx="34" cy="68" r="3.4" stroke-width="1.3" fill="#000000" fill-opacity="0.6"/>
              <circle cx="22" cy="78" r="3.6" stroke-width="1.3" fill="#000000" fill-opacity="0.6"/>
              <circle cx="28" cy="92" r="3.4" stroke-width="1.3" fill="#000000" fill-opacity="0.6"/>
              <circle cx="38" cy="98" r="3" stroke-width="1.3" fill="#000000" fill-opacity="0.6"/>
              
              <circle cx="25" cy="57" r="0.8" fill="currentColor" stroke="none"/>
              <circle cx="33" cy="67" r="0.8" fill="currentColor" stroke="none"/>
              <circle cx="21" cy="77" r="0.8" fill="currentColor" stroke="none"/>
              <circle cx="27" cy="91" r="0.8" fill="currentColor" stroke="none"/>
            </g>

            <!-- 6. Fragment: Lower Blooming Rose on Outer Left Perimeter -->
            <g class="stone-fragment stone-frag-rose-bottom text-amber-300" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none">
              <path d="M 48,94 C 40,84 50,72 64,72 C 78,72 88,84 82,96" stroke-width="1.6" fill="#000000" fill-opacity="0.55"/>
              <path d="M 82,96 C 90,104 88,118 76,124 C 64,128 52,122 48,110" stroke-width="1.6" fill="#000000" fill-opacity="0.55"/>
              <path d="M 48,110 C 36,114 30,102 38,90 C 44,80 56,80 64,82" stroke-width="1.6" fill="#000000" fill-opacity="0.55"/>
              <path d="M 38,90 C 28,100 32,116 44,124 C 56,132 70,132 80,124" stroke-width="1.6" fill="#000000" fill-opacity="0.55"/>
              <path d="M 44,102 C 36,112 44,126 58,128 C 72,130 84,120 84,108" stroke-width="1.4"/>
              <path d="M 54,86 C 66,84 78,90 76,102 C 74,114 60,116 50,108" stroke-width="1.4"/>
              <path d="M 62,96 C 56,92 58,104 66,102 C 74,100 71,90 63,88 C 54,87 52,100 60,106 C 68,112 78,106 77,97" stroke-width="1.3"/>
              <circle cx="63" cy="97" r="2.4" stroke-width="1.2" fill="currentColor" fill-opacity="0.25"/>
            </g>

            <!-- 7. Fragment: Bottom Foliage & Veined Leaves -->
            <g class="stone-fragment stone-frag-bottom-leaves text-amber-400" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none">
              <path d="M 56,128 C 46,142 50,160 62,170 C 72,156 74,138 66,128 Z" stroke-width="1.5" fill="#000000" fill-opacity="0.35"/>
              <path d="M 56,128 Q 62,150 62,170" stroke-width="1.3"/>
              <path d="M 58,140 L 51,145 M 60,150 L 53,156 M 60,140 L 67,136 M 61,150 L 68,145" stroke-width="0.9"/>
              
              <path d="M 76,126 C 90,138 108,146 124,142 C 114,130 100,122 84,122 Z" stroke-width="1.5" fill="#000000" fill-opacity="0.35"/>
              <path d="M 76,126 Q 104,136 124,142" stroke-width="1.3"/>
            </g>

            <!-- 8. Fragment: Bottom Sweeping Berry Droop -->
            <g class="stone-fragment stone-frag-berries-bottom text-amber-400/90" stroke="currentColor" stroke-linecap="round" fill="none">
              <path d="M 74,132 Q 98,150 130,158" stroke-width="1.4"/>
              <path d="M 84,140 L 92,150 M 96,144 L 104,155 M 110,148 L 118,158 M 122,152 L 128,160" stroke-width="1.1"/>
              
              <circle cx="92" cy="150" r="3.4" stroke-width="1.3" fill="#000000" fill-opacity="0.6"/>
              <circle cx="104" cy="155" r="3.6" stroke-width="1.3" fill="#000000" fill-opacity="0.6"/>
              <circle cx="118" cy="158" r="3.4" stroke-width="1.3" fill="#000000" fill-opacity="0.6"/>
              <circle cx="128" cy="160" r="3" stroke-width="1.3" fill="#000000" fill-opacity="0.6"/>
              
              <circle cx="91" cy="149" r="0.8" fill="currentColor" stroke="none"/>
              <circle cx="103" cy="154" r="0.8" fill="currentColor" stroke="none"/>
              <circle cx="117" cy="157" r="0.8" fill="currentColor" stroke="none"/>
            </g>

          </svg>

        </div>

        <!-- Crossfading Text Content Container -->
        <div id="testimonial-content-container" class="space-y-4">
          <!-- Large Emotional Headline in Cormorant Garamond -->
          <h3 id="testimonial-headline" class="testimonial-headline text-3xl sm:text-4xl lg:text-5xl font-light text-white italic font-serif tracking-wide leading-tight">
            “Grounded.”
          </h3>

          <!-- Full Testimonial Quote with Gold Sweeping Highlight -->
          <p id="testimonial-quote" class="testimonial-quote text-sm sm:text-base text-stone-300 font-light leading-relaxed max-w-xl mx-auto font-sans">
            “Elysium delivered a custom travertine console that transformed our living room into <span class="testimonial-highlight-wrap inline-block relative"><span class="testimonial-highlight-bg absolute inset-0 bg-amber-500/20 border border-amber-400/30 rounded-xs"></span><span class="testimonial-highlight-text relative z-10 text-amber-200 font-normal px-1.5">a monolithic living sanctuary</span></span> with unmatched tactile reverence.”
          </p>

          <!-- Attribution Row -->
          <div id="testimonial-attribution-block" class="testimonial-attribution pt-4">
            <div class="text-xs sm:text-sm text-stone-200 font-sans">
              <strong id="testimonial-author" class="font-semibold text-white">Sarah P.</strong>
              <span class="text-stone-500 mx-1">•</span>
              <span id="testimonial-project" class="text-stone-400">Bespoke Console Commission, South Bombay Residence</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Small Dot Indicators for Manual Navigation / Status -->
      <div class="testimonial-dots flex items-center justify-center gap-2.5 mt-8 relative z-20" id="testimonial-dots-nav">
        <button class="testimonial-dot active w-2.5 h-2.5 rounded-full bg-amber-400 transition-all cursor-pointer shadow-[0_0_8px_#f59e0b]" data-idx="0" aria-label="Testimonial 1"></button>
        <button class="testimonial-dot w-2.5 h-2.5 rounded-full bg-stone-700 hover:bg-stone-500 transition-all cursor-pointer" data-idx="1" aria-label="Testimonial 2"></button>
        <button class="testimonial-dot w-2.5 h-2.5 rounded-full bg-stone-700 hover:bg-stone-500 transition-all cursor-pointer" data-idx="2" aria-label="Testimonial 3"></button>
      </div>

    </div>

  </section>`;

  // Render combined page with breathtaking 100vh interactive body sections between Hero and Footer
  res.send(renderPage({
    title: 'Elysium | Artisan Minimalist Home Decor, Handcrafted in India',
    description: BRAND.heroStatement,
    path: '/',
    content: heroSection + sectionManifesto + sectionHorizontalGallery + sectionMaterialityInterlude + sectionCraftJourney + sectionFeaturedPieces + sectionTrustVoice,
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
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-slide-white w-full py-3.5 text-center text-xs font-semibold uppercase tracking-[0.25em] shadow-lg"><span>Enquire via WhatsApp</span><span class="btn-arrow ml-2">&rarr;</span></a>
            <a href="/contact?piece=${encodeURIComponent(product.name)}" class="btn-slide-subtle w-full py-3 text-center text-xs uppercase tracking-[0.25em]"><span>Submit Form Enquiry</span></a>
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
          <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-slide-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.25em] inline-flex items-center gap-2 shadow-lg"><span>Start Consultation via WhatsApp</span><span class="btn-arrow">&rarr;</span></a>
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
              <a href="${createWhatsAppLink(pieceName)}" target="_blank" rel="noopener noreferrer" class="btn-slide-white w-full py-3.5 text-center text-xs font-semibold uppercase tracking-[0.25em] shadow-md"><span>OPEN WHATSAPP CHAT</span><span class="btn-arrow ml-2">&rarr;</span></a>
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
                <button type="submit" class="btn-slide-white w-full py-4 text-center text-xs font-semibold uppercase tracking-[0.25em] shadow-md"><span>SUBMIT FORM ENQUIRY</span></button>
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

