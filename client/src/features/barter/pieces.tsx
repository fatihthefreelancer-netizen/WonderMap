import { memo, useMemo, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type GoodKey, type Look } from './content';
import { CHAPTER_COPY, type Copy } from './i18n';
import { useLocaleStore } from '../../store/localeStore';

/**
 * The chapter's building blocks, drawn from the illustrated set in
 * `public/chapter`: the villagers themselves, the goods they carry, the thought
 * bubble over each head and the elder's dialogue panel.
 */

const art = (file: string) => `/chapter/${file}.webp`;

/** The chapter's words in the language the app is currently set to. */
export function useCopy(): Copy {
  const locale = useLocaleStore((s) => s.locale);
  return CHAPTER_COPY[locale] ?? CHAPTER_COPY.en;
}
/** Painted backdrops ship as webp — they are photographs of a painting, not sprites. */
const scene = (file: string) => `/chapter/${file}.webp`;

/**
 * Render a copy string that mixes **bold** with `{slot}` placeholders, filling
 * each slot with a node (usually a pictured good). Keeping the slots in the
 * sentence rather than concatenating fragments is what lets French and Arabic
 * put the picture where their own grammar wants it.
 */
export function fillNodes(template: string, parts: Record<string, ReactNode>): ReactNode[] {
  return template.split(/(\{\w+\})/).map((chunk, i) => {
    const slot = /^\{(\w+)\}$/.exec(chunk);
    if (slot) return <span key={i}>{parts[slot[1]] ?? ''}</span>;
    return <span key={i}>{rich(chunk)}</span>;
  });
}

/** **bold** → <strong>, the one bit of markup the chapter copy uses. */
export function rich(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-extrabold text-[#1f3a5f]">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

/* -------------------------------------------------------------------------- */

export const Good = memo(function Good({
  good,
  size = 46,
  fluid,
}: {
  good: GoodKey;
  size?: number;
  /** fill the parent instead of using a pixel size (for cqw-scaled layouts) */
  fluid?: boolean;
}) {
  const copy = useCopy();
  return (
    <img
      src={art(`good-${good}`)}
      alt={copy.goods[good].name}
      draggable={false}
      className="block select-none object-contain"
      style={fluid ? { width: '100%', height: '100%' } : { width: size, height: size }}
    />
  );
});

/** A good named inline inside a sentence, with its picture. */
export const GoodInline = memo(function GoodInline({ good }: { good: GoodKey }) {
  const copy = useCopy();
  return (
    <span className="mx-0.5 inline-flex items-baseline gap-1 align-baseline">
      <img
        src={art(`good-${good}`)}
        alt=""
        width={22}
        height={22}
        draggable={false}
        className="inline-block -mb-1 select-none object-contain"
      />
      <strong className="font-extrabold text-[#1f3a5f]">{copy.goods[good].name}</strong>
    </span>
  );
});

export const Portrait = memo(function Portrait({
  look,
  size = 56,
  cheer,
  fillHeight,
}: {
  look: Look;
  size?: number;
  cheer?: boolean;
  /** stand the figure at full height of its box, centred (board layout) */
  fillHeight?: boolean;
}) {
  const src = art(cheer ? `who-${look}-cheer` : `who-${look}`);
  if (fillHeight) {
    return (
      <img
        src={src}
        alt=""
        draggable={false}
        className="mx-auto block h-full w-auto max-w-none select-none object-contain"
      />
    );
  }
  return (
    <img
      src={src}
      alt=""
      draggable={false}
      className="block select-none object-contain object-top"
      style={{ width: size, height: size, objectPosition: 'top center' }}
    />
  );
});

/* -------------------------------------------------------------------------- */

export type SpeechTone = 'plain' | 'yes' | 'no' | 'think';

const TONE: Record<SpeechTone, string> = {
  plain: 'bg-white text-[#2b4a66]',
  yes: 'bg-[#eafbe4] text-[#2d6a31]',
  no: 'bg-[#ffecec] text-[#a33a3a]',
  think: 'bg-[#fff6e0] text-[#8a5f1a]',
};

/** A line of dialogue popping above a villager's head. */
export const Speech = memo(function Speech({
  children,
  tone = 'plain',
  /** nudge sideways (fraction of the bubble's width) to stay on the stage */
  shiftX = 0,
  /** extra height, in villager-widths, so neighbours' bubbles clear each other */
  lift = 0,
}: {
  children: ReactNode;
  tone?: SpeechTone;
  shiftX?: number;
  lift?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.86 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      className="pointer-events-none absolute bottom-full left-1/2 z-30 w-max"
      style={{
        // width tracks the villager, so a bubble can never sprawl across the
        // neighbour standing next to them
        maxWidth: 'min(230px, 215cqw)',
        marginBottom: `calc(0.25rem + ${lift}cqw)`,
        transform: `translateX(calc(-50% + ${shiftX * 100}%))`,
      }}
    >
      <div className={`relative rounded-2xl px-3 py-2 text-center text-[13px] font-bold leading-snug shadow-hud ${TONE[tone]}`}>
        {children}
        <span
          className={`absolute -bottom-1.5 h-3 w-3 rotate-45 rounded-sm ${TONE[tone].split(' ')[0]}`}
          style={{ left: `calc(50% - ${shiftX * 100}%)`, marginLeft: '-0.375rem' }}
        />
      </div>
    </motion.div>
  );
});

/** The cloud above a villager showing what they are hoping for. */
export const WantBubble = memo(function WantBubble({ good, happy }: { good: GoodKey; happy: boolean }) {
  return (
    <div className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2">
      <div
        className={`relative grid h-[52px] w-[52px] place-items-center rounded-full border-[3px] shadow-hud transition-colors ${
          happy ? 'border-[#8ad15c] bg-[#f1fbe8]' : 'border-white bg-white/95'
        }`}
      >
        <Good good={good} size={32} />
        {happy && (
          <img src={art('ui-check')} alt="" width={20} height={20} className="absolute -bottom-1.5 -right-1.5" />
        )}
      </div>
      <span className="absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-white/95" />
      <span className="absolute -bottom-3 left-1/2 h-1.5 w-1.5 -translate-x-[2px] rounded-full bg-white/95" />
    </div>
  );
});

/* -------------------------------------------------------------------------- */

export type EliasPose = 'neutral' | 'speaking' | 'pointing' | 'thinking' | 'pleased';

/* -------------------------------------------------------------------------- */

/** The purse. Coins arrive while you play, so this is where they add up. */
export const Purse = memo(function Purse({ coins, flyKey }: { coins: number; flyKey: number }) {
  return (
    <motion.div
      key={flyKey}
      animate={flyKey ? { scale: [1, 1.18, 1] } : undefined}
      transition={{ duration: 0.34 }}
      className="flex items-center gap-1.5 rounded-full bg-white/95 py-1.5 pl-1.5 pr-3 shadow-hud backdrop-blur-sm"
    >
      <img src={art('ui-coin')} alt="" width={24} height={24} />
      <span className="font-display text-sm font-extrabold tabular-nums text-[#2b4a66]">{coins}</span>
    </motion.div>
  );
});

/** One star per puzzle, filled as each is solved in the fewest trades. */
export const StarRow = memo(function StarRow({ earned, total }: { earned: number; total: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <motion.img
          key={i}
          src={art('ui-star')}
          alt=""
          width={18}
          height={18}
          animate={i < earned ? { scale: [0.6, 1.25, 1], rotate: [0, -12, 0] } : { scale: 1 }}
          transition={{ duration: 0.45 }}
          className={i < earned ? '' : 'opacity-25 grayscale'}
        />
      ))}
    </div>
  );
});

/** Coins arcing up to the purse. Re-fires on every change of `flyKey`. */
export const CoinBurst = memo(function CoinBurst({ flyKey, n = 7 }: { flyKey: number; n?: number }) {
  const bits = useMemo(
    () =>
      Array.from({ length: n }, (_, i) => ({
        dx: (i / Math.max(1, n - 1) - 0.5) * 180,
        delay: i * 0.035,
      })),
    [flyKey, n],
  );
  if (!flyKey) return null;
  return (
    <div key={flyKey} className="pointer-events-none absolute inset-0 z-[55] overflow-hidden">
      {bits.map((b, i) => (
        <motion.img
          key={i}
          src={art('ui-coin')}
          alt=""
          width={26}
          height={26}
          className="absolute left-1/2 top-1/2"
          initial={{ x: b.dx, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: '34vw', y: '-44vh', opacity: [1, 1, 0], scale: 0.5 }}
          transition={{ duration: 0.85, delay: b.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
});

/**
 * A deterministic shuffle: same seed, same order. Quiz options are shuffled
 * per run so a child who replays cannot answer from memory of where the green
 * button was, but they stay put while that question is on screen.
 */
export function shuffled<T>(items: T[], seed: number): T[] {
  const out = items.slice();
  let r = seed || 1;
  for (let i = out.length - 1; i > 0; i--) {
    r = (r * 1103515245 + 12345) & 0x7fffffff;
    const j = r % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** A soft burst of stars for a solved village. */
export function Confetti({ n = 26 }: { n?: number }) {
  const bits = useRef(
    Array.from({ length: n }, (_, i) => ({
      x: (i / n) * 100,
      delay: (i % 7) * 0.09,
      dur: 1.6 + ((i * 7) % 10) / 10,
      size: 16 + ((i * 13) % 18),
      icon: i % 3 === 0 ? 'fx-star' : i % 3 === 1 ? 'fx-glow' : 'fx-sparkle',
    })),
  ).current;

  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {bits.map((b, i) => (
        <motion.img
          key={i}
          src={art(b.icon)}
          alt=""
          width={b.size}
          height={b.size}
          initial={{ y: '110%', opacity: 0, rotate: 0 }}
          animate={{ y: '-20%', opacity: [0, 1, 1, 0], rotate: 220 }}
          transition={{ duration: b.dur, delay: b.delay, ease: 'easeOut' }}
          className="absolute"
          style={{ left: `${b.x}%` }}
        />
      ))}
    </div>
  );
}

export { art, scene };
export { AnimatePresence };
