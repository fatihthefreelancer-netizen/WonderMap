import { useMemo } from 'react';
import { rng, blob } from '../../../lib/shapes';
import { Sprite, SpriteAnim } from './Sprite';
import { TREE_SPRITES, PINE_SPRITES, BUSH_SPRITES, CLOUD_SPRITES, type SpriteName } from './sprites';

/**
 * Painted vegetation.
 *
 * Every plant is generated from its seed: silhouettes are irregular splines,
 * foliage is built from several overlapping clumps shaded by radial gradients
 * (dark backdrop → mid body → lit crown), and each instance differs in
 * proportion, lean and clump layout. Nothing here is a circle-plus-triangle.
 *
 * All art is drawn with its ground contact at y = 0 and grows upward, which is
 * what the map's `translate(-50%, -100%)` placement expects.
 */

interface ArtProps {
  seed?: number;
  className?: string;
}

/** Soft double shadow — wide and faint, with a tighter core at the base. */
function Shadow({ rx, ry = rx * 0.3 }: { rx: number; ry?: number }) {
  return (
    <g>
      <ellipse cx="0" cy="1" rx={rx} ry={ry} fill="#2d5a2f" opacity="0.13" />
      <ellipse cx="0" cy="0" rx={rx * 0.62} ry={ry * 0.62} fill="#275227" opacity="0.16" />
    </g>
  );
}

/* ------------------------------------------------------------------------- */
/*                                 broadleaf                                  */
/* ------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                          illustrated plant sprites                          */
/* -------------------------------------------------------------------------- */

/**
 * Trees, conifers and shrubs are the designer's painted sprites. Each instance
 * picks its species from its seed, then leans and breathes very slightly so a
 * grove feels alive without any two neighbours moving in step.
 */

interface PlantOpts {
  seed: number;
  family: SpriteName[];
  /** size relative to the exported art */
  base: number;
  spread: number;
  className?: string;
  /** large plants sway, ground cover just breathes */
  motion?: 'sway' | 'breathe' | 'none';
}

function Plant({ seed, family, base, spread, className, motion = 'sway' }: PlantOpts) {
  const pick = useMemo(() => {
    const r = rng(seed * 31 + 7);
    return {
      name: family[seed % family.length],
      scale: base * (1 - spread / 2 + r() * spread),
      flip: r() > 0.5,
      lean: (r() - 0.5) * 2.2,
      delay: r() * 6,
    };
  }, [seed, family, base, spread]);

  const anim = motion === 'none' || seed % 3 === 2 ? undefined : motion === 'sway' ? 'wm-sway' : 'wm-breathe';

  return (
    <div
      className={anim}
      style={{
        transformOrigin: 'bottom center',
        animationDelay: `-${pick.delay}s`,
        transform: `rotate(${pick.lean}deg)`,
      }}
    >
      <Sprite name={pick.name} scale={pick.scale} flip={pick.flip} className={className} />
    </div>
  );
}

export function Tree({ seed = 1, className }: ArtProps) {
  return <Plant seed={seed} family={TREE_SPRITES} base={1.22} spread={0.34} className={className} />;
}

export function Pine({ seed = 2, className }: ArtProps) {
  return <Plant seed={seed} family={PINE_SPRITES} base={1.26} spread={0.3} className={className} />;
}

export function Bush({ seed = 3, className }: ArtProps) {
  return (
    <Plant
      seed={seed}
      family={BUSH_SPRITES}
      base={1.0}
      spread={0.36}
      className={className}
      motion="breathe"
    />
  );
}

/** The boulder shrub stands in for loose rock on the meadow. */
export function Rock({ seed = 4, className }: ArtProps) {
  return (
    <Plant seed={seed} family={['bush-04']} base={0.95} spread={0.3} className={className} motion="none" />
  );
}

/** Flowering shrubs — the blossom colour in the meadow. */
export function Flower({ seed = 5, className }: ArtProps) {
  return (
    <Plant
      seed={seed}
      family={['bush-02', 'bush-05', 'bush-03']}
      base={0.88}
      spread={0.34}
      className={className}
      motion="breathe"
    />
  );
}

/** Drifting cloud, painted. */
export function Cloud({ seed = 1, className }: ArtProps) {
  const pick = useMemo(() => {
    const r = rng(seed * 61 + 29);
    return {
      name: CLOUD_SPRITES[seed % CLOUD_SPRITES.length],
      scale: 0.8 + r() * 0.8,
      flip: r() > 0.5,
    };
  }, [seed]);
  return <Sprite name={pick.name} scale={pick.scale} flip={pick.flip} className={className} />;
}

/** Moored rowing boat, rocking on the swell. */
export function Boat({ seed = 9, className }: ArtProps) {
  const r = useMemo(() => rng(seed * 53 + 7), [seed]);
  const delay = r() * 3;
  return (
    <SpriteAnim
      name="boat"
      scale={0.95}
      duration={2.6}
      delay={delay}
      flip={seed % 2 === 0}
      className={className}
    />
  );
}

/** Chimney smoke, curling upward. */
export function Smoke({ seed = 1, scale = 0.55, className }: ArtProps & { scale?: number }) {
  const r = useMemo(() => rng(seed * 47 + 13), [seed]);
  return <SpriteAnim name="smoke" scale={scale} duration={3.4} delay={r() * 4} className={className} />;
}

/** Festival bunting strung across the village square. */
export function Bunting({ seed = 1, className }: ArtProps) {
  const r = useMemo(() => rng(seed * 59 + 23), [seed]);
  const name = seed % 2 === 0 ? 'bunting-a' : 'bunting-b';
  return (
    <SpriteAnim
      name={name}
      scale={0.9 + r() * 0.35}
      duration={2.2}
      delay={r() * 3}
      flip={r() > 0.5}
      className={className}
    />
  );
}

/** A bird crossing the sky: the strip flaps, the element travels. */
export function Bird({
  kind = 'gull',
  scale = 0.75,
  travel = 900,
  rise = -60,
  seconds = 34,
  delay = 0,
  flip,
  className,
}: {
  kind?: 'gull' | 'bluebird' | 'robin';
  scale?: number;
  travel?: number;
  rise?: number;
  seconds?: number;
  delay?: number;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`wm-fly pointer-events-none ${className ?? ''}`}
      style={
        {
          animationDuration: `${seconds}s`,
          animationDelay: `-${delay}s`,
          '--wm-fly-x': `${travel}px`,
          '--wm-fly-y': `${rise}px`,
        } as React.CSSProperties
      }
    >
      <SpriteAnim name={kind} scale={scale} duration={kind === 'robin' ? 0.4 : 0.75} delay={delay} flip={flip} />
    </div>
  );
}

/** The painted lake, with its jetty and little bridge. */
export function Lake({ scale = 1, className }: { scale?: number; className?: string }) {
  return <Sprite name="lake" scale={scale} className={className} />;
}

/** A mass of distant woodland for the horizon band. */
export function ForestMass({
  scale = 1,
  flip,
  className,
}: {
  scale?: number;
  flip?: boolean;
  className?: string;
}) {
  return <Sprite name="forest-mass" scale={scale} flip={flip} className={className} />;
}

export function Grass({ seed = 6, className }: ArtProps) {
  const art = useMemo(() => {
    const r = rng(seed * 37 + 17);
    const n = 7 + Math.floor(r() * 6);
    return Array.from({ length: n }, () => {
      const x = (r() - 0.5) * 46;
      const h = 14 + r() * 24;
      const bend = (r() - 0.5) * 20;
      const w = 2.6 + r() * 2.2;
      return { x, h, bend, w, tone: r() > 0.5 ? '#6cc247' : '#54a93a' };
    });
  }, [seed]);

  return (
    <svg viewBox="-44 -56 88 62" width="88" height="62" className={className} aria-hidden>
      <g className={seed % 3 === 0 ? 'wm-sway' : undefined} style={{ transformOrigin: '0px 4px' }}>
        {art.map((b, i) => (
          <path
            key={i}
            d={`M ${b.x - b.w / 2} 4 Q ${b.x + b.bend * 0.4} ${-b.h * 0.6} ${b.x + b.bend} ${-b.h} Q ${b.x + b.bend * 0.3} ${-b.h * 0.55} ${b.x + b.w / 2} 4 Z`}
            fill={b.tone}
          />
        ))}
      </g>
    </svg>
  );
}

/** Riverside reeds and cattails. */
export function Reeds({ seed = 7, className }: ArtProps) {
  const art = useMemo(() => {
    const r = rng(seed * 41 + 19);
    const n = 6 + Math.floor(r() * 5);
    return Array.from({ length: n }, () => ({
      x: (r() - 0.5) * 40,
      h: 26 + r() * 34,
      bend: (r() - 0.5) * 16,
      cat: r() > 0.55,
    }));
  }, [seed]);

  return (
    <svg viewBox="-44 -80 88 86" width="88" height="86" className={className} aria-hidden>
      <g className={seed % 3 === 0 ? 'wm-sway' : undefined} style={{ transformOrigin: '0px 4px' }}>
        {art.map((s, i) => (
          <g key={i}>
            <path
              d={`M ${s.x} 4 Q ${s.x + s.bend * 0.4} ${-s.h * 0.6} ${s.x + s.bend} ${-s.h}`}
              stroke="#4f9e46"
              strokeWidth="2.6"
              fill="none"
              strokeLinecap="round"
            />
            {s.cat && (
              <rect
                x={s.x + s.bend - 2.6}
                y={-s.h - 12}
                width="5.2"
                height="14"
                rx="2.6"
                fill="#8a5a2c"
                transform={`rotate(${s.bend * 0.6} ${s.x + s.bend} ${-s.h})`}
              />
            )}
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Lily pads with the odd blossom, for the lake surface. */
export function LilyPads({ seed = 8, className }: ArtProps) {
  const art = useMemo(() => {
    const r = rng(seed * 43 + 23);
    return Array.from({ length: 4 + Math.floor(r() * 3) }, () => ({
      x: (r() - 0.5) * 70,
      y: (r() - 0.5) * 26,
      s: 8 + r() * 7,
      bloom: r() > 0.65,
    }));
  }, [seed]);

  return (
    <svg viewBox="-56 -30 112 60" width="112" height="60" className={className} aria-hidden>
      {art.map((p, i) => (
        <g key={i}>
          <path
            d={`M ${p.x} ${p.y} m ${-p.s} 0 a ${p.s} ${p.s * 0.72} 0 1 1 ${p.s * 1.7} ${-p.s * 0.12} z`}
            fill="#4e9b39"
          />
          <path
            d={`M ${p.x} ${p.y} m ${-p.s * 0.85} 0 a ${p.s * 0.85} ${p.s * 0.6} 0 1 1 ${p.s * 1.4} ${-p.s * 0.1} z`}
            fill="#6cc247"
          />
          {p.bloom && <circle cx={p.x + p.s * 0.2} cy={p.y - p.s * 0.3} r="3.4" fill="#ffc3dc" />}
        </g>
      ))}
    </svg>
  );
}

/** Mossy stump with a couple of mushrooms. */
export function Stump({ seed = 9, className }: ArtProps) {
  const r = rng(seed * 47 + 29);
  const w = 20 + r() * 8;
  return (
    <svg viewBox="-50 -60 100 68" width="100" height="68" className={className} aria-hidden>
      <Shadow rx={w * 1.5} ry={w * 0.36} />
      <path d={`M ${-w} 2 L ${-w * 0.86} ${-w * 1.5} L ${w * 0.86} ${-w * 1.5} L ${w} 2 Z`} fill="url(#wmBark)" />
      <ellipse cx="0" cy={-w * 1.5} rx={w * 0.86} ry={w * 0.3} fill="#d2a46d" />
      <ellipse cx="0" cy={-w * 1.5} rx={w * 0.52} ry={w * 0.18} fill="#b9803f" opacity="0.6" />
      <path d={blob({ cx: -w * 0.2, cy: -w * 1.62, rx: w * 0.6, ry: w * 0.22, lobes: 7, jitter: 0.3, rand: r })} fill="#6cc247" />
      <g>
        <path d={`M ${w * 0.9} 2 v -9`} stroke="#f3e7cf" strokeWidth="4" strokeLinecap="round" />
        <path d={`M ${w * 0.9} -9 m -7 0 a 7 6 0 0 1 14 0 z`} fill="#e0603f" />
        <circle cx={w * 0.9} cy={-11} r="1.6" fill="#fff3e0" />
      </g>
    </svg>
  );
}

/** Split-rail fence section. */
export function Fence({ seed = 10, className }: ArtProps) {
  const posts = seed % 2 === 0 ? [-54, -18, 18, 54] : [-58, -29, 0, 29, 58];
  return (
    <svg viewBox="-72 -56 144 64" width="144" height="64" className={className} aria-hidden>
      <ellipse cx="0" cy="3" rx="64" ry="7" fill="#2d5a2f" opacity="0.12" />
      {posts.map((x) => (
        <g key={x}>
          <path d={`M ${x - 4} 4 L ${x - 3} -40 L ${x + 3} -40 L ${x + 4} 4 Z`} fill="url(#wmWood)" />
          <path d={`M ${x - 3} -40 L ${x} -45 L ${x + 3} -40 Z`} fill="#d7a267" />
        </g>
      ))}
      <rect x="-60" y="-32" width="120" height="6" rx="3" fill="url(#wmWood)" />
      <rect x="-60" y="-18" width="120" height="6" rx="3" fill="url(#wmWood)" />
      <rect x="-60" y="-32" width="120" height="2" rx="1" fill="#e7bb85" opacity="0.8" />
      <rect x="-60" y="-18" width="120" height="2" rx="1" fill="#e7bb85" opacity="0.8" />
    </svg>
  );
}

/** Round haystack. */
export function Haystack({ seed = 11, className }: ArtProps) {
  const r = rng(seed * 53 + 31);
  const w = 32 + r() * 10;
  return (
    <svg viewBox="-60 -80 120 88" width="120" height="88" className={className} aria-hidden>
      <Shadow rx={w * 1.1} ry={w * 0.26} />
      <path d={blob({ cx: 0, cy: -w * 0.62, rx: w, ry: w * 0.7, lobes: 9, jitter: 0.12, rand: r })} fill="#d9ae55" />
      <path d={blob({ cx: -w * 0.2, cy: -w * 0.86, rx: w * 0.62, ry: w * 0.4, lobes: 8, jitter: 0.16, rand: r, phase: 1 })} fill="#eccb77" />
      <g stroke="#b88c3c" strokeWidth="1.6" strokeLinecap="round" opacity="0.75">
        <path d={`M ${-w * 0.6} ${-w * 0.3} q ${w * 0.3} ${-w * 0.2} ${w * 0.6} ${-w * 0.08}`} fill="none" />
        <path d={`M ${-w * 0.5} ${-w * 0.7} q ${w * 0.4} ${-w * 0.14} ${w * 0.8} ${-w * 0.02}`} fill="none" />
      </g>
      <path d={`M ${-w * 0.1} ${-w * 1.3} l 4 10 l -8 0 z`} fill="#eccb77" />
    </svg>
  );
}

/** Crates and barrels — market clutter that makes a square feel lived-in. */
export function Crates({ seed = 12, className }: ArtProps) {
  const r = rng(seed * 59 + 37);
  const flip = r() > 0.5;
  return (
    <svg viewBox="-60 -70 120 78" width="120" height="78" className={className} aria-hidden>
      <Shadow rx={44} ry={10} />
      <g transform={flip ? 'scale(-1,1)' : undefined}>
        <rect x="-38" y="-34" width="36" height="36" rx="3" fill="url(#wmWood)" />
        <rect x="-38" y="-34" width="36" height="5" rx="2.5" fill="#e0ad70" />
        <path d="M -38 -22 h 36 M -38 -12 h 36" stroke="#8a5a2c" strokeWidth="2.4" opacity="0.6" />
        <rect x="-30" y="-56" width="24" height="24" rx="3" fill="url(#wmWood)" />
        <path d="M -30 -46 h 24" stroke="#8a5a2c" strokeWidth="2" opacity="0.6" />
        <path d="M 6 2 q -4 -34 10 -34 q 14 0 10 34 z" fill="#b9803f" />
        <path d="M 6 2 q -4 -34 10 -34 q 5 0 7.5 9 q -8 18 -5 25 z" fill="#d7a267" />
        <path d="M 4.4 -10 q 11.6 4 23.2 0" stroke="#7a4a20" strokeWidth="3" fill="none" />
        <ellipse cx="16" cy="-32" rx="10" ry="3.4" fill="#e0ad70" />
      </g>
    </svg>
  );
}
