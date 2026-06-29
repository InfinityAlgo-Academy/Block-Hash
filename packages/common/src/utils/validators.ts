// ============================================
// Block-Hash Common — Validators
// ============================================

import { Chain, EVM_CHAINS } from '../types/blockchain.types';

/** Validate an EVM address (0x + 40 hex chars) */
export function isValidEvmAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

/** Validate a Bitcoin address (basic check) */
export function isValidBitcoinAddress(address: string): boolean {
  // P2PKH, P2SH, Bech32, Bech32m
  return /^(1[1-9A-HJ-NP-Za-km-z]{25,34}|3[1-9A-HJ-NP-Za-km-z]{25,34}|bc1[0-9a-z]{39,59})$/.test(address);
}

/** Validate a Solana address (base58, 32-44 chars) */
export function isValidSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

/** Validate a Tron address (T + 33 base58 chars) */
export function isValidTronAddress(address: string): boolean {
  return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address);
}

/** Validate an address for a given chain */
export function isValidAddress(chain: Chain, address: string): boolean {
  if (EVM_CHAINS.includes(chain)) return isValidEvmAddress(address);

  switch (chain) {
    case Chain.BITCOIN:
      return isValidBitcoinAddress(address);
    case Chain.SOLANA:
      return isValidSolanaAddress(address);
    case Chain.TRON:
      return isValidTronAddress(address);
    default:
      return false;
  }
}

/** Validate a transaction hash (0x + 64 hex chars for EVM) */
export function isValidTxHash(hash: string): boolean {
  return /^0x[0-9a-fA-F]{64}$/.test(hash);
}

/** Validate a block number */
export function isValidBlockNumber(num: number | bigint): boolean {
  const n = typeof num === 'bigint' ? num : BigInt(num);
  return n >= 0n;
}

/** Validate pagination parameters */
export function validatePagination(page?: number, limit?: number): { page: number; limit: number } {
  const validPage = Math.max(1, Math.floor(page || 1));
  const validLimit = Math.min(100, Math.max(1, Math.floor(limit || 20)));
  return { page: validPage, limit: validLimit };
}

/** Validate a chain enum value */
export function isValidChain(chain: string): chain is Chain {
  return Object.values(Chain).includes(chain as Chain);
}

/** Sanitize and normalize an address */
export function normalizeAddress(chain: Chain, address: string): string {
  if (EVM_CHAINS.includes(chain)) {
    return address.toLowerCase();
  }
  return address; // Bitcoin, Solana, Tron addresses are case-sensitive
}
