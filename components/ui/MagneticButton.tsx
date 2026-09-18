'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  dataCursor?: string;
  onClick?: () => void;
}

export default function MagneticButton({
  children,
  className = '',
  strength = 0.35,
  dataCursor,
  onClick,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = buttonRef.current;
    if (!el) return;

    if (window.matchMedia('(pointer: coarse)').matches) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = (e.clientX - centerX) * strength;
      const distanceY = (e.clientY - centerY) * strength;

      xTo(distanceX);
      yTo(distanceY);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      gsap.to(el, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
    };

    const handleMouseEnter = () => {
      gsap.to(el, { scale: 1.03, duration: 0.3, ease: 'power2.out' });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, { scope: buttonRef });

  return (
    <div
      ref={buttonRef}
      data-cursor={dataCursor}
      onClick={onClick}
      className={`inline-block ${className}`}
    >
      {children}
    </div>
  );
}
