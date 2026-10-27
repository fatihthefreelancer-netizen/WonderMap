import { memo } from 'react';

/**
 * The learner's avatar.
 *
 * The fox is Milo's companion and has proper illustrated poses, so it is drawn
 * rather than typed. The other avatars are still emoji, and fall back to that
 * path. Inside a round frame the fox is scaled past the frame and anchored to
 * the top, so you see its head and shoulders rather than a whole tiny animal.
 */

export type FoxPose = 'idle' | 'cheer' | 'think' | 'idea';

export const AVATAR_EMOJI: Record<string, string> = {
  fox: '🦊',
  wizard: '🧙',
  panda: '🐼',
  robot: '🤖',
  cat: '🐱',
  owl: '🦉',
};

export const Avatar = memo(function Avatar({
  avatar = 'fox',
  size = 48,
  pose = 'idle',
  /** show the whole animal instead of cropping to head and shoulders */
  full,
  className,
}: {
  avatar?: string;
  size?: number;
  pose?: FoxPose;
  full?: boolean;
  className?: string;
}) {
  if (avatar !== 'fox') {
    return (
      <span className={`leading-none ${className ?? ''}`} style={{ fontSize: size * 0.72 }}>
        {AVATAR_EMOJI[avatar] ?? AVATAR_EMOJI.fox}
      </span>
    );
  }

  if (full) {
    return (
      <img
        src={`/sprites/fox-${pose}.webp`}
        alt=""
        draggable={false}
        className={`block select-none object-contain ${className ?? ''}`}
        style={{ height: size, width: 'auto' }}
      />
    );
  }

  return (
    <span
      className={`relative block overflow-hidden rounded-full ${className ?? ''}`}
      style={{ width: size, height: size }}
    >
      <img
        src={`/sprites/fox-${pose}.webp`}
        alt=""
        draggable={false}
        className="absolute left-1/2 top-0 max-w-none -translate-x-1/2 select-none"
        style={{ height: size * 1.5 }}
      />
    </span>
  );
});
