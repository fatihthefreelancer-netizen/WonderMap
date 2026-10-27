import { memo, useMemo } from 'react';
import { terrainTones, lighten, darken, type ThemePalette } from '../../lib/theme';
import { WORLD_W, WORLD_H } from '../../lib/constants';
import { rng, blob, ribbon, openSpline, type Pt } from '../../lib/shapes';

/**
 * The painted land.
 *
 * Instead of one flat green plane this builds the ground the way an illustrator
 * would: overlapping terraces each with a shaded ledge beneath it, woodland
 * masses with a scalloped canopy silhouette, cart tracks worn into the grass,
 * and a river that is a *shape* — sand bank, deep channel, lit surface, foam at
 * both edges, ripples and submerged stones — not a coloured stroke.
 *
 * The plate is painted beyond the world box so panning to the camera clamp
 * never reveals bare sky.
 */
const PAD = 260;
const X0 = -PAD;
const Y0 = -PAD;
const FW = WORLD_W + PAD * 2;
const FH = WORLD_H + PAD * 2;

/** River centreline, kept clear of the serpentine lesson trail. */
const RIVER: Pt[] = [
  [1720, -340],
  [1620, -80],
  [1580, 180],
  [1530, 430],
  [1495, 680],
  [1512, 910],
  [1560, 1130],
  [1530, 1350],
  [1462, 1570],
  [1444, 1790],
  [1484, 2010],
  [1534, 2250],
  [1566, 2520],
];

/** Cart tracks worn between the hamlets, away from the lesson trail. */
const TRACKS: Pt[][] = [
  [
    [-120, 1960],
    [120, 1930],
    [330, 1980],
    [520, 2070],
    [760, 2110],
    [1020, 2090],
    [1260, 2040],
    [1430, 1960],
  ],
  [
    [120, 560],
    [250, 640],
    [300, 820],
    [250, 1010],
    [150, 1140],
  ],
  [
    [1330, 1250],
    [1400, 1245],
    [1520, 1240],
    [1640, 1270],
  ],
];

/** River corridor and the painted lake's basin — nothing is drawn over them. */
const inWater = (x: number, y: number) =>
  (x > 1270 && x < 1760) || ((x - 250) / 320) ** 2 + ((y - 1250) / 150) ** 2 < 1;

export const WorldTerrain = memo(function WorldTerrain({ palette }: { palette: ThemePalette }) {
  const t = terrainTones(palette);

  const scene = useMemo(() => {
    const r = rng(20261003);

    /* ---- the land's own silhouette: it dissolves into mist at the top ---- */
    const edge: Pt[] = [];
    for (let x = X0; x <= X0 + FW; x += 180) {
      edge.push([x, 20 + Math.sin(x * 0.0042) * 26 + Math.sin(x * 0.011) * 12 + r() * 14]);
    }
    const land =
      `${openSpline(edge)} L ${X0 + FW} ${Y0 + FH} L ${X0} ${Y0 + FH} Z`;

    /* ---- terraces: overlapping land masses, each with a shaded ledge ---- */
    const terraces = [
      { cx: 420, cy: 300, rx: 620, ry: 330, tone: 'warm' },
      { cx: 1180, cy: 620, rx: 520, ry: 300, tone: 'cool' },
      { cx: 480, cy: 980, rx: 560, ry: 320, tone: 'cool' },
      { cx: 1080, cy: 1420, rx: 520, ry: 300, tone: 'warm' },
      { cx: 380, cy: 1760, rx: 600, ry: 340, tone: 'warm' },
      { cx: 1180, cy: 2060, rx: 560, ry: 300, tone: 'cool' },
      { cx: 820, cy: 180, rx: 460, ry: 220, tone: 'cool' },
      { cx: 900, cy: 820, rx: 420, ry: 240, tone: 'warm' },
      { cx: 640, cy: 1240, rx: 440, ry: 250, tone: 'warm' },
      { cx: 1340, cy: 1760, rx: 400, ry: 230, tone: 'cool' },
      { cx: 120, cy: 2180, rx: 480, ry: 260, tone: 'cool' },
    ].map((p, i) => ({
      ...p,
      top: blob({ cx: p.cx, cy: p.cy, rx: p.rx, ry: p.ry, lobes: 11, jitter: 0.2, rand: r, phase: i }),
      ledge: blob({ cx: p.cx, cy: p.cy + 22, rx: p.rx * 1.01, ry: p.ry * 1.01, lobes: 11, jitter: 0.2, rand: rng(20261003 + i) , phase: i }),
    }));

    /* ---------------- woodland masses with a canopy silhouette ----------- */
    const woods = [
      { cx: -40, cy: 230, rx: 330, ry: 190 },
      { cx: 1500, cy: 215, rx: 380, ry: 200 },
      { cx: -160, cy: 900, rx: 280, ry: 230 },
      { cx: 1740, cy: 1500, rx: 300, ry: 260 },
      { cx: 700, cy: 165, rx: 420, ry: 150 },
      { cx: -120, cy: 2320, rx: 340, ry: 190 },
      { cx: 1620, cy: 2380, rx: 320, ry: 180 },
    ].map((w, i) => {
      const lumps: { x: number; y: number; s: number }[] = [];
      const n = Math.round(w.rx / 34);
      for (let k = 0; k <= n; k++) {
        const px = w.cx - w.rx + (k / n) * w.rx * 2;
        lumps.push({
          x: px,
          y: w.cy - w.ry * 0.5 * (0.55 + 0.45 * Math.sin((k / n) * Math.PI)) - r() * 26,
          s: 34 + r() * 26,
        });
      }
      return { ...w, lumps, key: i };
    });

    /* ------------------------- grass & flower texture -------------------- */
    const tufts: { x: number; y: number; s: number; tone: number }[] = [];
    for (let i = 0; i < 520; i++) {
      const x = X0 + r() * FW;
      const y = Y0 + r() * FH;
      if (inWater(x, y)) continue;
      tufts.push({ x, y, s: 5 + r() * 6, tone: r() });
    }
    const petals: { x: number; y: number; r: number; c: string }[] = [];
    const petalColors = ['#ffffff', '#ffd9e8', '#fff2a8', '#ffd1e0', '#e3d4ff', '#ffe9c4'];
    for (let c = 0; c < 26; c++) {
      const cx = X0 + r() * FW;
      const cy = Y0 + r() * FH;
      if (inWater(cx, cy)) continue;
      const n = 8 + Math.floor(r() * 14);
      for (let i = 0; i < n; i++) {
        const a = r() * Math.PI * 2;
        const rad = Math.sqrt(r()) * (50 + r() * 70);
        petals.push({
          x: cx + Math.cos(a) * rad,
          y: cy + Math.sin(a) * rad * 0.6,
          r: 2.4 + r() * 3.4,
          c: petalColors[Math.floor(r() * petalColors.length)],
        });
      }
    }
    const pebbles: { x: number; y: number; r: number }[] = [];
    for (let i = 0; i < 90; i++) {
      const x = X0 + r() * FW;
      const y = Y0 + r() * FH;
      if (inWater(x, y)) continue;
      pebbles.push({ x, y, r: 2.6 + r() * 4 });
    }

    /* ------------------------------- water ------------------------------- */
    const sand = ribbon(RIVER, (p) => 268 + Math.sin(p * 9) * 46);
    const deep = ribbon(RIVER, (p) => 196 + Math.sin(p * 7 + 1) * 28);
    const water = ribbon(RIVER, (p) => 178 + Math.sin(p * 7 + 1) * 26);
    const foamL = openSpline(RIVER.map(([x, y], i) => [x - (86 + Math.sin(i) * 10), y] as Pt));
    const foamR = openSpline(RIVER.map(([x, y], i) => [x + (86 + Math.cos(i) * 10), y] as Pt));
    const ripples: { x: number; y: number; w: number }[] = [];
    for (let i = 0; i < 70; i++) {
      const seg = r() * (RIVER.length - 1);
      const i0 = Math.floor(seg);
      const f = seg - i0;
      const p0 = RIVER[i0];
      const p1 = RIVER[Math.min(RIVER.length - 1, i0 + 1)];
      ripples.push({
        x: p0[0] + (p1[0] - p0[0]) * f + (r() - 0.5) * 130,
        y: p0[1] + (p1[1] - p0[1]) * f,
        w: 16 + r() * 34,
      });
    }
    const stones = Array.from({ length: 9 }, () => {
      const seg = r() * (RIVER.length - 1);
      const i0 = Math.floor(seg);
      const p0 = RIVER[i0];
      return {
        x: p0[0] + (r() - 0.5) * 150,
        y: p0[1] + r() * 180,
        s: 10 + r() * 16,
      };
    });

    /* ------------------------------ tracks ------------------------------- */
    const tracks = TRACKS.map((pts) => ({
      base: ribbon(pts, () => 42),
      worn: ribbon(pts, () => 26),
      line: openSpline(pts),
    }));

    return { land, terraces, woods, tufts, petals, pebbles, sand, deep, water, foamL, foamR, ripples, stones, tracks };
  }, []);

  const warm = lighten(palette.ground[0], 0.16);
  const cool = darken(palette.ground[1], 0.1);

  return (
    <svg
      className="absolute"
      style={{ left: X0, top: Y0 }}
      width={FW}
      height={FH}
      viewBox={`${X0} ${Y0} ${FW} ${FH}`}
      aria-hidden
    >
      <defs>
        <linearGradient id="wmTerrainBase" x1="0" y1="0" x2="0.15" y2="1">
          <stop offset="0%" stopColor={t.grassTop} />
          <stop offset="42%" stopColor={palette.ground[1]} />
          <stop offset="100%" stopColor={t.grassBottom} />
        </linearGradient>
        <linearGradient id="wmLandMist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.sky[1]} stopOpacity="0.96" />
          <stop offset="55%" stopColor={palette.sky[1]} stopOpacity="0.4" />
          <stop offset="100%" stopColor={palette.sky[1]} stopOpacity="0" />
        </linearGradient>
        <clipPath id="wmLandClip">
          <path d={scene.land} />
        </clipPath>
      </defs>

      <g clipPath="url(#wmLandClip)">
      {/* ------------------------------ base field --------------------------- */}
      <rect x={X0} y={Y0} width={FW} height={FH} fill="url(#wmTerrainBase)" />

      {/* --------------------- terraces: ledge then lit top ------------------ */}
      {scene.terraces.map((p, i) => (
        <g key={`t${i}`}>
          <path d={p.ledge} fill={darken(palette.ground[1], 0.34)} opacity="0.38" />
          <path d={p.top} fill={p.tone === 'warm' ? warm : cool} opacity="0.85" />
          <path d={p.top} fill="#ffffff" opacity="0.07" />
        </g>
      ))}

      {/* ---------------------------- woodland bands ------------------------- */}
      {scene.woods.map((w) => (
        <g key={`w${w.key}`}>
          <ellipse cx={w.cx} cy={w.cy + w.ry * 0.3} rx={w.rx} ry={w.ry * 0.7} fill={darken(palette.accentDark, 0.25)} opacity="0.55" />
          {w.lumps.map((l, k) => (
            <circle key={k} cx={l.x} cy={l.y} r={l.s} fill={darken(palette.accentDark, 0.3)} opacity="0.55" />
          ))}
          {w.lumps.map((l, k) =>
            k % 2 === 0 ? (
              <circle key={`h${k}`} cx={l.x - l.s * 0.2} cy={l.y - l.s * 0.26} r={l.s * 0.56} fill={palette.accent} opacity="0.3" />
            ) : null,
          )}
        </g>
      ))}

      {/* ------------------------------ cart tracks -------------------------- */}
      {scene.tracks.map((tr, i) => (
        <g key={`tr${i}`}>
          <path d={tr.base} fill={darken(palette.path, 0.18)} opacity="0.5" />
          <path d={tr.worn} fill="url(#wmDirt)" opacity="0.9" />
          <path d={tr.line} stroke={lighten(palette.path, 0.4)} strokeOpacity="0.45" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="22 26" />
        </g>
      ))}

      {/* -------------------------------- river ------------------------------ */}
      <g>
        <path d={scene.sand} fill="url(#wmSand)" />
        <path d={scene.sand} fill={darken(palette.path, 0.12)} opacity="0.12" />
        <path d={scene.deep} fill={darken(palette.water, 0.34)} />
        <path d={scene.water} fill="url(#wmWater)" />
        <path d={scene.foamL} stroke="#ffffff" strokeOpacity="0.55" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d={scene.foamR} stroke="#ffffff" strokeOpacity="0.4" strokeWidth="7" fill="none" strokeLinecap="round" />
        {scene.stones.map((s, i) => (
          <g key={`s${i}`}>
            <ellipse cx={s.x} cy={s.y + s.s * 0.3} rx={s.s * 1.3} ry={s.s * 0.5} fill="#ffffff" opacity="0.3" />
            <ellipse cx={s.x} cy={s.y} rx={s.s} ry={s.s * 0.7} fill="#8ea0ad" />
            <ellipse cx={s.x - s.s * 0.2} cy={s.y - s.s * 0.2} rx={s.s * 0.5} ry={s.s * 0.3} fill="#cfd8df" />
          </g>
        ))}
        <g className="wm-flow">
          {scene.ripples.map((p, i) => (
            <path
              key={`r${i}`}
              d={`M ${p.x} ${p.y} q ${p.w / 2} -7 ${p.w} 0`}
              stroke="#ffffff"
              strokeOpacity={i % 3 === 0 ? 0.5 : 0.3}
              strokeWidth={i % 3 === 0 ? 4 : 3}
              fill="none"
              strokeLinecap="round"
            />
          ))}
        </g>
      </g>

      {/* ------------------------------- texture ----------------------------- */}
      <g>
        {scene.pebbles.map((p, i) => (
          <ellipse key={`p${i}`} cx={p.x} cy={p.y} rx={p.r} ry={p.r * 0.7} fill="#9aa6a0" opacity="0.3" />
        ))}
        {scene.tufts.map((g, i) => (
          <path
            key={`g${i}`}
            d={`M ${g.x - g.s} ${g.y} q ${g.s * 0.5} ${-g.s * 1.5} ${g.s * 0.9} ${-g.s * 0.2} q ${g.s * 0.4} ${-g.s * 1.2} ${g.s * 1.1} ${g.s * 0.2}`}
            stroke={g.tone > 0.5 ? lighten(palette.ground[0], 0.3) : darken(palette.ground[1], 0.16)}
            strokeOpacity="0.5"
            strokeWidth="2.6"
            fill="none"
            strokeLinecap="round"
          />
        ))}
        {scene.petals.map((p, i) => (
          <circle key={`f${i}`} cx={p.x} cy={p.y} r={p.r} fill={p.c} opacity="0.8" />
        ))}
      </g>

      {/* the meadow dissolves into the haze of the far landscape */}
      <rect x={X0} y={0} width={FW} height={300} fill="url(#wmLandMist)" />
      </g>
    </svg>
  );
});
