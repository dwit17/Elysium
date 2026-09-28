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

        // lagSmoothing(500, 33) ensures lag protection and stops freezes during rapid jumps/scrolling
        gsap.ticker.lagSmoothing(500, 33);
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
    const pathHead = document.getElementById('lusion-path-head');

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
          bool isPortrait = aspect < 1.0;

          // Starting card position: on landscape bottom-left, on portrait centered lower
          vec2 startCenter = isPortrait ? vec2(0.0, -0.36) : vec2(-0.52, -0.46);
          vec2 startSize = isPortrait ? vec2(0.68, 0.68 * aspect * 1.05) : vec2(0.38, 0.38 / aspect * 1.45);

          // Docked card position: centered viewport frame
          vec2 endCenter = vec2(0.0, 0.0);
          vec2 endSize = isPortrait ? vec2(0.92, 0.72) : vec2(0.908, 0.75);

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

          // Black-grey / monochrome shade transition to natural full color
          float luma = dot(naturalCol.rgb, vec3(0.299, 0.587, 0.114));
          vec3 monoDark = vec3(0.08, 0.08, 0.10);
          vec3 monoLight = vec3(0.85, 0.85, 0.88);
          vec3 monoCol = mix(monoDark, monoLight, luma);

          vec3 finalRgb = mix(naturalCol.rgb, monoCol, vDuotoneMix * 0.95);

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
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([32, 32, 36, 255]));

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
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([24, 24, 28, 255]));

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

      masterTl.to(dockedUi, {
        opacity: 1, pointerEvents: 'auto', duration: 0.12,
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

    // TABLET (768px - 1023px)
    mm.add('(min-width: 768px) and (max-width: 1023px)', () => {
      gsap.set(intro, { opacity: 1, y: 0 });
      gsap.set(dockedUi, { opacity: 0, pointerEvents: 'none' });
      gsap.set(playWordLeft, { x: -40, opacity: 0 });
      gsap.set(playWordRight, { x: 40, opacity: 0 });
      gsap.set(playPill, { scale: 0.45, opacity: 0 });
      gsap.set(plusMarks, { scale: 0, opacity: 0 });

      const tabletTl = gsap.timeline({ defaults: { ease: 'none' } });

      tabletTl.to(intro, {
        y: -70,
        opacity: 0,
        duration: 0.28,
        ease: 'power2.inOut',
      }, 0.00);

      if (drawPathCore) {
        tabletTl.to(drawPathCore, {
          strokeDashoffset: 0,
          duration: 0.72,
          ease: 'none',
        }, 0.00);

        if (svgLineWrap) {
          tabletTl.to(svgLineWrap, {
            opacity: 0,
            duration: 0.12,
            ease: 'power2.out',
          }, 0.58);
        }
      }

      tabletTl.to(dockedUi, {
        opacity: 1, pointerEvents: 'auto', duration: 0.14,
        ease: 'power1.out',
      }, 0.70);

      tabletTl.to([playWordLeft, playWordRight], {
        x: 0,
        opacity: 1,
        duration: 0.16,
        ease: 'power2.out',
      }, 0.72);

      tabletTl.to(playPill, {
        scale: 1.0,
        opacity: 1,
        duration: 0.18,
        ease: 'back.out(1.5)',
      }, 0.74);

      tabletTl.to(plusMarks, {
        scale: 1.0,
        rotation: 90,
        opacity: 0.65,
        stagger: 0.02,
        duration: 0.18,
        ease: 'power2.out',
      }, 0.73);

      const tabletSt = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=1600',
        pin: stage,
        scrub: 0.45,
        anticipatePin: 1,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
        animation: tabletTl,
        onUpdate: (self) => {
          targetProgress = self.progress;
        },
        onToggle: (self) => {
          isSectionVisible = self.isActive;
        },
      });

      return () => {
        if (tabletSt) tabletSt.kill();
      };
    });

    // MOBILE (< 768px) - Standalone Clean Hero Flow
    mm.add('(max-width: 767px)', () => {
      gsap.set(intro, { opacity: 1, y: 0, clearProps: 'transform' });
      gsap.set(stage, { clearProps: 'transform' });
      if (dockedUi) gsap.set(dockedUi, { display: 'none' });
      if (svgLineWrap) gsap.set(svgLineWrap, { display: 'none' });
      if (canvas) gsap.set(canvas, { display: 'none' });

      // No ScrollTrigger pin on mobile - scrolls naturally into next section
      return () => {};
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
          } catch (e) { }
        } else {
          gsap.set(pathHead, { opacity: 0 });
        }
      }
    };

    gsap.ticker.add(tickerCallback);

    window.addEventListener('resize', () => {
      if (webglApi) webglApi.resize();
    });

    const modalVideo = document.getElementById('lusion-modal-video');

    function openModal() {
      if (!modal) return;
      modal.classList.add('active');
      gsap.to(modal, { opacity: 1, pointerEvents: 'auto', duration: 0.35, ease: 'power2.out' });
      if (modalVideo) {
        modalVideo.controls = true;
        // Do NOT autoplay with sound on mobile - require explicit tap
      }
      if (modalImg) modalImg.src = montageImages[montageIdx];
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove('active');
      gsap.to(modal, { opacity: 0, pointerEvents: 'none', duration: 0.25, ease: 'power2.in' });
      if (modalVideo) {
        modalVideo.pause();
        modalVideo.currentTime = 0;
      }
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

  /**
   * 2. SECTION 3 — 100VH ARCHITECTURAL STACKING CARDS DECK
   * Recreates the 100vh stacking card physics natively via GSAP ScrollTrigger + Lenis.
   * Matches 21st.dev / Daniel Petho / Khoa Phan cascading card deck interaction.
   * Symmetrically centered vertically & horizontally with stepped top tabs.
   */
  function initSpatialSanctuarySection() {
    const section = document.getElementById('spatial-sanctuary-container') || document.querySelector('.elysium-stack-section');
    if (!section || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const stage = document.getElementById('sanctuary-stack-stage') || section.querySelector('.elysium-stack-stage') || section;
    const cardItems = Array.from(section.querySelectorAll('.elysium-stack-card'));
    if (cardItems.length < 2) return;

    // Check mobile screen (<768px): Abandon pinned/stacking scroll mechanic completely
    if (window.innerWidth < 768) {
      console.log('[Elysium Motion] Mobile screen: Section 3 pinned card stacking abandoned for clean normal-flow vertical blocks.');
      return;
    }

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      console.log('[Elysium Motion] Reduced motion preference detected. Section 3 Stacking animations disabled.');
      return;
    }

    // Clean up any existing ScrollTriggers on this section
    ScrollTrigger.getAll().forEach(st => {
      if (st.trigger === section || st.pin === stage) {
        st.kill(true);
      }
    });

    const totalCards = cardItems.length;
    const isMobile = false;
    const isTablet = window.innerWidth < 1024;

    // Vertical top ladder offset & scale step matching 21st.dev
    const stepY = isMobile ? -14 : (isTablet ? -18 : -22);
    const scaleMultiplier = isMobile ? 0.03 : 0.04;

    // Set initial card states
    cardItems.forEach((card, index) => {
      const slab = card.querySelector('.elysium-stack-slab');
      const shade = card.querySelector('.elysium-stack-shade');

      card.style.zIndex = (index + 1).toString();
      if (slab) {
        gsap.set(slab, { scale: 1, y: 0, transformOrigin: 'top center' });
      }
      if (shade) {
        gsap.set(shade, { opacity: 0 });
      }

      if (index === 0) {
        gsap.set(card, { yPercent: 0, pointerEvents: 'auto' });
      } else {
        gsap.set(card, { yPercent: 120, pointerEvents: 'none' });
      }
    });

    // Master Timeline for continuous scroll scrubbing
    const masterTl = gsap.timeline({ defaults: { ease: 'power1.inOut' } });

    for (let step = 0; step < totalCards - 1; step++) {
      const stepStartTime = step;
      const nextCard = cardItems[step + 1];

      // 1. Next card translates smoothly up from below into active center
      if (nextCard) {
        masterTl.to(nextCard, {
          yPercent: 0,
          duration: 1,
          ease: 'power1.inOut',
          onStart: () => { nextCard.style.pointerEvents = 'auto'; },
          onReverseComplete: () => { nextCard.style.pointerEvents = 'none'; },
        }, stepStartTime);
      }

      // 2. Adjust all cards landed so far into their cascading ladder positions
      // Cards underneath shift UPWARDS so their top colored rounded edges remain visible at top
      for (let i = 0; i <= step; i++) {
        const slab = cardItems[i].querySelector('.elysium-stack-slab');
        const shade = cardItems[i].querySelector('.elysium-stack-shade');
        const stackDepth = (step + 1) - i; // 1 for immediate previous, 2 for earlier, etc.

        const targetY = stackDepth * stepY;
        const targetScale = Math.max(0.82, 1 - (stackDepth * scaleMultiplier));
        const targetShadeOpacity = Math.min(0.20, stackDepth * 0.05);

        if (slab) {
          masterTl.to(slab, {
            scale: targetScale,
            y: targetY,
            duration: 1,
            ease: 'power1.inOut',
          }, stepStartTime);
        }

        if (shade) {
          masterTl.to(shade, {
            opacity: targetShadeOpacity,
            duration: 1,
            ease: 'power1.inOut',
          }, stepStartTime);
        }
      }
    }

    // ScrollTrigger Pinned Arena
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => '+=' + ((totalCards - 1) * (window.innerWidth < 768 ? 480 : (window.innerWidth < 1024 ? 600 : 750))),
      pin: stage,
      pinSpacing: true,
      scrub: 0.6,
      anticipatePin: 1,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      animation: masterTl,
    });

    console.log('[Elysium Motion] Section 3 Pinned Stacking Cards active across ' + totalCards + ' cards.');
  }

  /**
   * 4. SECTION 4 — ARCHITECTURAL LINE SANCTUARY (EDGE-TO-EDGE SCROLL DRAW)
   * Pure, immersive scroll-driven SVG line art drawing from left edge to right edge.
   * As the user scrolls through the pinned section, the path draws progressively across the screen.
   */
  function initScrollDrawSection() {
    const section = document.getElementById('section-scroll-draw');
    const stage = document.getElementById('scroll-draw-sticky');
    const svg = document.getElementById('sanctuary-line-art-svg');
    if (!section || !stage || !svg || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const floorLead = svg.querySelector('#sanctuary-floor-lead');
    const strokes = Array.from(svg.querySelectorAll('.sanctuary-stroke:not(#sanctuary-floor-lead)'));

    // Bounding domain: from -300 (far-left edge) to 920 (far-right edge) = total 1220px
    const minDomain = -300;
    const maxDomain = 920;
    const domainSpan = maxDomain - minDomain;

    let floorLen = 1220;
    if (floorLead) {
      try {
        floorLen = floorLead.getTotalLength() || 1220;
        gsap.set(floorLead, {
          strokeDasharray: floorLen,
          strokeDashoffset: floorLen,
          opacity: 1,
          stroke: '#111111',
        });
      } catch (e) { }
    }

    // Initialize all individual strokes with their exact length and opacity: 0 (ZERO phantom dots!)
    const strokeData = [];
    strokes.forEach((strk) => {
      let len = 0;
      try {
        len = strk.getTotalLength();
      } catch (e) { }

      if (len > 0) {
        gsap.set(strk, {
          strokeDasharray: len,
          strokeDashoffset: len,
          opacity: 0,
          stroke: '#111111',
        });

        const minX = parseFloat(strk.getAttribute('data-min-x')) || 0;
        // Normalized horizontal progression [0, 1] across the canvas
        const normX = Math.max(0, Math.min(1, (minX - minDomain) / domainSpan));

        strokeData.push({
          el: strk,
          len: len,
          normX: normX,
        });
      }
    });

    if (prefersReducedMotion) {
      if (floorLead) gsap.set(floorLead, { strokeDashoffset: 0 });
      strokeData.forEach((s) => {
        gsap.set(s.el, { strokeDashoffset: 0, opacity: 1 });
      });
      return;
    }

    // Scroll distance for slow, silky smooth drawing cadence
    const scrollDistance = Math.round(window.innerHeight * (window.innerWidth < 768 ? 2.2 : 2.8));

    // Master ScrollTrigger Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${scrollDistance}`,
        pin: stage,
        pinSpacing: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // 1. Floor baseline draws continuously from far left to far right (0.00 -> 1.00)
    if (floorLead) {
      tl.to(floorLead, {
        strokeDashoffset: 0,
        ease: 'none',
        duration: 1.0,
      }, 0);
    }

    // 2. Each stroke physically draws along its geometry as the flowing wave reaches it
    strokeData.forEach((item) => {
      // Map horizontal X position to timeline start time [0.04, 0.86]
      const startTime = 0.04 + item.normX * 0.78;
      // Duration of individual stroke drawing (flowing along curve)
      const strokeDuration = 0.16;

      // Reveal stroke opacity as it starts drawing (prevents pre-draw dots)
      tl.to(item.el, {
        opacity: 1,
        duration: 0.02,
        ease: 'none',
      }, startTime);

      // Smoothly draw the stroke along its path
      tl.to(item.el, {
        strokeDashoffset: 0,
        duration: strokeDuration,
        ease: 'power1.out',
      }, startTime);
    });

    // Debounced Resize Re-measurement Handler
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        try {
          if (floorLead) {
            const freshLen = floorLead.getTotalLength();
            if (freshLen > 0) {
              floorLen = freshLen;
              floorLead.style.strokeDasharray = `${floorLen}`;
            }
          }
          strokeData.forEach((s) => {
            const fresh = s.el.getTotalLength();
            if (fresh > 0) {
              s.len = fresh;
              s.el.style.strokeDasharray = `${fresh}`;
            }
          });
          ScrollTrigger.refresh();
        } catch (e) { }
      }, 200);
    });

    console.log(`[Elysium ScrollDraw] Section 4 active: ${strokeData.length} individual strokes flowing left-to-right like water.`);
  }



  /**
   * 5. SECTION 5 — CURATED EDITORIAL COLLECTION (CODEGRID 3 IMAGES -> 1 COMBINED IMAGE -> 3D FLIP)
   * 1:1 Implementation of Codegrid's ScrollTrigger-driven 3-images-to-1-image combining and 3D card flip.
   * - Starts as 3 separate distinct images with generous gap, rounded corners, and individual shadow framing.
   * - Phase 1 (0.00 -> 0.40): Combining! Three images glide together, gap closes (28px -> 0px),
   *   border-radius flattens (18px -> 0px), outer cards slide inward to unite into ONE single continuous 16:9 atelier masterpiece.
   *   isGapAnimationCompleted flag marks this milestone.
   * - Phase 2 (0.42 -> 0.85): 3D Flip! The combined cards rotateY 180° with anti-gravity swinging arc
   *   (left card tilts Z -6.5° & dips Y 22px, right card tilts Z +6.5° & dips Y 22px, center floats).
   * - Phase 3 (0.85 -> 1.00): Settling & reveal of curated horology artifacts and interactive CTA links.
   * - Fully reversible, 60fps/120fps hardware accelerated, integrated with Lenis smooth scroll.
   */
  /**
   * 5. SECTION 5 — FEATURED PIECES (CURATED COLLECTION)
   * 3-to-1 Merge & 3D Flip Hero Architecture (Redomedia / Codegrid Reference)
   *
   * Phase 1 (progress 0 -> 0.55):
   * Three separate panels begin in a relaxed fanned pose (outer cards fanned ±7°, dipped 34px, 28px gap).
   * As the user scrolls, gaps close to 0, rotations/offsets ease to 0, touching inner corner radii flatten
   * from 24px -> 0px, outer corner radii ease to 16px. The three panels merge into one continuous artwork.
   *
   * Phase 2 (progress 0.55 -> 1.0):
   * Once merged, crossing the threshold (~0.60) fires a one-shot 180° Y-flip on all three card inners
   * to reveal the back curated collection artifact details. Guarded by a boolean flag (hasFlipped)
   * so it executes cleanly once per direction crossing, free from scrub jitter.
   */
  /**
   * 5. SECTION 5 — FEATURED PIECES (CURATED COLLECTION)
   * 1-Image Beginning -> Split into 3 Cards -> 3D Flip (Codegrid Architecture)
   *
   * Flow:
   * 1. Beginning (progress 0.0 -> 0.10):
   *    1 single unified panoramic artwork image in the center (0 gap, flat touching inner seams, 16px soft outer corners).
   * 2. Split Phase (progress 0.10 -> 0.48):
   *    The single image splits into 3 cards! Gap opens up (0 -> 28px), outer cards fan out (±7°, 32px dip),
   *    touching inner corner radii round out (0 -> 20px), and individual drop shadows bloom.
   * 3. Split Dwell (progress 0.48 -> 0.54):
   *    The 3 cards hold in their fanned-out pose.
   * 4. 3D Flip Phase (progress 0.54 -> 0.78):
   *    The 3 cards flip 180° in 3D with cascading depth, revealing the back faces (title, medium, year, description, WhatsApp CTA).
   * 5. Generous Read & Dwell Hold (progress 0.78 -> 1.00):
   *    The flipped cards stay completely resting and pinned on screen for ~800px of scrolling so the user
   *    can comfortably read every piece's details and click CTAs without the next section popping into view early!
   */
  function initFeaturedPiecesSection() {
    const section = document.querySelector('.featured-pin') || document.querySelector('.section-featured-pieces') || document.getElementById('section-curated-collection');
    const pinInner = document.querySelector('.pin-inner') || document.querySelector('.featured-pin-inner') || document.getElementById('featured-split-sticky');
    const header = document.getElementById('featured-section-header') || document.querySelector('.featured-header');
    const track = document.getElementById('featured-cards-track') || document.querySelector('.featured-cards-track');
    const cards = gsap.utils.toArray('.featured-card');
    const cardInners = gsap.utils.toArray('.featured-flip-inner');

    if (!section || !pinInner || !track || cards.length !== 3 || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;

    // Accessibility prefers-reduced-motion check
    if (prefersReducedMotion) {
      if (header) gsap.set(header, { opacity: 1, y: 0 });
      gsap.set(track, { gap: isMobile ? '14px' : '28px', scale: 1 });
      gsap.set(cards, { borderRadius: isMobile ? '8px' : '12px', rotateZ: 0, y: 0, x: 0 });
      gsap.set(cardInners, { rotateY: -180 });
      return;
    }

    // Exact Redomedia physical metrics
    const targetGap = isMobile ? 12 : (isTablet ? 20 : 32);
    const leftRotZ = isMobile ? -8 : -14;
    const rightRotZ = isMobile ? 6 : 10;
    const leftY = isMobile ? 18 : 30;
    const midY = isMobile ? -4 : -8;
    const rightY = isMobile ? 14 : 22;
    const leftX = isMobile ? -4 : -8;
    const rightX = isMobile ? 4 : 8;
    const cornerRadius = isMobile ? 8 : 12;

    // Generous runway (4.4 screen heights on desktop, 3.6 on mobile) guarantees user never gets pushed into next section prematurely
    const pinDistance = window.innerHeight * (isMobile ? 3.6 : 4.4);

    // BASELINE STATE (Progress = 0):
    // Header hidden slightly lower; 1 unified seamless image slab touching with 0 gap, outer corners rounded
    if (header) {
      gsap.set(header, { opacity: 0, y: 35 });
    }
    gsap.set(track, {
      gap: '0px',
      scale: 1.18,
      transformPerspective: 1200,
    });
    gsap.set(cards[0], {
      rotateZ: 0,
      y: 0,
      x: 0,
      transformOrigin: 'bottom right',
    });
    gsap.set([cards[0], cards[0].querySelectorAll('.card-inner, .card-front, .card-front img')], {
      borderRadius: 0,
    });

    gsap.set(cards[1], {
      rotateZ: 0,
      y: 0,
      x: 0,
      marginLeft: '-1px',
      marginRight: '-1px',
      zIndex: 2,
      transformOrigin: 'center center',
    });
    gsap.set([cards[1], cards[1].querySelectorAll('.card-inner, .card-front, .card-front img')], {
      borderRadius: 0,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    });

    gsap.set(cards[2], {
      rotateZ: 0,
      y: 0,
      x: 0,
      transformOrigin: 'bottom left',
    });
    gsap.set([cards[2], cards[2].querySelectorAll('.card-inner, .card-front, .card-front img')], {
      borderRadius: 0,
    });

    gsap.set(cardInners, {
      rotateY: 0,
      transformStyle: 'preserve-3d',
    });

    // Master Timeline with ScrollTrigger (Virtual duration: 11.2 units)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: true, // pin the section itself for rock-solid stability!
        start: 'top top',
        end: () => `+=${pinDistance}`,
        scrub: 1.0, // silky smooth synchronized scrub
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // =========================================================================
    // PHASE 1: ENTRY & SCALE CONVERGENCE (0.0 -> 1.4)
    // Header reveals with smooth fade + rise; card track scales from 1.18 to 1.0
    // =========================================================================
    if (header) {
      tl.to(header, {
        opacity: 1,
        y: 0,
        duration: 1.3,
        ease: 'power2.out',
      }, 0);
    }
    tl.to(track, {
      scale: 1.0,
      duration: 1.4,
      ease: 'power2.out',
    }, 0);

    // =========================================================================
    // PHASE 2: CONTEMPLATION HOLD (1.4 -> 2.4)
    // Unified 1-piece image rests in screen center
    // =========================================================================
    tl.to({}, { duration: 1.0 }, 1.4);

    // =========================================================================
    // PHASE 3: THE SPLIT & SEPARATION (2.4 -> 4.8)
    // Gap expands from 0 to targetGap; margins normalize; all corners round out
    // =========================================================================
    tl.to(track, {
      gap: `${targetGap}px`,
      duration: 2.4,
      ease: 'power2.inOut',
    }, 2.4);

    tl.to(cards[1], {
      marginLeft: '0px',
      marginRight: '0px',
      duration: 2.4,
      ease: 'power2.inOut',
    }, 2.4);

    tl.to([cards[0], cards[0].querySelectorAll('.card-inner, .card-front, .card-front img, .card-back')], {
      borderRadius: `${cornerRadius}px`,
      duration: 2.4,
      ease: 'power2.inOut',
    }, 2.4);

    tl.to([cards[1], cards[1].querySelectorAll('.card-inner, .card-front, .card-front img, .card-back')], {
      borderRadius: `${cornerRadius}px`,
      duration: 2.4,
      ease: 'power2.inOut',
    }, 2.4);

    tl.to([cards[2], cards[2].querySelectorAll('.card-inner, .card-front, .card-front img, .card-back')], {
      borderRadius: `${cornerRadius}px`,
      duration: 2.4,
      ease: 'power2.inOut',
    }, 2.4);

    // =========================================================================
    // PHASE 4: SPLIT REST (4.8 -> 5.2)
    // Brief settling pause before the 3D flip begins
    // =========================================================================
    tl.to({}, { duration: 0.4 }, 4.8);

    // =========================================================================
    // PHASE 5: 3D FLIP & SIGNATURE REDOMEDIA CARD FAN (5.2 -> 7.4)
    // Cards flip 180° on Y with 1200px perspective and cascading depth;
    // Left card tilts to -14° and dips down +30px;
    // Center card elevates upright at scale 1.02 and y -8px;
    // Right card tilts to +10° and dips down +22px.
    // =========================================================================
    // Card 1 (Left): flips to -180deg and settles in its tilted fan pose
    tl.to(cardInners[0], {
      rotateY: -180,
      duration: 2.0,
      ease: 'power2.inOut',
    }, 5.2);
    tl.to(cards[0], {
      rotateZ: leftRotZ,
      y: leftY,
      x: leftX,
      duration: 2.0,
      ease: 'power2.inOut',
    }, 5.2);

    // Card 2 (Center): flips to -180deg with slight +0.15s stagger and stays elevated
    tl.to(cardInners[1], {
      rotateY: -180,
      duration: 2.0,
      ease: 'power2.inOut',
    }, 5.35);
    tl.to(cards[1], {
      y: midY,
      scale: 1.02,
      duration: 2.0,
      ease: 'power2.inOut',
    }, 5.35);

    // Card 3 (Right): flips to -180deg with +0.3s stagger and settles in its tilted fan pose
    tl.to(cardInners[2], {
      rotateY: -180,
      duration: 2.0,
      ease: 'power2.inOut',
    }, 5.5);
    tl.to(cards[2], {
      rotateZ: rightRotZ,
      y: rightY,
      x: rightX,
      duration: 2.0,
      ease: 'power2.inOut',
    }, 5.5);

    // =========================================================================
    // PHASE 6: EXTENDED READ & DWELL HOLD (7.4 -> 11.2)
    // A full 3.8 virtual units (~34% of the total scroll distance = ~1,400px of scrolling!)
    // The flipped cards remain completely pinned, resting, and interactive.
    // The user has ample time to comfortably read every card, inspect the materials,
    // and click the WhatsApp buttons without the next section popping into view early!
    // =========================================================================
    tl.to({}, { duration: 3.8 }, 7.4);

    console.log('[Elysium Motion] Section 5 (Redomedia Section 3 Complete 1-to-3 Split, 3D Flip & Signature Fan with 3.8-unit Dwell) initialized.');
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

    if (window.innerWidth < 768) {
      gsap.set(text, { paddingLeft: '0', paddingRight: '0', whiteSpace: 'normal', width: '100%', x: 0 });
      return;
    }

    if (prefersReducedMotion) {
      gsap.set(text, { paddingLeft: '1.5rem', paddingRight: '1.5rem', whiteSpace: 'normal', width: '100%', x: 0 });
      return;
    }

    let ctx = gsap.context(() => {
      // 1. Text & Inline Media splitting: Wrap words & preserve .stream-img-badge
      let wordsList = [];
      const childNodes = Array.from(text.childNodes);
      text.innerHTML = '';

      childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const rawText = node.textContent;
          if (!rawText || !rawText.trim()) return;
          const words = rawText.trim().split(/\s+/);
          words.forEach((word, wIdx) => {
            if (word.length > 0) {
              const wordSpan = document.createElement('span');
              wordSpan.className = 'word inline-block will-change-[transform,opacity]';
              wordSpan.innerText = word;
              text.appendChild(wordSpan);
              wordsList.push(wordSpan);
            }
            if (wIdx < words.length - 1) {
              text.appendChild(document.createTextNode(' '));
            }
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          text.appendChild(node);
        }
      });

      // 2. Horizontal scroll tween pinned to viewport (Calibrated for calm, controlled reading)
      const scrollTween = gsap.to(text, {
        x: () => -(text.scrollWidth - window.innerWidth * 0.35),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          pin: true,
          start: 'clamp(top top)',
          end: () => (window.innerWidth < 768 ? '+=3200px' : (window.innerWidth < 1024 ? '+=5500px' : '+=8500px')),
          scrub: 0.3,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 3. Optimized word-level reveal via containerAnimation (drastically reduces ScrollTrigger overhead from 220 down to ~25)
      if (wordsList && wordsList.length) {
        wordsList.forEach((word) => {
          gsap.from(word, {
            yPercent: 25,
            opacity: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: word,
              containerAnimation: scrollTween,
              start: 'left 100%',
              end: 'left 70%',
              scrub: 0.6,
            },
          });
        });
      }

      // 4. Inline image badges float, scale, and settle smoothly as they scroll into view
      const imgBadges = text.querySelectorAll('.stream-img-badge');
      if (imgBadges && imgBadges.length) {
        imgBadges.forEach((badge) => {
          gsap.from(badge, {
            scale: 0.75,
            yPercent: 25,
            opacity: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: badge,
              containerAnimation: scrollTween,
              start: 'left 100%',
              end: 'left 70%',
              scrub: 0.8,
            },
          });
        });
      }
    }, wrapper);

    console.log('[Elysium Motion] Section 6 (Trust & Voice) containerAnimation horizontal stream initialized.');
  }

  /**
   * 6B. SECTION 6 TESTIMONIAL COMPONENT — SCULPTURAL 2-COLUMN TESTIMONIAL STAGE
   * Clean side-by-side layout: left botanical mandala & circular portrait, right client narrative.
   * Optimized for silky 60fps scrolling with zero continuous SVG rasterization overhead.
   */
  function initTestimonialComponent() {
    const stage = document.getElementById('trust-testimonial-stage');
    const card = document.getElementById('elysium-testimonial-card');
    if (!stage || !card || typeof gsap === 'undefined') return;

    const portraitWrap = card.querySelector('.testimonial-portrait-wrap');
    const portraitImg = document.getElementById('testimonial-portrait-img');
    const contentContainer = document.getElementById('testimonial-content-container');
    const headline = document.getElementById('testimonial-headline');
    const quote = document.getElementById('testimonial-quote');
    const attribution = document.getElementById('testimonial-attribution-block');
    const author = document.getElementById('testimonial-author');
    const project = document.getElementById('testimonial-project');
    const mandalaRing = document.getElementById('testimonial-mandala-ring') || card.querySelector('.stone-frag-mandala');

    const testimonials = [
      {
        headline: '“Grounded.”',
        quote: '“Elysium delivered a custom travertine console that transformed our living room into a monolithic living sanctuary with unmatched tactile reverence.”',
        author: 'Sarah P.',
        project: 'Bespoke Console Commission, South Bombay Residence',
        portrait: '/images/maker_portrait.jpg'
      },
      {
        headline: '“Timeless.”',
        quote: '“The chiseled black granite plinth and vessels created an atmosphere of profound architectural calm in our penthouse gallery.”',
        author: 'Vikram M.',
        project: 'Granite Plinth Suite, Juhu Atelier Villa',
        portrait: '/images/atelier_craftsman.jpg'
      },
      {
        headline: '“Sanctuary.”',
        quote: '“Every curve in the raw cast-bronze lighting feels intentional, anchoring the room in warm, shadow-sculpted silence.”',
        author: 'Elena R.',
        project: 'Cast Bronze & Terracotta Series, New Delhi Residence',
        portrait: '/images/atelier_display.jpg'
      }
    ];

    let currentIndex = 0;
    let autoAdvanceTimer = null;
    let isTransitioning = false;

    // 1. Reduced Motion handling
    if (prefersReducedMotion) {
      gsap.set(card, { opacity: 1, scale: 1, y: 0 });
      if (mandalaRing) gsap.set(mandalaRing, { opacity: 1, scale: 1, rotation: 0 });
      if (portraitWrap) gsap.set(portraitWrap, { opacity: 1, scale: 1 });
      if (headline) gsap.set(headline, { opacity: 1, y: 0 });
      if (quote) gsap.set(quote, { opacity: 1, y: 0 });
      if (attribution) gsap.set(attribution, { opacity: 1, y: 0 });
    } else {
      // Set initial states for clean hardware-accelerated entrance
      gsap.set(card, { opacity: 0, y: 25 });
      if (mandalaRing) {
        gsap.set(mandalaRing, { transformOrigin: '640px 635.5px', scale: 0.9, opacity: 0 });
      }
      if (portraitWrap) {
        gsap.set(portraitWrap, { opacity: 0, scale: 0.92, transformOrigin: '640px 635.5px' });
      }
      if (headline) gsap.set(headline, { opacity: 0, y: 15 });
      if (quote) gsap.set(quote, { opacity: 0, y: 15 });
      if (attribution) gsap.set(attribution, { opacity: 0, y: 10 });

      // ONE Single-Pass GSAP Timeline for Entrance
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
        },
      });

      // Step 1: Card container fade & rise
      entranceTl.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, 0);

      // Step 2: Mandala Emblem & Portrait reveal in parallel
      if (mandalaRing) {
        entranceTl.to(mandalaRing, {
          scale: 1,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
        }, 0.1);
      }

      if (portraitWrap) {
        entranceTl.to(portraitWrap, {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        }, 0.15);
      }

      // Step 3: Typography entrance
      if (headline) {
        entranceTl.to(headline, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
        }, 0.25);
      }

      if (quote) {
        entranceTl.to(quote, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power3.out',
        }, 0.35);
      }

      if (attribution) {
        entranceTl.to(attribution, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
        }, 0.45);
      }
    }

    // Step 4: Testimonial Crossfade & Auto-advance (Frame & mandala stay static for peak 60fps performance)
    function goToTestimonial(targetIdx) {
      if (isTransitioning || targetIdx === currentIndex) return;
      isTransitioning = true;
      const t = testimonials[targetIdx];

      if (prefersReducedMotion) {
        if (portraitImg) {
          portraitImg.setAttribute('href', t.portrait);
          if (portraitImg.setAttributeNS) portraitImg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', t.portrait);
        }
        if (headline) headline.textContent = t.headline;
        if (quote) quote.innerHTML = t.quote;
        if (author) author.textContent = t.author;
        if (project) project.textContent = t.project;
        currentIndex = targetIdx;
        isTransitioning = false;
        return;
      }

      // Crossfade text content and portrait image smoothly
      const crossfadeTargets = [contentContainer, portraitWrap].filter(Boolean);
      gsap.to(crossfadeTargets, {
        opacity: 0,
        y: -6,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          if (portraitImg) {
            portraitImg.setAttribute('href', t.portrait);
            if (portraitImg.setAttributeNS) portraitImg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', t.portrait);
          }
          if (headline) headline.textContent = t.headline;
          if (quote) quote.innerHTML = t.quote;
          if (author) author.textContent = t.author;
          if (project) project.textContent = t.project;

          gsap.fromTo(crossfadeTargets,
            { opacity: 0, y: 6 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: 'power2.out',
              onComplete: () => {
                currentIndex = targetIdx;
                isTransitioning = false;
              }
            }
          );
        },
      });
    }

    // Auto-advance every 6s smoothly
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

    // Auto-advance only on desktop
    if (window.innerWidth >= 768) {
      startAutoAdvance();
    }
    console.log('[Elysium Motion] Testimonial component initialized with silky 60fps performance.');
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
   * 7. SECTION 7 — SPOTLIGHT ARCHITECTURAL STACKED EXTRUSION & CONTACT DOCK
   * Precise implementation of the BUILD reference:
   * - 6 programmatically generated rear layers behind dominant foreground ELYSIUM wordmark.
   * - Progressive mathematical stepped extrusion toward TOP-LEFT (-X, -Y).
  /**
   * 7. PENSATORI IRRAZIONALI ARCHITECTURAL EXTRUSION & CONTACT DOCK ENGINE
   * - Look 1: Flat resting wordmark under Contact ... 2026 header.
   * - Look 2: Side vertical slats fan out via scaleX and origin-bottom masking plates.
   * - Look 3: Full upward stepped extrusion (scaleY) + letter 'I' 18° clockwise tilt with stepped dashes.
   * - Look 4: Contact button release, smooth expansion to pill dock, and ScrambleText unscrambling.
   */
  function initElysiumContactCascadeSection() {
    const section = document.querySelector('.home-cta') || document.getElementById('spotlight-section');
    if (!section || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const ctaWrapper = section.querySelector('.cta-wrapper');
    if (!ctaWrapper) return;

    const rearLayers = Array.from(section.querySelectorAll('.cta-item-rear'));
    const frontLayer = section.querySelector('.last-text-wrapper');
    const testosBtn = section.querySelector('.testos');
    const testosText = section.querySelector('.testos-text');
    const rearIGroups = Array.from(section.querySelectorAll('.rear-i-group'));

    if (!frontLayer || !testosBtn) return;

    // ScrambleText setup for testosText
    const targetButtonLabel = 'CONTACT US';
    let isLabelRevealed = false;
    let labelRevealTween;

    if (typeof ScrambleTextPlugin !== 'undefined' && gsap.plugins.scrambleText) {
      labelRevealTween = gsap.to(testosText, {
        duration: 0.65,
        scrambleText: {
          text: targetButtonLabel,
          chars: 'upperCase',
          revealDelay: 0.1,
          speed: 0.6,
        },
        paused: true,
      });
    } else {
      const scramblePool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const proxy = { progress: 0 };
      labelRevealTween = gsap.to(proxy, {
        progress: 1,
        duration: 0.65,
        ease: 'power2.out',
        paused: true,
        onUpdate: () => {
          const p = proxy.progress;
          const revealedLen = Math.floor(p * targetButtonLabel.length);
          let res = '';
          for (let i = 0; i < targetButtonLabel.length; i++) {
            if (targetButtonLabel[i] === ' ') res += ' ';
            else if (i < revealedLen) res += targetButtonLabel[i];
            else res += scramblePool[Math.floor(Math.random() * scramblePool.length)];
          }
          testosText.textContent = res;
        },
        onReverseComplete: () => {
          testosText.textContent = targetButtonLabel;
        }
      });
    }

    // Responsive metrics calculation
    function getLayoutMetrics() {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      
      // Temporarily ensure settled 0.88 scale to capture pristine geometric metrics
      gsap.set(ctaWrapper, { scale: 0.88 });
      const wrapperRect = ctaWrapper.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();

      // Original dimensions and position of testos as the vertical letter 'I'
      const initW = wrapperRect.width * 0.02114;
      const initH = wrapperRect.height * 0.9697;
      const initLeft = wrapperRect.width * 0.58289;

      // Final docked button dimensions at bottom center
      const targetW = isMobile ? Math.min(window.innerWidth * 0.72, 210) : 230;
      const targetH = isMobile ? 46 : 50;

      // Target offsets relative to initial position
      const targetLeft = (wrapperRect.width * 0.5) - (targetW * 0.5);
      const deltaX = targetLeft - initLeft;
      
      // Drop distance to bring button near the bottom of the section
      const deltaY = (sectionRect.height * 0.38) + (isMobile ? 30 : 60);

      return {
        isMobile,
        isTablet,
        initW,
        initH,
        targetW,
        targetH,
        deltaX,
        deltaY
      };
    }

    let metrics = getLayoutMetrics();
    
    // Calibrated start scale: visibly larger at section start but 100% contained with clean margins
    const START_SCALE = 1.05;
    const SETTLED_SCALE = 0.88;
    gsap.set(ctaWrapper, { scale: START_SCALE, transformOrigin: 'center center' });

    window.addEventListener('resize', () => {
      metrics = getLayoutMetrics();
      ScrollTrigger.refresh();
    });

    if (prefersReducedMotion) {
      gsap.set(ctaWrapper, { scale: SETTLED_SCALE });
      if (testosBtn) {
        gsap.set(testosBtn, { pointerEvents: 'auto' });
      }
      return;
    }

    // Master ScrollTrigger timeline pinned on section
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=280%',
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress; // 0 to 1

        // =====================================================================
        // PHASE A (0.00 → 0.35): SCALE-DOWN + SIMULTANEOUS LAYER FAN-OUT
        //   Word shrinks from 1.05 → 0.88 while rear layers begin scaleY extrusion
        //   This creates the "settling & dividing" feel — one unified motion.
        // =====================================================================
        const pShrink = gsap.utils.clamp(0, 1, p / 0.35);
        const easeShrink = gsap.parseEase('power2.inOut')(pShrink);
        const masterScale = gsap.utils.interpolate(START_SCALE, SETTLED_SCALE, easeShrink);

        gsap.set(ctaWrapper, {
          scale: masterScale,
          transformOrigin: 'center center',
          force3D: true
        });

        // =====================================================================
        // PHASE B (0.10 → 0.60): ARCHITECTURAL EXTRUSION (origin-bottom scaleY/scaleX)
        //   Overlaps with the tail-end of shrink so dividing starts mid-shrink.
        //   6 rear layers fan upward (scaleY) and slightly outward (scaleX).
        //   Layer 0 = furthest back = most extrusion. Layer 5 = least.
        //   Dense 0.09 vertical step spacing forms a continuous, solid 3D block.
        // =====================================================================
        const pExtrude = gsap.utils.clamp(0, 1, (p - 0.10) / 0.50);
        const easeExtrude = gsap.parseEase('power2.out')(pExtrude);

        // Max scale targets per layer (furthest-back → closest-to-front)
        const layerConfigs = [
          { sxMax: 1.20, syMax: 1.55 },   // Layer 0 (furthest back — tallest extrusion)
          { sxMax: 1.16, syMax: 1.46 },   // Layer 1
          { sxMax: 1.12, syMax: 1.37 },   // Layer 2
          { sxMax: 1.08, syMax: 1.28 },   // Layer 3
          { sxMax: 1.05, syMax: 1.19 },   // Layer 4
          { sxMax: 1.02, syMax: 1.10 },   // Layer 5 (closest to front — smallest extrusion)
        ];

        rearLayers.forEach((layerEl, idx) => {
          const cfg = layerConfigs[idx] || layerConfigs[0];
          const currentScaleX = gsap.utils.interpolate(1, cfg.sxMax, easeExtrude);
          const currentScaleY = gsap.utils.interpolate(1, cfg.syMax, easeExtrude);

          gsap.set(layerEl, {
            scaleX: currentScaleX,
            scaleY: currentScaleY,
            transformOrigin: 'bottom center',
            force3D: true
          });
        });

        // =====================================================================
        // PHASE C (0.30 → 0.60): LETTER 'I' TILT (18° clockwise)
        //   Starts once extrusion is visibly underway, before button detachment.
        // =====================================================================
        const pTilt = gsap.utils.clamp(0, 1, (p - 0.30) / 0.30);
        const easeTilt = gsap.parseEase('power2.out')(pTilt);
        const tiltDeg = 18 * easeTilt;

        rearIGroups.forEach(group => {
          gsap.set(group, {
            rotation: tiltDeg,
            transformOrigin: '29.67px 4.48px',
            force3D: true
          });
        });

        // =====================================================================
        // PHASE D (0.62 → 1.0): BUTTON DETACHMENT, DOCKING & SCRAMBLETEXT
        //   Letter 'I' (.testos) untilts, expands into pill button, docks at
        //   bottom center, and "CONTACT US" unscrambles.
        // =====================================================================
        const pDock = gsap.utils.clamp(0, 1, (p - 0.62) / 0.34);
        const easeDock = gsap.parseEase('power2.inOut')(pDock);

        // Rotation: tilt → 0°
        const buttonRot = gsap.utils.interpolate(tiltDeg, 0, easeDock);

        // Translation towards bottom center dock
        const transX = metrics.deltaX * easeDock;
        const transY = metrics.deltaY * easeDock;

        // Dimensions: letter 'I' shape → pill button
        const currW = gsap.utils.interpolate(metrics.initW, metrics.targetW, easeDock);
        const currH = gsap.utils.interpolate(metrics.initH, metrics.targetH, easeDock);
        const currRadius = gsap.utils.interpolate(1, 9999, easeDock);
        const currBg = easeDock > 0.1 ? '#2c2c2c' : '#434343';

        gsap.set(testosBtn, {
          x: transX,
          y: transY,
          rotation: buttonRot,
          width: currW,
          height: currH,
          borderRadius: `${currRadius}px`,
          backgroundColor: currBg,
          boxShadow: easeDock > 0.4 ? '0 12px 32px rgba(0, 0, 0, 0.22)' : 'none',
          pointerEvents: pDock > 0.6 ? 'auto' : 'none',
          force3D: true
        });

        // Text orientation & visibility inside button
        const textRot = gsap.utils.interpolate(-90, 0, easeDock);
        const textOp = gsap.utils.clamp(0, 1, (pDock - 0.2) / 0.5);

        gsap.set(testosText, {
          rotation: textRot,
          opacity: textOp,
          force3D: true
        });

        // ScrambleText trigger
        if (pDock > 0.5 && !isLabelRevealed) {
          isLabelRevealed = true;
          labelRevealTween.play();
        } else if (pDock <= 0.5 && isLabelRevealed) {
          isLabelRevealed = false;
          labelRevealTween.reverse();
        }
      }
    });

    console.log('[Elysium Motion] Pensatori Irrazionali architectural extrusion (overlapping phases) initialized.');
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
  let isInitialized = false;
  function initAllAnimations() {
    if (isInitialized) return;
    isInitialized = true;

    // 0. Initialize Lenis smooth scroller
    initLenisSmoothScroll();

    // 1. Homepage Body Sections (Atelier Reveal, Horizontal Suite, Materiality, Process Trace, Featured, Trust, Elysium Cascade Contact)
    initLusionSection2();
    // initHorizontalGallerySection (Replaced by Section 2 Lusion showreel)
    initSpatialSanctuarySection();
    // initLivingSanctuarySection (Consolidated into Section 3 Spatial Sanctuary)
    initScrollDrawSection();
    initFeaturedPiecesSection();
    initTrustVoiceSection();
    initTestimonialComponent();
    initElysiumContactCascadeSection();

    // Recalculate and sort all pinning positions in precise document flow
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }

    // 2. Interactive GSAP Button Hover Physics
    initButtonHoverAnimations();

    // 3. Subpage generic cards & resize handlers
    initSubpageAnimations();
    initScrollTriggerRefreshHandler();

    // 4. Asset-driven ScrollTrigger refresh (Promise.all on decode/load of critical images)
    function waitForCriticalAssetsAndRefresh() {
      const promises = [];
      const images = Array.from(document.querySelectorAll('.image-blur-up, .featured-piece-img, .featured-slice-img, .elysium-stack-img, .product-img-container img'));

      images.forEach((img) => {
        if (img.complete && img.naturalWidth > 0) {
          if (typeof img.decode === 'function') {
            promises.push(img.decode().catch(() => { }));
          }
        } else {
          promises.push(
            new Promise((resolve) => {
              img.addEventListener('load', () => resolve(), { once: true });
              img.addEventListener('error', () => resolve(), { once: true });
            })
          );
        }
      });

      if (promises.length > 0) {
        Promise.all(promises).then(() => {
          if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
            console.log('[Elysium Motion] Critical asset images decoded & loaded — ScrollTrigger refreshed.');
          }
        });
      }
    }

    waitForCriticalAssetsAndRefresh();

    // 5. Safety Net Refreshes (Fonts & Window Load)
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

    // 6. ScrollTrigger Audit Logger
    if (typeof ScrollTrigger !== 'undefined') {
      const triggers = ScrollTrigger.getAll();
      console.log(`[Elysium Motion Audit] Active ScrollTriggers count: ${triggers.length}`);
      triggers.forEach((st, idx) => {
        const idOrClass = st.trigger ? (st.trigger.id ? `#${st.trigger.id}` : (st.trigger.className || st.trigger.tagName)) : 'no-trigger';
        console.log(`  [Trigger ${idx + 1}] Target: ${idOrClass}, start: ${st.start}, end: ${st.end}, pinned: ${!!st.pin}`);
      });
    }
  }

  window.initElysiumHomeAnimations = initAllAnimations;
  window.destroyElysiumHomeAnimations = function () {
    isInitialized = false;
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    }
    if (typeof gsap !== 'undefined') {
      gsap.killTweensOf('*');
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllAnimations);
  } else {
    setTimeout(initAllAnimations, 50);
  }
})();
