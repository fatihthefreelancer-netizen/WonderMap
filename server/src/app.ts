import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.js';

export function createApp() {
  const app = express();

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
