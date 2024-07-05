'use client';
import { motion } from 'framer-motion';
import React, { PropsWithChildren, useEffect, useState } from 'react';

export function FadeUp({
  yGap,
  children,
  className,
}: PropsWithChildren<{ yGap: number; className?: string }>) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = () => {
      setReducedMotion(mediaQuery.matches);
    };

    // Set the initial value
    handleChange();

    // Add the event listener
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      // Clean up the event listener on unmount
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [reducedMotion]);

  return (
    <motion.div
      className={className}
      transition={{ duration: 0.8 }}
      style={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : yGap }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
