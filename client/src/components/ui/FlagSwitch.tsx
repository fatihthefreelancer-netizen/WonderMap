import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LOCALES, type Locale } from '../../i18n/messages';
import { useT } from '../../i18n/useT';

/**
 * The language switch: one pill, opened to choose.
 *
 * It used to be all three flags in a row. That is fine on a desktop and
 * impossible on a phone — three flags are about 150px, and next to the purse,
 * the notebook and the way out of the chapter there was no room, so the close
 * button ended up off the right-hand edge. One pill showing the current
 * language costs a third of that and says which language you are in, which the
 * row of three never quite did.
 */

const CODE: Record<Locale, string> = { en: 'EN', fr: 'FR', ar: 'AR' };

export function FlagSwitch({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useT();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement | null>(null);
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  // close on a click anywhere else, and on Escape
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', away);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('pointerdown', away);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  return (
    <div ref={box} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={current.label}
        className={`flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-2.5 transition ${className}`}
      >
        <img
          src={current.flagSrc}
          alt=""
          draggable={false}
          className="h-7 w-10 select-none rounded-[5px] object-cover ring-1 ring-black/10"
        />
        <span className="font-display text-sm font-extrabold text-[#2b4a66]">
          {CODE[current.code]}
        </span>
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18 }}
          className="font-display text-[11px] leading-none text-[#8296ad]"
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            /*
              `end-0` rather than `left-0`: in Arabic the whole chrome flips, and
              a menu pinned to the left would hang off the side it opened from.
            */
            className="absolute end-0 top-full z-50 mt-1.5 w-max overflow-hidden rounded-2xl bg-white p-1 shadow-hud-lg"
          >
            {LOCALES.map((l) => (
              <li key={l.code}>
                <button
                  role="option"
                  aria-selected={l.code === locale}
                  onClick={() => {
                    setLocale(l.code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-start transition ${
                    l.code === locale ? 'bg-[#eaf4fd]' : 'hover:bg-[#f1f6fb]'
                  }`}
                >
                  <img
                    src={l.flagSrc}
                    alt=""
                    draggable={false}
                    className="h-6 w-9 shrink-0 select-none rounded-[4px] object-cover ring-1 ring-black/10"
                  />
                  <span className="font-display text-[13px] font-extrabold text-[#2b4a66]">
                    {l.label}
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
