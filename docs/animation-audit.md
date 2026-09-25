# Elysium Website — Full-Site Animation & Scroll Architecture Audit

**Date:** September 2026  
**Auditor:** Antigravity AI  
**Scope:** Full-site audit of all animation drivers, smooth-scroll instances, GSAP timelines, ScrollTrigger pin calculations, requestAnimationFrame loops, Observers, and CSS positioning.

---

## 1. Full-Site Animation & Scroll Inventory Table

| Component / Feature | File Location | What It Does | Pins Content? | Drives Own Animation Loop? | Depends on Doc Height / Other Sections? |
|---|---|---|---|---|---|
| **Lenis Smooth Scroller** | `public/js/homeAnimations.js:29-70` | Intercepts wheel/touch gestures, interpolates virtual scroll position (`lerp: 0.08`), syncs with ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)`), exposed as `window.__elysiumLenis`. | **No** | **Driven by GSAP Ticker** (`gsap.ticker.add((time) => lenis.raf(time * 1000))`) | **Yes** — Measures `scrollHeight - height` of document root. |
| **Hero Canvas Frame Scrubber** | `public/js/heroCanvas.js:26-320` | Preloads 181 frames of 3D interior sequence, renders frame corresponding to scroll progress, updates story overlay text and percentage counter. | **Yes** (`pin: true`, `start: 'top top'`, `end: '+=2000'`) | **No** — Event-driven via `ScrollTrigger.create.onUpdate`. | **Yes** — Anchored at `top top` of hero. Adds 2,000px scroll pin distance to the document before Section 2. |
| **Section 2: Lusion Showreel & WebGL Ribbon** | `public/js/homeAnimations.js:88-644` | Desktop: Pins stage, animates intro text exit, draws SVG ribbon path, reveals play pill, handles video modal. Renders WebGL ribbon mesh. Mobile: Scaled pin (`+=1600`) or static fallback. | **Yes** (`pin: stage`, `end: '+=2400'` desktop, `end: '+=1600'` mobile) | **Yes (via GSAP Ticker)** — `gsap.ticker.add(tickerCallback)` renders WebGL canvas. | **Yes** — Starts at `top top` of `#section-lusion-reel` (which starts at 2,000px hero pin offset). Adds 2,400px (desktop) or 1,600px (mobile) pin distance. |
| **Section 3: Spatial Sanctuary 100vh Stacking Cards** | `public/js/homeAnimations.js:650-765` | Monolithic 4-card stack cascading into 3D ladder perspective. Cards translate up from 120% and settle with calculated upward top offsets, scaling, and darkening shades. | **Yes** (`pin: stage`, `pinSpacing: true`, `end: '+=' + (cards - 1) * 750`, ~2,250px) | **No** — Scrubbed directly by ScrollTrigger (`scrub: 0.6`). | **Yes** — Starts at `top top` of Section 3. Adds ~2,250px pin distance to the total page scroll height. |
| **Section 4: Marquee Along SVG Path** | `public/js/homeAnimations.js:777-1075` | 48 thumbnail images drift along an S-curve path via precomputed 2,000-point Look-Up Table (LUT). Responds to mouse hover, pointer drag with inertia, and scroll velocity. | **No** (`pin: false`) | **YES (COMPETING rAF LOOP)** — Calls `requestAnimationFrame(animate)` independently on lines 955, 967, 1023, 1030 instead of `gsap.ticker`. | **Yes** — Reads `window.__elysiumLenis.velocity` and DOM `pageYOffset`. Flow height depends on wrapper aspect ratio. |
| **Section 5: Curated Editorial Collection** | `public/js/homeAnimations.js:1080-1104` | Staggered entrance animation (`opacity: 0 -> 1, y: 35 -> 0`) for `.featured-piece-card` elements when grid enters viewport (`start: 'top 82%'`). | **No** | **No** — One-shot GSAP tween. | **Yes** — Trigger point depends on total accumulated pin push from Sections 1, 2, and 3. |
| **Section 6: Trust & Voice Horizontal Stream** | `public/js/homeAnimations.js:1111-1186` | Horizontal typography stream pinned to viewport (`start: 'clamp(top top)'`, `end: '+=1600px'`, `scrub: 0.8`), with individual letter tumble via `containerAnimation`. | **Yes** (`pin: true`, adds 1,600px) | **No** — Scrubbed directly by ScrollTrigger. | **Yes** — Pinned at `clamp(top top)`. Adds 1,600px to page scroll distance. |
| **Section 6B: Testimonial Card & Rotating Mandala** | `public/js/homeAnimations.js:1194-1508` | Broken baroque stone assembly entrance (`start: 'top 85%'`, `once: true`), ambient continuous mandala rotation (`gsap.to repeat: -1`), and automated 7s testimonial crossfade. | **No** | **No** (Mandala uses GSAP infinite tween; auto-advance uses `setInterval`). | **Yes** — Trigger point is relative to Section 6. |
| **Footer: Pendant Lamp & WebGL Light Rays** | `public/js/footerLightRays.js:28-392` | WebGL shader simulating warm amber conical light rays radiating from hanging pendant lamp bulb. Adjusts to cursor position and intensity toggle. | **No** | **YES (COMPETING rAF LOOP)** — Calls `requestAnimationFrame(loop)` on lines 355, 376. Pauses via `IntersectionObserver` when offscreen. | **No** — Located in footer at absolute bottom of page. |
| **Click Spark Canvas Engine** | `public/js/clickSpark.js:1-155` | Fullscreen overlay canvas spawning golden spark particles on user mouse click. | **No** | **Transient rAF** — Only runs for ~30 frames after mouse click, then cancels. | **No** — Fixed viewport canvas. |
| **Site Header** | `server.js:392`, `public/css/elysium.css:448-456` | Top navigation bar with logo, nav links, and contact CTA. | **No** (`position: fixed !important; top: 0;`) | **No** | **No** — Fixed overlay. |
| **Subpage Product / Material Entrances** | `public/js/homeAnimations.js:1511-1534` | Batch reveals `.product-card`, `.material-card`, `.baroque-box-frame` at `top 88%` with `once: true`. | **No** | **No** | **Yes** — Starts per card element. |
| **Rotating Seal Badge Hovers** | `public/js/homeAnimations.js:1539-1557` | Micro-scale tween on mouseenter/mouseleave (`scale: 1.08`). | **No** | **No** | **No** |

---

## 2. Deep-Dive Architectural Verifications

### 2.1 Uncoordinated Animation Drivers & Dual Loops
- **Lenis vs GSAP Ticker:** Lenis is properly stepped by `gsap.ticker.add((time) => lenis.raf(time * 1000))` and `gsap.ticker.lagSmoothing(0)` in `initLenisSmoothScroll()`.
- **Systemic Defect Found (Section 4 Marquee):** `initMarqueePathSection()` runs its own raw `requestAnimationFrame(animate)` loop (lines 955, 967, 1023, 1030). Because `animate()` runs on browser vsync independent of GSAP's ticker, frame delta calculations (`dt = Math.min(currentTime - lastTime, 40) * 0.001`) drift out of phase with GSAP's ticker and Lenis's scroll interpolations, causing visible micro-stutter and frame judder.
- **Secondary Loop (Footer Light Rays):** `footerLightRays.js` runs a separate `requestAnimationFrame(loop)` (lines 355, 376). While it correctly stops when offscreen via `IntersectionObserver`, when the user reaches the footer, it competes with GSAP ticker for GPU/CPU cycles.

### 2.2 Stale ScrollTriggers & Leftover Craft Journey Artifacts
- **ScrollTriggers on Section 4 Replacement:** When Section 4 was switched from the old pinned "Craft Journey & Split Curtain" timeline to the new Marquee Along SVG Path component, `initMarqueePathSection()` did **not** invoke `ScrollTrigger.getAll().forEach(...)` or kill any triggers. While the old HTML was replaced in `server.js`, any cached or stale ScrollTrigger instances on the DOM element or window were not formally swept.
- **Leftover CSS Artifacts:** In `public/css/elysium.css`, substantial dead code from the replaced craft section remains:
  - Lines 509–513: `.split-curtain-viewport { aspect-ratio: 4 / 3; }`
  - Lines 2211: `#craft-scrub-line` in reduced motion media query.
  - Lines 3174–3286: `SECTION 3B+4: UNIFIED PROCESS TRACE` (`.section-process-trace`, `.process-trace-svg-wrapper`, `.process-under-track`, `.process-trace-path`, `.process-node`, `.process-stage-item`, `.process-showcase-frame`, `.process-trace-inner`).
  These classes are obsolete and clutter style evaluation.

### 2.3 ScrollTrigger Measurement Invalidation & Refresh Race Conditions
- **Stale Initial Measurements:**
  - `homeAnimations.js:1632` initializes animations on `DOMContentLoaded`. At this point, external web fonts and images are still downloading and rendering.
  - `ScrollTrigger.refresh()` is called at `document.fonts.ready`, `window.addEventListener('load')`, and `setTimeout(..., 300)` / `setTimeout(..., 1000)`.
  - **The Flaw:** In `main.js`, `initImageBlurUpLoaders()` handles asynchronous image loading for `.image-blur-up` across all cards, but never triggers a `ScrollTrigger.refresh()`. In `heroCanvas.js`, only frame 0 triggers a refresh, while the subsequent batch of frames streams asynchronously. When images or dynamic contents shift natural section heights (especially around Section 3 cards and Section 5 collection grid), ScrollTrigger's pin start/end markers (`+=2000`, `+=2400`, `+=2250`) fall out of alignment with the actual physical DOM.

### 2.4 Section 4 Marquee Velocity Reading & Lenis Fallback Glitch
- **Velocity Unit Mismatch:**
  In `homeAnimations.js:981-989`:
  ```javascript
  const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
  let rawScrollVelocity = 0;
  if (window.__elysiumLenis && typeof window.__elysiumLenis.velocity === 'number') {
    rawScrollVelocity = window.__elysiumLenis.velocity * 50;
  } else if (dt > 0) {
    rawScrollVelocity = (currentScrollY - lastScrollY) / dt;
  }
  lastScrollY = currentScrollY;
  ```
  - In Lenis v1.3 (`lenis.min.js`), `lenis.velocity` is computed on each frame step as:
    `this.velocity = e - this.animatedScroll` (scroll distance delta in pixels per frame, e.g. 5–20px).
    Multiplying by 50 scales it to 250–1000.
  - In the fallback branch, `(currentScrollY - lastScrollY) / dt` divides by `dt` (e.g. 0.016s), giving velocity in **pixels per second** (e.g. 1500–4000 px/s).
  - This 3x–5x discrepancy means if `window.__elysiumLenis` is ever unready or if `velocity === 0` on first touch, the fallback produces an explosive velocity surge.
  - Furthermore, in lines 998–1005:
    ```javascript
    if (scrollAwareDirection && !isDragging) {
      if (velocityFactor < 0) {
        directionFactor = -1;
      } else if (velocityFactor > 0) {
        directionFactor = 1;
      }
    }
    moveBy += directionFactor * moveBy * velocityFactor;
    ```
    Notice that `moveBy` already contains `directionFactor` (`directionFactor * baseVelocity * dt * hoverFactor`). Multiplying again by `directionFactor` inside line 1005 creates a double-negative sign flip bug during reverse scroll!

### 2.5 Duplicate & Overlapping Resize Recalculations
- Five independent resize listeners exist across the scripts:
  1. `heroCanvas.js:307`: `window.addEventListener('resize', resizeCanvas)` — runs heavy pixel ratio and canvas buffer resizes immediately.
  2. `homeAnimations.js:609`: `window.addEventListener('resize', ...)` — resizes Section 2 WebGL viewport.
  3. `homeAnimations.js:1063 & 1070`: Both a `ResizeObserver` AND `window.addEventListener('resize', updateScale)` are registered on Section 4 marquee, causing duplicate layout calculations on every viewport resize.
  4. `homeAnimations.js:1564`: Debounced (150ms) resize listener triggering `ScrollTrigger.refresh()` and `initButtonHoverAnimations()`.
  5. `footerLightRays.js:364`: `ResizeObserver` on footer container and lamp button.

---

## 3. Recommended Remediation Plan (Phase 1)
1. **Unify Drivers into GSAP Ticker:** Migrate Section 4's `animate()` loop from raw `requestAnimationFrame` to `gsap.ticker.add(marqueeTicker)`. Remove all raw rAF calls in Section 4. Ensure ticker is paused when Section 4 is off-screen via `IntersectionObserver`.
2. **Standardize Scroll Velocity:** Exclusively read `window.__elysiumLenis.velocity`, normalize with a calibrated scalar, and fix the double-negative sign flip in `moveBy`.
3. **Clean Up Obsolete Code:** Remove leftover craft-journey and process-trace styles from `public/css/elysium.css`.
4. **Coordinate Resize & Image Load Refreshes:** Deduplicate the Section 4 resize listener (use only ResizeObserver), and trigger `ScrollTrigger.refresh()` when critical images finish loading.
