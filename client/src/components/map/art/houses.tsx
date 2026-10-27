import { useMemo, type ReactNode } from 'react';
import { rng, blob } from '../../../lib/shapes';
import { Smoke } from './flora';

/**
 * Village architecture.
 *
 * Buildings are assembled from real parts — eaves with an overhang, tiled roof
 * courses, a shaded gable, framed windows with shutters and flower boxes,
 * stepped doors, chimneys — and every instance varies its storeys, roof tone,
 * window layout and trim, so a street never reads as one stamped rectangle.
 * Ground contact is y = 0.
 */

interface ArtProps {
  seed?: number;
  className?: string;
}

const ROOFS = ['url(#wmRoof)', 'url(#wmRoofWarm)', 'url(#wmRoofCool)'];
const WALLS = ['url(#wmWall)', 'url(#wmWallWarm)'];

function Shadow({ rx, ry = rx * 0.26 }: { rx: number; ry?: number }) {
  return (
    <g>
      <ellipse cx="2" cy="2" rx={rx} ry={ry} fill="#2d5a2f" opacity="0.14" />
      <ellipse cx="0" cy="0" rx={rx * 0.7} ry={ry * 0.6} fill="#275227" opacity="0.14" />
    </g>
  );
}

/** A framed window with glass, mullions, shutters and (sometimes) a flower box. */
function Window({
  x,
  y,
  w = 18,
  h = 22,
  shutters,
  box,
  arched,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  shutters?: boolean;
  box?: boolean;
  arched?: boolean;
}) {
  return (
    <g>
      {shutters && (
        <>
          <rect x={x - w / 2 - 7} y={y} width="6.5" height={h} rx="1.6" fill="#6f9e5a" />
          <rect x={x + w / 2 + 0.5} y={y} width="6.5" height={h} rx="1.6" fill="#5c8a49" />
        </>
      )}
      <rect x={x - w / 2 - 2} y={y - 2} width={w + 4} height={h + 4} rx={arched ? (w + 4) / 2 : 3} fill="#f6ead3" />
      <rect x={x - w / 2 - 2} y={y - 2} width={w + 4} height={h + 4} rx={arched ? (w + 4) / 2 : 3} fill="#c7a271" opacity="0.5" />
      <rect x={x - w / 2} y={y} width={w} height={h} rx={arched ? w / 2 : 2} fill="url(#wmGlass)" />
      <path
        d={`M ${x - w / 2} ${y + h * 0.1} L ${x + w / 2} ${y + h * 0.62} L ${x + w / 2} ${y + h * 0.3} L ${x - w / 2} ${y + h * 0.84} Z`}
        fill="#ffffff"
        opacity="0.42"
      />
      <path d={`M ${x} ${y} v ${h} M ${x - w / 2} ${y + h / 2} h ${w}`} stroke="#f6ead3" strokeWidth="2" />
      {box && (
        <g>
          <rect x={x - w / 2 - 3} y={y + h} width={w + 6} height="6" rx="2" fill="#a9733c" />
          {[-0.3, 0, 0.3].map((o, i) => (
            <circle key={i} cx={x + o * w} cy={y + h - 1} r="3.2" fill={['#ff7390', '#ffd34e', '#ff9d6b'][i]} />
          ))}
          <circle cx={x - w * 0.15} cy={y + h - 3} r="2.4" fill="#6cc247" />
        </g>
      )}
    </g>
  );
}

/** Tiled roof: a shaded gable, overhanging eaves and courses of scallops. */
function Roof({
  halfW,
  baseY,
  peak,
  tone,
  rand,
}: {
  halfW: number;
  baseY: number;
  peak: number;
  tone: string;
  rand: () => number;
}) {
  const over = halfW * 0.16;
  const courses = 3 + Math.floor(rand() * 2);
  const rows: ReactNode[] = [];
  for (let i = 1; i <= courses; i++) {
    const t = i / (courses + 1);
    const y = baseY - (baseY - peak) * t;
    const w = (halfW + over) * (1 - t);
    const scallops = Math.max(3, Math.round((w * 2) / 11));
    const step = (w * 2) / scallops;
    let d = `M ${-w} ${y}`;
    for (let s = 0; s < scallops; s++) {
      d += ` a ${step / 2} ${step / 2.6} 0 0 0 ${step} 0`;
    }
    rows.push(<path key={i} d={d} fill="none" stroke="#00000022" strokeWidth="1.6" />);
  }
  return (
    <g>
      <path d={`M ${-halfW - over} ${baseY} L 0 ${peak} L ${halfW + over} ${baseY} Z`} fill={tone} />
      <path d={`M 0 ${peak} L ${halfW + over} ${baseY} L ${halfW * 0.34} ${baseY} Z`} fill="#000000" opacity="0.14" />
      {rows}
      <path d={`M ${-halfW - over} ${baseY} L ${halfW + over} ${baseY}`} stroke="#8e3f22" strokeWidth="4" strokeLinecap="round" />
      <path d={`M ${-halfW - over} ${baseY} L 0 ${peak}`} stroke="#ffffff" strokeOpacity="0.3" strokeWidth="2.4" strokeLinecap="round" />
    </g>
  );
}

function Chimney({ x, y, h = 26 }: { x: number; y: number; h?: number; smoke?: boolean }) {
  return (
    <g>
      <rect x={x - 6} y={y - h} width="12" height={h} rx="2" fill="#b4714c" />
      <rect x={x - 6} y={y - h} width="4.5" height={h} fill="#cf8a63" />
      <rect x={x - 8} y={y - h - 5} width="16" height="6" rx="2" fill="#8e5436" />
    </g>
  );
}

/* ------------------------------------------------------------------------- */

/** The everyday village house — one or two storeys, with a lean-to or porch. */
export function Cottage({ seed = 1, className }: ArtProps) {
  const a = useMemo(() => {
    const r = rng(seed * 13 + 3);
    const storeys = r() > 0.55 ? 2 : 1;
    const w = 46 + r() * 16;
    const wallH = storeys === 2 ? 76 + r() * 14 : 44 + r() * 10;
    return {
      r,
      storeys,
      w,
      wallH,
      roof: ROOFS[Math.floor(r() * ROOFS.length)],
      wall: WALLS[Math.floor(r() * WALLS.length)],
      peak: wallH + 30 + r() * 16,
      lean: r() > 0.5,
      flip: r() > 0.5,
      smoke: r() > 0.45,
    };
  }, [seed]);

  const { w, wallH } = a;
  // where the chimney pot ends, in element coordinates, so smoke can vent there
  const chimneyBase = -a.peak + (a.peak - wallH) * 0.48;
  const smokeAt = { left: 110 + (a.flip ? 1 : -1) * w * 0.52, top: 180 + chimneyBase - 31 };

  return (
    <div className={`relative ${className ?? ''}`} style={{ width: 220, height: 192 }}>
      {a.smoke && (
        <div
          className="absolute"
          style={{ left: smokeAt.left, top: smokeAt.top, transform: 'translate(-50%, -92%)' }}
        >
          <Smoke seed={seed} scale={0.46} />
        </div>
      )}
    <svg viewBox="-110 -180 220 192" width="220" height="192" aria-hidden>
      <Shadow rx={w * 1.5} />
      <g transform={a.flip ? 'scale(-1,1)' : undefined}>
        {/* lean-to shed */}
        {a.lean && (
          <g>
            <rect x={w * 0.92} y={-wallH * 0.56} width={w * 0.62} height={wallH * 0.56} fill="#e8d5b4" />
            <path
              d={`M ${w * 0.86} ${-wallH * 0.56} L ${w * 1.6} ${-wallH * 0.82} L ${w * 1.6} ${-wallH * 0.62} L ${w * 0.86} ${-wallH * 0.44} Z`}
              fill="url(#wmRoofCool)"
            />
            <rect x={w * 1.06} y={-wallH * 0.34} width="12" height="14" rx="2" fill="#9a6a3c" />
          </g>
        )}

        {/* main block */}
        <rect x={-w} y={-wallH} width={w * 2} height={wallH} rx="2" fill={a.wall} />
        <rect x={-w} y={-wallH} width={w * 0.42} height={wallH} fill="#000000" opacity="0.07" />
        <rect x={-w} y={-6} width={w * 2} height="6" fill="#b9a383" opacity="0.5" />
        {/* half-timbering on some houses */}
        {a.storeys === 2 && (
          <g stroke="#a9733c" strokeWidth="3.4" opacity="0.65">
            <path d={`M ${-w} ${-wallH * 0.52} h ${w * 2}`} />
            <path d={`M ${-w * 0.5} ${-wallH * 0.52} v ${wallH * 0.52}`} />
            <path d={`M ${w * 0.5} ${-wallH * 0.52} v ${wallH * 0.52}`} />
          </g>
        )}

        <Roof halfW={w} baseY={-wallH} peak={-a.peak} tone={a.roof} rand={a.r} />
        <Chimney x={-w * 0.52} y={-a.peak + (a.peak - wallH) * 0.48} smoke={a.smoke} />

        {/* door with a step */}
        <g>
          <rect x={-10} y={-32} width="20" height="32" rx="2" fill="#8a5a2c" />
          <rect x={-8} y={-30} width="16" height="30" rx="1.5" fill="#a9733c" />
          <path d="M -8 -30 h 16 v 14 h -16 z" fill="#b9803f" opacity="0.7" />
          <circle cx="4" cy="-15" r="1.8" fill="#ffd34e" />
          <rect x={-14} y={-4} width="28" height="5" rx="2" fill="#cfc3a8" />
        </g>

        {/* windows */}
        <Window x={-w * 0.56} y={-wallH * 0.74} shutters box />
        <Window x={w * 0.56} y={-wallH * 0.74} shutters box={a.storeys === 1} />
        {a.storeys === 2 && (
          <>
            <Window x={-w * 0.56} y={-wallH * 0.36} w={16} h={18} />
            <Window x={w * 0.56} y={-wallH * 0.36} w={16} h={18} />
          </>
        )}

        {/* planting against the wall */}
        <path d={blob({ cx: -w * 0.92, cy: -10, rx: 18, ry: 11, lobes: 8, jitter: 0.24, rand: a.r })} fill="url(#wmLeafMid)" />
        <path d={blob({ cx: w * 0.86, cy: -8, rx: 14, ry: 9, lobes: 7, jitter: 0.26, rand: a.r })} fill="url(#wmLeafDark)" />
      </g>
    </svg>
    </div>
  );
}

/** Taller townhouse with a balcony — anchors a village square. */
export function TownHouse({ seed = 2, className }: ArtProps) {
  const a = useMemo(() => {
    const r = rng(seed * 19 + 5);
    return { r, w: 44 + r() * 10, h: 96 + r() * 22, roof: ROOFS[Math.floor(r() * 2)], flip: r() > 0.5 };
  }, [seed]);
  const { w, h } = a;

  return (
    <div className={`relative ${className ?? ''}`} style={{ width: 220, height: 212 }}>
      <div
        className="absolute"
        style={{ left: 110 + (a.flip ? -1 : 1) * w * 0.56, top: 200 - h - 39, transform: 'translate(-50%, -92%)' }}
      >
        <Smoke seed={seed + 3} scale={0.42} />
      </div>
    <svg viewBox="-110 -200 220 212" width="220" height="212" aria-hidden>
      <Shadow rx={w * 1.4} />
      <g transform={a.flip ? 'scale(-1,1)' : undefined}>
        <rect x={-w} y={-h} width={w * 2} height={h} rx="2" fill="url(#wmWallWarm)" />
        <rect x={-w} y={-h} width={w * 0.4} height={h} fill="#000000" opacity="0.08" />
        <rect x={-w - 3} y={-h * 0.52} width={w * 2 + 6} height="5" rx="2" fill="#d7bf96" />
        <Roof halfW={w} baseY={-h} peak={-h - 34} tone={a.roof} rand={a.r} />
        <Chimney x={w * 0.56} y={-h - 12} h={22} smoke />

        {/* balcony */}
        <g>
          <rect x={-w * 0.72} y={-h * 0.5} width={w * 1.44} height="4" fill="#9a6a3c" />
          <rect x={-w * 0.72} y={-h * 0.5} width={w * 1.44} height="14" fill="#b9803f" opacity="0.35" />
          {[-0.6, -0.3, 0, 0.3, 0.6].map((o) => (
            <rect key={o} x={o * w - 1.4} y={-h * 0.5 - 12} width="2.8" height="12" fill="#9a6a3c" />
          ))}
          <rect x={-w * 0.72} y={-h * 0.5 - 14} width={w * 1.44} height="3.4" rx="1.7" fill="#a9733c" />
          <circle cx={-w * 0.4} cy={-h * 0.5 - 4} r="4" fill="#ff7390" />
          <circle cx={w * 0.38} cy={-h * 0.5 - 4} r="4" fill="#c89bf5" />
        </g>

        <Window x={0} y={-h * 0.88} w={16} h={18} arched />
        <Window x={-w * 0.56} y={-h * 0.72} w={15} h={17} shutters />
        <Window x={w * 0.56} y={-h * 0.72} w={15} h={17} shutters />
        <Window x={-w * 0.56} y={-h * 0.34} w={15} h={17} box />
        <Window x={w * 0.56} y={-h * 0.34} w={15} h={17} box />
        <g>
          <rect x={-11} y={-36} width="22" height="36" rx="11" fill="#8a5a2c" />
          <rect x={-9} y={-34} width="18" height="34" rx="9" fill="#b9803f" />
          <circle cx="4" cy="-17" r="1.8" fill="#ffd34e" />
        </g>
        <rect x={-16} y={-4} width="32" height="5" rx="2" fill="#cfc3a8" />
      </g>
    </svg>
    </div>
  );
}

/** Village hall / chapel with a bell tower — the landmark of a world. */
export function Hall({ seed = 3, className }: ArtProps) {
  const a = useMemo(() => {
    const r = rng(seed * 23 + 7);
    return { r, w: 62 + r() * 10, h: 72 + r() * 10 };
  }, [seed]);
  const { w, h } = a;

  return (
    <svg viewBox="-130 -250 260 262" width="260" height="262" className={className} aria-hidden>
      <Shadow rx={w * 1.6} />
      {/* wings */}
      <rect x={-w - 26} y={-h * 0.62} width="30" height={h * 0.62} fill="url(#wmWall)" />
      <rect x={w - 4} y={-h * 0.62} width="30" height={h * 0.62} fill="url(#wmWall)" />
      <path d={`M ${-w - 32} ${-h * 0.62} L ${-w - 11} ${-h * 0.92} L ${w * 0 - 56} ${-h * 0.62} Z`} fill="url(#wmRoofCool)" />
      <path d={`M ${w - 10} ${-h * 0.62} L ${w + 11} ${-h * 0.92} L ${w + 32} ${-h * 0.62} Z`} fill="url(#wmRoofCool)" />

      {/* main body */}
      <rect x={-w} y={-h} width={w * 2} height={h} rx="2" fill="url(#wmWall)" />
      <rect x={-w} y={-h} width={w * 0.34} height={h} fill="#000000" opacity="0.07" />
      <Roof halfW={w} baseY={-h} peak={-h - 44} tone="url(#wmRoof)" rand={a.r} />

      {/* bell tower */}
      <g>
        <rect x={-16} y={-h - 108} width="32" height={108} fill="url(#wmWall)" />
        <rect x={-16} y={-h - 108} width="11" height={108} fill="#000000" opacity="0.07" />
        <path d="M -24 -236 L 0 -284 L 24 -236 Z" fill="url(#wmRoof)" transform={`translate(0 ${236 - h - 108})`} />
        <rect x={-10} y={-h - 92} width="20" height="24" rx="10" fill="#4c6a85" />
        <circle cx="0" cy={-h - 56} r="12" fill="#fff6e6" />
        <circle cx="0" cy={-h - 56} r="12" fill="none" stroke="#c7a271" strokeWidth="2.6" />
        <path d={`M 0 ${-h - 63} v 7 l 5 3.5`} stroke="#5a7390" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <rect x={-1.6} y={-h - 130} width="3.2" height="14" rx="1.6" fill="#8d9bab" />
        <path d={`M 1.6 ${-h - 128} h 16 l -5 5 5 5 h -16 z`} fill="#f3594e" />
      </g>

      {/* arched entrance and windows */}
      <path d={`M -15 0 v -30 a 15 15 0 0 1 30 0 v 30 z`} fill="#8a5a2c" />
      <path d={`M -12 0 v -29 a 12 12 0 0 1 24 0 v 29 z`} fill="#a9733c" />
      <path d="M 0 -42 v 42" stroke="#8a5a2c" strokeWidth="2.4" />
      <Window x={-w * 0.56} y={-h * 0.78} w={16} h={22} arched />
      <Window x={w * 0.56} y={-h * 0.78} w={16} h={22} arched />
      <rect x={-24} y={-5} width="48" height="6" rx="3" fill="#cfc3a8" />
      <rect x={-30} y={1} width="60" height="5" rx="2.5" fill="#bfb296" />
    </svg>
  );
}

/** Windmill on the ridge — a silhouette landmark visible from far away. */
export function Mill({ seed = 4, className }: ArtProps) {
  const a = useMemo(() => rng(seed * 29 + 11), [seed]);
  const w = 38;
  const h = 104;
  return (
    <svg viewBox="-130 -230 260 242" width="260" height="242" className={className} aria-hidden>
      <Shadow rx={w * 1.7} />
      <path d={`M ${-w} 0 L ${-w * 0.66} ${-h} L ${w * 0.66} ${-h} L ${w} 0 Z`} fill="url(#wmWallWarm)" />
      <path d={`M ${-w} 0 L ${-w * 0.66} ${-h} L ${-w * 0.2} ${-h} L ${-w * 0.42} 0 Z`} fill="#000000" opacity="0.08" />
      <g stroke="#c7a271" strokeWidth="2.4" opacity="0.6">
        <path d={`M ${-w * 0.88} ${-h * 0.3} h ${w * 1.72}`} />
        <path d={`M ${-w * 0.78} ${-h * 0.58} h ${w * 1.5}`} />
      </g>
      <Roof halfW={w * 0.72} baseY={-h} peak={-h - 30} tone="url(#wmRoofCool)" rand={a} />
      <Window x={0} y={-h * 0.72} w={14} h={16} arched />
      <Window x={-w * 0.4} y={-h * 0.38} w={13} h={15} />
      <rect x={-9} y={-28} width="18" height="28" rx="2" fill="#8a5a2c" />
      {/* sails */}
      <g className="wm-spin" style={{ transformOrigin: `0px ${-h - 14}px` }}>
        {[0, 90, 180, 270].map((deg) => (
          <g key={deg} transform={`rotate(${deg} 0 ${-h - 14})`}>
            <rect x={-3} y={-h - 90} width="6" height="76" rx="2" fill="#a9733c" />
            <rect x={-11} y={-h - 88} width="9" height="68" rx="2" fill="#f6ead3" opacity="0.92" />
            <path d={`M -11 ${-h - 70} h 9 M -11 ${-h - 50} h 9`} stroke="#c7a271" strokeWidth="1.6" />
          </g>
        ))}
        <circle cx="0" cy={-h - 14} r="7" fill="#8a5a2c" />
        <circle cx="0" cy={-h - 14} r="3" fill="#d7a267" />
      </g>
    </svg>
  );
}

/** Market stall with a striped canopy and a laden counter. */
export function MarketStall({ seed = 5, className }: ArtProps) {
  const a = useMemo(() => {
    const r = rng(seed * 31 + 13);
    const hues = [
      ['#f3594e', '#fff6ef'],
      ['#4aa7e0', '#fff6ef'],
      ['#6fbf5a', '#fff6ef'],
      ['#c88ef0', '#fff6ef'],
    ];
    return { r, hue: hues[Math.floor(r() * hues.length)], flip: r() > 0.5 };
  }, [seed]);

  const stripes = [-42, -28, -14, 0, 14, 28];
  return (
    <svg viewBox="-80 -130 160 142" width="160" height="142" className={className} aria-hidden>
      <Shadow rx={54} ry={12} />
      <g transform={a.flip ? 'scale(-1,1)' : undefined}>
        <rect x={-48} y={-64} width="6" height="68" rx="3" fill="url(#wmWood)" />
        <rect x={42} y={-64} width="6" height="68" rx="3" fill="url(#wmWood)" />
        {/* counter */}
        <rect x={-52} y={-26} width="104" height="16" rx="4" fill="url(#wmWood)" />
        <rect x={-52} y={-26} width="104" height="5" rx="2.5" fill="#e0ad70" />
        <path d="M -46 -10 l -4 14 M 46 -10 l 4 14" stroke="#8a5a2c" strokeWidth="4" strokeLinecap="round" />
        {/* produce */}
        <g>
          <path d={blob({ cx: -30, cy: -34, rx: 13, ry: 8, lobes: 7, jitter: 0.2, rand: a.r })} fill="#e0603f" />
          <path d={blob({ cx: -2, cy: -34, rx: 14, ry: 8.5, lobes: 7, jitter: 0.2, rand: a.r })} fill="#6cc247" />
          <path d={blob({ cx: 28, cy: -34, rx: 12, ry: 8, lobes: 7, jitter: 0.2, rand: a.r })} fill="#ffc63f" />
          <circle cx={-33} cy={-38} r="3" fill="#ff8f6b" />
          <circle cx={1} cy={-38} r="3" fill="#8fd05a" />
          <circle cx={26} cy={-38} r="3" fill="#ffd87a" />
        </g>
        {/* canopy */}
        <path d="M -56 -64 q 56 -18 112 0 l 0 6 q -56 -18 -112 0 z" fill={a.hue[0]} />
        {stripes.map((x, i) => (
          <path
            key={x}
            d={`M ${x} -62 h 14 v 11 a 7 6 0 0 1 -14 0 z`}
            fill={i % 2 === 0 ? a.hue[0] : a.hue[1]}
          />
        ))}
        <path d="M -56 -64 q 56 -18 112 0" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="3" fill="none" />
      </g>
    </svg>
  );
}

/** Stone well with a shingled canopy. */
export function Well({ seed = 6, className }: ArtProps) {
  const r = useMemo(() => rng(seed * 37 + 17), [seed]);
  return (
    <svg viewBox="-70 -130 140 142" width="140" height="142" className={className} aria-hidden>
      <Shadow rx={38} ry={10} />
      <path d="M -30 0 q 0 -34 30 -34 q 30 0 30 34 z" fill="url(#wmRock)" />
      <ellipse cx="0" cy="-34" rx="30" ry="10" fill="#8ea0ad" />
      <ellipse cx="0" cy="-34" rx="23" ry="7" fill="#2b4b63" />
      <ellipse cx="0" cy="-33" rx="19" ry="5.4" fill="url(#wmLake)" />
      {[-22, -8, 6, 20].map((x) => (
        <path key={x} d={`M ${x} -4 q 3 -14 1 -26`} stroke="#7b8a97" strokeWidth="2.4" fill="none" />
      ))}
      <rect x={-27} y={-96} width="6" height="62" rx="3" fill="url(#wmWood)" />
      <rect x={21} y={-96} width="6" height="62" rx="3" fill="url(#wmWood)" />
      <path d="M -38 -96 L 0 -120 L 38 -96 Z" fill="url(#wmRoofWarm)" />
      <path d="M 0 -120 L 38 -96 L 16 -96 L 0 -108 Z" fill="#000000" opacity="0.14" />
      <path d="M -34 -92 h 68" stroke="#8e3f22" strokeWidth="3.4" strokeLinecap="round" />
      <rect x={-24} y={-92} width="48" height="5" rx="2.5" fill="#8a5a2c" />
      <path d="M 0 -87 v 30" stroke="#6f5436" strokeWidth="2" />
      <path d="M -9 -57 h 18 l -2.5 12 h -13 z" fill="url(#wmWood)" />
      <path d={blob({ cx: -34, cy: -6, rx: 16, ry: 10, lobes: 8, jitter: 0.24, rand: r })} fill="url(#wmLeafMid)" />
    </svg>
  );
}

/** Lantern post with a warm glow. */
export function Lamp({ seed = 7, className }: ArtProps) {
  const tall = seed % 2 === 0;
  return (
    <svg viewBox="-40 -150 80 158" width="80" height="158" className={className} aria-hidden>
      <g transform={tall ? undefined : 'translate(0 14) scale(1 0.88)'}>
      <ellipse cx="0" cy="2" rx="14" ry="4.5" fill="#2d5a2f" opacity="0.16" />
      <path d="M -9 2 q 0 -12 9 -12 q 9 0 9 12 z" fill="#4a5a6a" />
      <rect x={-3.6} y={-112} width="7.2" height="104" rx="3.6" fill="#4a5a6a" />
      <rect x={-1.6} y={-112} width="2.4" height="104" fill="#6c7f93" />
      <rect x={-7} y={-74} width="14" height="4" rx="2" fill="#3b4958" />
      <path d="M -13 -116 h 26 l -5 -8 h -16 z" fill="#3b4958" />
      <path d="M -11 -142 h 22 l 3 26 h -28 z" fill="#ffe9a1" />
      <path d="M -11 -142 h 22 l 3 26 h -28 z" fill="none" stroke="#3b4958" strokeWidth="3" />
      <path d="M -7 -138 h 7 l -3 20 h -6 z" fill="#fffbe6" opacity="0.8" />
      <path d="M 0 -148 v 7" stroke="#3b4958" strokeWidth="3" strokeLinecap="round" />
      <circle cx="0" cy="-129" r="20" fill="#ffe08a" opacity="0.18" className="wm-glow" />
      </g>
    </svg>
  );
}

/** Arched footbridge with stone piers, planks and railings. */
export function Bridge({ seed = 8, className }: ArtProps) {
  const r = useMemo(() => rng(seed * 41 + 19), [seed]);
  const planks = Array.from({ length: 13 }, (_, i) => -72 + i * 12);
  return (
    <svg viewBox="-110 -90 220 110" width="220" height="110" className={className} aria-hidden>
      {/* reflection in the water below */}
      <path d="M -86 16 Q 0 -8 86 16 L 86 22 Q 0 -2 -86 22 Z" fill="#1d6f96" opacity="0.25" />
      {/* piers */}
      <path d="M -84 14 q -6 -26 8 -30 l 10 0 q 10 6 6 30 z" fill="url(#wmRock)" />
      <path d="M 84 14 q 6 -26 -8 -30 l -10 0 q -10 6 -6 30 z" fill="url(#wmRock)" />
      {/* deck */}
      <path d="M -88 12 Q 0 -54 88 12 L 88 2 Q 0 -64 -88 2 Z" fill="#8a5a2c" />
      <path d="M -88 2 Q 0 -64 88 2 L 88 -6 Q 0 -72 -88 -6 Z" fill="url(#wmWood)" />
      {planks.map((x) => {
        const t = (x + 88) / 176;
        const y = -6 + (2 - -6) * 0 + (-66 * 4 * t * (1 - t)) * 0.88;
        return <path key={x} d={`M ${x} ${y + 8} l 0 8`} stroke="#7a4a20" strokeWidth="2.2" opacity="0.5" />;
      })}
      <path d="M -88 -6 Q 0 -72 88 -6" stroke="#e7bb85" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* railings */}
      {[-74, -50, -26, 0, 26, 50, 74].map((x) => {
        const t = (x + 88) / 176;
        const y = -6 - 66 * 4 * t * (1 - t) * 0.88;
        return <rect key={x} x={x - 2} y={y - 24} width="4" height="26" rx="2" fill="#9a6a3c" />;
      })}
      <path d="M -78 -28 Q 0 -92 78 -28" stroke="#a9733c" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M -78 -30 Q 0 -94 78 -30" stroke="#d7a267" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d={blob({ cx: -92, cy: 8, rx: 18, ry: 10, lobes: 8, jitter: 0.26, rand: r })} fill="url(#wmLeafDark)" />
      <path d={blob({ cx: 94, cy: 10, rx: 16, ry: 9, lobes: 8, jitter: 0.26, rand: r })} fill="url(#wmLeafMid)" />
    </svg>
  );
}

/** Distant peak for the far landscape band. */
export function Mountain({ seed = 10, className }: ArtProps) {
  const a = useMemo(() => {
    const r = rng(seed * 43 + 23);
    return { r, w: 120 + r() * 60, h: 110 + r() * 60 };
  }, [seed]);
  const { w, h } = a;
  return (
    <svg viewBox="-200 -220 400 230" width="400" height="230" className={className} aria-hidden>
      <path
        d={`M ${-w} 6 L ${-w * 0.42} ${-h * 0.68} L ${-w * 0.16} ${-h * 0.42} L ${w * 0.12} ${-h} L ${w * 0.56} ${-h * 0.5} L ${w} 6 Z`}
        fill="url(#wmPeak)"
      />
      <path d={`M ${w * 0.12} ${-h} L ${w} 6 L ${w * 0.3} 6 Z`} fill="#000000" opacity="0.12" />
      <path d={`M ${w * 0.12} ${-h} L ${w * 0.34} ${-h * 0.7} L ${w * 0.2} ${-h * 0.66} L ${w * 0.04} ${-h * 0.78} L ${-h * 0.02} ${-h * 0.68} Z`} fill="#ffffff" opacity="0.92" />
      <path d={`M ${-w * 0.42} ${-h * 0.68} L ${-w * 0.3} ${-h * 0.52} L ${-w * 0.5} ${-h * 0.5} Z`} fill="#ffffff" opacity="0.8" />
      <path d={`M ${-w * 0.56} ${-h * 0.2} q ${w * 0.2} ${-h * 0.1} ${w * 0.36} ${h * 0.02}`} stroke="#ffffff" strokeOpacity="0.25" strokeWidth="4" fill="none" />
    </svg>
  );
}
