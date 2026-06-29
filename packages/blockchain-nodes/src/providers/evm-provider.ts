import { BaseProvider } from './base-provider';
import { Chain, NormalizedBlock, NormalizedTransaction, TransactionStatus, TransactionType } from '@block-hash/common';
import { JsonRpcProvider, Block, TransactionResponse, TransactionReceipt } from 'ethers';

export class EvmProvider extends BaseProvider {
  private provider: JsonRpcProvider;
  private url: string;

  constructor(chain: Chain, url: string) {
    super(chain);
    this.url = url;
    this.provider = new JsonRpcProvider(this.url, undefined, { staticNetwork: true });
  }

  protected getProviderUrl(): string {
    return this.url;
  }

  async connect(): Promise<void> {
    this.state = ConnectionState.CONNECTING;
    try {
      const start = Date.now();
      await this.provider.getNetwork();
      this.recordLatency(start);
      this.recordSuccess();
    } catch (error) {
      this.recordError();
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.state = ConnectionState.DISCONNECTED;
    // JsonRpcProvider doesn't need explicit disconnect, but we update state
  }

  async getBlockNumber(): Promise<bigint> {
    const start = Date.now();
    try {
      const num = await this.provider.getBlockNumber();
      this.recordLatency(start);
      this.recordSuccess();
      this.lastBlockHeight = BigInt(num);
      return this.lastBlockHeight;
    } catch (error) {
      this.recordError();
      throw error;
    }
  }

  async getBlock(blockNumber: bigint): Promise<NormalizedBlock | null> {
    const start = Date.now();
    try {
      const block = await this.provider.getBlock(Number(blockNumber), true);
      this.recordLatency(start);
      this.recordSuccess();
      
      if (!block) return null;

      return this.normalizeBlock(block);
    } catch (error) {
      this.recordError();
      throw error;
    }
  }

  async getTransaction(txHash: string): Promise<NormalizedTransaction | null> {
    const start = Date.now();
    try {
      const [tx, receipt] = await Promise.all([
        this.provider.getTransaction(txHash),
        this.provider.getTransactionReceipt(txHash)
      ]);
      
      this.recordLatency(start);
      this.recordSuccess();
      
      if (!tx || !receipt) return null;

      return this.normalizeTransaction(tx, receipt);
    } catch (error) {
      this.recordError();
      throw error;
    }
  }

  private normalizeBlock(block: Block): NormalizedBlock {
    return {
      chain: this.chain,
      number: BigInt(block.number),
      hash: block.hash || '',
      parentHash: block.parentHash,
      timestamp: block.timestamp,
      nonce: block.nonce,
      miner: block.miner,
      difficulty: block.difficulty,
      gasUsed: block.gasUsed,
      gasLimit: block.gasLimit,
      baseFeePerGas: block.baseFeePerGas || undefined,
      transactionCount: block.transactions.length,
      size: block.length,
      extraData: block.extraData,
      raw: block,
    };
  }

  private normalizeTransaction(tx: TransactionResponse, receipt: TransactionReceipt): NormalizedTransaction {
    // This is a basic normalization. Specific typing like SWAP, BRIDGE etc. will be done in processing-pipeline classifiers.
    return {
      chain: this.chain,
      hash: tx.hash,
      blockNumber: BigInt(tx.blockNumber || 0),
      blockHash: tx.blockHash || '',
      from: tx.from,
      to: tx.to || null, // null if contract creation
      value: tx.value,
      gasPrice: tx.gasPrice,
      maxFeePerGas: tx.maxFeePerGas || undefined,
      maxPriorityFeePerGas: tx.maxPriorityFeePerGas || undefined,
      gasUsed: receipt.gasUsed,
      gasLimit: tx.gasLimit,
      nonce: tx.nonce,
      input: tx.data,
      status: receipt.status === 1 ? TransactionStatus.SUCCESS : (receipt.status === 0 ? TransactionStatus.FAILED : TransactionStatus.PENDING),
      type: tx.to ? TransactionType.UNKNOWN : TransactionType.CONTRACT_CREATION,
      timestamp: 0, // This needs to be populated by joining with block timestamp in collector
      index: receipt.index,
      raw: { tx, receipt },
    };
  }
}
