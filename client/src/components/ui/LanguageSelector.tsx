import { motion } from 'framer-motion';
import { LOCALES } from '../../i18n/messages';
import { useT } from '../../i18n/useT';

/** Flag-based language picker (English default, French, Arabic). */
export function LanguageSelector() {
  const { t, locale, setLocale } = useT();
  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft">
      <p className="font-display font-extrabold text-[#1f3a5f]">🌍 {t('settings.language')}</p>
      <p className="mb-3 text-xs font-semibold text-slate-500">{t('settings.languageHint')}</p>
      <div className="grid grid-cols-3 gap-3">
        {LOCALES.map((l) => (
          <motion.button
            key={l.code}
            onClick={() => setLocale(l.code)}
            whileTap={{ scale: 0.95 }}
            aria-pressed={locale === l.code}
            className={`flex flex-col items-center rounded-2xl border-b-4 p-3 transition ${
              locale === l.code
                ? 'border-sky-deep bg-sky-bright text-white'
                : 'border-slate-200 bg-slate-50 text-[#1f3a5f]'
            }`}
          >
            <span className="text-3xl">{l.flag}</span>
            <span className="mt-1 font-display text-sm font-extrabold">{l.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
