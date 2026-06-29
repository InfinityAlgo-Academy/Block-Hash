// ============================================
// Block-Hash Common — Chain Configurations
// ============================================

import { Chain, ChainConfig } from '../types/blockchain.types';

/** Default chain configurations */
export const CHAIN_CONFIGS: Record<Chain, ChainConfig> = {
  [Chain.ETHEREUM]: {
    chain: Chain.ETHEREUM,
    chainId: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    rpcUrl: process.env.ETH_RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/demo',
    wsUrl: process.env.ETH_WS_URL,
    rpcUrlFallback: process.env.ETH_RPC_URL_FALLBACK,
    explorerUrl: 'https://etherscan.io',
    isEvm: true,
    blockTime: 12,
    confirmations: 12,
  },
  [Chain.BNB]: {
    chain: Chain.BNB,
    chainId: 56,
    name: 'BNB Chain',
    symbol: 'BNB',
    decimals: 18,
    rpcUrl: process.env.BNB_RPC_URL || 'https://bsc-dataseed1.binance.org',
    wsUrl: process.env.BNB_WS_URL,
    rpcUrlFallback: process.env.BNB_RPC_URL_FALLBACK,
    explorerUrl: 'https://bscscan.com',
    isEvm: true,
    blockTime: 3,
    confirmations: 15,
  },
  [Chain.BITCOIN]: {
    chain: Chain.BITCOIN,
    chainId: 0,
    name: 'Bitcoin',
    symbol: 'BTC',
    decimals: 8,
    rpcUrl: process.env.BTC_RPC_URL || 'http://localhost:8332',
    explorerUrl: 'https://blockstream.info',
    isEvm: false,
    blockTime: 600,
    confirmations: 6,
  },
  [Chain.SOLANA]: {
    chain: Chain.SOLANA,
    chainId: 0,
    name: 'Solana',
    symbol: 'SOL',
    decimals: 9,
    rpcUrl: process.env.SOL_RPC_URL || 'https://api.mainnet-beta.solana.com',
    wsUrl: process.env.SOL_WS_URL || 'wss://api.mainnet-beta.solana.com',
    explorerUrl: 'https://solscan.io',
    isEvm: false,
    blockTime: 0.4,
    confirmations: 32,
  },
  [Chain.ARBITRUM]: {
    chain: Chain.ARBITRUM,
    chainId: 42161,
    name: 'Arbitrum One',
    symbol: 'ETH',
    decimals: 18,
    rpcUrl: process.env.ARB_RPC_URL || 'https://arb1.arbitrum.io/rpc',
    wsUrl: process.env.ARB_WS_URL,
    explorerUrl: 'https://arbiscan.io',
    isEvm: true,
    blockTime: 0.25,
    confirmations: 20,
  },
  [Chain.BASE]: {
    chain: Chain.BASE,
    chainId: 8453,
    name: 'Base',
    symbol: 'ETH',
    decimals: 18,
    rpcUrl: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
    wsUrl: process.env.BASE_WS_URL,
    explorerUrl: 'https://basescan.org',
    isEvm: true,
    blockTime: 2,
    confirmations: 20,
  },
  [Chain.POLYGON]: {
    chain: Chain.POLYGON,
    chainId: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    decimals: 18,
    rpcUrl: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
    wsUrl: process.env.POLYGON_WS_URL,
    explorerUrl: 'https://polygonscan.com',
    isEvm: true,
    blockTime: 2,
    confirmations: 128,
  },
  [Chain.AVALANCHE]: {
    chain: Chain.AVALANCHE,
    chainId: 43114,
    name: 'Avalanche C-Chain',
    symbol: 'AVAX',
    decimals: 18,
    rpcUrl: process.env.AVAX_RPC_URL || 'https://api.avax.network/ext/bc/C/rpc',
    wsUrl: process.env.AVAX_WS_URL,
    explorerUrl: 'https://snowtrace.io',
    isEvm: true,
    blockTime: 2,
    confirmations: 12,
  },
  [Chain.TRON]: {
    chain: Chain.TRON,
    chainId: 0,
    name: 'Tron',
    symbol: 'TRX',
    decimals: 6,
    rpcUrl: process.env.TRON_API_URL || 'https://api.trongrid.io',
    explorerUrl: 'https://tronscan.org',
    isEvm: false,
    blockTime: 3,
    confirmations: 19,
  },
};

/** Get chain config by chain enum */
export function getChainConfig(chain: Chain): ChainConfig {
  const config = CHAIN_CONFIGS[chain];
  if (!config) {
    throw new Error(`Unknown chain: ${chain}`);
  }
  return config;
}

/** Get all EVM chain configs */
export function getEvmChainConfigs(): ChainConfig[] {
  return Object.values(CHAIN_CONFIGS).filter((c) => c.isEvm);
}

/** Get chain by chainId */
export function getChainByChainId(chainId: number): Chain | undefined {
  const entry = Object.entries(CHAIN_CONFIGS).find(([, config]) => config.chainId === chainId);
  return entry ? (entry[0] as Chain) : undefined;
}
