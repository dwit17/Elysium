'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ImageSequenceManager, TOTAL_FRAMES } from '@/lib/imageSequenceLoader';
import { createWhatsAppLink } from '@/lib/whatsapp';
import { BRAND_INFO } from '@/lib/constants';

// Register GSAP plugins (client-only, safe inside 'use client')
gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// Motion tokens — single source of truth for all Hero animation values
// ---------------------------------------------------------------------------
const MOTION = {
  entranceDuration: 1.0,
  entranceEase: 'power3.out',
  entranceStagger: 0.12,
  pillTransitionDuration: 0.4,
  pillEase: 'power2.inOut',
  scrollScrub: 0.5,
};

// Story steps define which narrative pill text appears at each scroll band
const STORY_STEPS = [
  { start: 0,    end: 0.15, text: 'Before the first detail.' },
  { start: 0.15, end: 0.3,  text: 'The space takes shape.' },
  { start: 0.3,  end: 0.5,  text: 'Form enters the room.' },
  { start: 0.5,  end: 0.7,  text: 'Material meets purpose.' },
  { start: 0.7,  end: 0.9,  text: 'Details make it home.' },
  { start: 0.9,  end: 1.0,  text: 'Designed to be lived in.' },
];

export default function ImageSequenceHero() {
  // -------------------------------------------------------------------------
  // Refs — canvas & container
  // -------------------------------------------------------------------------
  const containerRef    = useRef<HTMLDivElement>(null);
  const stickyRef       = useRef<HTMLDivElement>(null);
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const sequenceManagerRef = useRef<ImageSequenceManager | null>(null);
  const currentFrameIndexRef = useRef(0);

  // -------------------------------------------------------------------------
  // Refs — animated DOM nodes (GSAP writes directly here, no React re-renders)
  // -------------------------------------------------------------------------
  const eyebrowLineRef    = useRef<HTMLDivElement>(null);   // hairline + brand name row
  const headlineRef       = useRef<HTMLHeadingElement>(null);
  const subtitleRef       = useRef<HTMLParagraphElement>(null);
  const ctaRowRef         = useRef<HTMLDivElement>(null);
  const progressTextRef   = useRef<HTMLSpanElement>(null);  // "SCROLL PROGRESS: X%"
  const storyPillRef      = useRef<HTMLDivElement>(null);   // pill wrapper
  const storyTextRef      = useRef<HTMLSpanElement>(null);  // text node inside pill
  const heroOverlayRef    = useRef<HTMLDivElement>(null);   // main overlay (shown after load)
  const storyWrapperRef   = useRef<HTMLDivElement>(null);   // story pill wrapper (shown after load)
  const scrollBarRef      = useRef<HTMLDivElement>(null);   // bottom scroll indicator row

  // Tracking for story step to avoid redundant GSAP calls
  const activeStepIndexRef = useRef(0);

  // -------------------------------------------------------------------------
  // React state — only load progress; scroll state is now ref-driven
  // -------------------------------------------------------------------------
  const [isLoading, setIsLoading]       = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  // -------------------------------------------------------------------------
  // Reduced motion — respect prefers-reduced-motion
  // -------------------------------------------------------------------------
  const prefersReducedMotionRef = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = mq.matches;
    const onChange = (e: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = e.matches;
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // -------------------------------------------------------------------------
  // Canvas helpers — drawFrame & resizeCanvas
  // -------------------------------------------------------------------------
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const manager = sequenceManagerRef.current;
    if (!manager) return;
    const img = manager.getFrame(frameIndex);
    if (!img) return;

    const cw = canvas.width;
    const ch = canvas.height;
    ctx.clearRect(0, 0, cw, ch);

    const imgAspect    = img.width / img.height;
    const canvasAspect = cw / ch;

    let drawW: number, drawH: number, offX: number, offY: number;

    if (canvasAspect > imgAspect) {
      drawW = cw;
      drawH = cw / imgAspect;
      offX  = 0;
      offY  = (ch - drawH) / 2;
    } else {
      drawH = ch;
      drawW = ch * imgAspect;
      offX  = (cw - drawW) / 2;
      offY  = 0;
    }

    ctx.drawImage(img, offX, offY, drawW, drawH);
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Mobile: cap DPR at 1.5 for performance. Desktop: cap at 2.
    const isMobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
    canvas.width  = window.innerWidth  * dpr;
    canvas.height = window.innerHeight * dpr;
    drawFrame(currentFrameIndexRef.current);
  }, [drawFrame]);

  // -------------------------------------------------------------------------
  // Story pill text swap — GSAP fade, no React state, no Framer Motion
  // -------------------------------------------------------------------------
  const updateStoryPill = useCallback((stepIndex: number) => {
    if (stepIndex === activeStepIndexRef.current) return;
    activeStepIndexRef.current = stepIndex;

    const pill = storyPillRef.current;
    const text = storyTextRef.current;
    if (!pill || !text) return;

    if (prefersReducedMotionRef.current) {
      text.textContent = STORY_STEPS[stepIndex].text;
      return;
    }

    gsap.to(pill, {
      opacity: 0,
      y: -6,
      duration: MOTION.pillTransitionDuration / 2,
      ease: MOTION.pillEase,
      onComplete: () => {
        text.textContent = STORY_STEPS[stepIndex].text;
        gsap.to(pill, {
          opacity: 1,
          y: 0,
          duration: MOTION.pillTransitionDuration / 2,
          ease: MOTION.pillEase,
        });
      },
    });
  }, []);

  // -------------------------------------------------------------------------
  // Frame loader — preload priority frames then reveal hero
  // -------------------------------------------------------------------------
  useEffect(() => {
    const manager = new ImageSequenceManager((progress) => {
      setLoadProgress(Math.min(Math.round(progress), 100));
    });
    sequenceManagerRef.current = manager;

    let mounted = true;

    const onLoaded = () => {
      if (!mounted) return;
      setIsLoading(false);
      resizeCanvas();
      drawFrame(0);
    };

    // Hard safety fallback so the page is never stuck on the loader
    const safetyTimer = setTimeout(onLoaded, 700);

    manager.loadPriorityFrames().then(() => {
      clearTimeout(safetyTimer);
      onLoaded();
    });

    const onResize = () => {
      resizeCanvas();
      // Tell ScrollTrigger the layout may have changed
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      manager.dispose();
      window.removeEventListener('resize', onResize);
    };
  }, [resizeCanvas, drawFrame]);

  // -------------------------------------------------------------------------
  // GSAP — ScrollTrigger master + entrance animation
  // -------------------------------------------------------------------------
  useGSAP(
    () => {
      if (isLoading) return; // Wait for loading to complete before wiring up GSAP

      const container = containerRef.current;
      if (!container) return;

      const reduced = prefersReducedMotionRef.current;

      // --- Entrance Timeline -----------------------------------------------
      // Reveals hero typography once the preloader exits.
      // Each element fades + moves from y:24 → y:0.
      const entranceTargets = [
        eyebrowLineRef.current,
        headlineRef.current,
        subtitleRef.current,
        ctaRowRef.current,
      ].filter(Boolean);

      if (!reduced) {
        // Set initial state (invisible + offset)
        gsap.set(entranceTargets, { opacity: 0, y: 24 });

        // Also set story pill and scroll bar invisible initially
        if (storyWrapperRef.current) gsap.set(storyWrapperRef.current, { opacity: 0, y: 8 });
        if (scrollBarRef.current)    gsap.set(scrollBarRef.current,    { opacity: 0 });

        // Build entrance timeline
        const entranceTl = gsap.timeline({ delay: 0.15 });

        entranceTl
          .to(entranceTargets, {
            opacity:  1,
            y:        0,
            duration: MOTION.entranceDuration,
            ease:     MOTION.entranceEase,
            stagger:  MOTION.entranceStagger,
          })
          .to(
            storyWrapperRef.current,
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
            '-=0.5'
          )
          .to(
            scrollBarRef.current,
            { opacity: 1, duration: 0.5, ease: 'power2.out' },
            '-=0.4'
          );
      }

      // --- ScrollTrigger Master Timeline ------------------------------------
      // Canvas frame scrubbing + story step detection + progress text update.
      // Direct DOM updates only — no React setState.

      const st = ScrollTrigger.create({
        trigger:  container,
        start:    'top top',
        end:      'bottom bottom',
        scrub:    reduced ? 0 : MOTION.scrollScrub,
        onUpdate: (self) => {
          const progress = self.progress;

          // 1. Drive canvas frame
          const targetFrame = Math.round(progress * (TOTAL_FRAMES - 1));
          if (targetFrame !== currentFrameIndexRef.current) {
            currentFrameIndexRef.current = targetFrame;
            drawFrame(targetFrame);
          }

          // 2. Update scroll progress text (direct DOM — no setState)
          if (progressTextRef.current) {
            progressTextRef.current.textContent =
              `SCROLL PROGRESS: ${Math.round(progress * 100)}%`;
          }

          // 3. Story pill — find active step and update if changed
          const stepIndex = STORY_STEPS.findIndex(
            (s) => progress >= s.start && progress <= s.end
          );
          if (stepIndex !== -1) {
            updateStoryPill(stepIndex);
          }
        },
      });

      return () => {
        st.kill();
      };
    },
    { scope: containerRef, dependencies: [isLoading, drawFrame, updateStoryPill] }
  );

  // -------------------------------------------------------------------------
  // Explore / scroll-to-end button
  // -------------------------------------------------------------------------
  const handleExploreClick = () => {
    if (!containerRef.current) return;
    window.scrollTo({ top: containerRef.current.offsetHeight, behavior: 'smooth' });
  };

  const whatsappUrl = createWhatsAppLink();

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div ref={containerRef} className="relative w-full h-[400vh] bg-black">
      {/* Sticky Full-Screen Hero Viewport */}
      <div ref={stickyRef} className="sticky top-0 left-0 w-full h-dvh overflow-hidden select-none">

        {/* HTML Canvas Background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />

        {/* ---------------------------------------------------------------
            Preloader Overlay
            Framer Motion AnimatePresence kept — it is isolated, has no
            transform conflict with GSAP, and is unmounted before GSAP runs.
        --------------------------------------------------------------- */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center space-y-6 text-white px-6"
            >
              <span className="text-xs uppercase tracking-[0.45em] text-stone-400 font-mono">
                ELYSIUM
              </span>
              <h2 className="text-xl sm:text-2xl font-light tracking-[0.2em] uppercase text-stone-200">
                A SPACE IN MOTION
              </h2>
              <div className="w-48 h-[1.5px] bg-stone-800 relative overflow-hidden">
                <motion.div
                  className="absolute top-0 bottom-0 left-0 bg-white"
                  style={{ width: `${loadProgress}%` }}
                  transition={{ ease: 'easeOut' }}
                />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-stone-500">
                INITIALIZING SPACE {loadProgress}%
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------------------------------------------------------------
            Storytelling Pill
            Hidden during load; GSAP drives opacity/y after entrance.
        --------------------------------------------------------------- */}
        {!isLoading && (
          <div
            ref={storyWrapperRef}
            className="absolute top-1/3 left-6 md:left-16 z-20 max-w-xl pointer-events-none"
          >
            <div
              ref={storyPillRef}
              className="inline-block px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-xs"
            >
              <span
                ref={storyTextRef}
                className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-stone-300"
              >
                {STORY_STEPS[0].text}
              </span>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------
            Main Hero Overlay — Typography + CTAs + Scroll Indicator
            GSAP controls entrance opacity/y on each sub-ref.
        --------------------------------------------------------------- */}
        {!isLoading && (
          <div
            ref={heroOverlayRef}
            className="absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-16 pointer-events-none"
          >
            {/* Navbar spacer */}
            <div className="h-16" />

            {/* Bottom Hero Info & CTAs */}
            <div className="max-w-2xl space-y-6 pointer-events-auto">

              {/* Eyebrow: hairline + brand name */}
              <div ref={eyebrowLineRef} className="flex items-center space-x-3">
                <div className="w-10 h-[1px] bg-stone-400" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-stone-300 font-mono">
                  {BRAND_INFO.fullName}
                </span>
              </div>

              <div className="space-y-3">
                {/* H1 headline */}
                <h1
                  ref={headlineRef}
                  className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-[0.12em] leading-tight text-white uppercase font-sans"
                >
                  ELYSIUM
                </h1>

                {/* Subtitle / hero statement */}
                <p
                  ref={subtitleRef}
                  className="text-sm sm:text-base font-light text-stone-300 max-w-lg leading-relaxed tracking-wide"
                >
                  {BRAND_INFO.heroStatement}
                </p>
              </div>

              {/* CTAs */}
              <div ref={ctaRowRef} className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3.5 bg-white text-black text-xs font-semibold uppercase tracking-[0.25em] inline-flex items-center gap-2 hover:bg-stone-200 transition-colors"
                >
                  ENQUIRE NOW <ArrowUpRight className="w-4 h-4" />
                </a>
                <button
                  onClick={handleExploreClick}
                  className="px-6 py-3.5 border border-white/30 text-white text-xs uppercase tracking-[0.25em] hover:bg-white/10 transition-colors cursor-pointer"
                >
                  EXPLORE
                </button>
              </div>
            </div>

            {/* ---------------------------------------------------------------
                Scroll Indicator Row
                progressTextRef is updated directly by GSAP onUpdate — no setState.
                ArrowDown bounce kept in Framer Motion (isolated, no conflict).
            --------------------------------------------------------------- */}
            <div
              ref={scrollBarRef}
              className="flex justify-between items-end border-t border-white/10 pt-4 pointer-events-auto"
            >
              <span
                ref={progressTextRef}
                className="text-[9px] font-mono tracking-widest text-stone-400 uppercase"
              >
                SCROLL PROGRESS: 0%
              </span>

              <button
                onClick={handleExploreClick}
                className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-mono text-stone-300 hover:text-white transition-colors cursor-pointer"
              >
                <span>SCROLL TO BUILD</span>
                {/* Framer Motion bounce — isolated, no GSAP conflict */}
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </motion.div>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
