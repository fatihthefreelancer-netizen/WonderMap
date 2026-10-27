/**
 * The whole API, as one Vercel function.
 *
 * `server/src/index.ts` is still the entry point for running this as an
 * ordinary long-lived Node server (`npm run dev`, Docker, any VPS). This file
 * is the other way in: Vercel has no boot step and no `listen`, it hands a
 * request to an exported handler, so the Express app is built once per
 * container and the database connection is established before the first
 * request is allowed through.
 *
 * `vercel.json` rewrites every `/api/*` path here, and Vercel preserves the
 * original URL on a rewrite, so Express still sees `/api/auth/login` and its
 * router table works unchanged.
 */

import type { IncomingMessage, ServerResponse } from 'node:http';
import { createApp } from '../server/src/app.js';
import { connectDb } from '../server/src/config/db.js';

// Built once per container and reused by every request that lands on it.
const app = createApp();

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    await connectDb();
  } catch (err) {
    // Without this the request would hang until the platform timed it out and
    // the log would say nothing useful. A bad or missing MONGO_URI is by far
    // the most likely first-deploy failure, so it gets a straight answer.
    // eslint-disable-next-line no-console
    console.error('[fatal] database connection failed', err);
    res.statusCode = 503;
    res.setHeader('content-type', 'application/json');
    res.end(
      JSON.stringify({
        message: 'Database unavailable. Check MONGO_URI and that this deployment is allowed to reach the cluster.',
      }),
    );
    return;
  }

  return (app as unknown as (q: IncomingMessage, s: ServerResponse) => void)(req, res);
}
