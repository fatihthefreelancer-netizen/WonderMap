/**
 * The notebook's look, in one place.
 *
 * A page has to be recognisably the same object in four different moments —
 * written mid-chapter, flipped open during a puzzle, sitting on the shelf on
 * its own screen, and held up again at the start of the next chapter. When
 * each of those drew its own card the notebook stopped reading as a thing the
 * learner owns and started reading as four unrelated panels, so the paper, the
 * ruling, the margin, the ink and the two section marks all live here and
 * every surface renders through them.
 */

import { memo, type ReactNode } from 'react';
import { useLocaleStore } from '../../store/localeStore';
import { GemPin, StarPin } from '../ui/Pins';
import {
  CHAPTER_LABEL,
  NOTE_UI,
  noteDef,
  noteSentence,
  noteText,
  type NoteKind,
  type NoteUi,
} from '../../content/notebook';

/** Ruled exercise-book paper. The rhythm matches the body line-height. */
export const PAPER = {
  backgroundImage:
    'repeating-linear-gradient(180deg, transparent 0 31px, rgba(201,138,82,0.16) 31px 32px)',
} as const;

/** Every label the notebook shows, in the language the app is set to. */
export function useNoteUi(): NoteUi {
  const locale = useLocaleStore((s) => s.locale);
  return NOTE_UI[locale] ?? NOTE_UI.en;
}

/**
 * **bold** → <strong>, inked rather than printed.
 *
 * The chapter's own `rich()` bolds in dialogue blue, which is right on a white
 * speech card and wrong on paper — the notebook is written in one colour, by
 * hand, and a blue word in the middle of it looks like a hyperlink.
 */
export function inked(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-extrabold text-[#6b4a1e]">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

const KIND_STYLE: Record<NoteKind, { chip: string; icon: string }> = {
  word: { chip: 'bg-[#eef3e7] text-[#4a6b3a]', icon: 'ui-check' },
  rule: { chip: 'bg-[#fdeec6] text-[#8a5f1a]', icon: 'fx-star' },
};

/** The section a page belongs to — a definition, or something worked out. */
export const KindChip = memo(function KindChip({ kind }: { kind: NoteKind }) {
  const ui = useNoteUi();
  const s = KIND_STYLE[kind];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-display text-[10px] font-extrabold uppercase tracking-wide ring-2 ring-white ${s.chip}`}
    >
      <img src={`/chapter/${s.icon}.webp`} alt="" width={13} height={13} />
      {kind === 'word' ? ui.words : ui.rules}
    </span>
  );
});

/**
 * A sheet of the notebook's paper.
 *
 * `tone` is the only thing that varies: a page being written fills the screen
 * and wants room to breathe, a page on a shelf is one of several and wants to
 * be scannable.
 */
export const NotebookLeaf = memo(function NotebookLeaf({
  children,
  tone = 'page',
  className = '',
}: {
  children: ReactNode;
  tone?: 'page' | 'card';
  className?: string;
}) {
  const page = tone === 'page';
  return (
    /*
      The same chassis the speech panels wear — a thick white rim, a gold star
      pinned to one corner and a gem on the other — wrapped around the paper
      rather than replacing it. The notebook still has to read as a notebook,
      so the ruled sheet and the red margin survive; what changes is that it
      now sits on the screen with the same weight as everything else in the
      chapter instead of looking like a document that wandered in.
    */
    <div
      className={`relative rounded-[26px] bg-white ${
        page
          ? 'p-[7px] shadow-[0_12px_0_rgba(140,88,0,0.18),0_30px_56px_-20px_rgba(0,0,0,0.6)]'
          : 'p-[5px] shadow-[0_8px_0_rgba(140,88,0,0.14),0_20px_36px_-16px_rgba(0,0,0,0.45)]'
      } ${className}`}
    >
      {page && <StarPin />}
      {page && <GemPin />}
      <div
        style={PAPER}
        className={`relative overflow-hidden rounded-[20px] border-[3px] border-[#efdfc2] bg-[#fffaf0] ${
          page ? 'p-5' : 'p-3.5'
        }`}
      >
        {/*
          The red margin rule of a school exercise book.
          Its offset tracks the card's own padding so the writing always clears
          it by the same gap in both sizes, and `insetInlineStart` puts it on
          the side the reader starts from without a second rule for Arabic.
        */}
        <span
          aria-hidden
          style={{ insetInlineStart: page ? 34 : 26 }}
          className="pointer-events-none absolute inset-y-0 w-px bg-[#e4a0a0]"
        />
        <div className="relative ps-6">{children}</div>
      </div>
    </div>
  );
});

/**
 * One finished page, read-only.
 *
 * This is what the drawer, the shelf and the recall card all show. The writing
 * moment is the only surface that does not use it, because there the sentence
 * is still being decided.
 */
export const NoteLeaf = memo(function NoteLeaf({
  entry,
  tone = 'card',
  showExample = true,
  showChapter = true,
  /** off when the card already sits under a Words/Rules heading */
  showKind = true,
}: {
  entry: string;
  tone?: 'page' | 'card';
  showExample?: boolean;
  showChapter?: boolean;
  showKind?: boolean;
}) {
  const locale = useLocaleStore((s) => s.locale);
  const ui = useNoteUi();
  const def = noteDef(entry);
  const text = noteText(locale, entry);
  if (!def || !text) return null;

  return (
    <NotebookLeaf tone={tone}>
      {showKind && <KindChip kind={def.kind} />}
      <h3 className="font-display text-xl font-extrabold leading-tight text-[#6b4a1e] [&:not(:first-child)]:mt-2">
        {text.term}
      </h3>
      <p className="mt-1 text-pretty text-[15px] font-semibold leading-relaxed text-[#8a6a44]">
        {inked(noteSentence(def.kind, text))}
      </p>

      {showExample && (
        <p className="mt-2.5 text-pretty border-s-2 border-[#e7d3b4] ps-2.5 text-[13px] font-semibold leading-relaxed text-[#a98a62]">
          <span className="font-display text-[10px] font-extrabold uppercase tracking-wide text-[#c98a52]">
            {ui.exampleLabel}:{' '}
          </span>
          {text.example}
        </p>
      )}

      {showChapter && (
        <span className="mt-3 inline-block rounded-full bg-[#f3e4c6] px-2.5 py-0.5 font-display text-[10px] font-extrabold text-[#8a5f1a]">
          {(CHAPTER_LABEL[locale] ?? CHAPTER_LABEL.en)[def.chapter]}
        </span>
      )}
    </NotebookLeaf>
  );
});

/**
 * The button the notebook uses for its own actions.
 *
 * Brown rather than the chapter's blue, on purpose: blue moves the story on,
 * and this closes a page. Keeping the two apart is what stops a child tapping
 * through their own notebook thinking it is the next beat.
 */
export function LeafButton({
  children,
  onClick,
  disabled,
  className = '',
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-full bg-gradient-to-b from-[#f0c87e] to-[#c98a52] px-6 py-3 font-display text-sm font-extrabold text-white ring-[3px] ring-white shadow-[0_5px_0_#a06d38] transition-transform active:translate-y-[2px] active:shadow-[0_3px_0_#a06d38] disabled:opacity-40 disabled:shadow-[0_5px_0_#a06d38] ${className}`}
    >
      {children}
    </button>
  );
}

/**
 * "Go and look it up."
 *
 * Shown where a learner is stuck — the market nobody can solve, a quiz answer
 * they got wrong. It is deliberately not a hint: it opens their own pages and
 * leaves the reading to them, which is the only way the notebook ever becomes
 * something they use rather than something they were given.
 */
export function LookItUp({ onClick, className = '' }: { onClick: () => void; className?: string }) {
  const ui = useNoteUi();
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`inline-flex items-center gap-2 rounded-full border-2 border-[#e0b56a] bg-[#fff6e3] px-4 py-2 font-display text-[13px] font-extrabold text-[#8a5f1a] shadow-hud ${className}`}
    >
      {ui.lookItUp}
    </button>
  );
}

/** The little spine icon, so "notebook" is the same mark wherever it appears. */
export function NotebookMark({ size = 20 }: { size?: number }) {
  return (
    <span
      style={{ width: size, height: size }}
      className="relative inline-block shrink-0 rounded-[4px] bg-[#e0b56a] shadow-[inset_0_0_0_1.5px_rgba(107,74,30,0.45)]"
    >
      <span className="absolute inset-y-[3px] start-[3px] w-px bg-[#8a5f1a]/50" />
      <span className="absolute inset-x-[6px] top-[5px] h-px bg-[#8a5f1a]/40" />
      <span className="absolute inset-x-[6px] top-[9px] h-px bg-[#8a5f1a]/40" />
      <span className="absolute inset-x-[6px] top-[13px] h-px bg-[#8a5f1a]/40" />
    </span>
  );
}
