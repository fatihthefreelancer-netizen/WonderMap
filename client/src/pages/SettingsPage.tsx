import { useState } from 'react';
import { PageShell } from '../components/ui/PageShell';
import { Button } from '../components/ui/Button';
import { LanguageSelector } from '../components/ui/LanguageSelector';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { sfx } from '../lib/sfx';
import { userService } from '../lib/services';
import { useT } from '../i18n/useT';

function TierPicker() {
  const { t } = useT();
  const user = useAuthStore((s) => s.user)!;
  const applyProgress = useAuthStore((s) => s.applyProgress);
  const tier = user.progress.tier ?? 'junior';

  async function set(next: 'junior' | 'pro') {
    if (next === tier) return;
    const progress = await userService.setTier(next);
    applyProgress(progress);
  }

  const options: { key: 'junior' | 'pro'; title: string; sub: string; emoji: string }[] = [
    { key: 'junior', title: t('settings.junior'), sub: t('settings.juniorSub'), emoji: '🌱' },
    { key: 'pro', title: t('settings.pro'), sub: t('settings.proSub'), emoji: '🚀' },
  ];

  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft">
      <p className="font-display font-extrabold text-[#1f3a5f]">{t('settings.difficulty')}</p>
      <p className="mb-3 text-xs font-semibold text-slate-500">{t('settings.difficultyHint')}</p>
      <div className="grid grid-cols-2 gap-3">
        {options.map((o) => (
          <button
            key={o.key}
            onClick={() => set(o.key)}
            className={`rounded-2xl border-b-4 p-3 text-center transition ${
              tier === o.key
                ? 'border-sky-deep bg-sky-bright text-white'
                : 'border-slate-200 bg-slate-50 text-[#1f3a5f]'
            }`}
          >
            <div className="text-2xl">{o.emoji}</div>
            <div className="font-display font-extrabold">{o.title}</div>
            <div className={`text-[10px] font-bold ${tier === o.key ? 'text-white/90' : 'text-slate-400'}`}>
              {o.sub}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Toggle({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-soft">
      <div>
        <p className="font-display font-extrabold text-[#1f3a5f]">{label}</p>
        <p className="text-xs font-semibold text-slate-500">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
        aria-label={label}
        className={`relative h-8 w-14 rounded-full transition-colors ${value ? 'bg-grass' : 'bg-slate-300'}`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${value ? 'left-7' : 'left-1'}`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { t } = useT();
  const logout = useAuthStore((s) => s.logout);
  const sound = useUIStore((s) => s.sound);
  const setSound = useUIStore((s) => s.setSound);
  const [music, setMusic] = useState(true);
  const [reduced, setReduced] = useState(
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  );

  return (
    <PageShell title={t('settings.title')} emoji="⚙️">
      <div className="mb-3">
        <LanguageSelector />
      </div>
      <div className="mb-3">
        <TierPicker />
      </div>
      <div className="space-y-3">
        <Toggle
          label={t('settings.sound')}
          desc={t('settings.soundDesc')}
          value={sound}
          onChange={(v) => {
            setSound(v);
            // play the cue the moment it is switched on, so the toggle proves itself
            if (v) sfx('coin');
          }}
        />
        <Toggle label={t('settings.music')} desc={t('settings.musicDesc')} value={music} onChange={setMusic} />
        <Toggle
          label={t('settings.reducedMotion')}
          desc={t('settings.reducedMotionDesc')}
          value={reduced}
          onChange={(v) => {
            setReduced(v);
            document.documentElement.style.setProperty('--wm-motion', v ? 'reduce' : 'auto');
          }}
        />
      </div>

      <div className="mt-5 rounded-2xl bg-white p-4 shadow-soft">
        <p className="font-display font-extrabold text-[#1f3a5f]">{t('settings.about')}</p>
        <p className="text-xs font-semibold text-slate-500">{t('settings.aboutText')}</p>
      </div>

      <Button variant="danger" className="mt-5 w-full" onClick={() => logout()}>
        {t('common.logout')}
      </Button>
    </PageShell>
  );
}
