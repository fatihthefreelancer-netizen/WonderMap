import { motion } from 'framer-motion';
import { character } from '../../content/characters';

/** An expressive character avatar that pops and gently bobs while speaking. */
export function CharacterPortrait({ id, size = 76 }: { id: string; size?: number }) {
  const c = character(id);
  return (
    <motion.div
      initial={{ scale: 0.6, y: 10, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      className="relative grid shrink-0 place-items-center rounded-full ring-4 ring-white"
      style={{ width: size, height: size, background: `${c.color}22` }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: `0 8px 0 -2px ${c.color}55` }}
      />
      <span className="animate-bob" style={{ fontSize: size * 0.5 }}>
        {c.emoji}
      </span>
    </motion.div>
  );
}
