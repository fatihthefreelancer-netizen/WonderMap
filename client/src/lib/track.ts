import { api } from './api';

/**
 * Beat-level telemetry.
 *
 * Chapter 1 is fifteen minutes long and, until now, entirely unobserved: there
 * was no way to tell whether children finish it, or quietly give up at village
 * four. This is the smallest thing that answers that — a named event with a
 * few numbers, batched and posted in the background, never blocking a lesson.
 */

export interface TrackEvent {
  name: string;
  at: number;
  props?: Record<string, unknown>;
}

const QUEUE: TrackEvent[] = [];
const FLUSH_MS = 4000;
const MAX_BATCH = 40;
let timer: ReturnType<typeof setTimeout> | null = null;

async function flush() {
  timer = null;
  if (QUEUE.length === 0) return;
  const batch = QUEUE.splice(0, MAX_BATCH);
  try {
    await api.post('/events', { events: batch });
  } catch {
    // telemetry is never worth interrupting a lesson, and a dropped batch is
    // better than a queue that grows without bound on a flaky connection
  }
}

export function track(name: string, props?: Record<string, unknown>) {
  QUEUE.push({ name, at: Date.now(), props });
  if (QUEUE.length >= MAX_BATCH) {
    void flush();
    return;
  }
  if (!timer) timer = setTimeout(() => void flush(), FLUSH_MS);
}

// don't lose the last few events when the tab goes away
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') void flush();
  });
}
