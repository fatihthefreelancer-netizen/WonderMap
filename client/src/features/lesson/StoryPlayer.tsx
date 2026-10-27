import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LearnerTier, MirrorAnswer } from '@wondermap/shared';
import type { Beat, Scene } from '../../content/story';
import { character } from '../../content/characters';
import { noteDef } from '../../content/notebook';
import { badgeDef } from '../../content/badges';
import { CharacterPortrait } from './CharacterPortrait';
import { Button } from '../../components/ui/Button';
import { useTc } from '../../i18n/useTc';
import { LeafButton, NoteLeaf, NotebookMark, useNoteUi } from '../../components/notebook/Leaf';
import { useT } from '../../i18n/useT';

export interface StoryResult {
  notebook: string[];
  badges: string[];
  mirror: MirrorAnswer[];
}

interface Props {
  scene: Scene;
  tier: LearnerTier;
  lessonTitle: string;
  onExit: () => void;
  onFinish: (result: StoryResult) => void;
}

type TcFn = (s: string) => string;

/** Translate every authored text field of a beat in one place. */
function localizeBeat(beat: Beat, tc: TcFn): Beat {
  switch (beat.kind) {
    case 'narration':
      return { ...beat, text: tc(beat.text), tap: beat.tap ? tc(beat.tap) : undefined };
    case 'line':
      return { ...beat, text: tc(beat.text), tap: beat.tap ? tc(beat.tap) : undefined };
    case 'concept':
      return {
        ...beat,
        title: beat.title ? tc(beat.title) : undefined,
        cards: beat.cards.map((c) => ({ ...c, text: tc(c.text) })),
      };
    case 'big':
      return { ...beat, text: tc(beat.text), sub: beat.sub ? tc(beat.sub) : undefined };
    case 'choice':
      return {
        ...beat,
        prompt: beat.prompt ? tc(beat.prompt) : undefined,
        options: beat.options.map((o) => ({
          ...o,
          label: tc(o.label),
          feedback: o.feedback ? tc(o.feedback) : undefined,
        })),
      };
    case 'predict':
      return {
        ...beat,
        prompt: tc(beat.prompt),
        options: beat.options.map((o) => ({ ...o, label: tc(o.label), feedback: tc(o.feedback) })),
      };
    case 'sort':
      return {
        ...beat,
        prompt: tc(beat.prompt),
        items: beat.items.map((it) => ({ ...it, label: tc(it.label), reason: tc(it.reason) })),
      };
    case 'mirror':
      return { ...beat, prompt: tc(beat.prompt), options: beat.options.map((o) => tc(o)) };
    default:
      return beat;
  }
}

export function StoryPlayer({ scene, tier, lessonTitle, onExit, onFinish }: Props) {
  const { tc } = useTc();
  const beats = useMemo(() => scene.build(tier), [scene, tier]);
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const collected = useMemo<StoryResult>(() => ({ notebook: [], badges: [], mirror: [] }), []);

  const beat = beats[index];
  const progress = (index / beats.length) * 100;

  const advance = () => {
    if (index + 1 >= beats.length) {
      onFinish(collected);
    } else {
      setIndex((v) => v + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-gradient-to-b from-[#fff4dd] via-[#ffe9c4] to-[#f6d9a8]">
      {/* top bar */}
      <div className="flex items-center gap-3 px-4 pt-4">
        <button
          onClick={onExit}
          aria-label="Leave lesson"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/80 shadow-soft"
        >
          ✕
        </button>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/60">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-grass-light to-grass"
            animate={{ width: `${Math.max(6, progress)}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 26 }}
          />
        </div>
        {scene.counterLabel && count > 0 && (
          <div className="shrink-0 rounded-full bg-[#6b4a1e] px-3 py-1 text-xs font-extrabold text-white">
            {tc(scene.counterLabel)}: {count}
          </div>
        )}
      </div>

      <p className="px-4 pt-2 text-center text-xs font-bold uppercase tracking-wider text-[#a5763a]">
        {tc(lessonTitle)}
      </p>

      {/* beat stage */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto p-4">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="w-full max-w-md"
          >
            <BeatView
              beat={localizeBeat(beat, tc)}
              onAdvance={advance}
              onTick={() => setCount((c) => c + 1)}
              onCollectNotebook={(t) => collected.notebook.push(t)}
              onCollectBadge={(b) => collected.badges.push(b)}
              onCollectMirror={(m) => {
                const i = collected.mirror.findIndex((x) => x.key === m.key);
                if (i >= 0) collected.mirror[i] = m;
                else collected.mirror.push(m);
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* --------------------------------- beats ---------------------------------- */

interface BeatViewProps {
  beat: Beat;
  onAdvance: () => void;
  onTick: () => void;
  onCollectNotebook: (term: string) => void;
  onCollectBadge: (badge: string) => void;
  onCollectMirror: (m: MirrorAnswer) => void;
}

function BeatView(props: BeatViewProps) {
  const { beat } = props;
  switch (beat.kind) {
    case 'narration':
      return <NarrationBeat beat={beat} onAdvance={props.onAdvance} />;
    case 'line':
      return <LineBeat beat={beat} onAdvance={props.onAdvance} />;
    case 'concept':
      return <ConceptBeat beat={beat} onAdvance={props.onAdvance} />;
    case 'big':
      return <BigBeat beat={beat} onAdvance={props.onAdvance} />;
    case 'choice':
      return <ChoiceBeat beat={beat} onAdvance={props.onAdvance} onTick={props.onTick} />;
    case 'predict':
      return <PredictBeat beat={beat} onAdvance={props.onAdvance} />;
    case 'sort':
      return <SortBeat beat={beat} onAdvance={props.onAdvance} />;
    case 'mirror':
      return <MirrorBeat beat={beat} onAdvance={props.onAdvance} onCollect={props.onCollectMirror} />;
    case 'notebook':
      return <NotebookBeat beat={beat} onAdvance={props.onAdvance} onCollect={props.onCollectNotebook} />;
    case 'badge':
      return <BadgeBeat beat={beat} onAdvance={props.onAdvance} onCollect={props.onCollectBadge} />;
    case 'reward':
      return <RewardBeat onAdvance={props.onAdvance} />;
    default:
      return null;
  }
}

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-3xl bg-white p-6 shadow-pop ${className}`}>{children}</div>
);

function NarrationBeat({ beat, onAdvance }: { beat: Extract<Beat, { kind: 'narration' }>; onAdvance: () => void }) {
  const { tc } = useTc();
  return (
    <Card className={beat.sepia ? 'bg-[#f3e4c6]' : ''}>
      {beat.sepia && <div className="mb-2 text-center text-3xl">📜</div>}
      <p className="text-center font-display text-lg font-extrabold leading-snug text-[#4a3620]">{beat.text}</p>
      <Button className="mt-5 w-full" onClick={onAdvance}>
        {beat.tap ?? tc('Continue')}
      </Button>
    </Card>
  );
}

function LineBeat({ beat, onAdvance }: { beat: Extract<Beat, { kind: 'line' }>; onAdvance: () => void }) {
  const { tc } = useTc();
  const c = character(beat.speaker);
  return (
    <div>
      <div className="mb-[-18px] ml-2 flex items-end gap-2">
        <CharacterPortrait id={beat.speaker} />
        {c.name && (
          <span className="mb-2 rounded-full bg-white px-3 py-1 text-sm font-extrabold text-[#1f3a5f] shadow-soft">
            {c.name}
          </span>
        )}
      </div>
      <Card>
        <p className="pt-3 text-center font-display text-lg font-extrabold leading-snug text-[#1f3a5f]">
          {beat.text}
        </p>
        <Button className="mt-5 w-full" onClick={onAdvance}>
          {beat.tap ?? tc('Continue')}
        </Button>
      </Card>
    </div>
  );
}

function ConceptBeat({ beat, onAdvance }: { beat: Extract<Beat, { kind: 'concept' }>; onAdvance: () => void }) {
  const { tc } = useTc();
  return (
    <Card>
      {beat.title && (
        <h3 className="mb-3 text-center font-display text-xl font-extrabold text-xp">💡 {beat.title}</h3>
      )}
      <div className="space-y-3">
        {beat.cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ x: -16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.15 * i }}
            className="flex items-center gap-3 rounded-2xl bg-sky-soft/40 p-3"
          >
            <span className="text-3xl">{card.icon}</span>
            <p className="text-sm font-bold text-[#1f3a5f]">{card.text}</p>
          </motion.div>
        ))}
      </div>
      <Button className="mt-5 w-full" onClick={onAdvance}>
        {tc('Got it!')}
      </Button>
    </Card>
  );
}

function BigBeat({ beat, onAdvance }: { beat: Extract<Beat, { kind: 'big' }>; onAdvance: () => void }) {
  const { tc } = useTc();
  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="rounded-3xl bg-gradient-to-b from-xp to-[#b48cff] p-7 text-center shadow-pop"
    >
      <div className="mb-2 text-4xl">✨</div>
      <p className="font-display text-2xl font-extrabold leading-tight text-white">{beat.text}</p>
      {beat.sub && <p className="mt-3 text-sm font-bold text-white/90">{beat.sub}</p>}
      <Button variant="gold" className="mt-5 w-full" onClick={onAdvance}>
        {tc('Continue')}
      </Button>
    </motion.div>
  );
}

function ChoiceBeat({
  beat,
  onAdvance,
  onTick,
}: {
  beat: Extract<Beat, { kind: 'choice' }>;
  onAdvance: () => void;
  onTick: () => void;
}) {
  const { tc } = useTc();
  const [feedback, setFeedback] = useState<{ text: string; speaker?: string; ok: boolean } | null>(null);
  const [solved, setSolved] = useState(false);
  const hasSuccess = beat.options.some((o) => o.success);

  const pick = (i: number) => {
    if (solved) return;
    const opt = beat.options[i];
    if (beat.counter && opt.tick) onTick();
    if (opt.feedback) setFeedback({ text: opt.feedback, speaker: opt.speaker, ok: !!opt.success || !hasSuccess });
    if (opt.success || !hasSuccess) setSolved(true);
  };

  return (
    <Card>
      {beat.prompt && (
        <p className="mb-4 text-center font-display text-lg font-extrabold text-[#1f3a5f]">{beat.prompt}</p>
      )}
      <div className="space-y-2">
        {beat.options.map((opt, i) => (
          <motion.button
            key={i}
            onClick={() => pick(i)}
            whileHover={!solved ? { scale: 1.02 } : undefined}
            whileTap={!solved ? { scale: 0.97 } : undefined}
            disabled={solved && !opt.success && hasSuccess}
            className="w-full rounded-2xl border-b-4 border-slate-200 bg-slate-50 px-4 py-3 text-left font-display font-extrabold text-[#1f3a5f] hover:bg-white disabled:opacity-40"
          >
            {opt.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`mt-4 flex items-start gap-2 rounded-2xl p-3 ${feedback.ok ? 'bg-grass-light/30' : 'bg-coin/20'}`}
          >
            {feedback.speaker && <span className="text-2xl">{character(feedback.speaker).emoji}</span>}
            <p className="text-sm font-bold text-[#1f3a5f]">{feedback.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {solved && (
        <Button variant="secondary" className="mt-4 w-full" onClick={onAdvance}>
          {tc('Continue')}
        </Button>
      )}
    </Card>
  );
}

function PredictBeat({ beat, onAdvance }: { beat: Extract<Beat, { kind: 'predict' }>; onAdvance: () => void }) {
  const { tc } = useTc();
  const [picked, setPicked] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);

  const pick = (i: number) => {
    if (solved) return;
    setPicked(i);
    if (beat.options[i].correct) setSolved(true);
  };

  return (
    <Card>
      <p className="mb-1 text-center text-xs font-extrabold uppercase text-xp">{tc('Predict!')}</p>
      <p className="mb-4 text-center font-display text-lg font-extrabold text-[#1f3a5f]">{beat.prompt}</p>
      <div className="space-y-2">
        {beat.options.map((opt, i) => {
          const chosen = picked === i;
          const show = chosen;
          const good = opt.correct;
          return (
            <div key={i}>
              <motion.button
                onClick={() => pick(i)}
                whileTap={!solved ? { scale: 0.97 } : undefined}
                disabled={solved && !opt.correct}
                className={`w-full rounded-2xl border-b-4 px-4 py-3 text-left font-display font-extrabold disabled:opacity-40 ${
                  chosen
                    ? good
                      ? 'border-grass-dark bg-grass-light text-white'
                      : 'border-[#d33f5c] bg-heart text-white'
                    : 'border-slate-200 bg-slate-50 text-[#1f3a5f] hover:bg-white'
                }`}
              >
                {opt.label}
              </motion.button>
              {show && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-2 py-1 text-sm font-bold text-[#1f3a5f]"
                >
                  {opt.feedback}
                </motion.p>
              )}
            </div>
          );
        })}
      </div>
      {solved && (
        <Button variant="secondary" className="mt-4 w-full" onClick={onAdvance}>
          {tc('Continue')}
        </Button>
      )}
    </Card>
  );
}

function SortBeat({ beat, onAdvance }: { beat: Extract<Beat, { kind: 'sort' }>; onAdvance: () => void }) {
  const { tc } = useTc();
  const { t } = useT();
  const [i, setI] = useState(0);
  const [reveal, setReveal] = useState<{ ok: boolean; reason: string } | null>(null);
  const item = beat.items[i];

  const answer = (choice: 'charge' | 'help') => {
    if (reveal) return;
    setReveal({ ok: choice === item.answer, reason: item.reason });
  };
  const next = () => {
    if (i + 1 >= beat.items.length) onAdvance();
    else {
      setI((v) => v + 1);
      setReveal(null);
    }
  };

  return (
    <Card>
      <p className="mb-1 text-center text-xs font-extrabold uppercase text-xp">
        {t('story.request', { i: i + 1, total: beat.items.length })}
      </p>
      <p className="mb-4 text-center font-display text-lg font-extrabold text-[#1f3a5f]">{beat.prompt}</p>
      <div className="mb-4 rounded-2xl bg-sky-soft/40 p-4 text-center font-bold text-[#1f3a5f]">{item.label}</div>

      {!reveal ? (
        <div className="grid grid-cols-2 gap-3">
          <Button variant="gold" onClick={() => answer('charge')}>
            {tc('🪙 Charge')}
          </Button>
          <Button variant="secondary" onClick={() => answer('help')}>
            {tc('💚 Just help')}
          </Button>
        </div>
      ) : (
        <>
          <div className={`rounded-2xl p-3 text-sm font-bold text-[#1f3a5f] ${reveal.ok ? 'bg-grass-light/40' : 'bg-coin/25'}`}>
            {reveal.ok ? '✅ ' : '🤔 '}
            {reveal.reason}
          </div>
          <Button variant="secondary" className="mt-4 w-full" onClick={next}>
            {i + 1 >= beat.items.length ? t('story.done') : t('story.next')}
          </Button>
        </>
      )}
    </Card>
  );
}

function MirrorBeat({
  beat,
  onAdvance,
  onCollect,
}: {
  beat: Extract<Beat, { kind: 'mirror' }>;
  onAdvance: () => void;
  onCollect: (m: MirrorAnswer) => void;
}) {
  const { tc } = useTc();
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#e9f7ff] to-white p-6 shadow-pop">
      <div className="mb-2 text-center text-3xl">🪞</div>
      <p className="mb-4 text-center font-display text-lg font-extrabold text-[#1f3a5f]">{beat.prompt}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {beat.options.map((opt) => (
          <button
            key={opt}
            onClick={() => {
              setPicked(opt);
              onCollect({ key: beat.bankKey, value: opt });
            }}
            className={`rounded-full border-b-4 px-4 py-2 text-sm font-extrabold ${
              picked === opt
                ? 'border-sky-deep bg-sky-bright text-white'
                : 'border-slate-200 bg-slate-50 text-[#1f3a5f]'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {picked && (
        <Button variant="secondary" className="mt-5 w-full" onClick={onAdvance}>
          {tc('Milo will remember that!')}
        </Button>
      )}
    </div>
  );
}

function NotebookBeat({
  beat,
  onAdvance,
  onCollect,
}: {
  beat: Extract<Beat, { kind: 'notebook' }>;
  onAdvance: () => void;
  onCollect: (term: string) => void;
}) {
  const { tc } = useTc();
  const nb = useNoteUi();
  const entry = noteDef(beat.term);
  // collect on first render (hook must run unconditionally)
  useMemoOnce(() => onCollect(beat.term));
  if (!entry) {
    return (
      <Card>
        <Button className="w-full" onClick={onAdvance}>
          {tc('Continue')}
        </Button>
      </Card>
    );
  }
  // the same sheet of paper the chapters write on, so a page collected here
  // is recognisably the page the learner will find on their shelf later
  return (
    <motion.div
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 16 }}
    >
      <p className="mb-2 flex items-center justify-center gap-2 text-center text-xs font-extrabold uppercase tracking-wider text-white drop-shadow">
        <NotebookMark size={18} />
        {nb.writing}
      </p>
      <NoteLeaf entry={beat.term} tone="page" />
      <div className="mt-4">
        <LeafButton onClick={onAdvance}>{nb.gotIt}</LeafButton>
      </div>
    </motion.div>
  );
}

function BadgeBeat({
  beat,
  onAdvance,
  onCollect,
}: {
  beat: Extract<Beat, { kind: 'badge' }>;
  onAdvance: () => void;
  onCollect: (badge: string) => void;
}) {
  const { tc } = useTc();
  const badge = badgeDef(beat.badge);
  useMemoOnce(() => onCollect(beat.badge));
  if (!badge) {
    return (
      <Card>
        <Button className="w-full" onClick={onAdvance}>
          {tc('Continue')}
        </Button>
      </Card>
    );
  }
  return (
    <div className="rounded-3xl bg-white p-7 text-center shadow-pop">
      <p className="text-xs font-extrabold uppercase tracking-wider text-coin">{tc('Badge unlocked!')}</p>
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 12 }}
        className="mx-auto my-3 grid h-24 w-24 place-items-center rounded-full bg-gradient-to-b from-[#ffe08a] to-coin text-5xl shadow-node"
      >
        {badge.icon}
      </motion.div>
      <h3 className="font-display text-2xl font-extrabold text-[#1f3a5f]">{tc(badge.title)}</h3>
      <p className="mt-1 text-sm font-semibold text-slate-500">{tc(badge.description)}</p>
      <Button variant="gold" className="mt-5 w-full" onClick={onAdvance}>
        {tc('Awesome!')}
      </Button>
    </div>
  );
}

function RewardBeat({ onAdvance }: { onAdvance: () => void }) {
  // Auto-advance into the celebration overlay handled by the parent.
  useMemoOnce(() => setTimeout(onAdvance, 0));
  return null;
}

/** Runs a side-effect exactly once for the life of the beat (no re-fire). */
function useMemoOnce(fn: () => void) {
  useMemo(fn, []);
}
