// ============================================
// Block-Hash Common — Analysis Types
// ============================================

import { Chain } from './blockchain.types';

/** Wallet classification */
export enum WalletType {
  WHALE = 'whale',
  SMART_MONEY = 'smart_money',
  EXCHANGE = 'exchange',
  EXCHANGE_HOT = 'exchange_hot',
  EXCHANGE_COLD = 'exchange_cold',
  DEX_ROUTER = 'dex_router',
  BRIDGE = 'bridge',
  MEV_BOT = 'mev_bot',
  SNIPER_BOT = 'sniper_bot',
  RETAIL = 'retail',
  CONTRACT = 'contract',
  DAO_TREASURY = 'dao_treasury',
  VC_FUND = 'vc_fund',
  UNKNOWN = 'unknown',
}

/** Address profile */
export interface AddressProfile {
  address: string;
  chains: Chain[];
  type: WalletType;
  label?: string; // "Binance Hot Wallet 1"
  tags: string[];
  score: number; // 0-100
  totalValueUsd: string;
  firstSeen: number;
  lastActive: number;
  transactionCount: number;
  uniqueTokens: number;
  riskLevel: RiskLevel;
}

/** Risk classification */
export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/** Whale detection result */
export interface WhaleDetection {
  address: string;
  chain: Chain;
  balanceUsd: string;
  tokenBalances: WhaleTokenBalance[];
  rank: number; // ranking among whales
  activity: WhaleActivity;
  detectedAt: number;
}

/** Whale token balance */
export interface WhaleTokenBalance {
  chain: Chain;
  tokenAddress: string;
  symbol: string;
  balance: string;
  balanceUsd: string;
  percentOfSupply: number;
}

/** Whale activity pattern */
export interface WhaleActivity {
  pattern: 'accumulating' | 'distributing' | 'holding' | 'mixed';
  recentBuys: number;
  recentSells: number;
  netFlow24hUsd: string;
  exchangeInteraction: 'depositing' | 'withdrawing' | 'none';
  lastMoveTimestamp: number;
}

/** Smart money wallet profile */
export interface SmartMoneyProfile {
  address: string;
  score: number; // 0-100
  profitability: SmartMoneyProfitability;
  earlyAdoptionScore: number; // 0-100
  defiActivityScore: number; // 0-100
  holdingDurationScore: number; // 0-100
  diversificationScore: number; // 0-100
  trackedSince: number;
  totalTrades: number;
  winRate: number; // 0-1
  avgRoi: number; // percentage
  bestTrade: TradeRecord;
  worstTrade: TradeRecord;
  recentTokens: string[]; // recently bought tokens
}

/** Profitability metrics */
export interface SmartMoneyProfitability {
  totalPnlUsd: string;
  realizedPnlUsd: string;
  unrealizedPnlUsd: string;
  winRate: number;
  avgHoldingDays: number;
  totalTrades: number;
  profitableTrades: number;
  roi30d: number;
  roi90d: number;
  roiAllTime: number;
}

/** Individual trade record */
export interface TradeRecord {
  tokenAddress: string;
  tokenSymbol: string;
  chain: Chain;
  buyTxHash: string;
  sellTxHash?: string;
  buyPrice: string;
  sellPrice?: string;
  amount: string;
  pnlUsd: string;
  roi: number;
  holdingDuration: number; // seconds
  buyTimestamp: number;
  sellTimestamp?: number;
}

/** Portfolio summary */
export interface PortfolioSummary {
  address: string;
  totalValueUsd: string;
  change24hUsd: string;
  change24hPercent: number;
  holdings: PortfolioHolding[];
  chainDistribution: Record<Chain, string>; // chain -> USD value
  lastUpdated: number;
}

/** Individual portfolio holding */
export interface PortfolioHolding {
  chain: Chain;
  tokenAddress: string;
  symbol: string;
  name: string;
  balance: string;
  valueUsd: string;
  priceUsd: string;
  change24hPercent: number;
  percentOfPortfolio: number;
  unrealizedPnlUsd: string;
  unrealizedPnlPercent: number;
}

/** Exchange flow data */
export interface ExchangeFlow {
  exchange: string;
  chain: Chain;
  token: string;
  inflow24hUsd: string;
  outflow24hUsd: string;
  netflow24hUsd: string;
  inflowCount: number;
  outflowCount: number;
  trend: 'accumulating' | 'distributing' | 'neutral';
  timestamp: number;
}

/** Network statistics */
export interface NetworkStats {
  chain: Chain;
  blockHeight: bigint;
  tps: number; // transactions per second
  avgBlockTime: number;
  avgGasPrice?: string;
  activeAddresses24h: number;
  totalTransactions24h: number;
  totalValueTransferred24h: string;
  tvlUsd?: string;
  timestamp: number;
}

/** AI ranking for tokens */
export interface AITokenRanking {
  chain: Chain;
  tokenAddress: string;
  symbol: string;
  overallScore: number; // 0-100
  momentumScore: number;
  whaleInterestScore: number;
  smartMoneyScore: number;
  liquidityScore: number;
  volumeScore: number;
  holderGrowthScore: number;
  riskScore: number; // higher = riskier
  signal: 'strong_buy' | 'buy' | 'neutral' | 'sell' | 'strong_sell';
  reasoning: string[];
  updatedAt: number;
}
