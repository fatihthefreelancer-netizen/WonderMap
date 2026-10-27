import type { SimulationDef } from './types';
import { customerRushDemo } from './demo';

/** Registry of playable simulations, keyed by the lesson's `minigame` id. */
export const SIMULATIONS: Record<string, SimulationDef> = {
  'customer-rush': customerRushDemo,
};

export function simulationFor(id: string): SimulationDef | undefined {
  return SIMULATIONS[id];
}

/** Recurring customer portraits (emoji placeholders + accent colours). */
export interface Portrait {
  emoji: string;
  color: string;
}

export const PORTRAITS: Record<string, Portrait> = {
  reyes: { emoji: '👩', color: '#ff7aa0' },
  chen: { emoji: '🧔', color: '#4bb8f0' },
  sarah: { emoji: '👧', color: '#d98cff' },
  cafe: { emoji: '👨‍🍳', color: '#ff8a45' },
  grandpa: { emoji: '👴', color: '#c98a52' },
  emma: { emoji: '👩‍🏫', color: '#7dc242' },
  omar: { emoji: '👨', color: '#f0b752' },
  principal: { emoji: '🧑‍💼', color: '#7c8cff' },
  milo: { emoji: '🧑‍🔧', color: '#4bb8f0' },
};

export function portrait(key: string): Portrait {
  return PORTRAITS[key] ?? { emoji: '🙂', color: '#7c8cff' };
}
