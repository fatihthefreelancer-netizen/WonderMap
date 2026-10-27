import { motion, AnimatePresence } from 'framer-motion';
import type { ComboEvent } from './useCustomerRush';
import { useTc } from '../../i18n/useTc';

export function ComboBurst({ combo }: { combo: ComboEvent | null }) {
  const { tc } = useTc();
  return (
    <AnimatePresence>
      {combo && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.4, rotate: -12, y: 30 }}
            animate={{ scale: [0.4, 1.15, 1], rotate: 0, y: 0 }}
            exit={{ scale: 0.6, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 14 }}
            className="rounded-3xl bg-gradient-to-b from-[#ffe08a] to-coin px-8 py-5 text-center shadow-pop"
          >
            <p className="font-display text-3xl font-extrabold text-[#7a5a10]">{tc(combo.title)}</p>
            <p className="font-display text-lg font-extrabold text-[#8a6a10]">{tc(combo.label)}</p>
            <p className="mt-1 font-display text-xl font-extrabold text-[#b5820f]">+{combo.bonusCoins} 🪙</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
