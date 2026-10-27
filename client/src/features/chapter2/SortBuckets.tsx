import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BUCKETS, SORT_CARDS, type ValueKind } from './content';
import { art, Big, Item, useCh2Copy } from './pieces';

/**
 * 2.4 — "Things, help and knowledge".
 *
 * Six of the village's offers get sorted into three baskets. Tap a card to pick
 * it up and tap a basket to drop it in; dragging works too, for a mouse. A card
 * dropped in the wrong basket bounces back rather than being marked wrong.
 */

const BASKET_ART: Record<ValueKind, string> = {
  thing: 'ui-basket-things',
  help: 'ui-basket-help',
  knowledge: 'ui-basket-knowledge',
};

export function SortBuckets({ onDone }: { onDone: (mistakes: number) => void }) {
  const copy = useCh2Copy();
  const [placed, setPlaced] = useState<Record<string, ValueKind>>({});
  const [held, setHeld] = useState<string | null>(null);
  const [wrongAt, setWrongAt] = useState<ValueKind | null>(null);
  const [mistakes, setMistakes] = useState(0);

  const loose = useMemo(() => SORT_CARDS.filter((c) => !placed[c.id]), [placed]);
  const allIn = loose.length === 0;

  function drop(bucket: ValueKind, id = held) {
    if (!id) return;
    const card = SORT_CARDS.find((c) => c.id === id);
    if (!card) return;
    if (card.bucket === bucket) {
      setPlaced((p) => ({ ...p, [id]: bucket }));
      setHeld(null);
      setWrongAt(null);
    } else {
      setMistakes((m) => m + 1);
      setWrongAt(bucket);
      setTimeout(() => setWrongAt(null), 420);
    }
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-end px-3 pb-3 pt-16 sm:px-5 sm:pb-5">
      <div className="pointer-events-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col justify-end gap-3 pb-3">
        {/* ----------------------------- baskets ---------------------------- */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {BUCKETS.map((b) => {
            const mine = SORT_CARDS.filter((c) => placed[c.id] === b);
            return (
              <motion.button
                key={b}
                onClick={() => drop(b)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  drop(b, e.dataTransfer.getData('text/plain'));
                }}
                animate={wrongAt === b ? { x: [0, -8, 8, -6, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex flex-col items-center rounded-[26px] border-[3px] bg-white/95 p-2.5 shadow-hud backdrop-blur-sm transition-colors sm:p-3.5 ${
                  held ? 'border-[#8ad6ff]' : 'border-white'
                }`}
              >
                <img src={art(BASKET_ART[b])} alt="" className="h-[clamp(46px,9vh,86px)] w-auto" />
                <p className="mt-1 font-display text-[11px] font-extrabold uppercase tracking-wide text-[#2b4a66] sm:text-[13px]">
                  {copy.sort.buckets[b].name}
                </p>
                <p className="mt-0.5 hidden text-pretty text-center text-[11px] font-semibold leading-snug text-[#8296ad] sm:block">
                  {copy.sort.buckets[b].rule}
                </p>
                <div className="relative z-10 -mt-3 flex min-h-[34px] flex-wrap items-center justify-center gap-1 drop-shadow">
                  <AnimatePresence>
                    {mine.map((c) => (
                      <motion.div
                        key={c.id}
                        initial={{ scale: 0.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                        className="h-7 w-7 sm:h-9 sm:w-9"
                      >
                        <Item item={c.item} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------ the cards ---------------------------- */}
      <div className="pointer-events-auto w-full max-w-4xl rounded-[28px] bg-white/95 p-4 shadow-hud-lg backdrop-blur-sm">
        <p className="text-center font-display text-[13px] font-extrabold text-[#5b7290] sm:text-sm">
          {allIn ? copy.sort.done : held ? copy.sort.hint : copy.sort.intro}
        </p>

        {!allIn && (
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {loose.map((c) => (
              <motion.button
                key={c.id}
                draggable
                onDragStart={(e) => {
                  const ev = e as unknown as React.DragEvent;
                  ev.dataTransfer?.setData('text/plain', c.id);
                  setHeld(c.id);
                }}
                onClick={() => setHeld(held === c.id ? null : c.id)}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.96 }}
                className={`flex w-[clamp(96px,26vw,160px)] items-center gap-2 rounded-2xl border-[3px] bg-[#f7fafd] p-2 text-start transition-colors ${
                  held === c.id ? 'border-[#3aa9e8] bg-[#eaf7ff]' : 'border-[#e6edf5] hover:border-[#9fdcff]'
                }`}
              >
                <div className="h-9 w-9 shrink-0 sm:h-11 sm:w-11">
                  <Item item={c.item} />
                </div>
                <span className="text-pretty font-display text-[11px] font-extrabold leading-tight text-[#2b4a66] sm:text-[12.5px]">
                  {copy.sort.cards[c.id]}
                </span>
              </motion.button>
            ))}
          </div>
        )}

        {allIn && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex justify-center">
            <Big tone="grass" onClick={() => onDone(mistakes)}>
              {copy.sort.next}
            </Big>
          </motion.div>
        )}
      </div>
    </div>
  );
}
