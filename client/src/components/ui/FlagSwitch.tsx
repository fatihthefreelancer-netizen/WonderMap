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
          title={l.label}
          className={`grid h-8 w-11 place-items-center overflow-hidden rounded-[7px] transition ${
            locale === l.code
              ? 'ring-[3px] ring-sky-deep'
              : 'opacity-55 hover:opacity-100'
          }`}
        >
          <img
            src={l.flagSrc}
            alt=""
            draggable={false}
            className="h-full w-full select-none rounded-[4px] object-cover"
          />
        </button>
      ))}
    </div>
  );
}
