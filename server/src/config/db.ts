import mongoose from 'mongoose';
import { env } from './env.js';

mongoose.set('strictQuery', true);

/**
 * One connection per container, shared by every request that lands on it.
 *
 * A long-running server connects once at boot. A serverless function does not
 * have a boot — it is woken per request, and whatever it left in module scope
 * may or may not still be there. Connecting inside the handler without caching
 * opens a fresh pool on every invocation, and a burst of traffic will exhaust
 * the connection limit of a free MongoDB Atlas cluster in seconds.
 *
 * So the *promise* is cached, not just the connection: two requests arriving
 * during the same cold start both await the same dial-up instead of racing to
 * open two. It is parked on globalThis because a platform may re-evaluate this
 * module while keeping the process, which would reset an ordinary module-level
 * variable.
 */
const CACHE_KEY = Symbol.for('wondermap.mongoose.connection');

interface Cache {
  promise: Promise<typeof mongoose> | null;
}

const globalCache = globalThis as unknown as Record<symbol, Cache | undefined>;
const cache: Cache = globalCache[CACHE_KEY] ?? { promise: null };
globalCache[CACHE_KEY] = cache;

export async function connectDb(uri = env.mongoUri): Promise<typeof mongoose> {
  // 1 = connected, 2 = connecting; either way mongoose will queue the query
  if (mongoose.connection.readyState === 1) return mongoose;

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 8000,
        // A serverless container handles one request at a time, so a large
        // pool buys nothing and costs connection slots on a shared cluster.
        maxPoolSize: env.isProd ? 5 : 10,
      })
      .then((conn) => {
        // eslint-disable-next-line no-console
        console.log(`[db] connected: ${conn.connection.host}/${conn.connection.name}`);
        return conn;
      })
      .catch((err) => {
        // Drop the failed promise so the next request retries rather than
        // re-awaiting a rejection for the life of the container.
        cache.promise = null;
        throw err;
      });
  }

  return cache.promise;
}

export async function disconnectDb(): Promise<void> {
  cache.promise = null;
  await mongoose.disconnect();
}
