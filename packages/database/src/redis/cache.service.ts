// ============================================
// Block-Hash Database — Cache Service
// ============================================

import { getRedisClient } from './client';

const PREFIX = 'bh:cache:';

export class CacheService {
  private redis = getRedisClient();

  /** Get a cached value */
  async get<T>(key: string): Promise<T | null> {
    const raw = await this.redis.get(PREFIX + key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  /** Set a cached value with TTL */
  async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    await this.redis.setex(PREFIX + key, ttlSeconds, JSON.stringify(value));
  }

  /** Delete a cached value */
  async del(key: string): Promise<void> {
    await this.redis.del(PREFIX + key);
  }

  /** Delete keys matching a pattern */
  async delPattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(PREFIX + pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  /** Get or compute a cached value */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttlSeconds = 300
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;

    const value = await factory();
    await this.set(key, value, ttlSeconds);
    return value;
  }

  /** Increment a counter */
  async incr(key: string, ttlSeconds?: number): Promise<number> {
    const fullKey = PREFIX + key;
    const val = await this.redis.incr(fullKey);
    if (ttlSeconds && val === 1) {
      await this.redis.expire(fullKey, ttlSeconds);
    }
    return val;
  }

  /** Check if key exists */
  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(PREFIX + key);
    return result === 1;
  }

  /** Set hash fields */
  async hset(key: string, fields: Record<string, string>, ttlSeconds?: number): Promise<void> {
    const fullKey = PREFIX + key;
    await this.redis.hset(fullKey, fields);
    if (ttlSeconds) {
      await this.redis.expire(fullKey, ttlSeconds);
    }
  }

  /** Get all hash fields */
  async hgetall(key: string): Promise<Record<string, string>> {
    return this.redis.hgetall(PREFIX + key);
  }
}

/** Singleton cache service */
export const cacheService = new CacheService();
