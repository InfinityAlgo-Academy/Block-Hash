import { BaseProvider } from './base-provider';
import { Chain, NormalizedBlock, NormalizedTransaction, TransactionStatus, TransactionType, ConnectionState } from '@block-hash/common';
import { Connection, PublicKey } from '@solana/web3.js';

export class SolanaProvider extends BaseProvider {
  private connection: Connection;
  private url: string;

  constructor(chain: Chain, url: string, wsUrl?: string) {
    super(chain);
    this.url = url;
    this.connection = new Connection(url, {
      wsEndpoint: wsUrl,
      commitment: 'confirmed'
    });
  }

  protected getProviderUrl(): string {
    return this.url;
  }

  async connect(): Promise<void> {
    this.state = ConnectionState.CONNECTING;
    try {
      const start = Date.now();
      await this.connection.getSlot();
      this.recordLatency(start);
      this.recordSuccess();
    } catch (error) {
      this.recordError();
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.state = ConnectionState.DISCONNECTED;
  }

  async getBlockNumber(): Promise<bigint> {
    const start = Date.now();
    try {
      const slot = await this.connection.getSlot();
      this.recordLatency(start);
      this.recordSuccess();
      this.lastBlockHeight = BigInt(slot);
      return this.lastBlockHeight;
    } catch (error) {
      this.recordError();
      throw error;
    }
  }

  async getBlock(blockNumber: bigint): Promise<NormalizedBlock | null> {
    const start = Date.now();
    try {
      const block = await this.connection.getBlock(Number(blockNumber), { maxSupportedTransactionVersion: 0 });
      this.recordLatency(start);
      this.recordSuccess();
      
      if (!block) return null;

      return {
        chain: this.chain,
        number: blockNumber,
        hash: block.blockhash,
        parentHash: block.previousBlockhash,
        timestamp: block.blockTime || 0,
        nonce: '',
        miner: '', // Leader info can be retrieved but not natively in getBlock
        transactionCount: block.transactions.length,
        size: 0, // Solana block size is not natively returned here
        raw: block,
      };
    } catch (error) {
      this.recordError();
      throw error;
    }
  }

  async getTransaction(txHash: string): Promise<NormalizedTransaction | null> {
    const start = Date.now();
    try {
      const tx = await this.connection.getTransaction(txHash, { maxSupportedTransactionVersion: 0 });
      this.recordLatency(start);
      this.recordSuccess();
      
      if (!tx || !tx.meta || !tx.transaction) return null;

      // Simplistic Solana normalization (needs proper instruction parsing for advanced analytics)
      const accounts = tx.transaction.message.getAccountKeys({ accountKeysFromLookups: tx.meta.loadedAddresses });
      const feePayer = accounts.get(0)?.toBase58() || '';

      return {
        chain: this.chain,
        hash: txHash,
        blockNumber: BigInt(tx.slot),
        blockHash: '', // Not in tx response natively
        from: feePayer,
        to: null, 
        value: 0n, // Need to parse pre/post balances for SOL transfers
        gasUsed: BigInt(tx.meta.fee),
        nonce: 0,
        input: '',
        status: tx.meta.err === null ? TransactionStatus.SUCCESS : TransactionStatus.FAILED,
        type: TransactionType.UNKNOWN,
        timestamp: tx.blockTime || 0,
        index: 0,
        raw: tx,
      };
    } catch (error) {
      this.recordError();
      throw error;
    }
  }
}
