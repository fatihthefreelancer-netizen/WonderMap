import type { Request, Response } from 'express';
import { World } from '../models/World.js';
import { Lesson } from '../models/Lesson.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { worldUpsertSchema, lessonUpsertSchema } from '../utils/validators.js';
import { toWorldDTO, toLessonDTO, toUserDTO } from '../utils/serializers.js';

/* ------------------------------- Worlds ---------------------------------- */

export async function createWorld(req: Request, res: Response) {
  const body = worldUpsertSchema.parse(req.body);
  const world = await World.create(body);
  res.status(201).json(toWorldDTO(world));
}

export async function updateWorld(req: Request, res: Response) {
  const body = worldUpsertSchema.partial().parse(req.body);
  const world = await World.findByIdAndUpdate(req.params.id, { $set: body }, { new: true });
  if (!world) throw ApiError.notFound('World not found');
  res.json(toWorldDTO(world));
}

export async function deleteWorld(req: Request, res: Response) {
  const world = await World.findByIdAndDelete(req.params.id);
  if (!world) throw ApiError.notFound('World not found');
  await Lesson.deleteMany({ world: world._id });
  res.json({ ok: true });
}

/* ------------------------------- Lessons --------------------------------- */

export async function createLesson(req: Request, res: Response) {
  const body = lessonUpsertSchema.parse(req.body);
  const lesson = await Lesson.create(body);
  res.status(201).json(toLessonDTO(lesson));
}

export async function updateLesson(req: Request, res: Response) {
  const body = lessonUpsertSchema.partial().parse(req.body);
  const lesson = await Lesson.findByIdAndUpdate(req.params.id, { $set: body }, { new: true });
  if (!lesson) throw ApiError.notFound('Lesson not found');
  res.json(toLessonDTO(lesson));
}

export async function deleteLesson(req: Request, res: Response) {
  const lesson = await Lesson.findByIdAndDelete(req.params.id);
  if (!lesson) throw ApiError.notFound('Lesson not found');
  res.json({ ok: true });
}

/** Bulk-move endpoint used by the visual map editor when dragging nodes. */
export async function moveLessons(req: Request, res: Response) {
  const moves: Array<{ id: string; x: number; y: number }> = req.body?.moves ?? [];
  await Promise.all(
    moves.map((m) => Lesson.findByIdAndUpdate(m.id, { $set: { x: m.x, y: m.y } })),
  );
  res.json({ ok: true, updated: moves.length });
}

/** Persist a whole scene (decorations + paths) from the map editor. */
export async function saveWorldScene(req: Request, res: Response) {
  const { decorations, paths } = req.body ?? {};
  const world = await World.findByIdAndUpdate(
    req.params.id,
    { $set: { decorations: decorations ?? [], paths: paths ?? [] } },
    { new: true },
  );
  if (!world) throw ApiError.notFound('World not found');
  res.json(toWorldDTO(world));
}

/* -------------------------------- Users ---------------------------------- */

export async function listUsers(_req: Request, res: Response) {
  const users = await User.find().sort({ createdAt: -1 }).limit(200);
  res.json(users.map(toUserDTO));
}

export async function resetUserProgress(req: Request, res: Response) {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound('User not found');
  const firstWorld = await World.findOne().sort({ order: 1 });
  const entryLessons = firstWorld
    ? await Lesson.find({ world: firstWorld._id, prerequisites: { $size: 0 } })
    : [];
  user.progress = {
    xp: 0,
    coins: 50,
    streak: 0,
    lives: 5,
    energy: 100,
    worldUnlocked: firstWorld ? [firstWorld._id] : [],
    lessonUnlocked: entryLessons.map((l) => l._id),
    lessonProgress: [],
    achievements: [],
    currentWorld: firstWorld?._id,
    currentLesson: undefined,
    dailyGoal: 50,
    weeklyGoal: 300,
  } as never;
  await user.save();
  res.json(toUserDTO(user));
}

/* ------------------------------ Analytics -------------------------------- */

export async function analytics(_req: Request, res: Response) {
  const [userCount, worldCount, lessonCount, topUsers] = await Promise.all([
    User.countDocuments(),
    World.countDocuments(),
    Lesson.countDocuments(),
    User.find().sort({ 'progress.xp': -1 }).limit(5).select('name progress.xp progress.coins'),
  ]);
  const completions = await User.aggregate([
    { $project: { count: { $size: { $ifNull: ['$progress.lessonProgress', []] } } } },
    { $group: { _id: null, total: { $sum: '$count' } } },
  ]);
  res.json({
    userCount,
    worldCount,
    lessonCount,
    totalCompletions: completions[0]?.total ?? 0,
    leaderboard: topUsers.map((u) => ({
      name: u.name,
      xp: u.progress.xp,
      coins: u.progress.coins,
    })),
  });
}
