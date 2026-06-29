// ============================================
// Block-Hash Database — Token & Alert & Stats Repositories
// ============================================

import { PrismaClient } from '@prisma/client';
import { Chain, AlertCategory } from '@block-hash/common';

const prisma = new PrismaClient();

// ── Token Repository ──────────────────────

export class TokenRepository {
  async upsert(data: {
    chain: string; address: string; symbol: string; name: string;
    decimals: number; standard?: string; totalSupply?: string;
    verified?: boolean; logoUrl?: string;
  }) {
    await prisma.token.upsert({
      where: { chain_address: { chain: data.chain, address: data.address } },
      create: data,
      update: { ...data, updatedAt: new Date() },
    });
  }

  async getByAddress(chain: Chain, address: string) {
    return prisma.token.findUnique({
      where: { chain_address: { chain, address } },
    });
  }

  async search(query: string, limit = 20) {
    return prisma.token.findMany({
      where: {
        OR: [
          { symbol: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { holders: 'desc' },
      take: limit,
    });
  }

  async getTopByHolders(chain: Chain, limit = 50) {
    return prisma.token.findMany({
      where: { chain },
      orderBy: { holders: 'desc' },
      take: limit,
    });
  }

  async updateMetrics(chain: Chain, address: string, metrics: {
    holders?: number; priceUsd?: string; marketCapUsd?: string;
    volume24hUsd?: string; change24h?: number;
  }) {
    await prisma.token.update({
      where: { chain_address: { chain, address } },
      data: { ...metrics, updatedAt: new Date() },
    });
  }
}

// ── Whale Alert Repository ────────────────

export class WhaleAlertRepository {
  async save(alert: {
    chain: string; transactionHash: string; fromAddress: string;
    toAddress: string; token: string; tokenSymbol?: string;
    amount: string; amountUsd: number; alertType: string;
    severity?: string; walletLabel?: string; timestamp: Date;
  }) {
    await prisma.whaleAlert.create({ data: alert });
  }

  async saveBatch(alerts: Array<{
    chain: string; transactionHash: string; fromAddress: string;
    toAddress: string; token: string; tokenSymbol?: string;
    amount: string; amountUsd: number; alertType: string;
    severity?: string; walletLabel?: string; timestamp: Date;
  }>) {
    await prisma.whaleAlert.createMany({ data: alerts, skipDuplicates: true });
  }

  async getRecent(options?: { chain?: Chain; limit?: number; alertType?: string }) {
    const { chain, limit = 50, alertType } = options || {};
    return prisma.whaleAlert.findMany({
      where: {
        ...(chain && { chain }),
        ...(alertType && { alertType }),
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }

  async getByAddress(address: string, limit = 50) {
    return prisma.whaleAlert.findMany({
      where: {
        OR: [{ fromAddress: address }, { toAddress: address }],
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }

  async countByType(chain: Chain, hours = 24) {
    const since = new Date(Date.now() - hours * 3600 * 1000);
    return prisma.whaleAlert.groupBy({
      by: ['alertType'],
      where: { chain, timestamp: { gte: since } },
      _count: { id: true },
      _sum: { amountUsd: true },
    });
  }
}

// ── Smart Money Repository ────────────────

export class SmartMoneyRepository {
  async upsert(data: {
    address: string; score?: number; winRate?: number;
    totalTrades?: number; profitableTrades?: number;
    totalPnlUsd?: string; realizedPnlUsd?: string;
    avgRoi?: number; avgHoldingDays?: number;
    earlyAdoptionScore?: number; defiActivityScore?: number;
    holdingDurationScore?: number; diversificationScore?: number;
    recentTokens?: string[];
  }) {
    await prisma.smartMoneyProfile.upsert({
      where: { address: data.address },
      create: data,
      update: { ...data, updatedAt: new Date() },
    });
  }

  async getByAddress(address: string) {
    return prisma.smartMoneyProfile.findUnique({ where: { address } });
  }

  async getTop(limit = 100) {
    return prisma.smartMoneyProfile.findMany({
      orderBy: { score: 'desc' },
      take: limit,
    });
  }

  async getByMinScore(minScore: number, limit = 100) {
    return prisma.smartMoneyProfile.findMany({
      where: { score: { gte: minScore } },
      orderBy: { score: 'desc' },
      take: limit,
    });
  }
}

// ── Statistics Repository ─────────────────

export class StatisticsRepository {
  async save(stats: {
    chain: string; blockHeight: bigint; tps?: number;
    avgBlockTime?: number; avgGasPrice?: string;
    activeAddresses?: number; totalTx24h?: number;
    totalValue24h?: string; tvlUsd?: string; timestamp: Date;
  }) {
    await prisma.networkStat.create({ data: stats });
  }

  async getLatest(chain: Chain) {
    return prisma.networkStat.findFirst({
      where: { chain },
      orderBy: { timestamp: 'desc' },
    });
  }

  async getTimeseries(chain: Chain, hours = 24) {
    const since = new Date(Date.now() - hours * 3600 * 1000);
    return prisma.networkStat.findMany({
      where: { chain, timestamp: { gte: since } },
      orderBy: { timestamp: 'asc' },
    });
  }
}

// ── Alert Rule Repository ─────────────────

export class AlertRuleRepository {
  async create(data: {
    userId: string; name: string; categories: string[];
    chains: string[]; conditions: object; channels: object;
    cooldownMs?: number;
  }) {
    return prisma.alertRule.create({ data });
  }

  async getByUser(userId: string) {
    return prisma.alertRule.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getActive() {
    return prisma.alertRule.findMany({
      where: { enabled: true },
    });
  }

  async toggleEnabled(id: string, enabled: boolean) {
    return prisma.alertRule.update({
      where: { id },
      data: { enabled },
    });
  }

  async delete(id: string) {
    return prisma.alertRule.delete({ where: { id } });
  }
}

export const tokenRepository = new TokenRepository();
export const whaleAlertRepository = new WhaleAlertRepository();
export const smartMoneyRepository = new SmartMoneyRepository();
export const statisticsRepository = new StatisticsRepository();
export const alertRuleRepository = new AlertRuleRepository();
