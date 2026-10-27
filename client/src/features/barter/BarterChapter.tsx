import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestBoard, type BoardState, type Trade } from './QuestBoard';
import { QuestPanel } from './Quest';
import { InventMoney } from './InventMoney';
import { MoneyChain } from './MoneyChain';
import {
  Confetti,
  CoinBurst,
  Good,
  
  Portrait,
  Purse,
  StarRow,
  rich,
  art,
  scene,
  shuffled,
  useCopy,
  type EliasPose,
} from './pieces';
import { Panel } from './Dialogue';
import {
  DID_YOU_KNOW_ICON,
  PEOPLE,
  QUIZ,
  SCENARIOS,
  TAKEAWAYS,
  type CandidateId,
  type GoodKey,
  type Look,
} from './content';
import { COINS_PER_TRADE, analyse, earnedStar } from './par';
import { useChapterRun, type VillageResult } from './run';
import { clearSave, readBest, readSave, writeBest, writeSave } from './save';
import { FlagSwitch } from '../../components/ui/FlagSwitch';
import { fillText } from './i18n';
import { NotePage } from '../../components/notebook/WritePage';
import { NotebookDrawer } from '../../components/notebook/Drawer';
import { LookItUp, NotebookMark, useNoteUi } from '../../components/notebook/Leaf';
import { EliasAsksName, useRtl } from './Dialogue';
import { sfx } from '../../lib/sfx';
import { useAuthStore } from '../../store/authStore';
import { track } from '../../lib/track';

/**
 * Chapter 1 — "Why does money exist?"
 *
 * Thirteen beats: the first coin, a guess at how people bought things before
 * it, the elder's explanation, five barter villages that get progressively
 * harder (one of them walked in the first person, the last one impossible),
 * choosing what the village should agree to accept, the coin travelling the
 * market, a quiz, and the wrap-up.
 *
 * The chapter now pays as it goes. Every trade is a coin, every village solved
 * in the fewest possible moves is a star, and the board's counters — trades,
 * steps, hints — are carried all the way to the closing screen instead of
 * being thrown away at each village boundary.
 */

export interface ChapterResult {
  /** percentage, driven by village stars rather than by the quiz */
  score: number;
  notebook: string[];
  badges: string[];
  /** coins earned inside the chapter itself */
  coins?: number;
  xp?: number;
}

interface Props {
  onExit: () => void;
  onFinish: (r: ChapterResult) => void;
  submitting?: boolean;
  /** who is playing, so a half-finished chapter can be handed back to them */
  userId?: string;
}

type Beat =
  | { kind: 'title' }
  | { kind: 'name' }
  | { kind: 'hook' }
  | { kind: 'coin' }
  | { kind: 'guess' }
  | { kind: 'elder' }
  | { kind: 'village'; index: number }
  | { kind: 'invent' }
  | { kind: 'money' }
  | { kind: 'quiz' }
  | { kind: 'end' };

const BEATS: Beat[] = [
  { kind: 'title' },
  { kind: 'name' },
  { kind: 'hook' },
  { kind: 'coin' },
  { kind: 'guess' },
  { kind: 'elder' },
  ...SCENARIOS.map((_, index) => ({ kind: 'village', index }) as Beat),
  { kind: 'invent' },
  { kind: 'money' },
  { kind: 'quiz' },
  { kind: 'end' },
];

const CHAPTER_ID = '1a';
const NICKNAME_KEY = 'wm:nickname';
/** one star per village */
const TOTAL_STARS = SCENARIOS.length;

/**
 * One market, one day.
 *
 * The five puzzles used to be labelled "Village 1 of 5" while reusing the same
 * cast across four different backdrops, which quietly told the child something
 * untrue. They are now five trades in the *same* market square, and the sky
 * moves while they work: bright at the first puzzle, golden by the fourth, and
 * dusk over Market Day, when the trading finally seizes up. The three painted
 * frames are cross-faded, so the light in the buildings is really painted
 * rather than tinted.
 */
const BACKDROPS: Record<string, string> = {
  title: 'scene-square',
  name: 'scene-square',
  hook: 'scene-square',
  coin: 'scene-square',
  guess: 'scene-square',
  elder: 'scene-square',
  invent: 'scene-courtyard',
  money: 'scene-souk',
  quiz: 'scene-room',
  end: 'scene-overlook',
};

/**
 * One market, one light.
 *
 * The square used to warm towards dusk as the chapter went on. It looked
 * lovely and it cost attention: the board changed colour under the cast for
 * reasons the puzzle never depended on. The painted golden and dusk frames
 * are still in `public/chapter` if that idea ever comes back.
 */

export function BarterChapter({ onExit, onFinish, submitting, userId = 'me' }: Props) {
  const copy = useCopy();
  /**
   * Greet them by name only when the profile actually holds something that
   * reads like a name. A display name is free text — "Milo's Apprentice"
   * first-words to "Milo's", and "Ah, hello there, Milo's!" is worse than not
   * trying. Anything that fails the sniff test falls back to the written line.
   */
  /**
   * What Elias calls them.
   *
   * The account's display name is whatever a grown-up typed at signup, which
   * for the demo account is somebody else's name entirely — so Elias asks,
   * once, and remembers the answer on this device. An empty answer is a real
   * answer: it means "young traveller", which is what the written line says.
   */
  const [nickname, setNickname] = useState<string | null>(() => {
    try {
      return localStorage.getItem(NICKNAME_KEY);
    } catch {
      return null;
    }
  });
  const saveNickname = useCallback((n: string) => {
    try {
      localStorage.setItem(NICKNAME_KEY, n);
    } catch {
      /* a blocked store just means he asks again next time */
    }
    setNickname(n);
  }, []);

  /*
   * The box starts empty.
   *
   * It used to be pre-filled from the account's display name, which belongs
   * to whichever grown-up signed up — so a child was greeted as "Sara" unless
   * they noticed they had to delete somebody else's name first. The
   * placeholder asks the question; the answer is theirs to type.
   */
  const learnerName = nickname ?? '';
  const [step, setStep] = useState(0);
  /** the page currently being written, and the learner's own evidence for it */
  const [note, setNote] = useState<{ entry: string; evidence?: ReactNode } | null>(null);
  const [book, setBook] = useState(false);
  const [resume, setResume] = useState<{ step: number } | null>(null);
  const [leaving, setLeaving] = useState(false);
  const run = useChapterRun();
  const beat = BEATS[step];

  /**
   * What is in the notebook right now: pages written on this run, plus pages
   * kept from earlier chapters. A learner who already knows what *value*
   * means should find it in there when they look.
   */
  const savedNotes = useAuthStore((st) => st.user?.progress.notebook);
  const earned = useMemo(
    () => Array.from(new Set([...(savedNotes ?? []), ...run.state.notes])),
    [savedNotes, run.state.notes],
  );

  /** A page is written and kept in one move, so neither can happen alone. */
  const writeNote = useCallback(
    (entry: string, evidence?: ReactNode) => {
      run.writeNote(entry);
      setNote({ entry, evidence });
    },
    [run],
  );
  const openBook = useCallback(() => {
    sfx('tap');
    setBook(true);
  }, []);

  /**
   * One tap, one beat. `AnimatePresence` keeps the outgoing beat mounted (and
   * clickable) for the length of its fade, so a child drumming on the button —
   * which they do — used to advance two or three steps at a time and skip whole
   * villages. The lock outlives the crossfade.
   */
  const advancing = useRef(false);
  const next = useCallback(() => {
    if (advancing.current) return;
    advancing.current = true;
    setStep((s) => Math.min(BEATS.length - 1, s + 1));
    window.setTimeout(() => {
      advancing.current = false;
    }, 450);
  }, []);

  /**
   * Stepping back is allowed through the talking beats only. Letting a learner
   * re-enter a puzzle they have already been paid for would turn the purse
   * into a treadmill, so puzzles, the quiz and the ending stay one-way.
   */
  const REPLAYABLE = new Set(['title', 'name', 'hook', 'coin', 'guess', 'elder']);
  const canGoBack = step > 0 && REPLAYABLE.has(BEATS[step].kind) && REPLAYABLE.has(BEATS[step - 1].kind);
  const back = useCallback(() => {
    if (advancing.current) return;
    advancing.current = true;
    sfx('tap');
    setStep((s) => Math.max(0, s - 1));
    window.setTimeout(() => {
      advancing.current = false;
    }, 450);
  }, []);

  // offer to pick up a half-finished chapter, once, on the way in
  useEffect(() => {
    const save = readSave(CHAPTER_ID, userId);
    if (save && save.step > 1 && save.step < BEATS.length - 1) setResume({ step: save.step });
    track('chapter_start', { chapter: CHAPTER_ID, resumable: !!save });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (step > 0) writeSave(CHAPTER_ID, userId, step, run.state);
    track('beat_enter', { chapter: CHAPTER_ID, beat: beat.kind, index: step });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  /**
   * The village is one place, and it looks like one place.
   *
   * The trading beats used to swap to a second painted market the moment
   * Elias arrived. Both paintings are lovely and both are sunny, but a child
   * who has just been introduced to a square does not expect the square to be
   * somewhere else by the first trade — the ground, the sea and the light all
   * changed at once. Everything up to and including the markets now stays in
   * the square they arrived in; the beats that genuinely move (the workshop,
   * the souk, the schoolroom, the overlook) still travel.
   */
  const backdrop = BACKDROPS[beat.kind] ?? 'scene-square';

  const finish = useCallback(() => {
    const stars = run.totals.stars;
    const best = writeBest(CHAPTER_ID, userId, {
      stars,
      trades: run.totals.trades,
      coins: run.state.coins,
    });
    clearSave(CHAPTER_ID, userId);
    track('chapter_complete', {
      chapter: CHAPTER_ID,
      stars,
      coins: run.state.coins,
      trades: run.totals.trades,
      steps: run.totals.steps,
      hints: run.totals.hints,
      quiz: run.state.quizRight,
      newBest: best,
    });
    onFinish({
      // stars come from how well the villages were played, not from the quiz
      score: Math.round((stars / TOTAL_STARS) * 100),
      // every page they wrote, not just the first one — `chain` and
      // `goodmoney` used to be shown once and then thrown away, which quietly
      // deleted the two ideas the chapter works hardest to teach
      notebook: run.state.notes,
      badges: ['barter-explorer'],
      coins: run.state.coins,
      xp: Math.round(run.state.coins / 2),
    });
  }, [run, onFinish, userId]);

  return (
    <div className="fixed inset-0 z-50 overflow-clip">
      {/*
        `overflow-clip`, not `overflow-hidden`.

        The chapter deliberately paints past its own edges — Elias hangs off
        the side, and each villager carries a depth-of-field halo 18% wider
        than they are. `overflow-hidden` hides that but still makes this a
        scroll container, and under `dir="rtl"` a scroll container anchors at
        its right edge: the bleed on the left became a negative `scrollLeft`,
        which quietly slid every `inset-0` overlay in the chapter ~170px
        sideways. `overflow: clip` crops the same pixels without ever being
        scrollable, so there is nothing to anchor and nothing to shift.
      */}
      <img
        src={scene(backdrop)}
        alt=""
        className="absolute inset-0 h-full w-full select-none object-cover"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b2740]/25 via-transparent to-[#0b2740]/40" />

      <ChapterChrome
        step={step}
        total={BEATS.length}
        pages={earned.length}
        onBook={openBook}
        coins={run.state.coins}
        flyKey={run.state.flyKey}
        stars={run.totals.stars}
        canGoBack={canGoBack}
        onBack={back}
        onExit={() => setLeaving(true)}
      />
      <CoinBurst flyKey={run.state.flyKey} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, pointerEvents: 'none' }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0"
        >
          {beat.kind === 'title' && <TitleBeat onNext={next} />}
          {beat.kind === 'name' && (
            <EliasAsksName
              speaker={copy.elder.name}
              prompt={copy.askName.prompt}
              placeholder={copy.askName.placeholder}
              confirm={copy.askName.confirm}
              skip={copy.askName.skip}
              initial=""

              onDone={(n) => {
                saveNickname(n);
                next();
              }}
            />
          )}
          {beat.kind === 'hook' && <HookBeat onNext={next} />}
          {beat.kind === 'coin' && <CoinBeat onNext={next} />}
          {beat.kind === 'guess' && <GuessBeat onNext={next} />}
          {beat.kind === 'elder' && (
            <ElderBeat name={learnerName} onNote={writeNote} onNext={next} />
          )}
          {beat.kind === 'village' && (
            <VillageBeat
              key={beat.index}
              index={beat.index}
              onTrade={() => run.award(COINS_PER_TRADE)}
              onResult={run.finishVillage}
              onNote={writeNote}
              onBook={openBook}
              onNext={next}
            />
          )}
          {beat.kind === 'invent' && (
            <InventMoney
              onNext={next}
              onNote={writeNote}
              onTried={(id: CandidateId) => run.tried(id)}
            />
          )}
          {beat.kind === 'money' && <MoneyBeat onPaid={run.payment} onNext={next} />}
          {beat.kind === 'quiz' && (
            <QuizBeat onCorrect={run.quizCorrect} onBook={openBook} onNext={next} />
          )}
          {beat.kind === 'end' && (
            <EndBeat
              stars={run.totals.stars}
              totals={run.totals}
              villages={run.state.villages}
              coins={run.state.coins}
              payments={run.state.payments}
              quizRight={run.state.quizRight}
              best={readBest(CHAPTER_ID, userId)}
              submitting={submitting}
              onFinish={finish}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {note && (
          <NotePage
            entry={note.entry}
            evidence={note.evidence}
            onClose={() => setNote(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {book && <NotebookDrawer earned={earned} onClose={() => setBook(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {resume && (
          <Sheet
            title={copy.ui.resumeTitle}
            body={copy.ui.resumeBody}
            primary={copy.ui.resumeContinue}
            secondary={copy.ui.resumeRestart}
            onPrimary={() => {
              const save = readSave(CHAPTER_ID, userId);
              if (save) {
                run.setState(save.run);
                setStep(save.step);
              }
              setResume(null);
            }}
            onSecondary={() => {
              clearSave(CHAPTER_ID, userId);
              setResume(null);
            }}
          />
        )}
        {leaving && (
          <Sheet
            title={copy.ui.leaveTitle}
            body={copy.ui.leaveBody}
            primary={copy.ui.leaveStay}
            secondary={copy.ui.leaveGo}
            onPrimary={() => setLeaving(false)}
            onSecondary={() => {
              writeSave(CHAPTER_ID, userId, step, run.state);
              track('chapter_exit', { chapter: CHAPTER_ID, beat: beat.kind, index: step });
              onExit();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/** A small two-button sheet — used for "carry on?" and "leave?". */
function Sheet({
  title,
  body,
  primary,
  secondary,
  onPrimary,
  onSecondary,
}: {
  title: string;
  body: string;
  primary: string;
  secondary: string;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[80] grid place-items-center bg-[#0b2740]/60 px-4 backdrop-blur-[2px]"
    >
      <motion.div
        initial={{ scale: 0.88, y: 18 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 250, damping: 20 }}
        className="w-full max-w-sm rounded-[28px] bg-white p-6 text-center shadow-hud-lg"
      >
        <h3 className="font-display text-xl font-extrabold text-[#1f3a5f]">{title}</h3>
        <p className="mt-2 text-pretty text-[14px] font-semibold leading-relaxed text-[#5b7290]">
          {body}
        </p>
        <button
          onClick={onPrimary}
          className="mt-5 w-full rounded-full bg-gradient-to-b from-[#5cc5f5] to-[#2f9ae0] px-6 py-3 font-display text-sm font-extrabold text-white shadow-hud"
        >
          {primary}
        </button>
        <button
          onClick={onSecondary}
          className="mt-2 w-full rounded-full bg-[#f1f6fb] px-6 py-3 font-display text-sm font-extrabold text-[#6f87a6]"
        >
          {secondary}
        </button>
      </motion.div>
    </motion.div>
  );
}

function ChapterChrome({
  step,
  total,
  coins,
  flyKey,
  stars,
  pages,
  canGoBack,
  onBack,
  onBook,
  onExit,
}: {
  step: number;
  total: number;
  coins: number;
  flyKey: number;
  stars: number;
  pages: number;
  canGoBack: boolean;
  onBack: () => void;
  onBook: () => void;
  onExit: () => void;
}) {
  const copy = useCopy();
  const nb = useNoteUi();
  /*
   * `dir="rtl"` on <html> already reverses the flex rows, so the chapter title
   * lands on the right and the purse/stars/language cluster on the left, which
   * is what an Arabic reader expects. What it cannot do is turn the chevrons
   * round or mirror Elias, so those are handled by hand.
   */
  const rtl = useRtl();
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 p-3 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="pointer-events-auto flex items-center gap-2">
          {canGoBack && (
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label={copy.ui.back}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/95 font-display text-lg font-black text-[#2b4a66] shadow-hud backdrop-blur-sm"
            >
              {rtl ? '›' : '‹'}
            </motion.button>
          )}
          {/*
            On a phone this capsule used to wrap to three lines and shove the
            quest panel down the screen, so the eyebrow goes and the title
            stays on one.
          */}
          <div className="flex min-w-0 items-center gap-2 rounded-full bg-white/95 py-1.5 pl-1.5 pr-4 shadow-hud backdrop-blur-sm">
            <img src={art('ui-coin')} alt="" width={30} height={30} className="shrink-0" />
            <div className="min-w-0 leading-tight">
              <p className="hidden font-display text-[10px] font-extrabold uppercase tracking-wide text-[#8296ad] sm:block">
                {copy.chrome.eyebrow}
              </p>
              <p className="truncate font-display text-sm font-extrabold leading-tight text-[#2b4a66]">
                {copy.chrome.title}
              </p>
            </div>
          </div>
        </div>

        {/*
          Stars, purse and language now sit together on the right: they are all
          "how am I doing / what are my controls", and the star row used to be
          stranded on its own line under the progress bar.
        */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="hidden items-center gap-1 rounded-full bg-white/95 px-3 py-2 shadow-hud backdrop-blur-sm sm:flex">
            <StarRow earned={stars} total={TOTAL_STARS} />
          </div>
          <Purse coins={coins} flyKey={flyKey} />
          {/*
            The notebook, reachable from inside the chapter.
            It sits with the purse because it is the other thing the learner
            is filling up — and because the quiz and the dead end now tell
            them to go and look at it, which only works if it is in reach.
          */}
          <motion.button
            onClick={onBook}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            aria-label={nb.open}
            className="relative grid h-11 w-11 place-items-center rounded-full bg-white/95 shadow-hud backdrop-blur-sm"
          >
            <NotebookMark size={21} />
            {pages > 0 && (
              <span className="absolute -top-1 -end-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-[#c98a52] px-1 font-display text-[10px] font-black text-white shadow">
                {pages}
              </span>
            )}
          </motion.button>
          <FlagSwitch className="bg-white/95 shadow-hud backdrop-blur-sm" />
          <motion.button
            onClick={onExit}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            aria-label={copy.chrome.leave}
            className="grid h-11 w-11 place-items-center rounded-full bg-white/95 font-display text-lg font-black text-[#2b4a66] shadow-hud backdrop-blur-sm"
          >
            ✕
          </motion.button>
        </div>
      </div>

      {/*
        Exactly one progress indicator, on its own line. The dots, the quest
        strip and the puzzle chip used to be laid on top of one another here.
      */}
      <div className="mt-1.5 flex items-center justify-center gap-3">
        <div className="hidden items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 shadow-hud backdrop-blur-sm lg:flex">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${
                i < step ? 'w-2 bg-[#5fc14e]' : i === step ? 'w-6 bg-[#3aa9e8]' : 'w-2 bg-[#dde3ec]'
              }`}
            />
          ))}
        </div>
        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/50 lg:hidden">
          <div
            className="h-full rounded-full bg-[#5fc14e] transition-all duration-500"
            style={{ width: `${(step / (total - 1)) * 100}%` }}
          />
        </div>
        <div className="rounded-full bg-white/90 px-2 py-1 shadow-hud sm:hidden">
          <StarRow earned={stars} total={TOTAL_STARS} />
        </div>
      </div>
    </div>
  );
}

/** The bottom dialogue rail every talking beat shares. */
/** Speech positions itself now — this just keeps the call sites tidy. */
function Rail({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/**
 * Elias arrives.
 *
 * He used to simply be there, as a 96px circle, from the first line. Now he
 * walks in over a dimmed market, holds the screen alone while he introduces
 * himself by name, and only then does the board appear behind him. The five
 * drawn expressions are mapped to what he is actually doing: greeting,
 * explaining, remembering, and finally inviting the learner in.
 */
const ELDER_POSES: EliasPose[] = ['pleased', 'speaking'];

function ElderBeat({
  name,
  onNote,
  onNext,
}: {
  name: string;
  onNote: (entry: string) => void;
  onNext: () => void;
}) {
  const copy = useCopy();
  const [i, setI] = useState(0);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setEntered(true), 900);
    sfx('select');
    return () => window.clearTimeout(id);
  }, []);

  // line 0 greets them by name if we have one from their profile
  const lines = useMemo(() => {
    const l = [...copy.elder.lines];
    if (name) l[0] = fillText(copy.elder.greeting, { name });
    return [...l, copy.elder.invite];
  }, [copy, name]);

  const last = i === lines.length - 1;

  return (
    <>
      {/* he holds the whole screen while he introduces himself */}
      <motion.div
        className="absolute inset-0 z-[5] bg-[#0b2740]"
        initial={{ opacity: 0.55 }}
        animate={{ opacity: last ? 0.5 : entered ? 0.18 : 0.55 }}
        transition={{ duration: 0.8 }}
      />

      <Rail>
        <Panel
          speaker={copy.elder.name}
          look="elder"
          pose={last ? 'pointing' : (ELDER_POSES[i] ?? 'speaking')}
          text={lines[i]}
          button={last ? copy.elder.enter : copy.ui.continue}
          onNext={() => {
            sfx('tap');
            // the barter definition is worth writing down the moment it is
            // said — it is now the second line, since the elder's opening was
            // merged from four lines into two
            if (i === 1) onNote('barter');
            if (last) onNext();
            else setI(i + 1);
          }}
        />
      </Rail>
    </>
  );
}

/* ------------------------------- the beats -------------------------------- */

function TitleBeat({ onNext }: { onNext: () => void }) {
  const copy = useCopy();
  return (
    <div className="absolute inset-0 grid place-items-center px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        className="relative w-full max-w-xl rounded-[32px] bg-white/95 p-7 text-center shadow-hud-lg backdrop-blur-sm sm:p-9"
      >
        <img
          src={art('coin-front')}
          alt=""
          className="mx-auto mb-4 h-24 w-24 object-contain drop-shadow-md"
        />
        <p className="font-display text-xs font-extrabold uppercase tracking-widest text-[#8296ad]">
          {copy.title.eyebrow}
        </p>
        <h1 className="mt-1 text-balance font-display text-3xl font-extrabold leading-tight text-[#1f3a5f] sm:text-4xl">
          {copy.title.heading}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-pretty text-[15px] font-semibold leading-relaxed text-[#5b7290]">
          {copy.title.lead}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2 text-[12px] font-bold text-[#6f87a6]">
          <span className="rounded-full bg-[#f1f6fb] px-3 py-1.5">⏱ {copy.title.minutes}</span>
          <span className="rounded-full bg-[#f1f6fb] px-3 py-1.5">🧩 {copy.title.puzzles}</span>
          <span className="rounded-full bg-[#f1f6fb] px-3 py-1.5">🪙 {copy.title.idea}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            sfx('tap');
            onNext();
          }}
          className="mt-6 rounded-full bg-gradient-to-b from-[#5cc5f5] to-[#2f9ae0] px-8 py-3.5 font-display text-base font-extrabold text-white shadow-hud"
        >
          {copy.title.start}
        </motion.button>
      </motion.div>
    </div>
  );
}

/**
 * The opening question, asked from the child's own life.
 *
 * The chapter used to begin by presenting a 2,650-year-old coin to someone who
 * had not yet been given a reason to care about coins. Starting from chocolate
 * and toys — things they already know cost money — and only then pulling the
 * money away is the same information in the order a person can actually use.
 */
function HookBeat({ onNext }: { onNext: () => void }) {
  const copy = useCopy();
  const [i, setI] = useState(0);
  const last = i === copy.hook.lines.length - 1;
  const POSES: EliasPose[] = ['neutral', 'thinking', 'pointing'];
  return (
    <Rail>
      <Panel
        speaker={copy.elder.name}
        look="elder"
        pose={POSES[i] ?? 'speaking'}
        text={copy.hook.lines[i]}
        button={last ? copy.hook.next : copy.ui.continue}
        onNext={() => {
          sfx('tap');
          if (last) onNext();
          else setI(i + 1);
        }}
      />
    </Rail>
  );
}

function CoinBeat({ onNext }: { onNext: () => void }) {
  const copy = useCopy();
  const [flipped, setFlipped] = useState(false);
  const year = new Date().getFullYear();
  const ago = Math.round((year + 637) / 50) * 50;

  return (
    <div className="absolute inset-0 grid place-items-center overflow-y-auto px-4 py-20">
      <div className="grid w-full max-w-4xl items-center gap-6 rounded-[32px] bg-white/95 p-6 shadow-hud-lg backdrop-blur-sm sm:grid-cols-[260px_1fr] sm:p-8">
        <div className="text-center">
          <button
            onClick={() => {
              sfx('pay');
              setFlipped((f) => !f);
            }}
            aria-label="Flip the coin"
            className="mx-auto block h-44 w-44"
            style={{ perspective: 900 }}
          >
            <div
              className="relative h-full w-full transition-transform duration-700"
              style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : undefined }}
            >
              <img
                src={art('coin-front')}
                alt="Front of an ancient coin showing a grazing stag"
                className="absolute inset-0 h-full w-full object-contain drop-shadow-lg"
                style={{ backfaceVisibility: 'hidden' }}
              />
              <img
                src={art('coin-back')}
                alt="Back of the coin with rough punch marks"
                className="absolute inset-0 h-full w-full object-contain drop-shadow-lg"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              />
            </div>
          </button>
          <p
            className={`mt-2 text-[13px] font-bold text-[#8296ad] transition-opacity ${flipped ? 'opacity-0' : ''}`}
          >
            {copy.coin.tapHint}
          </p>
        </div>

        <div>
          <p className="font-display text-xs font-extrabold uppercase tracking-widest text-[#8296ad]">
            {copy.coin.eyebrow}
          </p>
          <h2 className="mt-1 text-balance font-display text-2xl font-extrabold leading-tight text-[#1f3a5f]">
            {copy.coin.heading}
          </h2>
          <p className="my-2 font-display text-3xl font-extrabold text-[#f0a500]">{copy.coin.date}</p>
          <p className="text-pretty text-[15px] font-semibold leading-relaxed text-[#5b7290]">
            {rich(fillText(copy.coin.body, { years: ago.toLocaleString() }))}
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#f1f6fb] p-3">
              <b className="block font-display text-[13px] text-[#2b4a66]">{copy.coin.madeOfQ}</b>
              <span className="text-[13px] font-semibold leading-snug text-[#6f87a6]">
                {copy.coin.madeOfA}
              </span>
            </div>
            <div className="rounded-2xl bg-[#f1f6fb] p-3">
              <b className="block font-display text-[13px] text-[#2b4a66]">{copy.coin.onItQ}</b>
              <span className="text-[13px] font-semibold leading-snug text-[#6f87a6]">
                {copy.coin.onItA}
              </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              sfx('tap');
              onNext();
            }}
            className="mt-5 rounded-full bg-gradient-to-b from-[#5cc5f5] to-[#2f9ae0] px-6 py-3 font-display text-sm font-extrabold text-white shadow-hud"
          >
            {copy.coin.next}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

/**
 * The swapping answer used to be hard-coded to the third button in every
 * language, so a second run taught position rather than meaning. The options
 * are shuffled per mount and matched by identity instead.
 */
const RIGHT_GUESS = 2;

function GuessBeat({ onNext }: { onNext: () => void }) {
  const copy = useCopy();
  const seed = useMemo(() => Math.floor(Math.random() * 1e9) + 1, []);
  const order = useMemo(
    () => shuffled(copy.guess.options.map((_, i) => i), seed),
    [copy, seed],
  );
  const [picked, setPicked] = useState<number[]>([]);
  const solved = picked.includes(RIGHT_GUESS);
  const last = picked.length ? copy.guess.options[picked[picked.length - 1]] : null;

  return (
    <div className="absolute inset-0 grid place-items-center px-4">
      <div className="w-full max-w-xl rounded-[32px] bg-white/95 p-7 shadow-hud-lg backdrop-blur-sm">
        <p className="font-display text-xs font-extrabold uppercase tracking-widest text-[#8296ad]">
          {copy.guess.eyebrow}
        </p>
        <h2 className="mt-1 text-balance font-display text-2xl font-extrabold leading-tight text-[#1f3a5f]">
          {copy.guess.heading}
        </h2>
        <div className="mt-4 grid gap-2.5">
          {order.map((i) => {
            const o = copy.guess.options[i];
            const chosen = picked.includes(i);
            const correct = i === RIGHT_GUESS;
            return (
              <button
                key={i}
                disabled={solved}
                onClick={() => {
                  if (picked.includes(i)) return;
                  sfx(correct ? 'happy' : 'wrong');
                  setPicked((p) => [...p, i]);
                }}
                className={`text-pretty rounded-2xl border-2 px-4 py-3 text-start font-display text-[15px] font-extrabold leading-snug transition-colors ${
                  chosen && correct
                    ? 'border-[#5fc14e] bg-[#eafbe4] text-[#2d6a31]'
                    : chosen
                      ? 'border-[#f3a0a0] bg-[#ffecec] text-[#a33a3a]'
                      : 'border-[#e2eaf2] bg-white text-[#2b4a66] hover:border-[#9fdcff]'
                }`}
              >
                {o.text}
              </button>
            );
          })}
        </div>
        {last && (
          <p
            className={`mt-3 text-pretty rounded-2xl px-4 py-3 text-[14px] font-bold leading-snug ${
              solved ? 'bg-[#eafbe4] text-[#2d6a31]' : 'bg-[#fff6e0] text-[#8a5f1a]'
            }`}
          >
            {last.feedback}
          </p>
        )}
        {solved && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => {
              sfx('tap');
              onNext();
            }}
            className="mt-4 w-full rounded-full bg-gradient-to-b from-[#5cc5f5] to-[#2f9ae0] px-6 py-3 font-display text-sm font-extrabold text-white shadow-hud"
          >
            {copy.guess.next}
          </motion.button>
        )}
      </div>
    </div>
  );
}

type VillagePhase = 'intro' | 'play' | 'outro' | 'lesson' | 'deadend';

function VillageBeat({
  index,
  onNext,
  onTrade,
  onResult,
  onNote,
  onBook,
}: {
  index: number;
  onNext: () => void;
  onTrade: () => void;
  onResult: (r: VillageResult) => void;
  onNote: (entry: string, evidence?: ReactNode) => void;
  onBook: () => void;
}) {
  const copy = useCopy();
  const sc = SCENARIOS[index];
  const text = copy.villages[index];
  const info = useMemo(() => analyse(sc), [sc]);
  const [phase, setPhase] = useState<VillagePhase>('intro');
  const [line, setLine] = useState(0);
  const [tip, setTip] = useState(text.instruction);
  const [state, setState] = useState<BoardState | null>(null);
  const [outcome, setOutcome] = useState<'solved' | 'stuck' | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [outroLine, setOutroLine] = useState(0);
  const [star, setStar] = useState(false);
  const [showStar, setShowStar] = useState(false);
  const hintRef = useRef<(() => void) | undefined>(undefined);
  const reported = useRef(false);

  /**
   * Who says each of the closing lines.
   *
   * Two of them are a quarrel between the villager stuck with the wood and the
   * one holding the bread he wants — and Elias was reading both parts aloud
   * like a narrator. They are now spoken by the villagers themselves, with
   * their own faces beside the words.
   */
  const stuckLines = useMemo(() => {
    if (!state) return [];
    const woodV = { name: copy.goods[sc.carry].name, look: 'elder' as const };
    const breadV = state.merchants.find((m) => m.has === sc.goal);
    if (!breadV) return [];
    return copy.stuck.lines.map((l, idx) => {
      const theirName = copy.names[breadV.id] ?? breadV.name;
      const text = l.split('{wood}').join(woodV.name).split('{bread}').join(theirName);
      if (idx === 1) return { text, who: copy.elder.name, look: 'elder' as const };
      return { text, who: copy.elder.name, look: 'elder' as const };
    });
  }, [state, copy, sc]);

  const handleResolved = useCallback(
    (o: 'solved' | 'stuck', s: BoardState) => {
      setState(s);
      setOutcome(o);
      if (!reported.current) {
        reported.current = true;
        const won = earnedStar(s.trades, s.par, s.hintRung >= 3);
        setStar(won);
        if (won) {
          sfx('star');
          setShowStar(true);
          window.setTimeout(() => setShowStar(false), 2600);
        } else {
          sfx('villageWin');
        }
        onResult({
          index,
          trades: s.trades,
          happy: s.merchants.filter((m) => m.done).length,
          maxHappy: s.merchants.length,
          par: s.par,
          steps: s.steps,
          star: won,
          hintRung: s.hintRung,
        });
        track(o === 'stuck' ? 'village_stuck' : 'village_solved', {
          index,
          trades: s.trades,
          par: s.par,
          steps: s.steps,
          hints: s.hintRung,
          star: won,
        });
      }
      if (o === 'stuck') {
        sfx('dusk');
      }
      setOutroLine(0);
      setPhase('outro');
    },
    [index, onResult],
  );

  /** The outro now reports what actually happened, not a hard-coded "4". */
  const outro = useMemo((): { text: string; who: string; look: string }[] => {
    if (outcome === 'stuck') return stuckLines;
    const asElias = (t: string) => ({ text: t, who: copy.elder.name, look: 'elder' as const });
    const filled = text.outro.map((l) =>
      asElias(fillText(l, { trades: state?.trades ?? 0, steps: state?.steps ?? 0, par: info.par })),
    );
    // Telling a child "the fewest trades possible!" after a single obvious
    // swap is noise, and saying the identical sentence five times is worse.
    // Each puzzle gets its own line, and only from the third — where there is
    // genuinely a better and a worse way through — is falling short remarked on.
    const praise = copy.ui.perfect[index] ?? copy.ui.perfect[copy.ui.perfect.length - 1];
    // On the first two puzzles the outro already celebrates, and the star
    // pops on screen — a second sentence from Elias saying the same thing is
    // just one more tap between the child and the next market.
    if (index < 2) return filled;
    if (star) return [...filled, asElias(praise)];
    return [...filled, asElias(fillText(copy.ui.overPar, { par: info.par }))];
  }, [outcome, stuckLines, text.outro, state, info.par, star, index, copy]);

  const board = (
    <QuestBoard
      scenario={sc}
      live={phase === 'play'}
      resetKey={resetKey}
      onState={setState}
      onTip={setTip}
      onTrade={onTrade}
      showTour={index === 0}
      onResolved={handleResolved}
      onHintReady={(fn: () => void) => (hintRef.current = fn)}
    />
  );

  return (
    <>
      {/*
        The market gets the whole screen below the chrome; everything that is
        *about* the puzzle rather than *in* it lives in one column at the
        edge. Under `dir="rtl"` the row reverses on its own, so the column
        lands on the side an Arabic reader expects.
      */}
      <div className="absolute inset-x-0 bottom-0 top-[58px] flex flex-col gap-2 p-2 sm:top-[74px] sm:flex-row sm:gap-3 sm:p-3">
        {phase !== 'intro' && state && (
          <div className="w-full shrink-0 sm:h-full sm:w-[196px] lg:w-[224px]">
            <QuestPanel
              clientName={copy.names[sc.client] ?? sc.client}
              clientLook={PEOPLE[sc.client].look}
              goal={sc.goal}
              index={index}
              total={SCENARIOS.length}
              par={info.par}
              trades={state.trades}
              instruction={tip}
              hintRung={state.hintRung}
              onHint={() => hintRef.current?.()}
              onReset={() => {
                sfx('tap');
                setResetKey((k) => k + 1);
                setTip(text.instruction);
              }}
            />
          </div>
        )}
        <div className="relative min-w-0 flex-1">{board}</div>
      </div>

      <Rail>
        {phase === 'intro' && (
          <Panel
            speaker={copy.elder.name}
            look="elder"
            pose={line === text.intro.length - 1 ? 'pointing' : 'speaking'}
            text={text.intro[line]}
            button={line === text.intro.length - 1 ? copy.ui.letsTrade : copy.ui.continue}
            onNext={() => {
              sfx('tap');
              if (line === text.intro.length - 1) setPhase('play');
              else setLine(line + 1);
            }}
          />
        )}
        {phase === 'deadend' && (
          <Panel
            speaker={copy.elder.name}
            look="elder"
            pose="thinking"
            text={copy.deadEnd.line}
            button={copy.deadEnd.retry}
            onNext={() => {
              sfx('tap');
              setResetKey((k) => k + 1);
              setTip(text.instruction);
              setOutcome(null);
              setPhase('play');
            }}
          />
        )}
        {/*
          On the market nobody can solve, their own rule is the thing worth
          re-reading — and discovering that it does not save them either is
          exactly the point the chapter is making.
        */}
        {phase === 'outro' && (
          <Panel
            speaker={outro[outroLine]?.who ?? copy.elder.name}
            look={(outro[outroLine]?.look ?? 'elder') as Look}
            elias={(outro[outroLine]?.look ?? 'elder') === 'elder'}
            pose={outcome === 'stuck' ? 'thinking' : 'pleased'}
            text={outro[outroLine]?.text ?? ''}
            extras={outcome === 'stuck' ? <LookItUp onClick={onBook} /> : undefined}
            button={
              outroLine === outro.length - 1
                ? outcome === 'stuck'
                  ? copy.stuck.next
                  : text.lesson
                    ? copy.ui.continue
                    : copy.ui.nextVillage
                : copy.ui.continue
            }
            onNext={() => {
              sfx('tap');
              if (outroLine < outro.length - 1) {
                setOutroLine(outroLine + 1);
                return;
              }
              if (text.lesson) setPhase('lesson');
              else onNext();
            }}
          />
        )}
      </Rail>

      {outcome === 'solved' && phase === 'outro' && <Confetti />}

      {/* the village star, awarded on the spot rather than silently at the end */}
      {/* the star pops in the middle, is readable, then leaves of its own accord */}
      <AnimatePresence>
        {showStar && (
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: [0.3, 1.15, 1], opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0, y: -40 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="pointer-events-none absolute inset-0 z-[60] grid place-items-center"
          >
            <div className="flex items-center gap-3 rounded-[28px] bg-white px-7 py-5 shadow-hud-lg">
              <motion.img
                src={art('ui-star')}
                alt=""
                width={44}
                height={44}
                animate={{ rotate: [0, -14, 10, 0] }}
                transition={{ duration: 0.7 }}
              />
              <span className="font-display text-xl font-extrabold text-[#b5820f]">
                {copy.ui.starEarned}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'lesson' && text.lesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 grid place-items-center bg-[#0b2740]/50 px-4 backdrop-blur-[2px]"
          >
            <motion.div
              initial={{ scale: 0.86, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 20 }}
              className="w-full max-w-md rounded-[32px] bg-white p-7 text-center shadow-hud-lg"
            >
              <p className="font-display text-3xl font-extrabold text-[#f0a500]">{text.lesson.big}</p>
              <h3 className="mt-2 text-balance font-display text-xl font-extrabold leading-tight text-[#1f3a5f]">
                {rich(text.lesson.title)}
              </h3>
              <p className="mt-2 text-pretty text-[15px] font-semibold leading-relaxed text-[#5b7290]">
                {rich(text.lesson.text)}
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <Good good="bread" size={40} />
                <span className="font-display text-xl font-black text-[#9fb4c8]">→</span>
                <Good good="apples" size={40} />
                <span className="font-display text-xl font-black text-[#9fb4c8]">→</span>
                <Good good="fish" size={40} />
              </div>
              <button
                onClick={() => {
                  sfx('tap');
                  // the rule goes to the notebook with the learner's own
                  // run attached: they are not reading about a chain of
                  // trades, they are reading the one they just walked
                  onNote('chain', <TradeTrail start={sc.carry} trail={state?.trail ?? []} />);
                  onNext();
                }}
                className="mt-5 w-full rounded-full bg-gradient-to-b from-[#5cc5f5] to-[#2f9ae0] px-6 py-3 font-display text-sm font-extrabold text-white shadow-hud"
              >
                {copy.ui.gotIt}
              </button>
            </motion.div>
            <Confetti n={18} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * The learner's own chain of trades, drawn as they walked it.
 *
 * `bread → Mira → apples → Finn → fish`. The solver has always known a path
 * through each market; what it did not know was *theirs*, and a rule
 * illustrated by the thing you just did lands differently from the same rule
 * illustrated by two strangers.
 */
function TradeTrail({ start, trail }: { start: GoodKey; trail: Trade[] }) {
  const copy = useCopy();
  const rtl = useRtl();
  const arrow = rtl ? '←' : '→';
  if (!trail.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
      <Good good={start} size={30} />
      {trail.map((t, i) => (
        <span key={i} className="flex items-center gap-x-1.5">
          <span className="font-display text-sm font-black text-[#c98a52]">{arrow}</span>
          <span className="rounded-full bg-[#f3e4c6] px-2 py-0.5 font-display text-[11px] font-extrabold text-[#8a5f1a]">
            {copy.names[t.who] ?? t.who}
          </span>
          <span className="font-display text-sm font-black text-[#c98a52]">{arrow}</span>
          <Good good={t.got} size={30} />
        </span>
      ))}
    </div>
  );
}

function MoneyBeat({ onNext, onPaid }: { onNext: () => void; onPaid: () => void }) {
  const copy = useCopy();
  const [phase, setPhase] = useState<'intro' | 'play' | 'outro'>('intro');
  const [line, setLine] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [outroLine, setOutroLine] = useState(0);

  const intro = copy.money.intro;
  const outro = [copy.money.finn, ...copy.money.outro];

  return (
    <>
      <div className="absolute inset-x-0 top-24 z-10 flex justify-center px-3 sm:top-28">
        <div className="flex items-center gap-3 rounded-full bg-white/95 px-4 py-2 shadow-hud backdrop-blur-sm">
          <span className="rounded-full bg-[#fff4d6] px-2.5 py-0.5 font-display text-[11px] font-extrabold text-[#8a5f1a]">
            {copy.money.tag}
          </span>
          <span className="font-display text-sm font-extrabold leading-tight text-[#2b4a66]">
            {copy.money.heading}
          </span>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[78px] top-[112px] sm:bottom-[86px] sm:top-[124px]">
        <MoneyChain
          live={phase === 'play'}
          onPrompt={setPrompt}
          onPaid={onPaid}
          onDone={() => {
            setOutroLine(0);
            setPhase('outro');
          }}
        />
      </div>

      <Rail>
        {phase === 'intro' && (
          <Panel
            speaker={line === intro.length - 1 ? copy.money.traveller : copy.elder.name}
            look={line === intro.length - 1 ? 'trader' : 'elder'}
            elias={line !== intro.length - 1}
            pose="pointing"
            text={intro[line]}
            button={line === intro.length - 1 ? copy.money.help : copy.ui.continue}
            onNext={() => {
              sfx('tap');
              if (line === intro.length - 1) setPhase('play');
              else setLine(line + 1);
            }}
          />
        )}
        {phase === 'play' && (
          <Panel speaker={copy.elder.name} look="elder" pose="pointing" text={prompt} />
        )}
        {phase === 'outro' && (
          <Panel
            speaker={outroLine === 0 ? (copy.names.finn ?? 'Finn') : copy.elder.name}
            look={outroLine === 0 ? 'fisher' : 'elder'}
            elias={outroLine !== 0}
            pose="pleased"
            text={outro[outroLine]}
            button={outroLine === outro.length - 1 ? copy.money.next : copy.ui.continue}
            onNext={() => {
              sfx('tap');
              if (outroLine === outro.length - 1) onNext();
              else setOutroLine(outroLine + 1);
            }}
          />
        )}
      </Rail>

      {phase === 'outro' && <Confetti />}
    </>
  );
}

/**
 * The quiz used to be a plain multiple-choice card floating on an empty room,
 * and a wrong answer got "Not quite — try again!" with no reason, which made it
 * the weakest feedback in a chapter whose barter board has the best. Now Elias
 * asks the questions from the usual rail, every distractor has its own
 * explanation that points back at something the child actually did, and the
 * last question is a little board to read rather than a date to recall.
 */
function QuizBeat({
  onNext,
  onCorrect,
  onBook,
}: {
  onNext: () => void;
  onCorrect: () => void;
  onBook: () => void;
}) {
  const copy = useCopy();
  const [k, setK] = useState(0);
  const [tried, setTried] = useState<number[]>([]);
  const seed = useMemo(() => Math.floor(Math.random() * 1e9) + 1, []);
  const def = QUIZ[k];
  const words = copy.quiz.items[k];
  const order = useMemo(() => shuffled(def.options.map((_, i) => i), seed + k), [def, seed, k]);
  const right = tried.includes(def.answer);
  const lastWrong = tried.length && !right ? tried[tried.length - 1] : null;

  const pick = (j: number) => {
    if (right || tried.includes(j)) return;
    const first = tried.length === 0;
    setTried((t) => [...t, j]);
    if (j === def.answer) {
      sfx('happy');
      if (first) onCorrect();
    } else {
      sfx('wrong');
    }
  };

  return (
    <>
      {/*
        `grid place-items-center` + `overflow-y-auto` centres the card and then
        refuses to scroll above it, so on a short window the answers and the
        Finish button were simply unreachable. A flex column with `my-auto`
        centres when there is room and scrolls properly when there is not.
      */}
      <div className="absolute inset-x-0 bottom-[96px] top-[66px] overflow-y-auto px-4">
        <div className="my-auto flex min-h-full flex-col justify-center py-3">
        <div className="mx-auto w-full max-w-xl rounded-[32px] bg-white/95 p-6 shadow-hud-lg backdrop-blur-sm sm:p-7">
          <p className="font-display text-xs font-extrabold uppercase tracking-widest text-[#8296ad]">
            {fillText(copy.quiz.eyebrow, { n: k + 1, total: QUIZ.length })}
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e8eef5]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#5cc5f5] to-[#2f9ae0] transition-all"
              style={{ width: `${(k / QUIZ.length) * 100}%` }}
            />
          </div>

          {/* the transfer question gets a little market to read */}
          {def.diagram && (
            <div className="mt-3 flex items-end justify-center gap-4 rounded-2xl bg-[#f3f8fc] p-3">
              {def.diagram.map((v) => (
                <div key={v.id} className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1 rounded-full bg-white px-2 py-1 shadow-sm">
                    <Good good={v.has} size={22} />
                    <span className="font-display text-[11px] font-black text-[#9fb4c8]">→</span>
                    <Good good={v.need} size={22} />
                  </div>
                  <Portrait look={v.look} size={56} />
                  <span className="font-display text-[11px] font-extrabold text-[#2b4a66]">
                    {v.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          <h2 className="mt-3 text-balance font-display text-xl font-extrabold leading-snug text-[#1f3a5f]">
            {rich(words.q)}
          </h2>
          <div className="mt-4 grid gap-2.5">
            {order.map((j) => {
              const chosen = tried.includes(j);
              const correct = j === def.answer;
              return (
                <button
                  key={j}
                  disabled={right}
                  onClick={() => pick(j)}
                  className={`text-pretty rounded-2xl border-2 px-4 py-3 text-start font-display text-[15px] font-extrabold leading-snug transition-colors ${
                    chosen && correct
                      ? 'border-[#5fc14e] bg-[#eafbe4] text-[#2d6a31]'
                      : chosen
                        ? 'border-[#f3a0a0] bg-[#ffecec] text-[#a33a3a]'
                        : 'border-[#e2eaf2] bg-white text-[#2b4a66] hover:border-[#9fdcff]'
                  }`}
                >
                  {words.options[j]}
                </button>
              );
            })}
          </div>
          {/*
            A wrong answer used to be met with Elias explaining it. He still
            does — but the learner is also pointed back at the page they wrote
            themselves, which is the difference between being told the answer
            and knowing where their own answers are kept.
          */}
          {!right && tried.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex justify-center"
            >
              <LookItUp onClick={onBook} />
            </motion.div>
          )}
          {right && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => {
                sfx('tap');
                if (k === QUIZ.length - 1) onNext();
                else {
                  setK(k + 1);
                  setTried([]);
                }
              }}
              className="mt-4 w-full rounded-full bg-gradient-to-b from-[#5cc5f5] to-[#2f9ae0] px-6 py-3 font-display text-sm font-extrabold text-white shadow-hud"
            >
              {k === QUIZ.length - 1 ? copy.quiz.finish : copy.quiz.next}
            </motion.button>
          )}
        </div>
        </div>
      </div>

      {/* Elias stays in the room, and says why a wrong answer is wrong */}
      <Rail>
        <Panel
          speaker={copy.elder.name}
          look="elder"
          pose={right ? 'pleased' : lastWrong !== null ? 'thinking' : 'speaking'}
          text={
            right
              ? words.why
              : lastWrong !== null
                ? words.wrong[lastWrong] || copy.quiz.retry
                : copy.quiz.eyebrow.split('·')[0].trim()
          }
        />
      </Rail>
    </>
  );
}

function EndBeat({
  stars,
  totals,
  villages,
  coins,
  payments,
  quizRight,
  best,
  submitting,
  onFinish,
}: {
  stars: number;
  totals: { trades: number; steps: number; happy: number; hints: number; stars: number };
  villages: { steps: number; happy: number; maxHappy: number }[];
  coins: number;
  payments: number;
  quizRight: number;
  best: { stars: number; trades: number; coins: number } | null;
  submitting?: boolean;
  onFinish: () => void;
}) {
  const copy = useCopy();
  const [showLearned, setShowLearned] = useState(false);

  useEffect(() => {
    sfx('fanfare');
  }, []);

  /*
   * The honest comparison.
   *
   * It used to put every walk of all five puzzles against the six payments of
   * the coin chain, which is not the same market and a sharp child would say
   * so. It turns out the coin chain is *literally* Market Day's cast — the same
   * six villagers wanting the same six things, plus a traveller — so the two
   * can be set side by side exactly. Market Day is the last puzzle.
   */
  const marketDay = villages[villages.length - 1];
  const barter = Math.max(marketDay?.steps ?? totals.steps, 1);
  const money = Math.max(payments, 1);
  const widest = Math.max(barter, money);

  return (
    <div className="absolute inset-0 grid place-items-center overflow-y-auto px-4 py-24">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 18 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        className="w-full max-w-xl rounded-[32px] bg-white/95 p-6 text-center shadow-hud-lg backdrop-blur-sm sm:p-7"
      >
        <img src={art('medal')} alt="" className="mx-auto h-20 w-20 object-contain" />
        <p className="mt-1 font-display text-xs font-extrabold uppercase tracking-widest text-[#8296ad]">
          {copy.end.eyebrow}
        </p>
        <h2 className="mt-1 text-balance font-display text-2xl font-extrabold leading-tight text-[#1f3a5f]">
          {copy.end.heading}
        </h2>

        <div className="mt-3 flex justify-center">
          <StarRow earned={stars} total={TOTAL_STARS} />
        </div>
        <p className="mt-1 font-display text-[13px] font-extrabold text-[#5b7290]">
          {fillText(copy.end.stars, { n: stars, total: TOTAL_STARS })}
        </p>
        {best && best.stars === stars && best.trades === totals.trades && (
          <p className="mt-1 font-display text-[12px] font-extrabold text-[#b5820f]">★ {copy.end.badge}</p>
        )}

        {/* ------------------------- the comparison ------------------------- */}
        <div className="mt-5 rounded-2xl bg-[#f3f8fc] p-4 text-left">
          <p className="font-display text-[13px] font-extrabold text-[#2b4a66]">
            {copy.end.compareTitle}
          </p>
          <div className="mt-3 space-y-2">
            <Bar
              label={copy.end.compareBarter}
              value={barter}
              pct={(barter / widest) * 100}
              color="from-[#ffb36b] to-[#f08a3c]"
              unit={copy.ui.steps}
              note={
                marketDay
                  ? fillText(copy.ui.maxHappy, {
                      happy: marketDay.happy,
                      total: marketDay.maxHappy + 1,
                    })
                  : undefined
              }
            />
            <Bar
              label={copy.end.compareMoney}
              value={money}
              pct={(money / widest) * 100}
              color="from-[#7ddc63] to-[#3fae38]"
              unit={copy.ui.payments}
              note={copy.end.compareEveryone}
            />
          </div>
          <p className="mt-2 text-[12px] font-bold text-[#6f87a6]">{copy.end.compareNote}</p>
        </div>

        {/* ---------------------------- the stats --------------------------- */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat n={totals.trades} label={copy.end.statTrades} />
          <Stat n={totals.happy} label={copy.end.statHappy} />
          <Stat n={totals.hints} label={totals.hints === 1 ? copy.end.statHint : copy.end.statHints} />
          <Stat n={coins} label={copy.end.statCoins} icon="ui-coin" />
        </div>
        <p className="mt-2 font-display text-[12px] font-extrabold text-[#8296ad]">
          {fillText(copy.end.score, { score: quizRight, total: QUIZ.length })}
        </p>

        {/* -------------------------- what I learned ------------------------ */}
        <button
          onClick={() => {
            sfx('tap');
            setShowLearned((v) => !v);
          }}
          className="mt-4 w-full rounded-full bg-[#f1f6fb] px-4 py-2.5 font-display text-[13px] font-extrabold text-[#5b7290]"
        >
          {copy.end.learned} {showLearned ? '▾' : '▸'}
        </button>
        <AnimatePresence>
          {showLearned && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-2 grid gap-2 overflow-hidden text-left"
            >
              {copy.end.takeaways.map((line, i) => (
                <li key={i} className="flex items-start gap-3 rounded-2xl bg-[#f3f8fc] p-3">
                  <img
                    src={art(TAKEAWAYS[i]?.icon ?? 'fx-star')}
                    alt=""
                    width={26}
                    height={26}
                    className="mt-0.5 shrink-0"
                  />
                  <span className="text-pretty text-[14px] font-semibold leading-snug text-[#4a6680]">
                    {rich(line)}
                  </span>
                </li>
              ))}
              <li className="flex items-start gap-3 rounded-2xl bg-[#fffbf0] p-3 ring-1 ring-[#e9c88a]">
                <img src={art(DID_YOU_KNOW_ICON)} alt="" width={26} height={26} className="mt-0.5 shrink-0" />
                <span className="text-pretty text-[14px] font-semibold leading-snug text-[#8a6a3a]">
                  {rich(copy.end.didYouKnow)}
                </span>
              </li>
            </motion.ul>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={submitting}
          onClick={onFinish}
          className="mt-5 w-full rounded-full bg-gradient-to-b from-[#7ddc63] to-[#3fae38] px-6 py-3.5 font-display text-base font-extrabold text-white shadow-hud disabled:opacity-60"
        >
          {submitting ? copy.end.saving : copy.end.collect}
        </motion.button>
      </motion.div>
      <Confetti n={34} />
    </div>
  );
}

function Bar({
  label,
  value,
  pct,
  color,
  unit,
  note,
}: {
  label: string;
  value: number;
  pct: number;
  color: string;
  unit: string;
  note?: string;
}) {
  return (
    <div>
      <div className="mb-0.5 flex items-baseline justify-between">
        <span className="font-display text-[12px] font-extrabold text-[#5b7290]">{label}</span>
        <span className="font-display text-[12px] font-extrabold tabular-nums text-[#2b4a66]">
          {value} {unit}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(4, pct)}%` }}
          transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
        />
      </div>
      {note && <p className="mt-0.5 text-[11px] font-bold text-[#8296ad]">{note}</p>}
    </div>
  );
}

function Stat({ n, label, icon }: { n: number; label: string; icon?: string }) {
  return (
    <div className="rounded-2xl bg-[#f3f8fc] px-2 py-2.5 text-center">
      <div className="flex items-center justify-center gap-1">
        {icon && <img src={art(icon)} alt="" width={18} height={18} />}
        <span className="font-display text-xl font-extrabold tabular-nums text-[#1f3a5f]">{n}</span>
      </div>
      <div className="text-[10px] font-bold leading-tight text-[#8296ad]">{label}</div>
    </div>
  );
}
