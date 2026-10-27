import { motion } from 'framer-motion';
import { useT } from '../../i18n/useT';

interface Props {
  timeLeft: number;
  total: number;
  coins: number;
  xp: number;
  streak: number;
}

/** Top bar: big countdown timer + live coin / XP / streak counters. */
export function RushHUD({ timeLeft, total, coins, xp, streak }: Props) {
  const { t } = useT();
  const pct = (timeLeft / total) * 100;
  const low = timeLeft <= 10;
  return (
    <div className="relative z-20 px-4 pt-4">
      <div className="flex items-center justify-between gap-3">
        <div className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-soft">
          <span className="animate-spin-coin text-lg">🪙</span>
          <motion.span
            key={coins}
            initial={{ scale: 1.4, color: '#e0a53a' }}
            animate={{ scale: 1, color: '#b5820f' }}
            className="font-display text-sm font-extrabold tabular-nums"
          >
            {coins}
          </motion.span>
        </div>

        {/* countdown */}
        <div className="flex flex-col items-center">
          <motion.div
            key={low ? 'low' : 'ok'}
            animate={low ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            transition={low ? { duration: 0.6, repeat: Infinity } : undefined}
            className={`grid h-16 w-16 place-items-center rounded-full font-display text-2xl font-extrabold text-white shadow-pop ${
              low ? 'bg-gradient-to-b from-[#ff7a90] to-heart' : 'bg-gradient-to-b from-sky-bright to-sky-deep'
            }`}
          >
            {timeLeft}
          </motion.div>
          <div id="rush-coin-target" className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-white/60">
            <div
              className={`h-full rounded-full ${low ? 'bg-heart' : 'bg-grass'}`}
              style={{ width: `${pct}%`, transition: 'width 1s linear' }}
            />
          </div>
        </div>

        <div className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-soft">
          <span className="text-lg">⚡</span>
          <motion.span
            key={xp}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="font-display text-sm font-extrabold tabular-nums text-xp"
          >
            {xp}
          </motion.span>
        </div>
      </div>

      {streak > 1 && (
        <div className="mt-2 flex justify-center">
          <motion.div
            key={streak}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-full bg-coin/90 px-3 py-0.5 text-xs font-extrabold text-[#7a5a10]"
          >
            🔥 {t('rush.inRow', { n: streak })}
          </motion.div>
        </div>
      )}
    </div>
  );
}
