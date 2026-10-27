import { motion } from 'framer-motion';
import { BulbIcon } from './icons';

interface Props {
  emoji: string;
  text: string;
  onClick: () => void;
}

/** Milo pops in at the bottom-left corner with a nudge about what to do next. */
export function HintBubble({ emoji, text, onClick }: Props) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -40, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      className="pointer-events-auto absolute bottom-4 left-3 z-40 flex items-center text-left sm:bottom-5 sm:left-5"
    >
      <span className="animate-bob z-10 -mr-5 grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white shadow-hud">
        <span className="text-3xl">{emoji}</span>
      </span>
      <span className="relative max-w-[200px] rounded-[20px] rounded-bl-md bg-white/95 py-2 pl-8 pr-4 shadow-hud backdrop-blur-sm">
        <span className="flex items-center gap-1.5 font-display text-[13px] font-extrabold leading-snug text-[#2b4a66]">
          <BulbIcon />
          {text}
        </span>
      </span>
    </motion.button>
  );
}
