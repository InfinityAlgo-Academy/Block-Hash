// ============================================
// Block-Hash Database — Transaction Repository
// ============================================

import { PrismaClient } from '@prisma/client';
import { Chain, NormalizedTransaction } from '@block-hash/common';

const prisma = new PrismaClient();

export class TransactionRepository {
  /** Save a transaction */
  async save(tx: NormalizedTransaction): Promise<void> {
    await prisma.transaction.upsert({
      where: { chain_hash: { chain: tx.chain, hash: tx.hash } },
      create: {
        chain: tx.chain,
        hash: tx.hash,
        blockNumber: tx.blockNumber,
        blockHash: tx.blockHash,
        fromAddress: tx.from,
        toAddress: tx.to,
        value: tx.value.toString(),
        gasPrice: tx.gasPrice?.toString() ?? null,
        maxFeePerGas: tx.maxFeePerGas?.toString() ?? null,
        maxPriorityFee: tx.maxPriorityFeePerGas?.toString() ?? null,
        gasUsed: tx.gasUsed?.toString() ?? null,
        gasLimit: tx.gasLimit?.toString() ?? null,
        nonce: tx.nonce,
        input: tx.input,
        status: tx.status,
        type: tx.type,
        timestamp: new Date(tx.timestamp * 1000),
        txIndex: tx.index,
      },
      update: {
        status: tx.status,
        type: tx.type,
        gasUsed: tx.gasUsed?.toString() ?? null,
      },
    });
  }

  /** Save multiple transactions */
  async saveBatch(txs: NormalizedTransaction[]): Promise<void> {
    if (txs.length === 0) return;

    // Use createMany for performance (skip duplicates)
    await prisma.transaction.createMany({
      data: txs.map((tx) => ({
        chain: tx.chain,
        hash: tx.hash,
        blockNumber: tx.blockNumber,
        blockHash: tx.blockHash,
        fromAddress: tx.from,
        toAddress: tx.to,
        value: tx.value.toString(),
        gasPrice: tx.gasPrice?.toString() ?? null,
        maxFeePerGas: tx.maxFeePerGas?.toString() ?? null,
        maxPriorityFee: tx.maxPriorityFeePerGas?.toString() ?? null,
        gasUsed: tx.gasUsed?.toString() ?? null,
        gasLimit: tx.gasLimit?.toString() ?? null,
        nonce: tx.nonce,
        input: tx.input,
        status: tx.status,
        type: tx.type,
        timestamp: new Date(tx.timestamp * 1000),
        txIndex: tx.index,
      })),
      skipDuplicates: true,
    });
  }

  /** Get transaction by hash */
  async getByHash(chain: Chain, hash: string) {
    return prisma.transaction.findUnique({
      where: { chain_hash: { chain, hash } },
    });
  }

  /** Get transactions for an address */
  async getByAddress(chain: Chain, address: string, options?: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = options || {};
    const where = {
      chain,
      OR: [{ fromAddress: address }, { toAddress: address }],
    };
    const [data, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  /** Get transactions by block */
  async getByBlock(chain: Chain, blockNumber: bigint) {
    return prisma.transaction.findMany({
      where: { chain, blockNumber },
      orderBy: { txIndex: 'asc' },
    });
  }

  /** Get recent transactions */
  async getRecent(chain: Chain, limit = 50) {
    return prisma.transaction.findMany({
      where: { chain },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }

  /** Get large value transactions */
  async getLargeTransactions(chain: Chain, minValueWei: string, limit = 50) {
    return prisma.transaction.findMany({
      where: {
        chain,
        value: { gte: minValueWei },
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }

  /** Count transactions for a chain in the last N hours */
  async countRecent(chain: Chain, hours = 24): Promise<number> {
    const since = new Date(Date.now() - hours * 3600 * 1000);
    return prisma.transaction.count({
      where: { chain, timestamp: { gte: since } },
    });
  }
}

export const transactionRepository = new TransactionRepository();
