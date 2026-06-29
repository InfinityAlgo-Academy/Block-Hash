// ============================================
// Block-Hash Config — Redis Configuration
// ============================================

export interface RedisConfig {
  url: string;
  password?: string;
  maxRetriesPerRequest: number;
  retryDelayMs: number;
  keyPrefix: string;
  cache: {
    defaultTtlSeconds: number;
    blockTtlSeconds: number;
    tokenTtlSeconds: number;
    walletTtlSeconds: number;
    statsTtlSeconds: number;
  };
  pubsub: {
    channels: {
      newBlock: string;
      newTransaction: string;
      whaleAlert: string;
      smartMoneyTrade: string;
      tokenEvent: string;
      systemAlert: string;
    };
  };
  queue: {
    defaultJobTimeout: number;
    maxJobsPerWorker: number;
    stalledInterval: number;
  };
}

export const redisConfig: RedisConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: 3,
  retryDelayMs: 1000,
  keyPrefix: 'bh:',
  cache: {
    defaultTtlSeconds: 300,      // 5 min
    blockTtlSeconds: 60,         // 1 min
    tokenTtlSeconds: 600,        // 10 min
    walletTtlSeconds: 900,       // 15 min
    statsTtlSeconds: 30,         // 30 sec
  },
  pubsub: {
    channels: {
      newBlock: 'bh:events:new_block',
      newTransaction: 'bh:events:new_transaction',
      whaleAlert: 'bh:events:whale_alert',
      smartMoneyTrade: 'bh:events:smart_money_trade',
      tokenEvent: 'bh:events:token_event',
      systemAlert: 'bh:events:system_alert',
    },
  },
  queue: {
    defaultJobTimeout: 60_000,    // 60 sec
    maxJobsPerWorker: 10,
    stalledInterval: 30_000,      // 30 sec
  },
};
