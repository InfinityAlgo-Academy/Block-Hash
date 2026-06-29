// ============================================
// Block-Hash Database — Block Repository
// ============================================

import { PrismaClient } from '@prisma/client';
import { Chain, NormalizedBlock } from '@block-hash/common';

const prisma = new PrismaClient();

export class BlockRepository {
  /** Save a block */
  async save(block: NormalizedBlock): Promise<void> {
    await prisma.block.upsert({
      where: { chain_hash: { chain: block.chain, hash: block.hash } },
      create: {
        chain: block.chain,
        number: block.number,
        hash: block.hash,
        parentHash: block.parentHash,
        timestamp: new Date(block.timestamp * 1000),
        nonce: block.nonce,
        miner: block.miner,
        gasUsed: block.gasUsed ?? null,
        gasLimit: block.gasLimit ?? null,
        baseFeePerGas: block.baseFeePerGas ?? null,
        transactionCount: block.transactionCount,
        size: block.size,
      },
      update: {
        transactionCount: block.transactionCount,
      },
    });
  }

  /** Save multiple blocks */
  async saveBatch(blocks: NormalizedBlock[]): Promise<void> {
    const operations = blocks.map((block) =>
      prisma.block.upsert({
        where: { chain_hash: { chain: block.chain, hash: block.hash } },
        create: {
          chain: block.chain,
          number: block.number,
          hash: block.hash,
          parentHash: block.parentHash,
          timestamp: new Date(block.timestamp * 1000),
          nonce: block.nonce,
          miner: block.miner,
          gasUsed: block.gasUsed ?? null,
          gasLimit: block.gasLimit ?? null,
          baseFeePerGas: block.baseFeePerGas ?? null,
          transactionCount: block.transactionCount,
          size: block.size,
        },
        update: {},
      })
    );
    await prisma.$transaction(operations);
  }

  /** Get latest block for a chain */
  async getLatest(chain: Chain) {
    return prisma.block.findFirst({
      where: { chain },
      orderBy: { number: 'desc' },
    });
  }

  /** Get block by number */
  async getByNumber(chain: Chain, number: bigint) {
    return prisma.block.findFirst({
      where: { chain, number },
    });
  }

  /** Get block by hash */
  async getByHash(chain: Chain, hash: string) {
    return prisma.block.findUnique({
      where: { chain_hash: { chain, hash } },
    });
  }

  /** Get blocks in a range */
  async getRange(chain: Chain, from: bigint, to: bigint) {
    return prisma.block.findMany({
      where: {
        chain,
        number: { gte: from, lte: to },
      },
      orderBy: { number: 'asc' },
    });
  }

  /** Count blocks for a chain */
  async count(chain: Chain): Promise<number> {
    return prisma.block.count({ where: { chain } });
  }
}

export const blockRepository = new BlockRepository();
