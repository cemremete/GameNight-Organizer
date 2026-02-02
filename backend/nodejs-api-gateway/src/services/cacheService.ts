import { getRedisClient } from '../config/redis';
import { logger } from '../utils/logger';

export class CacheService {
  private redis = getRedisClient();

  // cache user's events list (5 min TTL)
  async cacheUserEvents(userId: string, events: any[]) {
    try {
      const key = `user:${userId}:events`;
      await this.redis.setex(key, 300, JSON.stringify(events));
    } catch (error) {
      logger.warn('Failed to cache user events:', error);
    }
  }

  async getUserEvents(userId: string): Promise<any[] | null> {
    try {
      const key = `user:${userId}:events`;
      const cached = await this.redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      logger.warn('Failed to get cached user events:', error);
      return null;
    }
  }

  // cache event details (10 min TTL)
  async cacheEvent(eventId: string, event: any) {
    try {
      const key = `event:${eventId}`;
      await this.redis.setex(key, 600, JSON.stringify(event));
    } catch (error) {
      logger.warn('Failed to cache event:', error);
    }
  }

  async getEvent(eventId: string): Promise<any | null> {
    try {
      const key = `event:${eventId}`;
      const cached = await this.redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      logger.warn('Failed to get cached event:', error);
      return null;
    }
  }

  // cache analytics data (1 hour TTL)
  async cacheAnalytics(userId: string, data: any) {
    try {
      const key = `analytics:${userId}`;
      await this.redis.setex(key, 3600, JSON.stringify(data));
    } catch (error) {
      logger.warn('Failed to cache analytics:', error);
    }
  }

  async getAnalytics(userId: string): Promise<any | null> {
    try {
      const key = `analytics:${userId}`;
      const cached = await this.redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      logger.warn('Failed to get cached analytics:', error);
      return null;
    }
  }

  // invalidation methods
  async invalidateUserEvents(userId: string) {
    try {
      await this.redis.del(`user:${userId}:events`);
    } catch (error) {
      logger.warn('Failed to invalidate user events cache:', error);
    }
  }

  async invalidateEvent(eventId: string) {
    try {
      await this.redis.del(`event:${eventId}`);
    } catch (error) {
      logger.warn('Failed to invalidate event cache:', error);
    }
  }

  async invalidateAnalytics(userId: string) {
    try {
      await this.redis.del(`analytics:${userId}`);
    } catch (error) {
      logger.warn('Failed to invalidate analytics cache:', error);
    }
  }
}
