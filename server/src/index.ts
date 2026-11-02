/**
 * Running the API as an ordinary long-lived server: `npm run dev`, Docker, a
 * VPS. On Vercel this file is not used — Vercel imports `app.ts` and serves
 * its default export as a function. Both paths share the same app, and the
 * database gate inside `createApp` makes the connection safe either way.
 */

import app from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';

async function bootstrap() {
  await connectDb();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] http://localhost:${env.port} (${env.nodeEnv})`);
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[fatal] failed to start server', err);
  process.exit(1);
});
