import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * A burst of coins that flies from the stage toward the coin counter (top area)
 * whenever a reward is granted. Keyed by `flyKey` so each award re-fires.
 */
export const CoinFly = memo(function CoinFly({ flyKey }: { flyKey: number }) {
  const coins = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        id: `${flyKey}-${i}`,
        dx: (Math.random() - 0.5) * 120,
        delay: i * 0.04,
      })),
    [flyKey],
  );

  if (flyKey === 0) return null;

  return (
    <div key={flyKey} className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      {coins.map((c) => (
        <motion.div
          key={c.id}
          className="absolute left-1/2 top-1/2 text-2xl"
          initial={{ x: c.dx, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: 0, y: '-42vh', opacity: [1, 1, 0], scale: 0.6 }}
          transition={{ duration: 0.9, delay: c.delay, ease: 'easeIn' }}
        >
          🪙
        </motion.div>
      ))}
    </div>
  );
});
