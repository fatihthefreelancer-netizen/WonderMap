/**
 * The designer's illustrated sprite set.
 *
 * Every entry is a trimmed PNG in `public/sprites`, sized exactly as exported so
 * the map can lay art out without measuring at runtime. Animated entries are
 * horizontal strips with a uniform cell, played by stepping the background
 * position (see `.wm-frames` in index.css) — one compositor animation per
 * instance, no JavaScript per frame.
 */

export interface SpriteMeta {
  w: number;
  h: number;
  /** present on strips: number of cells laid out left to right */
  frames?: number;
}

export const SPRITES = {
  /* trees */
  'tree-01': { w: 104, h: 153 },
  'tree-02': { w: 99, h: 139 },
  'tree-03': { w: 91, h: 114 },
  'tree-04': { w: 91, h: 95 },
  'tree-05': { w: 93, h: 121 },
  'tree-06': { w: 102, h: 158 },
  'tree-07': { w: 94, h: 137 },
  'tree-08': { w: 81, h: 104 },
  'pine-01': { w: 93, h: 166 },
  'pine-02': { w: 76, h: 149 },
  /* shrubs and ground cover */
  'bush-01': { w: 56, h: 47 },
  'bush-02': { w: 114, h: 84 },
  'bush-03': { w: 108, h: 90 },
  'bush-04': { w: 134, h: 66 },
  'bush-05': { w: 160, h: 66 },
  /* sky */
  'cloud-01': { w: 220, h: 103 },
  'cloud-02': { w: 216, h: 84 },
  'cloud-03': { w: 210, h: 102 },
  'cloud-04': { w: 194, h: 61 },
  'cloud-05': { w: 55, h: 34 },
  /* water and distance */
  lake: { w: 533, h: 226 },
  'lake-mask': { w: 518, h: 126 },
  'forest-mass': { w: 277, h: 345 },
  'forest-silhouette': { w: 277, h: 345 },
  /* animated strips */
  gull: { w: 67, h: 66, frames: 6 },
  bluebird: { w: 70, h: 63, frames: 6 },
  robin: { w: 77, h: 48, frames: 2 },
  smoke: { w: 90, h: 142, frames: 5 },
  boat: { w: 129, h: 76, frames: 4 },
  'bunting-a': { w: 217, h: 86, frames: 2 },
  'bunting-b': { w: 238, h: 84, frames: 2 },
} as const satisfies Record<string, SpriteMeta>;

export type SpriteName = keyof typeof SPRITES;

/** Lookup widened to the shared shape, so `frames` is readable on any entry. */
export const spriteMeta = (name: SpriteName): SpriteMeta =>
  (SPRITES as Record<SpriteName, SpriteMeta>)[name];

export const spriteUrl = (name: SpriteName) => `/sprites/${name}.webp`;

/** Families the map picks from by seed, so a grove never repeats one tree. */
export const TREE_SPRITES: SpriteName[] = [
  'tree-01', 'tree-02', 'tree-03', 'tree-04', 'tree-05', 'tree-06', 'tree-07', 'tree-08',
];
export const PINE_SPRITES: SpriteName[] = ['pine-01', 'pine-02'];
export const BUSH_SPRITES: SpriteName[] = ['bush-01', 'bush-02', 'bush-03', 'bush-04', 'bush-05'];
export const CLOUD_SPRITES: SpriteName[] = [
  'cloud-01', 'cloud-02', 'cloud-03', 'cloud-04', 'cloud-05',
];
export const BIRD_SPRITES: SpriteName[] = ['gull', 'bluebird', 'robin'];
