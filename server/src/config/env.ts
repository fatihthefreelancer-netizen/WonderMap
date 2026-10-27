import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/*
 * On a server these come from a .env file beside the code. On Vercel they come
 * from the project's environment variables and there is no .env to find, so the
 * loads below simply do nothing — dotenv does not throw on a missing file.
 */
const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(here, '../../.env') });
dotenv.config({ path: path.resolve(here, '../../../.env') });

const nodeEnv = process.env.NODE_ENV ?? 'development';
const isProd = nodeEnv === 'production';

/**
 * A setting that may fall back to a development default, but must be set for
 * real once deployed.
 *
 * These used to fall back silently in every environment. That is fine for
 * MONGO_URI on a laptop and dangerous in production twice over: a missing
 * database URL would send the server looking for mongodb://localhost, where it
 * hangs until the request times out instead of saying what is wrong; and a
 * missing JWT secret would quietly sign everybody's session with the string
 * "dev-access-secret-change-me", which is in this file, which is on GitHub —
 * so anyone could mint a token for any account. Failing at boot is the only
 * safe behaviour.
 */
function requiredInProd(key: string, devFallback: string): string {
  const value = process.env[key];
  if (value) return value;
  if (isProd) {
    throw new Error(
      `Missing required environment variable ${key}. ` +
        `Set it in your host's environment settings (Vercel: Project → Settings → Environment Variables).`,
    );
  }
  return devFallback;
}

/** Origins allowed to call the API with credentials. */
const clientOrigins = (process.env.CLIENT_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export const env = {
  nodeEnv,
  isProd,
  port: Number(process.env.PORT ?? 4000),
  clientOrigins,
  mongoUri: requiredInProd('MONGO_URI', 'mongodb://localhost:27017/wondermap'),
  /**
   * `lax` is right when the API and the site share a domain, which is how this
   * deploys on Vercel — and it keeps working as browsers shut down third-party
   * cookies. Set COOKIE_SAMESITE=none (with HTTPS) only if the API ever moves
   * to a different domain from the client.
   */
  cookieSameSite: (process.env.COOKIE_SAMESITE as 'lax' | 'strict' | 'none') ?? 'lax',
  jwt: {
    accessSecret: requiredInProd('JWT_ACCESS_SECRET', 'dev-access-secret-change-me'),
    refreshSecret: requiredInProd('JWT_REFRESH_SECRET', 'dev-refresh-secret-change-me'),
    accessTtl: process.env.JWT_ACCESS_TTL ?? '15m',
    refreshTtl: process.env.JWT_REFRESH_TTL ?? '7d',
  },
};
