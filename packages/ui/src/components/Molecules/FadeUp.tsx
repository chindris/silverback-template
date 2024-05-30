'use client';
import { motion, useReducedMotion } from 'framer-motion';
import React, { PropsWithChildren } from 'react';

export function FadeUp({
  yGap,
  children,
  className,
}: PropsWithChildren<{ yGap: number; className?: string }>) {
  const reducedMotion = useReducedMotion();

  console.log("reducedMotion:", reducedMotion)

  return (
    <motion.div
      className={className}
      transition={{ duration: 0.8 }}
      style={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : yGap }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
