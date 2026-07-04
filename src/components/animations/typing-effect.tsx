'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface TypingEffectProps {
  /** Array of strings to cycle through */
  texts: string[];
  className?: string;
  /** Typing speed in milliseconds per character */
  speed?: number;
  /** Deletion speed in milliseconds per character */
  deleteSpeed?: number;
  /** Pause duration (ms) after fully typing a word before deleting */
  pauseDuration?: number;
}

/**
 * TypingEffect — A typewriter text animation that cycles through
 * an array of strings indefinitely.
 *
 * The component types out each text character-by-character, pauses,
 * then deletes character-by-character before moving to the next text.
 * A blinking cursor (|) is displayed at the end of the current text.
 */
export default function TypingEffect({
  texts,
  className,
  speed = 100,
  deleteSpeed = 50,
  pauseDuration = 2000,
}: TypingEffectProps) {
  // Index of the current text in the texts array
  const [textIndex, setTextIndex] = useState(0);
  // Number of characters currently displayed
  const [charIndex, setCharIndex] = useState(0);
  // Whether we're currently deleting characters
  const [isDeleting, setIsDeleting] = useState(false);
  // Whether we're pausing after fully typing a word
  const [isPaused, setIsPaused] = useState(false);

  const currentText = texts[textIndex] || '';

  const handleTyping = useCallback(() => {
    if (isPaused) return;

    if (!isDeleting) {
      // --- Typing phase ---
      if (charIndex < currentText.length) {
        // Add next character
        setCharIndex((prev) => prev + 1);
      } else {
        // Fully typed — pause before deleting
        setIsPaused(true);
        setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      // --- Deleting phase ---
      if (charIndex > 0) {
        // Remove last character
        setCharIndex((prev) => prev - 1);
      } else {
        // Fully deleted — move to next text
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    }
  }, [charIndex, currentText.length, isDeleting, isPaused, pauseDuration, texts.length]);

  useEffect(() => {
    if (isPaused) return;

    const timeout = setTimeout(
      handleTyping,
      isDeleting ? deleteSpeed : speed,
    );

    return () => clearTimeout(timeout);
  }, [handleTyping, isDeleting, isPaused, deleteSpeed, speed]);

  return (
    <span className={cn('inline-flex items-center', className)}>
      {/* The currently visible portion of the text */}
      <span>{currentText.slice(0, charIndex)}</span>

      {/* Blinking cursor */}
      <span
        className="ml-0.5 inline-block animate-blink font-light"
        aria-hidden="true"
      >
        |
      </span>

      {/*
        The blink animation is defined via a global CSS keyframe.
        Add this to your global CSS if not already present:

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 0.8s step-end infinite;
        }
      */}
    </span>
  );
}
