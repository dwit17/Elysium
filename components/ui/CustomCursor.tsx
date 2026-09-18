'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLSpanElement>(null);
  const [cursorText, setCursorText] = useState('');
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Disable on touch devices and small screens
    if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024) {
      setIsTouchDevice(true);
      return;
    }

    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    // Use GSAP quickTo for 120fps frictionless cursor follow
    const xToDot = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3' });
    const yToDot = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3' });
    const xToRing = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3' });
    const yToRing = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3' });

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    let isVisible = false;

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) {
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
        isVisible = true;
      }
      xToDot(e.clientX);
      yToDot(e.clientY);
      xToRing(e.clientX);
      yToRing(e.clientY);
    };

    const onMouseLeave = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
      isVisible = false;
    };

    const onMouseEnter = () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      isVisible = true;
    };

    // Attach hover listeners for interactive items
    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('[data-cursor], a, button, input, [role="button"]') as HTMLElement | null;
      if (!target) {
        setCursorText('');
        gsap.to(ring, {
          scale: 1,
          borderColor: 'rgba(255, 255, 255, 0.3)',
          backgroundColor: 'transparent',
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.to(dot, { scale: 1, opacity: 1, duration: 0.2 });
        return;
      }

      const cursorType = target.getAttribute('data-cursor');
      if (cursorType === 'view') {
        setCursorText('VIEW');
        gsap.to(ring, {
          scale: 2.8,
          borderColor: 'rgba(255, 255, 255, 0.8)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          duration: 0.3,
        });
        gsap.to(dot, { scale: 0, opacity: 0, duration: 0.2 });
      } else if (cursorType === 'explore') {
        setCursorText('EXPLORE');
        gsap.to(ring, {
          scale: 2.8,
          borderColor: 'rgba(255, 255, 255, 0.8)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          duration: 0.3,
        });
        gsap.to(dot, { scale: 0, opacity: 0, duration: 0.2 });
      } else {
        setCursorText('');
        gsap.to(ring, {
          scale: 1.6,
          borderColor: 'rgba(255, 255, 255, 0.6)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          duration: 0.3,
        });
        gsap.to(dot, { scale: 0.5, duration: 0.2 });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Center Precision Dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-50"
      />

      {/* Smooth Trailing Follower Ring */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/30 pointer-events-none z-50 flex items-center justify-center backdrop-blur-[0.5px]"
      >
        {cursorText && (
          <span
            ref={cursorTextRef}
            className="text-[6px] font-mono tracking-[0.2em] font-semibold text-white uppercase select-none pointer-events-none"
          >
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
}
