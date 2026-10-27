import type { Request, Response } from 'express';
import { World } from '../models/World.js';
import { Lesson } from '../models/Lesson.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { completeLessonSchema, encounterSchema } from '../utils/validators.js';
import { toWorldDTO, toLessonDTO } from '../utils/serializers.js';
import { completeLesson as applyCompletion } from '../services/progress.service.js';

export async function listWorlds(_req: Request, res: Response) {
  const worlds = await World.find().sort({ order: 1 }).lean();
  const counts = await Lesson.aggregate([
    { $group: { _id: '$world', count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((c) => [c._id.toString(), c.count]));
  res.json(worlds.map((w) => toWorldDTO(w, countMap.get(w._id.toString()) ?? 0)));
}

export async function getWorld(req: Request, res: Response) {
  const world = await World.findById(req.params.id).lean();
  if (!world) throw ApiError.notFound('World not found');
  const lessons = await Lesson.find({ world: world._id }).sort({ order: 1 }).lean();
  res.json({
    world: toWorldDTO(world, lessons.length),
    lessons: lessons.map(toLessonDTO),
  });
}

export async function getLesson(req: Request, res: Response) {
  const lesson = await Lesson.findById(req.params.id).lean();
  if (!lesson) throw ApiError.notFound('Lesson not found');
  res.json(toLessonDTO(lesson));
}

export async function completeLesson(req: Request, res: Response) {
  const body = completeLessonSchema.parse(req.body);
  const user = await User.findById(req.auth!.sub);
  if (!user) throw ApiError.notFound('User not found');
  const result = await applyCompletion(user, body.lessonId, body.score, {
    notebook: body.notebook,
    badges: body.badges,
    mirror: body.mirror,
    bonusCoins: body.bonusCoins,
    bonusXp: body.bonusXp,
  });
  res.json(result);
}

export async function completeEncounter(req: Request, res: Response) {
  const body = encounterSchema.parse(req.body);
  const user = await User.findById(req.auth!.sub);
  if (!user) throw ApiError.notFound('User not found');
  user.progress.encounters = user.progress.encounters ?? [];
  if (!user.progress.encounters.includes(body.encounterId)) {
    user.progress.encounters.push(body.encounterId);
    user.progress.xp += body.xp;
  }
  await user.save();
  const { toProgressDTO } = await import('../utils/serializers.js');
  res.json(toProgressDTO(user.progress));
}
