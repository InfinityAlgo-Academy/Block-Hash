// ============================================
// Block-Hash Common — Token Types
// ============================================

import { Chain } from './blockchain.types';

/** Token standard */
export enum TokenStandard {
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
  SPL = 'SPL', // Solana
  TRC20 = 'TRC20', // Tron
  BEP20 = 'BEP20', // BNB Chain
  NATIVE = 'NATIVE', // ETH, BNB, SOL, etc.
}

/** Token metadata */
export interface TokenInfo {
  chain: Chain;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  standard: TokenStandard;
  totalSupply?: string;
  logoUrl?: string;
  verified: boolean;
}

/** ERC20 Transfer event */
export interface ERC20TransferEvent {
  chain: Chain;
  blockNumber: bigint;
  transactionHash: string;
  logIndex: number;
  contractAddress: string;
  from: string;
  to: string;
  value: bigint;
  tokenInfo?: TokenInfo;
  timestamp: number;
}

/** ERC20 Approval event */
export interface ERC20ApprovalEvent {
  chain: Chain;
  blockNumber: bigint;
  transactionHash: string;
  logIndex: number;
  contractAddress: string;
  owner: string;
  spender: string;
  value: bigint;
  tokenInfo?: TokenInfo;
  timestamp: number;
}

/** NFT Transfer event (ERC721) */
export interface NFTTransferEvent {
  chain: Chain;
  blockNumber: bigint;
  transactionHash: string;
  logIndex: number;
  contractAddress: string;
  from: string;
  to: string;
  tokenId: bigint;
  standard: TokenStandard.ERC721 | TokenStandard.ERC1155;
  amount?: bigint; // for ERC1155
  timestamp: number;
}

/** Token metrics from analysis */
export interface TokenMetrics {
  chain: Chain;
  address: string;
  symbol: string;
  holders: number;
  totalTransfers24h: number;
  volume24h: string; // USD
  uniqueBuyers24h: number;
  uniqueSellers24h: number;
  buyPressure: number; // 0-1 ratio
  topHoldersConcentration: number; // % held by top 10
  liquidityUsd: string;
  priceUsd?: string;
  priceChange24h?: number;
  marketCapUsd?: string;
  createdAt: number;
  lastUpdated: number;
}

/** Swap event (DEX) */
export interface SwapEvent {
  chain: Chain;
  blockNumber: bigint;
  transactionHash: string;
  logIndex: number;
  dex: string; // uniswap_v2, uniswap_v3, pancakeswap, etc.
  poolAddress: string;
  sender: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: bigint;
  amountOut: bigint;
  priceImpact?: number;
  timestamp: number;
}

/** Liquidity event */
export interface LiquidityEvent {
  chain: Chain;
  blockNumber: bigint;
  transactionHash: string;
  dex: string;
  poolAddress: string;
  provider: string;
  token0: string;
  token1: string;
  amount0: bigint;
  amount1: bigint;
  type: 'add' | 'remove';
  timestamp: number;
}
