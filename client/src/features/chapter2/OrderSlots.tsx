import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ORDER_CARDS } from './content';
import { art, Big, Item, rich, useCh2Copy } from './pieces';

/**
 * 2.5 — "Small help, big help".
 *
 * Three offers go into three slots, from the smallest help to the biggest. The
 * slots read start-to-end, so in Arabic the small end is on the right without
 * any special casing. Getting it right reveals what people actually pay.
 */

const CORRECT = ORDER_CARDS.map((c) => c.id);

export function OrderSlots({ onDone }: { onDone: (mistakes: number) => void }) {
  const copy = useCh2Copy();
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null]);
  const [checked, setChecked] = useState(false);
  const [hinted, setHinted] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  // the tray keeps a fixed order so cards do not jump around under the finger
  const tray = useMemo(() => ORDER_CARDS.filter((c) => !slots.includes(c.id)), [slots]);
  const full = slots.every(Boolean);
  const right = checked && slots.every((id, i) => id === CORRECT[i]);

  function place(id: string) {
    const i = slots.findIndex((s) => !s);
    if (i < 0) return;
    const nextSlots = [...slots];
    nextSlots[i] = id;
    setSlots(nextSlots);
  }

  function lift(i: number) {
    if (right) return;
    const nextSlots = [...slots];
    nextSlots[i] = null;
    setSlots(nextSlots);
    setChecked(false);
  }

  function check() {
    const ok = slots.every((id, i) => id === CORRECT[i]);
    setChecked(true);
    if (!ok) {
      setMistakes((m) => m + 1);
      setHinted(true);
      setTimeout(() => {
        setSlots([null, null, null]);
        setChecked(false);
      }, 1100);
    }
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-end px-3 pb-3 pt-16 sm:px-5 sm:pb-5">
      <div className="pointer-events-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col justify-end pb-3">
        {/* the ramp from small help to big help */}
        <div className="relative">
          <div className="mb-2 flex items-center justify-between gap-2 px-1">
            <span className="rounded-full bg-white/85 px-3 py-1 font-display text-[11px] font-extrabold uppercase tracking-wide text-[#5b7290] shadow-hud backdrop-blur-sm">
              {copy.order.small}
            </span>
            <span className="h-[3px] flex-1 rounded-full bg-gradient-to-r from-white/50 to-white/90" />
            <span className="rounded-full bg-white/85 px-3 py-1 font-display text-[11px] font-extrabold uppercase tracking-wide text-[#2b4a66] shadow-hud backdrop-blur-sm">
              {copy.order.big}
            </span>
          </div>
          <div className="grid grid-cols-3 items-end gap-2 sm:gap-4">
            {slots.map((id, i) => {
              const card = ORDER_CARDS.find((c) => c.id === id);
              const good = checked && id === CORRECT[i];
              const bad = checked && id !== CORRECT[i];
              return (
                <motion.button
                  key={i}
                  onClick={() => id && lift(i)}
                  animate={bad ? { x: [0, -8, 8, -6, 0] } : { x: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ height: `calc(${8 + i * 3}vh + 86px)` }}
                  className={`relative flex flex-col items-center justify-end rounded-[24px] border-[3px] bg-white/95 p-2 shadow-hud backdrop-blur-sm transition-colors ${
                    good
                      ? 'border-[#5fc14e]'
                      : bad
                        ? 'border-[#f3a0a0]'
                        : id
                          ? 'border-white'
                          : 'border-dashed border-[#b9d4e8]'
                  }`}
                >
                  <span className="absolute -top-3 left-1/2 grid h-7 w-7 -translate-x-1/2 place-items-center rounded-full bg-gradient-to-b from-white to-[#eef4fa] font-display text-[13px] font-extrabold text-[#2b4a66] shadow">
                    {i + 1}
                  </span>
                  <AnimatePresence mode="wait">
                    {card ? (
                      <motion.div
                        key={card.id}
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.4, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                        className="flex flex-col items-center"
                      >
                        <div className="h-[clamp(40px,8vh,74px)] w-[clamp(40px,8vh,74px)]">
                          <Item item={card.item} />
                        </div>
                        <span className="mt-1 text-pretty text-center font-display text-[11px] font-extrabold leading-tight text-[#2b4a66] sm:text-[12.5px]">
                          {copy.order.cards[card.id]}
                        </span>
                        {right && (
                          <motion.span
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.12 }}
                            className="mt-1 flex items-center gap-1 rounded-full bg-[#fff2cc] px-2 py-0.5 font-display text-[12px] font-extrabold text-[#8a5f1a]"
                          >
                            <img src={art('item-coin')} alt="" width={13} height={13} />
                            {card.price}
                          </motion.span>
                        )}
                      </motion.div>
                    ) : (
                      <span key="empty" className="pb-3 font-display text-2xl text-[#b9d4e8]">
                        +
                      </span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ------------------------------ the tray ----------------------------- */}
      <div className="pointer-events-auto w-full max-w-3xl rounded-[28px] bg-white/95 p-4 shadow-hud-lg backdrop-blur-sm">
        <p className="text-center font-display text-[13px] font-extrabold text-[#5b7290] sm:text-sm">
          {right ? rich(copy.order.after) : hinted ? copy.order.hint : rich(copy.order.instruction)}
        </p>
        {right && (
          <p className="mt-1 text-center text-[12.5px] font-semibold leading-snug text-[#8296ad]">
            {copy.order.caveat}
          </p>
        )}

        {!right && (
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {tray.map((c) => (
              <motion.button
                key={c.id}
                onClick={() => place(c.id)}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.96 }}
                className="flex w-[clamp(96px,26vw,170px)] items-center gap-2 rounded-2xl border-[3px] border-[#e6edf5] bg-[#f7fafd] p-2 text-start hover:border-[#9fdcff]"
              >
                <div className="h-9 w-9 shrink-0 sm:h-11 sm:w-11">
                  <Item item={c.item} />
                </div>
                <span className="text-pretty font-display text-[11px] font-extrabold leading-tight text-[#2b4a66] sm:text-[12.5px]">
                  {copy.order.cards[c.id]}
                </span>
              </motion.button>
            ))}
          </div>
        )}

        <div className="mt-3 flex justify-center">
          {right ? (
            <Big tone="grass" onClick={() => onDone(mistakes)}>
              {copy.order.next}
            </Big>
          ) : (
            <Big disabled={!full || checked} onClick={check}>
              {copy.order.check}
            </Big>
          )}
        </div>
      </div>
    </div>
  );
}
