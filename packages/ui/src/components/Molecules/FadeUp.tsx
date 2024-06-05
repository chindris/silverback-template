'use client';
import clsx from 'clsx';
import { motion, useReducedMotion } from 'framer-motion';
import React, { PropsWithChildren } from 'react';

export function FadeUp({
  yGap,
  children,
  className,
}: PropsWithChildren<{ yGap: number; className?: string }>) {
  const reducedMotion = useReducedMotion();

  console.log('reducedMotion:', reducedMotion);
  return (
    <motion.div
      className={clsx(
        className,
        reducedMotion ? 'reducedMotion: On' : 'reducedMotion: Off',
      )}
      transition={{ duration: 0.8 }}
      style={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : yGap }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
