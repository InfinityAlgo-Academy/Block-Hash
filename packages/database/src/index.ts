// ============================================
// Block-Hash Database — Entry Point
// ============================================

// Prisma (PostgreSQL)
export { PrismaClient } from '@prisma/client';

// ClickHouse
export { getClickHouseClient, initializeClickHouse, closeClickHouse } from './clickhouse/client';
export * from './clickhouse/queries/analytics.queries';

// Redis
export { getRedisClient, getRedisSubscriber, getRedisPublisher, closeRedis } from './redis/client';
export { CacheService, cacheService } from './redis/cache.service';
export { PubSubService, pubSubService } from './redis/pubsub.service';

// Repositories
export { BlockRepository, blockRepository } from './repositories/block.repository';
export { TransactionRepository, transactionRepository } from './repositories/transaction.repository';
export { WalletRepository, walletRepository } from './repositories/wallet.repository';
export {
  TokenRepository, tokenRepository,
  WhaleAlertRepository, whaleAlertRepository,
  SmartMoneyRepository, smartMoneyRepository,
  StatisticsRepository, statisticsRepository,
  AlertRuleRepository, alertRuleRepository,
} from './repositories/token.repository';
