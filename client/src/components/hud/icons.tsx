/**
 * Flat vector HUD icons. Emoji render inconsistently across platforms and sit
 * badly inside the small pills of the new HUD, so the chrome uses these instead.
 */

interface IconProps {
  size?: number;
  className?: string;
}

export function StarIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 2.6l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.6 6.1 20.8l1.3-6.6L2.5 9.6l6.6-.8z"
        fill="#ffc233"
        stroke="#f0a500"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CoinIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9.2" fill="#f0a500" />
      <circle cx="12" cy="12" r="7.4" fill="#ffd34e" />
      <path d="M12 7.4v9.2M9.6 9.6h3.6a1.9 1.9 0 0 1 0 3.8H9.6h3.9a1.9 1.9 0 0 1 0 3.8H9.6" fill="none" stroke="#c98500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FlameIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M13 2.5c.6 3.2-1.4 4.3-2.8 5.9C8.5 10.3 7 11.9 7 14.6A5.6 5.6 0 0 0 12.6 21 5.9 5.9 0 0 0 18 15c0-4-2.3-5.6-3.3-8.1-.4-1-.9-2.6-1.7-4.4z"
        fill="#ff8a3d"
      />
      <path d="M12.3 12c.4 1.8-1.7 2.2-1.7 4a2.2 2.2 0 0 0 2.3 2.2 2.3 2.3 0 0 0 2.2-2.4c0-1.9-1.7-2.5-2.8-3.8z" fill="#ffd34e" />
    </svg>
  );
}

export function HeartIcon({ size = 16, full = true, className }: IconProps & { full?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 20.6l-1.5-1.3C5.4 14.7 2.5 12.1 2.5 8.8A5.1 5.1 0 0 1 7.6 3.7 5.6 5.6 0 0 1 12 5.8a5.6 5.6 0 0 1 4.4-2.1 5.1 5.1 0 0 1 5.1 5.1c0 3.3-2.9 5.9-8 10.5z"
        fill={full ? '#ff5a7a' : '#dfe5ee'}
      />
      {full && (
        <path d="M8.2 7.2a2.6 2.6 0 0 1 2.1-1.1" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.8" />
      )}
    </svg>
  );
}

export function PinIcon({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 2a7 7 0 0 0-7 7c0 5.1 7 13 7 13s7-7.9 7-13a7 7 0 0 0-7-7z" fill="#f3594e" />
      <circle cx="12" cy="9" r="2.7" fill="#ffffff" />
    </svg>
  );
}

export function BulbIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 2.5a6.5 6.5 0 0 0-3.8 11.8c.6.4.9 1 .9 1.7v.5h5.8V16c0-.7.3-1.3.9-1.7A6.5 6.5 0 0 0 12 2.5z" fill="#ffd34e" />
      <rect x="9.1" y="17.4" width="5.8" height="2" rx="1" fill="#c99a1e" />
      <rect x="10" y="20" width="4" height="1.8" rx="0.9" fill="#c99a1e" />
    </svg>
  );
}

export function TargetIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="8.4" fill="none" stroke="#2b4a66" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.4" fill="#f3594e" />
      <path d="M12 1.6v3.4M12 19v3.4M1.6 12h3.4M19 12h3.4" stroke="#2b4a66" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------ navigation ------------------------------ */

export function MapNavIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M2.8 5.6 9 3.4v15L2.8 20.6z" fill="currentColor" opacity="0.55" />
      <path d="M9 3.4 15 5.6v15L9 18.4z" fill="currentColor" />
      <path d="M15 5.6 21.2 3.4v15L15 20.6z" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

export function NotebookNavIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="5" y="3" width="14.5" height="18" rx="2.6" fill="currentColor" />
      <rect x="2.8" y="5.4" width="3.6" height="2" rx="1" fill="currentColor" opacity="0.55" />
      <rect x="2.8" y="11" width="3.6" height="2" rx="1" fill="currentColor" opacity="0.55" />
      <rect x="2.8" y="16.6" width="3.6" height="2" rx="1" fill="currentColor" opacity="0.55" />
      <path d="M9 8h7M9 12h7M9 16h4.5" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

export function TrophyNavIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M7 3h10v6a5 5 0 0 1-10 0z" fill="currentColor" />
      <path d="M7 4.5H4.4a3.4 3.4 0 0 0 3.2 5M17 4.5h2.6a3.4 3.4 0 0 1-3.2 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="10.6" y="13.4" width="2.8" height="4" fill="currentColor" />
      <rect x="7.4" y="17" width="9.2" height="3.4" rx="1.4" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export function ShopNavIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M4.4 8h15.2l-1.2 11.2a2 2 0 0 1-2 1.8H7.6a2 2 0 0 1-2-1.8z" fill="currentColor" />
      <path d="M8.6 9.4V6.8a3.4 3.4 0 0 1 6.8 0v2.6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <rect x="4.4" y="7.2" width="15.2" height="3" rx="1.4" fill="currentColor" opacity="0.65" />
    </svg>
  );
}

export function ProfileNavIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="8" r="4.2" fill="currentColor" />
      <path d="M3.8 20.4a8.2 8.2 0 0 1 16.4 0z" fill="currentColor" opacity="0.75" />
    </svg>
  );
}

export function SettingsNavIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 2.4l2 1.2 2.3-.4 1 2.1 2 1.2-.4 2.3.9 2.2-1.6 1.7-.3 2.3-2.3.5-1.6 1.7-2.2-.8-2.2.8-1.6-1.7-2.3-.5-.3-2.3L2.2 11l.9-2.2-.4-2.3 2-1.2 1-2.1 2.3.4z"
        fill="currentColor"
      />
      <circle cx="12" cy="11.6" r="3.4" fill="#ffffff" />
    </svg>
  );
}
