'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export function WinCelebration({ show, onClose }: { show: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, 2600);
    return () => clearTimeout(t);
  }, [show, onClose]);

  const pieces = Array.from({ length: 40 });

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* overlay leve */}
          <div className="absolute inset-0 bg-black/20" />

          {/* mensagem central */}
          <motion.div
            className="absolute inset-0 grid place-items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 12 }}
          >
            <div className="px-6 py-4 rounded-2xl bg-[var(--menu)]/90 border border-[var(--stroke)] shadow-2xl">
              <p className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] drop-shadow">Você acertou!! 🎉</p>
            </div>
          </motion.div>

          {/* balões subindo */}
          {pieces.map((_, i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 0.8;
            const dur = 2 + Math.random() * 0.8;
            const size = 26 + Math.random() * 10;
            const emoji = Math.random() > 0.5 ? '🎈' : '✨';
            return (
              <motion.div
                key={i}
                className="absolute"
                style={{ left: `${left}%`, bottom: -40, fontSize: size }}
                initial={{ y: 0, rotate: 0, opacity: 0 }}
                animate={{ y: -window.innerHeight * 0.9, rotate: 40, opacity: 1 }}
                transition={{ delay, duration: dur, ease: 'easeOut' }}
              >
                {emoji}
              </motion.div>
            );
          })}

          {/* confetes caindo */}
          {pieces.map((_, i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 0.6;
            const dur = 1.8 + Math.random() * 0.8;
            return (
              <motion.div
                key={`c${i}`}
                className="absolute w-2 h-3 rounded-sm"
                style={{
                  left: `${left}%`,
                  top: -20,
                  background:
                    i % 3 === 0 ? '#5b8cff' : i % 3 === 1 ? '#7ee787' : '#ff9dbb',
                }}
                initial={{ y: 0, rotate: 0, opacity: 0 }}
                animate={{ y: window.innerHeight * 0.95, rotate: 220, opacity: 1 }}
                transition={{ delay, duration: dur, ease: 'easeIn' }}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
