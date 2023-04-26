'use client';
import { motion } from 'framer-motion';
import React, { PropsWithChildren } from 'react';

export function ScrollPop({ children }: PropsWithChildren<{}>) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
