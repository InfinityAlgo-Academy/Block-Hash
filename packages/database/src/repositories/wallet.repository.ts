// ============================================
// Block-Hash Database — Wallet Repository
// ============================================

import { PrismaClient } from '@prisma/client';
import { WalletType } from '@block-hash/common';

const prisma = new PrismaClient();

export class WalletRepository {
  /** Upsert a wallet profile */
  async upsert(data: {
    address: string;
    label?: string;
    type?: string;
    tags?: string[];
    score?: number;
    totalValueUsd?: string;
    transactionCount?: number;
    riskLevel?: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    await prisma.wallet.upsert({
      where: { address: data.address },
      create: {
        address: data.address,
        label: data.label,
        type: data.type || WalletType.UNKNOWN,
        tags: data.tags || [],
        score: data.score || 0,
        totalValueUsd: data.totalValueUsd || '0',
        transactionCount: data.transactionCount || 0,
        riskLevel: data.riskLevel || 'low',
        metadata: data.metadata || {},
      },
      update: {
        ...(data.label !== undefined && { label: data.label }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.tags !== undefined && { tags: data.tags }),
        ...(data.score !== undefined && { score: data.score }),
        ...(data.totalValueUsd !== undefined && { totalValueUsd: data.totalValueUsd }),
        ...(data.transactionCount !== undefined && { transactionCount: data.transactionCount }),
        ...(data.riskLevel !== undefined && { riskLevel: data.riskLevel }),
        lastActive: new Date(),
      },
    });
  }

  /** Get wallet by address */
  async getByAddress(address: string) {
    return prisma.wallet.findUnique({ where: { address } });
  }

  /** Get wallets by type */
  async getByType(type: string, options?: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = options || {};
    const [data, total] = await Promise.all([
      prisma.wallet.findMany({
        where: { type },
        orderBy: { score: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.wallet.count({ where: { type } }),
    ]);
    return { data, total, page, limit };
  }

  /** Get top wallets by score */
  async getTopByScore(limit = 100) {
    return prisma.wallet.findMany({
      orderBy: { score: 'desc' },
      take: limit,
    });
  }

  /** Search wallets */
  async search(query: string, limit = 20) {
    return prisma.wallet.findMany({
      where: {
        OR: [
          { address: { contains: query, mode: 'insensitive' } },
          { label: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
    });
  }

  /** Increment transaction count */
  async incrementTxCount(address: string): Promise<void> {
    await prisma.wallet.upsert({
      where: { address },
      create: {
        address,
        transactionCount: 1,
      },
      update: {
        transactionCount: { increment: 1 },
        lastActive: new Date(),
      },
    });
  }

  /** Get whales (type = 'whale') */
  async getWhales(options?: { page?: number; limit?: number; minScore?: number }) {
    const { page = 1, limit = 50, minScore = 0 } = options || {};
    const where = {
      type: WalletType.WHALE,
      score: { gte: minScore },
    };
    const [data, total] = await Promise.all([
      prisma.wallet.findMany({
        where,
        orderBy: { score: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.wallet.count({ where }),
    ]);
    return { data, total, page, limit };
  }
}

export const walletRepository = new WalletRepository();
