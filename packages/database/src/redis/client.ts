// ============================================
// Block-Hash Database — Redis Client
// ============================================

import Redis from 'ioredis';

let redisClient: Redis | null = null;
let redisSub: Redis | null = null;
let redisPub: Redis | null = null;

/** Create Redis connection options */
function createRedisOptions(): { host: string; port: number; password?: string } {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parseInt(parsed.port || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  };
}

/** Get or create the main Redis client */
export function getRedisClient(): Redis {
  if (!redisClient) {
    redisClient = new Redis({
      ...createRedisOptions(),
      maxRetriesPerRequest: 3,
      retryStrategy(times: number) {
        const delay = Math.min(times * 1000, 30000);
        return delay;
      },
      lazyConnect: false,
    });

    redisClient.on('error', (err) => {
      console.error('[Redis] Connection error:', err.message);
    });

    redisClient.on('connect', () => {
      console.log('[Redis] Connected');
    });
  }
  return redisClient;
}

/** Get a dedicated Redis subscriber client */
export function getRedisSubscriber(): Redis {
  if (!redisSub) {
    redisSub = new Redis({
      ...createRedisOptions(),
      maxRetriesPerRequest: null,
    });
  }
  return redisSub;
}

/** Get a dedicated Redis publisher client */
export function getRedisPublisher(): Redis {
  if (!redisPub) {
    redisPub = new Redis({
      ...createRedisOptions(),
      maxRetriesPerRequest: 3,
    });
  }
  return redisPub;
}

/** Close all Redis connections */
export async function closeRedis(): Promise<void> {
  const clients = [redisClient, redisSub, redisPub].filter(Boolean) as Redis[];
  await Promise.all(clients.map((c) => c.quit()));
  redisClient = null;
  redisSub = null;
  redisPub = null;
}
