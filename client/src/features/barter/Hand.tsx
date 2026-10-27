import { motion } from 'framer-motion';

/**
 * The hand that shows a child what to do.
 *
 * Demos that animate the *thing* alone are ambiguous — a loaf drifting across
 * the market could be a decoration, a reward, or something happening on its
 * own. A hand is unmistakably an instruction: it is the child's hand, and the
 * gesture it makes is the gesture they are being asked to copy.
 *
 * Two gestures, because the chapter asks for two: a `drag` hand closes around
 * what it is carrying, a `tap` hand points with one finger and sends out a
 * ripple when it lands.
 */
export function Hand({ size = 64, gesture = 'drag' }: { size?: number; gesture?: 'drag' | 'tap' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.45))' }}
    >
      {gesture === 'tap' ? (
        <>
          {/* pointing finger */}
          <path
            d="M25 10c0-2.8 2.2-5 5-5s5 2.2 5 5v18l4-2.5c2.6-1.6 6-0.8 7.6 1.8 0.6 1 0.8 2.2 0.6 3.3l-2.6 14c-1 5.5-5.8 9.4-11.4 9.4h-6.4c-3.4 0-6.6-1.6-8.6-4.3l-8-10.7c-1.7-2.2-1.2-5.4 1-7 2-1.5 4.8-1.3 6.6 0.5l6.6 6.6V10z"
            fill="#ffffff"
            stroke="#1f3a5f"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M30 14v16" stroke="#9fc4e0" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* closed, carrying hand */}
          <path
            d="M22 16c0-2.8 2.2-5 5-5s5 2.2 5 5v10h2V13c0-2.8 2.2-5 5-5s5 2.2 5 5v15h2v-8c0-2.8 2.2-5 5-5s5 2.2 5 5v20c0 7.7-6.3 14-14 14h-6.6c-3.6 0-7-1.7-9.2-4.6l-9.2-12.2c-1.7-2.2-1.2-5.4 1-7 2-1.5 4.8-1.3 6.6 0.5l2.4 2.4V16z"
            fill="#ffffff"
            stroke="#1f3a5f"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M34 30v8M42 32v6" stroke="#9fc4e0" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

/** The ring that spreads out from a tap, so the gesture reads as a press. */
export function TapRipple({ size = 64 }: { size?: number }) {
  return (
    <motion.span
      className="pointer-events-none absolute rounded-full border-[3px] border-white"
      style={{ width: size, height: size, left: -size / 2, top: -size / 2 }}
      animate={{ scale: [0.4, 1.4], opacity: [0.9, 0] }}
      transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 0.9, ease: 'easeOut' }}
    />
  );
}
