import type { GoodKey, Scenario, Villager } from './content';

/**
 * The shortest way through a market.
 *
 * A merchant trades only when they want what you are holding, so a puzzle is a
 * little graph: from the thing in your hands, every merchant who wants it is a
 * door, and behind each door is whatever they were holding. Finding the best
 * route is a breadth-first search over (what I'm carrying, who I've already
 * traded with) — tiny, since no puzzle has more than six merchants, and exact,
 * so `par` is a real "fewest possible", not a hand-counted guess.
 *
 * It also tells us, for free, when there is no route at all. That is Market
 * Day: you are holding wood and not one person in the square wants wood.
 */

export interface QuestAnalysis {
  /** fewest trades from `carry` to `goal`; 0 when unreachable */
  par: number;
  /** the merchants to visit, in order */
  path: string[];
  /** false when no chain exists — the whole point of the last puzzle */
  solvable: boolean;
}

export function analyse(sc: Scenario): QuestAnalysis {
  const people = sc.people;
  type Node = { held: GoodKey; used: number; path: string[] };
  const seen = new Set<string>([`${sc.carry}|0`]);
  const queue: Node[] = [{ held: sc.carry, used: 0, path: [] }];

  while (queue.length) {
    const node = queue.shift()!;
    if (node.held === sc.goal) {
      return { par: node.path.length, path: node.path, solvable: true };
    }
    people.forEach((m, i) => {
      const bit = 1 << i;
      if (node.used & bit) return;
      // the one rule: they trade only if they want what you are carrying
      if (m.need !== node.held) return;
      const key = `${m.has}|${node.used | bit}`;
      if (seen.has(key)) return;
      seen.add(key);
      queue.push({ held: m.has, used: node.used | bit, path: [...node.path, m.id] });
    });
  }

  return { par: 0, path: [], solvable: false };
}

/** Who, right now, would take what you are holding? */
export function willingMerchants(people: Villager[], carrying: GoodKey, done: string[]) {
  return people.filter((m) => !done.includes(m.id) && m.need === carrying);
}

/** Coins for finishing a puzzle, before the par bonus. */
export const COINS_PER_TRADE = 1;
export const COINS_PER_VILLAGE = 5;
export const COINS_PAR_BONUS = 5;
export const COINS_PER_PAYMENT = 1;
export const COINS_PER_QUIZ = 3;

/**
 * A star is for taking the shortest route without being told it — walking into
 * refusals is free, but it costs you the star, which is exactly the pressure
 * the chapter wants.
 */
export function earnedStar(trades: number, par: number, usedFullHint: boolean) {
  return par > 0 && trades <= par && !usedFullHint;
}

/**
 * How much daylight a puzzle is worth. Par plus a little slack, so a learner
 * who takes a couple of wrong turns still finishes in the light, and one who
 * wanders really does watch the sun go down.
 */
export function daylightBudget(par: number) {
  return Math.max(3, par + 3);
}
