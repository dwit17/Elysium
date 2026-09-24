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
          gestureOrientation: 'vertical',
          smoothWheel: true,
          smoothTouch: false, // Keep native touch physics on mobile for responsive gestures
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

        // lagSmoothing(0) ensures instant frame synchronization without sluggish lag
        gsap.ticker.lagSmoothing(0);
        window.__elysiumLenis = lenisInstance;
        console.log('[Elysium GSAP] Lenis smooth scroll initialized & bridged to GSAP ticker.');
      } catch (err) {
        console.warn('[Elysium GSAP] Lenis scroller fallback:', err);
      }
    }
  }

  /**
   * 1. SECTION 1 — ATELIER REVEAL (LUSION-INSPIRED WEBGL SCROLL-SYNC ARCHITECTURE)
   * Synchronized WebGL Quad with velocity-driven fluid silk/liquid displacement shader.
   * Completely continuous, micro-scroll responsive, and 100% reversible.
   */
    /**
   * 1. SECTION 2 — 1:1 LUSION RECREATION (WEBGL 3D RIBBON & VELOCITY WARP SHOWREEL)
   * Exact match to Lusion.co section 2 scroll choreography:
   * - Giant 2-line headline with Line 1 inset to align right edges
   * - Explainer paragraph & pill button with magnetic hover
   * - 3D Blue ribbon / Catmull-Rom tube snaking across scene
   * - Warping quad expanding from bottom-left card into full docked reel frame
   * - Velocity-driven vertex shader bending & duotone-to-full-color crossfade
   * - "PLAY ▶ ATELIER" text reveal & white play pill scaling between words
   * - 5-column '+' registration marks rotating and scaling in
   * - Fullscreen showreel modal on click
   */
  function initLusionSection2() {
    const section = document.getElementById('section-lusion-reel');
    const stage = document.getElementById('lusion-reel-stage');
    const canvas = document.getElementById('lusion-webgl-canvas');
    if (!section || !stage || !canvas || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const intro = document.getElementById('lusion-reel-intro');
    const dockedUi = document.getElementById('lusion-reel-ui');
    const playWordLeft = section.querySelector('.lusion-word-left');
    const playWordRight = section.querySelector('.lusion-word-right');
    const playPill = document.getElementById('lusion-play-pill');
    const playTrigger = document.getElementById('lusion-play-trigger');
    const plusMarks = section.querySelectorAll('.lusion-reg-plus');

    // Solid SVG Drawing Ribbon Path Elements
    const drawPathCore = document.getElementById('lusion-draw-path-core');
    const svgLineWrap = document.getElementById('lusion-reel-svg-container');

    let pathLength = 3600;
    if (drawPathCore) {
      try {
        pathLength = drawPathCore.getTotalLength() || 3600;
      } catch (e) {
        pathLength = 3600;
      }
    }

    if (drawPathCore) {
      gsap.set(drawPathCore, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });
    }
    if (svgLineWrap) {
      gsap.set(svgLineWrap, { opacity: 1 });
    }

    // Showreel Modal Elements
    const modal = document.getElementById('lusion-video-modal');
    const modalClose = document.getElementById('lusion-modal-close');
    const modalImg = document.getElementById('lusion-modal-img');
    const modalTimer = document.getElementById('lusion-modal-timer');

    // Hard-Cut Showreel Montage Frames
    const montageImages = [
      '/images/chapter_living_room.jpg',
      '/images/story_clay_vessel.jpg',
      '/images/atelier_materials.jpg',
      '/images/chapter_bedroom.jpg'
    ];
    let montageIdx = 0;
    let montageInterval = null;

    // ── REEL MONTAGE TEXTURE GENERATOR ──
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = 1280;
    offscreenCanvas.height = 720;
    const offCtx = offscreenCanvas.getContext('2d');
    const loadedMontageImgs = [];
    let montageReady = false;

    montageImages.forEach((src, idx) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        loadedMontageImgs[idx] = img;
        if (loadedMontageImgs.filter(Boolean).length === montageImages.length) {
          montageReady = true;
          drawCurrentMontageFrame();
        }
      };
      img.src = src;
    });

    function drawCurrentMontageFrame() {
      if (!montageReady || !offCtx) return;
      const curImg = loadedMontageImgs[montageIdx];
      if (curImg) {
        offCtx.drawImage(curImg, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
      }
    }

    function startMontageCycling() {
      if (montageInterval) clearInterval(montageInterval);
      montageInterval = setInterval(() => {
        montageIdx = (montageIdx + 1) % montageImages.length;
        drawCurrentMontageFrame();
        if (modal && modal.classList.contains('active') && modalImg) {
          modalImg.src = montageImages[montageIdx];
          if (modalTimer) {
            modalTimer.textContent = '00:0' + (montageIdx + 1) + ' / 00:0' + montageImages.length;
          }
        }
      }, 1300);
    }
    startMontageCycling();

    // ── WEBGL LIQUID & 3D SPLINE SHADER PIPELINE ──
    let targetProgress = 0;
    let currentProgress = 0;
    let lastProgress = 0;
    let rawVelocity = 0;
    let smoothedVelocity = 0;
    let isSectionVisible = true;

    function initWebGL() {
      let gl = null;
      try {
        gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false }) || canvas.getContext('experimental-webgl');
      } catch (e) {
        gl = null;
      }
      if (!gl) return null;

      const vsSource = `
        precision highp float;
        attribute vec2 aPosition;
        attribute vec2 aTexCoord;

        uniform float uProgress;
        uniform float uVelocity;
        uniform vec2 uResolution;

        varying vec2 vUv;
        varying vec2 vQuadPos;
        varying vec2 vQuadSize;
        varying float vDuotoneMix;

        void main() {
          vUv = aTexCoord;
          float p = clamp(uProgress, 0.0, 1.0);
          float aspect = uResolution.x / max(uResolution.y, 1.0);

          // Starting card position: bottom-left aligned matching Lusion.co
          vec2 startCenter = vec2(-0.50, -0.34);
          vec2 startSize = vec2(0.44, 0.44 / aspect * 1.55);

          // Docked card position: centered full viewport frame
          vec2 endCenter = vec2(0.0, 0.0);
          vec2 endSize = vec2(0.908, 0.75);

          // Smooth cubic expansion
          float expandEased = smoothstep(0.14, 0.78, p);
          vec2 currentCenter = mix(startCenter, endCenter, expandEased);
          vec2 currentSize = mix(startSize, endSize, expandEased);

          vQuadPos = currentCenter;
          vQuadSize = currentSize;
          vDuotoneMix = 1.0 - smoothstep(0.22, 0.72, p);

          vec2 localPos = aPosition;

          // Subtle natural velocity inertia tilt during scroll
          float velFactor = (1.0 - smoothstep(0.70, 0.95, p));
          float skewX = localPos.y * uVelocity * 0.035 * velFactor;
          float lagY = -abs(uVelocity) * 0.018 * velFactor * (1.0 - abs(localPos.x));

          vec2 finalPos = currentCenter + (localPos * currentSize);
          finalPos.x += skewX;
          finalPos.y += lagY;

          gl_Position = vec4(finalPos.x, finalPos.y, 0.0, 1.0);
        }
      `;

      const fsSource = `
        precision highp float;
        varying vec2 vUv;
        varying vec2 vQuadPos;
        varying vec2 vQuadSize;
        varying float vDuotoneMix;

        uniform sampler2D uTexture0;
        uniform sampler2D uTexture1;
        uniform float uProgress;
        uniform float uTime;
        uniform float uVelocity;
        uniform vec2 uResolution;
        uniform float uRadius;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 q = abs(p) - b + r;
          return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
        }

        void main() {
          float p = clamp(uProgress, 0.0, 1.0);
          
          vec2 uv = vUv;
          vec4 col0 = texture2D(uTexture0, uv);
          vec4 col1 = texture2D(uTexture1, uv);

          float crossfade = smoothstep(0.25, 0.65, p);
          vec4 naturalCol = mix(col0, col1, crossfade);

          float luma = dot(naturalCol.rgb, vec3(0.299, 0.587, 0.114));
          vec3 duotoneDark = vec3(0.16, 0.20, 0.96);
          vec3 duotoneLight = vec3(0.88, 0.90, 1.00);
          vec3 duotoneCol = mix(duotoneDark, duotoneLight, luma);

          vec3 finalRgb = mix(naturalCol.rgb, duotoneCol, vDuotoneMix * 0.94);

          vec2 pixelCoord = (vUv - 0.5) * (vQuadSize * uResolution);
          vec2 halfBox = (vQuadSize * uResolution) * 0.5;
          float d = roundedBoxSDF(pixelCoord, halfBox, uRadius);
          float alpha = 1.0 - smoothstep(0.0, 2.0, d);

          if (alpha <= 0.001) discard;

          gl_FragColor = vec4(finalRgb, alpha);
        }
      `;

      function createShader(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
          console.warn('[WebGL Lusion] Shader compile error:', gl.getShaderInfoLog(s));
          gl.deleteShader(s);
          return null;
        }
        return s;
      }

      const vs = createShader(gl.VERTEX_SHADER, vsSource);
      const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
      if (!vs || !fs) return null;

      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.warn('[WebGL Lusion] Program link error:', gl.getProgramInfoLog(program));
        return null;
      }
      gl.useProgram(program);

      const gridX = 24;
      const gridY = 24;
      const positions = [];
      const uvs = [];
      const indices = [];

      for (let y = 0; y <= gridY; y++) {
        const v = y / gridY;
        const py = (v * 2.0 - 1.0);
        for (let x = 0; x <= gridX; x++) {
          const u = x / gridX;
          const px = (u * 2.0 - 1.0);
          positions.push(px, py);
          uvs.push(u, 1.0 - v);
        }
      }

      for (let y = 0; y < gridY; y++) {
        for (let x = 0; x < gridX; x++) {
          const row1 = y * (gridX + 1);
          const row2 = (y + 1) * (gridX + 1);
          indices.push(row1 + x, row2 + x, row1 + x + 1);
          indices.push(row1 + x + 1, row2 + x, row2 + x + 1);
        }
      }

      const posBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

      const aPosition = gl.getAttribLocation(program, 'aPosition');
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

      const uvBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);

      const aTexCoord = gl.getAttribLocation(program, 'aTexCoord');
      gl.enableVertexAttribArray(aTexCoord);
      gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 0, 0);

      const indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

      const uTexture0Loc = gl.getUniformLocation(program, 'uTexture0');
      const uTexture1Loc = gl.getUniformLocation(program, 'uTexture1');
      const uProgressLoc = gl.getUniformLocation(program, 'uProgress');
      const uVelocityLoc = gl.getUniformLocation(program, 'uVelocity');
      const uTimeLoc = gl.getUniformLocation(program, 'uTime');
      const uResolutionLoc = gl.getUniformLocation(program, 'uResolution');
      const uRadiusLoc = gl.getUniformLocation(program, 'uRadius');

      const tex0 = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex0);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([79, 67, 244, 255]));

      const mainImg = new Image();
      mainImg.crossOrigin = 'anonymous';
      mainImg.onload = () => {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex0);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mainImg);
      };
      mainImg.src = canvas.dataset.src || '/images/atelier-immersive.jpg';

      const tex1 = gl.createTexture();
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, tex1);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([43, 47, 232, 255]));

      function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = stage.clientWidth || window.innerWidth;
        const h = stage.clientHeight || window.innerHeight;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      resize();

      function render(time, vel, progress) {
        if (!isSectionVisible) return;

        gl.useProgram(program);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        if (montageReady) {
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, tex1);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, offscreenCanvas);
        }

        gl.uniform1i(uTexture0Loc, 0);
        gl.uniform1i(uTexture1Loc, 1);
        gl.uniform1f(uProgressLoc, progress);
        gl.uniform1f(uVelocityLoc, vel);
        gl.uniform1f(uTimeLoc, time);
        gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);
        gl.uniform1f(uRadiusLoc, 22.0 * Math.min(window.devicePixelRatio || 1, 2));

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
      }

      return { render, resize };
    }

    const webglApi = initWebGL();

    // ── MASTER GSAP SCROLLTRIGGER TIMELINE ──
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      gsap.set(intro, { opacity: 1, y: 0 });
      gsap.set(dockedUi, { opacity: 0 });
      gsap.set(playWordLeft, { x: -60, opacity: 0 });
      gsap.set(playWordRight, { x: 60, opacity: 0 });
      gsap.set(playPill, { scale: 0.35, opacity: 0 });
      gsap.set(plusMarks, { scale: 0, rotation: 0, opacity: 0 });

      const masterTl = gsap.timeline({ defaults: { ease: 'none' } });

      masterTl.to(intro, {
        y: -100,
        opacity: 0,
        duration: 0.28,
        ease: 'power2.inOut',
      }, 0.00);

      if (drawPathCore) {
        masterTl.to(drawPathCore, {
          strokeDashoffset: 0,
          duration: 0.72,
          ease: 'none',
        }, 0.00);

        if (svgLineWrap) {
          masterTl.to(svgLineWrap, {
            opacity: 0,
            duration: 0.12,
            ease: 'power2.out',
          }, 0.58);
        }
      }

      masterTl.to(dockedUi, { opacity: 1, pointerEvents: 'auto', duration: 0.12,
        ease: 'power1.out',
      }, 0.70);

      masterTl.to([playWordLeft, playWordRight], {
        x: 0,
        opacity: 1,
        duration: 0.16,
        ease: 'power2.out',
      }, 0.72);

      masterTl.to(playPill, {
        scale: 1.0,
        opacity: 1,
        duration: 0.18,
        ease: 'back.out(1.6)',
      }, 0.74);

      masterTl.to(plusMarks, {
        scale: 1.0,
        rotation: 90,
        opacity: 0.65,
        stagger: 0.02,
        duration: 0.18,
        ease: 'power2.out',
      }, 0.73);

      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=2400',
        pin: stage,
        scrub: 0.5,
        anticipatePin: 1,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
        animation: masterTl,
        onUpdate: (self) => {
          targetProgress = self.progress;
        },
        onToggle: (self) => {
          isSectionVisible = self.isActive;
        },
      });

      return () => {
        if (st) st.kill();
      };
    });

    mm.add('(max-width: 1023px)', () => {
      gsap.set(intro, { opacity: 1, y: 0 });
      gsap.set(dockedUi, { opacity: 1 });
      gsap.set([playWordLeft, playWordRight, playPill, plusMarks], { opacity: 1, x: 0, scale: 1 });

      if (drawPathCore) {
        gsap.to(drawPathCore, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=1600',
            scrub: 0.4,
          }
        });
      }

      const mobileSt = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=1600',
        pin: stage,
        scrub: 0.4,
        anticipatePin: 1,
        onUpdate: (self) => {
          targetProgress = self.progress;
        },
      });

      return () => {
        if (mobileSt) mobileSt.kill();
      };
    });

    let startTime = performance.now();
    const tickerCallback = () => {
      if (!isSectionVisible) return;
      const now = performance.now();
      const elapsed = (now - startTime) * 0.001;

      currentProgress += (targetProgress - currentProgress) * 0.18;
      rawVelocity = (currentProgress - lastProgress) * 60.0;
      smoothedVelocity += (rawVelocity - smoothedVelocity) * 0.20;
      lastProgress = currentProgress;

      if (webglApi) {
        const vClamped = Math.max(-1.0, Math.min(1.0, smoothedVelocity * 0.4));
        webglApi.render(elapsed, vClamped, currentProgress);
      }

      // Track particle head along SVG path
      if (drawPathCore && pathHead) {
        const ribbonProgress = Math.max(0, Math.min(1, currentProgress / 0.72));
        const dist = ribbonProgress * pathLength;
        if (dist > 5 && currentProgress < 0.88) {
          try {
            const pt = drawPathCore.getPointAtLength(dist);
            pathHead.setAttribute('transform', 'translate(' + pt.x + ',' + pt.y + ')');
            gsap.set(pathHead, { opacity: currentProgress > 0.01 ? 1 : 0 });
          } catch (e) {}
        } else {
          gsap.set(pathHead, { opacity: 0 });
        }
      }
    };

    gsap.ticker.add(tickerCallback);

    window.addEventListener('resize', () => {
      if (webglApi) webglApi.resize();
    });

    function openModal() {
      if (!modal) return;
      modal.classList.add('active');
      gsap.to(modal, { opacity: 1, pointerEvents: 'auto', duration: 0.35, ease: 'power2.out' });
      if (modalImg) modalImg.src = montageImages[montageIdx];
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove('active');
      gsap.to(modal, { opacity: 0, pointerEvents: 'none', duration: 0.25, ease: 'power2.in' });
    }

    if (playTrigger) playTrigger.addEventListener('click', openModal);
    if (playPill) playPill.addEventListener('click', (e) => { e.stopPropagation(); openModal(); });
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        closeModal();
      }
    });

    console.log('[Elysium Motion] Section 2: 1:1 Lusion Recreation Engine initialized.');
  }

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
   * 3B+4. UNIFIED PROCESS TRACE — Wave Bend + Craft Journey merged into one scroll system.
   * One pinned ScrollTrigger owns all scroll progress:
   *   — path draw (strokeDashoffset)
   *   — tracer position (getPointAtLength)
   *   — 4 node illuminations (data-progress thresholds)
   *   — 4 craft stage activations (same thresholds)
   *   — atelier countup (at stage 1 threshold)
   * Node SVG positions derived from path geometry, never hard-coded coordinates.
   */
  /**
   * 3B+4. UNIFIED PROCESS TRACE — Dynamic Layout-Calibrated Wave Motion System
   * Wave path and waypoints are calculated directly from physical DOM layout markers:
   *   — Start Anchor (Editorial frame)
   *   — 4 Stage Anchors (Raw Sourcing -> Hand Sculpting -> Beeswax Curing -> Atelier Authentication)
   *   — End Anchor (Transformation Before/After Slider)
   * SVG coordinates match screen pixels 1:1 with zero distortion.
   * Path length, thresholds, node positions, and tracer motion are calculated dynamically.
   */
  /**
   * 3B. LIVING SANCTUARY — Vine-Growth Scroll Animation
   *
   * Root-cause fixes in this rebuild:
   *  1. CONTAINER BUG: The vine mount is now created by JS and appended as a
   *     DIRECT CHILD of #living-sanctuary-container (position:relative, full
   *     viewport width). Previously it was inside the constrained max-w-7xl
   *     inner content div, so the SVG was painted in a narrow box while badge
   *     coordinates measured against the full section — causing the left-edge drift.
   *
   *  2. COORDINATE SYSTEM: SVG uses NO viewBox. Width/height = section CSS px.
   *     Anchors measured via getBoundingClientRect relative to the SECTION rect.
   *     Since 1 SVG unit = 1 CSS px and mount is absolute inset-0 in section,
   *     all coordinates are inherently correct at every scroll position.
   *
   *  3. VINE X POSITION: Fixed left-gutter position per breakpoint, computed
   *     from the section's own padding, so the vine always lives in whitespace
   *     and never crosses image or text content.
   *
   *  4. ALL 5 LEAVES: Y positions measured from station container centers
   *     (full-width block elements), not waypoint badges (which can be outside
   *     the parent box with negative offsets, drifting the old fixed viewBox).
   *
   *  5. IMMEDIATE START: ScrollTrigger start: 'top bottom' — vine begins growing
   *     the moment the section's top edge enters the viewport bottom.
   */
  /**
   * 3B. LIVING SANCTUARY — Botanical Vine & Blooming Leaves Engine
   *
   * Features & Fixes:
   *  1. FULL-SECTION PATH: Spans from top header (Y ~30px) through all 5 waypoint anchors
   *     down to section bottom (Y ~height - 30px).
   *  2. EXPLICIT SVG SIZING: Sets width, height, and viewBox to exact container bounding rect,
   *     preventing left-edge squeezing or clipping across all viewports.
   *  3. GSAP SCRUB TIMING: Scrub starts at 'top 70%' and completes at 'bottom 85%' so the growing
   *     vine tip is continuously visible in viewport during scrolling.
   *  4. GSAP LEAF BLOOM ANIMATIONS: High-fidelity botanical leaf clusters with blades, veins,
   *     and tendrils animated directly via GSAP timelines for guaranteed cross-browser motion.
   *  5. DYNAMIC REFLOW: Debounced ResizeObserver + image/font settle handling.
   */
  function initLivingSanctuarySection() {
    const section = document.getElementById('living-sanctuary-container');
    const track   = document.getElementById('sanctuary-journey-track');
    if (!section || !track || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const stationEls = Array.from(track.querySelectorAll('.sanctuary-station'));
    const WP_IDS     = ['sanctuary-wp-1', 'sanctuary-wp-2', 'sanctuary-wp-3', 'sanctuary-wp-4', 'sanctuary-wp-5'];
    const SVG_NS     = 'http://www.w3.org/2000/svg';

    // ── Reduced-motion: reveal everything instantly ───────────────────────────
    if (prefersReducedMotion) {
      stationEls.forEach((s) => s.classList.add('is-active'));
      WP_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.classList.add('is-active');
      });
      return;
    }

    // ── Create vine mount as SECTION-LEVEL child ──────────────────────────────
    let mount = document.getElementById('sanctuary-vine-mount');
    if (!mount) {
      mount = document.createElement('div');
      mount.id = 'sanctuary-vine-mount';
      mount.className = 'sanctuary-vine-mount';
      section.appendChild(mount);
    }

    // ── Internal state ────────────────────────────────────────────────────────
    let leafClusters = [];
    let pathTweens   = [];
    let leafSTs      = [];
    let resizeTimer  = null;
    let isInitialized = false;

    // ── SVG element helper ────────────────────────────────────────────────────
    function mk(tag, attrs, classes) {
      const el = document.createElementNS(SVG_NS, tag);
      if (attrs) {
        for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
      }
      if (classes) classes.forEach((c) => el.classList.add(c));
      return el;
    }

    // ── Measure anchor points & station image card centers ───────────────────
    function getAnchors() {
      const secRect = section.getBoundingClientRect();
      const anchors = [];

      WP_IDS.forEach((id, i) => {
        const badge = document.getElementById(id);
        const st = stationEls[i];
        if (!badge) return;

        const r = badge.getBoundingClientRect();
        let bx = (r.left + r.right) / 2 - secRect.left;
        let by = (r.top + r.bottom) / 2 - secRect.top;

        // Measure the specific image card frame for exact center-to-center green dot anchors
        const card = st ? (st.querySelector('.sanctuary-card-frame') || st) : null;
        let cardCx = bx;
        let cardTop = by;
        let cardBottom = by + 420;

        if (card) {
          const cr = card.getBoundingClientRect();
          cardCx = (cr.left + cr.right) / 2 - secRect.left;
          cardTop = cr.top - secRect.top;
          cardBottom = cr.bottom - secRect.top;
        }

        // Station 5 (Center Crown Section)
        if (i === 4) {
          cardCx = secRect.width * 0.5;
          cardTop = by - 15;
          cardBottom = by + 20;
        }

        anchors.push({
          badgeX: bx,
          badgeY: by,
          el: badge,
          stationEl: st,
          idx: i,
          cardCx,
          cardTop,
          cardBottom,
        });
      });

      return anchors;
    }

    // ── Leaf-cluster configurations: radiating into the open space between cards
    const LEAF_CONFIGS = [
      // Node 1 (Station 1 bottom-center - radiates down into open gap)
      [
        { rot: 45, sz: 16, sweep: 1 },
        { rot: 135, sz: 16, sweep: -1 },
        { rot: 90, sz: 14, sweep: 1 },
        { rot: 0, sz: 13, sweep: -1 },
        { rot: 180, sz: 13, sweep: 1 },
      ],
      // Node 2 (Station 2 top-center - radiates up into open gap)
      [
        { rot: -45, sz: 16, sweep: -1 },
        { rot: -135, sz: 16, sweep: 1 },
        { rot: -90, sz: 14, sweep: -1 },
        { rot: 0, sz: 13, sweep: 1 },
        { rot: -180, sz: 13, sweep: -1 },
      ],
      // Node 3 (Station 3 bottom-center - radiates down into open gap)
      [
        { rot: 45, sz: 16, sweep: 1 },
        { rot: 135, sz: 16, sweep: -1 },
        { rot: 90, sz: 14, sweep: 1 },
        { rot: 0, sz: 13, sweep: -1 },
        { rot: 180, sz: 13, sweep: 1 },
      ],
      // Node 4 (Station 4 top-center - radiates up into open gap)
      [
        { rot: -45, sz: 16, sweep: -1 },
        { rot: -135, sz: 16, sweep: 1 },
        { rot: -90, sz: 14, sweep: -1 },
        { rot: 0, sz: 13, sweep: 1 },
        { rot: -180, sz: 13, sweep: -1 },
      ],
      // Node 5 (Station 5 Center Crown - grand radial crown)
      [
        { rot: -60, sz: 19, sweep: 1 },
        { rot: 60, sz: 19, sweep: -1 },
        { rot: -15, sz: 17, sweep: 1 },
        { rot: 15, sz: 17, sweep: -1 },
        { rot: -140, sz: 15, sweep: 1 },
        { rot: 140, sz: 15, sweep: -1 },
        { rot: 180, sz: 14, sweep: 1 },
      ],
    ];

    function buildLeafCluster(svg, cx, cy, stationIdx, isTerminal) {
      const configs = LEAF_CONFIGS[stationIdx] || LEAF_CONFIGS[0];

      const group = mk('g', {}, ['sanctuary-leaf-cluster']);

      // 1. Center glowing green/white pearl node
      group.appendChild(mk('circle', {
        cx: cx.toFixed(1),
        cy: cy.toFixed(1),
        r: isTerminal ? 4.5 : 3.5,
        fill: '#ffffff',
      }, ['node-gem']));

      // 2. Spiraling tendrils (curling into the open gap)
      const tendrilAngles = isTerminal
        ? [-60, 60, -140, 140]
        : (stationIdx % 2 === 0 ? [60, 120] : [-60, -120]);

      tendrilAngles.forEach((angle) => {
        const rad = (angle * Math.PI) / 180;
        const len = isTerminal ? 26 : 20;
        const tEndX = cx + Math.cos(rad) * len;
        const tEndY = cy + Math.sin(rad) * len;
        const tCp1X = cx + Math.cos(rad - 0.4) * (len * 0.6);
        const tCp1Y = cy + Math.sin(rad - 0.4) * (len * 0.6);
        const tCp2X = cx + Math.cos(rad + 0.3) * (len * 0.9);
        const tCp2Y = cy + Math.sin(rad + 0.3) * (len * 0.9);

        const tendrilD = `M ${cx.toFixed(1)},${cy.toFixed(1)} C ${tCp1X.toFixed(1)},${tCp1Y.toFixed(1)} ${tCp2X.toFixed(1)},${tCp2Y.toFixed(1)} ${tEndX.toFixed(1)},${tEndY.toFixed(1)}`;
        const tendril = mk('path', {
          d: tendrilD,
          stroke: 'rgba(255,255,255,0.7)',
          'stroke-width': '0.9',
          fill: 'none',
          'vector-effect': 'non-scaling-stroke',
        }, ['vine-tendril']);
        group.appendChild(tendril);
      });

      // 3. Radiating leaf blades
      configs.forEach(({ rot, sz, sweep }) => {
        const lg = mk('g', { transform: `rotate(${rot},${cx.toFixed(1)},${cy.toFixed(1)})` });

        const sw = sweep || 1;
        const bladeD = [
          `M ${cx.toFixed(1)},${cy.toFixed(1)}`,
          `C ${(cx + sz * 0.65).toFixed(1)},${(cy - sz * 0.45 * sw).toFixed(1)}`,
          `  ${(cx + sz * 1.95).toFixed(1)},${(cy - sz * 0.18 * sw).toFixed(1)}`,
          `  ${(cx + sz * 2.3).toFixed(1)},${cy.toFixed(1)}`,
          `C ${(cx + sz * 1.95).toFixed(1)},${(cy + sz * 0.18 * sw).toFixed(1)}`,
          `  ${(cx + sz * 0.65).toFixed(1)},${(cy + sz * 0.45 * sw).toFixed(1)}`,
          `  ${cx.toFixed(1)},${cy.toFixed(1)} Z`,
        ].join(' ');

        const veinD = `M ${cx.toFixed(1)},${cy.toFixed(1)} Q ${(cx + sz * 1.15).toFixed(1)},${(cy - sz * 0.05 * sw).toFixed(1)} ${(cx + sz * 2.25).toFixed(1)},${cy.toFixed(1)}`;

        lg.appendChild(mk('path', {
          d: bladeD,
          stroke: '#ffffff',
          'stroke-width': '1.0',
          fill: 'rgba(255,255,255,0.12)',
          'vector-effect': 'non-scaling-stroke',
        }, ['leaf-blade']));

        lg.appendChild(mk('path', {
          d: veinD,
          stroke: 'rgba(255,255,255,0.6)',
          'stroke-width': '0.6',
          fill: 'none',
          'vector-effect': 'non-scaling-stroke',
        }, ['leaf-vein']));

        group.appendChild(lg);
      });

      // Set initial dormant state for GSAP blooming
      gsap.set(group, { scale: 0, opacity: 0, transformOrigin: `${cx}px ${cy}px` });

      svg.appendChild(group);
      return { group, cx, cy, isTerminal };
    }

    // ── Full SVG rebuild ──────────────────────────────────────────────────────
    function buildSVG(anchors) {
      while (mount.firstChild) mount.removeChild(mount.firstChild);
      leafSTs.forEach((st) => st.kill());
      leafSTs = [];
      pathTweens.forEach((tw) => {
        if (tw.scrollTrigger) tw.scrollTrigger.kill();
        tw.kill();
      });
      pathTweens = [];
      leafClusters = [];

      if (!anchors || anchors.length < 2) return;

      const secRect = section.getBoundingClientRect();
      const secW = Math.max(320, secRect.width);
      const secH = Math.max(600, secRect.height);

      // Explicit SVG sizing and viewBox to guarantee 1:1 pixel coordinate space
      const svg = mk('svg', {
        viewBox: `0 0 ${secW.toFixed(1)} ${secH.toFixed(1)}`,
        width: `${secW.toFixed(1)}`,
        height: `${secH.toFixed(1)}`,
        fill: 'none',
        xmlns: SVG_NS,
      }, ['sanctuary-dynamic-svg']);

      // ── Build Segment-by-Segment S-Curves in open space between cards ───────
      for (let i = 0; i < anchors.length - 1; i++) {
        const cur = anchors[i];
        const next = anchors[i + 1];

        // Green dot 1: Horizontal center of bottom edge of current image
        const startX = cur.cardCx;
        const startY = cur.cardBottom;

        // Green dot 2: Horizontal center of top edge of next image
        const endX = next.cardCx;
        const endY = next.cardTop;

        const dy = Math.max(60, endY - startY);

        // Smooth cubic Bézier S-curve with vertical departure and arrival
        const cp1x = startX;
        const cp1y = startY + dy * 0.52;
        const cp2x = endX;
        const cp2y = endY - dy * 0.52;

        const segD = `M ${startX.toFixed(1)},${startY.toFixed(1)} C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${endX.toFixed(1)},${endY.toFixed(1)}`;

        // 1. Subtle dotted guide trace
        svg.appendChild(mk('path', {
          d: segD,
          stroke: 'rgba(255,255,255,0.08)',
          'stroke-width': '1.2',
          'stroke-dasharray': '3 10',
          'vector-effect': 'non-scaling-stroke',
        }, ['sanctuary-guide-path']));

        // 2. Diffuse glowing aura path
        const segGlow = mk('path', {
          d: segD,
          stroke: 'rgba(255,255,255,0.22)',
          'stroke-width': '4.5',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'vector-effect': 'non-scaling-stroke',
        }, ['sanctuary-glow-path']);
        svg.appendChild(segGlow);

        // 3. Sharp core drawing vine path
        const segDraw = mk('path', {
          d: segD,
          stroke: '#ffffff',
          'stroke-width': '2.0',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'vector-effect': 'non-scaling-stroke',
        }, ['sanctuary-draw-path']);
        svg.appendChild(segDraw);

        // Measure path length and prepare for scrubbed draw
        let segLen = 1200;
        try {
          segLen = segDraw.getTotalLength() || 1200;
        } catch (e) {}

        gsap.set(segDraw, { strokeDasharray: segLen, strokeDashoffset: segLen });
        gsap.set(segGlow, { strokeDasharray: segLen, strokeDashoffset: segLen });

        // Calibrated ScrollTrigger per station gap: draws as gap enters viewport
        const fromEl = cur.stationEl || cur.el;
        const toEl = next.stationEl || next.el;

        const twDraw = gsap.to(segDraw, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: fromEl,
            start: 'bottom 90%',
            endTrigger: toEl,
            end: 'top 35%',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        const twGlow = gsap.to(segGlow, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: fromEl,
            start: 'bottom 90%',
            endTrigger: toEl,
            end: 'top 35%',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        pathTweens.push(twDraw, twGlow);
      }

      // ── 4. Render leaf clusters at image card center green dots ──────────────
      anchors.forEach((anchor, i) => {
        // Exit node at bottom-center of card
        if (i < anchors.length - 1) {
          const clusterOut = buildLeafCluster(svg, anchor.cardCx, anchor.cardBottom, i, false);
          clusterOut.triggerEl = anchor.stationEl || anchor.el;
          clusterOut.badgeEl = anchor.el;
          leafClusters.push(clusterOut);
        }
        // Entry node at top-center of card
        if (i > 0) {
          const clusterIn = buildLeafCluster(svg, anchor.cardCx, anchor.cardTop, i, i === anchors.length - 1);
          clusterIn.triggerEl = anchor.stationEl || anchor.el;
          clusterIn.badgeEl = anchor.el;
          leafClusters.push(clusterIn);
        }
      });

      mount.appendChild(svg);

      // ── Individual waypoint & GSAP leaf blooming triggers ───────────────────
      leafClusters.forEach((cluster) => {
        const triggerEl = cluster.triggerEl;
        const badge = cluster.badgeEl;
        if (!triggerEl) return;

        const leafGroup = cluster.group;
        const cx = cluster.cx;
        const cy = cluster.cy;

        function bloomLeaves() {
          if (badge) badge.classList.add('is-active');
          gsap.killTweensOf(leafGroup);
          const tl = gsap.timeline();
          tl.to(leafGroup, {
            scale: 1,
            opacity: 1,
            duration: 0.85,
            ease: 'back.out(2)',
            transformOrigin: `${cx}px ${cy}px`,
          });
          const blades = leafGroup.querySelectorAll('.leaf-blade');
          if (blades.length) {
            tl.fromTo(blades,
              { scale: 0.2, opacity: 0, transformOrigin: `${cx}px ${cy}px` },
              { scale: 1, opacity: 1, duration: 0.6, stagger: 0.07, ease: 'power2.out' },
              '-=0.55'
            );
          }
          const tendrils = leafGroup.querySelectorAll('.vine-tendril');
          if (tendrils.length) {
            tl.fromTo(tendrils,
              { strokeDasharray: 100, strokeDashoffset: 100 },
              { strokeDashoffset: 0, duration: 0.75, stagger: 0.1, ease: 'power2.out' },
              '-=0.45'
            );
          }
        }

        function retractLeaves() {
          if (badge) badge.classList.remove('is-active');
          gsap.killTweensOf(leafGroup);
          gsap.to(leafGroup, {
            scale: 0,
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in',
            transformOrigin: `${cx}px ${cy}px`,
          });
        }

        // If element is already in viewport on load/resize, bloom immediately
        const bRect = triggerEl.getBoundingClientRect();
        if (bRect.top <= window.innerHeight * 0.75 && bRect.bottom > 0) {
          bloomLeaves();
        }

        const st = ScrollTrigger.create({
          trigger: triggerEl,
          start: 'top 75%',
          onEnter: bloomLeaves,
          onLeaveBack: retractLeaves,
          onEnterBack: bloomLeaves,
        });
        leafSTs.push(st);
      });
    }

    // ── Station card entrance fade triggers ───────────────────────────────────
    stationEls.forEach((station) => {
      ScrollTrigger.create({
        trigger: station,
        start: 'top 70%',
        onEnter: () => station.classList.add('is-active'),
        onLeaveBack: () => station.classList.remove('is-active'),
      });
    });

    // ── Layout settling helper ────────────────────────────────────────────────
    async function waitForLayoutSettled() {
      // Wait for fonts
      if (document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready;
        } catch (e) {}
      }

      // Wait for images inside section
      const imgs = Array.from(section.querySelectorAll('img'));
      await Promise.all(
        imgs.map((img) => {
          if (img.complete && img.naturalHeight > 0) return Promise.resolve();
          if (img.decode) {
            return img.decode().catch(() => {});
          }
          return new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
          });
        })
      );

      // Two rAF frames to allow Tailwind flex/grid layout to complete paint
      return new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });
    }

    // ── Recalculate and rebuild ───────────────────────────────────────────────
    function recalculate() {
      buildSVG(getAnchors());
      ScrollTrigger.refresh();
    }

    // ── Initial bootstrap ─────────────────────────────────────────────────────
    async function initialBuild() {
      if (isInitialized) return;
      await waitForLayoutSettled();
      recalculate();
      isInitialized = true;
    }

    if (document.readyState === 'complete') {
      initialBuild();
    } else {
      window.addEventListener('load', initialBuild, { once: true });
      setTimeout(initialBuild, 500);
    }

    // ── Debounced ResizeObserver for fluid reflows across breakpoints ─────────
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(recalculate, 150);
    });
    ro.observe(section);

    console.log('[Elysium Motion] Living Sanctuary vine initialized.');
  }

  /**
   * 4. SECTION 4 — CRAFT JOURNEY & INTERACTIVE TRANSFORMATION SLIDER (3-Point Timeline)
   */
  function initCraftJourneySection() {
    const section = document.querySelector('.section-craft-journey');
    if (!section || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const scrubLine = document.getElementById('craft-scrub-line');
    const auraLine = document.getElementById('craft-aura-line');
    const stageItems = section.querySelectorAll('.craft-stage-item');
    const statCounter = document.getElementById('atelier-sqft-counter');
    let hasCountedStat = false;

    if (prefersReducedMotion || isCompactScreen()) {
      if (scrubLine) scrubLine.style.strokeDashoffset = '0';
      if (auraLine) auraLine.style.strokeDashoffset = '0';
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
        end: '+=1200',
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

    // Progressive scrub through stages (3-point timeline)
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

    if (curtainContainer && curtainClip && curtainHandle) {
      let isDragging = false;

      function updateCurtainPosition(clientX) {
        const rect = curtainContainer.getBoundingClientRect();
        let pct = ((clientX - rect.left) / rect.width) * 100;
        pct = Math.max(0, Math.min(100, pct));
        curtainClip.style.clipPath = `polygon(${pct}% 0, 100% 0, 100% 100%, ${pct}% 100%)`;
        curtainHandle.style.left = `${pct}%`;
        curtainContainer.setAttribute('aria-valuenow', Math.round(pct));
      }

      curtainContainer.addEventListener('pointerdown', (e) => {
        isDragging = true;
        try { curtainContainer.setPointerCapture(e.pointerId); } catch (err) { }
        updateCurtainPosition(e.clientX);
      });
      curtainContainer.addEventListener('pointermove', (e) => {
        if (isDragging || !isMobileScreen()) updateCurtainPosition(e.clientX);
      });
      curtainContainer.addEventListener('pointerup', (e) => {
        isDragging = false;
        try { curtainContainer.releasePointerCapture(e.pointerId); } catch (err) { }
      });
      curtainContainer.addEventListener('pointercancel', () => { isDragging = false; });
      curtainContainer.addEventListener('touchstart', (e) => {
        isDragging = true;
        if (e.touches?.[0]) updateCurtainPosition(e.touches[0].clientX);
      }, { passive: true });
      curtainContainer.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches?.[0]) updateCurtainPosition(e.touches[0].clientX);
      }, { passive: true });
      curtainContainer.addEventListener('touchend', () => { isDragging = false; });
      curtainContainer.addEventListener('click', (e) => {
        if (!isDragging && isMobileScreen()) {
          const rect = curtainContainer.getBoundingClientRect();
          const currentPct = parseFloat(curtainContainer.getAttribute('aria-valuenow') || '50');
          const newPct = currentPct > 50 ? 15 : 85;
          updateCurtainPosition(rect.left + (rect.width * newPct) / 100);
        }
      });
      curtainContainer.addEventListener('keydown', (e) => {
        let currentPct = parseFloat(curtainContainer.getAttribute('aria-valuenow') || '50');
        if (e.key === 'ArrowLeft') { e.preventDefault(); currentPct = Math.max(0, currentPct - 10); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); currentPct = Math.min(100, currentPct + 10); }
        curtainClip.style.clipPath = `polygon(${currentPct}% 0, 100% 0, 100% 100%, ${currentPct}% 100%)`;
        curtainHandle.style.left = `${currentPct}%`;
        curtainContainer.setAttribute('aria-valuenow', Math.round(currentPct));
      });
    }

    console.log('[Elysium Motion] Section 4 (Craft Journey) initialized with 3-stage pinned scrub & slider.');
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
   * 6. SECTION 6 — TRUST & VOICE (HORIZONTAL CONTAINER-ANIMATION STREAM)
   * Horizontal scroll stream with nested ScrollTriggers on characters using containerAnimation.
   * Characters tumble into place with random yPercent and rotation as they enter the viewport.
   */
  function initTrustVoiceSection() {
    const wrapper = document.querySelector('.Horizontal') || document.getElementById('trust-horizontal-wrapper');
    const text = document.querySelector('.Horizontal__text');
    if (!wrapper || !text || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    if (prefersReducedMotion || isCompactScreen()) {
      gsap.set(text, { paddingLeft: '1.5rem', paddingRight: '1.5rem', whiteSpace: 'normal', width: '100%', x: 0 });
      return;
    }

    let ctx = gsap.context(() => {
      // 1. Text splitting into words & chars via SplitText, SplitType, or inline fallback
      let splitChars = [];
      if (typeof SplitText !== 'undefined') {
        const split = SplitText.create(text, { type: 'chars, words' });
        splitChars = split.chars;
      } else if (typeof SplitType !== 'undefined') {
        const split = new SplitType(text, { types: 'chars, words', tagName: 'span' });
        splitChars = split.chars;
      } else {
        const words = text.innerText.trim().split(/\s+/);
        text.innerHTML = '';
        words.forEach((word, wIdx) => {
          const wordSpan = document.createElement('span');
          wordSpan.className = 'word inline-flex';
          word.split('').forEach((ch) => {
            const charSpan = document.createElement('span');
            charSpan.className = 'char inline-block';
            charSpan.innerText = ch;
            wordSpan.appendChild(charSpan);
            splitChars.push(charSpan);
          });
          text.appendChild(wordSpan);
          if (wIdx < words.length - 1) {
            text.appendChild(document.createTextNode(' '));
          }
        });
      }

      // 2. Horizontal scroll tween pinned to viewport
      const scrollTween = gsap.to(text, {
        xPercent: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          pin: true,
          start: 'clamp(top top)',
          end: '+=5000px',
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 3. Characters tumble into place via containerAnimation
      if (splitChars && splitChars.length) {
        splitChars.forEach((char) => {
          gsap.from(char, {
            yPercent: gsap.utils.random(-200, 200),
            rotation: gsap.utils.random(-20, 20),
            opacity: 0,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: char,
              containerAnimation: scrollTween,
              start: 'left 100%',
              end: 'left 30%',
              scrub: 1,
            },
          });
        });
      }
    }, wrapper);

    console.log('[Elysium Motion] Section 6 (Trust & Voice) containerAnimation horizontal stream initialized.');
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

    // 1. Homepage Body Sections (Atelier Reveal, Horizontal Suite, Materiality, Process Trace, Featured, Trust)
    initLusionSection2();
    // initHorizontalGallerySection (Replaced by Section 2 Lusion showreel)
    initMaterialityInterludeSection();
    initLivingSanctuarySection();
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
