import mongoose from 'mongoose';
import { env } from './env.js';

mongoose.set('strictQuery', true);

export async function connectDb(uri = env.mongoUri): Promise<typeof mongoose> {
  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
  });
  // eslint-disable-next-line no-console
  console.log(`[db] connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
}
