import type { Request, Response } from 'express';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { profileSchema } from '../utils/validators.js';
import { toUserDTO, toProgressDTO } from '../utils/serializers.js';

async function loadUser(req: Request) {
  const user = await User.findById(req.auth!.sub);
  if (!user) throw ApiError.notFound('User not found');
  return user;
}

export async function me(req: Request, res: Response) {
  const user = await loadUser(req);
  res.json(toUserDTO(user));
}

export async function updateProfile(req: Request, res: Response) {
  const body = profileSchema.parse(req.body);
  const user = await User.findByIdAndUpdate(req.auth!.sub, { $set: body }, { new: true });
  if (!user) throw ApiError.notFound('User not found');
  res.json(toUserDTO(user));
}

export async function getProgress(req: Request, res: Response) {
  const user = await loadUser(req);
  res.json(toProgressDTO(user.progress));
}

/** Lightweight progress patch: daily/weekly goals, avatar-independent fields. */
export async function patchProgress(req: Request, res: Response) {
  const user = await loadUser(req);
  const { dailyGoal, weeklyGoal, energy, lives, tier } = req.body ?? {};
  if (typeof dailyGoal === 'number') user.progress.dailyGoal = dailyGoal;
  if (typeof weeklyGoal === 'number') user.progress.weeklyGoal = weeklyGoal;
  if (typeof energy === 'number') user.progress.energy = Math.max(0, Math.min(100, energy));
  if (typeof lives === 'number') user.progress.lives = Math.max(0, Math.min(5, lives));
  if (tier === 'junior' || tier === 'pro') user.progress.tier = tier;
  await user.save();
  res.json(toProgressDTO(user.progress));
}
