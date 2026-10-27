import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LessonDTO } from '@wondermap/shared';

/**
 * A compact but real mini-lesson: a handful of tap-the-answer questions.
 * Score (0..100) is sent back to the server which converts it into stars.
 * Content is generated deterministically from the lesson so it feels authored.
 */
interface Question {
  prompt: string;
  options: string[];
  answer: number;
}

const BANKS: Array<(n: number) => Question> = [
  (n) => {
    const a = 2 + (n % 7);
    const b = 3 + ((n * 3) % 6);
    const correct = a + b;
    const opts = shuffle([correct, correct + 1, correct - 2, correct + 3], n);
    return { prompt: `What is ${a} + ${b}?`, options: opts.map(String), answer: opts.indexOf(correct) };
  },
  (n) => {
    const seq = ['🍎', '🍌', '🍇', '🍓', '🥝'];
    const pick = seq[n % seq.length];
    const opts = shuffle([pick, ...seq.filter((s) => s !== pick).slice(0, 3)], n + 1);
    return { prompt: `Tap the fruit: ${pick}`, options: opts, answer: opts.indexOf(pick) };
  },
  (n) => {
    const words = ['cat', 'dog', 'sun', 'sky', 'sea', 'map'];
    const w = words[n % words.length];
    const opts = shuffle([w.toUpperCase(), w + 's', w[0] + '__', 'x' + w], n + 2);
    return { prompt: `Which is "${w}" in capitals?`, options: opts, answer: opts.indexOf(w.toUpperCase()) };
  },
];

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed + 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function LessonPlay({ lesson, onFinish }: { lesson: LessonDTO; onFinish: (score: number) => void }) {
  const questions = useMemo(() => {
    const count = lesson.type === 'boss' ? 5 : 3;
    const base = lesson.order + lesson.title.length;
    return Array.from({ length: count }, (_, i) => BANKS[(base + i) % BANKS.length](base + i));
  }, [lesson]);

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const correctRef = useRef(0);
  const finishedRef = useRef(false);

  const q = questions[idx];

  // Advance (or finish) a short beat after an answer is chosen. Using an effect
  // with cleanup means the timer can never be orphaned by a re-render.
  useEffect(() => {
    if (picked === null) return;
    const wasRight = picked === q.answer;
    const timer = setTimeout(() => {
      if (wasRight) correctRef.current += 1;
      if (idx + 1 >= questions.length) {
        if (finishedRef.current) return;
        finishedRef.current = true;
        onFinish(Math.round((correctRef.current / questions.length) * 100));
      } else {
        setIdx((v) => v + 1);
        setPicked(null);
      }
    }, 650);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked]);

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-pop">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-display font-extrabold text-[#1f3a5f]">{lesson.title}</span>
        <span className="text-sm font-bold text-slate-400">
          {idx + 1} / {questions.length}
        </span>
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-sky-soft/60">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-sky-bright to-sky-deep"
          animate={{ width: `${((idx + (picked !== null ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <AnimatePresence initial={false}>
        <motion.div
          key={idx}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        >
          <p className="mb-5 text-center font-display text-xl font-extrabold text-[#1f3a5f]">{q.prompt}</p>
          <div className="grid grid-cols-2 gap-3">
            {q.options.map((opt, i) => {
              const state =
                picked === null
                  ? 'idle'
                  : i === q.answer
                    ? 'right'
                    : i === picked
                      ? 'wrong'
                      : 'idle';
              return (
                <motion.button
                  key={i}
                  onClick={() => choose(i)}
                  whileHover={picked === null ? { scale: 1.04, y: -2 } : undefined}
                  whileTap={picked === null ? { scale: 0.95 } : undefined}
                  className={`rounded-2xl border-b-4 px-4 py-4 font-display text-lg font-extrabold transition-colors ${
                    state === 'right'
                      ? 'border-grass-dark bg-grass-light text-white'
                      : state === 'wrong'
                        ? 'border-[#d33f5c] bg-heart text-white'
                        : 'border-slate-200 bg-slate-50 text-[#1f3a5f] hover:bg-white'
                  }`}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
