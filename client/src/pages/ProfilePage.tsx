import { useState } from 'react';
import { motion } from 'framer-motion';
import { levelFromXp, xpIntoLevel } from '@wondermap/shared';
import { PageShell } from '../components/ui/PageShell';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { useAuthStore, refreshMe } from '../store/authStore';
import { userService } from '../lib/services';
import { AVATAR_EMOJI } from '../components/hud/TopBar';
import { useNavigate } from 'react-router-dom';
import { useT } from '../i18n/useT';

const AVATARS = ['fox', 'wizard', 'panda', 'robot', 'cat', 'owl'];

export default function ProfilePage() {
  const { t } = useT();
  const user = useAuthStore((s) => s.user)!;
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [saving, setSaving] = useState(false);

  const level = levelFromXp(user.progress.xp);
  const { current, needed } = xpIntoLevel(user.progress.xp);
  const completed = user.progress.lessonProgress.filter((p) => p.completed).length;

  async function save() {
    setSaving(true);
    await userService.updateProfile({ name, avatar });
    await refreshMe();
    setSaving(false);
  }

  return (
    <PageShell title={t('profile.title')} emoji="🧭">
      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-sky-soft text-5xl shadow-inner">
            <Avatar avatar={avatar} size={44} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-extrabold text-[#1f3a5f]">{user.name}</h2>
            <p className="text-sm font-semibold text-slate-500">{user.email}</p>
            <span className="mt-1 inline-block rounded-full bg-xp px-3 py-0.5 text-xs font-extrabold text-white">
              {t('profile.level', { n: level })}
            </span>
            {user.role === 'admin' && (
              <span className="ml-1 inline-block rounded-full bg-heart px-3 py-0.5 text-xs font-extrabold text-white">
                {t('profile.admin')}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs font-bold text-slate-500">
            <span>{t('profile.level', { n: level })}</span>
            <span>{current} / {needed} XP</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-sky-soft">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-xp to-[#b48cff]"
              initial={{ width: 0 }}
              animate={{ width: `${(current / needed) * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-2 text-center">
          <Stat icon="⚡" value={user.progress.xp} label={t('profile.xp')} />
          <Stat icon="🪙" value={user.progress.coins} label={t('profile.coins')} />
          <Stat icon="🔥" value={user.progress.streak} label={t('profile.streak')} />
          <Stat icon="✅" value={completed} label={t('profile.lessons')} />
        </div>
      </div>

      <div className="mt-4 rounded-3xl bg-white p-6 shadow-soft">
        <h3 className="mb-3 font-display font-extrabold text-[#1f3a5f]">{t('profile.editProfile')}</h3>
        <label className="mb-3 block">
          <span className="mb-1 block text-sm font-bold text-slate-600">{t('profile.name')}</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border-2 border-sky-soft px-4 py-2.5 font-semibold outline-none focus:border-sky-deep"
          />
        </label>
        <span className="mb-1 block text-sm font-bold text-slate-600">{t('profile.avatar')}</span>
        <div className="mb-4 flex flex-wrap gap-2">
          {AVATARS.map((a) => (
            <button
              key={a}
              onClick={() => setAvatar(a)}
              className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl shadow-soft ring-2 ${
                avatar === a ? 'ring-sky-deep' : 'ring-transparent'
              } bg-sky-soft/50`}
            >
              {AVATAR_EMOJI[a]}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={save} disabled={saving}>
            {saving ? t('common.saving') : t('common.save')}
          </Button>
          {user.role === 'admin' && (
            <Button variant="gold" onClick={() => navigate('/admin')}>
              {t('profile.adminPanel')}
            </Button>
          )}
          <Button variant="danger" className="ml-auto" onClick={() => logout()}>
            {t('common.logout')}
          </Button>
        </div>
      </div>
    </PageShell>
  );
}

function Stat({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 py-3">
      <div className="text-xl">{icon}</div>
      <div className="font-display text-lg font-extrabold text-[#1f3a5f]">{value}</div>
      <div className="text-[10px] font-bold uppercase text-slate-400">{label}</div>
    </div>
  );
}
