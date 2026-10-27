import { motion } from 'framer-motion';
import { PageShell } from '../components/ui/PageShell';
import { useAuthStore } from '../store/authStore';
import { NOTEBOOK_ORDER, noteDef, pageCount } from '../content/notebook';
import { NoteLeaf, useNoteUi } from '../components/notebook/Leaf';
import { useLocaleStore } from '../store/localeStore';

/**
 * The shelf.
 *
 * It used to be a checklist with padlocks: a child who had just finished the
 * whole of chapter one saw one card and one 🔒, which reads as "you have
 * barely started" rather than "look what you know". A trophy case should show
 * what is in it. So the locked rows are gone, the pages are grouped into the
 * two things they are — words they were given, rules they worked out — and
 * what is still to come is one quiet line at the bottom instead of a row of
 * padlocks per missing entry.
 *
 * The cards themselves are the same component the chapter writes on and the
 * in-chapter drawer flips through, so a page the learner wrote ten minutes ago
 * is recognisably the same object here.
 */
export default function NotebookPage() {
  const ui = useNoteUi();
  const locale = useLocaleStore((s) => s.locale);
  const user = useAuthStore((s) => s.user)!;
  const unlocked = new Set(user.progress.notebook ?? []);
  const pages = NOTEBOOK_ORDER.filter((k) => unlocked.has(k));
  const words = pages.filter((k) => noteDef(k)?.kind === 'word');
  const rules = pages.filter((k) => noteDef(k)?.kind === 'rule');

  return (
    <PageShell title={ui.title} emoji="📓">
      <p className="mb-4 text-center font-display font-extrabold text-[#6b4a1e]">
        {pageCount(locale, pages.length)}
      </p>

      {pages.length === 0 ? (
        <div className="rounded-3xl bg-white/60 px-6 py-10 text-center">
          <p className="text-pretty text-sm font-semibold leading-relaxed text-[#9a7238]">
            {ui.empty}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <Shelf label={ui.words} keys={words} from={0} />
          <Shelf label={ui.rules} keys={rules} from={words.length} />
        </div>
      )}

      <p className="mt-6 text-center text-xs font-semibold text-slate-500">{ui.more}</p>
    </PageShell>
  );
}

function Shelf({ label, keys, from }: { label: string; keys: string[]; from: number }) {
  if (!keys.length) return null;
  return (
    <section className="space-y-3">
      <h2 className="px-1 font-display text-[11px] font-extrabold uppercase tracking-widest text-[#c98a52]">
        {label}
      </h2>
      {keys.map((k, i) => (
        <motion.div
          key={k}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: (from + i) * 0.05 }}
        >
          {/* the shelf heading already says which section this is */}
          <NoteLeaf entry={k} tone="card" showKind={false} />
        </motion.div>
      ))}
    </section>
  );
}
