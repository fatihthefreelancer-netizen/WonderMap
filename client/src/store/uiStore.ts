import { create } from 'zustand';
import type { LessonDTO, CompleteLessonResult } from '@wondermap/shared';
import { setSfxEnabled } from '../lib/sfx';

const SOUND_KEY = 'wm_sound';

function initialSound(): boolean {
  if (typeof localStorage === 'undefined') return true;
  return localStorage.getItem(SOUND_KEY) !== 'off';
}

interface UIState {
  activeWorldId: string | null;
  selectedLesson: LessonDTO | null;
  celebration: CompleteLessonResult | null;
  reducedMotion: boolean;
  /** sound effects — separate from reduced motion, which is about movement */
  sound: boolean;
  setActiveWorld: (id: string | null) => void;
  openLesson: (lesson: LessonDTO) => void;
  closeLesson: () => void;
  celebrate: (result: CompleteLessonResult) => void;
  clearCelebration: () => void;
  setSound: (on: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeWorldId: null,
  selectedLesson: null,
  celebration: null,
  reducedMotion:
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  sound: initialSound(),

  setActiveWorld: (id) => set({ activeWorldId: id }),
  openLesson: (lesson) => set({ selectedLesson: lesson }),
  closeLesson: () => set({ selectedLesson: null }),
  celebrate: (result) => set({ celebration: result }),
  clearCelebration: () => set({ celebration: null }),
  setSound: (on) => {
    if (typeof localStorage !== 'undefined') localStorage.setItem(SOUND_KEY, on ? 'on' : 'off');
    setSfxEnabled(on);
    set({ sound: on });
  },
}));

// Mirror the stored preference into the audio engine before anything plays.
setSfxEnabled(useUIStore.getState().sound);
