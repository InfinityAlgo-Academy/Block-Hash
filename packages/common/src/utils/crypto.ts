// ============================================
// Block-Hash Common — Crypto Utilities
// ============================================

import { createHash } from 'crypto';

/**
 * Compute keccak256 (SHA3-256) hash of a hex string.
 * Note: For production, use ethers.js keccak256 for EVM compatibility.
 */
export function sha256(data: string | Buffer): string {
  const input = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
  return '0x' + createHash('sha256').update(input).digest('hex');
}

/**
 * Generate a deterministic ID from chain + address.
 */
export function generateAddressId(chain: string, address: string): string {
  return sha256(`${chain}:${address.toLowerCase()}`);
}

/**
 * Generate a unique event ID.
 */
export function generateEventId(
  chain: string,
  txHash: string,
  logIndex: number
): string {
  return sha256(`${chain}:${txHash}:${logIndex}`);
}

/**
 * Encode a topic as a padded 32-byte hex string (for address topics).
 */
export function encodeAddressTopic(address: string): string {
  const clean = address.replace('0x', '').toLowerCase();
  return '0x' + clean.padStart(64, '0');
}

/**
 * Decode an address from a padded 32-byte topic.
 */
export function decodeAddressTopic(topic: string): string {
  const clean = topic.replace('0x', '');
  return '0x' + clean.slice(24).toLowerCase();
}

/**
 * Convert a string to bytes32 hex.
 */
export function stringToBytes32(str: string): string {
  const hex = Buffer.from(str, 'utf-8').toString('hex');
  return '0x' + hex.padEnd(64, '0');
}

/**
 * Sleep utility for delays.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff.
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    factor?: number;
  } = {}
): Promise<T> {
  const { maxRetries = 3, initialDelay = 1000, maxDelay = 30000, factor = 2 } = options;

  let lastError: Error | undefined;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt === maxRetries) break;

      await sleep(delay);
      delay = Math.min(delay * factor, maxDelay);
    }
  }

  throw lastError;
}

/**
 * Chunk an array into smaller arrays.
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * Create a deferred promise.
 */
export function createDeferred<T>(): {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
} {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
