import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChoiceScene } from './content';
import { Big, Bubble, Confetti, Face, Item, useCh2Copy } from './pieces';

/**
 * 2.1 — "Right thing, right now".
 *
 * Somebody stands in their own painted place with a problem over their head.
 * Four things are laid out below; only one solves the problem they have *now*.
 * A wrong pick is never punished — the character simply says why it misses, and
 * the child tries again.
 */

interface Props {
  scene: ChoiceScene;
  onDone: (mistakes: number) => void;
}

/** Deal the options in a stable, per-scene shuffle so the answer moves around. */
function shuffled(ids: string[], seed: string) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const out = [...ids];
  for (let i = out.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0;
    const j = h % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function ChoiceQuestion({ scene, onDone }: Props) {
  const copy = useCh2Copy();
  const options = useMemo(() => shuffled(scene.options, scene.id), [scene]);
  const [solved, setSolved] = useState(false);
  const [refused, setRefused] = useState<string[]>([]);
  const [said, setSaid] = useState<string | null>(null);

  const line =
    solved && said === scene.correct
      ? copy.scenes.right[scene.id]
      : said
        ? copy.scenes.wrong[scene.id]?.[said]
        : copy.scenes.say[scene.id];
  const tone = solved ? 'yes' : said ? 'no' : 'plain';

  function pick(id: string) {
    if (solved) return;
    setSaid(id);
    if (id === scene.correct) setSolved(true);
    else if (!refused.includes(id)) setRefused((r) => [...r, id]);
  }

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* --------------------------- the character --------------------------- */}
      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-x-0 bottom-0 top-[5.5rem] flex items-end justify-center px-4 pb-1">
          <div className="relative flex h-full w-full flex-col items-center justify-end">
            <Bubble key={line} tone={tone} className="mb-2 shrink-0">
              {line}
            </Bubble>
            <div className="flex min-h-[120px] w-full flex-1 items-end justify-center">
              <Face
                look={scene.who}
                happy={solved}
                className="h-full max-h-[520px] w-auto max-w-none drop-shadow-[0_16px_26px_rgba(16,40,20,0.4)]"
              />
            </div>
          </div>
        </div>
        {solved && <Confetti n={22} />}
      </div>

      {/* ------------------------------ the tray ----------------------------- */}
      <div className="pointer-events-none z-20 px-3 pb-3 sm:px-5 sm:pb-5">
        <div className="pointer-events-auto mx-auto w-full max-w-3xl rounded-[28px] bg-white/95 p-4 shadow-hud-lg backdrop-blur-sm">
          <p className="text-center font-display text-[13px] font-extrabold text-[#5b7290] sm:text-sm">
            {copy.scenes.question.replace(/\*\*/g, '')}
          </p>
          <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
            {options.map((id) => {
              const wrong = refused.includes(id);
              const won = solved && id === scene.correct;
              return (
                <motion.button
                  key={id}
                  onClick={() => pick(id)}
                  disabled={solved || wrong}
                  animate={wrong && said === id ? { x: [0, -7, 7, -5, 0] } : { x: 0 }}
                  transition={{ duration: 0.34 }}
                  whileHover={solved || wrong ? undefined : { scale: 1.06, y: -4 }}
                  whileTap={solved || wrong ? undefined : { scale: 0.95 }}
                  className={`grid place-items-center rounded-3xl border-[3px] p-2 transition-colors ${
                    won
                      ? 'border-[#5fc14e] bg-[#eafbe4]'
                      : wrong
                        ? 'border-[#f0d7d7] bg-[#fbf1f1] opacity-45'
                        : 'border-[#e6edf5] bg-[#f7fafd] hover:border-[#9fdcff]'
                  }`}
                >
                  <div className="h-[clamp(44px,8vh,74px)] w-[clamp(44px,8vh,74px)]">
                    <Item item={id} />
                  </div>
                </motion.button>
              );
            })}
          </div>
          <AnimatePresence>
            {solved && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex justify-center"
              >
                <Big tone="grass" onClick={() => onDone(refused.length)}>
                  {copy.ui.continue}
                </Big>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
