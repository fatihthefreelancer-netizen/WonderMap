import { HeartIcon } from './icons';

/** Life capsule: filled hearts for lives left, hollow ones for lives spent. */
export function Hearts({ lives, max = 5 }: { lives: number; max?: number }) {
  return (
    <div
      className="flex items-center gap-0.5 rounded-full bg-white/95 px-3 py-2 shadow-hud backdrop-blur-sm"
      aria-label={`${lives} of ${max} lives`}
    >
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`inline-block leading-none ${i < lives ? 'animate-beat' : ''}`}
          style={i < lives ? { animationDelay: `${i * 0.15}s` } : undefined}
        >
          <HeartIcon full={i < lives} size={17} />
        </span>
      ))}
    </div>
  );
}
