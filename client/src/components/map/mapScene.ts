
/**
 * The authored layout of World 1, expressed in the painted background's own
 * pixel coordinates (1923 x 818).
 *
 * The landscape — hills, river, bridge, village, the two blank signboards — is
 * the designer's painting. Everything here is what the app lays on top of it:
 * where the trail runs, where the stops sit along it, and where the animated
 * sprites are planted. Positions were read straight off the artwork, so a prop
 * never lands in the water or on a roof.
 */

export const MAP_W = 1923;
export const MAP_H = 818;

/**
 * One painted panorama per world. Only Value Village has been illustrated so
 * far; the others fall back to it until their own artwork arrives, so dropping
 * `world-2-bg.webp` into `public/sprites` is all it takes to give world 2 its
 * own landscape.
 */
const BACKGROUNDS: Record<number, string> = {
  0: '/sprites/world-bg.webp',
};

export const backgroundFor = (order: number) => BACKGROUNDS[order] ?? BACKGROUNDS[0];

/**
 * The walking trail, following the painted ground from the lower-left meadow,
 * up over the hills, across the wooden bridge and into the village square.
 */
export const TRAIL: [number, number][] = [
  [352, 726],
  [432, 686],
  [524, 644],
  [624, 596],
  [726, 548],
  [828, 504],
  [918, 472],
  [1000, 452],
  [1062, 460],
  [1115, 482], // the bridge
  [1168, 470],
  [1236, 446],
  [1318, 432],
  [1404, 426],
  [1490, 420],
  [1572, 414],
];

/** Where the painted boards are, so their lettering lands on the wood. */
export const SIGN_WORLD = { x: 260, y: 418, w: 272, h: 118, rotate: -1.5 };
export const SIGN_NEXT = { x: 1810, y: 645, w: 160, h: 78, rotate: 2 };

/** Sample the trail as a smooth position at 0..1 along its length. */
export function trailAt(t: number): [number, number] {
  const clamped = Math.max(0, Math.min(1, t));
  const span = (TRAIL.length - 1) * clamped;
  const i = Math.min(TRAIL.length - 2, Math.floor(span));
  const f = span - i;
  const [x1, y1] = TRAIL[i];
  const [x2, y2] = TRAIL[i + 1];
  return [x1 + (x2 - x1) * f, y1 + (y2 - y1) * f];
}

/**
 * Stops are spread along the trail by their order, so the same painted scene
 * works whether a world has four lessons or twenty.
 */
export function stopPosition(order: number, total: number): [number, number] {
  if (total <= 1) return trailAt(0.5);
  const t = 0.07 + (order / (total - 1)) * 0.86;
  return trailAt(t);
}

/* -------------------------------------------------------------------------- */
/*                              planted scenery                               */
/* -------------------------------------------------------------------------- */

export interface Placed {
  art: 'tree' | 'pine' | 'bush' | 'flower' | 'rock';
  x: number;
  y: number;
  /** multiplier on top of the distance-based scale */
  k?: number;
  flip?: boolean;
}

/**
 * Things recede with distance, so a prop's size comes mostly from how far down
 * the picture it stands. Near the horizon a tree is a third of its size in the
 * foreground — that is what sells the depth of the painting.
 */
export function depthScale(y: number): number {
  const t = Math.max(0, Math.min(1, (y - 230) / (MAP_H - 230)));
  return 0.3 + t * 0.95;
}

/** Hand-placed planting, read off the painting so nothing stands in water. */
export const PLANTING: Placed[] = [
  // --- far hills, small and hazy -------------------------------------------
  { art: 'pine', x: 86, y: 300 },
  { art: 'tree', x: 196, y: 288 },
  { art: 'tree', x: 318, y: 296, flip: true },
  { art: 'pine', x: 452, y: 284 },
  { art: 'tree', x: 560, y: 292 },
  { art: 'tree', x: 668, y: 278, flip: true },
  { art: 'pine', x: 772, y: 290 },
  { art: 'tree', x: 884, y: 282 },
  { art: 'tree', x: 1004, y: 292, flip: true },
  { art: 'pine', x: 1108, y: 300 },
  { art: 'tree', x: 1214, y: 312 },

  // --- middle meadow, left of the trail ------------------------------------
  { art: 'tree', x: 60, y: 404, k: 1.1 },
  { art: 'bush', x: 142, y: 452 },
  { art: 'tree', x: 470, y: 372 },
  { art: 'pine', x: 556, y: 338, k: 1.05 },
  { art: 'flower', x: 410, y: 418 },
  { art: 'tree', x: 648, y: 398, flip: true },
  { art: 'bush', x: 714, y: 352 },
  { art: 'tree', x: 806, y: 356 },
  { art: 'flower', x: 876, y: 404 },
  { art: 'pine', x: 936, y: 340 },
  { art: 'tree', x: 1018, y: 372, flip: true },
  { art: 'bush', x: 1086, y: 346 },
  { art: 'rock', x: 760, y: 430 },

  // --- foreground meadow ----------------------------------------------------
  { art: 'tree', x: 78, y: 592, k: 1.15 },
  { art: 'bush', x: 196, y: 548 },
  { art: 'flower', x: 268, y: 610 },
  { art: 'tree', x: 120, y: 740, k: 1.2, flip: true },
  { art: 'bush', x: 300, y: 782 },
  { art: 'tree', x: 420, y: 772, k: 1.1 },
  { art: 'flower', x: 536, y: 716 },
  { art: 'bush', x: 452, y: 588 },
  { art: 'tree', x: 636, y: 690, flip: true },
  { art: 'rock', x: 722, y: 640 },
  { art: 'tree', x: 820, y: 624, k: 1.05 },
  { art: 'flower', x: 912, y: 572 },
  { art: 'bush', x: 884, y: 700 },
  { art: 'tree', x: 980, y: 666, flip: true },
  { art: 'pine', x: 1046, y: 592 },
  { art: 'flower', x: 660, y: 466 },

  // --- the grassy spit between the river and the bay -----------------------
  { art: 'tree', x: 1304, y: 556, k: 0.9 },
  { art: 'bush', x: 1382, y: 592 },
  { art: 'tree', x: 1448, y: 548, flip: true, k: 0.85 },

  // --- around the village ---------------------------------------------------
  { art: 'tree', x: 1286, y: 428, k: 0.85 },
  { art: 'pine', x: 1332, y: 344, k: 0.8 },
  { art: 'tree', x: 1894, y: 486, flip: true, k: 0.85 },
  { art: 'bush', x: 1840, y: 520 },

  // --- bottom-right bank ----------------------------------------------------
  { art: 'tree', x: 1672, y: 782, k: 1.05 },
  { art: 'bush', x: 1778, y: 806 },
  { art: 'tree', x: 1878, y: 744, flip: true },
  { art: 'flower', x: 1596, y: 790 },
];

/** Clouds drifting across the painted sky. */
export const CLOUDS: { x: number; y: number; k: number; secs: number; delay: number }[] = [
  { x: 180, y: 96, k: 0.8, secs: 46, delay: 0 },
  { x: 520, y: 62, k: 0.62, secs: 54, delay: 12 },
  { x: 880, y: 108, k: 0.9, secs: 62, delay: 26 },
  { x: 1280, y: 74, k: 0.7, secs: 50, delay: 7 },
  { x: 1640, y: 112, k: 0.55, secs: 58, delay: 19 },
  { x: 1050, y: 46, k: 0.45, secs: 66, delay: 33 },
];

/** Birds crossing the valley. */
export const BIRDS: {
  kind: 'gull' | 'bluebird' | 'robin';
  x: number;
  y: number;
  k: number;
  travel: number;
  rise: number;
  secs: number;
  delay: number;
}[] = [
  { kind: 'gull', x: 120, y: 230, k: 0.5, travel: 820, rise: -54, secs: 40, delay: 0 },
  { kind: 'gull', x: 240, y: 196, k: 0.4, travel: 760, rise: -30, secs: 46, delay: 9 },
  { kind: 'bluebird', x: 700, y: 520, k: 0.45, travel: 560, rise: -120, secs: 32, delay: 17 },
  { kind: 'robin', x: 1180, y: 352, k: 0.42, travel: -440, rise: -70, secs: 29, delay: 24 },
  { kind: 'bluebird', x: 1500, y: 262, k: 0.38, travel: 380, rise: -60, secs: 35, delay: 5 },
];

/** Chimney smoke, aligned to the painted rooftops. */
export const CHIMNEYS: { x: number; y: number; k: number }[] = [
  { x: 1368, y: 244, k: 0.3 },
  { x: 1456, y: 258, k: 0.26 },
  { x: 1596, y: 270, k: 0.3 },
  { x: 1712, y: 300, k: 0.26 },
  { x: 1836, y: 372, k: 0.24 },
];

/** Boats on the water: one at the painted jetty, one drifting downstream. */
export const BOATS: { x: number; y: number; k: number; flip?: boolean }[] = [
  { x: 1180, y: 700, k: 0.5 },
  { x: 1690, y: 596, k: 0.42, flip: true },
];

/** An extra garland above the market, to animate the painted village. */
export const BUNTINGS: { x: number; y: number; k: number }[] = [
  { x: 1468, y: 336, k: 0.42 },
];
