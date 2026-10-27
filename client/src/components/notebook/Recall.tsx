/**
 * Ten seconds of last time, before this time starts.
 *
 * The notebook is the only thing a learner carries between chapters, which
 * makes it the cheapest place in the whole app to put a spaced retrieval: one
 * page they wrote themselves, held up before the new content arrives. It costs
 * a tap and it is the difference between four chapters of separate facts and
 * one subject that is building.
 *
 * It shows nothing at all when there is nothing to remember, so a learner
 * starting here is never shown an empty ceremony.
 */

import { motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { NOTEBOOK_ORDER } from '../../content/notebook';
import { NoteLeaf, NotebookMark, LeafButton, useNoteUi } from './Leaf';

export function NotebookRecall({
  earned,
  /** pages written by *this* chapter — never worth recalling before it runs */
  exclude = [],
  onNext,
}: {
  earned: string[];
  exclude?: string[];
  onNext: () => void;
}) {
  const ui = useNoteUi();
  const pick = useMemo(() => {
    const pool = NOTEBOOK_ORDER.filter((k) => earned.includes(k) && !exclude.includes(k));
    // the most recently written page is the one the next chapter builds on
    return pool.length ? pool[pool.length - 1] : null;
  }, [earned, exclude]);

  // Nothing to remember yet — step straight past, from an effect rather than
  // mid-render, since advancing is a state change in the chapter above us.
  useEffect(() => {
    if (!pick) onNext();
  }, [pick, onNext]);

  if (!pick) return null;

  return (
    <div className="absolute inset-0 z-20 overflow-y-auto px-4 py-6">
      <div className="my-auto flex min-h-full flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="mb-3 flex justify-center">
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display text-xs font-extrabold uppercase tracking-widest text-white backdrop-blur-sm"
              style={{ background: 'rgba(11,39,64,0.55)' }}
            >
              <NotebookMark size={18} />
              {ui.recall}
            </span>
          </div>

          <motion.div
            initial={{ rotate: -2, scale: 0.94 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 220, damping: 18 }}
          >
            <NoteLeaf entry={pick} tone="page" showChapter />
          </motion.div>

          <div className="mt-3 flex justify-center">
            <span
              className="rounded-full px-4 py-1.5 text-center text-sm font-bold text-white backdrop-blur-sm"
              style={{ background: 'rgba(11,39,64,0.55)' }}
            >
              {ui.recallSub}
            </span>
          </div>
          <div className="mx-auto mt-3 max-w-xs">
            <LeafButton onClick={onNext}>{ui.recallGo}</LeafButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
