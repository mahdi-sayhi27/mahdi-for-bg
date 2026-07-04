'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Direction-based offset map for scroll reveal animations.
 * Maps each direction to its initial translateX/Y values.
 */
const directionOffsets = {
  up: { x: 0, y: 40 },
  down: { x: 0, y: -40 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
} as const;

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Delay before the animation starts (in seconds) */
  delay?: number;
  /** Direction from which the element reveals */
  direction?: 'up' | 'down' | 'left' | 'right';
}

/**
 * ScrollReveal — A reusable wrapper that reveals its children
 * with a fade + slide animation when scrolled into the viewport.
 *
 * Uses framer-motion's `useInView` to detect visibility and
 * animates opacity and translate based on the chosen direction.
 */
export default function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Trigger once when 20% of the element is visible
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const { x: offsetX, y: offsetY } = directionOffsets[direction];

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={{ opacity: 0, x: offsetX, y: offsetY }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: offsetX, y: offsetY }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
