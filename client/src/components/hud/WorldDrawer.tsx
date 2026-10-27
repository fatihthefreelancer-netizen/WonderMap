import { motion, AnimatePresence } from 'framer-motion';
import type { WorldDTO, UserDTO } from '@wondermap/shared';
import { themeFor } from '../../lib/theme';
import { useT } from '../../i18n/useT';
import { useTc } from '../../i18n/useTc';

interface Props {
  open: boolean;
  onClose: () => void;
  worlds: WorldDTO[];
  user: UserDTO;
  activeWorldId: string | null;
  onSelect: (id: string) => void;
}

export function WorldDrawer({ open, onClose, worlds, user, activeWorldId, onSelect }: Props) {
  const { t } = useT();
  const { tc } = useTc();
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[55] bg-[#12335a]/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-y-0 left-0 z-[56] flex w-80 max-w-[86vw] flex-col bg-gradient-to-b from-sky-soft to-white shadow-pop"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            <div className="flex items-center justify-between p-4">
              <h2 className="font-display text-xl font-extrabold text-[#1f3a5f]">{t('world.worlds')}</h2>
              <button onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-soft">
                ✕
              </button>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto px-3 pb-6">
              {worlds.map((w, i) => {
                const unlocked = user.progress.worldUnlocked.includes(w.id) || user.progress.xp >= w.requiredXP;
                const palette = themeFor(w.theme);
                const active = w.id === activeWorldId;
                return (
                  <motion.button
                    key={w.id}
                    onClick={() => {
                      onSelect(w.id);
                      onClose();
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left shadow-soft ring-2 transition ${
                      active ? 'ring-sky-deep' : 'ring-transparent'
                    }`}
                    style={{ background: `linear-gradient(180deg, ${palette.sky[0]}, #ffffff)` }}
                  >
                    <div
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl shadow-inner"
                      style={{ background: palette.ground[0] }}
                    >
                      {unlocked ? palette.emoji : '🔒'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display font-extrabold text-[#1f3a5f]">
                        {i + 1}. {tc(w.title)}
                      </p>
                      <p className="truncate text-xs font-semibold text-slate-500">
                        {unlocked
                          ? t('world.lessons', { n: w.lessonCount })
                          : t('world.unlockAt', { n: w.requiredXP })}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
