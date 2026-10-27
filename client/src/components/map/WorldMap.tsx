import { useEffect, useMemo, useRef } from 'react';
import type { WorldDTO, LessonDTO, UserProgress } from '@wondermap/shared';
import { useMapCamera } from '../../hooks/useMapCamera';
import { nodeInfoFor } from '../../lib/nodeState';
import { hashSeed } from '../../lib/shapes';
import { Sprite } from './art/Sprite';
import { CLOUD_SPRITES } from './art/sprites';
import { Tree, Pine, Bush, Flower, Rock, Bird, Boat, Smoke, Bunting } from './art/flora';
import { PathLayer } from './PathLayer';
import { LessonNode } from './LessonNode';
import { Player } from './Player';
import { AmbientParticles } from './AmbientParticles';
import { SignBoard } from './SignBoard';
import {
  MAP_W,
  MAP_H,
  PLANTING,
  CLOUDS,
  BIRDS,
  CHIMNEYS,
  BOATS,
  BUNTINGS,
  depthScale,
  stopPosition,
  SIGN_WORLD,
  SIGN_NEXT,
  backgroundFor,
} from './mapScene';
import { useTc } from '../../i18n/useTc';
import { useT } from '../../i18n/useT';

interface Props {
  world: WorldDTO;
  lessons: LessonDTO[];
  progress: UserProgress;
  onSelectLesson: (lesson: LessonDTO) => void;
  avatar?: string;
  onRecenter?: (fn: () => void) => void;
  onNextWorld?: () => void;
  canNextWorld?: boolean;
}

const PLANT_ART = { tree: Tree, pine: Pine, bush: Bush, flower: Flower, rock: Rock };

/** Anything standing on the ground, placed at its contact point. */
function Grounded({
  x,
  y,
  children,
  z,
}: {
  x: number;
  y: number;
  z?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="absolute" style={{ left: x, top: y, zIndex: z, transform: 'translate(-50%, -100%)' }}>
      {children}
    </div>
  );
}

export function WorldMap({
  world,
  lessons,
  progress,
  onSelectLesson,
  avatar,
  onRecenter,
  onNextWorld,
  canNextWorld,
}: Props) {
  const { tc } = useTc();
  const { t } = useT();
  const { viewportRef, worldRef, centerOn } = useMapCamera({
    worldWidth: MAP_W,
    worldHeight: MAP_H,
    minScale: 0.5,
    maxScale: 2.4,
    cover: true,
  });

  const sortedLessons = useMemo(() => [...lessons].sort((a, b) => a.order - b.order), [lessons]);

  /** Every stop's place on the painted trail, by its order in the chapter. */
  const stops = useMemo(
    () =>
      sortedLessons.map((lesson, i) => {
        const [x, y] = stopPosition(i, sortedLessons.length);
        return { lesson, x, y };
      }),
    [sortedLessons],
  );

  const current = useMemo(() => {
    const byId = new Map(stops.map((s) => [s.lesson.id, s]));
    if (progress.currentLesson && byId.has(progress.currentLesson)) {
      return byId.get(progress.currentLesson)!;
    }
    const unlocked = stops.filter((s) => progress.lessonUnlocked.includes(s.lesson.id));
    return unlocked[unlocked.length - 1] ?? stops[0];
  }, [stops, progress]);

  /** Planting is painted back to front so near trees overlap far ones. */
  const planted = useMemo(
    () => PLANTING.map((p, i) => ({ ...p, i, seed: hashSeed(`${world.id}-plant-${i}`) })).sort((a, b) => a.y - b.y),
    [world.id],
  );

  const didCenter = useRef(false);
  useEffect(() => {
    didCenter.current = false;
  }, [world.id]);

  useEffect(() => {
    if (didCenter.current || !current) return;
    didCenter.current = true;
    const id = setTimeout(() => centerOn(current.x, current.y, 1, false), 30);
    return () => clearTimeout(id);
  }, [current, centerOn]);

  useEffect(() => {
    onRecenter?.(() => current && centerOn(current.x, current.y, 1, true));
  }, [onRecenter, centerOn, current]);

  return (
    <div
      ref={viewportRef}
      className="map-viewport absolute inset-0 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #55b9ef, #a9dcf7)' }}
    >
      <div
        ref={worldRef}
        className="absolute left-0 top-0 origin-top-left will-change-transform"
        style={{ width: MAP_W, height: MAP_H }}
      >
        {/* ------------------------- the painted world ------------------------ */}
        <img
          src={backgroundFor(world.order)}
          width={MAP_W}
          height={MAP_H}
          alt=""
          draggable={false}
          className="pointer-events-none absolute left-0 top-0 select-none"
        />

        {/* clouds drifting over the painted sky */}
        {CLOUDS.map((c, i) => (
          <div
            key={`cloud${i}`}
            className="wm-fly pointer-events-none absolute"
            style={
              {
                left: c.x,
                top: c.y,
                animationDuration: `${c.secs}s`,
                animationDelay: `-${c.delay}s`,
                '--wm-fly-x': '340px',
                '--wm-fly-y': '0px',
              } as React.CSSProperties
            }
          >
            <Sprite name={CLOUD_SPRITES[i % CLOUD_SPRITES.length]} scale={c.k} flip={i % 2 === 0} />
          </div>
        ))}

        {/* smoke from the village chimneys */}
        {CHIMNEYS.map((c, i) => (
          <Grounded key={`smoke${i}`} x={c.x} y={c.y}>
            <Smoke seed={i + 1} scale={c.k} />
          </Grounded>
        ))}

        {/* an extra garland over the market */}
        {BUNTINGS.map((b, i) => (
          <Grounded key={`bunt${i}`} x={b.x} y={b.y}>
            <div style={{ transform: `scale(${b.k})`, transformOrigin: 'bottom center' }}>
              <Bunting seed={i + 2} />
            </div>
          </Grounded>
        ))}

        {/* boats rocking on the water */}
        {BOATS.map((b, i) => (
          <Grounded key={`boat${i}`} x={b.x} y={b.y}>
            <div style={{ transform: `scale(${b.k})`, transformOrigin: 'bottom center' }}>
              <Boat seed={i * 3 + 1} />
            </div>
          </Grounded>
        ))}

        {/* the trail of stepping dots */}
        <PathLayer stops={stops} progress={progress} />

        {/* planting: trees, shrubs and flowers, back to front */}
        {planted.map((p) => {
          const Art = PLANT_ART[p.art];
          const k = depthScale(p.y) * (p.k ?? 1);
          return (
            <Grounded key={`p${p.i}`} x={p.x} y={p.y}>
              <div
                style={{
                  transform: `scale(${k * (p.flip ? -1 : 1)}, ${k})`,
                  transformOrigin: 'bottom center',
                }}
              >
                <Art seed={p.seed} />
              </div>
            </Grounded>
          );
        })}

        {/* the lettering on the painting's own signboards */}
        <SignBoard
          rect={SIGN_WORLD}
          lines={[t('world.num', { n: world.order + 1 }), tc(world.title)]}
        />
        {canNextWorld && (
          <SignBoard rect={SIGN_NEXT} lines={[`${t('world.next')} →`]} onClick={onNextWorld} />
        )}

        {/* the stops themselves */}
        {stops.map((s) => (
          <LessonNode
            key={s.lesson.id}
            lesson={s.lesson}
            x={s.x}
            y={s.y}
            info={nodeInfoFor(s.lesson, progress)}
            isCurrent={current?.lesson.id === s.lesson.id}
            worldOrder={world.order}
            onClick={onSelectLesson}
          />
        ))}

        {current && <Player x={current.x} y={current.y} avatar={avatar} />}

        {/* birds, above everything on the ground */}
        {BIRDS.map((b, i) => (
          <div
            key={`bird${i}`}
            className="pointer-events-none absolute"
            style={{ left: b.x, top: b.y, zIndex: 30 }}
          >
            <Bird
              kind={b.kind}
              scale={b.k}
              travel={b.travel}
              rise={b.rise}
              seconds={b.secs}
              delay={b.delay}
              flip={b.travel < 0}
            />
          </div>
        ))}
      </div>

      <AmbientParticles color="#ffffff" />
    </div>
  );
}
