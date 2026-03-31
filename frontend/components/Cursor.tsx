'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Custom glowing cursor — replaces the default browser cursor on desktop.
 * Uses mix-blend-mode: difference for a color-inverting glow effect.
 */
export default function Cursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Only enable on non-touch devices
        if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) return;

        // Hide default cursor on entire page
        document.documentElement.style.cursor = 'none';

        let raf: number;
        let mouseX = -100, mouseY = -100;
        let ringX = -100, ringY = -100;

        const onMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

        const tick = () => {
            ringX = lerp(ringX, mouseX, 0.12);
            ringY = lerp(ringY, mouseY, 0.12);

            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${mouseX - 5}px, ${mouseY - 5}px)`;
            }
            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
            }
            raf = requestAnimationFrame(tick);
        };

        // Scale ring on interactive element hover
        const onEnter = () => ringRef.current?.classList.add('cursor-hover');
        const onLeave = () => ringRef.current?.classList.remove('cursor-hover');
        const interactables = 'a, button, input, select, textarea, [role="button"]';

        const attachListeners = () => {
            document.querySelectorAll<HTMLElement>(interactables).forEach(el => {
                el.addEventListener('mouseenter', onEnter);
                el.addEventListener('mouseleave', onLeave);
            });
        };

        attachListeners();
        window.addEventListener('mousemove', onMove);
        raf = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('mousemove', onMove);
            document.documentElement.style.cursor = '';
        };
    }, []);

    return (
        <>
            {/* Inner dot */}
            <div
                ref={dotRef}
                className="cursor-dot fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-indigo-500 dark:bg-indigo-400 pointer-events-none z-[99999] mix-blend-multiply dark:mix-blend-difference"
                style={{ willChange: 'transform' }}
            />
            {/* Outer ring */}
            <div
                ref={ringRef}
                className="cursor-ring fixed top-0 left-0 w-9 h-9 rounded-full border border-indigo-500/50 dark:border-indigo-400/60 pointer-events-none z-[99998] transition-[width,height,border-color] duration-150"
                style={{
                    willChange: 'transform',
                    boxShadow: 'var(--cursor-shadow, 0 0 8px rgba(99,102,241,0.35))',
                }}
            />
            <style>{`
        .cursor-hover {
          width: 52px !important;
          height: 52px !important;
          border-color: rgba(99,102,241,0.6) !important;
          box-shadow: 0 0 16px rgba(99,102,241,0.35) !important;
          margin-top: -7px;
          margin-left: -7px;
        }
        .dark .cursor-ring {
            --cursor-shadow: 0 0 12px rgba(99,102,241,0.3);
        }
        .dark .cursor-hover {
            border-color: rgba(139,92,246,0.7) !important;
            box-shadow: 0 0 20px rgba(139,92,246,0.4) !important;
        }
      `}</style>
        </>
    );
}
