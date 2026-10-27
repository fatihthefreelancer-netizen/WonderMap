import { starsFromScore, type CompleteLessonResult } from '@wondermap/shared';
import { Lesson } from '../models/Lesson.js';
import { World } from '../models/World.js';
import type { UserDocument } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { evaluateAchievements } from './achievement.service.js';
import { toProgressDTO, toAchievementDTO } from '../utils/serializers.js';

/**
 * Apply a lesson completion to the user: award XP/coins, record stars, then
 * unlock any lessons whose prerequisites are now met and any worlds whose
 * required XP threshold has been crossed.
 */
interface StoryExtras {
  notebook?: string[];
  badges?: string[];
  mirror?: { key: string; value: string }[];
  bonusCoins?: number;
  bonusXp?: number;
}

export async function completeLesson(
  user: UserDocument,
  lessonId: string,
  score: number,
  extras: StoryExtras = {},
): Promise<CompleteLessonResult> {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) throw ApiError.notFound('Lesson not found');

  const unlocked = new Set(user.progress.lessonUnlocked.map((l) => l.toString()));
  if (!unlocked.has(lessonId)) {
    throw ApiError.forbidden('Lesson is locked');
  }

  // --- Story rewards: notebook pages, badges, banked mirror answers ---
  const p = user.progress;
  p.notebook = p.notebook ?? [];
  p.badges = p.badges ?? [];
  p.mirror = p.mirror ?? [];
  const newNotebook: string[] = [];
  const newBadges: string[] = [];
  for (const term of [...(extras.notebook ?? []), lesson.notebookTerm].filter(Boolean) as string[]) {
    if (!p.notebook.includes(term)) {
      p.notebook.push(term);
      newNotebook.push(term);
    }
  }
  for (const badge of [...(extras.badges ?? []), lesson.badge].filter(Boolean) as string[]) {
    if (!p.badges.includes(badge)) {
      p.badges.push(badge);
      newBadges.push(badge);
    }
  }
  for (const m of extras.mirror ?? []) {
    const existing = p.mirror.find((x) => x.key === m.key);
    if (existing) existing.value = m.value;
    else p.mirror.push({ key: m.key, value: m.value } as never);
  }

  const stars = starsFromScore(score);
  const existing = user.progress.lessonProgress.find(
    (p) => p.lesson.toString() === lessonId,
  );
  const firstCompletion = !existing?.completed;

  // Rewards are only granted the first time; replays just improve the score.
  let earnedXp = 0;
  let earnedCoins = 0;
  if (firstCompletion) {
    earnedXp = lesson.xp;
    earnedCoins = lesson.coins;
    user.progress.xp += earnedXp;
    user.progress.coins += earnedCoins;
  }

  // Minigame performance bonus is granted every play (rewards replaying a rush).
  const bonusXp = Math.max(0, Math.min(500, extras.bonusXp ?? 0));
  const bonusCoins = Math.max(0, Math.min(500, extras.bonusCoins ?? 0));
  if (bonusXp || bonusCoins) {
    user.progress.xp += bonusXp;
    user.progress.coins += bonusCoins;
    earnedXp += bonusXp;
    earnedCoins += bonusCoins;
  }

  if (existing) {
    existing.completed = true;
    existing.stars = Math.max(existing.stars, stars);
    existing.bestScore = Math.max(existing.bestScore, score);
    existing.completedAt = new Date();
  } else {
    user.progress.lessonProgress.push({
      lesson: lesson._id,
      completed: true,
      stars,
      bestScore: score,
      completedAt: new Date(),
    } as never);
  }

  user.progress.currentLesson = lesson._id;

  // --- Unlock lessons whose prerequisites are all completed ---
  const unlockedLessons = await unlockAvailableLessons(user);

  // --- Unlock worlds whose XP requirement is now satisfied ---
  const unlockedWorlds = await unlockAvailableWorlds(user);

  // --- Achievements ---
  const newAchievements = await evaluateAchievements(user);

  await user.save();

  return {
    progress: toProgressDTO(user.progress),
    earned: { xp: earnedXp, coins: earnedCoins, stars },
    unlockedLessons,
    unlockedWorlds,
    newAchievements: newAchievements.map(toAchievementDTO),
    newBadges,
    newNotebook,
  };
}

async function unlockAvailableLessons(user: UserDocument): Promise<string[]> {
  const unlockedWorldIds = user.progress.worldUnlocked.map((w) => w.toString());
  const lessons = await Lesson.find({ world: { $in: unlockedWorldIds } }).lean();
  const completed = new Set(
    user.progress.lessonProgress.filter((p) => p.completed).map((p) => p.lesson.toString()),
  );
  const alreadyUnlocked = new Set(user.progress.lessonUnlocked.map((l) => l.toString()));

  const newlyUnlocked: string[] = [];
  for (const l of lessons) {
    const lid = l._id.toString();
    if (alreadyUnlocked.has(lid)) continue;
    const prereqs = (l.prerequisites ?? []).map((p) => p.toString());
    const ready = prereqs.every((p) => completed.has(p));
    if (ready) {
      user.progress.lessonUnlocked.push(l._id);
      alreadyUnlocked.add(lid);
      newlyUnlocked.push(lid);
    }
  }
  return newlyUnlocked;
}

async function unlockAvailableWorlds(user: UserDocument): Promise<string[]> {
  const worlds = await World.find().sort({ order: 1 }).lean();
  const alreadyUnlocked = new Set(user.progress.worldUnlocked.map((w) => w.toString()));
  const newlyUnlocked: string[] = [];

  for (const w of worlds) {
    const wid = w._id.toString();
    if (alreadyUnlocked.has(wid)) continue;
    if (user.progress.xp >= (w.requiredXP ?? 0)) {
      user.progress.worldUnlocked.push(w._id);
      alreadyUnlocked.add(wid);
      newlyUnlocked.push(wid);
      // Unlock that world's entry lessons (those with no prerequisites).
      const entryLessons = await Lesson.find({
        world: w._id,
        $or: [{ prerequisites: { $size: 0 } }, { prerequisites: { $exists: false } }],
      }).lean();
      const unlockedLessonSet = new Set(user.progress.lessonUnlocked.map((l) => l.toString()));
      for (const el of entryLessons) {
        if (!unlockedLessonSet.has(el._id.toString())) {
          user.progress.lessonUnlocked.push(el._id);
        }
      }
    }
  }
  return newlyUnlocked;
}
