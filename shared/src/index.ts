/**
 * @wondermap/shared
 * Contracts shared by the client and the server. Keep this framework-free.
 */

/* ----------------------------- Enums / unions ----------------------------- */

export type WorldTheme =
  | 'forest'
  | 'beach'
  | 'snow'
  | 'mountain'
  | 'jungle'
  | 'city'
  | 'space'
  | 'ocean'
  | 'volcano'
  | 'egypt'
  | 'future'
  | 'magic';

export const WORLD_THEMES: WorldTheme[] = [
  'forest', 'beach', 'snow', 'mountain', 'jungle', 'city',
  'space', 'ocean', 'volcano', 'egypt', 'future', 'magic',
];

export type LessonType =
  | 'lesson'
  | 'boss'
  | 'challenge'
  | 'treasure'
  | 'review';

export const LESSON_TYPES: LessonType[] = [
  'lesson', 'boss', 'challenge', 'treasure', 'review',
];

export type LessonDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

/** Difficulty tier chosen by the learner. Junior = 8–11, Pro = 12–15. */
export type LearnerTier = 'junior' | 'pro';

export interface MirrorAnswer {
  key: string;
  value: string;
}

/** Derived per-user node state (never stored on the Lesson itself). */
export type NodeState = 'locked' | 'unlocked' | 'completed' | 'perfect';

export type DecorationKind =
  | 'tree'
  | 'pine'
  | 'bush'
  | 'rock'
  | 'cloud'
  | 'building'
  | 'castle'
  | 'bridge'
  | 'flower'
  | 'grass'
  | 'mountain'
  | 'lamp';

/* --------------------------------- Models --------------------------------- */

export interface Vec2 {
  x: number;
  y: number;
}

export interface DecorationDTO {
  id: string;
  kind: DecorationKind;
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
}

export interface PathDTO {
  id: string;
  from: Vec2;
  to: Vec2;
  /** optional control point for the quadratic curve; auto-derived when absent */
  control?: Vec2;
}

export interface WorldDTO {
  id: string;
  title: string;
  order: number;
  theme: WorldTheme;
  subtitle?: string;
  background?: string;
  music?: string;
  requiredXP: number;
  /** authored scene */
  decorations: DecorationDTO[];
  paths: PathDTO[];
  lessonCount: number;
}

export interface LessonDTO {
  id: string;
  title: string;
  description: string;
  world: string;
  order: number;
  x: number;
  y: number;
  difficulty: LessonDifficulty;
  type: LessonType;
  xp: number;
  coins: number;
  estimatedMinutes: number;
  prerequisites: string[];
  /** Links a node to an authored Milo story scene (see client content). */
  storyId?: string;
  /** Links a node to a reusable minigame engine (e.g. "customer-rush"). */
  minigame?: string;
  /** Node whose content is designed but not yet scripted — shows a polite teaser. */
  comingSoon?: boolean;
  /** Notebook term this lesson unlocks (key into the notebook glossary). */
  notebookTerm?: string;
  /** Story badge key this lesson awards. */
  badge?: string;
}

export interface AchievementDTO {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  coinReward: number;
}

/* ---------------------------- User / progress ----------------------------- */

export interface LessonProgress {
  lesson: string;
  completed: boolean;
  stars: number; // 0..3
  bestScore: number; // 0..100
  completedAt?: string;
}

export interface UserProgress {
  xp: number;
  coins: number;
  streak: number;
  lives: number;
  energy: number;
  worldUnlocked: string[];
  lessonUnlocked: string[];
  lessonProgress: LessonProgress[];
  achievements: string[];
  currentWorld?: string;
  currentLesson?: string;
  dailyGoal: number;
  weeklyGoal: number;
  /** Milo-story systems */
  tier: LearnerTier;
  notebook: string[]; // unlocked notebook term keys
  badges: string[]; // unlocked story-badge keys
  mirror: MirrorAnswer[]; // banked apprentice answers
  encounters: string[]; // completed random-encounter ids
}

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar: string;
  createdAt: string;
  progress: UserProgress;
}

/* -------------------------------- Requests -------------------------------- */

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserDTO;
  accessToken: string;
}

export interface CompleteLessonInput {
  lessonId: string;
  score: number; // 0..100
  /** Story rewards to persist alongside the completion. */
  notebook?: string[];
  badges?: string[];
  mirror?: MirrorAnswer[];
  /** Performance-based bonus from minigames (added on top of base rewards). */
  bonusCoins?: number;
  bonusXp?: number;
}

export interface CompleteLessonResult {
  progress: UserProgress;
  earned: { xp: number; coins: number; stars: number };
  unlockedLessons: string[];
  unlockedWorlds: string[];
  newAchievements: AchievementDTO[];
  newBadges: string[];
  newNotebook: string[];
}

export interface EncounterInput {
  encounterId: string;
  xp: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

/* -------------------------------- Helpers --------------------------------- */

export const XP_PER_LEVEL = 500;

export function levelFromXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpIntoLevel(xp: number): { current: number; needed: number } {
  return { current: xp % XP_PER_LEVEL, needed: XP_PER_LEVEL };
}

export function starsFromScore(score: number): number {
  if (score >= 95) return 3;
  if (score >= 75) return 2;
  if (score >= 50) return 1;
  return 0;
}
