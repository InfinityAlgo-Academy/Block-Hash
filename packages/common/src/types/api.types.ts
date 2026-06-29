// ============================================
// Block-Hash Common — API Types
// ============================================

import { Chain } from './blockchain.types';

/** Paginated response wrapper */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

/** Pagination metadata */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/** Common query parameters */
export interface BaseQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** Block query parameters */
export interface BlockQueryParams extends BaseQueryParams {
  chain?: Chain;
  fromBlock?: number;
  toBlock?: number;
  fromTimestamp?: number;
  toTimestamp?: number;
}

/** Transaction query parameters */
export interface TransactionQueryParams extends BaseQueryParams {
  chain?: Chain;
  address?: string;
  from?: string;
  to?: string;
  type?: string;
  status?: number;
  fromBlock?: number;
  toBlock?: number;
  minValue?: string;
  maxValue?: string;
}

/** Token query parameters */
export interface TokenQueryParams extends BaseQueryParams {
  chain?: Chain;
  search?: string;
  minHolders?: number;
  minVolume?: string;
  verified?: boolean;
}

/** Whale query parameters */
export interface WhaleQueryParams extends BaseQueryParams {
  chain?: Chain;
  minBalanceUsd?: string;
  activity?: string;
  token?: string;
}

/** Smart money query parameters */
export interface SmartMoneyQueryParams extends BaseQueryParams {
  chain?: Chain;
  minScore?: number;
  minWinRate?: number;
  minTrades?: number;
  token?: string;
}

/** Time range filter */
export interface TimeRange {
  from: number; // unix timestamp
  to: number;
}

/** WebSocket event types */
export enum WSEventType {
  // Subscriptions
  SUBSCRIBE = 'subscribe',
  UNSUBSCRIBE = 'unsubscribe',

  // Block events
  NEW_BLOCK = 'new_block',

  // Transaction events
  NEW_TRANSACTION = 'new_transaction',
  PENDING_TRANSACTION = 'pending_transaction',

  // Token events
  TOKEN_TRANSFER = 'token_transfer',
  NFT_TRANSFER = 'nft_transfer',
  SWAP = 'swap',

  // Whale events
  WHALE_ALERT = 'whale_alert',
  WHALE_MOVEMENT = 'whale_movement',

  // Smart money events
  SMART_MONEY_TRADE = 'smart_money_trade',

  // System events
  CONNECTION_STATUS = 'connection_status',
  ERROR = 'error',
  HEARTBEAT = 'heartbeat',
}

/** WebSocket subscription message */
export interface WSSubscription {
  event: WSEventType.SUBSCRIBE | WSEventType.UNSUBSCRIBE;
  channels: string[]; // e.g., ["ethereum:blocks", "bnb:whales"]
}

/** WebSocket message envelope */
export interface WSMessage<T = unknown> {
  event: WSEventType;
  channel: string;
  data: T;
  timestamp: number;
}

/** API error response */
export interface APIError {
  statusCode: number;
  message: string;
  error: string;
  timestamp: number;
  path: string;
}

/** API health check response */
export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  version: string;
  services: Record<string, ServiceHealth>;
}

/** Service health */
export interface ServiceHealth {
  status: 'up' | 'down';
  latency?: number;
  lastCheck: number;
  details?: Record<string, unknown>;
}
