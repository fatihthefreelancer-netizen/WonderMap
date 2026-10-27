import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { useWorlds, useWorld } from '../hooks/queries';
import { TopBar } from '../components/hud/TopBar';
import { HintBubble } from '../components/hud/HintBubble';
import { BottomNav } from '../components/hud/BottomNav';
import { WorldDrawer } from '../components/hud/WorldDrawer';
import { TargetIcon } from '../components/hud/icons';
import { WorldMap } from '../components/map/WorldMap';
import { LessonModal } from '../features/lesson/LessonModal';
import { Celebration } from '../features/lesson/Celebration';
import { EncounterModal } from '../features/map/EncounterModal';
import { LoadingSplash } from '../components/ui/LoadingSplash';
import { themeFor } from '../lib/theme';
import { pickEncounter, type Encounter } from '../content/encounters';
import { useT } from '../i18n/useT';
import { useTc } from '../i18n/useTc';

export default function MapPage() {
  const { t } = useT();
  const { tc } = useTc();
  const user = useAuthStore((s) => s.user)!;
  const { selectedLesson, openLesson, closeLesson, celebration, celebrate, clearCelebration } = useUIStore();
  const { data: worlds, isLoading } = useWorlds();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const [encounterOpen, setEncounterOpen] = useState(false);
  const recenterRef = useRef<() => void>(() => {});
  const encounterSpawnedFor = useRef<string | null>(null);

  // choose the initial world: user's current, else first
  useEffect(() => {
    if (!worlds || activeId) return;
    const current = user.progress.currentWorld;
    const found = worlds.find((w) => w.id === current);
    setActiveId(found?.id ?? worlds[0]?.id ?? null);
  }, [worlds, activeId, user.progress.currentWorld]);

  // Occasionally offer a random encounter when entering a world.
  useEffect(() => {
    if (!activeId || encounterSpawnedFor.current === activeId) return;
    encounterSpawnedFor.current = activeId;
    const next = pickEncounter(user.progress.encounters ?? []);
    if (next && Math.random() < 0.7) {
      const t = setTimeout(() => setEncounter(next), 1500);
      return () => clearTimeout(t);
    }
    setEncounter(null);
  }, [activeId, user.progress.encounters]);

  const { data: worldData, isLoading: worldLoading } = useWorld(activeId);

  const index = useMemo(
    () => (worlds && activeId ? worlds.findIndex((w) => w.id === activeId) : 0),
    [worlds, activeId],
  );

  // Stars collected in this world, out of the three on offer at every stop.
  const stars = useMemo(() => {
    const lessons = worldData?.lessons ?? [];
    const ids = new Set(lessons.map((l) => l.id));
    const earned = user.progress.lessonProgress
      .filter((p) => ids.has(p.lesson))
      .reduce((sum, p) => sum + (p.stars ?? 0), 0);
    return { earned, total: lessons.length * 3 };
  }, [worldData, user.progress.lessonProgress]);

  if (isLoading || !worlds || !activeId) return <LoadingSplash />;

  const world = worlds[index];
  const unlocked =
    user.progress.worldUnlocked.includes(world.id) || user.progress.xp >= world.requiredXP;
  const palette = themeFor(world.theme);

  const go = (dir: -1 | 1) => {
    const next = worlds[index + dir];
    if (next) setActiveId(next.id);
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {worldData && unlocked ? (
        <WorldMap
          world={worldData.world}
          lessons={worldData.lessons}
          progress={user.progress}
          avatar={user.avatar}
          onSelectLesson={openLesson}
          onRecenter={(fn) => (recenterRef.current = fn)}
          onNextWorld={() => go(1)}
          canNextWorld={index < worlds.length - 1}
        />
      ) : (
        <LockedWorld palette={palette} requiredXP={world.requiredXP} currentXP={user.progress.xp} loading={worldLoading} />
      )}

      <TopBar
        user={user}
        onMenu={() => setMenuOpen(true)}
        place={{ title: tc(world.title), subtitle: world.subtitle ? tc(world.subtitle) : undefined, locked: !unlocked }}
        stars={stars.total > 0 ? stars : undefined}
      />

      {/*
        The way on to the next world is painted into the scene itself — the
        signboard by the water — so the chrome here only carries the controls
        that have nowhere to live in the landscape.
      */}
      <div className="pointer-events-none absolute right-3 top-1/2 z-30 flex -translate-y-1/2 flex-col items-end gap-2.5 sm:right-5">
        {unlocked && (
          <motion.button
            onClick={() => recenterRef.current?.()}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Center on player"
            className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-white/95 shadow-hud backdrop-blur-sm"
          >
            <TargetIcon />
          </motion.button>
        )}
        {index > 0 && (
          <motion.button
            onClick={() => go(-1)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            aria-label={t('world.prev')}
            className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-white/95 font-display text-xl font-black text-[#6b4a1e] shadow-hud backdrop-blur-sm"
          >
            ‹
          </motion.button>
        )}
      </div>

      {/* a villager needs a hand */}
      <AnimatePresence>
        {unlocked && encounter && !encounterOpen && (
          <HintBubble
            emoji={encounter.emoji}
            text={t('map.needHelp')}
            onClick={() => setEncounterOpen(true)}
          />
        )}
      </AnimatePresence>

      <BottomNav />

      <WorldDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        worlds={worlds}
        user={user}
        activeWorldId={activeId}
        onSelect={setActiveId}
      />

      <LessonModal lesson={selectedLesson} onClose={closeLesson} onCelebrate={celebrate} />
      {celebration && <Celebration result={celebration} onClose={clearCelebration} />}
      {encounterOpen && encounter && (
        <EncounterModal
          encounter={encounter}
          onClose={() => {
            setEncounterOpen(false);
            setEncounter(null);
          }}
        />
      )}
    </div>
  );
}

function LockedWorld({
  palette,
  requiredXP,
  currentXP,
  loading,
}: {
  palette: ReturnType<typeof themeFor>;
  requiredXP: number;
  currentXP: number;
  loading: boolean;
}) {
  const { t } = useT();
  return (
    <div
      className="absolute inset-0 grid place-items-center overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${palette.sky[0]}, ${palette.sky[1]})` }}
    >
      {/* the meadow rolls on behind the lock, so the world still feels like a place */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden>
        <path d="M0 150 Q 360 60 720 140 T 1440 110 V320 H0 Z" fill={palette.ground[0]} />
        <path d="M0 215 Q 420 150 900 205 T 1440 190 V320 H0 Z" fill={palette.ground[1]} />
      </svg>

      {!loading && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative rounded-3xl bg-white/95 p-8 text-center shadow-pop"
        >
          <div className="mb-2 text-6xl">🔒</div>
          <h2 className="font-display text-2xl font-extrabold text-[#1f3a5f]">{t('world.locked')}</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            {t('world.earnMore', { n: Math.max(0, requiredXP - currentXP) })}
          </p>
          <div className="mx-auto mt-4 h-3 w-56 overflow-hidden rounded-full bg-sky-soft">
            <div
              className="h-full rounded-full bg-gradient-to-r from-xp to-[#b48cff]"
              style={{ width: `${Math.min(100, (currentXP / requiredXP) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-bold text-slate-400">
            {currentXP} / {requiredXP} XP
          </p>
        </motion.div>
      )}
    </div>
  );
}
