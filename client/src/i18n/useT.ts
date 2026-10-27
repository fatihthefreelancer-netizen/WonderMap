import { useLocaleStore } from '../store/localeStore';
import { MESSAGES, type Locale } from './messages';

export type Vars = Record<string, string | number>;

export function translate(locale: Locale, key: string, vars?: Vars): string {
  let s = MESSAGES[locale]?.[key] ?? MESSAGES.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return s;
}

/** Reactive translation hook — components re-render when the locale changes. */
export function useT() {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const t = (key: string, vars?: Vars) => translate(locale, key, vars);
  return { t, locale, setLocale };
}
