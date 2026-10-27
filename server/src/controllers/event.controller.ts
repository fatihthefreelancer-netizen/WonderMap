import type { Request, Response } from 'express';
import { z } from 'zod';
import { Event } from '../models/Event.js';

/**
 * Learning telemetry: a batch of named events from one learner.
 *
 * Clients are not trusted with timing, so each event's reported `at` is clamped
 * to a sane window around the server clock. The endpoint always answers 202 —
 * a failed insert must never surface to a child mid-lesson.
 */
const eventsSchema = z.object({
  events: z
    .array(
      z.object({
        name: z.string().min(1).max(64),
        at: z.number(),
        props: z.record(z.unknown()).optional(),
      }),
    )
    .max(40),
});

const DAY = 24 * 60 * 60 * 1000;

export async function ingestEvents(req: Request, res: Response) {
  const parsed = eventsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(202).json({ accepted: 0 });
    return;
  }

  const now = Date.now();
  const docs = parsed.data.events.map((e) => ({
    user: req.auth?.sub,
    name: e.name,
    at: new Date(Math.min(now, Math.max(now - DAY, e.at))),
    props: e.props,
  }));

  try {
    await Event.insertMany(docs, { ordered: false });
  } catch {
    // best effort only
  }
  res.status(202).json({ accepted: docs.length });
}

/**
 * Where do learners stop? One row per beat, with how many entered it — the
 * question the chapter could not answer before.
 */
export async function funnel(req: Request, res: Response) {
  const chapter = typeof req.query.chapter === 'string' ? req.query.chapter : '1a';
  const rows = await Event.aggregate([
    { $match: { name: 'beat_enter', 'props.chapter': chapter } },
    {
      $group: {
        _id: { beat: '$props.beat', index: '$props.index' },
        entered: { $sum: 1 },
        learners: { $addToSet: '$user' },
      },
    },
    {
      $project: {
        _id: 0,
        beat: '$_id.beat',
        index: '$_id.index',
        entered: 1,
        learners: { $size: '$learners' },
      },
    },
    { $sort: { index: 1 } },
  ]);
  res.json({ chapter, rows });
}
