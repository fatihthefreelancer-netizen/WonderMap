import { motion } from 'framer-motion';
import { PageShell } from '../components/ui/PageShell';
import { useAchievements } from '../hooks/queries';
import { useAuthStore } from '../store/authStore';
import { BADGES, BADGE_ORDER } from '../content/badges';
import { useT } from '../i18n/useT';
import { useTc } from '../i18n/useTc';

function StoryBadges() {
  const { t } = useT();
  const { tc } = useTc();
  const user = useAuthStore((s) => s.user)!;
  const owned = new Set(user.progress.badges ?? []);
  return (
    <div className="mb-6">
      <h2 className="mb-3 font-display text-lg font-extrabold text-[#1f3a5f]">🎖️ {t('awards.storyBadges')}</h2>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
        {BADGE_ORDER.map((key, i) => {
          const b = BADGES[key];
          const has = owned.has(key);
          return (
            <motion.div
              key={key}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              title={`${tc(b.title)} — ${tc(b.description)}`}
              className={`flex flex-col items-center rounded-2xl p-2 text-center shadow-soft ${
                has ? 'bg-gradient-to-b from-[#fff0c2] to-[#ffe08a]' : 'bg-white/50'
              }`}
            >
              <span className={`text-3xl ${has ? '' : 'grayscale opacity-40'}`}>{has ? b.icon : '🔒'}</span>
              <span className="mt-1 text-[9px] font-extrabold leading-tight text-[#7a5a10]">
                {has ? tc(b.title) : '???'}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  const { t } = useT();
  const { tc } = useTc();
  const { data, isLoading } = useAchievements();
  const unlockedCount = data?.filter((a) => a.unlocked).length ?? 0;

  return (
    <PageShell title={t('awards.title')} emoji="🏆">
      <StoryBadges />
      <h2 className="mb-3 font-display text-lg font-extrabold text-[#1f3a5f]">⭐ {t('awards.achievements')}</h2>
      {isLoading ? (
        <p className="text-center font-semibold text-slate-500">{t('common.loading')}</p>
      ) : (
        <>
          <p className="mb-4 text-center font-display font-extrabold text-[#1f3a5f]">
            {t('awards.unlocked', { done: unlockedCount, total: data?.length ?? 0 })}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {data?.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className={`rounded-2xl p-4 text-center shadow-soft ${
                  a.unlocked ? 'bg-white' : 'bg-white/50'
                }`}
              >
                <div className={`text-4xl ${a.unlocked ? '' : 'grayscale opacity-50'}`}>{a.icon}</div>
                <p className="mt-1 font-display text-sm font-extrabold text-[#1f3a5f]">{tc(a.title)}</p>
                <p className="text-[11px] font-semibold text-slate-500">{tc(a.description)}</p>
                {a.unlocked ? (
                  <span className="mt-1 inline-block rounded-full bg-grass-light px-2 py-0.5 text-[10px] font-extrabold text-white">
                    UNLOCKED
                  </span>
                ) : (
                  <span className="mt-1 inline-block rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-extrabold text-slate-500">
                    +{a.xpReward} XP
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </>
      )}
    </PageShell>
  );
}
