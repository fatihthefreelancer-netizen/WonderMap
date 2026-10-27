import { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { CharacterPortrait } from '../lesson/CharacterPortrait';
import type { Encounter } from '../../content/encounters';
import { userService } from '../../lib/services';
import { useAuthStore } from '../../store/authStore';
import { useT } from '../../i18n/useT';
import { useTc } from '../../i18n/useTc';

interface Props {
  encounter: Encounter;
  onClose: () => void;
}

export function EncounterModal({ encounter, onClose }: Props) {
  const { t } = useT();
  const { tc } = useTc();
  const applyProgress = useAuthStore((s) => s.applyProgress);
  const [picked, setPicked] = useState<number | null>(null);
  const [awarded, setAwarded] = useState(false);

  async function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    const opt = encounter.options[i];
    // Kindness is always rewarded; the encounter is marked done either way.
    const xp = opt.kind ? encounter.xp : Math.round(encounter.xp / 3);
    try {
      const progress = await userService.completeEncounter(encounter.id, xp);
      applyProgress(progress);
      setAwarded(true);
    } catch {
      setAwarded(true);
    }
  }

  const opt = picked !== null ? encounter.options[picked] : null;

  return (
    <Modal open onClose={onClose} labelledBy="enc-title">
      <div className="overflow-hidden rounded-3xl bg-white shadow-pop">
        <div className="bg-gradient-to-b from-[#bdeaff] to-[#8fd7ff] px-6 pb-6 pt-5 text-center">
          <span className="rounded-full bg-white/70 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-sky-deep">
            ✨ {t('encounter.surprise')}
          </span>
          <div className="mx-auto mt-3 w-max">
            <CharacterPortrait id={encounter.character} size={70} />
          </div>
          <h2 id="enc-title" className="mt-2 font-display text-xl font-extrabold text-[#1f3a5f]">
            {encounter.emoji} {tc(encounter.title)}
          </h2>
        </div>

        <div className="px-6 py-5">
          <p className="mb-4 text-center font-bold text-[#1f3a5f]">{tc(encounter.prompt)}</p>

          {!opt ? (
            <div className="space-y-2">
              {encounter.options.map((o, i) => (
                <motion.button
                  key={i}
                  onClick={() => choose(i)}
                  whileTap={{ scale: 0.97 }}
                  className="w-full rounded-2xl border-b-4 border-slate-200 bg-slate-50 px-4 py-3 text-left font-display font-extrabold text-[#1f3a5f] hover:bg-white"
                >
                  {tc(o.label)}
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <div className={`rounded-2xl p-3 text-sm font-bold text-[#1f3a5f] ${opt.kind ? 'bg-grass-light/40' : 'bg-coin/25'}`}>
                {opt.kind ? '💚 ' : '🤔 '}
                {tc(opt.feedback)}
              </div>
              {awarded && (
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-3 font-display text-lg font-extrabold text-xp"
                >
                  +{opt.kind ? encounter.xp : Math.round(encounter.xp / 3)} XP ⚡
                </motion.div>
              )}
              <Button className="mt-4 w-full" onClick={onClose}>
                {t('encounter.continue')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
