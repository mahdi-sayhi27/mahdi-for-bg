'use client';

import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useTransform, animate, motion } from 'framer-motion';

/**
 * French locale number formatter.
 * Formats numbers with spaces as thousands separators (e.g., 1 000, 10 000).
 */
const frenchFormatter = new Intl.NumberFormat('fr-FR');

interface AnimatedCounterProps {
  /** The target number to count up to */
  value: number;
  /** A suffix to display after the number (e.g., "+", "%", "k") */
  suffix?: string;
  /** Duration of the counting animation in seconds */
  duration?: number;
  className?: string;
}

/**
 * AnimatedCounter — Counts up from 0 to a target value when scrolled into view.
 *
 * Uses framer-motion's `useMotionValue` and `animate` to smoothly
 * interpolate between 0 and the target value. Numbers are formatted
 * using the French locale (fr-FR) for proper thousands separators.
 *
 * The animation triggers only once when the element enters the viewport.
 */
export default function AnimatedCounter({
  value,
  suffix = '',
  duration = 2,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  // Detect when the counter scrolls into view (trigger once)
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  // Motion value that drives the counting animation
  const motionValue = useMotionValue(0);

  // Transform the raw motion value into a formatted display string
  const displayValue = useTransform(motionValue, (latest) => {
    // Round to avoid floating-point display issues
    return frenchFormatter.format(Math.round(latest));
  });

  // Start the counting animation when the element comes into view
  useEffect(() => {
    if (!isInView) return;

    const controls = animate(motionValue, value, {
      duration,
      ease: 'easeOut',
    });

    // Cleanup: stop the animation if the component unmounts
    return () => controls.stop();
  }, [isInView, motionValue, value, duration]);

  return (
    <span ref={ref} className={className}>
      {/* motion.span re-renders as the motion value updates */}
      <motion.span>{displayValue}</motion.span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}
