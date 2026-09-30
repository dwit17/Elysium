/**
 * ==========================================================================
 * ELYSIUM CATEGORIES SHOWCASE CONTROLLER
 * Studio This Physics Word Drop ("ELYSIUM") + GSAP ScrollTrigger Pinned Carousel
 * ==========================================================================
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
   * 0. TUNABLE CONFIGURATION (Studio This "Jealous" Alive Floating System)
   * -------------------------------------------------------------------------- */
  const CONFIG = {
    word: 'ELYSIUM',
    letterHeightVh: 0.41, // ~20% smaller than previous 0.52vh for ideal visual balance
    
    // Zero-Gravity Organic Floating Physics
    gravityY: 0,          // Zero gravity for buoyant floating
    restitution: 0.85,    // Elastic bouncy collisions between letters
    friction: 0.04,       // Low surface friction
    frictionAir: 0.038,   // Fluid atmospheric damping
    density: 0.002,
    
    // Mouse & Scroll Interaction
    repelRadius: 280,     // Repulsion radius from cursor
    repelStrength: 0.045, // Fluid pushing force
    slideBurstForce: 0.06 // Pop impulse when slide changes
  };

  /* --------------------------------------------------------------------------
   * 1. SVG GLYPH PATH DEFINITIONS (Clean Bold Geometric Grotesque)
   * -------------------------------------------------------------------------- */
  const GLYPHS = {
    'E': {
      viewBox: '0 0 90 120',
      widthRatio: 0.75,
      path: 'M10,8 H85 V32 H36 V48 H80 V72 H36 V88 H85 V112 H10 Z',
      clipPath: 'M 0.1111 0.0667 H 0.9444 V 0.2667 H 0.4000 V 0.4000 H 0.8889 V 0.6000 H 0.4000 V 0.7333 H 0.9444 V 0.9333 H 0.1111 Z'
    },
    'L': {
      viewBox: '0 0 90 120',
      widthRatio: 0.70,
      path: 'M10,8 H36 V88 H85 V112 H10 Z',
      clipPath: 'M 0.1111 0.0667 H 0.4000 V 0.7333 H 0.9444 V 0.9333 H 0.1111 Z'
    },
    'Y': {
      viewBox: '0 0 90 120',
      widthRatio: 0.75,
      path: 'M8,8 H34 L45,50 L56,8 H82 L58,68 V112 H32 V68 Z',
      clipPath: 'M 0.0889 0.0667 H 0.3778 L 0.5000 0.4167 L 0.6222 0.0667 H 0.9111 L 0.6444 0.5667 V 0.9333 H 0.3556 V 0.5667 Z'
    },
    'S': {
      viewBox: '0 0 90 120',
      widthRatio: 0.75,
      path: 'M82,32 L56,36 C55,27 50,24 44,24 C38,24 34,27 34,32 C34,38 39,41 50,45 L58,48 C76,54 84,63 84,78 C84,98 68,112 45,112 C22,112 8,98 6,80 L32,76 C33,86 38,90 46,90 C52,90 58,86 58,80 C58,73 52,69 42,65 L34,62 C16,56 8,47 8,32 C8,14 24,8 45,8 C68,8 80,18 82,32 Z',
      clipPath: 'M 0.9111 0.2667 L 0.6222 0.3000 C 0.6111 0.2250 0.5556 0.2000 0.4889 0.2000 C 0.4222 0.2000 0.3778 0.2250 0.3778 0.2667 C 0.3778 0.3167 0.4333 0.3417 0.5556 0.3750 L 0.6444 0.4000 C 0.8444 0.4500 0.9333 0.5250 0.9333 0.6500 C 0.9333 0.8167 0.7556 0.9333 0.5000 0.9333 C 0.2444 0.9333 0.0889 0.8167 0.0667 0.6667 L 0.3556 0.6333 C 0.3667 0.7167 0.4222 0.7500 0.5111 0.7500 C 0.5778 0.7500 0.6444 0.7167 0.6444 0.6667 C 0.6444 0.6083 0.5778 0.5750 0.4667 0.5417 L 0.3778 0.5167 C 0.1778 0.4667 0.0889 0.3917 0.0889 0.2667 C 0.0889 0.1167 0.2667 0.0667 0.5000 0.0667 C 0.7556 0.0667 0.8889 0.1500 0.9111 0.2667 Z'
    },
    'I': {
      viewBox: '0 0 36 120',
      widthRatio: 0.30,
      path: 'M5,8 H31 V112 H5 Z',
      clipPath: 'M 0.1389 0.0667 H 0.8611 V 0.9333 H 0.1389 Z'
    },
    'U': {
      viewBox: '0 0 90 120',
      widthRatio: 0.75,
      path: 'M10,8 H36 V72 C36,82 40,88 45,88 C50,88 54,82 54,72 V8 H80 V72 C80,98 65,112 45,112 C25,112 10,98 10,72 Z',
      clipPath: 'M 0.1111 0.0667 H 0.4000 V 0.6000 C 0.4000 0.6833 0.4444 0.7333 0.5000 0.7333 C 0.5556 0.7333 0.6000 0.6833 0.6000 0.6000 V 0.0667 H 0.8889 V 0.6000 C 0.8889 0.8167 0.7222 0.9333 0.5000 0.9333 C 0.2778 0.9333 0.1111 0.8167 0.1111 0.6000 Z'
    },
    'M': {
      viewBox: '0 0 110 120',
      widthRatio: 0.92,
      path: 'M8,8 H32 L55,62 L78,8 H102 V112 H78 V48 L58,92 H52 L32,48 V112 H8 Z',
      clipPath: 'M 0.0727 0.0667 H 0.2909 L 0.5000 0.5167 L 0.7091 0.0667 H 0.9273 V 0.9333 H 0.7091 V 0.4000 L 0.5273 0.7667 H 0.4727 L 0.2909 0.4000 V 0.9333 H 0.0727 Z'
    }
  };

  /* --------------------------------------------------------------------------
   * 2. GSAP SCROLLTRIGGER PINNED CAROUSEL CONTROLLER
   * -------------------------------------------------------------------------- */
  class ShowcaseSlider {
    constructor(wrapperEl, heroEl, onSlideChangeCallback) {
      this.wrapperEl = wrapperEl;
      this.heroEl = heroEl;
      this.slides = Array.from(heroEl.querySelectorAll('.showcase-slide'));
      this.titleEl = document.getElementById('ui-category-title');
      this.artisanEl = document.getElementById('ui-artisan-details');
      this.exploreLinkEl = document.getElementById('ui-explore-link');
      this.data = window.SHOWCASE_DATA || [];
      this.current = 0;
      this.total = this.slides.length;
      this.isAnimating = false;
      this.onSlideChangeCallback = onSlideChangeCallback;

      this.init();
    }

    init() {
      // Set initial slide positions
      this.slides.forEach((slide, idx) => {
        if (idx === 0) {
          slide.classList.add('is-active');
          gsap.set(slide, { yPercent: 0, opacity: 1, visibility: 'visible' });
        } else {
          slide.classList.remove('is-active');
          gsap.set(slide, { yPercent: 100, opacity: 0, visibility: 'hidden' });
        }
      });

      if (typeof ScrollTrigger === 'undefined') {
        console.warn('[Elysium] ScrollTrigger not found, fallback to direct wheel lock');
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      // Setup ScrollTrigger Pinning:
      // Pins the showcase stage in viewport for 5 full screens of scroll distance
      // Users MUST scroll through all 6 categories before reaching the footer!
      const totalCategories = this.total;
      
      ScrollTrigger.create({
        trigger: this.wrapperEl,
        start: 'top top',
        end: () => `+=${window.innerHeight * (totalCategories - 0.2)}`,
        pin: this.heroEl,
        pinSpacing: true,
        scrub: 0.3,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Progress goes from 0.0 to 1.0 as the user scrolls
          const targetIndex = Math.min(totalCategories - 1, Math.floor(self.progress * totalCategories));
          if (targetIndex !== this.current && !this.isAnimating) {
            const direction = targetIndex > this.current ? 1 : -1;
            this.goTo(targetIndex, direction);
          }
        }
      });
    }

    goTo(targetIndex, direction = 1) {
      if (targetIndex === this.current) return;
      this.isAnimating = true;

      const outgoingSlide = this.slides[this.current];
      const incomingSlide = this.slides[targetIndex];
      const outgoingImg = outgoingSlide.querySelector('.showcase-img');
      const incomingImg = incomingSlide.querySelector('.showcase-img');

      // Update UI texts
      const itemData = this.data[targetIndex];
      if (itemData) {
        if (this.titleEl) {
          gsap.to(this.titleEl, {
            y: -12 * direction,
            opacity: 0,
            duration: 0.22,
            ease: 'power2.in',
            onComplete: () => {
              this.titleEl.innerHTML = `<span class="title-text">${itemData.title}</span>`;
              gsap.fromTo(this.titleEl, 
                { y: 15 * direction, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' }
              );
            }
          });
        }

        if (this.artisanEl) {
          gsap.to(this.artisanEl, {
            opacity: 0,
            duration: 0.18,
            onComplete: () => {
              this.artisanEl.textContent = `${itemData.artisan} • ${itemData.materials}`;
              gsap.to(this.artisanEl, { opacity: 1, duration: 0.28 });
            }
          });
        }

        if (this.exploreLinkEl && itemData.link) {
          this.exploreLinkEl.setAttribute('href', itemData.link);
        }
      }

      // Parallax slide transition
      gsap.set(incomingSlide, {
        yPercent: 100 * direction,
        opacity: 1,
        visibility: 'visible',
        zIndex: 3
      });
      gsap.set(outgoingSlide, { zIndex: 2 });
      if (incomingImg) gsap.set(incomingImg, { yPercent: -18 * direction, scale: 1.05 });

      const tl = gsap.timeline({
        onComplete: () => {
          outgoingSlide.classList.remove('is-active');
          incomingSlide.classList.add('is-active');
          gsap.set(outgoingSlide, { opacity: 0, visibility: 'hidden', yPercent: 0 });
          this.current = targetIndex;
          this.isAnimating = false;
        }
      });

      tl.to(outgoingSlide, {
        yPercent: -100 * direction,
        duration: 0.75,
        ease: 'power3.inOut'
      }, 0);

      if (outgoingImg) {
        tl.to(outgoingImg, {
          yPercent: 18 * direction,
          duration: 0.75,
          ease: 'power3.inOut'
        }, 0);
      }

      tl.to(incomingSlide, {
        yPercent: 0,
        duration: 0.75,
        ease: 'power3.inOut'
      }, 0);

      if (incomingImg) {
        tl.to(incomingImg, {
          yPercent: 0,
          scale: 1.02,
          duration: 0.75,
          ease: 'power3.inOut'
        }, 0);
      }

      // Trigger impulse on physics letters
      if (typeof this.onSlideChangeCallback === 'function') {
        this.onSlideChangeCallback(direction);
      }
    }
  }

  /* --------------------------------------------------------------------------
   * 3. STUDIO THIS "JEALOUS" ALIVE ZERO-G PHYSICS ENGINE ("ELYSIUM")
   * -------------------------------------------------------------------------- */
  class StudioThisElysium {
    constructor(container, heroEl) {
      this.container = container;
      this.heroEl = heroEl;
      this.engine = null;
      this.runner = null;
      this.letters = [];
      this.walls = [];
      this.mouseConstraint = null;
      this.width = heroEl.clientWidth || window.innerWidth;
      this.height = heroEl.clientHeight || window.innerHeight;
      this.mouseX = -1000;
      this.mouseY = -1000;
      this.isPaused = false;

      // Alive drift & collective wind parameters
      this.windImpulseX = 0;
      this.windImpulseY = 0;
      this.nextGustTime = 2.0;

      this.init();
    }

    init() {
      const { Engine, Runner, Composite, Mouse, MouseConstraint } = Matter;

      // 1. Zero-Gravity Engine for Weightless Organic Buoyancy
      this.engine = Engine.create({
        gravity: { x: 0, y: 0, scale: 0 },
        positionIterations: 10,
        velocityIterations: 8
      });

      this.runner = Runner.create();
      Runner.run(this.runner, this.engine);

      // 2. Setup Boundary Elastic Walls
      this.createWalls();

      // 3. Mount Massive Alive "ELYSIUM" Letters Across Upper/Mid Screen
      this.createAndDropLetters();

      // 4. Mouse Constraint for Grabbing & Throwing Letters
      const mouse = Mouse.create(this.heroEl);
      this.mouseConstraint = MouseConstraint.create(this.engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.25,
          damping: 0.1,
          render: { visible: false }
        }
      });
      Composite.add(this.engine.world, this.mouseConstraint);

      // 5. Setup Cursor Repulsion & Proximity Fluidity
      this.setupMouseRepulsor();

      // 6. Setup Scroll & Wheel Velocity Reactivity (Letters move when scrolling)
      this.setupScrollReactivity();

      // 7. Window Resize Handling
      window.addEventListener('resize', () => this.handleResize());

      // 8. Page Visibility Management
      document.addEventListener('visibilitychange', () => {
        this.isPaused = document.hidden;
      });

      // 9. Start 60fps Alive Simulation Loop
      this.tick();
    }

    createWalls() {
      const { Bodies, Composite } = Matter;
      const wallThickness = 240;
      const w = this.width;
      const h = this.height;

      // Generous boundary walls holding the floating letters inside the viewport
      this.ground = Bodies.rectangle(w / 2, h + wallThickness / 2 + 30, w * 2.5, wallThickness, { isStatic: true });
      this.ceiling = Bodies.rectangle(w / 2, -wallThickness / 2 - 30, w * 2.5, wallThickness, { isStatic: true });
      this.leftWall = Bodies.rectangle(-wallThickness / 2 - 30, h / 2, wallThickness, h * 3, { isStatic: true });
      this.rightWall = Bodies.rectangle(w + wallThickness / 2 + 30, h / 2, wallThickness, h * 3, { isStatic: true });

      this.walls = [this.ground, this.ceiling, this.leftWall, this.rightWall];
      Composite.add(this.engine.world, this.walls);
    }

    createAndDropLetters() {
      const { Bodies, Body, Composite } = Matter;
      const word = CONFIG.word.split('');
      const count = word.length;
      
      // Inject global SVG clipPath definitions for objectBoundingBox scaling
      let clipDefsSvg = document.getElementById('elysium-clip-defs');
      if (!clipDefsSvg) {
        clipDefsSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        clipDefsSvg.id = 'elysium-clip-defs';
        clipDefsSvg.setAttribute('aria-hidden', 'true');
        clipDefsSvg.style.cssText = 'position: absolute; width: 0; height: 0; pointer-events: none; overflow: hidden;';
        
        let defsHtml = '<defs>';
        for (const char in GLYPHS) {
          defsHtml += `<clipPath id="elysium-clip-${char}" clipPathUnits="objectBoundingBox"><path d="${GLYPHS[char].clipPath}" /></clipPath>`;
        }
        defsHtml += '</defs>';
        clipDefsSvg.innerHTML = defsHtml;
        this.container.appendChild(clipDefsSvg);
      }

      // Proportional letter sizing (~20% smaller for ideal compositional balance)
      const letterHeight = Math.max(140, Math.min(this.height * CONFIG.letterHeightVh, Math.min(this.width * 0.34, 430)));

      // Horizontal distribution ratios spanning across the viewport (E L Y S I U M)
      const xPositionsPercent = [0.11, 0.24, 0.37, 0.50, 0.63, 0.76, 0.89];

      word.forEach((char, idx) => {
        const glyph = GLYPHS[char] || GLYPHS['E'];
        const letterWidth = letterHeight * glyph.widthRatio;

        // Borderless Transparent Monochromatic Glass Lens container
        const el = document.createElement('div');
        el.className = 'physics-letter';
        el.style.width = `${letterWidth}px`;
        el.style.height = `${letterHeight}px`;

        el.innerHTML = `
          <div class="physics-letter-lens" style="clip-path: url(#elysium-clip-${char}); -webkit-clip-path: url(#elysium-clip-${char});"></div>
        `;

        this.container.appendChild(el);

        // Spawn position: Floating across upper/mid screen with organic diagonal offset
        const startX = (xPositionsPercent[idx] || ((idx + 0.8) / (count + 0.6))) * this.width;
        const startY = this.height * 0.40 + (Math.sin(idx * 1.3) * 45);

        // Matter.js rigid body with buoyancy
        const body = Bodies.rectangle(startX, startY, letterWidth * 0.88, letterHeight * 0.90, {
          restitution: CONFIG.restitution,
          friction: CONFIG.friction,
          frictionAir: CONFIG.frictionAir,
          density: CONFIG.density
        });

        // Subtle initial organic angle
        const angle = (idx % 2 === 0 ? 1 : -1) * (0.04 + Math.random() * 0.08);
        Body.setAngle(body, angle);
        Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 1.8,
          y: (Math.random() - 0.5) * 1.8
        });

        Composite.add(this.engine.world, body);

        this.letters.push({
          char,
          el,
          body,
          width: letterWidth,
          height: letterHeight,
          homeXPercent: xPositionsPercent[idx] || ((idx + 0.8) / (count + 0.6)),
          phaseOffset: idx * 1.15
        });
      });
    }

    setupMouseRepulsor() {
      this.heroEl.addEventListener('mousemove', (e) => {
        const rect = this.heroEl.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
      }, { passive: true });

      this.heroEl.addEventListener('mouseleave', () => {
        this.mouseX = -1000;
        this.mouseY = -1000;
      });
    }

    setupScrollReactivity() {
      // Dynamic scroll velocity listener: when user scrolls or uses trackpad, propel the letters
      const handleScrollImpulse = (deltaY) => {
        const clampedDelta = Math.max(-80, Math.min(80, deltaY));
        const { Body } = Matter;

        this.letters.forEach((item, idx) => {
          const forceY = -clampedDelta * 0.00016;
          const forceX = (idx - 3) * clampedDelta * 0.00005 + (Math.random() - 0.5) * 0.005;
          const torque = (idx % 2 === 0 ? 1 : -1) * clampedDelta * 0.000025;

          Body.applyForce(item.body, item.body.position, { x: forceX, y: forceY });
          Body.setAngularVelocity(item.body, item.body.angularVelocity + torque);
        });
      };

      window.addEventListener('wheel', (e) => {
        handleScrollImpulse(e.deltaY);
      }, { passive: true });

      let lastTouchY = null;
      window.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) lastTouchY = e.touches[0].clientY;
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0] && lastTouchY !== null) {
          const deltaY = lastTouchY - e.touches[0].clientY;
          lastTouchY = e.touches[0].clientY;
          handleScrollImpulse(deltaY * 2.5);
        }
      }, { passive: true });
    }

    triggerRandomGust() {
      // Spontaneous collective gust (moving randomly together up/down/left/right)
      const randomDirection = Math.random() * Math.PI * 2;
      const strength = 0.00045 + Math.random() * 0.00055;
      
      this.windImpulseX = Math.cos(randomDirection) * strength;
      this.windImpulseY = Math.sin(randomDirection) * strength;

      // Small rotational flutter
      const { Body } = Matter;
      this.letters.forEach(item => {
        const flutter = (Math.random() - 0.5) * 0.008;
        Body.setAngularVelocity(item.body, item.body.angularVelocity + flutter);
      });
    }

    applySlideTransitionImpulse(direction = 1) {
      const { Body } = Matter;
      // When user advances carousel, burst letters with an organic kinetic wave
      this.letters.forEach((item, idx) => {
        const forceY = -0.045 * (0.8 + Math.random() * 0.5) * direction;
        const forceX = ((idx - 3) * 0.008) + (Math.random() - 0.5) * 0.02;
        
        Body.applyForce(item.body, item.body.position, { x: forceX, y: forceY });
        Body.setAngularVelocity(item.body, item.body.angularVelocity + (Math.random() - 0.5) * 0.04);
      });
    }

    tick() {
      if (!this.isPaused) {
        const { Body } = Matter;
        const time = performance.now() * 0.001;

        // Check if it's time for a spontaneous collective gust
        if (time > this.nextGustTime) {
          this.triggerRandomGust();
          this.nextGustTime = time + 2.5 + Math.random() * 2.5;
        }

        // Global multi-wave wandering drift (moving randomly together)
        const globalDriftX = (Math.sin(time * 0.42) * 0.00035) + (Math.sin(time * 0.95 + 1.2) * 0.00022) + this.windImpulseX;
        const globalDriftY = (Math.cos(time * 0.38) * 0.00035) + (Math.sin(time * 0.82 + 2.1) * 0.00022) + this.windImpulseY;

        // Smoothly decay instantaneous wind impulse
        this.windImpulseX *= 0.985;
        this.windImpulseY *= 0.985;

        this.letters.forEach((item, idx) => {
          const body = item.body;
          const pos = body.position;

          // Home equilibrium anchor (loosely keeping them spanning the upper/middle screen)
          const homeX = item.homeXPercent * this.width;
          const homeY = this.height * 0.40 + (Math.sin(time * 0.65 + item.phaseOffset) * 35);

          // Soft restoring spring force
          const springX = (homeX - pos.x) * 0.000035;
          const springY = (homeY - pos.y) * 0.000048;

          // Individual organic flutter & rotational breathing
          const localDriftX = Math.sin(time * 1.15 + idx * 1.4) * 0.00018;
          const localDriftY = Math.cos(time * 0.92 + idx * 1.8) * 0.00018;
          const rotationalWobble = Math.sin(time * 0.85 + idx * 1.2) * 0.00012;

          // Apply combined alive floating forces
          Body.applyForce(body, pos, {
            x: globalDriftX + localDriftX + springX,
            y: globalDriftY + localDriftY + springY
          });

          Body.setAngularVelocity(body, body.angularVelocity * 0.98 + rotationalWobble);

          // Interactive Mouse Repulsion Force
          if (this.mouseX > 0 && this.mouseY > 0) {
            const dx = pos.x - this.mouseX;
            const dy = pos.y - this.mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < CONFIG.repelRadius && dist > 1) {
              const factor = (1 - dist / CONFIG.repelRadius);
              const force = factor * CONFIG.repelStrength;
              const nx = dx / dist;
              const ny = dy / dist;

              Body.applyForce(body, pos, {
                x: nx * force,
                y: ny * force
              });
            }
          }

          // Sync DOM element position and rotation every frame
          const renderX = pos.x - item.width / 2;
          const renderY = pos.y - item.height / 2;
          item.el.style.transform = `translate3d(${renderX}px, ${renderY}px, 0) rotate(${body.angle}rad)`;
        });
      }

      requestAnimationFrame(() => this.tick());
    }

    handleResize() {
      const { Body } = Matter;
      this.width = this.heroEl.clientWidth || window.innerWidth;
      this.height = this.heroEl.clientHeight || window.innerHeight;

      const wallThickness = 240;
      const w = this.width;
      const h = this.height;

      Body.setPosition(this.ground, { x: w / 2, y: h + wallThickness / 2 + 30 });
      Body.setPosition(this.ceiling, { x: w / 2, y: -wallThickness / 2 - 30 });
      Body.setPosition(this.leftWall, { x: -wallThickness / 2 - 30, y: h / 2 });
      Body.setPosition(this.rightWall, { x: w + wallThickness / 2 + 30, y: h / 2 });
    }
  }

  /* --------------------------------------------------------------------------
   * 4. BOOTSTRAP SHOWCASE
   * -------------------------------------------------------------------------- */
  function initShowcase() {
    const wrapperEl = document.querySelector('.categories-page-wrapper');
    const heroEl = document.getElementById('showcase-hero');
    const lettersContainer = document.getElementById('physics-letters-layer');

    if (!wrapperEl || !heroEl || !lettersContainer || typeof Matter === 'undefined') return;

    // 1. Start Studio This word drop physics
    const physicsEngine = new StudioThisElysium(lettersContainer, heroEl);

    // 2. Start ScrollTrigger pinned carousel
    new ShowcaseSlider(wrapperEl, heroEl, (direction) => {
      if (physicsEngine) {
        physicsEngine.applySlideTransitionImpulse(direction);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShowcase);
  } else {
    initShowcase();
  }

})();
