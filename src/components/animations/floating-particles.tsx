'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Math symbols used as floating particles */
const MATH_SYMBOLS = ['∑', 'π', '∫', '√', 'Δ', '∞', 'α', 'β', 'θ', 'λ'];

/** Number of particles to generate */
const PARTICLE_COUNT = 18;

/**
 * Generates a random number within a given range (inclusive).
 */
function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

interface Particle {
  id: number;
  symbol: string;
  /** Left position as a percentage (0–100) */
  x: number;
  /** Top position as a percentage (0–100) */
  y: number;
  /** Font size in rem */
  fontSize: number;
  /** Base opacity (0.05–0.15) */
  opacity: number;
  /** Floating animation duration in seconds */
  duration: number;
  /** Animation start delay in seconds */
  delay: number;
  /** Vertical float distance in pixels */
  floatDistance: number;
}

/**
 * Generates an array of randomized particle configurations.
 * Each particle gets a random symbol, position, size, opacity,
 * and animation timing to create an organic floating effect.
 */
function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    symbol: MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)],
    x: randomInRange(2, 98),
    y: randomInRange(2, 98),
    fontSize: randomInRange(1, 3),
    opacity: randomInRange(0.05, 0.15),
    duration: randomInRange(4, 8),
    delay: randomInRange(0, 5),
    floatDistance: randomInRange(15, 35),
  }));
}

interface FloatingParticlesProps {
  className?: string;
}

/**
 * FloatingParticles — A decorative background layer of floating math symbols.
 *
 * Generates randomized particles that gently bob up and down using
 * framer-motion's infinite keyframe animation. Designed to be used as
 * an absolute-positioned background element with no pointer interaction.
 */
export default function FloatingParticles({ className }: FloatingParticlesProps) {
  const [mounted, setMounted] = useState(false);
  // Only generate particles after mount to avoid SSR hydration mismatch
  useEffect(() => setMounted(true), []);
  // Memoize particles so they don't regenerate on every render
  const particles = useMemo(() => (mounted ? generateParticles() : []), [mounted]);

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className,
      )}
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute select-none text-sky-400"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: `${particle.fontSize}rem`,
            opacity: particle.opacity,
          }}
          animate={{
            y: [0, -particle.floatDistance, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
        >
          {particle.symbol}
        </motion.span>
      ))}
    </div>
  );
}
