import { useCallback, useEffect, useRef } from 'react';

export interface Camera {
  x: number;
  y: number;
  scale: number;
}

interface Options {
  worldWidth: number;
  worldHeight: number;
  minScale?: number;
  maxScale?: number;
  /**
   * Treat the world as a single painted picture: never let it shrink below the
   * viewport or be panned past its own edge, so no bare backdrop is ever shown.
   */
  cover?: boolean;
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/**
 * Imperative camera for the world map. Writes the transform straight to the DOM
 * on every animation frame so panning/zooming never trigger React re-renders.
 */
/** How much slower the distant horizon drifts than the ground. */
const BACKDROP_PARALLAX = 0.42;

export function useMapCamera({ worldWidth, worldHeight, minScale = 0.35, maxScale = 1.8, cover }: Options) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<HTMLDivElement | null>(null);
  /** Optional far layer (sky, mountains, distant forest) that moves slower. */
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const cam = useRef<Camera>({ x: 0, y: 0, scale: 0.7 });

  // pointer tracking
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0, t: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const pinchDist = useRef(0);
  const inertiaRaf = useRef<number>(0);
  const tweenRaf = useRef<number>(0);

  const clamp = useCallback(
    (c: Camera): Camera => {
      const vp = viewportRef.current;
      if (!vp) return c;
      const vw = vp.clientWidth;
      const vh = vp.clientHeight;
      const scaledW = worldWidth * c.scale;
      const scaledH = worldHeight * c.scale;
      if (cover) {
        // the picture must always fill the frame
        const fit = Math.max(vw / worldWidth, vh / worldHeight);
        if (c.scale < fit) c.scale = fit;
        const w = worldWidth * c.scale;
        const h = worldHeight * c.scale;
        c.x = Math.min(0, Math.max(vw - w, c.x));
        c.y = Math.min(0, Math.max(vh - h, c.y));
        return c;
      }
      const margin = 160 * c.scale;
      // Extra headroom above the world so the far horizon — mountains, haze and
      // the distant forest on the parallax layer — can actually be looked at.
      const sky = 620 * c.scale;
      // Keep the world from drifting entirely off-screen.
      const minX = vw - scaledW - margin;
      const maxX = margin;
      const minY = vh - scaledH - margin;
      const maxY = sky;
      c.x = scaledW + margin * 2 < vw ? (vw - scaledW) / 2 : Math.min(maxX, Math.max(minX, c.x));
      c.y = scaledH + margin * 2 < vh ? (vh - scaledH) / 2 : Math.min(maxY, Math.max(minY, c.y));
      return c;
    },
    [worldWidth, worldHeight, cover],
  );

  const apply = useCallback(() => {
    const { x, y, scale } = cam.current;
    const el = worldRef.current;
    if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    const far = backdropRef.current;
    if (far) {
      far.style.transform = `translate3d(${x * BACKDROP_PARALLAX}px, ${y * BACKDROP_PARALLAX}px, 0) scale(${scale})`;
    }
  }, []);

  const setCamera = useCallback(
    (next: Partial<Camera>) => {
      cam.current = clamp({ ...cam.current, ...next });
      apply();
    },
    [apply, clamp],
  );

  /** Smoothly move the camera so a world point sits at the viewport center. */
  const centerOn = useCallback(
    (wx: number, wy: number, targetScale?: number, animate = true) => {
      const vp = viewportRef.current;
      if (!vp) return;
      cancelAnimationFrame(tweenRaf.current);
      cancelAnimationFrame(inertiaRaf.current);
      const scale = Math.min(maxScale, Math.max(minScale, targetScale ?? cam.current.scale));
      const targetX = vp.clientWidth / 2 - wx * scale;
      const targetY = vp.clientHeight / 2 - wy * scale;
      const target = clamp({ x: targetX, y: targetY, scale });

      if (!animate) {
        cam.current = target;
        apply();
        return;
      }
      const start = { ...cam.current };
      const t0 = performance.now();
      const dur = 620;
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        const e = easeInOut(p);
        cam.current = {
          x: start.x + (target.x - start.x) * e,
          y: start.y + (target.y - start.y) * e,
          scale: start.scale + (target.scale - start.scale) * e,
        };
        apply();
        if (p < 1) tweenRaf.current = requestAnimationFrame(step);
      };
      tweenRaf.current = requestAnimationFrame(step);
    },
    [apply, clamp, maxScale, minScale],
  );

  const zoomAt = useCallback(
    (sx: number, sy: number, factor: number) => {
      const c = cam.current;
      const newScale = Math.min(maxScale, Math.max(minScale, c.scale * factor));
      const wx = (sx - c.x) / c.scale;
      const wy = (sy - c.y) / c.scale;
      cam.current = clamp({ scale: newScale, x: sx - wx * newScale, y: sy - wy * newScale });
      apply();
    },
    [apply, clamp, maxScale, minScale],
  );

  const runInertia = useCallback(() => {
    const decay = 0.92;
    const step = () => {
      const v = velocity.current;
      if (Math.abs(v.x) < 0.05 && Math.abs(v.y) < 0.05) return;
      cam.current = clamp({ ...cam.current, x: cam.current.x + v.x, y: cam.current.y + v.y });
      apply();
      v.x *= decay;
      v.y *= decay;
      inertiaRaf.current = requestAnimationFrame(step);
    };
    inertiaRaf.current = requestAnimationFrame(step);
  }, [apply, clamp]);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const onPointerDown = (e: PointerEvent) => {
      cancelAnimationFrame(inertiaRaf.current);
      cancelAnimationFrame(tweenRaf.current);
      // No setPointerCapture: capturing here would swallow the pointerup on
      // lesson-node buttons and suppress their click. Drag engages past a
      // small movement threshold so a plain tap still clicks the node.
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      dragging.current = false;
      last.current = { x: e.clientX, y: e.clientY, t: performance.now() };
      velocity.current = { x: 0, y: 0 };
      if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()];
        pinchDist.current = Math.hypot(a.x - b.x, a.y - b.y);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pointers.current.has(e.pointerId)) return;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;
        const rect = vp.getBoundingClientRect();
        if (pinchDist.current > 0) {
          zoomAt(midX - rect.left, midY - rect.top, dist / pinchDist.current);
        }
        pinchDist.current = dist;
        return;
      }

      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      if (!dragging.current) {
        if (Math.hypot(dx, dy) < 6) return; // below threshold: keep it a tap
        dragging.current = true;
      }
      const now = performance.now();
      const dt = Math.max(1, now - last.current.t);
      velocity.current = { x: (dx / dt) * 16, y: (dy / dt) * 16 };
      cam.current = clamp({ ...cam.current, x: cam.current.x + dx, y: cam.current.y + dy });
      apply();
      last.current = { x: e.clientX, y: e.clientY, t: now };
    };

    const onPointerUp = (e: PointerEvent) => {
      pointers.current.delete(e.pointerId);
      if (pointers.current.size < 2) pinchDist.current = 0;
      if (pointers.current.size === 0) {
        if (dragging.current) runInertia();
        dragging.current = false;
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = vp.getBoundingClientRect();
      const factor = e.deltaY < 0 ? 1.12 : 0.89;
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, factor);
    };

    vp.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    vp.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      vp.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      vp.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(inertiaRaf.current);
      cancelAnimationFrame(tweenRaf.current);
    };
  }, [apply, clamp, runInertia, zoomAt]);

  return { viewportRef, worldRef, backdropRef, centerOn, setCamera, zoomAt, getCamera: () => cam.current };
}
