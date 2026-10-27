import type { ReactionPools } from './types';

/** Default response pools; customers/simulations can override any field. */
export const DEFAULT_REACTIONS: ReactionPools = {
  happy: [
    'Perfect!',
    'Exactly what I needed!',
    'This is wonderful!',
    'Thank you so much!',
    'This will help a lot!',
    'Oh, you understood me!',
  ],
  wrong: [
    "Hmm… that's not what I need.",
    "I'm actually looking for something else.",
    "That won't solve my problem.",
    'Not quite — let me explain again.',
  ],
  poor: ['It works… but it doesn\'t look very strong.', 'Hmm, this feels a bit wobbly.'],
  high: ['This looks sturdy! I\'d happily pay for this.', 'Wonderful craftsmanship — worth every coin!'],
};

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
