/**
 * ELYSIUM HOME DECOR — MASTER GSAP & SCROLLTRIGGER MOTION ENGINE
 * Groundbreaking animations inspired by Palmo and Zainab Kabira.
 * Precision-calibrated for performance, aesthetics, and seamless Lenis scroller integration.
 */

(function () {
  'use strict';

  let lenisInstance = null;

  // Accessibility & reduced motion check
  const systemPrefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const prefersReducedMotion = systemPrefersReducedMotion && !window.location.search.includes('motion=true');

  console.log(`[Elysium Motion] prefers-reduced-motion: ${prefersReducedMotion}`);

  function isMobileScreen() {
    return window.innerWidth < 768;
  }

  /**
   * 0. LENIS SMOOTH SCROLLER & GSAP TICKER BRIDGING
   */
  function initLenisSmoothScroll() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[Elysium GSAP] GSAP or ScrollTrigger vendor bundle missing.');
      return;
    }

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

        // Sync Lenis scroll updates with ScrollTrigger & Hero canvas
        lenisInstance.on('scroll', () => {
          ScrollTrigger.update();
          if (typeof window.__elysiumUpdateHero === 'function') {
            window.__elysiumUpdateHero();
          }
        });

        // Drive Lenis via GSAP ticker
        gsap.ticker.add((time) => {
          if (lenisInstance) {
            lenisInstance.raf(time * 1000);
          }
        });

        gsap.ticker.lagSmoothing(0);
        window.__elysiumLenis = lenisInstance;
        console.log('[Elysium GSAP] Lenis smooth scroll initialized & bridged to GSAP ticker.');
      } catch (err) {
        console.warn('[Elysium GSAP] Lenis scroller fallback:', err);
      }
    }
  }

  /**
   * 1. SECTION 1 — THE MANIFESTO & 3D INTERACTIVE TILT SCULPTURE
   * Split words reveal, clip-path mask wipe, and 3D card tilt with dynamic specular glare.
   */
  function initManifestoSection() {
    const section = document.querySelector('.section-manifesto');
    if (!section || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const mask = section.querySelector('.manifesto-portrait-mask');
    const words = section.querySelectorAll('.manifesto-word');
    const para1 = section.querySelector('.manifesto-para-1');
    const para2 = section.querySelector('.manifesto-para-2');
    const signature = section.querySelector('.manifesto-signature');
    const links = section.querySelectorAll('.manifesto-link');
    const eyebrow = section.querySelector('.manifesto-eyebrow');
    const divider = section.querySelector('.manifesto-divider');
    const tiltCard = document.getElementById('manifesto-tilt-card');

    if (prefersReducedMotion) {
      if (mask) mask.style.clipPath = 'inset(0 0 0 0)';
      return;
    }

    // 1. Portrait Clip-Path Wipe (1.3s, power4.inOut)
    if (mask) {
      gsap.fromTo(
        mask,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.3,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: section.querySelector('.manifesto-portrait-wrap') || section,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // 2. Master Text Timeline
    const textTl = gsap.timeline({
      scrollTrigger: {
        trigger: section.querySelector('.manifesto-heading') || section,
        start: 'top 78%',
        toggleActions: 'play none none none',
      },
    });

    if (eyebrow) {
      gsap.set(eyebrow, { opacity: 0, y: 15 });
      textTl.to(eyebrow, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
    }

    if (words.length > 0) {
      gsap.set(words, { opacity: 0, y: 24 });
      textTl.to(
        words,
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.3'
      );
    }

    if (divider) {
      gsap.set(divider, { scaleX: 0, transformOrigin: 'left center' });
      textTl.to(divider, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4');
    }

    if (para1) {
      gsap.set(para1, { opacity: 0, y: 25 });
      textTl.to(para1, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }, '-=0.2');
    }

    if (para2) {
      gsap.set(para2, { opacity: 0, y: 25 });
      textTl.to(para2, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }, '-=0.65');
    }

    if (signature) {
      gsap.set(signature, { opacity: 0, y: 20 });
      textTl.to(signature, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4');
    }

    if (links.length > 0) {
      gsap.set(links, { opacity: 0, y: 15 });
      textTl.to(links, { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out' }, '-=0.2');
    }

    // 3. Interactive 3D Perspective Tilt Card with Specular Glare
    if (tiltCard && !isMobileScreen()) {
      const cardWrap = tiltCard.querySelector('.manifesto-portrait-wrap');
      const glare = tiltCard.querySelector('.tilt-glare');

      tiltCard.addEventListener('mousemove', (e) => {
        const rect = tiltCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
        const rotateY = ((x - centerX) / centerX) * 10;

        if (cardWrap) {
          gsap.to(cardWrap, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1200,
            duration: 0.35,
            ease: 'power2.out',
          });
        }

        if (glare) {
          const glareX = (x / rect.width) * 100;
          const glareY = (y / rect.height) * 100;
          glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%)`;
          glare.style.opacity = '1';
        }
      });

      tiltCard.addEventListener('mouseleave', () => {
        if (cardWrap) {
          gsap.to(cardWrap, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.6,
            ease: 'power3.out',
          });
        }
        if (glare) {
          glare.style.opacity = '0';
        }
      });
    }

    console.log('[Elysium Motion] Section 1 (The Manifesto) initialized.');
  }

  /**
   * 3. SECTION 2 — THE PINNED HORIZONTAL ATELIER EXPEDITION
   * Palmo & Zainab Kabira inspired horizontal gallery scrub.
   */
  function initHorizontalGallerySection() {
    const section = document.getElementById('horizontal-suite-container');
    if (!section || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const track = document.getElementById('horizontal-track');
    const panels = section.querySelectorAll('.horizontal-slide-panel');
    const progressFill = document.getElementById('horizontal-progress-fill');
    const chapterIndicator = document.getElementById('horizontal-active-indicator');

    if (!track || panels.length === 0) return;

    if (isMobileScreen() || prefersReducedMotion) {
      // Mobile fallback: horizontal scrollable or stack
      track.style.transform = 'none';
      if (progressFill) progressFill.style.width = '100%';
      return;
    }

    const totalPanels = panels.length;
    const scrollDistance = (totalPanels - 1) * window.innerWidth;

    // Horizontal Scrub Master ScrollTrigger with exact scroll width calculation
    gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${(totalPanels - 1) * window.innerWidth * 1.15}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Update live progress fill bar
          if (progressFill) {
            const pct = Math.max(25, self.progress * 100);
            progressFill.style.width = `${pct}%`;
          }

          // Update chapter indicator
          if (chapterIndicator) {
            const currentIdx = Math.min(
              Math.floor(self.progress * totalPanels) + 1,
              totalPanels
            );
            chapterIndicator.innerText = `CHAPTER 0${currentIdx} OF 0${totalPanels}`;
          }
        },
      },
    });

    console.log(`[Elysium Motion] Section 2 (Horizontal Expedition) initialized with ${totalPanels} panels.`);
  }

  /**
   * 4. SECTION 3 — THE TACTILE MATERIALITY LAB & SUNDIAL GAUGE
   * Pinned scrubbed crossfade through 4 raw earth mediums.
   */
  function initMaterialityInterludeSection() {
    const section = document.querySelector('.section-materiality-interlude');
    if (!section || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const slides = [
      section.querySelector('.mat-slide-0'),
      section.querySelector('.mat-slide-1'),
      section.querySelector('.mat-slide-2'),
      section.querySelector('.mat-slide-3'),
    ];
    const images = section.querySelectorAll('.mat-img');
    const labels = [
      section.querySelector('.mat-label-0'),
      section.querySelector('.mat-label-1'),
      section.querySelector('.mat-label-2'),
      section.querySelector('.mat-label-3'),
    ];
    const pointer = document.getElementById('sundial-pointer');
    const angleText = document.getElementById('sundial-angle-text');

    if (!slides[0] || !labels[0]) return;

    if (isMobileScreen() || prefersReducedMotion) {
      slides.forEach((s, i) => { if (s && i > 0) s.style.opacity = '1'; });
      labels.forEach((l) => { if (l) l.style.opacity = '1'; });
      return;
    }

    const pinContainer = section.querySelector('.materiality-pinned');
    const scrollDistance = 4 * 450; // 1800px scrub distance

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${scrollDistance}`,
        scrub: 1,
        pin: pinContainer,
        anticipatePin: 1,
      },
    });

    // Initial state: first material active
    gsap.set(labels[0], { opacity: 1, y: 0 });
    gsap.set(slides[0], { opacity: 1 });

    // Slice 1: Material 0 -> 1 (Travertine -> Clay)
    masterTl
      .to(images[0], { scale: 1.12, ease: 'none', duration: 1.0 }, 0)
      .to(labels[0], { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in' }, 0.7)
      .to(slides[0], { opacity: 0, duration: 0.4, ease: 'power2.inOut' }, 0.75)
      .to(slides[1], { opacity: 1, duration: 0.4, ease: 'power2.inOut' }, 0.75)
      .fromTo(labels[1], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 0.8)

      // Slice 2: Material 1 -> 2 (Clay -> Oak)
      .to(images[1], { scale: 1.12, ease: 'none', duration: 1.0 }, 1.0)
      .to(labels[1], { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in' }, 1.7)
      .to(slides[1], { opacity: 0, duration: 0.4, ease: 'power2.inOut' }, 1.75)
      .to(slides[2], { opacity: 1, duration: 0.4, ease: 'power2.inOut' }, 1.75)
      .fromTo(labels[2], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 1.8)

      // Slice 3: Material 2 -> 3 (Oak -> Plaster)
      .to(images[2], { scale: 1.12, ease: 'none', duration: 1.0 }, 2.0)
      .to(labels[2], { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in' }, 2.7)
      .to(slides[2], { opacity: 0, duration: 0.4, ease: 'power2.inOut' }, 2.75)
      .to(slides[3], { opacity: 1, duration: 0.4, ease: 'power2.inOut' }, 2.75)
      .fromTo(labels[3], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 2.8)

      // Slice 4: Material 3 final scale
      .to(images[3], { scale: 1.12, ease: 'none', duration: 1.0 }, 3.0);

    console.log('[Elysium Motion] Section 3 (Materiality Lab) initialized.');
  }

  /**
   * 5. SECTION 4 — THE CRAFT JOURNEY & INTERACTIVE BEFORE/AFTER SPLIT CURTAIN
   */
  function initCraftJourneySection() {
    const section = document.querySelector('.section-craft-journey');
    if (!section || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const scrubLine = document.getElementById('craft-scrub-line');
    const stageItems = section.querySelectorAll('.craft-stage-item');
    const statCounter = document.getElementById('atelier-sqft-counter');
    let hasCountedStat = false;

    // 1. Progressive SVG Connecting Line Scrub
    if (scrubLine && !prefersReducedMotion) {
      gsap.fromTo(
        scrubLine,
        { strokeDashoffset: 1000 },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section.querySelector('.craft-timeline-container'),
            start: 'top 75%',
            end: 'bottom 40%',
            scrub: true,
          },
        }
      );
    }

    // 2. Stage Activations & Count-Up Stat
    stageItems.forEach((item, idx) => {
      const stageNum = item.querySelector('.craft-stage-num');
      const stageTitle = item.querySelector('.craft-stage-title');
      const stageDesc = item.querySelector('.craft-stage-desc');
      const stageMeta = item.querySelector('.craft-stage-meta');

      if (!prefersReducedMotion) {
        gsap.set([stageTitle, stageDesc, stageMeta], { opacity: 0, y: 20 });
        gsap.set(stageNum, { opacity: 0, scale: 0.8 });

        const stageTl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            toggleActions: 'play none none none',
            onEnter: () => {
              item.classList.add('is-active');
              if (idx === 1 && statCounter && !hasCountedStat) {
                hasCountedStat = true;
                const counterObj = { val: 0 };
                gsap.to(counterObj, {
                  val: 4500,
                  duration: 1.5,
                  ease: 'power2.out',
                  onUpdate: () => {
                    statCounter.innerText = Math.round(counterObj.val).toLocaleString('en-IN');
                  },
                });
              }
            },
          },
        });

        stageTl
          .to(stageNum, { opacity: 1, scale: 1.0, duration: 0.6, ease: 'power3.out' })
          .to(stageTitle, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
          .to(stageDesc, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
          .to(stageMeta, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3');
      } else {
        if (statCounter) statCounter.innerText = '4,500';
      }
    });

    // 3. Interactive Split-Wipe Curtain Slider (Draggable / Mousemove / Touch)
    const curtainContainer = document.getElementById('split-curtain-container');
    const curtainClip = document.getElementById('split-curtain-clip');
    const curtainHandle = document.getElementById('split-curtain-handle');
    const statusText = document.getElementById('transform-status-text');

    if (curtainContainer && curtainClip && curtainHandle) {
      let isDragging = false;

      function updateCurtainPosition(clientX) {
        const rect = curtainContainer.getBoundingClientRect();
        let pct = ((clientX - rect.left) / rect.width) * 100;
        pct = Math.max(0, Math.min(100, pct)); // Clamp 0 to 100

        curtainClip.style.clipPath = `polygon(${pct}% 0, 100% 0, 100% 100%, ${pct}% 100%)`;
        curtainHandle.style.left = `${pct}%`;
        curtainContainer.setAttribute('aria-valuenow', Math.round(pct));

        if (statusText) {
          statusText.innerText = `STATE: ${Math.round(pct)}% REVEAL`;
          statusText.style.color = pct > 50 ? '#fbbf24' : '#a8a29e';
        }
      }

      curtainContainer.addEventListener('pointerdown', (e) => {
        isDragging = true;
        curtainContainer.setPointerCapture(e.pointerId);
        updateCurtainPosition(e.clientX);
      });

      curtainContainer.addEventListener('pointermove', (e) => {
        if (isDragging || !isMobileScreen()) {
          updateCurtainPosition(e.clientX);
        }
      });

      curtainContainer.addEventListener('pointerup', (e) => {
        isDragging = false;
        try { curtainContainer.releasePointerCapture(e.pointerId); } catch(err) {}
      });

      curtainContainer.addEventListener('pointercancel', () => {
        isDragging = false;
      });

      // Keyboard accessibility
      curtainContainer.addEventListener('keydown', (e) => {
        let currentPct = parseFloat(curtainContainer.getAttribute('aria-valuenow') || '50');
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          currentPct = Math.max(0, currentPct - 10);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          currentPct = Math.min(100, currentPct + 10);
        }
        curtainClip.style.clipPath = `polygon(${currentPct}% 0, 100% 0, 100% 100%, ${currentPct}% 100%)`;
        curtainHandle.style.left = `${currentPct}%`;
        curtainContainer.setAttribute('aria-valuenow', Math.round(currentPct));
        if (statusText) {
          statusText.innerText = `STATE: ${Math.round(currentPct)}% REVEAL`;
        }
      });
    }

    console.log('[Elysium Motion] Section 4 (Craft Journey & Split Curtain) initialized.');
  }

  /**
   * 6. SECTION 5 — CURATED EDITORIAL COLLECTION
   */
  function initFeaturedPiecesSection() {
    const section = document.querySelector('.section-featured-pieces');
    if (!section || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const cards = section.querySelectorAll('.featured-piece-card');
    if (cards.length === 0) return;

    if (!prefersReducedMotion) {
      gsap.set(cards, { opacity: 0, y: 35 });
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section.querySelector('.featured-pieces-grid') || section,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });
    }

    console.log(`[Elysium Motion] Section 5 (Featured Pieces) initialized with ${cards.length} cards.`);
  }

  /**
   * 7. SECTION 6 — TRUST & VOICE (SPLIT-TYPE SCROLLTRIGGER ANIMATION ENGINE)
   * Based on SplitType + GSAP ScrollTrigger reference.
   */
  function initTrustVoiceSection() {
    const section = document.getElementById('trust-voice-container') || document.querySelector('.section-trust-voice');
    const quoteElement = document.querySelector('#split-type-text');
    if (!section || !quoteElement || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const attribution = section.querySelector('.trust-attribution');
    const eyebrow = section.querySelector('.trust-eyebrow');

    if (prefersReducedMotion || isMobileScreen()) {
      gsap.set(quoteElement, { opacity: 1, color: '#ffffff' });
      if (attribution) gsap.set(attribution, { opacity: 1, y: 0 });
      if (eyebrow) gsap.set(eyebrow, { opacity: 1 });
      return;
    }

    // Initialize SplitType for '#split-type-text' (types: 'words, chars')
    let splitWords = [];
    if (typeof SplitType !== 'undefined') {
      try {
        const text = new SplitType('#split-type-text', { types: 'words, chars' });
        splitWords = text.words && text.words.length > 0 ? text.words : [];
      } catch (err) {
        console.warn('[Elysium Motion] SplitType init:', err);
      }
    }

    // Fallback if SplitType didn't find words
    if (!splitWords || splitWords.length === 0) {
      splitWords = quoteElement.querySelectorAll('.trust-char, .trust-word');
      if (splitWords.length === 0) splitWords = [quoteElement];
    }

    // Initial dimmed state for words
    gsap.set(splitWords, { opacity: 0.15, color: '#57534e' });
    if (attribution) gsap.set(attribution, { opacity: 0, y: 15 });
    if (eyebrow) gsap.set(eyebrow, { opacity: 0.7 });

    // GSAP ScrollTrigger animation matching reference
    const pinContainer = section.querySelector('.abouttt') || section.querySelector('.trust-voice-pinned') || section;

    gsap.to(splitWords, {
      scrollTrigger: {
        trigger: '#split-type-text',
        pin: pinContainer,
        start: 'top center',
        end: '+=1500',
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (attribution) {
            if (self.progress > 0.8) {
              gsap.to(attribution, { opacity: (self.progress - 0.8) * 5, y: 0, duration: 0.2, overwrite: 'auto' });
            } else {
              gsap.to(attribution, { opacity: 0, y: 10, duration: 0.2, overwrite: 'auto' });
            }
          }
        },
      },
      opacity: 1,
      color: '#ffffff',
      duration: 0.5,
      stagger: { each: 1 },
      ease: 'none',
    });

    console.log(`[Elysium Motion] Section 6 SplitType text scroll animation initialized with ${splitWords.length} words.`);
  }

  /**
   * 8. UNIVERSAL SUBPAGE ANIMATIONS
   */
  function initSubpageAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const subpageCards = document.querySelectorAll(
      '.product-card:not(.featured-piece-card), .material-card, .baroque-box-frame'
    );

    if (subpageCards.length > 0) {
      subpageCards.forEach((card) => {
        gsap.set(card, { opacity: 0, y: 40 });
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            once: true,
          },
        });
      });
    }
  }

  /**
   * 8. GSAP LUXURY BUTTON & LINK INTERACTION ENGINE
   * Clean, professional micro-interactions without magnetic cursor drift.
   */
  function initButtonHoverAnimations() {
    if (typeof gsap === 'undefined' || prefersReducedMotion) return;

    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;

    const sealBadges = document.querySelectorAll('.rotating-seal-badge');
    sealBadges.forEach((seal) => {
      if (seal.dataset.gsapHoverReady === 'true') return;
      seal.dataset.gsapHoverReady = 'true';

      seal.addEventListener('mouseenter', () => {
        gsap.to(seal, { scale: 1.08, duration: 0.3, ease: 'power2.out' });
      });
      seal.addEventListener('mouseleave', () => {
        gsap.to(seal, { scale: 1.0, duration: 0.4, ease: 'power2.out' });
      });
    });

    console.log(`[Elysium Motion] Clean Button interaction ready.`);
  }

  /**
   * 9. SCROLLTRIGGER RESIZE & ORIENTATION REFRESH HANDLER
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
          initButtonHoverAnimations();
        }, 150);
      },
      { passive: true }
    );
  }

  /**
   * MASTER INITIALIZER
   */
  function initAllAnimations() {
    // 0. Initialize Lenis smooth scroller
    initLenisSmoothScroll();

    // 1. Homepage Body Sections (Manifesto, Horizontal Suite, Materiality, Craft Journey, Featured, Trust)
    initManifestoSection();
    initHorizontalGallerySection();
    initMaterialityInterludeSection();
    initCraftJourneySection();
    initFeaturedPiecesSection();
    initTrustVoiceSection();

    // 2. Interactive GSAP Button Hover Physics
    initButtonHoverAnimations();

    // 3. Subpage generic cards & resize handlers
    initSubpageAnimations();
    initScrollTriggerRefreshHandler();

    // 4. Progressive ScrollTrigger refreshes
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
        console.log('[Elysium Motion] Window load complete — ScrollTrigger refreshed.');
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
