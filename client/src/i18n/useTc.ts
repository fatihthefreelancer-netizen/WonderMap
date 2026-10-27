import { useLocaleStore } from '../store/localeStore';
import { tc as translateContent } from './contentDict';

/** Reactive content translator — translates authored English content strings. */
export function useTc() {
  const locale = useLocaleStore((s) => s.locale);
  const tc = (en: string) => translateContent(locale, en);
  return { tc, locale };
}
