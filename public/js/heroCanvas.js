/**
 * ELYSIUM HERO CANVAS RENDERING ENGINE
 * Direct Pipeline: Scroll -> ScrollTrigger -> GSAP Progress -> Canvas Frame
 * Zero React state, zero layout thrash, precomputed aspect geometry, GPU-accelerated.
 */
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

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    const images = new Array(TOTAL_FRAMES).fill(null);
    const loadedMap = new Array(TOTAL_FRAMES).fill(false);
    let loadedCount = 0;
    let currentFrameIndex = -1;
    let isDisposed = false;
    let hasRenderedAny = false;
    let heroScrollTrigger = null;

    let lastProgressPct = -1;
    let lastStoryText = '';

    // Precomputed render metrics (zero layout recalculation during scroll)
    const metrics = {
      drawWidth: 0,
      drawHeight: 0,
      offsetX: 0,
      offsetY: 0,
      aspectRatio: 16 / 9, // default fallback until frame 0 loads
      hasAspect: false,
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function updateRenderMetrics() {
      if (!canvas || isDisposed) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      const physicalWidth = Math.round(w * dpr);
      const physicalHeight = Math.round(h * dpr);

      canvas.width = physicalWidth;
      canvas.height = physicalHeight;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';

      const canvasAspect = physicalWidth / physicalHeight;
      const imageAspect = metrics.aspectRatio;

      if (canvasAspect > imageAspect) {
        metrics.drawWidth = physicalWidth;
        metrics.drawHeight = physicalWidth / imageAspect;
        metrics.offsetX = 0;
        metrics.offsetY = (physicalHeight - metrics.drawHeight) * 0.5;
      } else {
        metrics.drawHeight = physicalHeight;
        metrics.drawWidth = physicalHeight * imageAspect;
        metrics.offsetX = (physicalWidth - metrics.drawWidth) * 0.5;
        metrics.offsetY = 0;
      }
    }

    function resizeCanvas() {
      updateRenderMetrics();
      if (currentFrameIndex >= 0) {
        drawFrame(currentFrameIndex);
      }
    }

    function getFrameImage(index) {
      if (images[index] && loadedMap[index]) return images[index];
      // Search nearest loaded frame (bidirectional)
      for (let offset = 1; offset < 40; offset++) {
        const prev = index - offset;
        if (prev >= 0 && images[prev] && loadedMap[prev]) {
          return images[prev];
        }
        const next = index + offset;
        if (next < TOTAL_FRAMES && images[next] && loadedMap[next]) {
          return images[next];
        }
      }
      // Fallback: return first available loaded frame
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (images[i] && loadedMap[i]) return images[i];
      }
      return images[0];
    }

    function drawFrame(index) {
      if (!ctx || !canvas || isDisposed) return;
      const img = getFrameImage(index);
      if (!img || !img.complete || img.naturalWidth === 0) return;

      if (!metrics.hasAspect && img.naturalHeight > 0) {
        metrics.aspectRatio = img.naturalWidth / img.naturalHeight;
        metrics.hasAspect = true;
        updateRenderMetrics();
      }

      ctx.drawImage(
        img,
        metrics.offsetX,
        metrics.offsetY,
        metrics.drawWidth,
        metrics.drawHeight
      );
      hasRenderedAny = true;
    }

    /**
     * Direct pipeline update handler called by GSAP ScrollTrigger
     * Scroll -> ScrollTrigger -> GSAP progress -> canvas frame
     */
    function renderFrameByProgress(progress) {
      if (isDisposed) return;

      // 1. Calculate target frame index
      const targetFrame = prefersReducedMotion
        ? 0
        : Math.min(Math.floor(progress * TOTAL_FRAMES), TOTAL_FRAMES - 1);

      // 2. Direct canvas paint on frame change
      if (targetFrame !== currentFrameIndex || !hasRenderedAny) {
        currentFrameIndex = targetFrame;
        drawFrame(targetFrame);
      }

      // 3. String diff checks to avoid layout thrash on scroll
      if (scrollProgressTextEl) {
        const pct = Math.round(progress * 100);
        if (lastProgressPct !== pct) {
          lastProgressPct = pct;
          scrollProgressTextEl.textContent = `SCROLL PROGRESS: ${pct}%`;
        }
      }

      if (storyTextEl) {
        const activeStep = STORY_STEPS.find((s) => progress >= s.start && progress <= s.end);
        if (activeStep && activeStep.text !== lastStoryText) {
          lastStoryText = activeStep.text;
          storyTextEl.textContent = activeStep.text;
        }
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
          scrub: 0.1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            renderFrameByProgress(self.progress);
          },
        });

        console.log('[Elysium Hero] Direct GSAP ScrollTrigger -> Canvas pipeline initialized.');
      }
    }

    function updatePreloaderProgress(pct) {
      if (progressBar) {
        progressBar.style.width = pct + '%';
      }
      if (progressText) {
        progressText.textContent = `INITIALIZING SPACE ${pct}%`;
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
            const pct = Math.min(Math.round((loadedCount / 12) * 100), 100);
            updatePreloaderProgress(pct);
            if (!hasRenderedAny || index === currentFrameIndex) {
              drawFrame(currentFrameIndex >= 0 ? currentFrameIndex : 0);
            }
          }
          resolve();
        };

        img.onload = () => done(true);
        img.onerror = () => done(false);
        setTimeout(() => done(false), 6000);
        img.src = getFramePath(index);
      });
    }

    async function startLoading() {
      // 1. Establish initial canvas buffer geometry
      resizeCanvas();

      // 2. Setup ScrollTrigger pinning immediately
      setupScrollTrigger();

      // 3. Safety timer: dismiss preloader after 800ms max so visitor is never blocked
      const safetyTimer = setTimeout(() => {
        dismissPreloader();
        if (currentFrameIndex < 0) {
          currentFrameIndex = 0;
          drawFrame(0);
        }
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      }, 800);

      // 4. Load initial frame (Frame 0) first for instant visual paint
      await loadSingleFrame(0);
      clearTimeout(safetyTimer);

      if (isDisposed) return;

      dismissPreloader();
      currentFrameIndex = 0;
      drawFrame(0);

      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }

      // 5. Load first 12 frames in parallel for instant smooth scrub
      const earlyBatch = [];
      for (let i = 1; i < 12; i++) {
        earlyBatch.push(loadSingleFrame(i));
      }
      await Promise.all(earlyBatch);

      if (isDisposed) return;

      // 6. Progressive streaming of remaining frames in chunks
      for (let i = 12; i < TOTAL_FRAMES; i += 10) {
        if (isDisposed) break;
        const batch = [];
        for (let j = i; j < Math.min(i + 10, TOTAL_FRAMES); j++) {
          batch.push(loadSingleFrame(j));
        }
        await Promise.all(batch);
        // Micro-yield to keep main thread completely unblocked
        await new Promise((r) => setTimeout(r, 16));
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
