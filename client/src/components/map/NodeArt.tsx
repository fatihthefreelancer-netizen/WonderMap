import { memo } from 'react';
import type { LessonType } from '@wondermap/shared';
import { Cottage, TownHouse, Hall, MarketStall, Well } from './art/houses';
import { Crates } from './art/flora';

/**
 * What you see inside a lesson stop.
 *
 * Rather than a flat icon, each stop is a little window onto a real place in
 * the world — and it is drawn with the *same* building art the village is built
 * from, at a smaller scale, over its own sky and patch of grass. That is what
 * makes a checkpoint read as part of the landscape instead of a UI chip.
 */

interface Place {
  Art: React.ComponentType<{ seed?: number }>;
  /** how much of the disc the building should occupy */
  fit: number;
  seed: number;
}

/**
 * Ordinary stops walk through the village's buildings in order, so no two
 * neighbours on the trail show the same place.
 */
const PLACE_CYCLE: Place[] = [
  { Art: MarketStall, fit: 0.0052, seed: 3 },
  { Art: Cottage, fit: 0.0042, seed: 11 },
  { Art: Well, fit: 0.0056, seed: 2 },
  { Art: TownHouse, fit: 0.0038, seed: 5 },
];

function placeFor(type: LessonType, order: number): Place {
  switch (type) {
    case 'boss':
      return { Art: Hall, fit: 0.0031, seed: 7 };
    case 'treasure':
      return { Art: Crates, fit: 0.0062, seed: 9 };
    default:
      return PLACE_CYCLE[order % PLACE_CYCLE.length];
  }
}

/** How many illustrated stop pictures exist for the opening chapter. */
const ILLUSTRATED_STOPS = 5;

export const NodeArt = memo(function NodeArt({
  type,
  order,
  size,
  muted,
  worldOrder = -1,
}: {
  type: LessonType;
  order: number;
  /** inner disc diameter in px */
  size: number;
  muted?: boolean;
  /** which world this stop belongs to, so chapter 1 can use its own pictures */
  worldOrder?: number;
}) {
  const { Art, fit, seed } = placeFor(type, order);
  const k = size * fit;

  // Chapter 1's five stops were illustrated one by one, each showing the moment
  // that lesson is about. Other worlds fall back to the drawn village places.
  if (worldOrder === 0 && order < ILLUSTRATED_STOPS) {
    return (
      <img
        src={`/chapter/stop-${order + 1}.webp`}
        alt=""
        draggable={false}
        className="h-full w-full select-none rounded-full object-cover"
        style={muted ? { filter: 'saturate(0.45) brightness(1.02)' } : undefined}
      />
    );
  }

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-full"
      style={muted ? { filter: 'saturate(0.55) brightness(0.99)' } : undefined}
    >
      {/* the little sky behind the place */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle at 36% 24%, #ffffff 0%, #dff2ff 42%, #b7e3f7 100%)' }}
      />
      {/* distant hill */}
      <div
        className="absolute inset-x-[-18%] bottom-[34%] h-[34%] rounded-[50%]"
        style={{ background: 'linear-gradient(180deg, #bfe39a, #9ed47a)', opacity: 0.85 }}
      />
      {/* the ground it stands on */}
      <div
        className="absolute inset-x-[-14%] bottom-0 h-[42%]"
        style={{
          background: 'linear-gradient(180deg, #a2dc6a 0%, #76bf45 55%, #559c37 100%)',
          borderRadius: '50% 50% 0 0 / 34% 34% 0 0',
        }}
      />
      <div
        className="absolute inset-x-[-14%] bottom-0 h-[42%] opacity-40"
        style={{
          background: 'radial-gradient(ellipse at 30% 10%, rgba(255,255,255,0.8), rgba(255,255,255,0) 60%)',
          borderRadius: '50% 50% 0 0 / 34% 34% 0 0',
        }}
      />
      <div
        className="absolute left-1/2"
        style={{
          bottom: '26%',
          transform: `translateX(-50%) scale(${k})`,
          transformOrigin: 'bottom center',
        }}
      >
        <Art seed={seed + order} />
      </div>
    </div>
  );
});
