import { z } from 'zod';
import { WORLD_THEMES, LESSON_TYPES } from '@wondermap/shared';

export const registerSchema = z.object({
  name: z.string().min(2).max(40),
  email: z.string().email(),
  password: z.string().min(6).max(72),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const profileSchema = z.object({
  name: z.string().min(2).max(40).optional(),
  avatar: z.string().min(1).max(30).optional(),
});

export const completeLessonSchema = z.object({
  lessonId: z.string().min(1),
  score: z.number().min(0).max(100),
  notebook: z.array(z.string()).optional(),
  badges: z.array(z.string()).optional(),
  mirror: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
  bonusCoins: z.number().min(0).max(500).optional(),
  bonusXp: z.number().min(0).max(500).optional(),
});

export const encounterSchema = z.object({
  encounterId: z.string().min(1),
  xp: z.number().min(0).max(200),
});

const vec2 = z.object({ x: z.number(), y: z.number() });
const decoration = z.object({
  kind: z.string(),
  x: z.number(),
  y: z.number(),
  scale: z.number().optional(),
  flip: z.boolean().optional(),
});
const path = z.object({ from: vec2, to: vec2, control: vec2.optional() });

export const worldUpsertSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  order: z.number(),
  theme: z.enum(WORLD_THEMES as [string, ...string[]]),
  background: z.string().optional(),
  music: z.string().optional(),
  requiredXP: z.number().min(0),
  decorations: z.array(decoration).optional(),
  paths: z.array(path).optional(),
});

export const lessonUpsertSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  world: z.string().min(1),
  order: z.number(),
  x: z.number(),
  y: z.number(),
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert']),
  type: z.enum(LESSON_TYPES as [string, ...string[]]),
  xp: z.number().min(0),
  coins: z.number().min(0),
  estimatedMinutes: z.number().min(1),
  prerequisites: z.array(z.string()).optional(),
});
