import type { WorldTheme } from '@wondermap/shared';

export interface ThemePalette {
  /** vertical sky gradient (top → bottom, horizon is the second stop) */
  sky: [string, string];
  /** ground base + highlight for the rolling meadow */
  ground: [string, string];
  /** water / river tint */
  water: string;
  /** primary foliage / accent */
  accent: string;
  accentDark: string;
  /** trail / path base color */
  path: string;
  /** ambient particle color */
  particle: string;
  emoji: string;
}

export const THEME: Record<WorldTheme, ThemePalette> = {
  forest: {
    sky: ['#79c9f2', '#cdeefc'], ground: ['#9bda63', '#74bf45'], water: '#59c3e8',
    accent: '#7dc242', accentDark: '#4f8a2b', path: '#e9c891', particle: '#ffffff', emoji: '🌲',
  },
  beach: {
    sky: ['#6fd0f5', '#d6f4ff'], ground: ['#ffe9a8', '#ffd873'], water: '#3fc9e8',
    accent: '#ffcb5b', accentDark: '#e0973a', path: '#f6e2b0', particle: '#fff6d8', emoji: '🏖️',
  },
  snow: {
    sky: ['#a9ddf7', '#eaf8ff'], ground: ['#f4fbff', '#d8ecfa'], water: '#8fd0f0',
    accent: '#bfe3ff', accentDark: '#7fb3e0', path: '#e4f1fb', particle: '#ffffff', emoji: '❄️',
  },
  mountain: {
    sky: ['#86cdf2', '#d6eeff'], ground: ['#bfe08a', '#93bd5f'], water: '#5ec8e0',
    accent: '#9aa6b0', accentDark: '#6b7680', path: '#d9c69b', particle: '#ffffff', emoji: '⛰️',
  },
  jungle: {
    sky: ['#8fe0c0', '#d4f7e6'], ground: ['#7ecb5a', '#4e9c3a'], water: '#39b9a8',
    accent: '#4e9c3a', accentDark: '#2f6b26', path: '#c8b384', particle: '#eaffea', emoji: '🌴',
  },
  city: {
    sky: ['#9dbdf2', '#e0ecff'], ground: ['#c7d2dd', '#a3b1c0'], water: '#6aa0e0',
    accent: '#7c8cff', accentDark: '#4b57c0', path: '#b8c2cf', particle: '#ffffff', emoji: '🏙️',
  },
  space: {
    sky: ['#1b1140', '#3b1f78'], ground: ['#4a3a7a', '#2e2456'], water: '#6a5acd',
    accent: '#b48cff', accentDark: '#7a4fd0', path: '#5a4a8a', particle: '#ffe9a8', emoji: '🚀',
  },
  ocean: {
    sky: ['#79d4f2', '#d4f5ff'], ground: ['#7fd0d8', '#4fa8c0'], water: '#2b9fd8',
    accent: '#38c6d8', accentDark: '#1f8aa0', path: '#a8dfe8', particle: '#e8ffff', emoji: '🌊',
  },
  volcano: {
    sky: ['#ffb894', '#ffe2cf'], ground: ['#7a5a52', '#5a3f38'], water: '#ff6a3a',
    accent: '#ff7a45', accentDark: '#c04a20', path: '#8a6a5a', particle: '#ffcf8a', emoji: '🌋',
  },
  egypt: {
    sky: ['#ffd98a', '#fff2cf'], ground: ['#f0d089', '#d8a94f'], water: '#4fc9d8',
    accent: '#e0b34f', accentDark: '#b07f2a', path: '#e8d09a', particle: '#fff2c8', emoji: '🏜️',
  },
  future: {
    sky: ['#0f2a4a', '#1f4f7a'], ground: ['#2a4a6a', '#1c3450'], water: '#2ce0ff',
    accent: '#2ce0ff', accentDark: '#0f9ac0', path: '#3a5a7a', particle: '#9affff', emoji: '🛸',
  },
  magic: {
    sky: ['#c9a8ff', '#efe2ff'], ground: ['#b98cf0', '#8f5ad0'], water: '#c66aff',
    accent: '#d98cff', accentDark: '#9a4fd0', path: '#e0c8ff', particle: '#fff0ff', emoji: '🏰',
  },
};

export function themeFor(theme: WorldTheme): ThemePalette {
  return THEME[theme] ?? THEME.forest;
}

/* ------------------------------ color helpers ------------------------------ */

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');

/** Blend two hex colors; `t` 0 → a, 1 → b. */
export function mix(a: string, b: string, t: number): string {
  const [r1, g1, b1] = parseHex(a);
  const [r2, g2, b2] = parseHex(b);
  return `#${toHex(r1 + (r2 - r1) * t)}${toHex(g1 + (g2 - g1) * t)}${toHex(b1 + (b2 - b1) * t)}`;
}

/** Lighten toward white by `amount` (0–1). */
export const lighten = (c: string, amount: number) => mix(c, '#ffffff', amount);
/** Darken toward near-black by `amount` (0–1). */
export const darken = (c: string, amount: number) => mix(c, '#10231a', amount);

/**
 * Secondary terrain tones derived from a palette so every world gets the same
 * layered meadow treatment without hand-authoring twelve extra swatches.
 */
export interface TerrainTones {
  grassTop: string;
  grassBottom: string;
  meadowLight: string;
  meadowDark: string;
  hillFar: string;
  shore: string;
  waterDeep: string;
  waterLight: string;
}

export function terrainTones(p: ThemePalette): TerrainTones {
  const [g1, g2] = p.ground;
  return {
    grassTop: lighten(g1, 0.08),
    grassBottom: darken(g2, 0.08),
    meadowLight: lighten(g1, 0.3),
    meadowDark: darken(g2, 0.2),
    hillFar: mix(darken(g2, 0.22), p.sky[1], 0.28),
    shore: mix(p.path, '#ffffff', 0.35),
    waterDeep: darken(p.water, 0.22),
    waterLight: lighten(p.water, 0.45),
  };
}
