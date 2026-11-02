import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { connectDb } from './config/db.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.js';

export function createApp() {
  const app = express();

  /*
   * Nothing reaches a route until the database is up.
   *
   * Run as a long-lived server, `index.ts` connects before it listens and this
   * is a no-op — `connectDb` returns immediately once connected. Run as a
   * Vercel service there is no boot step to hang the connection off, and the
   * module has to export the app synchronously, so the wait belongs here: the
   * first request in a cold container awaits the dial-up, and every request
   * after it passes straight through.
   *
   * It is also the only place that can turn a database outage into an answer.
   * Without it a bad MONGO_URI surfaces as a request that hangs until the
   * platform times it out, with nothing in the log to say why — which is the
   * single most likely thing to go wrong on a first deploy.
   */
  app.use((_req, res, next) => {
    connectDb().then(
      () => next(),
      (err) => {
        // eslint-disable-next-line no-console
        console.error('[fatal] database connection failed', err);
        res.status(503).json({
          message:
            'Database unavailable. Check MONGO_URI, and that the database allows connections from this deployment.',
        });
      },
    );
  });

  /*
   * On Vercel the site and this API share one domain, so most requests are
   * same-origin and never consult CORS at all. The allowance still matters for
   * two cases: running the client on :5173 against this server on :4000 in
   * development, and Vercel preview deployments, which each get their own
   * generated *.vercel.app hostname that cannot be listed ahead of time.
   *
   * A request with no Origin header (curl, health checks, same-origin GETs) is
   * allowed. Anything else must match CLIENT_ORIGIN exactly, or be a preview of
   * this project.
   */
  const previewHost = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;
  app.use(
    cors({
      origin(origin, done) {
        if (!origin) return done(null, true);
        if (env.clientOrigins.includes(origin)) return done(null, true);
        if (!env.isProd && origin.startsWith('http://localhost:')) return done(null, true);
        if (previewHost.test(origin)) return done(null, true);
        return done(new Error(`Origin not allowed by CORS: ${origin}`));
      },
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '2mb' }));
  app.use(cookieParser());
  if (!env.isProd) app.use(morgan('dev'));

  app.use(
    '/api/auth',
    rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false }),
  );

  app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));
  app.use('/api', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

/**
 * The app itself, as the module's default export.
 *
 * This is the conventional Express layout — `app.ts` builds the app, the
 * entrypoint listens on it — and it is also exactly what Vercel's Express
 * support looks for. Vercel searches app/index/server (optionally under src/)
 * and requires the file it finds to default-export the app or call `listen`.
 * It finds this file first. When it exported only the `createApp` factory the
 * service built cleanly, served nothing, and failed every request with
 * "Can't detect way to handle request".
 *
 * `createApp` stays exported so a test can build an isolated instance.
 */
export default createApp();
