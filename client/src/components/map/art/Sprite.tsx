import { memo, type CSSProperties } from 'react';
import { spriteMeta, spriteUrl, type SpriteName } from './sprites';

/** A single illustrated sprite, drawn at a multiple of its exported size. */
export const Sprite = memo(function Sprite({
  name,
  scale = 1,
  flip,
  className,
  style,
}: {
  name: SpriteName;
  scale?: number;
  flip?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const { w, h } = spriteMeta(name);
  return (
    <img
      src={spriteUrl(name)}
      width={Math.round(w * scale)}
      height={Math.round(h * scale)}
      alt=""
      draggable={false}
      className={`pointer-events-none block select-none ${className ?? ''}`}
      style={flip ? { ...style, transform: `scaleX(-1) ${style?.transform ?? ''}` } : style}
    />
  );
});

/**
 * A frame-by-frame sprite strip. The whole strip is the element's background and
 * a `steps()` animation walks it one cell at a time, so the browser animates it
 * on the compositor with no per-frame work.
 */
export const SpriteAnim = memo(function SpriteAnim({
  name,
  scale = 1,
  duration = 1,
  delay = 0,
  flip,
  className,
  style,
}: {
  name: SpriteName;
  scale?: number;
  /** seconds for one full cycle */
  duration?: number;
  delay?: number;
  flip?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const meta = spriteMeta(name);
  const frames = meta.frames ?? 1;
  const w = meta.w * scale;
  const h = meta.h * scale;

  return (
    <div
      className={`wm-frames pointer-events-none select-none ${className ?? ''}`}
      style={
        {
          width: w,
          height: h,
          backgroundImage: `url(${spriteUrl(name)})`,
          backgroundSize: `${w * frames}px ${h}px`,
          animationDuration: `${duration}s`,
          animationDelay: `-${delay}s`,
          '--wm-frames': frames,
          '--wm-cell': `${w}px`,
          ...(flip ? { transform: `scaleX(-1) ${style?.transform ?? ''}` } : null),
          ...style,
        } as CSSProperties
      }
    />
  );
});
