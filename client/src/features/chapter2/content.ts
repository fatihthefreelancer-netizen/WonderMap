/**
 * World 1 · Chapter 2 — "Why do people pay money?"
 *
 * Structure only: who appears, which answer is right, what each thing costs.
 * Every word lives in `copy.ts` so the chapter reads naturally in all three
 * languages. Screen numbering follows the build spec (2.0 … 2.9).
 *
 * Where the spec names an object the illustrator didn't draw, the nearest
 * illustrated thing stands in — the swaps are listed in README terms at the
 * bottom of this file.
 */

export type ValueKind = 'thing' | 'help' | 'knowledge';

/** 2.1 — one of the three "most valuable right now" scenes. */
export interface ChoiceScene {
  id: string;
  /** background illustration under the scene */
  bg: 'track' | 'mountain' | 'party';
  /** who is asking, and the pose they hold while waiting */
  who: string;
  correct: string;
  /** item ids; order is shuffled at runtime */
  options: string[];
}

export const CHOICE_SCENES: ChoiceScene[] = [
  { id: 'a', bg: 'track', who: 'adam', correct: 'water', options: ['water', 'blanket', 'backpack', 'medal'] },
  { id: 'b', bg: 'mountain', who: 'maya', correct: 'blanket', options: ['blanket', 'water', 'map', 'balloons'] },
  { id: 'c', bg: 'party', who: 'rayan', correct: 'balloons', options: ['balloons', 'blanket', 'water', 'toolbox'] },
];

/** 2.3 — sellers the child judges one at a time. */
export interface JudgeCard {
  id: string;
  who: string;
  item: string;
  /** true when the seller is offering real value */
  pay: boolean;
}

export const JUDGE_CARDS: JudgeCard[] = [
  { id: 'lina', who: 'farmer', item: 'apples', pay: true },
  { id: 'puff', who: 'puff', item: 'jars', pay: false },
  { id: 'hassan', who: 'hassan', item: 'music', pay: true },
  { id: 'zaid', who: 'zaid', item: 'carwash', pay: true },
  { id: 'drip', who: 'drip', item: 'brokenumbrella', pay: false },
  { id: 'ines', who: 'ines', item: 'dog', pay: true },
];

/** 2.4 — six offers sorted into three baskets. */
export interface SortCard {
  id: string;
  item: string;
  bucket: ValueKind;
}

export const SORT_CARDS: SortCard[] = [
  { id: 'apples', item: 'apples', bucket: 'thing' },
  { id: 'bread', item: 'bread', bucket: 'thing' },
  { id: 'carwash', item: 'carwash', bucket: 'help' },
  { id: 'dogwalk', item: 'dog', bucket: 'help' },
  { id: 'piano', item: 'music', bucket: 'knowledge' },
  { id: 'swim', item: 'ui-drops', bucket: 'knowledge' },
];

export const BUCKETS: ValueKind[] = ['thing', 'help', 'knowledge'];

/** 2.5 — three offers ordered from small help to big help. */
export interface OrderCard {
  id: string;
  item: string;
  /** what people pay for it, revealed after a correct order */
  price: number;
}

/** Array order is the correct answer: small help first. */
export const ORDER_CARDS: OrderCard[] = [
  { id: 'drink', item: 'water', price: 1 },
  { id: 'bike', item: 'toolbox', price: 10 },
  { id: 'roof', item: 'wood', price: 100 },
];

/* -------------------------------------------------------------------------- */
/*                        2.6 — the Problem Solver stall                       */
/* -------------------------------------------------------------------------- */

export interface Offer {
  id: string;
  item: string;
  kind: ValueKind;
  price: number;
}

export const OFFERS: Offer[] = [
  { id: 'water', item: 'water', kind: 'thing', price: 1 },
  { id: 'blanket', item: 'blanket', kind: 'thing', price: 1 },
  { id: 'bread', item: 'bread', kind: 'thing', price: 1 },
  { id: 'milk', item: 'milk', kind: 'thing', price: 1 },
  { id: 'fix', item: 'toolbox', kind: 'help', price: 2 },
  { id: 'teach', item: 'music', kind: 'knowledge', price: 3 },
];

export interface Customer {
  id: string;
  /** a Chapter 1 villager, drawn from `/chapter/who-*.png` */
  look: string;
  wants: string;
}

/** Eight customers; every one can be served, so the round always pays 14. */
export const CUSTOMERS: Customer[] = [
  { id: 'karim', look: 'fisher', wants: 'water' },
  { id: 'salma', look: 'weaver', wants: 'blanket' },
  { id: 'omar', look: 'woodman', wants: 'bread' },
  { id: 'rania', look: 'poultry', wants: 'fix' },
  { id: 'mehdi', look: 'smith', wants: 'milk' },
  { id: 'hind', look: 'farmer', wants: 'teach' },
  { id: 'yassin', look: 'baker', wants: 'fix' },
  { id: 'driss', look: 'dairy', wants: 'teach' },
];

/** Total the stall pays out when every customer is served correctly. */
export const STALL_TOTAL = CUSTOMERS.reduce(
  (sum, c) => sum + (OFFERS.find((o) => o.id === c.wants)?.price ?? 0),
  0,
);

/** Stars by number of wrong offers, as in Chapter 1. */
export const STAR_THRESHOLDS = { three: 1, two: 3 };

export function starsFor(mistakes: number): number {
  if (mistakes <= STAR_THRESHOLDS.three) return 3;
  if (mistakes <= STAR_THRESHOLDS.two) return 2;
  return 1;
}

/** 2.8 — recap quiz. Index of the correct option; options shuffle at runtime. */
export const QUIZ_ANSWERS = [0, 0, 0, 0];
export const QUIZ_COUNT = 4;

/*
 * Stand-ins, because the illustration set has no cake, soccer ball, fancy suit,
 * ice cream, fan, toothbrush, lemonade or working umbrella:
 *   cake → balloons (the birthday scene now lacks decorations, not cake)
 *   soccer ball / fancy suit → backpack, medal
 *   ice cream / fan → map, balloons
 *   toothbrush → toolbox
 *   lemonade → apples (Lina sells fruit, as she did in Chapter 1)
 *   umbrella offer → milk (Mehdi's little brother is thirsty, not rained on)
 *   book → sheet music, which the piano teacher already carries
 */
