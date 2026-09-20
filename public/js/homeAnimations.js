/**
 * ELYSIUM HOME DECOR — MASTER GSAP & SCROLLTRIGGER MOTION ENGINE
 * Groundbreaking animations inspired by Palmo and Zainab Kabira.
 * Precision-calibrated for performance, aesthetics, and seamless Lenis scroller integration.
 * Every section locks in (pins) during its narrative animations for a state-of-the-art cinematic handover.
 */

(function () {
  'use strict';

  let lenisInstance = null;

  // Accessibility & reduced motion check
  const systemPrefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const prefersReducedMotion = systemPrefersReducedMotion && !window.location.search.includes('motion=true');
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  function isCompactScreen() {
    return window.innerWidth < 1024;
  }

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
          duration: 1.15,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          smoothWheel: true,
          smoothTouch: false, // Keep native touch physics on mobile for responsive gestures
          wheelMultiplier: 1.0,
          touchMultiplier: 1.0,
        });

        // Sync Lenis scroll updates with ScrollTrigger & Hero canvas
        lenisInstance.on('scroll', (e) => {
          ScrollTrigger.update();
          if (typeof window.__elysiumUpdateHero === 'function') {
            window.__elysiumUpdateHero(e.scroll);
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
   * 1. SECTION 1 — THE ATELIER MANIFESTO (PINNED SCRUB LOCK-IN)
   * Section locks in at top of viewport, scrubs through narrative reveal, then smoothly transitions to Section 2.
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

    if (prefersReducedMotion || isCompactScreen()) {
      if (mask) mask.style.clipPath = 'inset(0 0 0 0)';
      if (words.length) gsap.set(words, { opacity: 1, y: 0 });
      if (para1) gsap.set(para1, { opacity: 1, y: 0 });
      if (para2) gsap.set(para2, { opacity: 1, y: 0 });
      if (signature) gsap.set(signature, { opacity: 1, y: 0 });
      if (links.length) gsap.set(links, { opacity: 1, y: 0 });
      if (eyebrow) gsap.set(eyebrow, { opacity: 1, y: 0 });
      if (divider) gsap.set(divider, { scaleX: 1 });
      return;
    }

    // Natural Height Progressive Entrance Timeline for Manifesto
    const manifestoTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    // Initial states
    gsap.set(eyebrow, { opacity: 0, y: 15 });
    gsap.set(words, { opacity: 0.15, y: 18 });
    gsap.set(divider, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set([para1, para2], { opacity: 0, y: 20 });
    gsap.set(signature, { opacity: 0, y: 15 });
    gsap.set(links, { opacity: 0, y: 12 });

    // Coordinated entrance sequence
    manifestoTl
      .to(eyebrow, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0)
      .to(divider, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 0.1)
      .to(words, { opacity: 1, y: 0, stagger: 0.02, duration: 0.6, ease: 'power2.out' }, 0.15)
      .fromTo(mask, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.85, ease: 'power3.inOut' }, 0.25)
      .to(para1, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0.45)
      .to(para2, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0.6)
      .to(signature, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0.75)
      .to(links, { opacity: 1, y: 0, stagger: 0.1, duration: 0.45, ease: 'power2.out' }, 0.85);

    // 3D Perspective Tilt on Mousemove
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (tiltCard && isFinePointer && !isCompactScreen()) {
      const cardWrap = tiltCard.querySelector('.manifesto-portrait-wrap');
      const glare = tiltCard.querySelector('.tilt-glare');

      tiltCard.addEventListener('mousemove', (e) => {
        const rect = tiltCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
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

    console.log('[Elysium Motion] Section 1 (Manifesto) initialized with natural height entrance.');
  }

  /**
   * 2. SECTION 2 — THE PINNED HORIZONTAL ATELIER EXPEDITION (PINNED SCRUB LOCK-IN)
   * Locks in at top of viewport, scrubs through all 4 chapters, then smoothly hands over to Section 3.
   */
  function initHorizontalGallerySection() {
    const section = document.getElementById('horizontal-suite-container');
    if (!section || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const track = document.getElementById('horizontal-track');
    const panels = section.querySelectorAll('.horizontal-slide-panel');
    const progressFill = document.getElementById('horizontal-progress-fill');
    const chapterIndicator = document.getElementById('horizontal-active-indicator');

    if (!track || panels.length === 0) return;

    if (isCompactScreen() || prefersReducedMotion) {
      track.style.transform = 'none';
      if (progressFill) progressFill.style.width = '100%';
      return;
    }

    const totalPanels = panels.length;

    // Horizontal Scrub Master ScrollTrigger
    gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${(totalPanels - 1) * window.innerWidth * 1.05}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progressFill) {
            const pct = Math.max(25, self.progress * 100);
            progressFill.style.width = `${pct}%`;
          }
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
   * 3. SECTION 3 — THE TACTILE MATERIALITY LAB (PINNED SCRUB LOCK-IN)
   * Locks in at top of viewport, scrubs through 4 raw earth mediums, then smoothly hands over to Section 4.
   */
  function initMaterialityInterludeSection() {
    const section = document.getElementById('materiality-suite-container') || document.querySelector('.section-materiality-interlude');
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
    const chips = section.querySelectorAll('.mat-chip');
    const indicator = document.getElementById('mat-active-indicator');

    if (!slides[0] || !labels[0]) return;

    function setActiveMaterial(idx) {
      slides.forEach((s, i) => {
        if (s) s.style.opacity = i === idx ? '1' : '0';
      });
      labels.forEach((l, i) => {
        if (l) {
          l.style.opacity = i === idx ? '1' : '0';
          l.style.pointerEvents = i === idx ? 'auto' : 'none';
        }
      });
      chips.forEach((c, i) => {
        if (i === idx) {
          c.classList.add('active', 'border-amber-400/80', 'bg-amber-500/20', 'text-amber-300');
          c.classList.remove('border-white/15', 'bg-black/40', 'text-stone-400');
        } else {
          c.classList.remove('active', 'border-amber-400/80', 'bg-amber-500/20', 'text-amber-300');
          c.classList.add('border-white/15', 'bg-black/40', 'text-stone-400');
        }
      });
      if (indicator) {
        indicator.innerText = `MEDIUM 0${idx + 1} OF 04`;
      }
    }

    setActiveMaterial(0);

    chips.forEach((chip) => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        const targetIdx = parseInt(chip.getAttribute('data-target-idx'), 10) || 0;
        setActiveMaterial(targetIdx);

        if (!isCompactScreen() && !prefersReducedMotion && lenisInstance) {
          const st = ScrollTrigger.getById('materiality-scrolltrigger');
          if (st) {
            const targetProgress = targetIdx / 3;
            const targetScroll = st.start + (st.end - st.start) * targetProgress;
            lenisInstance.scrollTo(targetScroll, { duration: 1 });
          }
        }
      });
    });

    // Desktop ScrollTrigger pinning & scrub
    if (!isCompactScreen() && !prefersReducedMotion) {
      const scrollDistance = 4 * 400; // 1600px scrub distance

      const masterTl = gsap.timeline({
        id: 'materiality-scrolltrigger',
        scrollTrigger: {
          id: 'materiality-scrolltrigger',
          trigger: section,
          start: 'top top',
          end: `+=${scrollDistance}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const currentIdx = Math.min(Math.floor(self.progress * 4), 3);
            chips.forEach((c, i) => {
              if (i === currentIdx) {
                c.classList.add('active', 'border-amber-400/80', 'bg-amber-500/20', 'text-amber-300');
                c.classList.remove('border-white/15', 'bg-black/40', 'text-stone-400');
              } else {
                c.classList.remove('active', 'border-amber-400/80', 'bg-amber-500/20', 'text-amber-300');
                c.classList.add('border-white/15', 'bg-black/40', 'text-stone-400');
              }
            });
            if (indicator) {
              indicator.innerText = `MEDIUM 0${currentIdx + 1} OF 04`;
            }
          },
        },
      });

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
    }

    console.log('[Elysium Motion] Section 3 (Materiality Lab) initialized with pinned scrub.');
  }

  /**
   * 4. SECTION 4 — THE CRAFT JOURNEY & TRANSFORMATION LAB (PINNED SCRUB LOCK-IN)
   * Locks in at top of viewport, scrubs through the 3 artisan phases & 4,500 sq ft count, then smoothly hands over to Section 5.
   */
  function initCraftJourneySection() {
    const section = document.querySelector('.section-craft-journey');
    if (!section || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const scrubLine = document.getElementById('craft-scrub-line');
    const stageItems = section.querySelectorAll('.craft-stage-item');
    const statCounter = document.getElementById('atelier-sqft-counter');
    let hasCountedStat = false;

    if (prefersReducedMotion || isCompactScreen()) {
      if (scrubLine) scrubLine.style.strokeDashoffset = '0';
      stageItems.forEach((item) => {
        item.classList.add('is-active');
        const stageNum = item.querySelector('.craft-stage-num');
        const stageTitle = item.querySelector('.craft-stage-title');
        const stageDesc = item.querySelector('.craft-stage-desc');
        const stageMeta = item.querySelector('.craft-stage-meta');
        if (stageNum) gsap.set(stageNum, { opacity: 1, scale: 1 });
        if (stageTitle) gsap.set(stageTitle, { opacity: 1, y: 0 });
        if (stageDesc) gsap.set(stageDesc, { opacity: 1, y: 0 });
        if (stageMeta) gsap.set(stageMeta, { opacity: 1, y: 0 });
      });
      if (statCounter) statCounter.innerText = '4,500';
      return;
    }

    // Pinned Scrub Timeline on Desktop
    const craftTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=1400',
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Initial states
    if (scrubLine) gsap.set(scrubLine, { strokeDashoffset: 1000 });
    stageItems.forEach((item, idx) => {
      const stageNum = item.querySelector('.craft-stage-num');
      const stageTitle = item.querySelector('.craft-stage-title');
      const stageDesc = item.querySelector('.craft-stage-desc');
      const stageMeta = item.querySelector('.craft-stage-meta');
      gsap.set([stageTitle, stageDesc, stageMeta], { opacity: idx === 0 ? 1 : 0.25, y: idx === 0 ? 0 : 10 });
      gsap.set(stageNum, { opacity: idx === 0 ? 1 : 0.4, scale: idx === 0 ? 1 : 0.85 });
    });

    // Progressive scrub through stages
    craftTl
      .to(scrubLine, { strokeDashoffset: 650, ease: 'none', duration: 0.35 }, 0)
      
      // Stage 2
      .to(scrubLine, { strokeDashoffset: 320, ease: 'none', duration: 0.35 }, 0.35)
      .to(stageItems[1].querySelector('.craft-stage-num'), { opacity: 1, scale: 1, duration: 0.2 }, 0.35)
      .to(stageItems[1].querySelectorAll('.craft-stage-title, .craft-stage-desc, .craft-stage-meta'), { opacity: 1, y: 0, duration: 0.25 }, 0.35)
      .call(() => {
        stageItems[1].classList.add('is-active');
        if (statCounter && !hasCountedStat) {
          hasCountedStat = true;
          const counterObj = { val: 0 };
          gsap.to(counterObj, {
            val: 4500,
            duration: 1.2,
            ease: 'power2.out',
            onUpdate: () => {
              statCounter.innerText = Math.round(counterObj.val).toLocaleString('en-IN');
            },
          });
        }
      }, null, 0.38)

      // Stage 3
      .to(scrubLine, { strokeDashoffset: 0, ease: 'none', duration: 0.35 }, 0.7)
      .to(stageItems[2].querySelector('.craft-stage-num'), { opacity: 1, scale: 1, duration: 0.2 }, 0.7)
      .to(stageItems[2].querySelectorAll('.craft-stage-title, .craft-stage-desc, .craft-stage-meta'), { opacity: 1, y: 0, duration: 0.25 }, 0.7)
      .call(() => {
        stageItems[2].classList.add('is-active');
      }, null, 0.72);

    // Interactive Split-Wipe Curtain Slider
    const curtainContainer = document.getElementById('split-curtain-container');
    const curtainClip = document.getElementById('split-curtain-clip');
    const curtainHandle = document.getElementById('split-curtain-handle');
    const statusText = document.getElementById('transform-status-text');

    if (curtainContainer && curtainClip && curtainHandle) {
      let isDragging = false;

      function updateCurtainPosition(clientX) {
        const rect = curtainContainer.getBoundingClientRect();
        let pct = ((clientX - rect.left) / rect.width) * 100;
        pct = Math.max(0, Math.min(100, pct));

        curtainClip.style.clipPath = `polygon(${pct}% 0, 100% 0, 100% 100%, ${pct}% 100%)`;
        curtainHandle.style.left = `${pct}%`;
        curtainContainer.setAttribute('aria-valuenow', Math.round(pct));

        if (statusText) {
          statusText.innerText = `STATE: ${Math.round(pct)}% REVEAL`;
          statusText.style.color = pct > 50 ? '#fbbf24' : '#a8a29e';
        }
      }

      // Pointer events for modern touch & mouse
      curtainContainer.addEventListener('pointerdown', (e) => {
        isDragging = true;
        try { curtainContainer.setPointerCapture(e.pointerId); } catch(err) {}
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

      // Explicit mobile touch events fallback
      curtainContainer.addEventListener('touchstart', (e) => {
        isDragging = true;
        if (e.touches && e.touches[0]) {
          updateCurtainPosition(e.touches[0].clientX);
        }
      }, { passive: true });

      curtainContainer.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches && e.touches[0]) {
          updateCurtainPosition(e.touches[0].clientX);
        }
      }, { passive: true });

      curtainContainer.addEventListener('touchend', () => {
        isDragging = false;
      });

      // Tap-to-toggle reveal on mobile click
      curtainContainer.addEventListener('click', (e) => {
        if (!isDragging && isMobileScreen()) {
          const rect = curtainContainer.getBoundingClientRect();
          const currentPct = parseFloat(curtainContainer.getAttribute('aria-valuenow') || '50');
          const newPct = currentPct > 50 ? 15 : 85;
          const targetX = rect.left + (rect.width * newPct) / 100;
          updateCurtainPosition(targetX);
        }
      });

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

    console.log('[Elysium Motion] Section 4 (Craft Journey) initialized with pinned scrub.');
  }

  /**
   * 5. SECTION 5 — CURATED EDITORIAL COLLECTION
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
   * 6. SECTION 6 — TRUST & VOICE (PINNED CHARACTER-BY-CHARACTER SCRUB LOCK-IN)
   * Locks in at top of viewport, reveals text character-by-character on scroll without fade, then smoothly releases to Footer.
   */
  function initTrustVoiceSection() {
    const section = document.getElementById('trust-voice-container') || document.querySelector('.section-trust-voice');
    const quoteElement = document.querySelector('#split-type-text');
    if (!section || !quoteElement || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const chars = Array.from(quoteElement.querySelectorAll('.trust-char'));
    const attribution = section.querySelector('.trust-attribution');
    const eyebrow = section.querySelector('.trust-eyebrow');

    if (prefersReducedMotion || isMobileScreen() || chars.length === 0) {
      if (chars.length) {
        chars.forEach((c) => {
          c.style.opacity = '1';
          c.style.color = '#ffffff';
        });
      }
      if (attribution) gsap.set(attribution, { opacity: 1, y: 0 });
      if (eyebrow) gsap.set(eyebrow, { opacity: 1 });
      return;
    }

    // Initial state: dim muted stone color for all characters
    chars.forEach((c) => {
      c.style.opacity = '0.2';
      c.style.color = '#57534e';
      c.style.textShadow = 'none';
      c.style.transition = 'color 0.1s ease, opacity 0.1s ease, text-shadow 0.1s ease';
    });
    if (attribution) gsap.set(attribution, { opacity: 0, y: 15 });
    if (eyebrow) gsap.set(eyebrow, { opacity: 0.8 });

    const totalChars = chars.length;
    let lastActiveIdx = -1;

    // Direct character-by-character scrub lock-in
    ScrollTrigger.create({
      trigger: section,
      pin: true,
      start: 'top top',
      end: '+=1400',
      scrub: 0.3,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;

        // Map 0 -> 0.82 of scroll progress to sequential character index
        const charProgress = Math.min(1, p / 0.82);
        const activeIdx = Math.floor(charProgress * totalChars);

        if (activeIdx !== lastActiveIdx) {
          lastActiveIdx = activeIdx;
          for (let i = 0; i < totalChars; i++) {
            if (i <= activeIdx) {
              chars[i].style.opacity = '1';
              chars[i].style.color = '#ffffff';
              chars[i].style.textShadow = '0 0 14px rgba(255, 255, 255, 0.4)';
            } else {
              chars[i].style.opacity = '0.2';
              chars[i].style.color = '#57534e';
              chars[i].style.textShadow = 'none';
            }
          }
        }

        // Attribution reveal in final 18% of scroll
        if (attribution) {
          if (p > 0.82) {
            const attrP = Math.min(1, (p - 0.82) / 0.18);
            gsap.to(attribution, { opacity: attrP, y: (1 - attrP) * 12, duration: 0.15, overwrite: 'auto' });
          } else {
            gsap.to(attribution, { opacity: 0, y: 12, duration: 0.15, overwrite: 'auto' });
          }
        }
      },
    });

    console.log(`[Elysium Motion] Section 6 Character-by-character scroll animation initialized with ${chars.length} chars.`);
  }

  /**
   * 6B. SECTION 6 TESTIMONIAL COMPONENT — SCULPTURAL FROSTED GLASS & ROTATING NARRATIVES
   * Single frosted glass card floating over full-bleed blurred atelier backdrop.
   * Features broken baroque stone fragment assembly, circular portrait reveal, gold sweep highlight,
   * 5-star overshoot pop, and smooth rotating crossfade between client testimonials.
   */
  function initTestimonialComponent() {
    const stage = document.getElementById('trust-testimonial-stage');
    const card = document.getElementById('elysium-testimonial-card');
    if (!stage || !card || typeof gsap === 'undefined') return;

    const portraitWrap = card.querySelector('.testimonial-portrait-wrap');
    const portraitImg = document.getElementById('testimonial-portrait-img');
    const fragments = Array.from(card.querySelectorAll('.stone-fragment'));
    const contentContainer = document.getElementById('testimonial-content-container');
    const headline = document.getElementById('testimonial-headline');
    const quote = document.getElementById('testimonial-quote');
    const highlightBg = card.querySelector('.testimonial-highlight-bg');
    const attribution = document.getElementById('testimonial-attribution-block');
    const author = document.getElementById('testimonial-author');
    const project = document.getElementById('testimonial-project');
    const tag = document.getElementById('testimonial-tag');
    const stars = Array.from(card.querySelectorAll('.testimonial-star'));
    const dotsNav = document.getElementById('testimonial-dots-nav');
    const dots = dotsNav ? Array.from(dotsNav.querySelectorAll('.testimonial-dot')) : [];

    const testimonials = [
      {
        headline: '“Grounded.”',
        quote: '“Elysium delivered a custom travertine console that transformed our living room into <span class="testimonial-highlight-wrap inline-block relative"><span class="testimonial-highlight-bg absolute inset-0 bg-amber-500/20 border border-amber-400/30 rounded-xs"></span><span class="testimonial-highlight-text relative z-10 text-amber-200 font-normal px-1.5">a monolithic living sanctuary</span></span> with unmatched tactile reverence.”',
        author: 'Sarah P.',
        project: 'Bespoke Console Commission, South Bombay Residence',
        tag: '🪨 Custom Commission',
        rating: '5/5',
        portrait: '/images/maker_portrait.jpg'
      },
      {
        headline: '“Timeless.”',
        quote: '“The chiseled black granite plinth and vessels created an atmosphere of <span class="testimonial-highlight-wrap inline-block relative"><span class="testimonial-highlight-bg absolute inset-0 bg-amber-500/20 border border-amber-400/30 rounded-xs"></span><span class="testimonial-highlight-text relative z-10 text-amber-200 font-normal px-1.5">profound architectural calm</span></span> in our penthouse gallery.”',
        author: 'Vikram M.',
        project: 'Granite Plinth Suite, Juhu Atelier Villa',
        tag: '🏛️ Architectural Suite',
        rating: '5/5',
        portrait: '/images/atelier_craftsman.jpg'
      },
      {
        headline: '“Sanctuary.”',
        quote: '“Every curve in the raw cast-bronze lighting feels intentional, anchoring the room in <span class="testimonial-highlight-wrap inline-block relative"><span class="testimonial-highlight-bg absolute inset-0 bg-amber-500/20 border border-amber-400/30 rounded-xs"></span><span class="testimonial-highlight-text relative z-10 text-amber-200 font-normal px-1.5">warm, shadow-sculpted silence</span></span>.”',
        author: 'Elena R.',
        project: 'Cast Bronze & Terracotta Series, New Delhi Residence',
        tag: '🏺 Bronze Commission',
        rating: '5/5',
        portrait: '/images/atelier_display.jpg'
      }
    ];

    let currentIndex = 0;
    let autoAdvanceTimer = null;
    let isTransitioning = false;

    // 1. Reduced Motion handling
    if (prefersReducedMotion) {
      gsap.set(card, { opacity: 1, scale: 1, y: 0 });
      gsap.set(fragments, { opacity: 1, x: 0, y: 0, rotation: 0 });
      if (portraitWrap) gsap.set(portraitWrap, { clipPath: 'circle(50% at 50% 50%)' });
      if (headline) gsap.set(headline, { opacity: 1, y: 0 });
      if (quote) gsap.set(quote, { opacity: 1, y: 0 });
      if (highlightBg) gsap.set(highlightBg, { clipPath: 'inset(0 0% 0 0)' });
      if (attribution) gsap.set(attribution, { opacity: 1, y: 0 });
      if (stars.length) gsap.set(stars, { scale: 1, opacity: 1 });
    } else {
      // Set initial states for GSAP Timeline
      gsap.set(card, { opacity: 0, scale: 0.92, y: 30 });
      
      // Each fragment starts from randomized offset (±60px, ±25deg, 0 opacity)
      fragments.forEach((frag) => {
        const randX = (Math.random() * 120 - 60).toFixed(1);
        const randY = (Math.random() * 120 - 60).toFixed(1);
        const randRot = (Math.random() * 50 - 25).toFixed(1);
        gsap.set(frag, { x: randX, y: randY, rotation: randRot, opacity: 0 });
      });

      if (portraitWrap) {
        gsap.set(portraitWrap, { opacity: 0 });
        const clipCircle = document.getElementById('testimonial-portrait-circle');
        if (clipCircle) gsap.set(clipCircle, { attr: { r: 0 } });
      }
      if (headline) gsap.set(headline, { opacity: 0, y: 15 });
      if (quote) gsap.set(quote, { opacity: 0, y: 20 });
      if (highlightBg) gsap.set(highlightBg, { clipPath: 'inset(0 100% 0 0)' });
      if (attribution) gsap.set(attribution, { opacity: 0, y: 10 });
      if (stars.length) gsap.set(stars, { scale: 0, opacity: 0 });

      // ONE GSAP Timeline for Entrance
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 75%',
          toggleActions: 'play none none none',
          once: true,
        },
      });

      // Step 1: Card Entrance (opacity 0→1, scale 0.92→1, y: 30→0, 1s, power3.out)
      entranceTl.to(card, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.0,
        ease: 'power3.out',
      }, 0);

      // Step 2: Stone Fragments Assemble (staggered 0.08s, duration 0.9s, power3.out, offset start by 0.3s)
      if (fragments.length > 0) {
        entranceTl.to(fragments, {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
        }, 0.3);
      }

      // Step 3: Portrait Reveal (circle clip-path radius reveal 0 -> 54, duration 0.8s, power2.inOut)
      if (portraitWrap) {
        const clipCircle = document.getElementById('testimonial-portrait-circle');
        if (clipCircle) {
          entranceTl.to(clipCircle, {
            attr: { r: 54 },
            duration: 0.8,
            ease: 'power2.inOut',
          }, '>-0.2');
        }
        entranceTl.to(portraitWrap, {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.inOut',
        }, '<');
      }

      // Step 4: Headline + Quote + Gold Highlight Sweep
      if (headline) {
        entranceTl.to(headline, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
        }, '>-0.1');
      }

      if (quote) {
        entranceTl.to(quote, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        }, '<0.15');
      }

      if (highlightBg) {
        entranceTl.to(highlightBg, {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.5,
          ease: 'power2.out',
        }, '>');
      }

      // Step 5: Attribution + Star Rating with Overshoot (back.out(2))
      if (attribution) {
        entranceTl.to(attribution, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
        }, '>-0.2');
      }

      if (stars.length > 0) {
        entranceTl.to(stars, {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: 'back.out(2)',
        }, '<0.1');
      }
    }

    // Step 6: Testimonial Crossfade & Auto-advance (Frame & stone fragments stay static!)
    function goToTestimonial(targetIdx) {
      if (isTransitioning || targetIdx === currentIndex) return;
      isTransitioning = true;
      const t = testimonials[targetIdx];

      // Update dot active styling
      dots.forEach((dot, idx) => {
        if (idx === targetIdx) {
          dot.classList.add('active');
          gsap.to(dot, { scale: 1.3, backgroundColor: '#d4af37', duration: 0.3 });
        } else {
          dot.classList.remove('active');
          gsap.to(dot, { scale: 1, backgroundColor: '#44403c', duration: 0.3 });
        }
      });

      if (prefersReducedMotion) {
        if (portraitImg) {
          portraitImg.setAttribute('href', t.portrait);
          if (portraitImg.setAttributeNS) portraitImg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', t.portrait);
        }
        if (headline) headline.textContent = t.headline;
        if (quote) quote.innerHTML = t.quote;
        if (author) author.textContent = t.author;
        if (project) project.textContent = t.project;
        if (tag) tag.textContent = t.tag;
        currentIndex = targetIdx;
        isTransitioning = false;
        return;
      }

      // Crossfade: fade out dynamic elements (portrait, headline, quote, attribution)
      const crossfadeTargets = [contentContainer, portraitWrap].filter(Boolean);
      gsap.to(crossfadeTargets, {
        opacity: 0,
        y: -8,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          // Swap data
          if (portraitImg) {
            portraitImg.setAttribute('href', t.portrait);
            if (portraitImg.setAttributeNS) portraitImg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', t.portrait);
          }
          if (headline) headline.textContent = t.headline;
          if (quote) quote.innerHTML = t.quote;
          if (author) author.textContent = t.author;
          if (project) project.textContent = t.project;
          if (tag) tag.textContent = t.tag;

          // Reset highlight sweep in new quote
          const newHighlight = quote.querySelector('.testimonial-highlight-bg');
          if (newHighlight) {
            gsap.set(newHighlight, { clipPath: 'inset(0 100% 0 0)' });
          }

          // Fade back in
          gsap.fromTo(crossfadeTargets, 
            { opacity: 0, y: 8 },
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.45, 
              ease: 'power2.out',
              onComplete: () => {
                // Sweep highlight
                if (newHighlight) {
                  gsap.to(newHighlight, {
                    clipPath: 'inset(0 0% 0 0)',
                    duration: 0.5,
                    ease: 'power2.out',
                  });
                }
                currentIndex = targetIdx;
                isTransitioning = false;
              }
            }
          );
        },
      });
    }

    // Auto-advance every 6s
    function startAutoAdvance() {
      stopAutoAdvance();
      autoAdvanceTimer = setInterval(() => {
        const nextIdx = (currentIndex + 1) % testimonials.length;
        goToTestimonial(nextIdx);
      }, 6000);
    }

    function stopAutoAdvance() {
      if (autoAdvanceTimer) {
        clearInterval(autoAdvanceTimer);
        autoAdvanceTimer = null;
      }
    }

    // Pause on hover
    card.addEventListener('mouseenter', stopAutoAdvance);
    card.addEventListener('mouseleave', startAutoAdvance);

    // Manual navigation via dot indicators
    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-idx') || '0', 10);
        goToTestimonial(idx);
        startAutoAdvance(); // Reset timer after manual interaction
      });
    });

    startAutoAdvance();
    console.log('[Elysium Motion] Testimonial component initialized with 3 rotating narratives & fragment assembly.');
  }

  /**
   * 7. UNIVERSAL SUBPAGE ANIMATIONS
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
    initTestimonialComponent();

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
