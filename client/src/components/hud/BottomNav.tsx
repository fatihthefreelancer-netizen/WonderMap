import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useT } from '../../i18n/useT';
import {
  MapNavIcon,
  NotebookNavIcon,
  TrophyNavIcon,
  ShopNavIcon,
  ProfileNavIcon,
  SettingsNavIcon,
} from './icons';

const ITEMS = [
  { to: '/', Icon: MapNavIcon, key: 'nav.map', tint: '#4bb8f0' },
  { to: '/notebook', Icon: NotebookNavIcon, key: 'nav.notebook', tint: '#f3a04e' },
  { to: '/achievements', Icon: TrophyNavIcon, key: 'nav.awards', tint: '#7c6cf0' },
  { to: '/shop', Icon: ShopNavIcon, key: 'nav.shop', tint: '#2fb4a6' },
  { to: '/profile', Icon: ProfileNavIcon, key: 'nav.profile', tint: '#6f87a6' },
  { to: '/settings', Icon: SettingsNavIcon, key: 'nav.settings', tint: '#8296ad' },
];

/** The floating white dock at the bottom of the map. */
export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useT();

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex justify-center p-3">
      <nav
        className="pointer-events-auto flex items-center gap-0.5 rounded-[26px] bg-white/95 p-1.5 shadow-hud-lg backdrop-blur-sm sm:gap-1"
        aria-label="Primary"
      >
        {ITEMS.map(({ to, Icon, key, tint }) => {
          const active = pathname === to;
          return (
            <motion.button
              key={to}
              onClick={() => navigate(to)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.92 }}
              aria-current={active ? 'page' : undefined}
              className={`relative flex w-[58px] flex-col items-center gap-0.5 rounded-[18px] px-1 py-2 transition-colors sm:w-[70px] ${
                active ? 'bg-gradient-to-b from-[#5cc5f5] to-[#2f9ae0] text-white' : 'text-[#6f87a6]'
              }`}
              style={active ? undefined : { color: tint }}
            >
              <Icon size={23} />
              <span
                className={`text-[10.5px] font-extrabold leading-none ${
                  active ? 'text-white' : 'text-[#5b7290]'
                }`}
              >
                {t(key)}
              </span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}
