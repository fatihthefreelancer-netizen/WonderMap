import type { LessonDTO, UserProgress, NodeState } from '@wondermap/shared';

export interface NodeInfo {
  state: NodeState;
  stars: number;
  bestScore: number;
}

/**
 * The lessons that are actually finished and worth playing.
 *
 * Everything else on the map is scaffolding — a node, a title and a stub —
 * and letting a child walk into one is worse than not offering it: they get a
 * half-built screen and conclude the app is broken. The seed still creates
 * the whole world so the map looks like a journey, and this is the gate that
 * decides what can be opened.
 *
 * Add a storyId here when its chapter is ready.
 */
const PLAYABLE = new Set(['1a']);

/** Derive a lesson's per-user node state from the user's progress. */
export function nodeInfoFor(lesson: LessonDTO, progress: UserProgress): NodeInfo {
  if (!lesson.storyId || !PLAYABLE.has(lesson.storyId)) {
    return { state: 'locked', stars: 0, bestScore: 0 };
  }

  const prog = progress.lessonProgress.find((p) => p.lesson === lesson.id);
  const unlocked = progress.lessonUnlocked.includes(lesson.id);

  if (prog?.completed) {
    return {
      state: prog.stars >= 3 ? 'perfect' : 'completed',
      stars: prog.stars,
      bestScore: prog.bestScore,
    };
  }
  return {
    state: unlocked ? 'unlocked' : 'locked',
    stars: 0,
    bestScore: 0,
  };
}

/** Path segment color between two consecutive lessons. */
export function pathState(
  fromLesson: LessonDTO,
  toLesson: LessonDTO,
  progress: UserProgress,
): NodeState {
  const from = nodeInfoFor(fromLesson, progress);
  const to = nodeInfoFor(toLesson, progress);
  if (from.state === 'completed' || from.state === 'perfect') {
    return to.state === 'locked' ? 'unlocked' : 'completed';
  }
  return 'locked';
}
