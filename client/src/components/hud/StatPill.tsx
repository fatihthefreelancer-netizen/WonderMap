import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  icon: ReactNode;
  value: number | string;
  color?: string;
  spin?: boolean;
  pulse?: boolean;
  label?: string;
}

/** A single white HUD capsule: round icon chip + bold value. */
export function StatPill({ icon, value, color = '#2b4a66', spin, pulse, label }: Props) {
  return (
    <motion.div
      className="flex items-center gap-1.5 rounded-full bg-white/95 py-1.5 pl-1.5 pr-3.5 shadow-hud backdrop-blur-sm"
      whileHover={{ scale: 1.05 }}
      aria-label={label}
    >
      <span
        className={`grid h-7 w-7 place-items-center rounded-full bg-[#f3f7fc] ${
          spin ? 'animate-spin-coin' : ''
        } ${pulse ? 'animate-beat' : ''}`}
      >
        {icon}
      </span>
      <span className="font-display text-[15px] font-extrabold leading-none tabular-nums" style={{ color }}>
        {value}
      </span>
    </motion.div>
  );
}
