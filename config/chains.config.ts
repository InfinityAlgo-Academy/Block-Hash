// ============================================
// Block-Hash Config — Chain Configuration
// ============================================

import { Chain, ChainConfig, CHAIN_CONFIGS } from '@block-hash/common';

/** Extended chain config with operational parameters */
export interface ChainOperationalConfig extends ChainConfig {
  /** Maximum blocks to process per batch during backfill */
  batchSize: number;
  /** Maximum concurrent RPC requests */
  maxConcurrency: number;
  /** RPC request timeout in ms */
  requestTimeout: number;
  /** Whether to enable mempool monitoring */
  enableMempool: boolean;
  /** Whether to enable log collection */
  enableLogs: boolean;
  /** Block polling interval in ms (fallback when WS is unavailable) */
  pollingInterval: number;
  /** Maximum block range for getLogs calls */
  maxLogBlockRange: number;
}

/** Operational configs per chain */
export const CHAIN_OPERATIONAL_CONFIGS: Record<Chain, ChainOperationalConfig> = {
  [Chain.ETHEREUM]: {
    ...CHAIN_CONFIGS[Chain.ETHEREUM],
    batchSize: 100,
    maxConcurrency: 10,
    requestTimeout: 30_000,
    enableMempool: true,
    enableLogs: true,
    pollingInterval: 12_000,
    maxLogBlockRange: 2000,
  },
  [Chain.BNB]: {
    ...CHAIN_CONFIGS[Chain.BNB],
    batchSize: 200,
    maxConcurrency: 15,
    requestTimeout: 20_000,
    enableMempool: true,
    enableLogs: true,
    pollingInterval: 3_000,
    maxLogBlockRange: 5000,
  },
  [Chain.BITCOIN]: {
    ...CHAIN_CONFIGS[Chain.BITCOIN],
    batchSize: 10,
    maxConcurrency: 3,
    requestTimeout: 60_000,
    enableMempool: true,
    enableLogs: false,
    pollingInterval: 60_000,
    maxLogBlockRange: 0,
  },
  [Chain.SOLANA]: {
    ...CHAIN_CONFIGS[Chain.SOLANA],
    batchSize: 50,
    maxConcurrency: 5,
    requestTimeout: 30_000,
    enableMempool: false,
    enableLogs: true,
    pollingInterval: 400,
    maxLogBlockRange: 1000,
  },
  [Chain.ARBITRUM]: {
    ...CHAIN_CONFIGS[Chain.ARBITRUM],
    batchSize: 500,
    maxConcurrency: 20,
    requestTimeout: 20_000,
    enableMempool: false,
    enableLogs: true,
    pollingInterval: 250,
    maxLogBlockRange: 10000,
  },
  [Chain.BASE]: {
    ...CHAIN_CONFIGS[Chain.BASE],
    batchSize: 200,
    maxConcurrency: 15,
    requestTimeout: 20_000,
    enableMempool: false,
    enableLogs: true,
    pollingInterval: 2_000,
    maxLogBlockRange: 5000,
  },
  [Chain.POLYGON]: {
    ...CHAIN_CONFIGS[Chain.POLYGON],
    batchSize: 200,
    maxConcurrency: 15,
    requestTimeout: 20_000,
    enableMempool: false,
    enableLogs: true,
    pollingInterval: 2_000,
    maxLogBlockRange: 3500,
  },
  [Chain.AVALANCHE]: {
    ...CHAIN_CONFIGS[Chain.AVALANCHE],
    batchSize: 200,
    maxConcurrency: 10,
    requestTimeout: 20_000,
    enableMempool: false,
    enableLogs: true,
    pollingInterval: 2_000,
    maxLogBlockRange: 2048,
  },
  [Chain.TRON]: {
    ...CHAIN_CONFIGS[Chain.TRON],
    batchSize: 100,
    maxConcurrency: 5,
    requestTimeout: 30_000,
    enableMempool: false,
    enableLogs: true,
    pollingInterval: 3_000,
    maxLogBlockRange: 100,
  },
};
