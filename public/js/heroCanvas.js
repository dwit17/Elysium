(function () {
  'use strict';

  const TOTAL_FRAMES = 181;
  const PRIORITY_FRAME_COUNT = 15;

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
    const storyTextEl = document.getElementById('story-overlay-text');
    const scrollProgressTextEl = document.getElementById('scroll-progress-text');

    if (!container || !canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    const images = new Array(TOTAL_FRAMES).fill(null);
    const loadedMap = new Array(TOTAL_FRAMES).fill(false);
    let currentFrameIndex = 0;
    let rafId = null;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resizeCanvas() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      drawFrame(currentFrameIndex);
    }

    function getFrameImage(index) {
      if (images[index] && loadedMap[index]) return images[index];
      // Search nearest loaded frame
      for (let offset = 1; offset < 30; offset++) {
        if (index - offset >= 0 && images[index - offset] && loadedMap[index - offset]) {
          return images[index - offset];
        }
        if (index + offset < TOTAL_FRAMES && images[index + offset] && loadedMap[index + offset]) {
          return images[index + offset];
        }
      }
      return images[0];
    }

    function drawFrame(index) {
      if (!ctx || !canvas) return;
      const img = getFrameImage(index);
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

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
    }

    function updateScroll() {
      const containerTop = container.offsetTop;
      const totalScrollableHeight = container.offsetHeight - window.innerHeight;
      if (totalScrollableHeight <= 0) return;

      const scrollY = Math.max(0, window.scrollY - containerTop);
      const progress = Math.min(Math.max(scrollY / totalScrollableHeight, 0), 1);

      if (scrollProgressTextEl) {
        scrollProgressTextEl.innerText = `SCROLL PROGRESS: ${Math.round(progress * 100)}%`;
      }

      const activeStep = STORY_STEPS.find((s) => progress >= s.start && progress <= s.end);
      if (activeStep && storyTextEl && storyTextEl.innerText !== activeStep.text) {
        storyTextEl.innerText = activeStep.text;
      }

      const targetFrame = prefersReducedMotion ? TOTAL_FRAMES - 1 : Math.round(progress * (TOTAL_FRAMES - 1));
      if (targetFrame !== currentFrameIndex) {
        currentFrameIndex = targetFrame;
        drawFrame(targetFrame);
      }
    }

    // Expose for external smooth scrollers (Lenis / GSAP)
    window.__elysiumUpdateHero = updateScroll;

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
          if (success) images[index] = img;
          resolve();
        };

        img.onload = () => done(true);
        img.onerror = () => done(false);
        setTimeout(() => done(false), 1200);
        img.src = getFramePath(index);
      });
    }

    let isDisposed = false;
    function dismissPreloader() {
      if (preloader) {
        preloader.style.pointerEvents = 'none';
        preloader.style.opacity = '0';
        setTimeout(() => {
          if (preloader) preloader.style.display = 'none';
        }, 400);
      }
    }

    async function startLoading() {
      // Safety fallback: preloader dismisses after 500ms max
      const safetyTimer = setTimeout(() => {
        dismissPreloader();
        resizeCanvas();
        drawFrame(0);
      }, 500);

      // Priority initial frames
      const priorityPromises = [];
      for (let i = 0; i < PRIORITY_FRAME_COUNT; i++) {
        priorityPromises.push(loadSingleFrame(i));
      }

      await Promise.all(priorityPromises);
      clearTimeout(safetyTimer);

      if (isDisposed) return;

      dismissPreloader();
      resizeCanvas();
      drawFrame(0);

      // Progressive background loading
      for (let i = PRIORITY_FRAME_COUNT; i < TOTAL_FRAMES; i += 12) {
        if (isDisposed) break;
        const batch = [];
        for (let j = i; j < Math.min(i + 12, TOTAL_FRAMES); j++) {
          batch.push(loadSingleFrame(j));
        }
        await Promise.all(batch);
        await new Promise((r) => setTimeout(r, 20));
      }
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('scroll', () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScroll);
    }, { passive: true });

    window.addEventListener('beforeunload', () => {
      isDisposed = true;
      if (rafId) cancelAnimationFrame(rafId);
    });

    startLoading();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHero);
  } else {
    initHero();
  }
})();
