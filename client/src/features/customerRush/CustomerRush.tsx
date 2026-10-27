import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SimulationDef } from '../../content/customerRush/types';
import { useCustomerRush } from './useCustomerRush';
import { RushHUD } from './RushHUD';
import { CustomerStage } from './CustomerStage';
import { MiloActor } from './MiloActor';
import { ItemCard } from './ItemCard';
import { CoinFly } from './CoinFly';
import { ComboBurst } from './ComboBurst';
import { RushSummary } from './RushSummary';
import { Button } from '../../components/ui/Button';
import { useT } from '../../i18n/useT';
import { useTc } from '../../i18n/useTc';

export interface RushResult {
  coins: number;
  xp: number;
  helped: number;
  badges: string[];
}

interface Props {
  sim: SimulationDef;
  submitting?: boolean;
  onExit: () => void;
  onFinish: (result: RushResult) => void;
}

export function CustomerRush({ sim, submitting = false, onExit, onFinish }: Props) {
  const { t } = useT();
  const { state, current, options, itemById, start, choose } = useCustomerRush(sim);
  const [started, setStarted] = useState(false);

  const carried = state.selectedItemId ? itemById.get(state.selectedItemId) ?? null : null;
  const asking = state.cphase === 'ask' && state.status === 'running';

  const beginPlay = () => {
    setStarted(true);
    start();
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-gradient-to-b from-[#e8f4ff] via-[#fff4dd] to-[#f0d9a8]">
      {/* workshop wall + floor */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-[#e8c48a] to-[#d79a5b]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-[33%] h-1 bg-[#b9793f]/40" />

      <button
        onClick={onExit}
        aria-label="Leave the workshop"
        className="absolute left-4 top-4 z-30 grid h-9 w-9 place-items-center rounded-full bg-white/80 shadow-soft"
      >
        ✕
      </button>

      {!started ? (
        <StartScreen sim={sim} onStart={beginPlay} />
      ) : (
        <>
          <RushHUD
            timeLeft={state.timeLeft}
            total={sim.durationSeconds}
            coins={state.coins}
            xp={state.xp}
            streak={state.streak}
          />

          {/* stage */}
          <div className="relative flex flex-1 flex-col items-center justify-center px-4">
            <CoinFly flyKey={state.flyKey} />
            <ComboBurst combo={state.comboEvent} />
            {current && (
              <CustomerStage
                customer={current}
                phase={state.cphase}
                outcome={state.outcome}
                reactionText={state.reactionText}
                shakeKey={state.shakeKey}
              />
            )}
            <MiloActor phase={state.cphase} carried={carried} />
          </div>

          {/* item cards */}
          <div className="relative z-20 min-h-[150px] px-4 pb-6">
            <AnimatePresence>
              {asking && (
                <motion.div
                  key={current?.id}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 30, opacity: 0 }}
                  className="flex flex-wrap items-end justify-center gap-3"
                >
                  {current?.quality && (
                    <p className="mb-1 w-full text-center text-xs font-extrabold uppercase tracking-wide text-[#a5763a]">
                      {t('rush.pickVersion')}
                    </p>
                  )}
                  {options.map((item) => (
                    <ItemCard key={item.id} item={item} onSelect={choose} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {state.status === 'finished' && (
            <RushSummary
              sim={sim}
              state={state}
              submitting={submitting}
              onReplay={beginPlay}
              onCollect={() =>
                onFinish({
                  coins: state.coins,
                  xp: state.xp,
                  helped: state.helped,
                  badges: sim.badge && state.helped > 0 ? [sim.badge] : [],
                })
              }
            />
          )}
        </>
      )}
    </div>
  );
}

function StartScreen({ sim, onStart }: { sim: SimulationDef; onStart: () => void }) {
  const { t } = useT();
  const { tc } = useTc();
  return (
    <div className="relative z-20 flex flex-1 flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.6, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 14 }}
        className="grid h-24 w-24 place-items-center rounded-full bg-white text-6xl shadow-pop ring-4 ring-white"
      >
        🧑‍🔧
      </motion.div>
      <h1 className="mt-4 font-display text-3xl font-extrabold text-[#6b4a1e]">{tc(sim.title)}</h1>
      <p className="mt-2 max-w-xs font-bold text-[#8a6a3a]">{t('rush.intro', { n: sim.durationSeconds })}</p>
      <Button size="lg" variant="secondary" className="mt-6" onClick={onStart}>
        {t('rush.open')}
      </Button>
    </div>
  );
}
