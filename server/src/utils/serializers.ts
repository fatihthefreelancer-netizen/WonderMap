import type {
  UserDTO,
  WorldDTO,
  LessonDTO,
  AchievementDTO,
  UserProgress,
} from '@wondermap/shared';

/* eslint-disable @typescript-eslint/no-explicit-any */

const id = (v: any): string => (v?._id ?? v)?.toString();

export function toProgressDTO(p: any): UserProgress {
  return {
    xp: p.xp ?? 0,
    coins: p.coins ?? 0,
    streak: p.streak ?? 0,
    lives: p.lives ?? 5,
    energy: p.energy ?? 100,
    worldUnlocked: (p.worldUnlocked ?? []).map(id),
    lessonUnlocked: (p.lessonUnlocked ?? []).map(id),
    lessonProgress: (p.lessonProgress ?? []).map((lp: any) => ({
      lesson: id(lp.lesson),
      completed: !!lp.completed,
      stars: lp.stars ?? 0,
      bestScore: lp.bestScore ?? 0,
      completedAt: lp.completedAt ? new Date(lp.completedAt).toISOString() : undefined,
    })),
    achievements: (p.achievements ?? []).map(id),
    currentWorld: p.currentWorld ? id(p.currentWorld) : undefined,
    currentLesson: p.currentLesson ? id(p.currentLesson) : undefined,
    dailyGoal: p.dailyGoal ?? 50,
    weeklyGoal: p.weeklyGoal ?? 300,
    tier: p.tier ?? 'junior',
    notebook: p.notebook ?? [],
    badges: p.badges ?? [],
    mirror: (p.mirror ?? []).map((m: any) => ({ key: m.key, value: m.value })),
    encounters: p.encounters ?? [],
  };
}

export function toUserDTO(u: any): UserDTO {
  return {
    id: id(u),
    name: u.name,
    email: u.email,
    role: u.role,
    avatar: u.avatar,
    createdAt: new Date(u.createdAt ?? Date.now()).toISOString(),
    progress: toProgressDTO(u.progress ?? {}),
  };
}

export function toWorldDTO(w: any, lessonCount = 0): WorldDTO {
  return {
    id: id(w),
    title: w.title,
    subtitle: w.subtitle ?? '',
    order: w.order,
    theme: w.theme,
    background: w.background ?? '',
    music: w.music ?? '',
    requiredXP: w.requiredXP ?? 0,
    decorations: (w.decorations ?? []).map((d: any) => ({
      id: id(d),
      kind: d.kind,
      x: d.x,
      y: d.y,
      scale: d.scale ?? 1,
      flip: !!d.flip,
    })),
    paths: (w.paths ?? []).map((p: any) => ({
      id: id(p),
      from: { x: p.from.x, y: p.from.y },
      to: { x: p.to.x, y: p.to.y },
      control: p.control ? { x: p.control.x, y: p.control.y } : undefined,
    })),
    lessonCount,
  };
}

export function toLessonDTO(l: any): LessonDTO {
  return {
    id: id(l),
    title: l.title,
    description: l.description ?? '',
    world: id(l.world),
    order: l.order,
    x: l.x,
    y: l.y,
    difficulty: l.difficulty,
    type: l.type,
    xp: l.xp,
    coins: l.coins,
    estimatedMinutes: l.estimatedMinutes ?? 5,
    prerequisites: (l.prerequisites ?? []).map(id),
    storyId: l.storyId ?? undefined,
    minigame: l.minigame ?? undefined,
    comingSoon: !!l.comingSoon,
    notebookTerm: l.notebookTerm ?? undefined,
    badge: l.badge ?? undefined,
  };
}

export function toAchievementDTO(a: any): AchievementDTO {
  return {
    id: id(a),
    key: a.key,
    title: a.title,
    description: a.description ?? '',
    icon: a.icon ?? '🏆',
    xpReward: a.xpReward ?? 0,
    coinReward: a.coinReward ?? 0,
  };
}
