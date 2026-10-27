import type { DecorationKind, LessonType, WorldTheme } from '@wondermap/shared';

/**
 * Procedural authoring helpers. Everything lives in a "world space" of
 * WORLD_W x WORLD_H units; the client maps that space onto the screen with
 * pan/zoom. Lesson nodes follow a gentle serpentine so the map reads like a
 * winding trail, and decorations are scattered with deterministic jitter so a
 * reseed reproduces the same handcrafted-looking scene.
 */

export const WORLD_W = 1600;
export const WORLD_H = 2200;

// Tiny deterministic PRNG (mulberry32) so seeds are reproducible.
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface NodeSpec {
  order: number;
  x: number;
  y: number;
  type: LessonType;
}

export interface DecoSpec {
  kind: DecorationKind;
  x: number;
  y: number;
  scale: number;
  flip: boolean;
}

export interface PathSpec {
  from: { x: number; y: number };
  to: { x: number; y: number };
  control?: { x: number; y: number };
}

/** Build a serpentine list of node positions from bottom to top. */
export function buildNodes(count: number, seed: number): NodeSpec[] {
  const rand = rng(seed);
  const nodes: NodeSpec[] = [];
  const marginY = 220;
  const usableH = WORLD_H - marginY * 2;
  const step = usableH / (count - 1);
  const amp = WORLD_W * 0.26;
  const midX = WORLD_W / 2;

  for (let i = 0; i < count; i++) {
    // bottom (start) -> top
    const y = WORLD_H - marginY - i * step;
    const phase = i * 0.9;
    const x = midX + Math.sin(phase) * amp + (rand() - 0.5) * 60;
    let type: LessonType = 'lesson';
    if (i === count - 1) type = 'boss';
    else if (i > 0 && i % 5 === 0) type = 'treasure';
    else if (i > 0 && i % 7 === 0) type = 'review';
    else if (i > 0 && i % 4 === 0) type = 'challenge';
    nodes.push({ order: i, x: Math.round(x), y: Math.round(y), type });
  }
  return nodes;
}

/** Curved connectors between consecutive nodes. */
export function buildPaths(nodes: NodeSpec[]): PathSpec[] {
  const paths: PathSpec[] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    const a = nodes[i];
    const b = nodes[i + 1];
    const midX = (a.x + b.x) / 2;
    const midY = (a.y + b.y) / 2;
    // bow the control point outward from the serpentine center
    const bow = (a.x - WORLD_W / 2) * 0.35;
    paths.push({
      from: { x: a.x, y: a.y },
      to: { x: b.x, y: b.y },
      control: { x: midX + bow, y: midY },
    });
  }
  return paths;
}

const THEME_DECOR: Record<WorldTheme, DecorationKind[]> = {
  forest: ['tree', 'pine', 'bush', 'rock', 'flower', 'tree'],
  beach: ['bush', 'rock', 'flower', 'lamp', 'bush'],
  snow: ['pine', 'pine', 'rock', 'mountain', 'pine'],
  mountain: ['mountain', 'pine', 'rock', 'rock', 'pine'],
  jungle: ['tree', 'tree', 'bush', 'flower', 'bush'],
  city: ['building', 'building', 'lamp', 'tree', 'building'],
  space: ['rock', 'rock', 'castle', 'lamp'],
  ocean: ['rock', 'bush', 'flower', 'rock'],
  volcano: ['mountain', 'rock', 'rock', 'pine'],
  egypt: ['castle', 'rock', 'bush', 'rock'],
  future: ['building', 'lamp', 'building', 'castle'],
  magic: ['castle', 'tree', 'flower', 'bush', 'flower'],
};

/** Scatter theme-appropriate decorations avoiding the node trail. */
export function buildDecorations(
  theme: WorldTheme,
  nodes: NodeSpec[],
  seed: number,
): DecoSpec[] {
  const rand = rng(seed * 7 + 13);
  const kinds = THEME_DECOR[theme];
  const decos: DecoSpec[] = [];
  const count = 70;

  for (let i = 0; i < count; i++) {
    const x = rand() * WORLD_W;
    const y = rand() * WORLD_H;
    // keep a clear corridor around the trail
    const nearNode = nodes.some((n) => Math.hypot(n.x - x, n.y - y) < 130);
    if (nearNode) continue;
    const kind = kinds[Math.floor(rand() * kinds.length)];
    decos.push({
      kind,
      x: Math.round(x),
      y: Math.round(y),
      scale: 0.75 + rand() * 0.7,
      flip: rand() > 0.5,
    });
  }

  // A few clouds drifting over the upper (future) portion of the map.
  for (let i = 0; i < 8; i++) {
    decos.push({
      kind: 'cloud',
      x: Math.round(rand() * WORLD_W),
      y: Math.round(rand() * WORLD_H * 0.7),
      scale: 0.9 + rand() * 0.9,
      flip: rand() > 0.5,
    });
  }
  return decos;
}
