import { motion } from 'framer-motion';

export function LoadingSplash() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-sky-soft to-sky-bright">
      <motion.div
        initial={{ scale: 0.6, rotate: -8 }}
        animate={{ scale: [0.9, 1.05, 0.9], rotate: [-4, 4, -4] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="text-7xl drop-shadow-lg"
      >
        🗺️
      </motion.div>
      <motion.p
        className="mt-6 font-display text-2xl font-extrabold text-white text-outline"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        WonderMap
      </motion.p>
      <div className="mt-4 h-2 w-40 overflow-hidden rounded-full bg-white/40">
        <motion.div
          className="h-full w-1/2 rounded-full bg-white"
          animate={{ x: ['-100%', '220%'] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}
