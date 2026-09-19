/**
 * ELYSIUM HOME DECOR - MODULAR GSAP, SCROLLTRIGGER & LENIS ANIMATION ENGINE
 * Production-ready animation engine for the 5 interactive homepage sections.
 */

(function () {
  'use strict';

  let lenisInstance = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function isMobileScreen() {
    return window.innerWidth < 768;
  }

  /**
   * 0. GSAP + SCROLLTRIGGER + LENIS INITIALIZATION & SYNC
   */
  function initLenisSmoothScroll() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[Elysium GSAP] GSAP or ScrollTrigger vendor bundle missing.');
      return;
    }

    // Always register ScrollTrigger once at the top
    gsap.registerPlugin(ScrollTrigger);

    if (typeof Lenis !== 'undefined') {
      try {
        lenisInstance = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1.0,
          touchMultiplier: 1.5,
        });

        // 1. Sync Lenis scroll with ScrollTrigger
        lenisInstance.on('scroll', () => {
          ScrollTrigger.update();
          if (typeof window.__elysiumUpdateHero === 'function') {
            window.__elysiumUpdateHero();
          }
        });

        // 2. Drive Lenis RAF loop via GSAP ticker
        gsap.ticker.add((time) => {
          if (lenisInstance) {
            lenisInstance.raf(time * 1000);
          }
        });

        gsap.ticker.lagSmoothing(0);
        window.__elysiumLenis = lenisInstance;
        console.log('[Elysium GSAP] Lenis smooth scroll active & synced with ScrollTrigger.');
      } catch (err) {
        console.warn('[Elysium GSAP] Lenis fallback notice:', err);
      }
    }
  }

  /**
   * SECTION 1 — BRAND STORY / PHILOSOPHY ANIMATION
   * - Eyebrow words fade in with stagger (0.06s delay)
   * - Poetic copy paragraphs staggered fade-up (opacity 0->1, y: 35->0, duration 1.1s, power3.out)
   * - Dual-image overlapping parallax scrub (foreground faster than background)
   */
  function initBrandStorySection() {
    const section = document.querySelector('.section-brand-story');
    if (!section || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // 1. Eyebrow words stagger
    const eyebrowWords = section.querySelectorAll('.eyebrow-word');
    if (eyebrowWords.length > 0) {
      gsap.fromTo(
        eyebrowWords,
        {
          opacity: 0,
          y: prefersReducedMotion ? 0 : 16,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            once: true,
            onEnter: () => console.log('[Elysium GSAP] Section 1: Eyebrow words triggered'),
          },
        }
      );
    }

    // 2. Poetic copy paragraphs fade-up (35px slide)
    const copyBlocks = section.querySelectorAll('.story-copy-block');
    if (copyBlocks.length > 0) {
      gsap.fromTo(
        copyBlocks,
        {
          opacity: 0,
          y: prefersReducedMotion ? 0 : 35,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            once: true,
            onEnter: () => console.log('[Elysium GSAP] Section 1: Copy blocks triggered'),
          },
        }
      );
    }

    // 3. Overlapping images parallax offset (foreground faster than background)
    const imagesWrap = section.querySelector('.story-images-wrap');
    const bgImg = section.querySelector('.story-bg-img');
    const fgImg = section.querySelector('.story-fg-img');

    if (imagesWrap && bgImg && fgImg && !prefersReducedMotion) {
      const isMobile = isMobileScreen();
      const bgOffset = isMobile ? -15 : -35;
      const fgOffset = isMobile ? -30 : -75;

      gsap.to(bgImg, {
        y: bgOffset,
        ease: 'none',
        scrollTrigger: {
          trigger: imagesWrap,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      });

      gsap.to(fgImg, {
        y: fgOffset,
        ease: 'none',
        scrollTrigger: {
          trigger: imagesWrap,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
      console.log('[Elysium GSAP] Section 1: Dual-image parallax scrub initialized.');
    }
  }

  /**
   * SECTION 2 — COLLECTIONS SHOWCASE (THE CHAPTER FEATURE)
   * - 4-6 Ambient floating thumbnail images bobbing gently & continuously
   * - Mask-based category name slide-up reveal (from behind overflow-hidden container)
   * - Descriptive copy & explore button fade-up
   */
  function initCollectionsShowcaseSection() {
    const showcaseSection = document.querySelector('.section-collections-showcase');
    if (!showcaseSection || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const chapters = showcaseSection.querySelectorAll('.collection-chapter');

    chapters.forEach((chapter, index) => {
      const chapterId = chapter.id || `chapter-${index + 1}`;

      // 1. Ambient Floating Decorative Thumbnails (Continuous Gentle Drift)
      const ambientThumbs = chapter.querySelectorAll('.ambient-thumb');
      ambientThumbs.forEach((thumb, thumbIdx) => {
        if (prefersReducedMotion) return;

        const floatDuration = 3.6 + (thumbIdx % 3) * 1.2;
        const yDrift = 12 + (thumbIdx % 4) * 4;
        const xDrift = ((thumbIdx % 2 === 0 ? 1 : -1) * (6 + thumbIdx * 2));
        const rotDrift = ((thumbIdx % 2 === 0 ? 1 : -1) * (3 + thumbIdx));

        gsap.to(thumb, {
          y: `+=${yDrift}`,
          x: `+=${xDrift}`,
          rotation: rotDrift,
          duration: floatDuration,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: thumbIdx * 0.2 + (index % 2) * 0.1,
        });
      });

      // 2. Category Name Mask Reveal (Slide up from overflow-hidden container)
      const titleInner = chapter.querySelector('.chapter-title-inner');
      if (titleInner) {
        gsap.fromTo(
          titleInner,
          {
            yPercent: prefersReducedMotion ? 0 : 100,
            opacity: prefersReducedMotion ? 0 : 1,
          },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: chapter,
              start: 'top 75%',
              once: true,
              onEnter: () => console.log(`[Elysium GSAP] Section 2: Mask reveal triggered for ${chapterId}`),
            },
          }
        );
      }

      // 3. Category descriptive copy & explore button fade-up
      const detailElements = chapter.querySelectorAll('.chapter-detail-elem');
      if (detailElements.length > 0) {
        gsap.fromTo(
          detailElements,
          {
            opacity: 0,
            y: prefersReducedMotion ? 0 : 35,
          },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: chapter,
              start: 'top 72%',
              once: true,
            },
          }
        );
      }

      // 4. Category image fade-up on scroll
      const imageCol = chapter.querySelector('.chapter-pinned-col');
      if (imageCol) {
        gsap.fromTo(
          imageCol,
          {
            opacity: 0,
            y: prefersReducedMotion ? 0 : 35,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: chapter,
              start: 'top 78%',
              once: true,
            },
          }
        );
      }
    });

    console.log(`[Elysium GSAP] Section 2: ${chapters.length} collection chapters initialized.`);
  }

  /**
   * SECTION 3 — CRAFTSMANSHIP / WHY US ANIMATION
   * - 4-Column trust grid with staggered fade-up (0.15s stagger, y: 35->0, duration 1.1s)
   * - Animated number counter for statistics (500+, 10+, 4500, 100%)
   */
  function initCraftsmanshipSection() {
    const section = document.querySelector('.section-craftsmanship');
    if (!section || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // 1. Staggered Column Entry
    const columns = section.querySelectorAll('.craft-trust-col');
    if (columns.length > 0) {
      gsap.fromTo(
        columns,
        {
          opacity: 0,
          y: prefersReducedMotion ? 0 : 35,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            once: true,
            onEnter: () => console.log('[Elysium GSAP] Section 3: Trust pillars entered'),
          },
        }
      );
    }

    // 2. Stat Number Counter Animation (Count up from 0)
    const statCounters = section.querySelectorAll('.stat-number-counter');
    statCounters.forEach((stat) => {
      const targetVal = parseInt(stat.getAttribute('data-target'), 10) || 0;
      const counterObj = { val: 0 };

      ScrollTrigger.create({
        trigger: stat,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          console.log(`[Elysium GSAP] Section 3: Stat counter counting to ${targetVal}`);
          if (prefersReducedMotion) {
            stat.innerText = targetVal.toLocaleString();
            return;
          }

          gsap.to(counterObj, {
            val: targetVal,
            duration: 2.2,
            ease: 'power2.out',
            onUpdate: () => {
              stat.innerText = Math.round(counterObj.val).toLocaleString();
            },
          });
        },
      });
    });

    console.log(`[Elysium GSAP] Section 3: Craftsmanship pillars (${columns.length}) and stat counters (${statCounters.length}) initialized.`);
  }

  /**
   * SECTION 4 — FEATURED PRODUCTS GRID ANIMATION
   * - Cards fade + slide up on scroll entry with light stagger (0.12s stagger, y: 35->0, duration 1.1s)
   * - Smooth hover zoom (scale 1 -> 1.06, 0.5s) in overflow-hidden container
   */
  function initFeaturedProductsSection() {
    const section = document.querySelector('.section-featured-products');
    if (!section || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const cards = section.querySelectorAll('.product-grid-card');
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: prefersReducedMotion ? 0 : 35,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 1.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            once: true,
            onEnter: () => console.log(`[Elysium GSAP] Section 4: ${cards.length} product cards revealed`),
          },
        }
      );
    }

    console.log(`[Elysium GSAP] Section 4: ${cards.length} featured product cards initialized.`);
  }

  /**
   * SECTION 5 — CTA / GET IN TOUCH STRIP ANIMATION
   * - Background subtle parallax shift on scroll
   * - Content fade + slide up on entry (opacity 0->1, y: 35->0, duration 1.1s)
   * - Buttons smooth hover wipe transitions
   */
  function initCtaStripSection() {
    const section = document.querySelector('.section-cta-strip');
    if (!section || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Background parallax shift
    const bgParallax = section.querySelector('.cta-bg-parallax');
    if (bgParallax && !prefersReducedMotion) {
      gsap.to(bgParallax, {
        y: isMobileScreen() ? '8%' : '15%',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
    }

    // Content fade up
    const ctaElements = section.querySelectorAll('.cta-fade-elem');
    if (ctaElements.length > 0) {
      gsap.fromTo(
        ctaElements,
        {
          opacity: 0,
          y: prefersReducedMotion ? 0 : 35,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.14,
          duration: 1.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            once: true,
            onEnter: () => console.log('[Elysium GSAP] Section 5: CTA strip revealed'),
          },
        }
      );
    }

    console.log('[Elysium GSAP] Section 5: CTA strip initialized.');
  }

  /**
   * 6. UNIVERSAL SUBPAGE ANIMATIONS
   */
  function initSubpageAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const subpageCards = document.querySelectorAll(
      '.product-card:not(.product-grid-card), .material-card, .baroque-box-frame'
    );

    if (subpageCards.length > 0) {
      gsap.fromTo(
        subpageCards,
        {
          opacity: 0,
          y: prefersReducedMotion ? 0 : 30,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: subpageCards[0],
            start: 'top 85%',
            once: true,
          },
        }
      );
    }
  }

  /**
   * 7. SCROLLTRIGGER RESIZE & ORIENTATION REFRESH HANDLER
   */
  function initScrollTriggerRefreshHandler() {
    let resizeDebounce = null;
    window.addEventListener(
      'resize',
      () => {
        if (resizeDebounce) clearTimeout(resizeDebounce);
        resizeDebounce = setTimeout(() => {
          if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
          }
        }, 150);
      },
      { passive: true }
    );
  }

  /**
   * MASTER INITIALIZER
   */
  function initAllAnimations() {
    // 1. Initialize Lenis smooth scroller
    initLenisSmoothScroll();

    // 2. Initialize all 5 sections
    initBrandStorySection();
    initCollectionsShowcaseSection();
    initCraftsmanshipSection();
    initFeaturedProductsSection();
    initCtaStripSection();
    initSubpageAnimations();
    initScrollTriggerRefreshHandler();

    // 3. Progressive ScrollTrigger refreshes to account for late font/image loading
    if (typeof document.fonts !== 'undefined' && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      });
    }

    window.addEventListener('load', () => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
        console.log('[Elysium GSAP] Window load complete — ScrollTrigger coordinates refreshed.');
      }
    });

    setTimeout(() => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 300);

    setTimeout(() => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllAnimations);
  } else {
    setTimeout(initAllAnimations, 50);
  }
})();
