'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Configuration for each gradient blob.
 * Defines color, size, blur, opacity, animation path, and timing.
 */
interface BlobConfig {
  /** Tailwind-compatible background color */
  color: string;
  /** Blob diameter in pixels */
  size: number;
  /** Animation duration in seconds */
  duration: number;
  /** Initial position offset */
  initialX: string;
  initialY: string;
  /**
   * Keyframes for the blob's movement path.
   * Each blob traces a unique path to avoid uniform motion.
   */
  xKeyframes: string[];
  yKeyframes: string[];
  /** Blob opacity */
  opacity: number;
}

const blobs: BlobConfig[] = [
  {
    // Top-left blob — sky-400, moves in a wide oval
    color: 'bg-sky-400',
    size: 500,
    duration: 18,
    initialX: '10%',
    initialY: '10%',
    xKeyframes: ['10%', '40%', '30%', '10%'],
    yKeyframes: ['10%', '30%', '50%', '10%'],
    opacity: 0.15,
  },
  {
    // Top-right blob — cyan-400, traces a figure-8 horizontally
    color: 'bg-cyan-400',
    size: 450,
    duration: 22,
    initialX: '60%',
    initialY: '15%',
    xKeyframes: ['60%', '35%', '65%', '60%'],
    yKeyframes: ['15%', '45%', '25%', '15%'],
    opacity: 0.12,
  },
  {
    // Bottom-center blob — blue-500, gentle circular drift
    color: 'bg-blue-500',
    size: 550,
    duration: 25,
    initialX: '30%',
    initialY: '55%',
    xKeyframes: ['30%', '55%', '45%', '30%'],
    yKeyframes: ['55%', '35%', '65%', '55%'],
    opacity: 0.1,
  },
  {
    // Center blob — indigo-500, slow wandering path
    color: 'bg-indigo-500',
    size: 400,
    duration: 20,
    initialX: '50%',
    initialY: '40%',
    xKeyframes: ['50%', '25%', '55%', '50%'],
    yKeyframes: ['40%', '60%', '20%', '40%'],
    opacity: 0.08,
  },
];

interface MeshGradientProps {
  className?: string;
}

/**
 * MeshGradient — An animated mesh gradient background composed of
 * large, heavily-blurred gradient blobs that drift along unique paths.
 *
 * Each blob is a rounded div with a Tailwind color class, heavy blur,
 * and low opacity. Framer-motion animates each blob along circular or
 * figure-8 paths with infinite repeat at staggered durations (15–25s).
 *
 * Place this component behind content with -z-10 positioning.
 */
export default function MeshGradient({ className }: MeshGradientProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 -z-10 overflow-hidden',
        className,
      )}
      aria-hidden="true"
    >
      {blobs.map((blob, index) => (
        <motion.div
          key={index}
          className={cn('absolute rounded-full blur-3xl', blob.color)}
          style={{
            width: blob.size,
            height: blob.size,
            opacity: blob.opacity,
          }}
          animate={{
            left: blob.xKeyframes,
            top: blob.yKeyframes,
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
