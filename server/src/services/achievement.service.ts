import { Achievement } from '../models/Achievement.js';
import type { UserDocument } from '../models/User.js';

/**
 * Evaluate all achievement rules against a user's current progress and grant
 * any newly-earned ones. Returns the freshly-granted achievement docs.
 */
export async function evaluateAchievements(user: UserDocument) {
  const all = await Achievement.find().lean();
  const owned = new Set(user.progress.achievements.map((a) => a.toString()));
  const completedCount = user.progress.lessonProgress.filter((p) => p.completed).length;
  const perfectCount = user.progress.lessonProgress.filter((p) => p.stars >= 3).length;

  const newlyEarned = [];
  for (const ach of all) {
    if (owned.has(ach._id.toString())) continue;
    if (meetsRule(ach.rule, { user, completedCount, perfectCount })) {
      user.progress.achievements.push(ach._id);
      user.progress.xp += ach.xpReward ?? 0;
      user.progress.coins += ach.coinReward ?? 0;
      newlyEarned.push(ach);
    }
  }
  return newlyEarned;
}

interface RuleContext {
  user: UserDocument;
  completedCount: number;
  perfectCount: number;
}

function meetsRule(rule: { type: string; value: number }, ctx: RuleContext): boolean {
  switch (rule.type) {
    case 'lessons_completed':
      return ctx.completedCount >= rule.value;
    case 'perfect_lessons':
      return ctx.perfectCount >= rule.value;
    case 'xp_reached':
      return ctx.user.progress.xp >= rule.value;
    case 'coins_reached':
      return ctx.user.progress.coins >= rule.value;
    case 'worlds_unlocked':
      return ctx.user.progress.worldUnlocked.length >= rule.value;
    case 'streak_reached':
      return ctx.user.progress.streak >= rule.value;
    default:
      return false;
  }
}
