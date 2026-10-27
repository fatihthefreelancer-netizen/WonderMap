/**
 * Where the villagers stand.
 *
 * The old version laid them out on a fixed grid — two rows once there were
 * more than four — and expressed everything as a fraction of a scene box whose
 * height was then stretched to fill whatever room it was given. That had one
 * stubborn consequence: because the box's height grew in step with a
 * villager's width, making the cast "bigger" by raising the width cap changed
 * nothing at all on screen. The only things that ever moved the needle were
 * the number of rows and the dead space around them.
 *
 * So the measurements now happen in the unit that actually matters — one
 * villager's width — and the stage is *fitted* to the room it has rather than
 * stretched into it. Given the stage's real pixel size we try each sensible
 * number of columns, work out how large a villager could be in each, and take
 * the roomiest. On a wide screen that puts all six traders in a single line,
 * well spaced and half again as large; on a phone it folds them back into the
 * rows that fit. Nothing has to be special-cased for "narrow" any more: a tall
 * thin stage simply makes a tall thin arrangement win.
 */

import { useLayoutEffect, useRef, useState } from 'react';

export interface Spot {
  /** centre of the villager, 0..1 of scene width */
  x: number;
  /** the villager's feet, 0..1 of scene height */
  y: number;
  /** villager width, as a fraction of scene width */
  w: number;
}

export interface Layout {
  pos: Spot[];
  /** width / height for the scene box */
  aspect: number;
  /** body height as a fraction of scene width — the sprite is sized to this */
  bodyH: number;
  /** the stage, in pixels, already fitted to the room it was given */
  boxW: number;
  boxH: number;
  /** one villager's width in pixels — handy for callers that need a real size */
  unit: number;
}

/* All of these are in villager-widths. */

/** a villager is this many times taller than they are wide */
const BODY = 200 / 120;
/** air above the back row, for the wish cloud and whatever they say */
const HEAD = 0.56;
/** clear air between one row's feet and the next row's head */
const ROW_GAP = 0.56;
/** room under the front row's feet for the name plate */
const FOOT = 0.4;
/**
 * Elbow room between two villagers standing side by side.
 *
 * Generous on purpose: each one is a drop target the size of a child's
 * thumb-and-a-half, and traders shoulder to shoulder make a drag ambiguous
 * right at the moment it matters.
 */
const SIDE_GAP = 0.5;
/** air at either end of a row */
const EDGE = 0.26;

interface Shape {
  cols: number;
  rows: number;
  /** stage width and height, in villager-widths */
  W: number;
  H: number;
}

function shape(n: number, cols: number): Shape {
  const rows = Math.ceil(n / cols);
  const widest = Math.min(cols, n);
  return {
    cols,
    rows,
    W: widest + (widest - 1) * SIDE_GAP + 2 * EDGE,
    H: HEAD + BODY + (rows - 1) * (BODY + ROW_GAP) + FOOT,
  };
}

/** The arrangements worth trying, flattest first: one row, then two, then three. */
function arrangements(n: number): number[] {
  const out: number[] = [];
  for (let rows = 1; rows <= Math.min(3, n); rows++) {
    const cols = Math.ceil(n / rows);
    // ceil() can hand back the same split twice (5 over 3 rows is still 2×3)
    if (!out.includes(cols) && Math.ceil(n / cols) === rows) out.push(cols);
  }
  return out.length ? out : [n];
}

export function layout(n: number, stage: { w: number; h: number }): Layout {
  const w = Math.max(0, stage.w);
  const h = Math.max(0, stage.h);

  const options = arrangements(n).map((cols) => {
    const s = shape(n, cols);
    return { ...s, unit: Math.min(w / s.W, h / s.H) };
  });

  // A flatter market reads better and keeps every face at the front, so an
  // extra row has to buy a genuinely larger cast — not three more pixels.
  const best = Math.max(...options.map((o) => o.unit));
  const pick = options.find((o) => o.unit >= best * 0.97) ?? options[0];

  const { cols, rows, W, H, unit } = pick;
  const pos: Spot[] = [];
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / cols);
    const inRow = Math.min(cols, n - r * cols);
    const c = i - r * cols;
    const rowW = inRow + (inRow - 1) * SIDE_GAP;
    // a half-step of stagger on the back rows, so the cast is a crowd in a
    // square rather than a line-up against a wall
    const nudge = rows > 1 && r % 2 ? (1 + SIDE_GAP) * 0.14 : 0;
    const x = (W - rowW) / 2 + c * (1 + SIDE_GAP) + 0.5 + nudge;
    const feet = HEAD + BODY + r * (BODY + ROW_GAP);
    pos.push({ x: x / W, y: feet / H, w: 1 / W });
  }

  return {
    pos,
    aspect: W / H,
    bodyH: BODY / W,
    boxW: unit * W,
    boxH: unit * H,
    unit,
  };
}

/**
 * The room a board has been given, in pixels.
 *
 * `layout()` needs a real measurement rather than a guess at the window, since
 * the market now shares the screen with a rail down one side; measuring on
 * layout (not after paint) keeps the cast from flashing at the wrong size on
 * the first frame.
 */
export function useStage<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      const r = el.getBoundingClientRect();
      setSize((s) =>
        Math.abs(s.w - r.width) < 0.5 && Math.abs(s.h - r.height) < 0.5
          ? s
          : { w: r.width, h: r.height },
      );
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
}
