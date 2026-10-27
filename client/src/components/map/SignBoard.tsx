import { memo } from 'react';
import { motion } from 'framer-motion';

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  rotate?: number;
}

/**
 * Lettering for the signboards that are part of the painting.
 *
 * The designer left both boards blank, so the app writes on them: the world's
 * name on the one in the meadow, and the way on to the next world on the one by
 * the water. The text sits in the board's own plane (it shares its tilt) and is
 * carved rather than printed — a dark stain with a highlight above it.
 */
export const SignBoard = memo(function SignBoard({
  rect,
  lines,
  onClick,
}: {
  rect: Rect;
  lines: string[];
  onClick?: () => void;
}) {
  // The board is painted at a fixed size, but world names differ a lot in
  // length between languages ("Value Village" vs "Le Village de la Valeur"), so
  // the lettering shrinks to stay on the wood instead of running off it.
  const longest = Math.max(...lines.map((l) => l.length));
  const base = lines.length > 1 ? 30 : 23;
  const size = Math.max(14, Math.min(base, Math.round((base * 14) / Math.max(10, longest))));
  const body = (
    <div
      className="grid h-full w-full place-items-center px-2 text-center"
      style={{ transform: `rotate(${rect.rotate ?? 0}deg)` }}
    >
      <div>
        {lines.map((line, i) => (
          <p
            key={i}
            className="font-display font-extrabold leading-tight"
            style={{
              fontSize: i === 0 && lines.length > 1 ? size : size * 1.04,
              color: '#6b3f16',
              textShadow: '0 1px 0 rgba(255,236,200,0.75), 0 -1px 0 rgba(90,50,16,0.35)',
            }}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );

  const style = {
    left: rect.x,
    top: rect.y,
    width: rect.w,
    height: rect.h,
    transform: 'translate(-50%, -50%)',
  } as const;

  if (!onClick) {
    return (
      <div className="pointer-events-none absolute select-none" style={style}>
        {body}
      </div>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      className="absolute select-none"
      style={style}
      aria-label={lines.join(' ')}
    >
      {body}
    </motion.button>
  );
});
