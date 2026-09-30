/**
 * ==========================================================================
 * ELYSIUM GALLERY CONTROLLER (v2.0)
 * High-Performance Smooth Exhibition Engine with Skeleton Shimmer Loader
 * Seamless Category Deep Linking & Instant Precision Navigation
 * ==========================================================================
 */

(function () {
  'use strict';

  // State & Registrations
  let lenisInstance = null;
  const categoryInstances = [];
  const systemPrefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const prefersReducedMotion = systemPrefersReducedMotion && !window.location.search.includes('motion=true');

  /**
   * 1. GLSL SHADER DEFINITIONS (Editorial Liquid Curvature & Wave Displacement)
   */
  const VS_SOURCE = `
    attribute vec2 aPosition;
    uniform vec4 uBounds;
    uniform float uVelocity;
    varying vec2 vUv;

    void main() {
      vUv = aPosition;

      vec2 pos = vec2(
        uBounds.x + aPosition.x * uBounds.z,
        uBounds.y - aPosition.y * uBounds.w
      );

      float curve = sin(aPosition.y * 3.14159265);
      pos.x += curve * uVelocity * 0.16;

      gl_Position = vec4(pos, 0.0, 1.0);
    }
  `;

  const FS_SOURCE = `
    precision highp float;
    uniform sampler2D uTexture;
    uniform float uVelocity;
    uniform vec2 uImageRatio;
    uniform vec2 uCardSize;
    uniform float uRadius;
    varying vec2 vUv;

    void main() {
      // Precise rounded rectangle corner clipping (20px radius)
      vec2 pixelPos = vUv * uCardSize;
      vec2 center = uCardSize * 0.5;
      vec2 d = abs(pixelPos - center) - (center - vec2(uRadius));
      if (d.x > 0.0 && d.y > 0.0) {
        if (length(d) > uRadius) {
          discard;
        }
      }

      // Aspect ratio correction (object-fit: cover)
      vec2 ratio = vec2(
        min((uCardSize.x / uCardSize.y) / (uImageRatio.x / uImageRatio.y), 1.0),
        min((uCardSize.y / uCardSize.x) / (uImageRatio.y / uImageRatio.x), 1.0)
      );
      vec2 coverUv = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
      );

      // Sinusoidal liquid wave displacement
      float wave = sin(vUv.y * 3.14159265);
      float displace = wave * uVelocity * 0.14;

      // Subtle RGB chromatic separation
      float rgbShift = uVelocity * 0.024;
      vec2 uvR = clamp(coverUv + vec2(displace + rgbShift, 0.0), 0.001, 0.999);
      vec2 uvG = clamp(coverUv + vec2(displace, 0.0), 0.001, 0.999);
      vec2 uvB = clamp(coverUv + vec2(displace - rgbShift, 0.0), 0.001, 0.999);

      float r = texture2D(uTexture, uvR).r;
      float g = texture2D(uTexture, uvG).g;
      float b = texture2D(uTexture, uvB).b;

      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `;

  function createSubdividedPlane(gl, cols, rows) {
    const positions = [];
    const indices = [];

    for (let y = 0; y <= rows; y++) {
      const v = y / rows;
      for (let x = 0; x <= cols; x++) {
        const u = x / cols;
        positions.push(u, v);
      }
    }

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const a = y * (cols + 1) + x;
        const b = a + 1;
        const c = a + (cols + 1);
        const d = c + 1;

        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    return { posBuffer, indexBuffer, indexCount: indices.length };
  }

  function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('[Elysium Gallery Shader Error]', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function createGLProgram(gl, vsSource, fsSource) {
    const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return null;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('[Elysium Gallery Program Error]', gl.getProgramInfoLog(program));
      return null;
    }
    return program;
  }

  /**
   * 2. CATEGORY-LEVEL WEBGL CONTROLLER (Optimized GPU Rendering & Skeleton State Sync)
   */
  function initCategoryGLManager(sectionEl) {
    if (prefersReducedMotion) return null;

    const viewportEl = sectionEl.querySelector('.gallery-track-viewport');
    const mediaFrames = sectionEl.querySelectorAll('.gallery-card-media-frame');
    if (!viewportEl || mediaFrames.length === 0) return null;

    const canvas = document.createElement('canvas');
    canvas.className = 'gallery-category-gl-canvas';
    viewportEl.appendChild(canvas);

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      powerPreference: 'high-performance',
    });

    if (!gl) {
      canvas.remove();
      return null;
    }

    const program = createGLProgram(gl, VS_SOURCE, FS_SOURCE);
    if (!program) {
      canvas.remove();
      return null;
    }

    gl.useProgram(program);

    const mesh = createSubdividedPlane(gl, 20, 20);

    const aPosLoc = gl.getAttribLocation(program, 'aPosition');
    const uBoundsLoc = gl.getUniformLocation(program, 'uBounds');
    const uVelocityLoc = gl.getUniformLocation(program, 'uVelocity');
    const uImageRatioLoc = gl.getUniformLocation(program, 'uImageRatio');
    const uCardSizeLoc = gl.getUniformLocation(program, 'uCardSize');
    const uRadiusLoc = gl.getUniformLocation(program, 'uRadius');
    const uTextureLoc = gl.getUniformLocation(program, 'uTexture');

    const cardData = [];

    mediaFrames.forEach((frame) => {
      const domImg = frame.querySelector('img');
      const imgSrc = frame.dataset.imgSrc || (domImg && domImg.src);
      if (!imgSrc) return;

      const markCardLoaded = () => {
        frame.classList.add('is-loaded');
        if (domImg) domImg.classList.add('is-loaded');
      };

      if (domImg && domImg.complete && domImg.naturalWidth > 0) {
        markCardLoaded();
      } else if (domImg) {
        domImg.addEventListener('load', markCardLoaded);
        domImg.addEventListener('error', markCardLoaded);
      }

      const texture = gl.createTexture();
      const cardItem = {
        frame,
        domImg,
        texture,
        textureReady: false,
        imgNaturalWidth: 800,
        imgNaturalHeight: 1000,
      };

      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = imgSrc;

      const onImageLoaded = () => {
        markCardLoaded();
        cardItem.imgNaturalWidth = image.naturalWidth || 800;
        cardItem.imgNaturalHeight = image.naturalHeight || 1000;

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        cardItem.textureReady = true;
        sectionEl.classList.add('has-gl-active');
        render(0);
      };

      if (image.complete && image.naturalWidth > 0) {
        onImageLoaded();
      } else {
        image.onload = onImageLoaded;
        image.onerror = markCardLoaded;
      }

      cardData.push(cardItem);
    });

    let isVisible = true;
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
              render(0);
            }
          });
        },
        { rootMargin: '350px' }
      );
      observer.observe(sectionEl);
    }

    function resize() {
      const rect = viewportEl.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    }

    function render(velocity) {
      if (!isVisible) return;

      resize();

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.posBuffer);
      gl.enableVertexAttribArray(aPosLoc);
      gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);

      const vpRect = viewportEl.getBoundingClientRect();
      if (vpRect.width <= 0 || vpRect.height <= 0) return;

      gl.uniform1f(uVelocityLoc, velocity || 0);
      gl.uniform1f(uRadiusLoc, 20.0);

      cardData.forEach((item) => {
        if (!item.textureReady) return;

        const cardRect = item.frame.getBoundingClientRect();

        if (cardRect.right < vpRect.left - 120 || cardRect.left > vpRect.right + 120) {
          return;
        }

        const x = cardRect.left - vpRect.left;
        const y = cardRect.top - vpRect.top;
        const w = cardRect.width;
        const h = cardRect.height;

        const ndcLeft = (x / vpRect.width) * 2.0 - 1.0;
        const ndcTop = 1.0 - (y / vpRect.height) * 2.0;
        const ndcWidth = (w / vpRect.width) * 2.0;
        const ndcHeight = (h / vpRect.height) * 2.0;

        gl.uniform4f(uBoundsLoc, ndcLeft, ndcTop, ndcWidth, ndcHeight);
        gl.uniform2f(uCardSizeLoc, w, h);
        gl.uniform2f(uImageRatioLoc, item.imgNaturalWidth, item.imgNaturalHeight);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, item.texture);
        gl.uniform1i(uTextureLoc, 0);

        gl.drawElements(gl.TRIANGLES, mesh.indexCount, gl.UNSIGNED_SHORT, 0);
      });
    }

    return { render, resize, sectionEl };
  }

  /**
   * 3. LENIS SMOOTH SCROLLER INITIALIZATION & GSAP BRIDGING
   */
  function initLenisSmoothScroll() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[Elysium Gallery] GSAP or ScrollTrigger missing.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    if (typeof Lenis !== 'undefined') {
      try {
        lenisInstance = new Lenis({
          duration: 0.95,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          smoothTouch: false,
          wheelMultiplier: 0.95,
          touchMultiplier: 1.0,
          infinite: false,
        });

        lenisInstance.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
          if (lenisInstance) {
            lenisInstance.raf(time * 1000);
          }
        });

        gsap.ticker.lagSmoothing(500, 33);
        window.__elysiumLenis = lenisInstance;
      } catch (err) {
        console.warn('[Elysium Gallery] Lenis fallback:', err);
      }
    }
  }

  /**
   * 4. GALLERY HERO REVEAL ANIMATION
   */
  function initHeroReveal() {
    if (prefersReducedMotion) return;

    const heroTitle = document.querySelector('.gallery-hero-title');
    const heroEyebrow = document.querySelector('.gallery-hero-eyebrow');
    const heroDesc = document.querySelector('.gallery-hero-description');
    const quickLinks = document.querySelectorAll('.gallery-quick-link');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (heroEyebrow) {
      tl.fromTo(heroEyebrow, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, clearProps: 'all' }, 0.1);
    }

    if (heroTitle) {
      tl.fromTo(heroTitle, { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 0.7, clearProps: 'all' }, 0.15);
    }

    if (heroDesc) {
      tl.fromTo(heroDesc, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, clearProps: 'all' }, 0.25);
    }

    if (quickLinks && quickLinks.length > 0) {
      tl.fromTo(
        quickLinks,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.03, duration: 0.45, clearProps: 'opacity,transform' },
        0.35
      );
    }
  }

  /**
   * 5. MASTER CATEGORY PINNED HORIZONTAL GALLERIES & WEBGL PIPELINE
   */
  function initHorizontalGalleries() {
    const categorySections = document.querySelectorAll('.gallery-category-section');
    if (!categorySections || categorySections.length === 0) return;

    categorySections.forEach((section, catIdx) => {
      const track = section.querySelector('.gallery-track');
      const viewport = section.querySelector('.gallery-track-viewport');
      const progressFill = section.querySelector('.gallery-category-progress-fill');
      const catId = section.dataset.categoryId || section.id.replace('cat-', '');

      if (!track || !viewport) return;

      const glManager = initCategoryGLManager(section);

      const getMaxDistance = () => {
        return Math.max(0, track.scrollWidth - viewport.clientWidth);
      };

      const horizontalTween = gsap.to(track, {
        x: () => -getMaxDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getMaxDistance()}`,
          pin: true,
          pinSpacing: true,
          scrub: prefersReducedMotion ? false : 0.1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onEnter: () => setActiveCategoryNav(catId),
          onEnterBack: () => setActiveCategoryNav(catId),
          onUpdate: (self) => {
            if (progressFill) {
              progressFill.style.width = `${(self.progress * 100).toFixed(1)}%`;
            }
          },
        },
      });

      // Hook up manual track Prev / Next arrow buttons
      const prevBtn = section.querySelector('.gallery-track-prev-btn');
      const nextBtn = section.querySelector('.gallery-track-next-btn');

      if (prevBtn && horizontalTween.scrollTrigger) {
        prevBtn.addEventListener('click', () => {
          const st = horizontalTween.scrollTrigger;
          const maxDist = getMaxDistance();
          if (maxDist > 0) {
            const stepProgress = 400 / maxDist;
            const newProgress = Math.max(0, st.progress - stepProgress);
            const targetY = st.start + newProgress * (st.end - st.start);
            scrollToPosition(targetY);
          }
        });
      }

      if (nextBtn && horizontalTween.scrollTrigger) {
        nextBtn.addEventListener('click', () => {
          const st = horizontalTween.scrollTrigger;
          const maxDist = getMaxDistance();
          if (maxDist > 0) {
            const stepProgress = 400 / maxDist;
            const newProgress = Math.min(1, st.progress + stepProgress);
            const targetY = st.start + newProgress * (st.end - st.start);
            scrollToPosition(targetY);
          }
        });
      }

      const catInstance = {
        section,
        catId,
        catIdx,
        track,
        viewport,
        glManager,
        st: horizontalTween.scrollTrigger,
        lastX: 0,
        currentVelocity: 0,
      };

      categoryInstances.push(catInstance);
    });

    // Velocity Distortion Ticker Loop
    if (!prefersReducedMotion) {
      gsap.ticker.add(() => {
        categoryInstances.forEach((cat) => {
          const { track, glManager, st } = cat;
          if (!glManager) return;

          const currentX = gsap.getProperty(track, 'x') || 0;
          const deltaX = currentX - cat.lastX;
          cat.lastX = currentX;

          if (!st || !st.isActive) {
            if (Math.abs(cat.currentVelocity) > 0.0001) {
              cat.currentVelocity += (0 - cat.currentVelocity) * 0.16;
              if (Math.abs(cat.currentVelocity) < 0.0001) cat.currentVelocity = 0;
              glManager.render(cat.currentVelocity);
            }
            return;
          }

          const clampedDelta = Math.max(-80, Math.min(80, deltaX));
          const targetVelocity = clampedDelta * 0.0028;

          cat.currentVelocity += (targetVelocity - cat.currentVelocity) * 0.14;

          if (Math.abs(cat.currentVelocity) < 0.00005 && Math.abs(targetVelocity) < 0.00005) {
            cat.currentVelocity = 0;
          }

          glManager.render(cat.currentVelocity);
        });
      });
    }
  }

  /**
   * 6. SMOOTH SCROLL TO POSITION OR CATEGORY
   */
  function scrollToPosition(targetY) {
    if (lenisInstance) {
      lenisInstance.scrollTo(targetY, {
        duration: 0.95,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  }

  function scrollToCategory(catId) {
    if (!catId) return;
    const cleanId = catId.replace(/^#/, '').replace(/^cat-/, '');

    const cat = categoryInstances.find(
      (c) => c.catId === cleanId || c.section.id === `cat-${cleanId}` || c.section.id === cleanId
    );

    if (cat && cat.st) {
      const targetScroll = cat.st.start + 2;
      scrollToPosition(targetScroll);
      setActiveCategoryNav(cleanId);
    } else {
      const el = document.getElementById(`cat-${cleanId}`) || document.getElementById(cleanId);
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset;
        scrollToPosition(top);
        setActiveCategoryNav(cleanId);
      }
    }
  }

  /**
   * 7. ACTIVE CATEGORY NAV SYNC (Hero Navigation Bar)
   */
  function setActiveCategoryNav(activeCatId) {
    if (!activeCatId) return;
    const cleanId = activeCatId.replace(/^#/, '').replace(/^cat-/, '');

    const heroLinks = document.querySelectorAll('.gallery-quick-link');
    heroLinks.forEach((link) => {
      const linkCat = link.dataset.targetCat || link.getAttribute('href')?.replace(/^#cat-/, '');
      if (linkCat === cleanId) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }

  /**
   * 8. QUICK-JUMP NAVIGATION & NEXT-CATEGORY BUTTONS
   */
  function initQuickNavLinks() {
    const quickLinks = document.querySelectorAll('.gallery-quick-link');
    quickLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetCat = link.dataset.targetCat || link.getAttribute('href')?.replace(/^#cat-/, '');
        if (targetCat) scrollToCategory(targetCat);
      });
    });

    const nextCatBtns = document.querySelectorAll('.gallery-next-cat-btn');
    nextCatBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetCat = btn.dataset.targetCat;
        if (targetCat) scrollToCategory(targetCat);
      });
    });
  }

  /**
   * 9. DEEP-LINKING / EXTERNAL CATEGORY REDIRECTION HANDLER
   */
  function handleDeepLinkNavigation() {
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(window.location.search);
    const catParam = searchParams.get('cat') || searchParams.get('category');
    const targetId = catParam || (hash ? hash.replace('#', '') : null);

    if (targetId) {
      // Allow ScrollTrigger to fully settle and layout coordinates to lock
      setTimeout(() => {
        scrollToCategory(targetId);
      }, 300);
    }

    window.addEventListener('hashchange', () => {
      const newHash = window.location.hash;
      if (newHash) {
        scrollToCategory(newHash);
      }
    });
  }

  /**
   * 10. ASYNC IMAGE LOADING & SKELETON SHIMMER RESOLUTION
   */
  function setupImageRecalculation() {
    const mediaFrames = document.querySelectorAll('.gallery-card-media-frame');
    mediaFrames.forEach((frame) => {
      const img = frame.querySelector('.gallery-card-img');
      if (!img) return;

      const resolveLoaded = () => {
        frame.classList.add('is-loaded');
        img.classList.add('is-loaded');
      };

      if (img.complete && img.naturalWidth > 0) {
        resolveLoaded();
      } else {
        img.addEventListener('load', () => {
          resolveLoaded();
          ScrollTrigger.refresh();
        });
        img.addEventListener('error', resolveLoaded);
      }
    });
  }

  /**
   * 11. MASTER INITIALIZATION
   */
  function init() {
    initLenisSmoothScroll();
    initHeroReveal();
    initHorizontalGalleries();
    initQuickNavLinks();
    setupImageRecalculation();
    handleDeepLinkNavigation();

    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
      categoryInstances.forEach((cat) => {
        if (cat.glManager) {
          cat.glManager.resize();
          cat.glManager.render(0);
        }
      });
      handleDeepLinkNavigation();
    });

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
        categoryInstances.forEach((cat) => {
          if (cat.glManager) {
            cat.glManager.resize();
            cat.glManager.render(0);
          }
        });
      }, 150);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
