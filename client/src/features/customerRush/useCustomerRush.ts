import { useEffect, useMemo, useReducer } from 'react';
import type { CustomerDef, ItemDef, SimulationDef } from '../../content/customerRush/types';
import { DEFAULT_REACTIONS, pick } from '../../content/customerRush/reactions';

/* ------------------------------ state model ------------------------------- */

export type Status = 'ready' | 'running' | 'finished';
export type CustomerPhase = 'enter' | 'ask' | 'deliver' | 'react' | 'leave';
export type Outcome = 'correct' | 'poor' | 'high' | 'wrong' | null;

export interface ComboEvent {
  label: string;
  title: string;
  bonusCoins: number;
}

export interface State {
  status: Status;
  timeLeft: number;
  order: number[]; // indices into sim.customers
  qIndex: number;
  cphase: CustomerPhase;
  selectedItemId: string | null;
  outcome: Outcome;
  reactionText: string;
  attemptsWrong: number;
  coins: number;
  xp: number;
  helped: number;
  correct: number; // first-try-correct or high-quality
  streak: number;
  maxStreak: number;
  comboEvent: ComboEvent | null;
  bestCombo: ComboEvent | null;
  flyKey: number; // increments on each reward (drives coin-fly)
  shakeKey: number; // increments on wrong answer (drives shake)
}

type Action =
  | { type: 'START' }
  | { type: 'CHOOSE'; sim: SimulationDef; itemId: string }
  | { type: 'PHASE'; phase: CustomerPhase }
  | { type: 'NEXT'; sim: SimulationDef }
  | { type: 'TICK' }
  | { type: 'CLEAR_COMBO' };

function shuffled(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function reward(sim: SimulationDef, c: CustomerDef, kind: 'correct' | 'poor' | 'high') {
  return c.rewards?.[kind] ?? sim.rewards[kind];
}

function reactions(sim: SimulationDef, c: CustomerDef) {
  return {
    ...DEFAULT_REACTIONS,
    ...(sim.reactions ?? {}),
    ...(c.reactions ?? {}),
  };
}

function initial(sim: SimulationDef): State {
  return {
    status: 'ready',
    timeLeft: sim.durationSeconds,
    order: sim.customers.map((_, i) => i),
    qIndex: 0,
    cphase: 'enter',
    selectedItemId: null,
    outcome: null,
    reactionText: '',
    attemptsWrong: 0,
    coins: 0,
    xp: 0,
    helped: 0,
    correct: 0,
    streak: 0,
    maxStreak: 0,
    comboEvent: null,
    bestCombo: null,
    flyKey: 0,
    shakeKey: 0,
  };
}

function applyCombo(sim: SimulationDef, s: State, newStreak: number): Partial<State> {
  const rule = sim.comboRules.find((r) => r.streak === newStreak);
  if (!rule) return { streak: newStreak, maxStreak: Math.max(s.maxStreak, newStreak) };
  return {
    streak: newStreak,
    maxStreak: Math.max(s.maxStreak, newStreak),
    coins: s.coins + rule.bonusCoins,
    comboEvent: rule,
    bestCombo: rule,
  };
}

function makeReducer(sim: SimulationDef) {
  return function reducer(s: State, a: Action): State {
    switch (a.type) {
      case 'START':
        return { ...initial(sim), status: 'running', order: shuffled(sim.customers.length) };

      case 'TICK': {
        if (s.status !== 'running') return s;
        const t = s.timeLeft - 1;
        if (t <= 0) return { ...s, timeLeft: 0, status: 'finished' };
        return { ...s, timeLeft: t };
      }

      case 'CHOOSE': {
        if (s.status !== 'running' || s.cphase !== 'ask') return s;
        const cust = sim.customers[s.order[s.qIndex]];
        const r = reactions(sim, cust);

        // Quality mode: two versions of the same object.
        if (cust.quality) {
          const isHigh = a.itemId === cust.quality.highItemId;
          const kind = isHigh ? 'high' : 'poor';
          const rw = reward(sim, cust, kind);
          const base: State = {
            ...s,
            selectedItemId: a.itemId,
            outcome: kind,
            reactionText: pick(isHigh ? r.high : r.poor),
            coins: s.coins + rw.coins,
            xp: s.xp + rw.xp,
            helped: s.helped + 1,
            correct: s.correct + (isHigh ? 1 : 0),
            flyKey: s.flyKey + 1,
            cphase: 'deliver',
          };
          // high quality keeps the combo alive; poor quality breaks it
          if (isHigh) return { ...base, ...applyCombo(sim, base, s.streak + 1) };
          return { ...base, streak: 0 };
        }

        // Match mode.
        if (a.itemId === cust.correctItemId) {
          const rw = reward(sim, cust, 'correct');
          const perfect = s.attemptsWrong === 0;
          const base: State = {
            ...s,
            selectedItemId: a.itemId,
            outcome: 'correct',
            reactionText: pick(r.happy),
            coins: s.coins + rw.coins,
            xp: s.xp + rw.xp,
            helped: s.helped + 1,
            correct: s.correct + (perfect ? 1 : 0),
            flyKey: s.flyKey + 1,
            cphase: 'deliver',
          };
          if (perfect) return { ...base, ...applyCombo(sim, base, s.streak + 1) };
          return { ...base, streak: 0 };
        }

        // Wrong — polite reaction, stay for another try.
        return {
          ...s,
          outcome: 'wrong',
          reactionText: pick(r.wrong),
          attemptsWrong: s.attemptsWrong + 1,
          shakeKey: s.shakeKey + 1,
        };
      }

      case 'PHASE':
        return { ...s, cphase: a.phase };

      case 'CLEAR_COMBO':
        return { ...s, comboEvent: null };

      case 'NEXT': {
        if (s.status !== 'running') return s;
        let order = s.order;
        let qIndex = s.qIndex + 1;
        if (qIndex >= order.length) {
          if (sim.loop) {
            order = [...order, ...shuffled(sim.customers.length)];
          } else {
            return { ...s, status: 'finished' };
          }
        }
        return {
          ...s,
          order,
          qIndex,
          cphase: 'enter',
          selectedItemId: null,
          outcome: null,
          reactionText: '',
          attemptsWrong: 0,
          comboEvent: null,
        };
      }

      default:
        return s;
    }
  };
}

/* -------------------------------- the hook -------------------------------- */

export function useCustomerRush(sim: SimulationDef) {
  const reducer = useMemo(() => makeReducer(sim), [sim]);
  const [state, dispatch] = useReducer(reducer, sim, initial);

  // 1-second countdown while running.
  useEffect(() => {
    if (state.status !== 'running') return;
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(id);
  }, [state.status]);

  // Timed customer-phase choreography (enter → ask → deliver → react → leave → next).
  useEffect(() => {
    if (state.status !== 'running') return;
    const timings: Partial<Record<CustomerPhase, () => void>> = {
      enter: () => dispatch({ type: 'PHASE', phase: 'ask' }),
      deliver: () => dispatch({ type: 'PHASE', phase: 'react' }),
      react: () => dispatch({ type: 'PHASE', phase: 'leave' }),
      leave: () => dispatch({ type: 'NEXT', sim }),
    };
    const delay: Partial<Record<CustomerPhase, number>> = {
      enter: 650,
      deliver: 1300,
      react: 1500,
      leave: 500,
    };
    const fn = timings[state.cphase];
    if (!fn) return; // 'ask' waits for the player
    const t = setTimeout(fn, delay[state.cphase]);
    return () => clearTimeout(t);
  }, [state.cphase, state.qIndex, state.status, sim]);

  // Auto-dismiss a combo celebration.
  useEffect(() => {
    if (!state.comboEvent) return;
    const t = setTimeout(() => dispatch({ type: 'CLEAR_COMBO' }), 1600);
    return () => clearTimeout(t);
  }, [state.comboEvent]);

  const current: CustomerDef | null =
    state.status === 'ready' ? null : sim.customers[state.order[state.qIndex]] ?? null;

  const itemById = useMemo(() => {
    const m = new Map<string, ItemDef>();
    sim.items.forEach((i) => m.set(i.id, i));
    return m;
  }, [sim]);

  const options: ItemDef[] = useMemo(() => {
    if (!current) return [];
    if (current.quality) {
      return [current.quality.poorItemId, current.quality.highItemId]
        .map((id) => itemById.get(id))
        .filter(Boolean) as ItemDef[];
    }
    const ids = current.options ?? sim.defaultOptions;
    return ids.map((id) => itemById.get(id)).filter(Boolean) as ItemDef[];
  }, [current, itemById, sim.defaultOptions]);

  return {
    state,
    current,
    options,
    itemById,
    start: () => dispatch({ type: 'START' }),
    choose: (itemId: string) => dispatch({ type: 'CHOOSE', sim, itemId }),
  };
}
