import type { LessonDTO, UserProgress, NodeState } from '@wondermap/shared';

export interface NodeInfo {
  state: NodeState;
  stars: number;
  bestScore: number;
}

/** Derive a lesson's per-user node state from the user's progress. */
export function nodeInfoFor(lesson: LessonDTO, progress: UserProgress): NodeInfo {
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
