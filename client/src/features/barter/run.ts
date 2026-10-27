import { useCallback, useMemo, useState } from 'react';
import { sfxCoins } from '../../lib/sfx';
import {
  COINS_PAR_BONUS,
  COINS_PER_PAYMENT,
  COINS_PER_QUIZ,
  COINS_PER_VILLAGE,
} from './par';

/**
 * Everything the learner earns and does across the whole chapter.
 *
 * The board already counted trades and happy villagers; it just threw the
 * numbers away at the end of each village. Keeping them in one place is what
 * lets the chapter pay coins as it goes, award a star per village, tell the
 * truth in the elder's outro ("it took **{trades}**"), and draw the closing
 * comparison between walking the market and paying for things.
 */

export interface VillageResult {
  index: number;
  trades: number;
  happy: number;
  maxHappy: number;
  par: number;
  /** every approach, accepted or refused — the "walking" half of barter */
  steps: number;
  star: boolean;
  hintRung: number;
}

export interface RunState {
  coins: number;
  villages: VillageResult[];
  /** payments made in the coin chain */
  payments: number;
  quizRight: number;
  /** bumped on every coin award so the purse can animate */
  flyKey: number;
  /** which money the learner picked first in the invent beat */
  inventTried: string[];
  /**
   * Notebook pages written so far, in the order they were written.
   *
   * This lives in the run rather than in a component so that resuming a
   * half-finished chapter brings the learner's pages back with it — the
   * notebook is the one thing they are meant to be able to open at any point,
   * and an empty one after a resume would read as having lost the work.
   */
  notes: string[];
}

const EMPTY: RunState = {
  coins: 0,
  villages: [],
  payments: 0,
  quizRight: 0,
  flyKey: 0,
  inventTried: [],
  notes: [],
};

export function useChapterRun(initial?: Partial<RunState>) {
  const [state, setState] = useState<RunState>({ ...EMPTY, ...initial });

  const award = useCallback((coins: number) => {
    // the purse was moving in silence; a coin you cannot hear is a coin the
    // child does not notice they earned
    if (coins > 0) sfxCoins(coins);
    setState((s) => ({ ...s, coins: s.coins + coins, flyKey: s.flyKey + 1 }));
  }, []);

  /**
   * Per-trade coins are paid the moment the trade lands, not here — the point
   * of the economy is that the child sees the purse move while they play.
   * This adds only what finishing is worth.
   */
  const finishVillage = useCallback((r: VillageResult) => {
    setState((s) => {
      const coins = COINS_PER_VILLAGE + (r.star ? COINS_PAR_BONUS : 0);
      sfxCoins(coins);
      return {
        ...s,
        coins: s.coins + coins,
        flyKey: s.flyKey + 1,
        villages: [...s.villages.filter((v) => v.index !== r.index), r].sort(
          (a, b) => a.index - b.index,
        ),
      };
    });
  }, []);

  const payment = useCallback(() => {
    sfxCoins(COINS_PER_PAYMENT);
    setState((s) => ({
      ...s,
      payments: s.payments + 1,
      coins: s.coins + COINS_PER_PAYMENT,
      flyKey: s.flyKey + 1,
    }));
  }, []);

  const quizCorrect = useCallback(() => {
    sfxCoins(COINS_PER_QUIZ);
    setState((s) => ({
      ...s,
      quizRight: s.quizRight + 1,
      coins: s.coins + COINS_PER_QUIZ,
      flyKey: s.flyKey + 1,
    }));
  }, []);

  const writeNote = useCallback((key: string) => {
    setState((s) => (s.notes.includes(key) ? s : { ...s, notes: [...s.notes, key] }));
  }, []);

  const tried = useCallback((id: string) => {
    setState((s) =>
      s.inventTried.includes(id) ? s : { ...s, inventTried: [...s.inventTried, id] },
    );
  }, []);

  const totals = useMemo(() => {
    const v = state.villages;
    return {
      trades: v.reduce((n, x) => n + x.trades, 0),
      /** every approach across every village — what barter actually costs */
      steps: v.reduce((n, x) => n + x.steps, 0),
      happy: v.reduce((n, x) => n + x.happy, 0),
      hints: v.reduce((n, x) => n + (x.hintRung > 0 ? 1 : 0), 0),
      stars: v.filter((x) => x.star).length,
    };
  }, [state.villages]);

  return {
    state,
    setState,
    award,
    finishVillage,
    payment,
    quizCorrect,
    tried,
    writeNote,
    totals,
  };
}
