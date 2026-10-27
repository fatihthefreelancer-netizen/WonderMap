import { create } from 'zustand';
import type { UserDTO, UserProgress } from '@wondermap/shared';
import { authService, userService } from '../lib/services';
import { setAccessToken } from '../lib/api';

interface AuthState {
  user: UserDTO | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  error: string | null;
  bootstrap: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: UserDTO) => void;
  applyProgress: (progress: UserProgress) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: 'idle',
  error: null,

  async bootstrap() {
    set({ status: 'loading' });
    try {
      const { user, accessToken } = await authService.refresh();
      setAccessToken(accessToken);
      set({ user, status: 'authenticated', error: null });
    } catch {
      setAccessToken(null);
      set({ user: null, status: 'unauthenticated' });
    }
  },

  async login(email, password) {
    set({ error: null });
    const { user, accessToken } = await authService.login({ email, password });
    setAccessToken(accessToken);
    set({ user, status: 'authenticated' });
  },

  async register(name, email, password) {
    set({ error: null });
    const { user, accessToken } = await authService.register({ name, email, password });
    setAccessToken(accessToken);
    set({ user, status: 'authenticated' });
  },

  async logout() {
    await authService.logout().catch(() => undefined);
    setAccessToken(null);
    set({ user: null, status: 'unauthenticated' });
  },

  setUser(user) {
    set({ user });
  },

  applyProgress(progress) {
    const user = get().user;
    if (!user) return;
    set({ user: { ...user, progress } });
  },
}));

/** Refresh the current user from the server (after profile edits, etc.). */
export async function refreshMe() {
  const user = await userService.me();
  useAuthStore.getState().setUser(user);
  return user;
}
