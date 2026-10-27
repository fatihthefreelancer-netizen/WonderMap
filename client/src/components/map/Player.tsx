import { memo } from 'react';
import { motion } from 'framer-motion';
import { Avatar } from '../ui/Avatar';

interface Props {
  x: number;
  y: number;
  avatar?: string;
}

/**
 * The player marker springs (walks) to the current node — a one-shot transition
 * on position — while the idle bob/shadow use compositor-driven CSS so no
 * perpetual JS animation frame is required once it arrives. It stands just
 * beside the stop rather than on it, so the node's own artwork stays visible.
 */
export const Player = memo(function Player({ x, y, avatar = 'fox' }: Props) {
  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0 z-20"
      initial={false}
      animate={{ x: x - 72, y: y - 6 }}
      transition={{ type: 'spring', stiffness: 120, damping: 16, mass: 0.8 }}
      style={{ translateX: '-50%' }}
    >
      <div
        className="animate-shadowpulse absolute left-1/2 h-3.5 w-11 rounded-full bg-[#28502f]/30 blur-[2px]"
        style={{ top: 58 }}
      />
      {/* soft halo, matching the lesson stops */}
      <div
        className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 58%, rgba(255,255,255,0) 72%)',
        }}
      />
      <div className="animate-walk relative grid h-16 w-16 place-items-center rounded-full bg-white shadow-[0_8px_16px_-6px_rgba(26,60,36,0.6)]">
        <div className="absolute inset-[4px] rounded-full bg-gradient-to-b from-[#8fdcff] to-[#4bb8f0]" />
        <div className="absolute inset-[7px] grid place-items-center overflow-hidden rounded-full bg-gradient-to-b from-white to-[#e9f7ff]">
          <Avatar avatar={avatar} size={50} />
        </div>
        {/* little gold star pin, as on the reference marker */}
        <svg
          className="absolute -bottom-1 -left-1"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            d="M12 2.6l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.6 6.1 20.8l1.3-6.6L2.5 9.6l6.6-.8z"
            fill="#ffc233"
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </motion.div>
  );
});
