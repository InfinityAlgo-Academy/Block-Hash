// ============================================
// Block-Hash Common — Blockchain Types
// ============================================

/** Supported blockchain networks */
export enum Chain {
  ETHEREUM = 'ethereum',
  BNB = 'bnb',
  BITCOIN = 'bitcoin',
  SOLANA = 'solana',
  ARBITRUM = 'arbitrum',
  BASE = 'base',
  POLYGON = 'polygon',
  AVALANCHE = 'avalanche',
  TRON = 'tron',
}

/** Chains that are EVM-compatible */
export const EVM_CHAINS: Chain[] = [
  Chain.ETHEREUM,
  Chain.BNB,
  Chain.ARBITRUM,
  Chain.BASE,
  Chain.POLYGON,
  Chain.AVALANCHE,
];

/** Chain metadata */
export interface ChainConfig {
  chain: Chain;
  chainId: number;
  name: string;
  symbol: string;
  decimals: number;
  rpcUrl: string;
  wsUrl?: string;
  rpcUrlFallback?: string;
  explorerUrl: string;
  isEvm: boolean;
  blockTime: number; // average block time in seconds
  confirmations: number; // required confirmations for finality
}

/** Normalized block across all chains */
export interface NormalizedBlock {
  chain: Chain;
  number: bigint;
  hash: string;
  parentHash: string;
  timestamp: number;
  nonce: string;
  miner: string;
  difficulty?: bigint;
  gasUsed?: bigint;
  gasLimit?: bigint;
  baseFeePerGas?: bigint;
  transactionCount: number;
  size: number;
  extraData?: string;
  raw: unknown; // original chain-specific block data
}

/** Normalized transaction across all chains */
export interface NormalizedTransaction {
  chain: Chain;
  hash: string;
  blockNumber: bigint;
  blockHash: string;
  from: string;
  to: string | null;
  value: bigint;
  gasPrice?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  gasUsed?: bigint;
  gasLimit?: bigint;
  nonce: number;
  input: string;
  status: TransactionStatus;
  type: TransactionType;
  timestamp: number;
  index: number;
  raw: unknown;
}

/** Transaction status */
export enum TransactionStatus {
  SUCCESS = 1,
  FAILED = 0,
  PENDING = -1,
}

/** Transaction classification */
export enum TransactionType {
  TRANSFER = 'transfer',
  SWAP = 'swap',
  BRIDGE = 'bridge',
  MINT = 'mint',
  BURN = 'burn',
  APPROVAL = 'approval',
  CONTRACT_CREATION = 'contract_creation',
  CONTRACT_CALL = 'contract_call',
  STAKE = 'stake',
  UNSTAKE = 'unstake',
  CLAIM = 'claim',
  LIQUIDITY_ADD = 'liquidity_add',
  LIQUIDITY_REMOVE = 'liquidity_remove',
  NFT_TRANSFER = 'nft_transfer',
  NFT_MINT = 'nft_mint',
  UNKNOWN = 'unknown',
}

/** Normalized event log */
export interface NormalizedLog {
  chain: Chain;
  blockNumber: bigint;
  blockHash: string;
  transactionHash: string;
  transactionIndex: number;
  logIndex: number;
  address: string; // contract that emitted the event
  topics: string[];
  data: string;
  removed: boolean;
  decoded?: DecodedLog;
}

/** Decoded event log */
export interface DecodedLog {
  eventName: string;
  signature: string;
  args: Record<string, unknown>;
}

/** Mempool pending transaction */
export interface PendingTransaction {
  chain: Chain;
  hash: string;
  from: string;
  to: string | null;
  value: bigint;
  gasPrice?: bigint;
  maxFeePerGas?: bigint;
  input: string;
  nonce: number;
  firstSeen: number;
  raw: unknown;
}

/** Block range for backfilling */
export interface BlockRange {
  chain: Chain;
  fromBlock: bigint;
  toBlock: bigint;
}

/** Connection state */
export enum ConnectionState {
  CONNECTED = 'connected',
  CONNECTING = 'connecting',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
}

/** Provider health status */
export interface ProviderHealth {
  chain: Chain;
  url: string;
  state: ConnectionState;
  latency: number; // ms
  lastBlock: bigint;
  lastChecked: number;
  errors: number;
}
