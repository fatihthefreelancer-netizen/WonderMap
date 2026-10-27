import type { Request, Response } from 'express';
import { Achievement } from '../models/Achievement.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { toAchievementDTO } from '../utils/serializers.js';

export async function listAchievements(req: Request, res: Response) {
  const [all, user] = await Promise.all([
    Achievement.find().lean(),
    User.findById(req.auth!.sub).lean(),
  ]);
  const owned = new Set((user?.progress.achievements ?? []).map((a) => a.toString()));
  res.json(
    all.map((a) => ({
      ...toAchievementDTO(a),
      unlocked: owned.has(a._id.toString()),
    })),
  );
}

/** Reward catalogue derived from achievements (kept simple for the MVP). */
export async function listRewards(_req: Request, res: Response) {
  const rewards = await Achievement.find().lean();
  res.json(
    rewards.map((r) => ({
      id: r._id.toString(),
      title: r.title,
      icon: r.icon,
      coinReward: r.coinReward,
      xpReward: r.xpReward,
    })),
  );
}

export async function claimReward(req: Request, res: Response) {
  const { rewardId } = req.body ?? {};
  const reward = await Achievement.findById(rewardId).lean();
  if (!reward) throw ApiError.notFound('Reward not found');
  const user = await User.findById(req.auth!.sub);
  if (!user) throw ApiError.notFound('User not found');
  const owned = user.progress.achievements.some((a) => a.toString() === rewardId);
  if (!owned) throw ApiError.forbidden('Reward not yet earned');
  // Idempotent claim marker via inventory.
  const claimKey = `claimed:${rewardId}`;
  if (user.inventory.includes(claimKey)) {
    throw ApiError.conflict('Reward already claimed');
  }
  user.inventory.push(claimKey);
  user.progress.coins += reward.coinReward ?? 0;
  await user.save();
  res.json({ ok: true, coins: user.progress.coins });
}
