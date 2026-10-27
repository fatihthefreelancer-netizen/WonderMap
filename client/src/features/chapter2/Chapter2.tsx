import { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHOICE_SCENES, QUIZ_ANSWERS, STALL_TOTAL, starsFor } from './content';
import { ChoiceQuestion } from './ChoiceQuestion';
import { BinaryJudge } from './BinaryJudge';
import { SortBuckets } from './SortBuckets';
import { OrderSlots } from './OrderSlots';
import { ServeCustomers, StallSummary } from './ServeCustomers';
import { art, art1, Big, ConceptCard, Confetti, fill, Item, Pane, rich, scene, scene2, useCh2Copy, Wallet } from './pieces';
import { Panel } from '../barter/Dialogue';
import { FlagSwitch } from '../../components/ui/FlagSwitch';
import type { ChapterResult } from '../barter/BarterChapter';
import { NotePage } from '../../components/notebook/WritePage';
import { NotebookRecall } from '../../components/notebook/Recall';
import { NotebookDrawer } from '../../components/notebook/Drawer';
import { LookItUp, NotebookMark, useNoteUi } from '../../components/notebook/Leaf';
import { useAuthStore } from '../../store/authStore';

/**
 * World 1 · Chapter 2 — "Why do people pay money?"
 *
 * The spec's ten screens, in order: a thought experiment in the desert, three
 * "right thing, right now" scenes, the blanket that was in all three, six
 * sellers to judge, the three kinds of value, small help versus big help, the
 * child's own stall, back to the desert, a recap quiz and the badge.
 *
 * The chrome, dialogue rail and painted-backdrop treatment are Chapter 1's, so
 * the two chapters read as one world.
 */

interface Props {
  onExit: () => void;
  onFinish: (r: ChapterResult) => void;
  submitting?: boolean;
}

type Screen =
  | { kind: 'recall' }
  | { kind: 'desert' }
  | { kind: 'scene'; index: number }
  | { kind: 'blanket' }
  | { kind: 'judge' }
  | { kind: 'judgeClose' }
  | { kind: 'sort' }
  | { kind: 'sortCard' }
  | { kind: 'order' }
  | { kind: 'stallIntro' }
  | { kind: 'stall' }
  | { kind: 'stallSummary' }
  | { kind: 'back' }
  | { kind: 'quiz' }
  | { kind: 'done' };

const SCREENS: Screen[] = [
  // ten seconds of what they already know, before anything new arrives
  { kind: 'recall' },
  { kind: 'desert' },
  ...CHOICE_SCENES.map((_, index) => ({ kind: 'scene', index }) as Screen),
  { kind: 'blanket' },
  { kind: 'judge' },
  { kind: 'judgeClose' },
  { kind: 'sort' },
  { kind: 'sortCard' },
  { kind: 'order' },
  { kind: 'stallIntro' },
  { kind: 'stall' },
  { kind: 'stallSummary' },
  { kind: 'back' },
  { kind: 'quiz' },
  { kind: 'done' },
];

/** Where each screen happens. */
type Place = { kind: 'scene' | 'png' | 'webp'; file: string; focus?: string };

/** What a wide painting keeps when the viewport is narrower than it is. */
const FOCUS: Record<string, string> = {
  'scene-desert': '26% center',
  'scene-track': '46% center',
  // framed past the painted child, so Maya is the only one freezing on screen
  'scene-mountain': '72% center',
  'scene-party': '34% center',
};

const PLACES: Record<string, Place> = {
  recall: { kind: 'scene', file: 'scene-desert' },
  desert: { kind: 'scene', file: 'scene-desert' },
  blanket: { kind: 'scene', file: 'scene-mountain' },
  judge: { kind: 'webp', file: 'scene-market' },
  judgeClose: { kind: 'webp', file: 'scene-market' },
  sort: { kind: 'webp', file: 'scene-courtyard' },
  sortCard: { kind: 'webp', file: 'scene-courtyard' },
  order: { kind: 'webp', file: 'scene-square' },
  stallIntro: { kind: 'webp', file: 'scene-souk' },
  stall: { kind: 'webp', file: 'scene-souk' },
  stallSummary: { kind: 'webp', file: 'scene-souk' },
  back: { kind: 'scene', file: 'scene-desert' },
  quiz: { kind: 'webp', file: 'scene-room' },
  done: { kind: 'webp', file: 'scene-overlook' },
};

export function Chapter2({ onExit, onFinish, submitting }: Props) {
  const copy = useCh2Copy();
  const [step, setStep] = useState(0);
  const screen = SCREENS[step];
  const next = useCallback(() => setStep((s) => Math.min(SCREENS.length - 1, s + 1)), []);

  const [coins, setCoins] = useState(0);
  const [stars, setStars] = useState(3);
  const [quizScore, setQuizScore] = useState(0);

  /**
   * The notebook, exactly as chapter 1 handles it: pages kept from before are
   * readable at any point, the page this chapter teaches is written by the
   * learner rather than awarded to them, and only what was actually written
   * is sent back as earned.
   */
  const savedNotes = useAuthStore((st) => st.user?.progress.notebook);
  const [written, setWritten] = useState<string[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [book, setBook] = useState(false);
  const earned = useMemo(
    () => Array.from(new Set([...(savedNotes ?? []), ...written])),
    [savedNotes, written],
  );
  const writeNote = useCallback((key: string) => {
    setWritten((w) => (w.includes(key) ? w : [...w, key]));
    setNote(key);
  }, []);

  const place =
    screen.kind === 'scene'
      ? ({ kind: 'scene', file: `scene-${CHOICE_SCENES[screen.index].bg}` } as Place)
      : (PLACES[screen.kind] ?? { kind: 'scene', file: 'scene-desert' });

  return (
    <div className="fixed inset-0 z-50 overflow-clip">
      <Backdrop place={place} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b2740]/20 via-transparent to-[#0b2740]/40" />

      <Chrome
        step={step}
        total={SCREENS.length}
        coins={coins}
        pages={earned.length}
        onBook={() => setBook(true)}
        onExit={onExit}
      />

      <AnimatePresence initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0"
        >
          {screen.kind === 'recall' && (
            <NotebookRecall earned={earned} exclude={['value']} onNext={next} />
          )}

          {screen.kind === 'desert' && <DesertScreen onNext={next} />}

          {screen.kind === 'scene' && (
            <ChoiceQuestion
              key={screen.index}
              scene={CHOICE_SCENES[screen.index]}
              onDone={() => next()}
            />
          )}

          {screen.kind === 'blanket' && (
            <Talk
              lines={copy.blanket.lines}
              note={copy.blanket.next}
              card={copy.blanket.card}
              onNext={next}
            />
          )}

          {screen.kind === 'judge' && <BinaryJudge onDone={() => next()} />}
          {screen.kind === 'judgeClose' && (
            <Talk lines={[copy.judge.close]} button={copy.judge.next} onNext={next} />
          )}

          {screen.kind === 'sort' && <SortBuckets onDone={() => next()} />}
          {/*
            The three kinds of value, and then the page about it — written by
            the learner, the same way chapter 1 writes its three.
          */}
          {screen.kind === 'sortCard' && (
            <Talk
              lines={[copy.sort.time]}
              button={copy.sort.next}
              card={copy.sort.card}
              onNext={() => writeNote('value')}
            />
          )}

          {screen.kind === 'order' && <OrderSlots onDone={() => next()} />}

          {screen.kind === 'stallIntro' && (
            <Talk lines={[...copy.stall.intro, copy.stall.walletLine]} extras={<Wallet coins={0} />} onNext={next} />
          )}
          {screen.kind === 'stall' && (
            <ServeCustomers
              onDone={(r) => {
                setCoins(r.coins);
                setStars(starsFor(r.mistakes));
                next();
              }}
            />
          )}
          {screen.kind === 'stallSummary' && (
            <StallSummary coins={coins} stars={stars} onNext={next} />
          )}

          {screen.kind === 'back' && (
            <Talk lines={copy.back.lines} note={copy.back.next} card={copy.back.card} onNext={next} />
          )}

          {screen.kind === 'quiz' && (
            <QuizScreen
              onBook={() => setBook(true)}
              onDone={(score) => {
                setQuizScore(score);
                next();
              }}
            />
          )}

          {screen.kind === 'done' && (
            <DoneScreen
              coins={coins}
              stars={stars}
              submitting={submitting}
              onFinish={() =>
                onFinish({
                  score: Math.round((quizScore / QUIZ_ANSWERS.length) * 100),
                  notebook: written,
                  badges: ['problem-solver'],
                  coins,
                })
              }
            />
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {note && (
          <NotePage
            entry={note}
            onClose={() => {
              setNote(null);
              next();
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {book && <NotebookDrawer earned={earned} onClose={() => setBook(false)} />}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/** The painted place behind the screen. */
function Backdrop({ place }: { place: Place }) {
  const src =
    place.kind === 'png' ? art(place.file) : place.kind === 'scene' ? scene2(place.file) : scene(place.file);
  return (
    <img
      src={src}
      alt=""
      draggable={false}
      className="absolute inset-0 h-full w-full select-none object-cover"
      style={{ objectPosition: place.focus ?? FOCUS[place.file] ?? 'center' }}
    />
  );
}

function Chrome({
  step,
  total,
  coins,
  pages,
  onBook,
  onExit,
}: {
  step: number;
  total: number;
  coins: number;
  pages: number;
  onBook: () => void;
  onExit: () => void;
}) {
  const copy = useCh2Copy();
  const nb = useNoteUi();
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-3 p-3 sm:p-4">
      <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/95 py-1.5 pe-4 ps-1.5 shadow-hud backdrop-blur-sm">
        <img src={art('ui-badge')} alt="" width={30} height={30} />
        <div className="leading-tight">
          <p className="font-display text-[10px] font-extrabold uppercase tracking-wide text-[#8296ad]">
            {copy.chrome.eyebrow}
          </p>
          <p className="font-display text-sm font-extrabold leading-tight text-[#2b4a66]">
            {copy.chrome.title}
          </p>
        </div>
      </div>

      <div className="hidden items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 shadow-hud backdrop-blur-sm lg:flex">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`h-2 rounded-full transition-all ${
              i < step ? 'w-2 bg-[#5fc14e]' : i === step ? 'w-6 bg-[#3aa9e8]' : 'w-2 bg-[#dde3ec]'
            }`}
          />
        ))}
      </div>

      <div className="pointer-events-auto flex items-center gap-2">
        {coins > 0 && (
          <div className="hidden sm:block">
            <Wallet coins={coins} />
          </div>
        )}
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
  );
}

/**
 * A talking screen: the guide works through his lines in the bottom rail, and a
 * vocabulary card can rise above it on the last line.
 */
function Talk({
  lines,
  button,
  card,
  note,
  extras,
  onNext,
}: {
  lines: string[];
  button?: string;
  card?: { title: string; text: string };
  /** the beat's takeaway, held above the rail rather than squeezed onto a button */
  note?: string;
  extras?: React.ReactNode;
  onNext: () => void;
}) {
  const copy = useCh2Copy();
  const [i, setI] = useState(0);
  const last = i === lines.length - 1;
  return (
    <>
      {last && (card || note) && (
        <div className="pointer-events-none absolute inset-x-0 bottom-[11.5rem] z-20 flex flex-col items-center gap-2 px-4 sm:bottom-[12.5rem]">
          {card && <ConceptCard title={card.title} text={card.text} />}
          {note && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-balance rounded-full bg-[#1f3a5f]/85 px-4 py-2 text-center font-display text-[13px] font-extrabold leading-snug text-white shadow-hud backdrop-blur-sm"
            >
              {note}
            </motion.p>
          )}
        </div>
      )}
      {/*
        No rail around the dialogue.

        `Panel` positions itself — Elias takes the whole screen and the tap
        that advances him is the screen. Wrapping him in a bottom strip broke
        both halves of that: `pointer-events-none` was inherited by everything
        inside, so nothing in the speech could be clicked, and his `inset-0`
        resolved against a 40px strip, which put the button below the fold.
        (Chapter 1 had the same rail and the same two symptoms.)
      */}
      <Panel
        speaker={copy.guide}
        look="elder"
        text={lines[i]}
        button={last ? (button ?? copy.ui.continue) : copy.ui.continue}
        extras={last ? extras : undefined}
        onNext={() => (last ? onNext() : setI(i + 1))}
      />
    </>
  );
}

/* ------------------------------ 2.0 / the desert --------------------------- */

function DesertScreen({ onNext }: { onNext: () => void }) {
  const copy = useCh2Copy();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<'gold' | 'water' | null>(null);
  const asking = i === copy.desert.lines.length - 1;

  if (picked) {
    return (
      <>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center pb-40">
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 20 }}
            className="h-[clamp(90px,18vh,180px)] w-[clamp(90px,18vh,180px)] drop-shadow-xl"
          >
            <Item item={picked === 'gold' ? 'gold' : 'water'} />
          </motion.div>
        </div>
        <Talk
          lines={[picked === 'gold' ? copy.desert.ifGold : copy.desert.ifWater, copy.desert.close]}
          button={copy.desert.next}
          onNext={onNext}
        />
      </>
    );
  }

  return (
    <>
      {asking && (
        <div className="pointer-events-none absolute inset-x-0 bottom-[11.5rem] z-20 flex justify-center px-4 sm:bottom-[12.5rem]">
          <div className="pointer-events-auto grid w-full max-w-lg grid-cols-2 gap-3">
            {(['gold', 'water'] as const).map((k) => (
              <motion.button
                key={k}
                onClick={() => setPicked(k)}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center rounded-[26px] border-[3px] border-white bg-white/95 p-3 shadow-hud-lg backdrop-blur-sm hover:border-[#9fdcff]"
              >
                <div className="h-[clamp(52px,11vh,100px)] w-[clamp(52px,11vh,100px)]">
                  <Item item={k} />
                </div>
                <span className="mt-1.5 text-pretty text-center font-display text-[13px] font-extrabold leading-tight text-[#2b4a66] sm:text-sm">
                  {k === 'gold' ? copy.desert.gold : copy.desert.water}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}
      {/*
        No rail around the dialogue.

        `Panel` positions itself — Elias takes the whole screen and the tap
        that advances him is the screen. Wrapping him in a bottom strip broke
        both halves of that: `pointer-events-none` was inherited by everything
        inside, so nothing in the speech could be clicked, and his `inset-0`
        resolved against a 40px strip, which put the button below the fold.
        (Chapter 1 had the same rail and the same two symptoms.)
      */}
      <Panel
        speaker={copy.guide}
        look="elder"
        text={copy.desert.lines[i]}
        button={copy.ui.continue}
        onNext={asking ? undefined : () => setI(i + 1)}
      />
    </>
  );
}

/* --------------------------------- 2.8 quiz -------------------------------- */

/** Shuffle each question's options once, keeping track of where the answer went. */
function useQuizDeck() {
  const copy = useCh2Copy();
  return useMemo(
    () =>
      copy.quiz.items.map((item, qi) => {
        const order = [0, 1, 2].slice(0, item.options.length);
        let h = (qi + 7) * 2654435761;
        for (let i = order.length - 1; i > 0; i--) {
          h = (h * 1103515245 + 12345) >>> 0;
          const j = h % (i + 1);
          [order[i], order[j]] = [order[j], order[i]];
        }
        return {
          q: item.q,
          why: item.why,
          options: order.map((o) => item.options[o]),
          answer: order.indexOf(QUIZ_ANSWERS[qi]),
        };
      }),
    [copy],
  );
}

function QuizScreen({
  onDone,
  onBook,
}: {
  onDone: (score: number) => void;
  onBook: () => void;
}) {
  const copy = useCh2Copy();
  const deck = useQuizDeck();
  const [k, setK] = useState(0);
  const [score, setScore] = useState(0);
  const [tried, setTried] = useState<number[]>([]);
  const Q = deck[k];
  const right = tried.includes(Q.answer);

  function pick(j: number) {
    if (right || tried.includes(j)) return;
    const first = tried.length === 0;
    setTried((t) => [...t, j]);
    if (j === Q.answer && first) setScore((s) => s + 1);
  }

  return (
    <div className="absolute inset-0 overflow-y-auto px-4 py-20">
      <div className="my-auto flex min-h-full flex-col justify-center">
      <Pane>
        <p className="font-display text-xs font-extrabold uppercase tracking-widest text-[#8296ad]">
          {fill(copy.quiz.eyebrow, { n: k + 1, total: deck.length })}
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e8eef5]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#5cc5f5] to-[#2f9ae0] transition-all"
            style={{ width: `${(k / deck.length) * 100}%` }}
          />
        </div>
        <h2 className="mt-3 text-balance font-display text-xl font-extrabold leading-snug text-[#1f3a5f]">
          {Q.q}
        </h2>
        <div className="mt-4 grid gap-2.5">
          {Q.options.map((o, j) => {
            const chosen = tried.includes(j);
            const correct = j === Q.answer;
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
                {o}
              </button>
            );
          })}
        </div>
        {tried.length > 0 && (
          <p
            className={`mt-3 text-pretty rounded-2xl px-4 py-3 text-[14px] font-bold leading-snug ${
              right ? 'bg-[#eafbe4] text-[#2d6a31]' : 'bg-[#fff6e0] text-[#8a5f1a]'
            }`}
          >
            {right ? Q.why : copy.quiz.retry}
          </p>
        )}
        {/* their own page, rather than the answer */}
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
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex justify-center">
            <Big
              tone="grass"
              onClick={() => {
                if (k === deck.length - 1) onDone(score);
                else {
                  setK(k + 1);
                  setTried([]);
                }
              }}
            >
              {k === deck.length - 1 ? copy.quiz.finish : copy.quiz.next}
            </Big>
          </motion.div>
        )}
      </Pane>
      </div>
    </div>
  );
}

/* --------------------------------- 2.9 done -------------------------------- */

function DoneScreen({
  coins,
  stars,
  submitting,
  onFinish,
}: {
  coins: number;
  stars: number;
  submitting?: boolean;
  onFinish: () => void;
}) {
  const copy = useCh2Copy();
  return (
    <div className="absolute inset-0 grid place-items-center overflow-y-auto px-4 py-20">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 18 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        className="w-full max-w-xl rounded-[32px] bg-white/95 p-7 text-center shadow-hud-lg backdrop-blur-sm"
      >
        <img src={art('ui-badge')} alt="" className="mx-auto h-24 w-24 object-contain drop-shadow" />
        <p className="mt-1 font-display text-xs font-extrabold uppercase tracking-widest text-[#8296ad]">
          {copy.done.eyebrow}
        </p>
        <h2 className="mt-1 text-balance font-display text-2xl font-extrabold leading-tight text-[#1f3a5f]">
          {copy.done.heading}
        </h2>
        <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#fff2cc] px-4 py-1.5 font-display text-sm font-extrabold text-[#8a5f1a]">
          <img src={art('ui-badge')} alt="" width={18} height={18} />
          {copy.done.badge}
        </p>

        <div className="mt-4 flex items-center justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <img
              key={i}
              src={art1('ui-star')}
              alt=""
              width={34}
              height={34}
              style={i < stars ? undefined : { filter: 'grayscale(1)', opacity: 0.35 }}
            />
          ))}
        </div>

        <p className="mt-3 font-display text-base font-extrabold text-[#2b4a66]">
          {rich(fill(copy.done.wallet, { coins }))}
        </p>

        <ul className="mt-5 grid gap-2.5 text-start">
          {copy.done.lines.map((line, i) => (
            <li key={i} className="flex items-start gap-3 rounded-2xl bg-[#f3f8fc] p-3">
              <img
                src={i === 0 ? art('ui-thought') : art('ui-pin')}
                alt=""
                width={28}
                height={28}
                className="mt-0.5 shrink-0"
              />
              <span className="text-pretty text-[14px] font-semibold leading-snug text-[#4a6680]">
                {rich(line)}
              </span>
            </li>
          ))}
        </ul>

        <Big tone="grass" disabled={submitting} onClick={onFinish} className="mt-6 w-full">
          {submitting ? copy.done.saving : copy.done.collect}
        </Big>
      </motion.div>
      <Confetti n={34} />
    </div>
  );
}

export { STALL_TOTAL };
