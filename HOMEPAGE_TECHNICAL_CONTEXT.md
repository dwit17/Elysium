# ELYSIUM — HOMEPAGE TECHNICAL CONTEXT & GSAP SCROLL ARCHITECTURE AUDIT

> **Document Type:** Technical Audit & Architecture Specification  
> **Target Audience:** GSAP & ScrollTrigger Animation Specialists / Systems Architects  
> **Status:** Verified Active Codebase (Inspection-Based — Zero Inferred / Mock Data)  
> **Date:** September 2026  

---

## 1. PROJECT STACK

### Core Runtime & Framework
- **Architecture:** Node.js / Express Server-Rendered Application (`server.js`, 2,063 lines).
- **Runtime Environment:** Pure Node.js (ES6+ template literals generating semantic HTML5 responses).
- **TypeScript Layer:** TypeScript 7.0.2 with complete type contracts, component models, and product definitions in `src/` (`src/types/`, `src/data/`, `src/components/`, `src/pages/`). Compiles cleanly via `npx tsc --noEmit` (0 errors).
- **React / Next.js / Vite Status:** **Not active in the runtime build pipeline.** There is no JSX compiler or Webpack/Vite bundler executing at server runtime. Component files in `src/components/` exist as modular TypeScript architectural components matching the template literal generators in `server.js`.
- **Server Framework:** Express.js `^4.21.2` (`package.json`).
- **Serverless / Cloud Deployment:** Vercel via `@vercel/node` `^5.1.8`, `vercel.json` routing all requests to `api/index.js`.
- **Local Dev Server:** `npm run dev` executes `node --watch server.js` on port `3000`.

### Styling & Design System
- **CSS Architecture:**
  - Static Pre-Compiled Tailwind CSS at `public/css/tailwind.min.css` (Tailwind v3 utility set loaded statically — **no CLI build step**).
  - Custom Elysium Design System & Token Stylesheet at `public/css/elysium.css` (2,359 lines) defining custom `@font-face`, fluid typography clamp scales, baroque frame bevels, stone textures, night mode overlays, and responsive animations.
- **Typography:**
  - Strict two-font local hierarchy loaded from `public/fonts/`:
    - `Geist-Medium.ttf` (`font-weight: 500` / `600`) — Headings, titles, badges, and numerals (`font-sans`, `font-serif`, `font-mono`).
    - `Geist-Light.ttf` (`font-weight: 300`) — Body copy, descriptions, captions, and narrative text (`font-light`).
  - Preloaded via `<link rel="preload">` in the HTML `<head>`. External Google Fonts links have been removed.

### Animation & Smooth-Scroll Stack
- **GSAP Core:** GSAP `3.15.0` (`public/js/vendor/gsap.min.js`).
- **ScrollTrigger:** ScrollTrigger `3.15.0` (`public/js/vendor/ScrollTrigger.min.js`).
- **Text Splitting:** SplitType `0.3.4` (`public/js/vendor/split-type.min.js`).
- **Smooth Scrolling Engine:** Lenis `1.3.26` (`public/js/vendor/lenis.min.js`).
- **Canvas Rendering Engine:** Custom 2D Canvas Image-Sequence Streaming Engine in `public/js/heroCanvas.js` (181 JPEG frames loaded dynamically from `/hero-frames/ezgif-frame-*.jpg`).
- **Three.js / WebGL / R3F:** Not currently loaded in the client bundles.
- **Framer Motion / Motion:** Not present.

### Client Scripts Execution Pipeline
Scripts are loaded synchronously at the end of the `<body>` in `server.js`:
```html
<script src="/js/vendor/gsap.min.js"></script>
<script src="/js/vendor/ScrollTrigger.min.js"></script>
<script src="/js/vendor/split-type.min.js"></script>
<script src="/js/vendor/lenis.min.js"></script>
<script src="/js/main.js"></script>
<script src="/js/heroCanvas.js"></script> <!-- Loaded conditionally on homepage -->
<script src="/js/homeAnimations.js"></script>
```

---

## 2. HOMEPAGE FILE ARCHITECTURE

```
Homepage (GET /)
 ├── Sticky Header (server.js L357-397, Header.tsx)
 ├── 0. Hero Canvas ("A Space in Motion")
 │    ├── Path: server.js (heroSection L691-723), HeroCanvas.tsx
 │    ├── Client Script: public/js/heroCanvas.js
 │    └── DOM: #hero-scroll-container > .hero-sticky-viewport > #hero-canvas
 ├── 1. Atelier Manifesto ("Every Piece Begins With a Name.")
 │    ├── Path: server.js (sectionManifesto L728-806), ManifestoSection.tsx
 │    ├── Client Script: public/js/homeAnimations.js (initManifestoSection)
 │    └── DOM: .section-manifesto > .manifesto-heading (.manifesto-word) + #manifesto-tilt-card
 ├── 2. Horizontal Atelier Expedition (Chapters 01–04)
 │    ├── Path: server.js (sectionHorizontalGallery L808-874), HorizontalGallery.tsx
 │    ├── Client Script: public/js/homeAnimations.js (initHorizontalGallerySection)
 │    └── DOM: #horizontal-suite-container > #horizontal-track > 4x .horizontal-slide-panel
 ├── 3. Tactile Materiality Lab (4 Mediums)
 │    ├── Path: server.js (sectionMaterialityInterlude L876-992), MaterialityInterlude.tsx
 │    ├── Client Script: public/js/homeAnimations.js (initMaterialityInterludeSection)
 │    └── DOM: #materiality-suite-container > .mat-slide-0..3 + .mat-label-0..3
 ├── 3B. Spatial Wave Bend & Motion Path ("The Continuous Trace")
 │    ├── Path: server.js (sectionWaveBend L994-1094), WaveBendSection.tsx
 │    ├── Client Script: public/js/homeAnimations.js (initWaveBendSection)
 │    └── DOM: #wave-bend-container > .wave-scroll-svg-wrapper > svg#wave-scroll-svg (#waveMotionPath + 5x .wave-stop-node + #waveTracer) + .wave-showcase-frame
 ├── 4. Craft Journey & Transformation Lab ("From Raw Earth to Living Sanctuary")
 │    ├── Path: server.js (sectionCraftJourney L1096-1215), CraftJourney.tsx
 │    ├── Client Script: public/js/homeAnimations.js (initCraftJourneySection)
 │    └── DOM: .section-craft-journey > 4x .craft-stage-item (#craft-scrub-line) + #split-curtain-container
 ├── 5. Curated Editorial Collection (6 Featured Pieces)
 │    ├── Path: server.js (sectionFeaturedPieces L1217-1296), FeaturedPieces.tsx
 │    ├── Client Script: public/js/homeAnimations.js (initFeaturedPiecesSection)
 │    └── DOM: .section-featured-pieces > .featured-pieces-grid > 6x .featured-piece-card
 ├── 6. Trust & Voice • Living Spaces (Word Reveal & Testimonial Stage)
 │    ├── Path: server.js (sectionTrustVoice L1298-1554), TrustVoice.tsx
 │    ├── Client Script: public/js/homeAnimations.js (initTrustVoiceSection & initTestimonialComponent)
 │    └── DOM: #trust-voice-container > #split-type-text (.trust-word) + #elysium-testimonial-card (.stone-fragment, #testimonial-portrait-wrap)
 └── Footer ("Sculpting raw earth into timeless living sanctuaries")
      ├── Path: server.js (renderPage footer L402-562), Footer.tsx
      ├── Client Script: Inline script in server.js L468-561
      └── DOM: footer.footer-fullscreen > #footer-decor-container > #footer-bulb-btn (.bell-container)
```

---

## 3. HOMEPAGE WIREFRAME & STRUCTURAL FLOW

```
┌────────────────────────────────────────────────────────────────────────┐
│ [STICKY HEADER] — Fixed top-0, z-50, backdrop blur, logo + nav + CTA   │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│ [HERO CANVAS] — #hero-scroll-container                                 │
│ • Height: Pinned 2000px virtual scroll (100vh viewport)                │
│ • Layout: Fullscreen 2D Canvas, 181-frame scrub, story text overlay   │
│ • Output: Frame sequence scrubbed via GSAP ScrollTrigger                │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│ [SECTION 1: ATELIER MANIFESTO] — .section-manifesto                    │
│ • Height: Natural auto height (~80vh)                                  │
│ • Layout: 2-column (7 cols text + 5 cols 3D perspective tilt card)     │
│ • Motion: Scroll-triggered word stagger + portrait reveal + tilt mouse │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│ [SECTION 2: HORIZONTAL EXPEDITION] — #horizontal-suite-container       │
│ • Height: Pinned 4-panel scrub ((4 - 1) * 1.05 * 100vw virtual scroll) │
│ • Layout: Horizontal flex track translating on X-axis (0 → -300vw)    │
│ • Motion: Pinned ScrollTrigger scrub + active chapter indicator        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│ [SECTION 3: MATERIALITY LAB] — #materiality-suite-container            │
│ • Height: Pinned 2200px virtual scroll (100vh viewport)                │
│ • Layout: Stacked full-bleed absolute slides (Travertine, Clay, Oak,   │
│   Plaster) with centralized editorial text cards                       │
│ • Motion: Pinned crossfade timeline scrubbing 4 material layers        │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│ [SECTION 3B: SPATIAL WAVE BEND] — #wave-bend-container                 │
│ • Height: Natural auto height (~90vh), overflow-visible               │
│ • Layout: 2-column (6 cols visual frame + 6 cols balanced copy)        │
│ • Wave Path: Continuous 600x2800 SVG Q/T Bezier curve with 5 waypoint  │
│   stops and light tracer extending beyond section bottom               │
│ • Motion: Scroll-driven stroke-dashoffset draw + waypoint illumination │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│ [SECTION 4: CRAFT JOURNEY] — .section-craft-journey                    │
│ • Height: Pinned 1400px virtual scroll (100vh viewport)                │
│ • Layout: 2-column (7 cols 4-step vertical timeline + 5 cols split-    │
│   wipe before/after interactive transformation slider)                 │
│ • Motion: Pinned vertical SVG scrub line + stage activation + 4,500    │
│   sq ft atelier countup                                                │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│ [SECTION 5: CURATED COLLECTION] — .section-featured-pieces             │
│ • Height: Natural auto height (~120vh)                                 │
│ • Layout: 3-column responsive product card grid (6 pieces)             │
│ • Motion: Staggered translateY entrance on scroll                      │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│ [SECTION 6: TRUST & VOICE] — #trust-voice-container                    │
│ • Height: Pinned 1400px virtual scroll (100vh viewport)                │
│ • Layout: Fullscreen centered testimonial with floating frosted card   │
│ • Motion: Word-by-word highlight reveal (#57534e → #ffffff) + stone    │
│   fragment assembly + rotating testimonial narratives                  │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────────┐
│ [FULLSCREEN FOOTER] — footer.footer-fullscreen                         │
│ • Height: 100vh interactive night/day atelier showroom                 │
│ • Layout: Full-bleed background flatlay + interactive pull lamp cord   │
│ • Motion: Interactive lighting toggle with glow and CSS filter shifts  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. COMPLETE GSAP & SCROLLTRIGGER AUDIT

| ID | File & Function | Trigger Element | Start / End | Scrub / Pin | Target Elements & Properties | Lifecycle / Cleanup |
|---|---|---|---|---|---|---|
| **ST-00** | `homeAnimations.js` L29-68 (`initLenisSmoothScroll`) | Global Window Scroller | N/A | N/A | Synchronizes Lenis `1.3.26` via `gsap.ticker.add((time) => lenisInstance.raf(time * 1000))` with `lagSmoothing(500, 33)` and `lenisInstance.on('scroll', ScrollTrigger.update)`. | Persists globally across session. |
| **ST-01** | `heroCanvas.js` L179-202 (`setupScrollTrigger`) | `#hero-scroll-container` | `start: 'top top'`<br>`end: '+=2000'` | `pin: true`<br>`scrub: 0.1` | Calls `renderFrameByProgress(progress)` to paint frames `0..180` to `<canvas id="hero-canvas">` using `drawImage()` with precalculated aspect ratio. Also updates `#scroll-progress-text` and `#story-overlay-text`. | `heroScrollTrigger.kill()` on resize/re-init and `beforeunload`. |
| **ST-02** | `homeAnimations.js` L74-127 (`initManifestoSection`) | `.section-manifesto` | `start: 'top 75%'` | `pin: false`<br>`toggleActions: 'play none none none'` | Timeline: `.manifesto-eyebrow` (y, opacity), `.manifesto-divider` (scaleX), `.manifesto-word` (stagger 0.02s), `.manifesto-portrait-mask` (`clipPath: inset(0 100% 0 0) -> inset(0 0% 0 0)`), paragraphs, signature, links. | Reduced-motion & mobile (<1024px) branch applies instantaneous styles. |
| **ST-03** | `homeAnimations.js` L184-232 (`initHorizontalGallerySection`) | `#horizontal-suite-container` | `start: 'top top'`<br>`end: () => '+=' + (totalPanels - 1) * window.innerWidth * 1.05` | `pin: true`<br>`scrub: 0.8`<br>`anticipatePin: 1` | `gsap.to(track, { x: () => -(track.scrollWidth - window.innerWidth) })`. Also updates `#horizontal-progress-fill` width% and `#horizontal-active-indicator` text. | Reduced-motion & mobile (<1024px) reset `transform: none` and `width: 100%`. |
| **ST-04** | `homeAnimations.js` L238-363 (`initMaterialityInterludeSection`) | `#materiality-suite-container` | `start: 'top top'`<br>`end: '+=2200'` | `pin: true`<br>`scrub: 0.8`<br>`anticipatePin: 1` | Crossfades 4 material slides (`.mat-slide-0..3`), scales background images (`scale: 1.12`), transitions labels (`.mat-label-0..3`), and activates `.mat-tab-btn` chips. | Mobile (<1024px) uses CSS flex scroll container. |
| **ST-05** | `homeAnimations.js` L551-635 (`initWaveBendSection`) | `#wave-bend-container` | `start: 'top 85%'`<br>`end: 'bottom+=400 top'` | `pin: false`<br>`scrub: 0.6` | Computes `pathLength = path.getTotalLength()`. Scrubs `strokeDashoffset` from `pathLength -> 0`, updates `#waveTracer` coordinates via `path.getPointAtLength()`, toggles `.is-passed` class on 5 `.wave-stop-node` markers, floats `.wave-showcase-frame`. | `prefersReducedMotion` sets `strokeDashoffset: 0` and marks all nodes passed. |
| **ST-06** | `homeAnimations.js` L369-453 (`initCraftJourneySection`) | `.section-craft-journey` | `start: 'top top'`<br>`end: '+=1400'` | `pin: true`<br>`scrub: 0.8`<br>`anticipatePin: 1` | Scrubs `#craft-scrub-line` (`strokeDashoffset: 1000 -> 0`), fades/scales 4 `.craft-stage-item` stages, triggers countup to 4,500 on `#atelier-sqft-counter`. | Reduced-motion / compact screen forces all stages active immediately. |
| **ST-07** | `homeAnimations.js` L638-664 (`initFeaturedPiecesSection`) | `.section-featured-pieces` / `.featured-pieces-grid` | `start: 'top 82%'` | `pin: false`<br>`toggleActions: 'play none none none'` | Staggered entrance of 6 `.featured-piece-card` elements (`opacity: 0 -> 1`, `y: 35 -> 0`, `stagger: 0.12`). | Bypassed when reduced motion enabled. |
| **ST-08** | `homeAnimations.js` L671-734 (`initTrustVoiceSection`) | `#trust-voice-container` | `start: 'top top'`<br>`end: '+=1400'` | `pin: true`<br>`scrub: 0.3`<br>`anticipatePin: 1` | Progressive word-by-word reveal on `.trust-word` spans (`color: '#57534e' -> '#ffffff'`, `opacity: 0.6 -> 1`, `stagger: 0.08`), followed by `.trust-attribution` fade in. | Reduced-motion sets full white opacity instantly. |
| **ST-09** | `homeAnimations.js` L742-1040 (`initTestimonialComponent`) | `#elysium-testimonial-card` | `start: 'top 75%'` | `pin: false`<br>`once: true` | Assembles randomized `.stone-fragment` elements (`randX/randY/randRot -> 0`), expands `#testimonial-portrait-circle` (`r: 0 -> 54`), sweeps quote highlight, pops rating stars (`back.out(2)`). Houses independent 6s crossfade interval for 3 testimonials. | Reduced-motion skips fragment animation and expands portrait circle immediately. |
| **ST-10** | `homeAnimations.js` L1045-1068 (`initSubpageAnimations`) | Subpage cards & boxes | `start: 'top 88%'` | `pin: false`<br>`once: true` | Staggered batch reveal for non-homepage cards (`opacity: 0 -> 1`, `y: 40 -> 0`). | Only runs on subpage routes. |
| **ST-11** | `homeAnimations.js` L1073-1091 (`initButtonHoverAnimations`) | `.rotating-seal-badge` | Hover events | N/A | Magnetic scale `1.08` on mouseenter, `1.0` on mouseleave with fine pointer media query. | Only active on fine pointer devices (`hover: hover`). |

---

## 5. CURRENT WAVE / SVG / PATH ANIMATION INSPECTION

### SVG Markup & Geometric Definition
- **Location:** `server.js` (lines 995–1094) & `src/components/home/WaveBendSection.tsx`.
- **Containing Element:** `<section class="section-wave-bend relative bg-[#040404] border-t border-stone-800/80 text-white py-28 sm:py-36 lg:py-44 px-6 sm:px-12 lg:px-20 overflow-visible" id="wave-bend-container">`
- **SVG Wrapper:** `<div class="wave-scroll-svg-wrapper absolute inset-0 w-full h-[150%] pointer-events-none z-10 overflow-visible">`
- **SVG Element:** `<svg id="wave-scroll-svg" class="wave-scroll-svg" viewBox="0 0 600 2800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">`

### Geometric Path String
```svg
d="M -5,0 Q 450 230 300 450 T 130 750 Q 100 850 300 1000 T 150 1400 Q -150 1600 250 2000 T 0 2800"
```

### Visual & Stroke Configuration
1. **Ambient Guide Under-Track (`.wave-under-track`):**
   - Stroke: `rgba(236, 236, 236, 0.12)`
   - Stroke Width: `2px`
   - Stroke Linecap/Linejoin: `round`
   - Fill: `none`
2. **Active Scroll-Drawn Motion Path (`#waveMotionPath` / `.wave-motion-path`):**
   - Stroke: `#ececec`
   - Stroke Width: `2.5px`
   - Stroke Linecap/Linejoin: `round`
   - Fill: `none`
   - Filter: `drop-shadow(0 0 8px rgba(236, 236, 236, 0.45))`
   - Will-Change: `stroke-dashoffset`

### Waypoint Milestones (Stop Nodes)
Five architectural markers positioned at Bézier crests along the path:
- **Stop 01:** `transform="translate(337, 340)"` (Threshold: `p >= 0.12`)
- **Stop 02:** `transform="translate(126, 775)"` (Threshold: `p >= 0.28`)
- **Stop 03:** `transform="translate(372, 1117)"` (Threshold: `p >= 0.44`)
- **Stop 04:** `transform="translate(117, 1425)"` (Threshold: `p >= 0.62`)
- **Stop 05:** `transform="translate(213, 1962)"` (Threshold: `p >= 0.82`)

### Structure of Each Waypoint Node:
```svg
<g class="wave-stop-node stop01" transform="translate(337, 340)">
  <circle class="stop-halo" r="16" fill="none" stroke="rgba(236, 236, 236, 0.2)" stroke-width="1.5" />
  <circle class="stop-bg" r="7" fill="#060606" stroke="rgba(236, 236, 236, 0.5)" stroke-width="1.5" />
  <circle class="stop-core" r="2.5" fill="#78716c" />
</g>
```
When `.is-passed` is added, CSS transforms `.stop-halo` (`scale(1.35)`, `stroke: rgba(236, 236, 236, 0.85)`, drop-shadow glow) and fills `.stop-core` with `#ffffff`.

### Traveling Light Tracer (`#waveTracer`)
```svg
<g id="waveTracer" class="wave-tracer">
  <circle cx="0" cy="0" r="12" fill="none" stroke="rgba(255, 255, 255, 0.4)" stroke-width="1.5" />
  <circle cx="0" cy="0" r="6" fill="#ffffff" />
  <circle cx="0" cy="0" r="2" fill="#09090b" />
</g>
```
Positioned via `gsap.set(tracer, { x: pt.x, y: pt.y })` where `pt = path.getPointAtLength(p * pathLength)`.

---

## 6. CRAFT JOURNEY & PROCESS SECTION AUDIT

- **Section Title:** *"From Raw Earth to Living Sanctuary."*
- **DOM Container:** `<section class="section-craft-journey relative bg-[#060606] border-t border-stone-800 text-white z-10 overflow-hidden py-20 sm:py-24 lg:py-28 px-6 md:px-12 lg:px-20">`
- **Data Source:** `CRAFT_STEPS` constant in `server.js` (lines 142–174) & `src/data/products.ts`.

### 4-Stage Progressive Timeline
1. **Stage 01:** *Extraction & Stratification* (Duration: 3 Weeks • Supervisor: Master Quarryman V. Rawal)
2. **Stage 02:** *Sculptural Carving & Masonry* (Duration: 18 Days • Supervisor: Senior Mason H. Makwana) + **Interactive Stat Counter:** `#atelier-sqft-counter` counting up to `4,500` sq. ft.
3. **Stage 03:** *Hand-Applied Patinas & Organic Wax* (Duration: 7 Days • Supervisor: Finishing Master K. Solanki)
4. **Stage 04:** *Micro-Etching & Atelier Authentication* (Duration: 48 Hours • Supervisor: Lead Conservator P. Dave)

### Animation & Scrub Logic (`initCraftJourneySection`)
- **Vertical Scrub Track:** `<line id="craft-scrub-line" x1="2" y1="0" x2="2" y2="100%" stroke="#d4af37" stroke-width="2.5" stroke-dasharray="1000" stroke-dashoffset="1000" />`
- **Timeline:** Pinned ScrollTrigger (`start: 'top top'`, `end: '+=1400'`, `pin: true`, `scrub: 0.8`).
- **Scrub Progression:**
  - Slice 1 (0.00 → 0.35): `strokeDashoffset: 1000 -> 650`
  - Slice 2 (0.35 → 0.70): `strokeDashoffset: 650 -> 320`, reveals Stage 2, executes countup to 4,500.
  - Slice 3 (0.70 → 1.00): `strokeDashoffset: 320 -> 0`, reveals Stage 3 & 4.
- **Split-Curtain Slider:** Right column houses `#split-curtain-container` with interactive pointer/touch drag revealing before/after imagery via CSS `clipPath: polygon(pct% 0, 100% 0, 100% 100%, pct% 100%)`.

---

## 7. RESPONSIVE ARCHITECTURE

### Breakpoints Configured
- **Mobile (< 768px):** `isMobileScreen()` returns `true`.
  - Pinned multi-section scrubs adapt to natural stacking layouts where appropriate.
  - Navigation switches to `#mobile-menu-drawer`.
  - Fluid clamp typography scales down to prevent multi-row wrapping.
- **Tablet / Compact (< 1024px):** `isCompactScreen()` returns `true`.
  - Horizontal Gallery (`#horizontal-suite-container`) switches to horizontal touch swipe with `transform: none` and full-width progress bar.
  - Materiality Lab switches to touch-scrollable chip list.
  - 3D Tilt perspective physics disabled on touch pointers.
- **Desktop (>= 1024px):**
  - All pinned scrub timelines (Hero, Horizontal Gallery, Materiality Lab, Craft Journey, Trust & Voice) lock into viewport and execute synchronous multi-stage scrubbing.

### `prefers-reduced-motion` Architecture
- Check: `window.matchMedia('(prefers-reduced-motion: reduce)').matches && !window.location.search.includes('motion=true')`.
- When active:
  - Hero Canvas displays static Frame 0.
  - SVG stroke paths set `strokeDashoffset: 0` immediately.
  - Word reveals display full `#ffffff` opacity.
  - Horizontal track and material slides render in natural unpinned document flow.

---

## 8. SCROLL ARCHITECTURE & TICKER SYNC

### Scroll Pipeline
```
Native Wheel / Touch Event
          ↓
Lenis 1.3.26 Virtual Scroller (smoothWheel: true, duration: 1.15)
          ↓
GSAP Ticker (gsap.ticker.add -> lenis.raf(time * 1000), lagSmoothing(500, 33))
          ↓
lenisInstance.on('scroll', ScrollTrigger.update)
          ↓
ScrollTrigger Pinned Scrub Timelines (Hero, Horizontal, Materiality, Wave, Craft, Trust)
```

### Critical Scroller Properties
- **Scroller Element:** Global `window` / `document.documentElement`.
- **No nested `scrollerProxy` required** because Lenis operates directly on window scroll offsets and updates ScrollTrigger on every tick.
- **Progressive Refreshes:** `ScrollTrigger.refresh()` is triggered at:
  - `document.fonts.ready` resolution
  - `window.addEventListener('load')`
  - Delayed safety checkpoints (`300ms`, `1000ms`)
  - Debounced `resize` and `orientationchange` listeners (`150ms`).

---

## 9. DOM & CSS PROPERTIES AFFECTING GSAP

1. **`overflow: visible` vs `overflow: hidden`:**
   - `.section-wave-bend` and `.wave-scroll-svg-wrapper` MUST maintain `overflow: visible !important;` to allow the SVG path to seamlessly enter from the preceding section and exit into the succeeding section.
   - Pinned sections (`#horizontal-suite-container`, `#materiality-suite-container`, `.section-craft-journey`, `#trust-voice-container`) use `overflow: hidden` to prevent layout overflowing during X-axis translations and absolute slide stacks.
2. **`will-change` Assignments:**
   - `.wave-motion-path`: `will-change: stroke-dashoffset;`
   - `.wave-tracer`: `will-change: transform, opacity;`
   - `.trust-word`: `transition-colors duration-150`
   - `canvas#hero-canvas`: rendered via 2D context with `desynchronized: true` to bypass compositor stalls.
3. **Z-Index Layer Hierarchy:**
   - Sticky Header: `z-50`
   - Mobile Menu Drawer: `z-50`
   - Section Wave SVG Canvas: `z-10`
   - Section Editorial Content: `z-20`
   - Split Curtain Draggable Handle: `z-20`
   - Ambient Glow Accents: `pointer-events-none`, `z-0`

---

## 10. HOMEPAGE ASSET INVENTORY

### Fonts (`public/fonts/`)
- `Geist-Medium.ttf` — All headings, titles, section headers, badges, and uppercase navigation labels.
- `Geist-Light.ttf` — All body copy, descriptions, testimonials, and metadata.

### Hero Canvas Sequence (`public/hero-frames/`)
- `ezgif-frame-001.jpg` through `ezgif-frame-181.jpg` (181 frames, precomputed aspect geometry).

### Editorial & Material Imagery (`public/images/`)
- `chapter_living_room.jpg` — Used in Wave Bend showcase frame & Split-Wipe after layer.
- `atelier_materials.jpg` — Used in Split-Wipe before layer (raw travertine block).
- `footer-decor-bg.jpg` — Full-bleed wabi-sabi flatlay background for fullscreen footer.
- `maker_portrait.jpg`, `atelier_craftsman.jpg`, `atelier_display.jpg` — Circular portrait images in rotating testimonial stage.
- `photo-1616486338812-3dadae4b4ace` — Living room travertine console.
- `photo-1592078615290-033ee584e267` — Bedroom white oak seating.
- `photo-1567538096630-e0c55bd6374c` — Dining monolithic block table.
- `photo-1507473885765-e6ed057f782c` — Estia lime plaster pendant light.
- `photo-1612196808214-b8e1d6145a8c` — Caelum unglazed stoneware vessel.
- `photo-1615529182904-14819c35db37` — Terracotta sculptural vase.
- `photo-1578749556568-bc2c40e68b61` — Hand-carved stone plinth.
- `logo.png` — Elysium primary logo mark.

---

## 11. CURRENT PROBLEMS & RISK AREAS (CODE AUDIT ONLY)

### A. Confirmed Architectural Traits
1. **Multiple Distinct Pinned Scrub Sections:** There are currently 5 pinned ScrollTrigger sections on the homepage (`Hero`, `Horizontal Suite`, `Materiality Lab`, `Craft Journey`, `Trust & Voice`). Each adds virtual scroll distance to the page height. Total virtual scroll distance is approximately `2000px (Hero) + 315vw (Horizontal) + 2200px (Materiality) + 1400px (Craft) + 1400px (Trust) = ~8,000px+`.
2. **Synchronous Dual-Source Codebase:** Page HTML templates live in `server.js` while modular TypeScript components live in `src/components/home/`. Changes made to one must be mirrored in the other to maintain 100% parity and 0 type errors.

### B. Possible Risks for Wave Animation Integration
1. **Cross-Section Pinned PinSpacing vs Continuous SVG Flow:** If an SVG path is intended to travel seamlessly across multiple pinned sections, standard DOM coordinates shift as preceding sections pin and unpin. A continuous path spanning across pinned sections must either:
   - Reside in a fixed full-viewport overlay whose coordinates are updated relative to global scroll progress, OR
   - Be split into section-anchored sub-paths that mathematically hand off at each boundary, OR
   - Span unpinned sections (like Wave Bend into Craft Journey) where DOM flow is continuous.
2. **SVG Aspect Ratio Scaling (`preserveAspectRatio="none"`):** The SVG currently uses `preserveAspectRatio="none"` with `viewBox="0 0 600 2800"`. On extremely wide monitors (ultrawide 21:9 or 4K), X-axis curves stretch wider than on mobile/portrait viewports.

### C. Items Requiring Visual / Browser Verification
1. **Lenis + ScrollTrigger Refresh Timing on Initial Load:** Frame 0 of Hero Canvas loads asynchronously; `ScrollTrigger.refresh()` is called after initial frame load to ensure pin positions match DOM heights.
2. **Mobile Viewport Height (`100vh` vs `100dvh`):** Mobile browser address bar collapse can cause slight height changes during scroll; CSS uses `viewport-fit=cover` and standard flex containers to prevent reflow.

---

## 12. RECOMMENDED ANIMATION INTEGRATION BOUNDARIES

- **Master GSAP Timeline / Scroller Owner:** `public/js/homeAnimations.js` (houses Lenis ticker sync, global resize listeners, and section initializers).
- **Hero Canvas Owner:** `public/js/heroCanvas.js` (operates direct ScrollTrigger -> Canvas pipeline without interfering with body DOM timelines).
- **SVG Wave Path Owner:** Section 3B (`#wave-bend-container` / `WaveBendSection.tsx`) with styling in `public/css/elysium.css` (`.wave-motion-path`, `.wave-stop-node`, `.wave-tracer`).
- **Interactive UI Handlers:** `public/js/main.js` (mobile drawer, split-curtain slider drag events, image blur-up crossfade, and contact form handling).
- **Zero-Conflict Rule:** No section animation should directly manipulate the root `body` or `html` transform property; all pinning and translation must remain scoped to section containers.

---

## 13. FINAL HOMEPAGE MACHINE-READABLE SUMMARY

```yaml
PAGE: Homepage
Framework: Node.js / Express (server.js) + Modular TSX (src/)
Rendering: Server-Rendered HTML (SSR)
Scrolling system: Lenis 1.3.26 (smoothWheel: true, duration: 1.15) bridged to GSAP Ticker
GSAP version: 3.15.0
ScrollTrigger version: 3.15.0
SplitType version: 0.3.4
Homepage route: GET /
Sections:
  - Header (Sticky)
  - Hero Canvas ("A Space in Motion", 181 frames, pinned 2000px)
  - Section 01: Atelier Manifesto (2-col, split text, 3D tilt card)
  - Section 02: Horizontal Atelier Expedition (4 chapters, pinned 300vw scrub)
  - Section 03: Tactile Materiality Lab (4 mediums, pinned 2200px scrub)
  - Section 3B: Spatial Wave Bend (Continuous 600x2800 Bezier curve, 5 stops, tracer)
  - Section 04: Craft Journey (4-step timeline, SVG scrub line, split-curtain slider, pinned 1400px)
  - Section 05: Curated Editorial Collection (6 product cards, stagger reveal)
  - Section 06: Trust & Voice (Word-by-word #57534e -> #ffffff reveal, rotating testimonial glass card, pinned 1400px)
  - Footer (Fullscreen 100vh interactive night/day showroom)
Master animation controller: public/js/homeAnimations.js
Hero canvas controller: public/js/heroCanvas.js
Interactive UI controller: public/js/main.js
Stylesheets: public/css/tailwind.min.css, public/css/elysium.css
Fonts: public/fonts/Geist-Medium.ttf, public/fonts/Geist-Light.ttf
Responsive Breakpoints: Mobile (<768px), Compact (<1024px), Desktop (>=1024px)
Critical Constraints: No React runtime bundler, No Tailwind CLI build, 0 TypeScript compile errors
```

---

## 14. COMPLETE RELEVANT FILE INVENTORY

| File Path | Role & Purpose |
|---|---|
| `d:/Elysium/server.js` | Express server serving HTML strings for all 8 routes and defining homepage template literals. |
| `d:/Elysium/public/js/homeAnimations.js` | Master GSAP & ScrollTrigger motion engine, Lenis bridge, section initializers, and waypoint logic. |
| `d:/Elysium/public/js/heroCanvas.js` | Dedicated 2D canvas image-sequence rendering engine for the 181-frame hero scrub. |
| `d:/Elysium/public/js/main.js` | Interactive UI event handlers (mobile drawer, split-curtain drag, image skeleton blur-up). |
| `d:/Elysium/public/js/vendor/gsap.min.js` | GSAP 3.15.0 core vendor library. |
| `d:/Elysium/public/js/vendor/ScrollTrigger.min.js` | GSAP ScrollTrigger 3.15.0 vendor plugin. |
| `d:/Elysium/public/js/vendor/lenis.min.js` | Lenis 1.3.26 smooth scrolling library. |
| `d:/Elysium/public/js/vendor/split-type.min.js` | SplitType 0.3.4 text splitting utility. |
| `d:/Elysium/public/css/elysium.css` | Custom design system, typography clamp scales, baroque frames, wave path styles, and night mode. |
| `d:/Elysium/public/css/tailwind.min.css` | Pre-built static Tailwind CSS utility bundle. |
| `d:/Elysium/public/fonts/Geist-Medium.ttf` | Local font for titles, headings, numerals, and badges. |
| `d:/Elysium/public/fonts/Geist-Light.ttf` | Local font for body text, descriptions, and captions. |
| `d:/Elysium/src/components/home/HeroCanvas.tsx` | TypeScript component definition for Hero Canvas section. |
| `d:/Elysium/src/components/home/ManifestoSection.tsx` | TypeScript component definition for Atelier Manifesto section. |
| `d:/Elysium/src/components/home/HorizontalGallery.tsx` | TypeScript component definition for Horizontal Atelier Gallery section. |
| `d:/Elysium/src/components/home/MaterialityInterlude.tsx` | TypeScript component definition for Materiality Lab section. |
| `d:/Elysium/src/components/home/WaveBendSection.tsx` | TypeScript component definition for Wave Bend & Motion Path section. |
| `d:/Elysium/src/components/home/CraftJourney.tsx` | TypeScript component definition for Craft Journey & Split-Wipe slider section. |
| `d:/Elysium/src/components/home/FeaturedPieces.tsx` | TypeScript component definition for Featured Pieces collection. |
| `d:/Elysium/src/components/home/TrustVoice.tsx` | TypeScript component definition for Trust & Voice word reveal and testimonial card. |
| `d:/Elysium/src/data/products.ts` | Product catalog, materials, craft steps, and category constants. |
| `d:/Elysium/src/data/brand.ts` | Brand information, address, contact details, and SEO metadata constants. |
| `d:/Elysium/package.json` | Package dependencies and NPM script definitions. |
| `d:/Elysium/tsconfig.json` | TypeScript compiler configuration (`moduleResolution: bundler`, `jsx: react-jsx`). |
