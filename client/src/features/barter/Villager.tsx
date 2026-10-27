import { memo, type ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { type GoodKey, type Look } from './content';
import { Good, Portrait, Speech, useCopy, type SpeechTone } from './pieces';
import type { Spot } from './layout';

/**
 * One villager on the board, built the way the arc1 prototype built them: the
 * character fills the box, the good they carry is held in front of them, their
 * wish floats in a thought cloud at their shoulder, and a name plate sits at
 * their feet. Every part is sized in `cqw` — a percentage of this villager's own
 * width — so the whole figure scales with the scene and stays in proportion.
 */

export interface VillagerView {
  id: string;
  name: string;
  job: string;
  look: Look;
  /** what they started the village with — drives which pose they stand in */
  has: GoodKey;
  holds: GoodKey;
  need: GoodKey;
}

interface Props {
  v: VillagerView;
  spot: Spot;
  bodyH: number;
  state?: 'selected' | 'drop' | 'hinted' | 'buyer' | null;
  dim?: boolean;
  cheering?: boolean;
  shaking?: boolean;
  bubble?: { id: string; text: ReactNode; tone: SpeechTone } | null;
  /** how far along the row this villager stands, 0..1 — keeps bubbles on stage */
  bubbleShiftX?: number;
  /** raises this villager's bubble clear of the neighbour's */
  bubbleLift?: number;
  interactive?: boolean;
  /** the good is in flight to another villager, so fade the one in hand */
  handEmpty?: boolean;
  onPointerDown?: (e: React.PointerEvent) => void;
  onClick?: () => void;
  /**
   * Enter / Space only.
   *
   * The market is traded by dragging, deliberately — but a board you cannot
   * play without a pointer is a board some children cannot play at all, so
   * the keyboard keeps a way in that the mouse no longer has.
   */
  onKeyActivate?: () => void;
}

const RING: Record<string, string> = {
  selected: 'drop-shadow(0 0 3px #fff) drop-shadow(0 0 11px #ffc233)',
  drop: 'drop-shadow(0 0 3px #fff) drop-shadow(0 0 11px #5fc14e)',
  hinted: 'drop-shadow(0 0 3px #fff) drop-shadow(0 0 13px #ffc233)',
  buyer: 'drop-shadow(0 0 3px #fff) drop-shadow(0 0 11px #ffc233)',
};

/**
 * What each painted `-cheer` pose is actually holding.
 *
 * Nine of the eleven poses show the villager's own produce; the blacksmith
 * holds tools and the elder holds nothing, so anybody wearing those poses has
 * their goods drawn on top instead.
 */
const LOOK_HOLDS: Partial<Record<Look, GoodKey>> = {
  baker: 'bread',
  fisher: 'fish',
  farmer: 'apples',
  dairy: 'milk',
  cheese: 'cheese',
  woodman: 'wood',
  weaver: 'cloth',
  poultry: 'chicken',
  trader: 'coin',
  // smith holds a hammer and a cleaver; elder holds nothing
};

export const Villager = memo(function Villager({
  v,
  spot,
  bodyH,
  state,
  dim,
  cheering,
  shaking,
  bubble,
  bubbleShiftX = 0,
  bubbleLift = 0,
  interactive,
  handEmpty,
  onPointerDown,
  onClick,
  onKeyActivate,
}: Props) {
  const copy = useCopy();
  const job = copy.jobs[v.id] ?? v.job;
  const happy = v.holds === v.need;
  /**
   * Still carrying what they walked in with *and* painted holding it.
   *
   * The `-cheer` pose is where a villager's own produce lives, so the good is
   * normally not drawn on top of it. But the poses were painted per trade, not
   * per villager: the lantern maker shares the blacksmith's pose, which holds
   * a hammer and a cleaver and no lantern at all — so he stood in a market
   * selling something invisible. `LOOK_HOLDS` says what each pose actually
   * depicts, and anyone whose goods are not in their own hands gets them
   * drawn in.
   */
  const ownGoods = v.holds === v.has && LOOK_HOLDS[v.look] === v.has;

  return (
    <div
      data-villager={v.id}
      role="button"
      tabIndex={0}
      aria-label={`${v.name} — ${job}. ${copy.goods[v.holds].article} / ${copy.goods[v.need].article}`}
      onPointerDown={onPointerDown}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          (onKeyActivate ?? onClick)?.();
        }
      }}
      className={`absolute transition-[left,top,opacity,filter] duration-500 ${
        interactive ? 'cursor-pointer' : 'cursor-default'
      } ${dim ? 'opacity-30 grayscale' : 'opacity-100'}`}
      style={{
        left: `${spot.x * 100}%`,
        top: `${spot.y * 100}%`,
        width: `${spot.w * 100}%`,
        transform: 'translate(-50%, -100%)',
        zIndex: bubble ? 60 : 10 + Math.round(spot.y * 10),
        containerType: 'inline-size',
        touchAction: 'none',
      }}
    >
      {/* what they wish for */}
      <div className="pointer-events-none absolute" style={{ left: '60%', top: '-20cqw' }}>
        <div
          className="relative grid place-items-center rounded-[50%] transition-transform"
          style={{
            width: '50cqw',
            height: '43cqw',
            background: happy ? '#eafbe4' : '#ffffff',
            border: `max(2px, 1.6cqw) solid ${happy ? '#5fc14e' : '#ffffff'}`,
            boxShadow: '0 3px 8px rgba(80,50,20,.18)',
            transform: happy ? 'scale(1.05)' : undefined,
          }}
        >
          <div style={{ width: '70%' }}>
            <Good good={v.need} fluid />
          </div>
          {happy && (
            <span
              className="absolute grid place-items-center rounded-full bg-[#5fc14e] font-display font-extrabold text-white"
              style={{ right: '-6cqw', top: '-6cqw', width: '19cqw', height: '19cqw', fontSize: '12cqw' }}
            >
              ✓
            </span>
          )}
        </div>
        <i
          className="absolute block rounded-full bg-white"
          style={{ width: '10cqw', height: '10cqw', left: '2cqw', top: '42cqw', boxShadow: '0 2px 4px rgba(80,50,20,.15)' }}
        />
        <i
          className="absolute block rounded-full bg-white"
          style={{ width: '6cqw', height: '6cqw', left: '-4cqw', top: '53cqw', boxShadow: '0 2px 4px rgba(80,50,20,.15)' }}
        />
      </div>

      <AnimatePresence>
        {bubble && (
          <Speech key={bubble.id} tone={bubble.tone} shiftX={bubbleShiftX} lift={bubbleLift}>
            {bubble.text}
          </Speech>
        )}
      </AnimatePresence>

      {/* a soft shadow on the market floor, so the figure is standing on it */}
      <div
        className="pointer-events-none absolute rounded-[50%] transition-opacity"
        style={{
          left: '50%',
          top: '100%',
          width: '74cqw',
          height: '13cqw',
          transform: 'translate(-50%, -62%)',
          background: 'radial-gradient(50% 50% at 50% 50%, rgba(62,42,20,0.34), rgba(62,42,20,0))',
          opacity: dim ? 0.2 : 0.9,
        }}
      />

      {/* the character, with the good held in front */}
      <div
        className={`relative ${cheering ? 'wm-cheer' : ''} ${shaking ? 'wm-shake' : ''} ${
          state === 'hinted' ? 'wm-pulse' : ''
        }`}
        style={{
          height: `${(bodyH / spot.w) * 100}cqw`,
          filter: state
            ? RING[state]
            : 'drop-shadow(0 2px 3px rgba(32,22,10,0.30)) drop-shadow(0 0 1px rgba(255,255,255,0.65))',
          transform: state === 'selected' ? 'translateY(-4%)' : state === 'drop' ? 'scale(1.06)' : undefined,
          transition: 'transform .2s, filter .2s',
        }}
      >
        {/*
          Two poses per villager, and the `-cheer` suffix is a misnomer: that
          file is the one where they are *carrying their own produce* (the
          baker with her basket of bread), while the plain file has their hands
          free, holding only their tool.
          So: while a villager still has what they started with, draw the
          produce pose and draw no loose good on top of it — the basket is
          already in the picture. The moment they trade it away, switch to the
          free-handed pose and show whatever they received as a separate item.
        */}
        <Portrait look={v.look} cheer={ownGoods} fillHeight />
        <div
          data-held
          className="pointer-events-none absolute grid place-items-center transition-opacity duration-150"
          style={{
            left: '50%',
            top: '53%',
            width: '38cqw',
            height: '38cqw',
            transform: 'translate(-50%, -50%)',
            filter: 'drop-shadow(0 2px 2px rgba(0,0,0,.25))',
            // their own produce is already painted into the pose; only what
            // they have taken in a trade is drawn on top
            opacity: handEmpty || ownGoods ? 0 : 1,
          }}
        >
          <Good good={v.holds} fluid />
        </div>
      </div>

      {/* name plate at their feet */}
      <div
        className="pointer-events-none absolute whitespace-nowrap rounded-[10px] px-2 pb-[3px] pt-[1px] text-center"
        style={{
          top: '100%',
          left: '50%',
          transform: 'translate(-50%, 2px)',
          background: state === 'buyer' ? '#ffd34e' : 'rgba(255,250,240,.94)',
          boxShadow: '0 2px 5px rgba(80,50,20,.18)',
        }}
      >
        <b
          className="block font-display font-extrabold leading-tight text-[#3a2a16]"
          style={{ fontSize: 'max(12px, 11cqw)' }}
        >
          {v.name}
        </b>
        <small
          className="block font-body font-bold leading-tight text-[#8a6a44]"
          style={{ fontSize: 'max(10px, 8cqw)' }}
        >
          {job}
        </small>
      </div>
    </div>
  );
});

/** Lays the market floor out at the exact size the villager grid asked for. */
export function SceneBox({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      {/*
        The stage is measured, not stretched: `layout()` has already worked out
        how large a villager can be in the room this board was given, so the
        floor is simply drawn at that size and centred. Asking CSS to fit it
        with `aspect-ratio` plus a max- constraint does not work — once one
        axis is definite the other is no longer recomputed, and the whole grid
        skews the moment the window is the wrong shape.
      */}
      <div
        className="relative select-none"
        style={{ width, height }}
      >
        {/*
          The cast used to stand inside a frosted rectangle: readable, but it
          put a pane of glass between them and the painted market. The same
          separation now comes from depth instead — a soft vignette that has no
          edge of its own, so the villagers read as standing *in* the souk.
          `SceneBox` also drops a contact shadow under each villager.
        */}
        {/*
          Depth of field, not a panel.

          The painted souk is busy, and the cast has to read at a glance. A
          frosted rectangle did that but put the villagers behind glass. This
          blurs only what is *behind* them, through a radial mask that fades to
          nothing well before any edge — so the market softens where the cast
          stands and stays sharp everywhere else, with no box to notice.
        */}
        <div
          className="pointer-events-none absolute -inset-[18%]"
          style={{
            backdropFilter: 'blur(5px) saturate(0.92)',
            WebkitBackdropFilter: 'blur(5px) saturate(0.92)',
            maskImage:
              'radial-gradient(54% 50% at 50% 56%, #000 0%, #000 42%, rgba(0,0,0,0.55) 64%, transparent 84%)',
            WebkitMaskImage:
              'radial-gradient(54% 50% at 50% 56%, #000 0%, #000 42%, rgba(0,0,0,0.55) 64%, transparent 84%)',
          }}
        />
        <div
          className="pointer-events-none absolute -inset-[18%]"
          style={{
            background:
              'radial-gradient(52% 48% at 50% 56%, rgba(255,252,245,0.34) 0%, rgba(255,250,240,0.18) 50%, rgba(255,250,240,0) 82%)',
          }}
        />
        {children}
      </div>
    </div>
  );
}
