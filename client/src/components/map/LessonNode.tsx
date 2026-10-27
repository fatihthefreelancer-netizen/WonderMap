import { memo, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LessonDTO, NodeState } from '@wondermap/shared';
import type { NodeInfo } from '../../lib/nodeState';
import { rng, blob } from '../../lib/shapes';
import { hashSeed } from '../../lib/shapes';
import { NodeArt } from './NodeArt';
import { useTc } from '../../i18n/useTc';

interface Props {
  lesson: LessonDTO;
  /** Where the stop sits on the painted trail. */
  x: number;
  y: number;
  info: NodeInfo;
  isCurrent: boolean;
  /** which world this stop belongs to, for the chapter's own artwork */
  worldOrder?: number;
  onClick: (lesson: LessonDTO) => void;
}

/** Ring colour by state — read at a glance, but kept inside the illustration. */
const RIM: Record<NodeState, [string, string]> = {
  locked: ['#d3d8ec', '#9aa3c6'],
  unlocked: ['#9fe3ff', '#3aa9e8'],
  completed: ['#bdec85', '#5fae3e'],
  perfect: ['#ffe08a', '#f5b716'],
};

/** Medallion diameters in the painting's own pixels. */
const SIZE: Record<string, number> = {
  lesson: 118,
  review: 114,
  challenge: 122,
  treasure: 126,
  boss: 148,
};

export const LessonNode = memo(function LessonNode({ lesson, x, y, info, isCurrent, worldOrder, onClick }: Props) {
  const { tc } = useTc();
  const [hovered, setHovered] = useState(false);
  const size = SIZE[lesson.type] ?? 86;
  const locked = info.state === 'locked';
  const title = tc(lesson.title);
  const [rimA, rimB] = RIM[info.state];

  /** A grassy knoll so the stop is planted in the land, not pasted onto it. */
  const mound = useMemo(() => {
    const r = rng(hashSeed(lesson.id + 'mound'));
    const w = size * 0.86;
    return {
      w,
      base: blob({ cx: 0, cy: 0, rx: w, ry: w * 0.3, lobes: 11, jitter: 0.16, rand: r }),
      top: blob({ cx: -w * 0.06, cy: -w * 0.05, rx: w * 0.82, ry: w * 0.22, lobes: 10, jitter: 0.18, rand: r }),
      tufts: Array.from({ length: 7 }, (_, i) => ({
        x: -w * 0.86 + (i / 6) * w * 1.72 + (r() - 0.5) * 12,
        y: (r() - 0.5) * 10,
        s: 6 + r() * 6,
      })),
    };
  }, [lesson.id, size]);

  return (
    <div
      className="absolute"
      style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
    >
      {/* ---------------------------- grassy knoll --------------------------- */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2"
        style={{ top: size * 0.44 }}
      >
        <svg
          width={mound.w * 2.4}
          height={mound.w * 1.1}
          viewBox={`${-mound.w * 1.2} ${-mound.w * 0.55} ${mound.w * 2.4} ${mound.w * 1.1}`}
          aria-hidden
        >
          <path d={mound.base} fill="#2f6b32" opacity="0.2" />
          <path d={mound.base} transform="translate(0 -6)" fill="#7ac64c" opacity="0.5" />
          <path d={mound.top} fill="#a2dc6a" opacity="0.55" />
          {mound.tufts.map((t, i) => (
            <path
              key={i}
              d={`M ${t.x - t.s * 0.5} ${t.y} q ${t.s * 0.3} ${-t.s} ${t.s * 0.6} ${-t.s * 0.2} q ${t.s * 0.3} ${-t.s * 0.8} ${t.s * 0.7} ${t.s * 0.2}`}
              stroke={i % 2 ? '#5fae3e' : '#bde77f'}
              strokeWidth="2.4"
              fill="none"
              strokeLinecap="round"
              opacity="0.65"
            />
          ))}
        </svg>
      </div>

      {/* --------------------------- title on hover -------------------------- */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 26 }}
            className="pointer-events-none absolute left-1/2 z-40 w-max max-w-[220px] -translate-x-1/2"
            style={{ bottom: size + 30 }}
          >
            <div className="relative rounded-2xl bg-white px-3.5 py-2 text-center shadow-pop">
              <span className="font-display text-sm font-extrabold text-[#1f3a5f]">
                {locked ? '🔒 ' : ''}
                {title}
              </span>
              <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-sm bg-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* halo — brighter on the stop you are standing at */}
      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 rounded-full ${isCurrent && !locked ? 'wm-glow' : ''}`}
        style={{
          width: size + 120,
          height: size + 120,
          transform: 'translate(-50%,-50%)',
          background:
            'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.5) 38%, rgba(255,255,255,0.18) 58%, rgba(255,255,255,0) 74%)',
        }}
      />

      {isCurrent && !locked && (
        <div
          className="animate-ripple absolute left-1/2 top-1/2 rounded-full bg-white/60"
          style={{ width: size + 34, height: size + 34 }}
        />
      )}

      <motion.button
        onClick={() => !locked && onClick(lesson)}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        aria-label={`${title} — ${info.state}`}
        aria-disabled={locked}
        whileHover={{ scale: locked ? 1.03 : 1.09, y: locked ? 0 : -5 }}
        whileTap={locked ? undefined : { scale: 0.95 }}
        className={`relative grid place-items-center rounded-full ${isCurrent && !locked ? 'animate-bob' : ''}`}
        style={{ width: size, height: size }}
      >
        {/* outer ring: white porcelain with a bevel and a cast shadow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(170deg, #ffffff 0%, #ffffff 58%, #e4ecf3 100%)',
            boxShadow:
              '0 10px 18px -8px rgba(26,60,36,0.65), 0 2px 0 0 rgba(255,255,255,0.9) inset, 0 -3px 6px -2px rgba(70,90,110,0.25) inset',
          }}
        />
        {/* tinted rim */}
        <div
          className="absolute inset-[6px] rounded-full"
          style={{ background: `linear-gradient(180deg, ${rimA}, ${rimB})` }}
        />
        <div
          className="absolute inset-[6px] rounded-full"
          style={{ boxShadow: 'inset 0 2px 5px rgba(255,255,255,0.75), inset 0 -4px 8px rgba(0,0,0,0.18)' }}
        />
        {/* the place itself */}
        <div className="absolute inset-[10px] overflow-hidden rounded-full">
          <NodeArt
            type={lesson.type}
            order={lesson.order}
            size={size - 20}
            muted={locked}
            worldOrder={worldOrder}
          />
          {locked && <div className="absolute inset-0 rounded-full bg-[#7b85b8]/20" />}
          {/* glass highlight across the top of the lens */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                'linear-gradient(155deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 34%, rgba(255,255,255,0) 52%)',
            }}
          />
        </div>
      </motion.button>

      {/* numbered plaque straddling the top of the ring */}
      <div
        className={`pointer-events-none absolute left-1/2 z-20 grid -translate-x-1/2 place-items-center rounded-full border-[3px] border-white font-display text-sm font-extrabold ${
          isCurrent && !locked
            ? 'bg-gradient-to-b from-[#ff9a6b] to-[#ef5a44] text-white'
            : locked
              ? 'bg-gradient-to-b from-[#b9c0dc] to-[#98a0c4] text-white'
              : 'bg-gradient-to-b from-white to-[#eef4fa] text-[#1f3a5f]'
        }`}
        style={{ top: -16, height: 36, width: 36, fontSize: 17, boxShadow: '0 4px 9px -3px rgba(26,60,36,0.7)' }}
      >
        {lesson.order + 1}
      </div>

      {/* stars once the stop is reachable, padlock while it is not */}
      {locked ? (
        <div
          className="pointer-events-none absolute left-1/2 z-20 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full border-[3px] border-white bg-gradient-to-b from-[#aab2d4] to-[#848db4]"
          style={{ bottom: -16, boxShadow: '0 4px 9px -3px rgba(26,60,36,0.7)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
            <path d="M7 10V8a5 5 0 0 1 10 0v2" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" />
            <rect x="5" y="10" width="14" height="10" rx="3" fill="#ffffff" />
            <circle cx="12" cy="15" r="1.7" fill="#848db4" />
          </svg>
        </div>
      ) : (
        <div
          className="pointer-events-none absolute left-1/2 z-20 flex -translate-x-1/2 items-center gap-[1px] rounded-full bg-white px-1.5 py-[3px]"
          style={{ bottom: -15, boxShadow: '0 4px 9px -4px rgba(26,60,36,0.75)' }}
        >
          {[0, 1, 2].map((s) => (
            <Star key={s} filled={s < info.stars} />
          ))}
        </div>
      )}

      {lesson.type === 'boss' && !locked && (
        <div
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-b from-[#ff9a6b] to-[#ef5a44] px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide text-white shadow"
          style={{ top: size + 12 }}
        >
          BOSS
        </div>
      )}
    </div>
  );
});

function Star({ filled }: { filled: boolean }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 2.6l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.6 6.1 20.8l1.3-6.6L2.5 9.6l6.6-.8z"
        fill={filled ? '#ffc233' : '#dde3ec'}
        stroke={filled ? '#e59a00' : '#c6cedb'}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
