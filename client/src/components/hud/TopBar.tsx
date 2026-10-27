import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { levelFromXp, type UserDTO } from '@wondermap/shared';
import { StatPill } from './StatPill';
import { Hearts } from './Hearts';
import { StarIcon, CoinIcon, FlameIcon, PinIcon } from './icons';
import { Avatar } from '../ui/Avatar';

interface Props {
  user: UserDTO;
  onMenu: () => void;
  /** Current world, shown in the location card beside the menu button. */
  place?: { title: string; subtitle?: string; locked?: boolean };
  /** Stars collected in this world out of the total on offer. */
  stars?: { earned: number; total: number };
}

/**
 * Map chrome: the menu button and a "you are here" card on the left, the
 * progress capsules and the profile button on the right.
 */
export function TopBar({ user, onMenu, place, stars }: Props) {
  const navigate = useNavigate();

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-start justify-between gap-3 p-3 sm:p-4">
      {/* ------------------------------ left ------------------------------ */}
      <div className="pointer-events-auto flex items-center gap-2.5">
        <motion.button
          onClick={onMenu}
          aria-label="Open menu"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/95 shadow-hud backdrop-blur-sm"
        >
          <div className="space-y-[5px]">
            <span className="block h-[3px] w-5 rounded-full bg-[#2b4a66]" />
            <span className="block h-[3px] w-5 rounded-full bg-[#2b4a66]" />
            <span className="block h-[3px] w-5 rounded-full bg-[#2b4a66]" />
          </div>
        </motion.button>

        {place && (
          <motion.div
            key={place.title}
            initial={{ x: -16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="flex items-center"
          >
            <div className="z-10 -mr-6 grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full bg-white shadow-hud">
              <Avatar avatar={user.avatar} size={52} />
            </div>
            <div className="max-w-[min(58vw,280px)] rounded-[20px] bg-white/95 py-1.5 pl-8 pr-4 shadow-hud backdrop-blur-sm">
              <p className="flex items-center gap-1 font-display text-[15px] font-extrabold leading-tight text-[#2b4a66]">
                <PinIcon />
                <span className="truncate">
                  {place.locked ? '🔒 ' : ''}
                  {place.title}
                </span>
              </p>
              {place.subtitle && (
                <p className="line-clamp-2 text-[11px] font-semibold leading-snug text-[#8296ad]">
                  {place.subtitle}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* ------------------------------ right ----------------------------- */}
      <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-2">
        {stars && (
          <StatPill
            icon={<StarIcon />}
            value={`${stars.earned}/${stars.total}`}
            label="Stars collected in this world"
          />
        )}
        <StatPill icon={<CoinIcon />} value={user.progress.coins} label="Coins" />
        <StatPill
          icon={<FlameIcon />}
          value={user.progress.streak}
          pulse={user.progress.streak > 0}
          label="Day streak"
        />
        <Hearts lives={user.progress.lives} />

        <motion.button
          onClick={() => navigate('/profile')}
          aria-label="Profile"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="relative grid h-12 w-12 place-items-center rounded-full bg-white shadow-hud"
        >
          <Avatar avatar={user.avatar} size={44} />
          {/* level keeps its place in the HUD as a small chip on the avatar */}
          <span className="absolute -bottom-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full border-2 border-white bg-xp px-1 font-display text-[10px] font-extrabold leading-none text-white">
            {levelFromXp(user.progress.xp)}
          </span>
        </motion.button>
      </div>
    </div>
  );
}

export { AVATAR_EMOJI } from '../ui/Avatar';
