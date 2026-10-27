import { create } from 'zustand';
import { LOCALES, MESSAGES, type Locale } from '../i18n/messages';

const KEY = 'wm_locale';

function initialLocale(): Locale {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(KEY) as Locale | null;
    if (saved && MESSAGES[saved]) return saved;
  }
  return 'en';
}

function applyDocument(locale: Locale) {
  if (typeof document === 'undefined') return;
  const meta = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];
  document.documentElement.lang = locale;
  document.documentElement.dir = meta.dir;
}

interface LocaleState {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: initialLocale(),
  setLocale: (locale) => {
    if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, locale);
    applyDocument(locale);
    set({ locale });
  },
}));

// Apply direction/lang on first load.
applyDocument(useLocaleStore.getState().locale);
