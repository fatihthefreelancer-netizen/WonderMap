/**
 * The notebook, openable in the middle of a chapter.
 *
 * Until now the only way to read a page was to leave the chapter and go to
 * another screen, which meant that for the fifteen minutes when the words are
 * actually load-bearing the notebook may as well not have existed. A learner
 * who cannot look something up cannot be asked to look something up — and
 * being asked is the whole difference between a notebook that collects
 * learning and a notebook that is used for it.
 *
 * Only written pages are listed. A padlock mid-chapter is a spoiler and a
 * tease, so pages that have not been earned simply are not here yet.
 */

import { motion } from 'framer-motion';
import { useLocaleStore } from '../../store/localeStore';
import { NOTEBOOK_ORDER, noteDef, pageCount } from '../../content/notebook';
import { NoteLeaf, NotebookMark, useNoteUi } from './Leaf';

export function NotebookDrawer({
  earned,
  onClose,
}: {
  earned: string[];
  onClose: () => void;
}) {
  const ui = useNoteUi();
  const locale = useLocaleStore((s) => s.locale);
  const rtl = locale === 'ar';
  const pages = NOTEBOOK_ORDER.filter((k) => earned.includes(k));
  const words = pages.filter((k) => noteDef(k)?.kind === 'word');
  const rules = pages.filter((k) => noteDef(k)?.kind === 'rule');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="absolute inset-0 z-[78] bg-[#0b2740]/50 backdrop-blur-[3px]"
    >
      <motion.aside
        // slides in from the edge the reader starts at, so it opens the way a
        // book opens in whichever language they are in
        initial={{ x: rtl ? '100%' : '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: rtl ? '100%' : '-100%' }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="absolute inset-y-0 start-0 flex w-full max-w-sm flex-col bg-[#f6ead4] shadow-hud-lg"
      >
        <header className="flex shrink-0 items-center gap-3 border-b-2 border-[#e7d3b4] px-4 py-3">
          <NotebookMark size={24} />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate font-display text-base font-extrabold text-[#6b4a1e]">
              {ui.title}
            </p>
            <p className="font-display text-[11px] font-extrabold text-[#c98a52]">
              {pageCount(locale, pages.length)}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label={ui.close}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/80 font-display text-lg font-black text-[#8a5f1a] shadow-hud"
          >
            ✕
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
          {pages.length === 0 && (
            <p className="px-2 py-8 text-center text-pretty text-sm font-semibold leading-relaxed text-[#a98a62]">
              {ui.empty}
            </p>
          )}
          <Shelf label={ui.words} keys={words} />
          <Shelf label={ui.rules} keys={rules} />
        </div>
      </motion.aside>
    </motion.div>
  );
}

function Shelf({ label, keys }: { label: string; keys: string[] }) {
  if (!keys.length) return null;
  return (
    <section className="space-y-3">
      <h4 className="px-1 font-display text-[11px] font-extrabold uppercase tracking-widest text-[#c98a52]">
        {label}
      </h4>
      {keys.map((k) => (
        <NoteLeaf key={k} entry={k} tone="card" showChapter={false} showKind={false} />
      ))}
    </section>
  );
}
