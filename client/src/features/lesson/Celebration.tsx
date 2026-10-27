import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { CompleteLessonResult } from '@wondermap/shared';
import { Confetti } from '../../components/ui/Confetti';
import { sfx } from '../../lib/sfx';
import { Button } from '../../components/ui/Button';
import { badgeDef } from '../../content/badges';
import { noteDef, noteText } from '../../content/notebook';
import { KindChip, NotebookMark } from '../../components/notebook/Leaf';
import { useLocaleStore } from '../../store/localeStore';
import { useT } from '../../i18n/useT';
import { useTc } from '../../i18n/useTc';

export function Celebration({ result, onClose }: { result: CompleteLessonResult; onClose: () => void }) {
  const { t } = useT();
  const { tc } = useTc();
  const locale = useLocaleStore((st) => st.locale);
  const { earned, newAchievements, unlockedWorlds, newBadges = [], newNotebook = [] } = result;

  // one cue per star, in time with the stagger below
  useEffect(() => {
    for (let s = 0; s < earned.stars; s++) {
      window.setTimeout(() => sfx('star'), 200 + s * 150);
    }
    if (newBadges.length) window.setTimeout(() => sfx('fanfare'), 450);
    if (newNotebook.length) window.setTimeout(() => sfx('stamp'), 600);
  }, [earned.stars, newBadges.length, newNotebook.length]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#12335a]/50 backdrop-blur-sm" onClick={onClose} />
      <Confetti />
      <motion.div
        initial={{ scale: 0.6, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-pop"
      >
        <motion.div
          className="mb-2 text-6xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, -8, 8, 0] }}
          transition={{ duration: 0.8 }}
        >
          🎉
        </motion.div>
        <h2 className="font-display text-2xl font-extrabold text-[#1f3a5f]">{t('celebration.title')}</h2>

        <div className="my-4 flex justify-center gap-1">
          {[0, 1, 2].map((s) => (
            <motion.span
              key={s}
              initial={{ scale: 0, rotate: -40 }}
              animate={{ scale: s < earned.stars ? 1.15 : 0.8, rotate: 0 }}
              transition={{ delay: 0.2 + s * 0.15, type: 'spring', stiffness: 300 }}
              className={`text-4xl ${s < earned.stars ? '' : 'grayscale opacity-40'}`}
            >
              ⭐
            </motion.span>
          ))}
        </div>

        {earned.xp > 0 || earned.coins > 0 ? (
          <div className="mb-4 flex justify-center gap-3">
            <Reward icon="⚡" value={`+${earned.xp}`} label={t('lesson.xp')} />
            <Reward icon="🪙" value={`+${earned.coins}`} label={t('lesson.coins')} />
          </div>
        ) : (
          // Showing "+0 XP, +0 coins" over a confetti burst is worse than
          // showing nothing. A practice run kept its stars; say that instead.
          <p className="mb-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-500">
            {t('celebration.practice')}
          </p>
        )}

        {unlockedWorlds.length > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-3 rounded-2xl bg-gradient-to-b from-[#ffe08a] to-coin px-4 py-2 font-display font-extrabold text-[#7a5a10]"
          >
            {t('celebration.newWorld')}
          </motion.div>
        )}

        {newBadges.map((key, i) => {
          const b = badgeDef(key);
          if (!b) return null;
          return (
            <motion.div
              key={key}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.45 + i * 0.15, type: 'spring', stiffness: 260, damping: 12 }}
              className="mb-2 flex items-center gap-2 rounded-2xl bg-gradient-to-b from-[#fff0c2] to-[#ffe08a] px-3 py-2 text-left"
            >
              <span className="text-3xl">{b.icon}</span>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#b5820f]">{t('celebration.badgeEarned')}</p>
                <p className="text-sm font-extrabold text-[#7a5a10]">{tc(b.title)}</p>
              </div>
            </motion.div>
          );
        })}

        {newNotebook.map((key, i) => {
          const def = noteDef(key);
          const text = noteText(locale, key);
          if (!def || !text) return null;
          return (
            <motion.div
              key={key}
              initial={{ x: -16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.55 + i * 0.12 }}
              className="mb-2 flex items-center gap-2.5 rounded-2xl bg-[#fffbf0] px-3 py-2 text-start ring-1 ring-[#e9c88a]"
            >
              <NotebookMark size={22} />
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#c98a52]">
                  {t('celebration.notebookPage')}
                </p>
                <p className="truncate text-sm font-extrabold text-[#6b4a1e]">{text.term}</p>
              </div>
              <span className="ms-auto shrink-0">
                <KindChip kind={def.kind} />
              </span>
            </motion.div>
          );
        })}

        {newAchievements.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 + i * 0.15 }}
            className="mb-2 flex items-center gap-2 rounded-2xl bg-xp/10 px-3 py-2 text-left"
          >
            <span className="text-2xl">{a.icon}</span>
            <div>
              <p className="text-sm font-extrabold text-xp">{tc(a.title)}</p>
              <p className="text-[11px] text-slate-500">{tc(a.description)}</p>
            </div>
          </motion.div>
        ))}

        <Button size="lg" className="mt-3 w-full" onClick={onClose}>
          {t('common.continue')}
        </Button>
      </motion.div>
    </div>
  );
}

function Reward({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-5 py-3">
      <div className="text-2xl">{icon}</div>
      <div className="font-display text-xl font-extrabold text-[#1f3a5f]">{value}</div>
      <div className="text-[10px] font-bold uppercase text-slate-400">{label}</div>
    </div>
  );
}
