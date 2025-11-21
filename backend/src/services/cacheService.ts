import { redis } from '../config/redis';
import { logger } from '../utils/logger';

class CacheService {
  private readonly DEFAULT_TTL = 3600; // 1 hour

  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redis.getJSON(key);
      if (cached) {
        logger.debug(`Cache hit: ${key}`);
        return cached as T;
      }
      logger.debug(`Cache miss: ${key}`);
      return null;
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = this.DEFAULT_TTL): Promise<void> {
    try {
      await redis.setJSON(key, value, ttl);
      logger.debug(`Cache set: ${key}, TTL: ${ttl}s`);
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
      logger.debug(`Cache deleted: ${key}`);
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    // Note: This would require Redis SCAN command for production
    // For now, just log
    logger.info(`Cache invalidation requested for pattern: ${pattern}`);
  }

  generateKey(...parts: string[]): string {
    return parts.join(':');
  }
}

export const cacheService = new CacheService();
