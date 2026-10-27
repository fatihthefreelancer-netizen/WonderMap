/**
 * How a spoken line arrives on screen.
 *
 * The panel used to hold the whole sentence from the first frame and fade each
 * word in 20ms after the one before it, which at reading distance is simply
 * "all of it, at once, slightly blurry". A seven-year-old who is still
 * decoding words got no help from that: the line landed, their eye went
 * straight to the blue button, and the words were scenery.
 *
 * So the line is typed. Not re-rendered a character at a time — that reflows
 * the paragraph on every frame and the text jitters as it wraps — but laid out
 * in full and revealed token by token on a real clock, roughly at the speed
 * somebody reads aloud, with a breath at every comma and a longer one at every
 * full stop. Layout is settled before the first word shows, so nothing moves.
 *
 * The same pass also decides which words get a picture. The chapter copy
 * already marks its one important word per line with bold, and most of those
 * words are things the learner can see in the market, so a bold run that names
 * a good is drawn with that good beside it and a bold run that names a page of
 * their notebook is drawn with the notebook's mark. A child who cannot yet
 * read "bread" can still read a loaf.
 */

import { useEffect, useMemo, useState } from 'react';
import type { GoodKey } from './content';
import { CHAPTER_COPY } from './i18n';
import { NOTE_TEXT } from '../../content/notebook';
import { useLocaleStore } from '../../store/localeStore';
import type { Locale } from '../../i18n/messages';

/* ------------------------------------------------------------------ pacing */

/**
 * ~29 characters a second. Fast enough that a finished reader is not held
 * hostage, slow enough that an eye travelling along the line keeps up — and
 * because the cost is per character, a long word takes longer than a short one
 * without anybody tuning per-word delays.
 */
const MS_PER_CHAR = 34;
/** a breath at a comma */
const MS_SOFT = 170;
/** a longer one at a full stop, where a sentence actually ends */
const MS_STOP = 340;
/** the fade on one token — must match `.wm-word` in the stylesheet */
const FADE_MS = 260;
/**
 * No line may take longer than this. Beyond it the whole plan is compressed
 * rather than truncated, so a long sentence speeds up instead of stalling with
 * half of itself invisible.
 */
const MS_MAX = 9000;

/** Latin and Arabic sentence enders, allowing a closing quote after them. */
const STOP_RE = /[.!?؟۔]["'»”]*$/;
const SOFT_RE = /[,;:،؛—–]["'»”]*$/;

/* ------------------------------------------------------- naming the picture */

/** What a recognised bold word gets drawn with. */
export type Cue = { kind: 'good'; good: GoodKey } | { kind: 'note' };

interface Lexicon {
  goods: Map<string, GoodKey>;
  notes: Set<string>;
}

const ARABIC = /[؀-ۿ]/;

/**
 * Reduce a word to something two spellings of the same thing agree on.
 *
 * The copy is written as prose, not as keys: English bolds "apples" where the
 * dictionary says "apples" but also "the wood" where it says "wood"; French
 * inflects and elides; Arabic carries the definite article, the possessive and
 * the accusative tanwin on the noun itself, so "bread" turns up as three
 * different spellings in three different lines. Both sides of every comparison
 * go through here, so these rules only have to be consistent, not
 * linguistically complete — a word this misses simply gets no picture, which is
 * what the panel did before.
 */
function normalise(raw: string): string {
  /*
   * Combining marks come off first, in every script, and this ordering is
   * load-bearing. They are Unicode Mn — marks, not letters — so the
   * punctuation pass below replaces each one with a space and splits the word
   * it was sitting on. The accusative tanwin in سمكًا turned it into "سمك ا",
   * which matched no entry in the lexicon, so the one word in the line a child
   * most needed a picture of was the one word that never got one. A decomposed
   * é would have broken "pièce" the same way.
   */
  let s = raw
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ًͯ-ٰٕـ]/g, '');

  // punctuation out, inner spacing collapsed
  s = s
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!s) return s;

  if (ARABIC.test(s)) {
    return s
      .replace(/[أإآٱ]/g, 'ا') // alef forms
      .replace(/ى/g, 'ي') // alef maqsura
      .replace(/ة/g, 'ه') // ta marbuta
      .replace(
        /^(ال|وال|بال|فال|لل)/,
        '',
      ) // the / and-the / with-the / so-the / for-the
      .trim();
  }

  return s.replace(/^(the|a|an|your|my|le|la|les|l|du|de|des|un|une|ton|ta|mon|ma)\s+/, '');
}

/**
 * Every form a word might be stored or written in, longest first.
 *
 * Endings are peeled here rather than inside `normalise`, because a single
 * canonical spelling is not safe when the suffix being removed is also a real
 * last letter. Arabic fish is سمك: strip the possessive kāf and the dictionary
 * entry becomes سم, while the accusative سمكًا loses its alef and lands on
 * سمك — the same word reduced to two different keys, and no match. Listing the
 * forms instead means both sides can be registered and looked up under all of
 * them, so a word is found if the two spellings agree anywhere.
 */
function variants(raw: string): string[] {
  const base = normalise(raw);
  if (!base) return [];
  const out = [base];

  if (ARABIC.test(base)) {
    let s = base;
    // at most two: a possessive, and the alef the tanwin leaves behind
    for (let i = 0; i < 2; i++) {
      const next = s.replace(/(ها|ه|ك|ي|ا)$/, '');
      if (next === s || next.length < 2) break;
      out.push(next);
      s = next;
    }
    return out;
  }

  const singular = base.replace(/s$/, '');
  if (singular !== base && singular.length > 1) out.push(singular);
  return out;
}

const LEXICONS = new Map<Locale, Lexicon>();

function lexicon(locale: Locale): Lexicon {
  const cached = LEXICONS.get(locale);
  if (cached) return cached;

  const goods = new Map<string, GoodKey>();
  const copy = CHAPTER_COPY[locale] ?? CHAPTER_COPY.en;
  for (const [key, g] of Object.entries(copy.goods)) {
    // first spelling wins, so a longer name never loses its key to a shorter
    // one's stripped form
    for (const k of variants(g.name)) if (!goods.has(k)) goods.set(k, key as GoodKey);
  }

  const notes = new Set<string>();
  for (const t of Object.values(NOTE_TEXT[locale] ?? NOTE_TEXT.en)) {
    // Single words only. "What makes good money" is a page title, not a word
    // anybody bolds mid-sentence, and matching it would need the whole phrase.
    for (const k of variants(t.term)) if (!k.includes(' ')) notes.add(k);
  }

  const lex = { goods, notes };
  LEXICONS.set(locale, lex);
  return lex;
}

function cueFor(bold: string, lex: Lexicon): Cue | undefined {
  for (const k of variants(bold)) {
    const good = lex.goods.get(k);
    if (good) return { kind: 'good', good };
    if (lex.notes.has(k)) return { kind: 'note' };
  }
  return undefined;
}

/* ---------------------------------------------------------------- the plan */

export interface StreamToken {
  text: string;
  bold: boolean;
  space: boolean;
  /** ms from the start of the line at which this token begins to appear */
  at: number;
  /** drawn beside the word, on the first token of a recognised bold run */
  cue?: Cue;
}

export interface StreamPlan {
  tokens: StreamToken[];
  /** ms until the last token has finished appearing */
  total: number;
}

function pauseAfter(word: string): number {
  if (STOP_RE.test(word)) return MS_STOP;
  if (SOFT_RE.test(word)) return MS_SOFT;
  return 0;
}

/**
 * Split a line into tokens and give each one the moment it appears.
 *
 * Bold runs are taken whole before the line is split into words, because
 * splitting first is what used to type the asterisks out: a two-word bold run
 * arrived as two words carrying half a marker each, neither of which is a bold
 * run, so the learner watched the markup appear and then snap.
 */
export function streamPlan(text: string, lex: Lexicon, instant = false): StreamPlan {
  const tokens: StreamToken[] = [];
  let at = 0;

  for (const chunk of text.split(/(\*\*[^*]+\*\*)/)) {
    if (!chunk) continue;
    const bold = chunk.startsWith('**') && chunk.endsWith('**');
    const body = bold ? chunk.slice(2, -2) : chunk;
    const cue = bold ? cueFor(body, lex) : undefined;

    /*
     * A run that earned a picture stays in one piece.
     *
     * Splitting it would put the picture on the first word and leave the rest
     * of the name to arrive separately — fine for "bread", wrong for a good
     * whose name is two words, where the learner would watch a coin appear
     * beside half of "a coin". One token also means the picture and the word
     * it illustrates always land together.
     */
    if (cue) {
      tokens.push({ text: body, bold: true, space: false, at, cue });
      at += body.length * MS_PER_CHAR + pauseAfter(body);
      continue;
    }

    let first = true;
    for (const w of body.split(/(\s+)/)) {
      if (!w) continue;
      const space = /^\s+$/.test(w);
      tokens.push({ text: w, bold, space, at, cue: first && !space ? cue : undefined });
      if (!space) first = false;
      at += w.length * MS_PER_CHAR + (space ? 0 : pauseAfter(w));
    }
  }

  if (instant) {
    for (const t of tokens) t.at = 0;
    return { tokens, total: 0 };
  }

  // A long line compresses rather than overrunning, so every line stays
  // readable and none ever leaves a child staring at half a sentence.
  if (at > MS_MAX) {
    const k = MS_MAX / at;
    for (const t of tokens) t.at = Math.round(t.at * k);
    at = MS_MAX;
  }

  return { tokens, total: at + FADE_MS };
}

/* --------------------------------------------------------------- the hooks */

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** The laid-out line, without the clock — for copy that is never typed. */
export function useStreamTokens(text: string): StreamPlan {
  const locale = useLocaleStore((s) => s.locale);
  return useMemo(() => streamPlan(text, lexicon(locale), true), [text, locale]);
}

/**
 * The line, typed.
 *
 * `done` starts false on the very render the text changes — it is derived from
 * which text has finished rather than reset in an effect, so a new line never
 * flashes complete for a frame before it starts typing. `reveal` is the
 * impatient child's escape hatch: the first tap finishes the line, the second
 * moves on.
 */
export function useStream(text: string): StreamPlan & { done: boolean; reveal: () => void } {
  const locale = useLocaleStore((s) => s.locale);
  const plan = useMemo(
    () => streamPlan(text, lexicon(locale), prefersReducedMotion()),
    [text, locale],
  );
  const [shown, setShown] = useState<string | null>(null);
  const done = shown === text;

  useEffect(() => {
    if (plan.total <= 0) {
      setShown(text);
      return;
    }
    const id = window.setTimeout(() => setShown(text), plan.total);
    return () => window.clearTimeout(id);
  }, [text, plan.total]);

  return { ...plan, done, reveal: () => setShown(text) };
}
