(function () {
  'use strict';

  const TOTAL_FRAMES = 181;

  const STORY_STEPS = [
    { start: 0, end: 0.15, text: 'Before the first detail.' },
    { start: 0.15, end: 0.3, text: 'The space takes shape.' },
    { start: 0.3, end: 0.5, text: 'Form enters the room.' },
    { start: 0.5, end: 0.7, text: 'Material meets purpose.' },
    { start: 0.7, end: 0.9, text: 'Details make it home.' },
    { start: 0.9, end: 1.0, text: 'Designed to be lived in.' },
  ];

  function getFramePath(index) {
    const safeIndex = Math.min(Math.max(index + 1, 1), TOTAL_FRAMES);
    const padded = String(safeIndex).padStart(3, '0');
    return `/hero-frames/ezgif-frame-${padded}.jpg`;
  }

  function initHero() {
    const container = document.getElementById('hero-scroll-container');
    const canvas = document.getElementById('hero-canvas');
    const preloader = document.getElementById('hero-preloader');
    const progressBar = document.getElementById('preloader-progress-bar');
    const progressText = document.getElementById('preloader-progress-text');
    const storyTextEl = document.getElementById('story-overlay-text');
    const scrollProgressTextEl = document.getElementById('scroll-progress-text');

    if (!container || !canvas) {
      return;
    }

    const ctx = canvas.getContext('2d', { alpha: false });
    const images = new Array(TOTAL_FRAMES).fill(null);
    const loadedMap = new Array(TOTAL_FRAMES).fill(false);
    let loadedCount = 0;
    let currentFrameIndex = 0;
    let isDisposed = false;
    let hasRenderedAny = false;
    let heroScrollTrigger = null;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resizeCanvas() {
      if (!canvas || isDisposed) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';

      drawFrame(currentFrameIndex);
    }

    function getFrameImage(index) {
      if (images[index] && loadedMap[index]) return images[index];
      // Search nearest loaded frame
      for (let offset = 1; offset < 35; offset++) {
        if (index - offset >= 0 && images[index - offset] && loadedMap[index - offset]) {
          return images[index - offset];
        }
        if (index + offset < TOTAL_FRAMES && images[index + offset] && loadedMap[index + offset]) {
          return images[index + offset];
        }
      }
      // Return first available loaded frame
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (images[i] && loadedMap[i]) return images[i];
      }
      return images[0];
    }

    function drawFrame(index) {
      if (!ctx || !canvas) return;
      const img = getFrameImage(index);
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      if (canvasWidth === 0 || canvasHeight === 0) return;

      const imageAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = canvasWidth / canvasHeight;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (canvasAspect > imageAspect) {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imageAspect;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
      } else {
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imageAspect;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      hasRenderedAny = true;
    }

    function handleProgress(progress) {
      if (isDisposed) return;

      if (scrollProgressTextEl) {
        scrollProgressTextEl.innerText = `SCROLL PROGRESS: ${Math.round(progress * 100)}%`;
      }

      const activeStep = STORY_STEPS.find((s) => progress >= s.start && progress <= s.end);
      if (activeStep && storyTextEl && storyTextEl.innerText !== activeStep.text) {
        storyTextEl.innerText = activeStep.text;
      }

      const targetFrame = prefersReducedMotion
        ? 0
        : Math.min(Math.round(progress * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);

      if (targetFrame !== currentFrameIndex || !hasRenderedAny) {
        currentFrameIndex = targetFrame;
        drawFrame(targetFrame);
      }
    }

    function setupScrollTrigger() {
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        if (heroScrollTrigger) {
          heroScrollTrigger.kill();
        }

        heroScrollTrigger = ScrollTrigger.create({
          trigger: container,
          start: 'top top',
          end: '+=2000',
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            handleProgress(self.progress);
          },
        });

        console.log('[Elysium Hero] GSAP ScrollTrigger pinning initialized.');
      }
    }

    function updatePreloaderProgress(pct) {
      if (progressBar) {
        progressBar.style.width = pct + '%';
      }
      if (progressText) {
        progressText.innerText = `INITIALIZING SPACE ${pct}%`;
      }
    }

    function dismissPreloader() {
      if (preloader) {
        preloader.style.pointerEvents = 'none';
        preloader.style.opacity = '0';
        setTimeout(() => {
          if (preloader) preloader.style.display = 'none';
        }, 300);
      }
    }

    function loadSingleFrame(index) {
      return new Promise((resolve) => {
        if (images[index] && loadedMap[index]) {
          resolve();
          return;
        }
        const img = new Image();
        let settled = false;
        const done = (success) => {
          if (settled) return;
          settled = true;
          loadedMap[index] = success;
          if (success) {
            images[index] = img;
            loadedCount++;
            const pct = Math.min(Math.round((loadedCount / 10) * 100), 100);
            updatePreloaderProgress(pct);
            if (!hasRenderedAny || index === currentFrameIndex) {
              drawFrame(currentFrameIndex);
            }
          }
          resolve();
        };

        img.onload = () => done(true);
        img.onerror = () => done(false);
        setTimeout(() => done(false), 5000);
        img.src = getFramePath(index);
      });
    }

    async function startLoading() {
      // 1. Establish initial canvas coordinate buffer
      resizeCanvas();

      // 2. Setup ScrollTrigger pinning immediately
      setupScrollTrigger();

      // 3. Safety timer: dismiss preloader after 800ms max so space is never blocked
      const safetyTimer = setTimeout(() => {
        dismissPreloader();
        drawFrame(0);
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      }, 800);

      // 4. Load initial frame (Frame 0) first for instant visual paint
      await loadSingleFrame(0);
      clearTimeout(safetyTimer);

      if (isDisposed) return;

      dismissPreloader();
      drawFrame(0);

      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }

      // 5. Quickly load initial 10 frames in parallel for instant smooth scrub
      const earlyBatch = [];
      for (let i = 1; i < 10; i++) {
        earlyBatch.push(loadSingleFrame(i));
      }
      await Promise.all(earlyBatch);

      if (isDisposed) return;

      // 6. Progressive background loading of all remaining frames
      for (let i = 10; i < TOTAL_FRAMES; i += 10) {
        if (isDisposed) break;
        const batch = [];
        for (let j = i; j < Math.min(i + 10, TOTAL_FRAMES); j++) {
          batch.push(loadSingleFrame(j));
        }
        await Promise.all(batch);
        await new Promise((r) => setTimeout(r, 15));
      }
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('orientationchange', () => {
      setTimeout(resizeCanvas, 100);
    }, { passive: true });

    window.addEventListener('beforeunload', () => {
      isDisposed = true;
      if (heroScrollTrigger) {
        heroScrollTrigger.kill();
      }
    });

    startLoading();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHero);
  } else {
    initHero();
  }
})();
