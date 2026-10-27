/**
 * Geometry helpers for the illustrated world.
 *
 * Everything the map paints — foliage, land masses, river banks, rocks — is
 * built from *irregular* silhouettes rather than circles and triangles. These
 * helpers turn a seed into smooth, organic outlines so no two trees, bushes or
 * hills are identical while the scene still reproduces exactly on every render.
 */

/** Tiny deterministic PRNG (mulberry32). */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stable 32-bit hash of a string — used to seed art from a decoration id. */
export function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export type Pt = [number, number];

/**
 * Convert a loop of points into a smooth closed path using Catmull-Rom
 * tangents expressed as cubic Béziers. This is what keeps silhouettes from
 * reading as polygons.
 */
export function closedSpline(pts: Pt[], tension = 1): string {
  const n = pts.length;
  if (n < 3) return '';
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension;
    const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension;
    const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension;
    const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + ' Z';
}

/** Same smoothing for an open run of points (river centrelines, path edges). */
export function openSpline(pts: Pt[], tension = 1): string {
  const n = pts.length;
  if (n < 2) return '';
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(n - 1, i + 2)];
    const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension;
    const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension;
    const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension;
    const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

interface BlobOpts {
  cx: number;
  cy: number;
  rx: number;
  ry?: number;
  /** how many lobes go round the silhouette (6–11 reads as foliage) */
  lobes?: number;
  /** 0 = perfect ellipse, 0.35 = very lumpy */
  jitter?: number;
  rand?: () => number;
  /** rotate the lobe phase so stacked blobs don't line up */
  phase?: number;
}

/** An organic closed silhouette: the workhorse behind canopies, hills and rocks. */
export function blob({ cx, cy, rx, ry = rx, lobes = 8, jitter = 0.18, rand, phase = 0 }: BlobOpts): string {
  const r = rand ?? (() => 0.5);
  const pts: Pt[] = [];
  for (let i = 0; i < lobes; i++) {
    const a = phase + (i / lobes) * Math.PI * 2;
    const k = 1 + (r() - 0.5) * 2 * jitter;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return closedSpline(pts);
}

/**
 * A filled band of varying width around a centreline — rivers, dirt roads and
 * shorelines are areas in the reference, never strokes.
 */
export function ribbon(center: Pt[], widthAt: (t: number) => number): string {
  const n = center.length;
  if (n < 2) return '';
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const prev = center[Math.max(0, i - 1)];
    const next = center[Math.min(n - 1, i + 1)];
    const dx = next[0] - prev[0];
    const dy = next[1] - prev[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const w = widthAt(i / (n - 1)) / 2;
    left.push([center[i][0] + nx * w, center[i][1] + ny * w]);
    right.push([center[i][0] - nx * w, center[i][1] - ny * w]);
  }
  const forward = openSpline(left);
  const back = openSpline(right.slice().reverse());
  return `${forward} L ${right[n - 1][0].toFixed(1)} ${right[n - 1][1].toFixed(1)} ${back.replace(/^M[^C]*/, '')} Z`;
}

/** Scatter points inside an ellipse, deterministic and evenly spread. */
export function scatter(
  count: number,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  rand: () => number,
): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand());
    out.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]);
  }
  return out;
}
