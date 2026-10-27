import { motion } from 'framer-motion';
import type { SimulationDef } from '../../content/customerRush/types';
import type { State } from './useCustomerRush';
import { Confetti } from '../../components/ui/Confetti';
import { Button } from '../../components/ui/Button';
import { badgeDef } from '../../content/badges';
import { useT } from '../../i18n/useT';
import { useTc } from '../../i18n/useTc';

interface Props {
  sim: SimulationDef;
  state: State;
  submitting: boolean;
  onCollect: () => void;
  onReplay: () => void;
}

export function RushSummary({ sim, state, submitting, onCollect, onReplay }: Props) {
  const { t } = useT();
  const { tc } = useTc();
  const badge = sim.badge && state.helped > 0 ? badgeDef(sim.badge) : undefined;
  const rows = [
    { icon: '🙋', label: t('rush.helped'), value: state.helped },
    { icon: '✅', label: t('rush.perfect'), value: state.correct },
    { icon: '🪙', label: t('rush.coinsEarned'), value: state.coins },
    { icon: '⚡', label: t('rush.xpEarned'), value: state.xp },
  ];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#12335a]/50 backdrop-blur-sm" />
      <Confetti count={60} />
      <motion.div
        initial={{ scale: 0.7, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 240, damping: 18 }}
        className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-pop"
      >
        <div className="text-5xl">🎉</div>
        <h2 className="font-display text-2xl font-extrabold text-[#1f3a5f]">{t('rush.closed')}</h2>

        <div className="my-4 space-y-2">
          {rows.map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ x: -16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-2"
            >
              <span className="flex items-center gap-2 text-sm font-bold text-[#1f3a5f]">
                <span className="text-xl">{r.icon}</span> {r.label}
              </span>
              <span className="font-display text-lg font-extrabold text-[#1f3a5f]">{r.value}</span>
            </motion.div>
          ))}
        </div>

        {state.bestCombo && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-3 rounded-2xl bg-gradient-to-b from-[#ffe08a] to-coin px-4 py-2 font-display font-extrabold text-[#7a5a10]"
          >
            🔥 {t('rush.bestCombo', { label: tc(state.bestCombo.label) })}
          </motion.div>
        )}

        {badge && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.7, type: 'spring', stiffness: 260, damping: 12 }}
            className="mb-3 flex items-center justify-center gap-2 rounded-2xl bg-[#fff0c2] px-3 py-2"
          >
            <span className="text-3xl">{badge.icon}</span>
            <div className="text-left">
              <p className="text-[10px] font-extrabold uppercase text-[#b5820f]">{t('celebration.badgeEarned')}</p>
              <p className="text-sm font-extrabold text-[#7a5a10]">{tc(badge.title)}</p>
            </div>
          </motion.div>
        )}

        {/* one-sentence reflection — the lesson emerges from play */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mb-4 rounded-2xl bg-xp/10 px-4 py-3 font-display text-sm font-extrabold text-xp"
        >
          💡 {tc(sim.lessonObjective)}
        </motion.p>

        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={onReplay} disabled={submitting}>
            {t('rush.playAgain')}
          </Button>
          <Button variant="secondary" className="flex-1" onClick={onCollect} disabled={submitting}>
            {submitting ? t('common.saving') : t('rush.collect')}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
