import { motion, AnimatePresence } from 'framer-motion';
import type { ItemDef } from '../../content/customerRush/types';
import type { CustomerPhase } from './useCustomerRush';
import { ItemArt } from '../../content/customerRush/illustrations';

interface Props {
  phase: CustomerPhase;
  carried: ItemDef | null;
}

/**
 * Milo picks up the chosen item and walks it across to the customer.
 * He idles at his workbench (left) and slides to centre-right on 'deliver'.
 */
export function MiloActor({ phase, carried }: Props) {
  const delivering = phase === 'deliver' || phase === 'react';
  return (
    <motion.div
      className="pointer-events-none absolute bottom-2 left-6 z-10 flex flex-col items-center"
      animate={{ x: delivering ? 190 : 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
    >
      {/* carried item lifts up while walking */}
      <AnimatePresence>
        {delivering && carried && (
          <motion.div
            initial={{ y: 10, scale: 0.4, opacity: 0 }}
            animate={{ y: -6, scale: 0.7, opacity: 1 }}
            exit={{ y: -30, scale: 0.3, opacity: 0 }}
            className="mb-1 h-12 w-12"
          >
            <ItemArt art={carried.illustration} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={delivering ? { rotate: [0, -4, 4, 0] } : {}}
        transition={{ duration: 0.4, repeat: delivering ? Infinity : 0 }}
        className="grid h-16 w-16 place-items-center rounded-full bg-white shadow-[0_6px_0_rgba(0,0,0,0.15)] ring-4 ring-white"
      >
        <span className="text-4xl">🧑‍🔧</span>
      </motion.div>
      <span className="mt-1 rounded-full bg-sky-deep px-2 py-0.5 text-[10px] font-extrabold text-white">Milo</span>
    </motion.div>
  );
}
