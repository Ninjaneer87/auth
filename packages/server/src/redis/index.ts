import { createClient } from 'redis';
import { env } from '@/config/env';

export const redisClient = createClient({ url: env.REDIS_URL });

redisClient.on('error', (error: Error) => {
  console.error('Redis client error:', error);
});

export async function connectRedis(): Promise<void> {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

export async function closeRedis(): Promise<void> {
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
}
