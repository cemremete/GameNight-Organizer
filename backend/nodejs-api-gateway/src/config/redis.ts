import Redis from 'ioredis';
import { logger } from '../utils/logger';

let redis: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redis) {
    redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    redis.on('connect', () => {
      logger.info('Redis connected');
    });

    redis.on('error', (err) => {
      logger.error('Redis error:', err);
    });
  }

  return redis;
}

export async function checkRedisConnection(): Promise<boolean> {
  try {
    const client = getRedisClient();
    await client.ping();
    logger.info('Redis connection established');
    return true;
  } catch (error) {
    logger.error('Redis connection failed:', error);
    return false;
  }
}
