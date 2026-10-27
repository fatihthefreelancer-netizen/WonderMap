import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JUDGE_CARDS } from './content';
import { Big, Bubble, Face, Item, useCh2Copy } from './pieces';

/**
 * 2.3 — "Would you pay?"
 *
 * Six sellers, one at a time. Four of them offer something that really helps;
 * two offer a thing nobody needs (a jar of air, a leaking umbrella). The child
 * judges, and the feedback explains *why* rather than just marking it.
 */

export function BinaryJudge({ onDone }: { onDone: (mistakes: number) => void }) {
  const copy = useCh2Copy();
  const [k, setK] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const card = JUDGE_CARDS[k];
  const judged = answer !== null;
  const right = judged && answer === card.pay;

  function judge(pay: boolean) {
    if (judged) return;
    setAnswer(pay);
    if (pay !== card.pay) setMistakes((m) => m + 1);
  }

  function next() {
    if (k === JUDGE_CARDS.length - 1) onDone(mistakes);
    else {
      setK(k + 1);
      setAnswer(null);
    }
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-end px-3 pb-3 pt-[5.5rem] sm:px-5 sm:pb-5">
      {/* ----------------------------- the seller ---------------------------- */}
      <div className="relative flex min-h-0 w-full flex-1 flex-col items-center justify-end pb-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={card.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ type: 'spring', stiffness: 240, damping: 24 }}
            className="flex h-full w-full flex-col items-center justify-end"
          >
            <Bubble tone={judged ? (card.pay ? 'yes' : 'no') : 'plain'} className="mb-2 shrink-0">
              {copy.judge.pitch[card.id]}
            </Bubble>
            <div className="relative flex min-h-[120px] flex-1 items-end justify-center">
              {/* a frosted pane lifts the seller off the painted market */}
              <div
                className="absolute inset-x-[-16%] -top-[3%] bottom-[-2%] rounded-[40px]"
                style={{
                  backdropFilter: 'blur(7px)',
                  WebkitBackdropFilter: 'blur(7px)',
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,250,238,0.34) 72%, rgba(255,250,238,0))',
                  boxShadow: '0 12px 34px -16px rgba(16,40,20,0.5)',
                }}
              />
              <Face
                look={card.who}
                happy={right && card.pay}
                className="relative h-full max-h-[480px] w-auto max-w-none drop-shadow-[0_16px_26px_rgba(16,40,20,0.4)]"
              />
              {/* what they are selling, held out beside them */}
              <div className="absolute -end-10 bottom-[10%] z-10 h-[clamp(48px,9vh,96px)] w-[clamp(48px,9vh,96px)] drop-shadow-md sm:-end-16">
                <Item item={card.item} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ------------------------------ the call ----------------------------- */}
      <div className="pointer-events-auto w-full max-w-2xl rounded-[28px] bg-white/95 p-4 shadow-hud-lg backdrop-blur-sm sm:p-5">
        <div className="mb-3 flex items-center justify-center gap-1.5">
          {JUDGE_CARDS.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${
                i < k ? 'w-2 bg-[#5fc14e]' : i === k ? 'w-6 bg-[#3aa9e8]' : 'w-2 bg-[#dde3ec]'
              }`}
            />
          ))}
        </div>

        {!judged ? (
          <>
            <p className="text-center font-display text-[13px] font-extrabold text-[#5b7290] sm:text-sm">
              {copy.judge.intro}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => judge(true)}
                className="rounded-2xl border-[3px] border-[#bfe8ab] bg-[#f2fbed] px-3 py-3.5 font-display text-sm font-extrabold text-[#2d6a31] sm:text-base"
              >
                {copy.judge.pay}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => judge(false)}
                className="rounded-2xl border-[3px] border-[#f3c9c9] bg-[#fdf3f3] px-3 py-3.5 font-display text-sm font-extrabold text-[#a33a3a] sm:text-base"
              >
                {copy.judge.no}
              </motion.button>
            </div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <p
              className={`text-pretty rounded-2xl px-4 py-3 text-center font-display text-[14px] font-extrabold leading-snug sm:text-[15px] ${
                card.pay ? 'bg-[#eafbe4] text-[#2d6a31]' : 'bg-[#fff6e0] text-[#8a5f1a]'
              }`}
            >
              {copy.judge.feedback[card.id]}
            </p>
            <div className="mt-3 flex justify-center">
              <Big tone={right ? 'grass' : 'sky'} onClick={next}>
                {k === JUDGE_CARDS.length - 1 ? copy.judge.next : copy.ui.continue}
              </Big>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
