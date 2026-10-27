import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { adminService, worldService } from '../lib/services';
import { useWorlds } from '../hooks/queries';
import { Button } from '../components/ui/Button';
import { MapEditor } from '../features/admin/MapEditor';
import { themeFor } from '../lib/theme';

type Tab = 'dashboard' | 'worlds' | 'users' | 'editor';

export default function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('dashboard');

  return (
    <div className="fixed inset-0 overflow-y-auto bg-slate-100">
      <header className="sticky top-0 z-20 flex items-center gap-3 bg-[#1f3a5f] px-4 py-3 text-white shadow-lg">
        <button onClick={() => navigate('/')} className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">
          ‹
        </button>
        <h1 className="font-display text-xl font-extrabold">🛠️ WonderMap Admin</h1>
        <nav className="ml-auto flex gap-1">
          {(['dashboard', 'worlds', 'users', 'editor'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-xl px-3 py-1.5 text-sm font-bold capitalize ${
                tab === t ? 'bg-white text-[#1f3a5f]' : 'text-white/80 hover:bg-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl p-4">
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'worlds' && <WorldsAdmin />}
        {tab === 'users' && <UsersAdmin />}
        {tab === 'editor' && <EditorTab />}
      </main>
    </div>
  );
}

/* ------------------------------- Dashboard -------------------------------- */

function Dashboard() {
  const { data } = useQuery({ queryKey: ['admin', 'analytics'], queryFn: adminService.analytics });
  if (!data) return <p className="text-slate-500">Loading analytics…</p>;
  const cards = [
    { icon: '👥', label: 'Users', value: data.userCount },
    { icon: '🌍', label: 'Worlds', value: data.worldCount },
    { icon: '📘', label: 'Lessons', value: data.lessonCount },
    { icon: '✅', label: 'Completions', value: data.totalCompletions },
  ];
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl bg-white p-5 text-center shadow"
          >
            <div className="text-3xl">{c.icon}</div>
            <div className="font-display text-3xl font-extrabold text-[#1f3a5f]">{c.value}</div>
            <div className="text-xs font-bold uppercase text-slate-400">{c.label}</div>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-white p-5 shadow">
        <h2 className="mb-3 font-display font-extrabold text-[#1f3a5f]">🏅 Leaderboard</h2>
        <div className="space-y-2">
          {data.leaderboard.map((u: { name: string; xp: number; coins: number }, i: number) => (
            <div key={i} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2">
              <span className="w-6 font-display text-lg font-extrabold text-slate-400">{i + 1}</span>
              <span className="flex-1 font-bold text-[#1f3a5f]">{u.name}</span>
              <span className="text-sm font-bold text-xp">{u.xp} XP</span>
              <span className="text-sm font-bold text-[#b5820f]">🪙 {u.coins}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Worlds --------------------------------- */

function WorldsAdmin() {
  const { data: worlds } = useWorlds();
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: ['worlds'] });

  async function remove(id: string, title: string) {
    if (!confirm(`Delete "${title}" and all its lessons?`)) return;
    await adminService.deleteWorld(id);
    refresh();
  }

  return (
    <div className="space-y-2">
      {worlds?.map((w) => {
        const palette = themeFor(w.theme);
        return (
          <div key={w.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow">
            <div className="grid h-12 w-12 place-items-center rounded-xl text-2xl" style={{ background: palette.ground[0] }}>
              {palette.emoji}
            </div>
            <div className="flex-1">
              <p className="font-display font-extrabold text-[#1f3a5f]">
                {w.order + 1}. {w.title}
              </p>
              <p className="text-xs font-semibold text-slate-500">
                {w.theme} · {w.lessonCount} lessons · unlock {w.requiredXP} XP · {w.decorations.length} decorations
              </p>
            </div>
            <Button size="sm" variant="danger" onClick={() => remove(w.id, w.title)}>
              Delete
            </Button>
          </div>
        );
      })}
      <p className="pt-2 text-center text-xs font-semibold text-slate-500">
        Use the <b>Editor</b> tab to visually arrange each world's scene and lesson nodes.
      </p>
    </div>
  );
}

/* --------------------------------- Users ---------------------------------- */

function UsersAdmin() {
  const qc = useQueryClient();
  const { data: users } = useQuery({ queryKey: ['admin', 'users'], queryFn: adminService.users });

  async function reset(id: string, name: string) {
    if (!confirm(`Reset all progress for ${name}?`)) return;
    await adminService.resetUser(id);
    qc.invalidateQueries({ queryKey: ['admin', 'users'] });
  }

  return (
    <div className="space-y-2">
      {users?.map((u) => (
        <div key={u.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow">
          <div className="flex-1">
            <p className="font-display font-extrabold text-[#1f3a5f]">
              {u.name} {u.role === 'admin' && <span className="text-xs text-heart">ADMIN</span>}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              {u.email} · {u.progress.xp} XP · 🪙 {u.progress.coins} · {u.progress.worldUnlocked.length} worlds
            </p>
          </div>
          <Button size="sm" variant="ghost" onClick={() => reset(u.id, u.name)}>
            Reset
          </Button>
        </div>
      ))}
    </div>
  );
}

/* --------------------------------- Editor --------------------------------- */

function EditorTab() {
  const { data: worlds } = useWorlds();
  const [worldId, setWorldId] = useState<string | null>(null);
  const activeId = worldId ?? worlds?.[0]?.id ?? null;
  const { data, refetch } = useQuery({
    queryKey: ['world', activeId, 'editor'],
    queryFn: () => worldService.get(activeId as string),
    enabled: !!activeId,
  });

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <label className="text-sm font-bold text-slate-600">World:</label>
        <select
          value={activeId ?? ''}
          onChange={(e) => setWorldId(e.target.value)}
          className="rounded-xl border-2 border-sky-soft bg-white px-3 py-1.5 font-semibold"
        >
          {worlds?.map((w) => (
            <option key={w.id} value={w.id}>
              {w.order + 1}. {w.title}
            </option>
          ))}
        </select>
      </div>
      {data ? (
        <MapEditor world={data.world} lessons={data.lessons} onSaved={() => refetch()} />
      ) : (
        <p className="text-slate-500">Loading world…</p>
      )}
    </div>
  );
}
