// ============================================
// Block-Hash Common — Formatters
// ============================================

import { Chain } from '../types/blockchain.types';
import { CHAIN_CONFIGS } from '../constants/chains';

/**
 * Convert wei (bigint) to a human-readable decimal string.
 */
export function formatUnits(value: bigint, decimals: number): string {
  const str = value.toString();
  if (decimals === 0) return str;

  const padded = str.padStart(decimals + 1, '0');
  const intPart = padded.slice(0, padded.length - decimals) || '0';
  const fracPart = padded.slice(padded.length - decimals).replace(/0+$/, '');

  return fracPart ? `${intPart}.${fracPart}` : intPart;
}

/**
 * Convert a decimal string to the smallest unit (bigint).
 */
export function parseUnits(value: string, decimals: number): bigint {
  const [intPart, fracPart = ''] = value.split('.');
  const paddedFrac = fracPart.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(intPart + paddedFrac);
}

/**
 * Format native currency value for a chain.
 */
export function formatNativeValue(chain: Chain, value: bigint): string {
  const config = CHAIN_CONFIGS[chain];
  return `${formatUnits(value, config.decimals)} ${config.symbol}`;
}

/**
 * Shorten an address for display: 0x1234...abcd
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Shorten a transaction hash for display.
 */
export function shortenTxHash(hash: string, chars = 6): string {
  if (!hash) return '';
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

/**
 * Format large USD values: $1.23M, $4.56B, etc.
 */
export function formatUsdValue(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '$0';

  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(2)}K`;
  if (num >= 1) return `$${num.toFixed(2)}`;
  if (num > 0) return `$${num.toFixed(6)}`;
  return '$0';
}

/**
 * Format a timestamp to a relative time string.
 */
export function timeAgo(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - (timestamp < 1e12 ? timestamp * 1000 : timestamp);
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  const diffMonth = Math.floor(diffDay / 30);
  return `${diffMonth}mo ago`;
}

/**
 * Format number with comma separators.
 */
export function formatNumber(num: number | bigint): string {
  return num.toLocaleString('en-US');
}

/**
 * Format percentage.
 */
export function formatPercent(value: number, decimals = 2): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Convert hex string to bigint safely.
 */
export function hexToBigInt(hex: string): bigint {
  if (!hex || hex === '0x') return 0n;
  return BigInt(hex);
}

/**
 * Build explorer URL for a transaction.
 */
export function getExplorerTxUrl(chain: Chain, txHash: string): string {
  const config = CHAIN_CONFIGS[chain];
  return `${config.explorerUrl}/tx/${txHash}`;
}

/**
 * Build explorer URL for an address.
 */
export function getExplorerAddressUrl(chain: Chain, address: string): string {
  const config = CHAIN_CONFIGS[chain];
  return `${config.explorerUrl}/address/${address}`;
}
