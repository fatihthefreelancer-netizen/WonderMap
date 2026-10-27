import { memo, useMemo } from 'react';
import type { LessonDTO, UserProgress, NodeState } from '@wondermap/shared';
import { pathState } from '../../lib/nodeState';
import { MAP_W, MAP_H } from './mapScene';

/**
 * The walking trail: a line of soft white stepping stones laid across the
 * painted meadow between one stop and the next, fading on the stretches the
 * learner has not reached yet.
 */

const LOOK: Record<NodeState | string, { r: number; gap: number; opacity: number }> = {
  completed: { r: 9, gap: 34, opacity: 1 },
  perfect: { r: 9, gap: 34, opacity: 1 },
  unlocked: { r: 8.5, gap: 34, opacity: 0.98 },
  locked: { r: 6.5, gap: 38, opacity: 0.5 },
};

export interface Stop {
  lesson: LessonDTO;
  x: number;
  y: number;
}

interface Props {
  stops: Stop[];
  progress: UserProgress;
}

export const PathLayer = memo(function PathLayer({ stops, progress }: Props) {
  const dots = useMemo(() => {
    const out: { x: number; y: number; r: number; o: number; key: string }[] = [];
    for (let i = 0; i < stops.length - 1; i++) {
      const a = stops[i];
      const b = stops[i + 1];
      const look = LOOK[pathState(a.lesson, b.lesson, progress)] ?? LOOK.locked;
      // bow the run slightly uphill so it reads as a path, not a ruled line
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2 - Math.hypot(b.x - a.x, b.y - a.y) * 0.08;
      const len = Math.hypot(b.x - a.x, b.y - a.y);
      const steps = Math.max(3, Math.round(len / look.gap));
      // skip the ends so stones do not slide under the stop medallions
      for (let s = 1; s < steps; s++) {
        const t = s / steps;
        const u = 1 - t;
        const x = u * u * a.x + 2 * u * t * mx + t * t * b.x;
        const y = u * u * a.y + 2 * u * t * my + t * t * b.y;
        const edge = Math.min(t, 1 - t);
        out.push({
          x,
          y,
          r: look.r * (0.72 + Math.min(1, edge * 5) * 0.28),
          o: look.opacity,
          key: `${a.lesson.id}-${s}`,
        });
      }
    }
    return out;
  }, [stops, progress]);

  return (
    <svg
      className="pointer-events-none absolute inset-0"
      width={MAP_W}
      height={MAP_H}
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      aria-hidden
    >
      {dots.map((d) => (
        <g key={d.key} opacity={d.o}>
          <ellipse cx={d.x} cy={d.y + d.r * 0.5} rx={d.r} ry={d.r * 0.5} fill="#2c5a2f" opacity="0.22" />
          <circle cx={d.x} cy={d.y} r={d.r} fill="#ffffff" />
          <circle cx={d.x - d.r * 0.22} cy={d.y - d.r * 0.24} r={d.r * 0.56} fill="#ffffff" />
          <circle cx={d.x + d.r * 0.26} cy={d.y + d.r * 0.3} r={d.r * 0.38} fill="#dfe8ef" opacity="0.8" />
        </g>
      ))}
    </svg>
  );
});
