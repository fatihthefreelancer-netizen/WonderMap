import { motion, AnimatePresence } from 'framer-motion';
import type { CustomerDef } from '../../content/customerRush/types';
import type { CustomerPhase, Outcome } from './useCustomerRush';
import { portrait } from '../../content/customerRush';
import { useTc } from '../../i18n/useTc';

interface Props {
  customer: CustomerDef;
  phase: CustomerPhase;
  outcome: Outcome;
  reactionText: string;
  shakeKey: number;
}

const MOOD: Record<string, string> = {
  correct: '😄',
  high: '🤩',
  poor: '🙂',
  wrong: '🤔',
};

export function CustomerStage({ customer, phase, outcome, reactionText, shakeKey }: Props) {
  const { tc } = useTc();
  const p = portrait(customer.portrait);
  const leaving = phase === 'leave';
  const happy = outcome === 'correct' || outcome === 'high';
  // A wrong answer keeps us in 'ask' (retry) but should still show the polite reaction.
  const showReaction = phase === 'react' || (phase === 'ask' && outcome === 'wrong');
  const mood = showReaction && outcome ? MOOD[outcome] : phase === 'ask' ? '💬' : '';

  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence initial={false}>
        <motion.div
          key={customer.id}
          initial={{ x: 160, opacity: 0, scale: 0.8 }}
          animate={
            leaving
              ? { x: happy ? -180 : 180, opacity: 0, scale: 0.85 }
              : { x: 0, opacity: 1, scale: 1 }
          }
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          className="flex flex-col items-center"
        >
          {/* portrait */}
          <motion.div
            key={shakeKey}
            animate={outcome === 'wrong' ? { x: [0, -8, 8, -6, 6, 0] } : undefined}
            transition={{ duration: 0.4 }}
            className="relative grid h-24 w-24 place-items-center rounded-full ring-4 ring-white"
            style={{ background: `${p.color}26` }}
          >
            <span className="animate-bob text-6xl" style={{ display: 'inline-block' }}>
              {p.emoji}
            </span>
            {mood && (
              <span className="absolute -right-1 -top-1 grid h-8 w-8 place-items-center rounded-full bg-white text-lg shadow-soft">
                {mood}
              </span>
            )}
          </motion.div>
          <span
            className="mt-2 rounded-full bg-white px-3 py-0.5 text-sm font-extrabold shadow-soft"
            style={{ color: p.color }}
          >
            {customer.name}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* speech / reaction bubble */}
      <div className="mt-3 min-h-[92px] w-full max-w-sm">
        <AnimatePresence initial={false}>
          {(phase === 'ask' || phase === 'react') && (
            <motion.div
              key={phase + String(outcome) + reactionText}
              initial={{ y: 12, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className={`relative rounded-3xl px-5 py-4 text-center font-bold shadow-pop ${
                showReaction
                  ? happy
                    ? 'bg-grass-light/40 text-[#2f6b26]'
                    : outcome === 'wrong'
                      ? 'bg-coin/25 text-[#7a5a10]'
                      : 'bg-sky-soft/50 text-[#1f3a5f]'
                  : 'bg-white text-[#1f3a5f]'
              }`}
            >
              <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-inherit" />
              {showReaction ? tc(reactionText) : tc(customer.dialogue)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
