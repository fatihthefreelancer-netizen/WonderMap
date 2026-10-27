import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState, type ReactNode } from 'react';
import { sfx } from '../../lib/sfx';
import { useLocaleStore } from '../../store/localeStore';
import { noteDef, noteText } from '../../content/notebook';
import { KindChip, LeafButton, NotebookLeaf, inked, useNoteUi } from './Leaf';

/**
 * The page the learner writes.
 *
 * It used to write itself: the paper came up, a finished sentence was already
 * on it, and the only thing left to do was press "Got it". That is the one
 * moment in the chapter where the child has just *done* the thing and could
 * say it back — and it was being spent on reading. A child who produces a
 * sentence can repeat it afterwards; a child who read one usually cannot, and
 * that gap is exactly what a parent hears when they ask "so what is barter?"
 * and get a shrug from someone who enjoyed the game.
 *
 * So the page arrives unfinished and the learner settles it, with one choice
 * between two options — the same gesture for both kinds of page:
 *   · a **word** has a gap in the sentence and two words that could fill it
 *   · a **rule** has two whole sentences, and they keep the true one
 * The wrong option is never silly. It is the thing a child actually believes
 * at that moment — offer them *more* bread, money is a kind of barter, pretty
 * things are valuable — so choosing is thinking rather than guessing, and the
 * elder's reply has something real to answer.
 */
export function NotePage({
  entry,
  evidence,
  onClose,
}: {
  entry: string;
  /** what they just did, drawn by the chapter — shown once the page is settled */
  evidence?: ReactNode;
  onClose: () => void;
}) {
  const ui = useNoteUi();
  const locale = useLocaleStore((s) => s.locale);
  const def = noteDef(entry);
  const text = noteText(locale, entry);

  /** keeper first in the data, either way round on the paper */
  const order = useMemo(() => (Math.random() < 0.5 ? [0, 1] : [1, 0]), []);
  const [picked, setPicked] = useState<number | null>(null);
  const [missed, setMissed] = useState<number[]>([]);
  const settled = picked === 0;

  if (!def || !text) return null;

  const choose = (i: number) => {
    if (settled || missed.includes(i)) return;
    if (i === 0) {
      setPicked(0);
      sfx('stamp');
      window.setTimeout(() => sfx('happy'), 260);
    } else {
      setMissed((m) => [...m, i]);
      sfx('wrong');
    }
  };

  const [head, tail] = (text.body ?? '{blank}').split('{blank}');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[75] overflow-y-auto bg-[#0b2740]/60 px-4 py-5 backdrop-blur-[3px]"
    >
      <div className="my-auto flex min-h-full flex-col justify-center">
        <motion.div
          initial={{ scale: 0.86, rotate: -3, y: 26 }}
          animate={{ scale: 1, rotate: 0, y: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 19 }}
          className="mx-auto w-full max-w-md"
        >
          <NotebookLeaf tone="page">
            <p className="font-display text-[11px] font-extrabold uppercase tracking-widest text-[#c98a52]">
              {ui.writing}
            </p>

            <div className="mt-1.5">
              <KindChip kind={def.kind} />
            </div>

            <h3 className="mt-2 font-display text-xl font-extrabold leading-tight text-[#6b4a1e]">
              {text.term}
            </h3>

            {/* ---------------------------------------------- a word: the gap */}
            {def.kind === 'word' && (
              <p className="mt-1.5 text-pretty text-[16px] font-semibold leading-relaxed text-[#8a6a44]">
                {inked(head)}
                <Gap filled={settled ? text.options[0] : null} />
                {inked(tail)}
              </p>
            )}

            {/* ------------------------------- a rule: the sentence they kept */}
            {def.kind === 'rule' && settled && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-pretty text-[16px] font-semibold leading-relaxed text-[#8a6a44]"
              >
                {inked(text.options[0])}
              </motion.p>
            )}

            {/* ------------------------------------------------- the choosing */}
            <AnimatePresence initial={false}>
              {!settled && (
                <motion.div exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <p className="mt-4 font-display text-[12px] font-extrabold uppercase tracking-wide text-[#a98a62]">
                    {def.kind === 'word' ? ui.pickWord : ui.pickRule}
                  </p>
                  <div className="mt-2 grid gap-2">
                    {order.map((i) => (
                      <Option
                        key={i}
                        label={text.options[i]}
                        wrong={missed.includes(i)}
                        compact={def.kind === 'word'}
                        onPick={() => choose(i)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* the elder answers the belief behind the wrong one */}
            <AnimatePresence>
              {missed.length > 0 && !settled && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 text-pretty rounded-2xl bg-[#fdeaea] px-3 py-2 text-[13px] font-semibold leading-relaxed text-[#a33a3a]"
                >
                  {inked(text.nudge)}
                </motion.p>
              )}
            </AnimatePresence>

            {/* their own evidence, in their own run */}
            <AnimatePresence>
              {settled && evidence && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mt-3 rounded-2xl border-2 border-dashed border-[#e7d3b4] p-3"
                >
                  <p className="font-display text-[10px] font-extrabold uppercase tracking-wide text-[#c98a52]">
                    {ui.yourTrade}
                  </p>
                  <div className="mt-1.5">{evidence}</div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-5">
              <LeafButton
                disabled={!settled}
                onClick={() => {
                  sfx('tap');
                  onClose();
                }}
              >
                {ui.gotIt}
              </LeafButton>
            </div>
          </NotebookLeaf>
        </motion.div>
      </div>
    </motion.div>
  );
}

/** The space left in the sentence, and the word that lands in it. */
function Gap({ filled }: { filled: string | null }) {
  if (!filled) {
    return (
      <motion.span
        animate={{ opacity: [1, 0.45, 1] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        className="inline-block w-[5.5rem] translate-y-[3px] border-b-[3px] border-dotted border-[#c98a52] align-baseline"
      />
    );
  }
  return (
    <motion.strong
      initial={{ opacity: 0, scale: 1.25, rotate: -6 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 14 }}
      className="inline-block rounded-md bg-[#fdeec6] px-1.5 font-extrabold text-[#6b4a1e]"
    >
      {filled}
    </motion.strong>
  );
}

/**
 * One of the two things they can write.
 *
 * Green for the one that stuck and red for the one that did not, because that
 * is already what a right and a wrong answer look like in the quiz — the
 * notebook should not teach a second colour language for the same idea.
 */
function Option({
  label,
  wrong,
  compact,
  onPick,
}: {
  label: string;
  wrong: boolean;
  compact: boolean;
  onPick: () => void;
}) {
  return (
    <motion.button
      onClick={onPick}
      disabled={wrong}
      animate={wrong ? { x: [0, -7, 6, -4, 0] } : {}}
      transition={{ duration: 0.4 }}
      whileTap={wrong ? {} : { scale: 0.97 }}
      className={`flex w-full items-center gap-3 text-pretty rounded-2xl border-[3px] px-3.5 text-start font-display font-extrabold leading-snug transition-colors ${
        compact ? 'py-2.5 text-[15px]' : 'py-3 text-[14px]'
      } ${
        wrong
          ? 'border-[#e0a0a0] bg-[#fdeaea] text-[#a33a3a] opacity-70'
          : 'border-[#e7d3b4] bg-white/80 text-[#6b4a1e] shadow-[0_3px_0_rgba(201,138,82,0.25)] hover:border-[#c98a52]'
      }`}
    >
      {/* a tick-box, so a row reads as something you choose rather than a label */}
      <span
        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-[3px] ${
          wrong ? 'border-[#e0a0a0] bg-white' : 'border-[#e0b56a] bg-white'
        }`}
      >
        {wrong && <span className="font-display text-[11px] font-black text-[#a33a3a]">✕</span>}
      </span>
      <span className="min-w-0">{inked(label)}</span>
    </motion.button>
  );
}
