import { lazy, Suspense, useEffect, useState, type ComponentType } from 'react';
import { motion } from 'framer-motion';
import type { LessonDTO, CompleteLessonResult } from '@wondermap/shared';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { LessonPlay } from './LessonPlay';
import { StoryPlayer, type StoryResult } from './StoryPlayer';
import { CharacterPortrait } from './CharacterPortrait';
import { CustomerRush, type RushResult } from '../customerRush/CustomerRush';
import type { ChapterResult } from '../barter/BarterChapter';
import { LoadingSplash } from '../../components/ui/LoadingSplash';
import { useCompleteLesson } from '../../hooks/queries';
import { useAuthStore } from '../../store/authStore';
import { NODE_TYPE_ICON } from '../../lib/constants';
import { sceneFor } from '../../content/chapter1';
import { simulationFor } from '../../content/customerRush';
import { useT } from '../../i18n/useT';
import { useTc } from '../../i18n/useTc';

interface Props {
  lesson: LessonDTO | null;
  onClose: () => void;
  onCelebrate: (result: CompleteLessonResult) => void;
}

const DIFFICULTY_LABEL: Record<string, { label: string; color: string }> = {
  easy: { label: 'Easy', color: 'bg-grass-light' },
  medium: { label: 'Medium', color: 'bg-coin' },
  hard: { label: 'Hard', color: 'bg-[#ff8a45]' },
  expert: { label: 'Expert', color: 'bg-heart' },
};

type Phase = 'intro' | 'quiz' | 'story' | 'minigame' | 'chapter';

/**
 * Story beats that have been built out into a full chapter experience. These
 * take over the whole screen in place of the beat-by-beat StoryPlayer.
 */
interface ChapterProps {
  onExit: () => void;
  onFinish: (r: ChapterResult) => void;
  submitting?: boolean;
  userId?: string;
}

/*
 * Imported lazily, because they were being imported eagerly. A chapter is a
 * large thing — its own board, its own minigames, its own copy in three
 * languages — and importing it here put all of it into the chunk for the map:
 * the first screen after signing in paid to download two chapters nobody had
 * opened yet. They are now separate chunks, fetched while the lesson's intro
 * card is on screen (see the effect below), seconds before anybody can press
 * Start.
 */
const CHAPTER_LOADERS: Record<string, () => Promise<{ default: ComponentType<ChapterProps> }>> = {
  '1a': () => import('../barter/BarterChapter').then((m) => ({ default: m.BarterChapter })),
  '1b': () => import('../chapter2/Chapter2').then((m) => ({ default: m.Chapter2 })),
};

const CHAPTERS: Record<string, ComponentType<ChapterProps>> = Object.fromEntries(
  Object.entries(CHAPTER_LOADERS).map(([id, load]) => [id, lazy(load)]),
);

/**
 * The painted backdrop and the figure each chapter opens on.
 *
 * These are the two heaviest things in the first frame and the two that look
 * worst arriving late — a chapter that fades up on a white rectangle and then
 * snaps to a market has already told the child it is a web page.
 */
const CHAPTER_PRELOAD: Record<string, string[]> = {
  '1a': ['/chapter/scene-square.webp', '/chapter/elias-speaking.webp'],
  '1b': ['/chapter2/scene-desert.webp', '/chapter/elias-speaking.webp'],
};

export function LessonModal({ lesson, onClose, onCelebrate }: Props) {
  const { t } = useT();
  const { tc } = useTc();
  const [phase, setPhase] = useState<Phase>('intro');
  const complete = useCompleteLesson();
  const tier = useAuthStore((s) => s.user?.progress.tier ?? 'junior');
  const userId = useAuthStore((s) => s.user?.id ?? 'me');
  const lessonProgress = useAuthStore((s) => s.user?.progress.lessonProgress);

  useEffect(() => {
    if (lesson) setPhase('intro');
  }, [lesson]);

  /*
   * Warm the chapter's chunk and its opening art while the intro card is up.
   *
   * Opening a lesson is the one moment we know what is about to be needed and
   * have a few idle seconds to fetch it: the child is reading the card and
   * looking for the Start button. Doing it here is what keeps the Suspense
   * fallback below from ever actually being seen.
   */
  const storyId = lesson?.storyId;
  useEffect(() => {
    if (!storyId) return;
    void CHAPTER_LOADERS[storyId]?.();
    for (const file of CHAPTER_PRELOAD[storyId] ?? []) {
      const img = new Image();
      img.src = file;
    }
  }, [storyId]);

  if (!lesson) return null;
  const diff = DIFFICULTY_LABEL[lesson.difficulty];
  const alreadyDone = !!lessonProgress?.find((p) => p.lesson === lesson.id)?.completed;
  const Chapter = lesson.storyId ? CHAPTERS[lesson.storyId] : undefined;
  const scene = !Chapter && lesson.storyId ? sceneFor(lesson.storyId) : undefined;
  const sim = lesson.minigame ? simulationFor(lesson.minigame) : undefined;

  async function finish(score: number, extras?: StoryResult) {
    if (!lesson) return;
    const result = await complete.mutateAsync({
      lessonId: lesson.id,
      score,
      notebook: extras?.notebook,
      badges: extras?.badges,
      mirror: extras?.mirror,
    });
    onClose();
    onCelebrate(result);
  }

  async function finishRush(r: RushResult) {
    if (!lesson) return;
    const score = Math.max(50, Math.min(100, r.helped * 18)); // performance → stars
    const result = await complete.mutateAsync({
      lessonId: lesson.id,
      score,
      badges: r.badges,
      bonusCoins: r.coins,
      bonusXp: r.xp,
    });
    onClose();
    onCelebrate(result);
  }

  async function finishChapter(r: ChapterResult) {
    if (!lesson) return;
    /*
     * A replay used to pay nothing at all, so the celebration screen cheerfully
     * announced "+0 XP, +0 coins" — the most deflating thing in the app, and a
     * direct tax on the one impulse worth encouraging in a child. What they
     * earned inside the chapter is theirs; a second run pays half, which keeps
     * practice worth doing without making it the fastest way to farm coins.
     */
    const rate = alreadyDone ? 0.5 : 1;
    const result = await complete.mutateAsync({
      lessonId: lesson.id,
      score: r.score,
      notebook: r.notebook,
      badges: r.badges,
      bonusCoins: Math.round((r.coins ?? 0) * rate),
      bonusXp: Math.round((r.xp ?? 0) * rate),
    });
    onClose();
    onCelebrate(result);
  }

  // A full chapter experience takes over the screen.
  if (phase === 'chapter' && Chapter) {
    return (
      <Suspense fallback={<LoadingSplash />}>
        <Chapter
          onExit={onClose}
          onFinish={finishChapter}
          submitting={complete.isPending}
          userId={userId}
        />
      </Suspense>
    );
  }

  // Full-screen story mode renders outside the small modal.
  if (phase === 'story' && scene) {
    return (
      <StoryPlayer
        scene={scene}
        tier={tier}
        lessonTitle={lesson.title}
        onExit={onClose}
        onFinish={(extras) => finish(100, extras)}
      />
    );
  }

  // Full-screen minigame.
  if (phase === 'minigame' && sim) {
    return (
      <CustomerRush sim={sim} submitting={complete.isPending} onExit={onClose} onFinish={finishRush} />
    );
  }

  return (
    <Modal open={!!lesson} onClose={onClose} labelledBy="lesson-title">
      {phase === 'intro' ? (
        <div className="overflow-hidden rounded-3xl bg-white shadow-pop">
          <div className="relative bg-gradient-to-b from-[#ffd98a] to-[#f0b752] px-6 pb-8 pt-6 text-center text-[#6b4a1e]">
            {scene || sim ? (
              <div className="mx-auto mb-1 w-max">
                <CharacterPortrait id="milo" size={72} />
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                className="mx-auto mb-2 grid h-20 w-20 place-items-center rounded-full bg-white/30 text-5xl"
              >
                {NODE_TYPE_ICON[lesson.type] ?? '📘'}
              </motion.div>
            )}
            <h2 id="lesson-title" className="mt-2 font-display text-2xl font-extrabold">
              {tc(lesson.title)}
            </h2>
            <span className={`mt-1 inline-block rounded-full ${diff.color} px-3 py-0.5 text-xs font-extrabold text-white`}>
              {t(`diff.${lesson.difficulty}`)} · {lesson.type.toUpperCase()}
            </span>
          </div>

          <div className="px-6 py-5">
            {lesson.comingSoon ? (
              <ComingSoon onClose={onClose} />
            ) : (
              <>
                <p className="mb-4 text-center text-sm font-semibold text-slate-500">
                  {scene
                    ? t('lesson.storyIntro')
                    : sim
                      ? t('lesson.workshopIntro')
                      : tc(lesson.description)}
                </p>
                <div className="mb-5 grid grid-cols-3 gap-2">
                  {/*
                    A chapter pays as you play, so the flat "+30 XP / +15 coins"
                    was understating it by a wide margin — a clean run of
                    chapter 1 is closer to eighty coins. Show the floor, and say
                    there is more on top, rather than printing a number the
                    lesson is going to beat.
                  */}
                  <Stat
                    icon="⚡"
                    label={t('lesson.xp')}
                    value={Chapter ? `${lesson.xp}+` : `+${lesson.xp}`}
                    color="text-xp"
                  />
                  <Stat
                    icon="🪙"
                    label={t('lesson.coins')}
                    value={Chapter ? `${lesson.coins}+` : `+${lesson.coins}`}
                    color="text-[#b5820f]"
                  />
                  <Stat icon="⏱️" label={t('lesson.time')} value={`${lesson.estimatedMinutes}m`} color="text-sky-deep" />
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" size="lg" className="flex-1" onClick={onClose}>
                    {t('common.later')}
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="flex-1"
                    onClick={() => setPhase(Chapter ? 'chapter' : scene ? 'story' : sim ? 'minigame' : 'quiz')}
                  >
                    {scene ? t('lesson.startStory') : sim ? t('lesson.enterWorkshop') : t('lesson.start')}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <LessonPlay lesson={lesson} onFinish={(score) => finish(score)} />
      )}
    </Modal>
  );
}

function ComingSoon({ onClose }: { onClose: () => void }) {
  const { t } = useT();
  return (
    <div className="text-center">
      <div className="mb-2 text-5xl">🚧</div>
      <p className="mb-1 font-display text-lg font-extrabold text-[#1f3a5f]">{t('lesson.comingSoon')}</p>
      <p className="mb-5 text-sm font-semibold text-slate-500">{t('lesson.comingSoonText')}</p>
      <Button size="lg" className="w-full" onClick={onClose}>
        {t('common.okay')}
      </Button>
    </div>
  );
}

function Stat({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 py-3 text-center">
      <div className="text-xl">{icon}</div>
      <div className={`font-display text-lg font-extrabold ${color}`}>{value}</div>
      <div className="text-[10px] font-bold uppercase text-slate-400">{label}</div>
    </div>
  );
}
