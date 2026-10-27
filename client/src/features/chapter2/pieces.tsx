import { memo, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { CH2_COPY, type Ch2Copy } from './copy';
import { useLocaleStore } from '../../store/localeStore';

/**
 * Chapter 2's building blocks. The illustrated set lives in `public/chapter2`;
 * the villagers and painted backdrops Chapter 1 already owns are reused from
 * `public/chapter`, so the two chapters feel like one village.
 */

export const art = (file: string) => `/chapter2/${file}.webp`;
export const art1 = (file: string) => `/chapter/${file}.webp`;
export const scene = (file: string) => `/chapter/${file}.webp`;
/** Chapter 2's own painted places. */
export const scene2 = (file: string) => `/chapter2/${file}.webp`;

/** Cast drawn for this chapter; anyone else comes from Chapter 1's villagers. */
const CH2_CAST = new Set(['adam', 'maya', 'rayan', 'zaid', 'ines', 'hassan', 'drip', 'puff', 'yara']);

/** Where a given face lives, and what its happy pose is called there. */
export function faceSrc(look: string, happy = false) {
  if (CH2_CAST.has(look)) return art(happy ? `who-${look}-happy` : `who-${look}`);
  return art1(happy ? `who-${look}-cheer` : `who-${look}`);
}

export function useCh2Copy(): Ch2Copy {
  const locale = useLocaleStore((s) => s.locale);
  return CH2_COPY[locale] ?? CH2_COPY.en;
}

/** `{slot}` → value, the only interpolation the copy uses. */
export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}

/** **bold** → <strong>. */
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

/** One of the painted things, sized to fill whatever box it is given. */
export const Item = memo(function Item({
  item,
  size,
  className = '',
}: {
  item: string;
  size?: number;
  className?: string;
}) {
  // a few of the things were drawn in the UI row of the sheet (the swimming
  // drops, the clock), so a name may already carry its own prefix
  const src = item.startsWith('ui-') ? art(item) : art(`item-${item}`);
  return (
    <img
      src={src}
      alt=""
      draggable={false}
      className={`block select-none object-contain ${className}`}
      style={size ? { width: size, height: size } : { width: '100%', height: '100%' }}
    />
  );
});

/** A villager standing at the height of their box. */
export const Face = memo(function Face({
  look,
  happy,
  size,
  className = '',
}: {
  look: string;
  happy?: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={faceSrc(look, happy)}
      alt=""
      draggable={false}
      className={`block select-none object-contain ${className}`}
      style={size ? { height: size, width: 'auto', maxWidth: 'none' } : undefined}
    />
  );
});

export type Tone = 'plain' | 'yes' | 'no' | 'think';

const TONE: Record<Tone, string> = {
  plain: 'bg-white text-[#2b4a66]',
  yes: 'bg-[#eafbe4] text-[#2d6a31]',
  no: 'bg-[#ffecec] text-[#a33a3a]',
  think: 'bg-[#fff6e0] text-[#8a5f1a]',
};

/**
 * A line of speech. `anchor` places the tail: 'bottom' hangs the bubble above
 * the speaker's head, 'side' puts it beside them (used where a head sits near
 * the top of the stage and a bubble above it would be clipped).
 */
export const Bubble = memo(function Bubble({
  children,
  tone = 'plain',
  anchor = 'bottom',
  className = '',
}: {
  children: ReactNode;
  tone?: Tone;
  anchor?: 'bottom' | 'side';
  className?: string;
}) {
  const bg = TONE[tone].split(' ')[0];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.88 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      className={`relative max-w-[16rem] rounded-2xl px-3.5 py-2.5 text-center font-display text-[13px] font-extrabold leading-snug shadow-hud sm:text-sm ${TONE[tone]} ${className}`}
    >
      {children}
      {anchor === 'bottom' ? (
        <span className={`absolute -bottom-1.5 left-1/2 -ml-1.5 h-3 w-3 rotate-45 rounded-sm ${bg}`} />
      ) : (
        <span className={`absolute -bottom-1.5 start-7 h-3 w-3 rotate-45 rounded-sm ${bg}`} />
      )}
    </motion.div>
  );
});

/** The frosted pane every activity sits on, so painted backdrops stay readable. */
export function Pane({
  children,
  className = '',
  wide,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`pointer-events-auto w-full rounded-[28px] bg-white/95 p-5 shadow-hud-lg backdrop-blur-sm sm:p-6 ${
        wide ? 'max-w-4xl' : 'max-w-2xl'
      } ${className}`}
    >
      {children}
    </div>
  );
}

/** The chapter's vocabulary cards — VALUE, SERVICE, THE BIG IDEA. */
export function ConceptCard({ title, text }: { title: string; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      className="relative mx-auto w-full max-w-md overflow-hidden rounded-[24px] bg-gradient-to-b from-[#fff6dc] to-[#ffe7ad] p-5 text-center shadow-hud-lg"
    >
      <img src={art('ui-badge')} alt="" className="absolute -right-5 -top-5 h-20 w-20 opacity-25" />
      <p className="font-display text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#b07d1a]">
        {title}
      </p>
      <p className="mt-1.5 text-pretty font-display text-lg font-extrabold leading-snug text-[#6b4a1e]">
        {rich(text)}
      </p>
    </motion.div>
  );
}

/** The wallet capsule. It pops when a coin lands in it. */
export function Wallet({ coins, bump }: { coins: number; bump?: number }) {
  return (
    <motion.div
      key={bump}
      animate={bump ? { scale: [1, 1.14, 1] } : undefined}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-2 rounded-full bg-white/95 py-1.5 pe-4 ps-1.5 shadow-hud backdrop-blur-sm"
    >
      <img src={art('ui-wallet')} alt="" width={32} height={32} className="shrink-0" />
      <span className="font-display text-lg font-extrabold leading-none text-[#2b4a66]">{coins}</span>
      <img src={art('item-coin')} alt="" width={18} height={18} />
    </motion.div>
  );
}

/** The chapter's one button shape. */
export function Big({
  children,
  onClick,
  disabled,
  tone = 'sky',
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  tone?: 'sky' | 'grass';
  className?: string;
}) {
  const skin = tone === 'grass' ? 'from-[#7ddc63] to-[#3fae38]' : 'from-[#5cc5f5] to-[#2f9ae0]';
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.04 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full bg-gradient-to-b ${skin} px-6 py-3 font-display text-sm font-extrabold text-white shadow-hud disabled:opacity-60 sm:px-7 sm:py-3.5 sm:text-base ${className}`}
    >
      {children}
    </motion.button>
  );
}

/** Stars tallied at the end of the stall round. */
export function Stars({ n }: { n: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.img
          key={i}
          src={art1('ui-star')}
          alt=""
          width={38}
          height={38}
          initial={{ scale: 0, rotate: -40 }}
          animate={{ scale: i < n ? 1 : 0.7, rotate: 0 }}
          transition={{ delay: 0.15 * i, type: 'spring', stiffness: 300, damping: 16 }}
          style={i < n ? undefined : { filter: 'grayscale(1)', opacity: 0.35 }}
        />
      ))}
    </div>
  );
}

/** A soft burst of stars, reusing Chapter 1's effect sprites. */
export function Confetti({ n = 30 }: { n?: number }) {
  const bits = Array.from({ length: n }, (_, i) => ({
    x: (i / n) * 100,
    delay: (i % 7) * 0.09,
    dur: 1.6 + ((i * 7) % 10) / 10,
    size: 16 + ((i * 13) % 18),
    icon: i % 3 === 0 ? 'fx-star' : i % 3 === 1 ? 'fx-glow' : 'fx-sparkle',
  }));
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {bits.map((b, i) => (
        <motion.img
          key={i}
          src={art1(b.icon)}
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
