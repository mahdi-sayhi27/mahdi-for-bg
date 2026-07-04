'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Magnetic pull strength multiplier.
   * Higher values = stronger pull toward the cursor.
   */
  strength?: number;
}

/**
 * MagneticButton — A wrapper that creates a magnetic pull effect on hover.
 *
 * When the user hovers over the element, it tracks the mouse position
 * relative to the element's center and applies a proportional translation,
 * making the element "follow" the cursor. On mouse leave, the element
 * smoothly springs back to its original position.
 */
export default function MagneticButton({
  children,
  className,
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Current translation offsets driven by mouse position
  const [position, setPosition] = useState({ x: 0, y: 0 });

  /**
   * Calculate the mouse offset from the element's center
   * and apply it as a translation scaled by the strength factor.
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    // Element center coordinates
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Distance from cursor to center, scaled by strength
    const x = (e.clientX - centerX) * strength;
    const y = (e.clientY - centerY) * strength;

    setPosition({ x, y });
  };

  /**
   * Reset position on mouse leave — the spring transition
   * handles the smooth return animation.
   */
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      className={cn('inline-block', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
    >
      {children}
    </motion.div>
  );
}
