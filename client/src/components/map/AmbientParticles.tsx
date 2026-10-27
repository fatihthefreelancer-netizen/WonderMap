import { memo, useMemo } from 'react';

/**
 * Floating dust/sparkle particles for ambient life. Implemented with pure CSS
 * keyframe animations (compositor-driven) rather than per-frame JS so the main
 * thread stays free and the map holds 60fps even with the full scene rendered.
 */
export const AmbientParticles = memo(function AmbientParticles({ color }: { color: string }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 4 + Math.random() * 8,
        delay: Math.random() * 6,
        dur: 7 + Math.random() * 7,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: color,
            opacity: 0.5,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}
    </div>
  );
});
