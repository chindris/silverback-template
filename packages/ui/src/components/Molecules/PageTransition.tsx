'use client';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import React, { PropsWithChildren, useEffect } from 'react';

import { Messages, readMessages } from './Messages';

export function PageTransitionWrapper({ children }: PropsWithChildren) {
  return (
    <main>
      {useReducedMotion() ? (
        <>{children}</>
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          {children}
        </AnimatePresence>
      )}
    </main>
  );
}

export function PageTransition({ children }: PropsWithChildren) {
  const [messages, setMessages] = React.useState<Array<string>>([]);
  useEffect(() => {
    setMessages(readMessages());
  }, []);
  return useReducedMotion() ? (
    <main id="main-content">
      <Messages messages={messages} />
      {children}
    </main>
  ) : (
    <motion.main
      id="main-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        type: 'spring',
        mass: 0.35,
        stiffness: 75,
        duration: 0.3,
      }}
    >
      <Messages messages={messages} />
      {children}
    </motion.main>
  );
}
