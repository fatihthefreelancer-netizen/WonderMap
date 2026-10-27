import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

const COLORS = ['#ffcc33', '#ff5a7a', '#7c4dff', '#5fce5f', '#4bb8f0', '#ff8a45'];

/** Lightweight CSS/motion confetti burst — no canvas dependency. */
export const Confetti = memo(function Confetti({ count = 80 }: { count?: number }) {
  const bits = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 520,
        y: 180 + Math.random() * 460,
        rot: Math.random() * 720 - 360,
        delay: Math.random() * 0.25,
        color: COLORS[i % COLORS.length],
        size: 7 + Math.random() * 8,
        round: Math.random() > 0.5,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
      {bits.map((b) => (
        <motion.div
          key={b.id}
          className="absolute left-1/2 top-1/3"
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: b.x, y: b.y, opacity: [1, 1, 0], rotate: b.rot }}
          transition={{ duration: 1.6, delay: b.delay, ease: 'easeOut' }}
          style={{
            width: b.size,
            height: b.size,
            background: b.color,
            borderRadius: b.round ? '50%' : 2,
          }}
        />
      ))}
    </div>
  );
});
