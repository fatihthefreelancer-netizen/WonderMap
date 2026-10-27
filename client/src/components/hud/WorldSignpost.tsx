import { motion } from 'framer-motion';

interface Props {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  prevLabel: string;
  nextLabel: string;
}

/**
 * The carved signpost planted at the edge of the world: an arm pointing on to
 * the next world and, when there is one, an arm pointing back the way you came.
 */
export function WorldSignpost({ onPrev, onNext, canPrev, canNext, prevLabel, nextLabel }: Props) {
  if (!canPrev && !canNext) return null;

  return (
    <div className="pointer-events-none flex flex-col items-end gap-1.5">
      {canPrev && <Arm dir="left" label={prevLabel} onClick={onPrev} />}
      {canNext && <Arm dir="right" label={nextLabel} onClick={onNext} />}
      {/* the post the arms are nailed to */}
      <div className="mr-[46px] h-9 w-4 rounded-b-sm bg-gradient-to-r from-[#a9744f] via-[#c08f5f] to-[#8f5f36] shadow-[0_6px_10px_-6px_rgba(26,60,36,0.8)]" />
    </div>
  );
}

function Arm({
  dir,
  label,
  onClick,
}: {
  dir: 'left' | 'right';
  label: string;
  onClick: () => void;
}) {
  const point =
    dir === 'right'
      ? 'polygon(0 0, calc(100% - 15px) 0, 100% 50%, calc(100% - 15px) 100%, 0 100%)'
      : 'polygon(15px 0, 100% 0, 100% 100%, 15px 100%, 0 50%)';

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04, rotate: dir === 'right' ? -1.5 : 1.5 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
      className="pointer-events-auto relative select-none drop-shadow-[0_8px_10px_rgba(26,60,36,0.35)]"
    >
      <div
        className="bg-gradient-to-b from-[#d99a63] to-[#b97c45] px-5 py-2.5 pr-8"
        style={{ clipPath: point, paddingLeft: dir === 'left' ? 32 : 20 }}
      >
        <span className="flex items-center gap-1.5 font-display text-sm font-extrabold text-[#5a3c16]">
          {dir === 'left' && <span aria-hidden>←</span>}
          {label}
          {dir === 'right' && <span aria-hidden>→</span>}
        </span>
      </div>
      {/* wood grain */}
      <span className="pointer-events-none absolute left-4 right-6 top-1/2 h-px -translate-y-[6px] bg-[#9a6734]/25" />
      <span className="pointer-events-none absolute left-5 right-7 top-1/2 h-px translate-y-[6px] bg-[#9a6734]/25" />
    </motion.button>
  );
}
