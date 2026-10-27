/**
 * Customer Rush — reusable, data-driven workshop simulation.
 * Future lessons are authored purely as `SimulationDef` data; no new code.
 */

export type QualityLevel = 'poor' | 'high';

export interface ItemDef {
  id: string;
  name: string;
  /** key into the item illustration registry (swap for real art later) */
  illustration: string;
  category?: string;
  qualityLevel?: QualityLevel;
}

export interface Reward {
  coins: number;
  xp: number;
}

/** Randomised response pools; per-customer values override the defaults. */
export interface ReactionPools {
  happy: string[];
  wrong: string[];
  poor: string[];
  high: string[];
}

export interface QualityChoice {
  /** the base object both variants represent (for the prompt) */
  poorItemId: string;
  highItemId: string;
}

export interface CustomerDef {
  id: string;
  name: string;
  /** emoji/portrait key (see portraits registry) */
  portrait: string;
  color?: string;
  /** the problem, phrased as a need — usually NOT naming the object */
  dialogue: string;
  /** MATCH mode: the correct item id among the shown options */
  correctItemId?: string;
  /** item ids to show for this customer; falls back to sim.defaultOptions */
  options?: string[];
  /** QUALITY mode: two versions of the same object instead of different objects */
  quality?: QualityChoice;
  /** per-customer reward overrides */
  rewards?: { correct?: Reward; poor?: Reward; high?: Reward };
  /** per-customer reaction overrides */
  reactions?: Partial<ReactionPools>;
}

export interface ComboRule {
  streak: number;
  label: string; // e.g. "3 Happy Customers!"
  title: string; // e.g. "Amazing!"
  bonusCoins: number;
}

export interface SimulationDef {
  id: string;
  title: string;
  durationSeconds: number;
  /** item catalogue referenced by id */
  items: ItemDef[];
  /** customer queue (recycled with shuffle when `loop` and queue empties) */
  customers: CustomerDef[];
  /** default item ids shown when a customer doesn't specify options */
  defaultOptions: string[];
  comboRules: ComboRule[];
  rewards: { correct: Reward; poor: Reward; high: Reward };
  reactions?: Partial<ReactionPools>;
  /** one-sentence reflection shown on the summary screen */
  lessonObjective: string;
  loop?: boolean;
  badge?: string;
}

/** Resolved per-customer view the engine renders. */
export type CustomerMode = 'match' | 'quality';
