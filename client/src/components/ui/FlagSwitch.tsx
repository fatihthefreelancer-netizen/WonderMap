import { LOCALES } from '../../i18n/messages';
import { useT } from '../../i18n/useT';

/** Compact flag-only language switch (for the auth screens / tight spots). */
export function FlagSwitch({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useT();
  return (
    <div className={`flex items-center gap-1 rounded-full bg-white/70 p-1 shadow-soft ${className}`}>
      {LOCALES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          aria-label={l.label}
          aria-pressed={locale === l.code}
          className={`grid h-8 w-8 place-items-center rounded-full text-lg transition ${
            locale === l.code ? 'bg-sky-bright shadow' : 'opacity-60 hover:opacity-100'
          }`}
        >
          {l.flag}
        </button>
      ))}
    </div>
  );
}
