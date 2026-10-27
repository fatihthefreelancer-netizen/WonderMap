import { api } from './api';
import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
  UserDTO,
  WorldDTO,
  LessonDTO,
  UserProgress,
  CompleteLessonInput,
  CompleteLessonResult,
  AchievementDTO,
} from '@wondermap/shared';

type AchievementWithState = AchievementDTO & { unlocked: boolean };

export const authService = {
  register: (input: RegisterInput) =>
    api.post<AuthResponse>('/auth/register', input).then((r) => r.data),
  login: (input: LoginInput) =>
    api.post<AuthResponse>('/auth/login', input).then((r) => r.data),
  refresh: () => api.post<AuthResponse>('/auth/refresh', {}).then((r) => r.data),
  logout: () => api.post('/auth/logout', {}).then((r) => r.data),
};

export const userService = {
  me: () => api.get<UserDTO>('/me').then((r) => r.data),
  updateProfile: (input: { name?: string; avatar?: string }) =>
    api.patch<UserDTO>('/profile', input).then((r) => r.data),
  progress: () => api.get<UserProgress>('/progress').then((r) => r.data),
  setTier: (tier: 'junior' | 'pro') =>
    api.patch<UserProgress>('/progress', { tier }).then((r) => r.data),
  completeEncounter: (encounterId: string, xp: number) =>
    api.post<UserProgress>('/encounter/complete', { encounterId, xp }).then((r) => r.data),
};

export const worldService = {
  list: () => api.get<WorldDTO[]>('/worlds').then((r) => r.data),
  get: (id: string) =>
    api.get<{ world: WorldDTO; lessons: LessonDTO[] }>(`/world/${id}`).then((r) => r.data),
  lesson: (id: string) => api.get<LessonDTO>(`/lesson/${id}`).then((r) => r.data),
  complete: (input: CompleteLessonInput) =>
    api.post<CompleteLessonResult>('/lesson/complete', input).then((r) => r.data),
};

export const metaService = {
  achievements: () =>
    api.get<AchievementWithState[]>('/achievements').then((r) => r.data),
  rewards: () => api.get('/rewards').then((r) => r.data),
  claim: (rewardId: string) => api.post('/claim', { rewardId }).then((r) => r.data),
};

export const adminService = {
  analytics: () => api.get('/admin/analytics').then((r) => r.data),
  users: () => api.get<UserDTO[]>('/admin/users').then((r) => r.data),
  resetUser: (id: string) => api.post(`/admin/users/${id}/reset`).then((r) => r.data),
  createWorld: (body: Partial<WorldDTO>) =>
    api.post<WorldDTO>('/admin/worlds', body).then((r) => r.data),
  updateWorld: (id: string, body: Partial<WorldDTO>) =>
    api.patch<WorldDTO>(`/admin/worlds/${id}`, body).then((r) => r.data),
  deleteWorld: (id: string) => api.delete(`/admin/worlds/${id}`).then((r) => r.data),
  saveScene: (id: string, scene: { decorations: unknown[]; paths: unknown[] }) =>
    api.put<WorldDTO>(`/admin/worlds/${id}/scene`, scene).then((r) => r.data),
  createLesson: (body: Partial<LessonDTO>) =>
    api.post<LessonDTO>('/admin/lessons', body).then((r) => r.data),
  updateLesson: (id: string, body: Partial<LessonDTO>) =>
    api.patch<LessonDTO>(`/admin/lessons/${id}`, body).then((r) => r.data),
  deleteLesson: (id: string) => api.delete(`/admin/lessons/${id}`).then((r) => r.data),
  moveLessons: (moves: Array<{ id: string; x: number; y: number }>) =>
    api.post('/admin/lessons/move', { moves }).then((r) => r.data),
};
