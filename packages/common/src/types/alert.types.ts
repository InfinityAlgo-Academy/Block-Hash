// ============================================
// Block-Hash Common — Alert Types
// ============================================

import { Chain } from './blockchain.types';

/** Alert severity levels */
export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'critical',
  URGENT = 'urgent',
}

/** Alert category */
export enum AlertCategory {
  WHALE_MOVEMENT = 'whale_movement',
  SMART_MONEY_BUY = 'smart_money_buy',
  SMART_MONEY_SELL = 'smart_money_sell',
  LARGE_TRANSFER = 'large_transfer',
  EXCHANGE_INFLOW = 'exchange_inflow',
  EXCHANGE_OUTFLOW = 'exchange_outflow',
  TOKEN_ANOMALY = 'token_anomaly',
  LIQUIDITY_EVENT = 'liquidity_event',
  NEW_CONTRACT = 'new_contract',
  PRICE_SPIKE = 'price_spike',
  VOLUME_SPIKE = 'volume_spike',
  HOLDER_SURGE = 'holder_surge',
  MEMPOOL_UNUSUAL = 'mempool_unusual',
  NETWORK_CONGESTION = 'network_congestion',
  REORG_DETECTED = 'reorg_detected',
}

/** Alert definition */
export interface Alert {
  id: string;
  category: AlertCategory;
  severity: AlertSeverity;
  chain: Chain;
  title: string;
  message: string;
  data: AlertData;
  timestamp: number;
  acknowledged: boolean;
  expiresAt?: number;
}

/** Alert payload data */
export interface AlertData {
  transactionHash?: string;
  fromAddress?: string;
  toAddress?: string;
  tokenAddress?: string;
  tokenSymbol?: string;
  amount?: string;
  amountUsd?: string;
  blockNumber?: bigint;
  walletType?: string;
  walletLabel?: string;
  metadata?: Record<string, unknown>;
}

/** Alert subscription rule */
export interface AlertRule {
  id: string;
  userId: string;
  name: string;
  enabled: boolean;
  categories: AlertCategory[];
  chains: Chain[];
  conditions: AlertCondition[];
  channels: AlertChannel[];
  cooldownMs: number; // debounce period
  createdAt: number;
  updatedAt: number;
}

/** Alert condition */
export interface AlertCondition {
  field: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'contains' | 'in';
  value: string | number | string[];
}

/** Alert delivery channels */
export interface AlertChannel {
  type: 'websocket' | 'webhook' | 'email' | 'telegram' | 'discord';
  config: Record<string, string>;
}
