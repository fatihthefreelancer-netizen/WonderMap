import type { RunState } from './run';

/**
 * Somewhere to put the chapter down and pick it up again.
 *
 * Fifteen minutes of play used to live in a single `useState(0)`, so one stray
 * tap on the close button at minute twelve threw all of it away. The save is
 * deliberately small — which beat, and what has been earned — so a stale one
 * can never corrupt a run; anything it cannot describe simply restarts.
 */

const VERSION = 1;

export interface ChapterSave {
  v: number;
  step: number;
  run: RunState;
  at: number;
}

const key = (chapter: string, userId: string) => `wm:save:${chapter}:${userId}`;

export function readSave(chapter: string, userId: string): ChapterSave | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key(chapter, userId));
    if (!raw) return null;
    const save = JSON.parse(raw) as ChapterSave;
    if (save.v !== VERSION || typeof save.step !== 'number' || !save.run) return null;
    // a save older than a fortnight is a different child's afternoon
    if (Date.now() - save.at > 14 * 24 * 60 * 60 * 1000) return null;
    return save;
  } catch {
    return null;
  }
}

export function writeSave(chapter: string, userId: string, step: number, run: RunState) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(
      key(chapter, userId),
      JSON.stringify({ v: VERSION, step, run, at: Date.now() } satisfies ChapterSave),
    );
  } catch {
    // a full or blocked store is not worth interrupting a lesson over
  }
}

export function clearSave(chapter: string, userId: string) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(key(chapter, userId));
  } catch {
    /* ignore */
  }
}

/** Best run so far, so a replay has something to beat. */
export interface ChapterBest {
  stars: number;
  trades: number;
  coins: number;
}

const bestKey = (chapter: string, userId: string) => `wm:best:${chapter}:${userId}`;

export function readBest(chapter: string, userId: string): ChapterBest | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(bestKey(chapter, userId));
    return raw ? (JSON.parse(raw) as ChapterBest) : null;
  } catch {
    return null;
  }
}

/** Returns true when this run beat the stored best (more stars, or fewer trades). */
export function writeBest(chapter: string, userId: string, next: ChapterBest): boolean {
  const prev = readBest(chapter, userId);
  const better =
    !prev || next.stars > prev.stars || (next.stars === prev.stars && next.trades < prev.trades);
  if (typeof localStorage === 'undefined') return better;
  try {
    if (better) localStorage.setItem(bestKey(chapter, userId), JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return better;
}
