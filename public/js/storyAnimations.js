/**
 * ELYSIUM — "Our Story & Provenance" Interactive Motion Engine
 * Dynamic DOM-anchored SVG Journey Flight Path, Dual-Track Mask Reveal,
 * Traveling Tangent-Oriented Directional Node, Mission Word Reveal, and Interactive Atelier Carousel.
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Helper: Generate smooth rounded-corner SVG path data string
   * given a list of 2D points [{x, y}, ...] and maximum corner radius.
   */
  function buildRoundedPathString(points, radius = 44) {
    if (!points || points.length < 2) return '';
    if (points.length === 2) {
      return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)} L ${points[1].x.toFixed(1)} ${points[1].y.toFixed(1)}`;
    }

    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

    for (let i = 1; i < points.length - 1; i++) {
      const pPrev = points[i - 1];
      const pCurr = points[i];
      const pNext = points[i + 1];

      const vPrev = { x: pPrev.x - pCurr.x, y: pPrev.y - pCurr.y };
      const vNext = { x: pNext.x - pCurr.x, y: pNext.y - pCurr.y };

      const dPrev = Math.hypot(vPrev.x, vPrev.y);
      const dNext = Math.hypot(vNext.x, vNext.y);

      if (dPrev < 0.5 || dNext < 0.5) {
        d += ` L ${pCurr.x.toFixed(1)} ${pCurr.y.toFixed(1)}`;
        continue;
      }

      // Corner radius is capped by half of either connecting segment
      const cornerR = Math.min(radius, dPrev * 0.45, dNext * 0.45);

      const startX = pCurr.x + (vPrev.x / dPrev) * cornerR;
      const startY = pCurr.y + (vPrev.y / dPrev) * cornerR;

      const endX = pCurr.x + (vNext.x / dNext) * cornerR;
      const endY = pCurr.y + (vNext.y / dNext) * cornerR;

      d += ` L ${startX.toFixed(1)} ${startY.toFixed(1)}`;
      d += ` Q ${pCurr.x.toFixed(1)} ${pCurr.y.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`;
    }

    const last = points[points.length - 1];
    d += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;

    return d;
  }

  /**
   * 0. LENIS SMOOTH SCROLLER INTEGRATION
   */
  let lenisInstance = null;

  function initLenisSmoothScroll() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    if (typeof Lenis !== 'undefined') {
      try {
        lenisInstance = new Lenis({
          duration: 1.15,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          smoothTouch: false,
          wheelMultiplier: 1.0,
          touchMultiplier: 1.0,
          infinite: false,
        });

        // Sync Lenis scroll updates with ScrollTrigger
        lenisInstance.on('scroll', ScrollTrigger.update);

        // Drive Lenis via GSAP ticker
        gsap.ticker.add((time) => {
          if (lenisInstance) {
            lenisInstance.raf(time * 1000);
          }
        });

        gsap.ticker.lagSmoothing(500, 33);
        window.__elysiumLenis = lenisInstance;
      } catch (err) {
        console.warn('[Elysium Story] Lenis scroller fallback:', err);
      }
    }
  }

  /**
   * 1. Dynamic DOM-Anchored Journey Flight Path
   */
  let flightTimeline = null;
  let flightScrollTrigger = null;

  function buildDynamicFlightPath() {
    const journeyEl = document.getElementById('story-journey');
    const svgEl = document.getElementById('story-flight-svg');
    const basePathEl = document.getElementById('story-flight-base-path');
    const activePathEl = document.getElementById('story-flight-active-path');
    const maskPathEl = document.getElementById('story-flight-mask-path');
    const nodeEl = document.getElementById('story-flight-node');

    if (!journeyEl || !svgEl || !basePathEl || !activePathEl || !maskPathEl || !nodeEl) {
      return;
    }

    const cRect = journeyEl.getBoundingClientRect();
    const W = Math.max(320, Math.round(cRect.width));
    const H = Math.max(600, Math.round(cRect.height));

    svgEl.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svgEl.setAttribute('width', W);
    svgEl.setAttribute('height', H);

    function getRel(el) {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        top: Math.round(r.top - cRect.top),
        bottom: Math.round(r.bottom - cRect.top),
        left: Math.round(r.left - cRect.left),
        right: Math.round(r.right - cRect.left),
        centerX: Math.round((r.left + r.right) / 2 - cRect.left),
        centerY: Math.round((r.top + r.bottom) / 2 - cRect.top),
        width: Math.round(r.width),
        height: Math.round(r.height)
      };
    }

    const elWorkshop = document.getElementById('story-workshop-wrap');
    const elMission = document.getElementById('story-mission-section');
    const elMissionReveal = document.getElementById('story-mission-reveal');
    const elPrinciples = document.getElementById('story-principles-section');
    const elMethod = document.getElementById('story-method-section');
    const elMethodCard = document.getElementById('story-method-card');
    const elCarousel = document.getElementById('story-carousel-section');
    const elCtaBox = document.getElementById('story-cta-box');
    const elCtaBtn = document.getElementById('story-cta-btn');

    const rWorkshop = getRel(elWorkshop);
    const rMission = getRel(elMission);
    const rMissionReveal = getRel(elMissionReveal);
    const rPrinciples = getRel(elPrinciples);
    const rMethod = getRel(elMethod);
    const rMethodCard = getRel(elMethodCard);
    const rCarousel = getRel(elCarousel);
    const rCtaBox = getRel(elCtaBox);
    const rCtaBtn = getRel(elCtaBtn);

    let points = [];
    const isDesktop = W >= 768;

    if (isDesktop) {
      // 64px+ gutter padding from content boundaries
      const gl = Math.max(28, rWorkshop ? Math.max(24, rWorkshop.left - 64) : 40);
      const gr = Math.min(W - 28, rPrinciples ? Math.min(W - 24, rPrinciples.right + 64) : W - 40);
      const midX = Math.round(W / 2);

      // Calculate safe vertical channel midpoints between sections with guaranteed clearance
      const topY = rWorkshop ? Math.max(0, rWorkshop.top - 60) : 0;
      const yGap1 = (rMission && rPrinciples) ? Math.round((rMission.bottom + rPrinciples.top) / 2) : 650;
      const yGap2 = (rPrinciples && rMethod) ? Math.round((rPrinciples.bottom + rMethod.top) / 2) : 1150;
      const yGap3 = (rMethod && rCarousel) ? Math.round((rMethod.bottom + rCarousel.top) / 2) : 1650;
      const yGap4 = (rCarousel && rCtaBox) ? Math.round((rCarousel.bottom + rCtaBox.top) / 2) : 2100;
      
      // Stop path cleanly right on the top border of the CTA button
      const endY = rCtaBtn ? rCtaBtn.top : (rCtaBox ? rCtaBox.top + 20 : H - 50);

      points = [
        // 1. Start top center well above workshop image
        { x: midX, y: topY },
        // 2. Sweep smoothly into left gutter with clearance above workshop
        { x: gl, y: topY },
        // 3. Descend left gutter past workshop
        { x: gl, y: rWorkshop ? rWorkshop.top + 40 : 200 },
        // 4. Down left gutter past mission statement
        { x: gl, y: rMission ? rMission.centerY : 500 },
        // 5. Cross smoothly in open gap between Mission and Principles
        { x: gl, y: yGap1 },
        { x: gr, y: yGap1 },
        // 6. Down right gutter past Principles cards
        { x: gr, y: rPrinciples ? rPrinciples.centerY : 900 },
        // 7. Cross smoothly in open gap between Principles and Method
        { x: gr, y: yGap2 },
        { x: gl, y: yGap2 },
        // 8. Down left gutter past Method section
        { x: gl, y: rMethod ? rMethod.centerY : 1400 },
        // 9. Cross smoothly in open gap between Method and Carousel
        { x: gl, y: yGap3 },
        { x: gr, y: yGap3 },
        // 10. Down right gutter past Carousel
        { x: gr, y: rCarousel ? rCarousel.centerY : 1850 },
        // 11. Cross smoothly in open gap above CTA Box & land precisely on the top border of CTA button
        { x: gr, y: yGap4 },
        { x: rCtaBtn ? rCtaBtn.centerX : midX, y: yGap4 },
        { x: rCtaBtn ? rCtaBtn.centerX : midX, y: endY }
      ];
    } else {
      // Mobile / Tablet Fluid Navigation with generous side gutters
      const gl = Math.max(16, Math.round(W * 0.05));
      const midX = Math.round(W / 2);

      const topY = rWorkshop ? Math.max(0, rWorkshop.top - 40) : 0;
      const yGap1 = (rMission && rPrinciples) ? Math.round((rMission.bottom + rPrinciples.top) / 2) : 600;
      const yGap2 = (rPrinciples && rMethod) ? Math.round((rPrinciples.bottom + rMethod.top) / 2) : 1100;
      const yGap3 = (rMethod && rCarousel) ? Math.round((rMethod.bottom + rCarousel.top) / 2) : 1600;
      const yGap4 = (rCarousel && rCtaBox) ? Math.round((rCarousel.bottom + rCtaBox.top) / 2) : 2050;
      
      const endY = rCtaBtn ? rCtaBtn.top : (rCtaBox ? rCtaBox.top + 16 : H - 45);

      points = [
        { x: midX, y: topY },
        { x: gl, y: topY },
        { x: gl, y: rWorkshop ? rWorkshop.top + 30 : 200 },
        { x: gl, y: rMission ? rMission.centerY : 450 },
        { x: gl, y: yGap1 },
        { x: gl + 14, y: yGap1 + 10 },
        { x: gl + 14, y: rPrinciples ? rPrinciples.centerY : 850 },
        { x: gl + 14, y: yGap2 },
        { x: gl, y: yGap2 + 10 },
        { x: gl, y: rMethod ? rMethod.centerY : 1300 },
        { x: gl, y: yGap3 },
        { x: gl + 14, y: yGap3 + 10 },
        { x: gl + 14, y: rCarousel ? rCarousel.centerY : 1750 },
        { x: gl + 14, y: yGap4 },
        { x: rCtaBtn ? rCtaBtn.centerX : midX, y: yGap4 },
        { x: rCtaBtn ? rCtaBtn.centerX : midX, y: endY }
      ];
    }

    const pathData = buildRoundedPathString(points, isDesktop ? 90 : 45);
    basePathEl.setAttribute('d', pathData);
    activePathEl.setAttribute('d', pathData);
    maskPathEl.setAttribute('d', pathData);

    // Calculate total path length for mask reveal
    let totalLen = 3000;
    try {
      totalLen = basePathEl.getTotalLength() || 3000;
    } catch (e) {
      totalLen = 3000;
    }

    maskPathEl.style.strokeDasharray = `${totalLen} ${totalLen}`;
    maskPathEl.style.strokeDashoffset = `${totalLen}`;

    // Rebuild GSAP ScrollTrigger timeline
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    if (flightTimeline) flightTimeline.kill();
    if (flightScrollTrigger) flightScrollTrigger.kill();

    if (prefersReducedMotion) {
      maskPathEl.style.strokeDashoffset = '0';
      gsap.set(nodeEl, { opacity: 0 });
      return;
    }

    const startPt = basePathEl.getPointAtLength(0.1);
    const nextPt = basePathEl.getPointAtLength(Math.min(totalLen, 6));
    const initialAngle = Math.atan2(nextPt.y - startPt.y, nextPt.x - startPt.x) * (180 / Math.PI);

    gsap.set(nodeEl, {
      x: startPt.x,
      y: startPt.y,
      xPercent: -50,
      yPercent: -50,
      rotation: initialAngle,
      opacity: 1,
      scale: 1
    });

    flightTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: journeyEl,
        start: 'top 25%',
        end: 'bottom 88%',
        scrub: 0.5,
        onRefresh: () => {
          try {
            const curLen = basePathEl.getTotalLength();
            maskPathEl.style.strokeDasharray = `${curLen} ${curLen}`;
          } catch (e) {}
        },
        onUpdate: (self) => {
          const p = self.progress;
          const currentLen = Math.max(0.1, Math.min(totalLen - 0.1, p * totalLen));
          
          // Smoothed tangent lookahead/lookbehind
          const sampleDist = Math.max(3, Math.min(12, totalLen * 0.005));
          const pt1 = basePathEl.getPointAtLength(Math.max(0, currentLen - sampleDist));
          const pt2 = basePathEl.getPointAtLength(Math.min(totalLen, currentLen + sampleDist));
          const ptCenter = basePathEl.getPointAtLength(currentLen);
          
          const angle = Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x) * (180 / Math.PI);

          // Gracefully fade out & scale down arrow as it reaches the CTA button (Disappear before touching text)
          let nodeOpacity = 1;
          let nodeScale = 1;
          if (p > 0.88) {
            const fadeProgress = Math.min(1, (p - 0.88) / 0.09); // 0 at 0.88, 1 at 0.97
            nodeOpacity = Math.max(0, 1 - fadeProgress);
            nodeScale = Math.max(0, 1 - fadeProgress);
          }

          gsap.set(nodeEl, {
            x: ptCenter.x,
            y: ptCenter.y,
            xPercent: -50,
            yPercent: -50,
            rotation: angle,
            opacity: nodeOpacity,
            scale: nodeScale,
            overwrite: 'auto'
          });
        }
      }
    });

    // 1. Animate mask reveal in exact sync with scroll
    flightTimeline.fromTo(maskPathEl,
      { strokeDashoffset: totalLen },
      { strokeDashoffset: 0, ease: 'none' },
      0
    );
  }

  /**
   * 2. Mission Progressive Word Reveal
   */
  function initMissionReveal() {
    const revealTarget = document.getElementById('story-mission-reveal');
    if (!revealTarget || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    if (prefersReducedMotion) {
      revealTarget.style.color = '#111111';
      return;
    }

    const rawText = revealTarget.textContent.trim();
    const words = rawText.split(/\s+/);
    revealTarget.innerHTML = words
      .map(w => `<span class="story-word inline-block transition-colors duration-150" style="color: rgba(17,17,17,0.22);">${w}</span>`)
      .join(' ');

    const wordEls = revealTarget.querySelectorAll('.story-word');

    gsap.to(wordEls, {
      color: '#111111',
      stagger: {
        each: 0.035,
        from: 'start'
      },
      ease: 'none',
      scrollTrigger: {
        trigger: '#story-mission-section',
        start: 'top 75%',
        end: 'bottom 40%',
        scrub: 0.5
      }
    });
  }

  /**
   * 3. 5-Slide Interactive Atelier Carousel
   */
  function initStoryCarousel() {
    const container = document.getElementById('story-carousel-container');
    if (!container) return;

    const slides = [
      {
        title: 'Raw Earth Extraction',
        desc: 'Sourcing monolithic blocks of porous travertine directly from historical quarries with untouched sedimentary lines.',
        image: '/images/story/carousel_quarry.jpg',
        alt: 'Historical travertine quarry and geological stone strata'
      },
      {
        title: 'Manual Stone Masonry',
        desc: 'Traditional hammer and fine hand chiseling following organic faults, sculpting monolithic tables and sculptural plinths.',
        image: '/images/story/carousel_chiseling.jpg',
        alt: 'Artisan hand chiseling architectural travertine stone'
      },
      {
        title: 'Wheel-Thrown Stoneware',
        desc: 'Slow kickwheel stoneware vessels formed from raw riverbed silicate clay, unglazed to preserve earthy mineral tactility.',
        image: '/images/story/carousel_pottery.jpg',
        alt: 'Master ceramicist shaping raw stoneware vessel on pottery wheel'
      },
      {
        title: 'Hydraulic Lime Plaster',
        desc: 'Volcanic pumice and aged lime troweled in subtle stratified layers, diffusing incident lighting with soft velvet warmth.',
        image: '/images/story/carousel_plaster.jpg',
        alt: 'Artisan applying textured lime plaster wall relief'
      },
      {
        title: 'Tactile Hand Curing',
        desc: 'Hand-buffing with organic desert beeswax and cold-pressed linseed oil, sealing the wood and stone without synthetic plastic coatings.',
        image: '/images/story/carousel_curing.jpg',
        alt: 'Hand rubbing organic beeswax onto seasoned oak wood'
      }
    ];

    let currentIndex = 0;
    let autoplayTimer = null;
    let isHovered = false;

    const imgEl = document.getElementById('carousel-slide-img');
    const titleEl = document.getElementById('carousel-slide-title');
    const descEl = document.getElementById('carousel-slide-desc');
    const dots = Array.from(document.querySelectorAll('.story-carousel-dot'));
    const prevBtn = document.getElementById('story-carousel-prev');
    const nextBtn = document.getElementById('story-carousel-next');

    function renderSlide(newIndex, direction = 1) {
      if (newIndex < 0) newIndex = slides.length - 1;
      if (newIndex >= slides.length) newIndex = 0;
      currentIndex = newIndex;

      const slide = slides[currentIndex];

      // Update dot indicators
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('bg-[#111111]', 'scale-125');
          dot.classList.remove('bg-[#111111]/20');
          dot.setAttribute('aria-selected', 'true');
        } else {
          dot.classList.remove('bg-[#111111]', 'scale-125');
          dot.classList.add('bg-[#111111]/20');
          dot.setAttribute('aria-selected', 'false');
        }
      });

      // Animate transitions
      if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
        if (imgEl) {
          gsap.to(imgEl, {
            opacity: 0.3,
            scale: 1.03,
            duration: 0.2,
            ease: 'power2.in',
            onComplete: () => {
              imgEl.src = slide.image;
              imgEl.alt = slide.alt;
              gsap.to(imgEl, { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' });
            }
          });
        }

        gsap.timeline()
          .to([titleEl, descEl], {
            y: direction * -8,
            opacity: 0,
            duration: 0.15,
            ease: 'power2.in'
          })
          .call(() => {
            if (titleEl) titleEl.textContent = slide.title;
            if (descEl) descEl.textContent = slide.desc;
          })
          .fromTo([titleEl, descEl],
            { y: direction * 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3, stagger: 0.04, ease: 'power2.out' }
          );
      } else {
        if (imgEl) {
          imgEl.src = slide.image;
          imgEl.alt = slide.alt;
        }
        if (titleEl) titleEl.textContent = slide.title;
        if (descEl) descEl.textContent = slide.desc;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        renderSlide(currentIndex - 1, -1);
        resetAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        renderSlide(currentIndex + 1, 1);
        resetAutoplay();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        renderSlide(idx, idx > currentIndex ? 1 : -1);
        resetAutoplay();
      });
    });

    // Keyboard navigation
    container.setAttribute('tabindex', '0');
    container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        renderSlide(currentIndex - 1, -1);
        resetAutoplay();
      } else if (e.key === 'ArrowRight') {
        renderSlide(currentIndex + 1, 1);
        resetAutoplay();
      }
    });

    // Autoplay with hover pause
    function startAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
      autoplayTimer = setInterval(() => {
        if (!isHovered) {
          renderSlide(currentIndex + 1, 1);
        }
      }, 5000);
    }

    function resetAutoplay() {
      startAutoplay();
    }

    container.addEventListener('mouseenter', () => { isHovered = true; });
    container.addEventListener('mouseleave', () => { isHovered = false; });

    startAutoplay();
  }

  /**
   * 4. Parallax effect for images
   */
  function initParallax() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || prefersReducedMotion) return;

    const parallaxItems = gsap.utils.toArray('[data-parallax]');
    parallaxItems.forEach(item => {
      gsap.fromTo(item,
        { y: -15, scale: 1.04 },
        {
          y: 15,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8
          }
        }
      );
    });
  }

  /**
   * Orchestrate Initialization & Responsive Observers
   */
  let resizeTimeout = null;

  function handleResize() {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      buildDynamicFlightPath();
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 80);
  }

  function initAll() {
    initLenisSmoothScroll();
    buildDynamicFlightPath();
    initMissionReveal();
    initStoryCarousel();
    initParallax();

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }

    // Set up ResizeObserver on container to recalculate if dimensions shift
    const journeyEl = document.getElementById('story-journey');
    if (journeyEl && typeof ResizeObserver !== 'undefined') {
      let roTimeout = null;
      const ro = new ResizeObserver(() => {
        if (roTimeout) clearTimeout(roTimeout);
        roTimeout = setTimeout(() => {
          buildDynamicFlightPath();
        }, 100);
      });
      ro.observe(journeyEl);
    }
  }

  window.addEventListener('resize', handleResize);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      buildDynamicFlightPath();
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  }

  window.addEventListener('load', () => {
    buildDynamicFlightPath();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    setTimeout(initAll, 50);
  }
})();
