import type { LearnerTier } from '@wondermap/shared';

/**
 * A lesson's story is an ordered list of Beats. The StoryPlayer walks through
 * them; each beat type maps to one interactive UI moment. Keep every text field
 * short — the philosophy is Story → Decision → Consequence → tiny explanation →
 * practice → reward, never long paragraphs.
 */

export interface ChoiceOption {
  label: string;
  /** who reacts, shown as a small speaker chip on the feedback */
  speaker?: string;
  /** one-line reaction after tapping */
  feedback?: string;
  /** the winning option in a retry-style choice */
  success?: boolean;
  /** increments the on-screen counter when tapped */
  tick?: boolean;
}

export interface PredictOption {
  label: string;
  correct?: boolean;
  feedback: string;
}

export interface SortItem {
  label: string;
  answer: 'charge' | 'help';
  reason: string;
}

export type Beat =
  | { kind: 'narration'; text: string; sepia?: boolean; tap?: string }
  | { kind: 'line'; speaker: string; text: string; tap?: string }
  | { kind: 'concept'; title?: string; cards: { icon: string; text: string }[] }
  | { kind: 'big'; text: string; sub?: string }
  | { kind: 'choice'; prompt?: string; options: ChoiceOption[]; counter?: boolean }
  | { kind: 'predict'; prompt: string; options: PredictOption[] }
  | { kind: 'sort'; prompt: string; items: SortItem[] }
  | { kind: 'mirror'; prompt: string; bankKey: string; options: string[] }
  | { kind: 'notebook'; term: string }
  | { kind: 'badge'; badge: string }
  | { kind: 'reward' };

export interface Scene {
  id: string;
  /** counter label, e.g. "Trades so far" for the barter chain */
  counterLabel?: string;
  build: (tier: LearnerTier) => Beat[];
}
