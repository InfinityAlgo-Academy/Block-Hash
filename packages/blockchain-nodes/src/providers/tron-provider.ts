import { BaseProvider } from './base-provider';
import { Chain, NormalizedBlock, NormalizedTransaction, TransactionStatus, TransactionType, ConnectionState } from '@block-hash/common';

// Note: Using dynamic import or any for tronweb as its types can be tricky
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const require: any;
const TronWeb = require('tronweb');

export class TronProvider extends BaseProvider {
  private url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private tronWeb: any;

  constructor(chain: Chain, url: string) {
    super(chain);
    this.url = url;
    const apiKey = process.env.TRON_API_KEY;
    
    this.tronWeb = new TronWeb({
        fullHost: url,
        headers: apiKey ? { "TRON-PRO-API-KEY": apiKey } : {}
    });
  }

  protected getProviderUrl(): string {
    return this.url;
  }

  async connect(): Promise<void> {
    this.state = ConnectionState.CONNECTING;
    try {
      const start = Date.now();
      await this.tronWeb.trx.getCurrentBlock();
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
      const block = await this.tronWeb.trx.getCurrentBlock();
      this.recordLatency(start);
      this.recordSuccess();
      this.lastBlockHeight = BigInt(block.block_header.raw_data.number);
      return this.lastBlockHeight;
    } catch (error) {
      this.recordError();
      throw error;
    }
  }

  async getBlock(blockNumber: bigint): Promise<NormalizedBlock | null> {
    const start = Date.now();
    try {
      const block = await this.tronWeb.trx.getBlockByNumber(Number(blockNumber));
      this.recordLatency(start);
      this.recordSuccess();
      
      if (!block) return null;

      return {
        chain: this.chain,
        number: BigInt(block.block_header.raw_data.number),
        hash: block.blockID,
        parentHash: block.block_header.raw_data.parentHash,
        timestamp: Math.floor(block.block_header.raw_data.timestamp / 1000),
        nonce: '',
        miner: this.tronWeb.address.fromHex(block.block_header.raw_data.witness_address),
        transactionCount: block.transactions ? block.transactions.length : 0,
        size: 0, // Not provided directly
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
      const [tx, info] = await Promise.all([
        this.tronWeb.trx.getTransaction(txHash),
        this.tronWeb.trx.getTransactionInfo(txHash)
      ]);
      
      this.recordLatency(start);
      this.recordSuccess();
      
      if (!tx) return null;

      const contract = tx.raw_data.contract[0];
      let from = '';
      let to = null;
      let value = 0n;

      if (contract.type === 'TransferContract') {
          from = this.tronWeb.address.fromHex(contract.parameter.value.owner_address);
          to = this.tronWeb.address.fromHex(contract.parameter.value.to_address);
          value = BigInt(contract.parameter.value.amount || 0);
      } else if (contract.type === 'TriggerSmartContract') {
          from = this.tronWeb.address.fromHex(contract.parameter.value.owner_address);
          to = this.tronWeb.address.fromHex(contract.parameter.value.contract_address);
      }

      return {
        chain: this.chain,
        hash: txHash,
        blockNumber: BigInt(info ? info.blockNumber : 0),
        blockHash: '',
        from: from,
        to: to,
        value: value,
        gasUsed: BigInt(info ? info.fee || 0 : 0),
        nonce: 0,
        input: contract.parameter.value.data || '',
        status: info && info.receipt && info.receipt.result === 'SUCCESS' ? TransactionStatus.SUCCESS : (info ? TransactionStatus.FAILED : TransactionStatus.PENDING),
        type: contract.type === 'TransferContract' ? TransactionType.TRANSFER : TransactionType.UNKNOWN,
        timestamp: tx.raw_data.timestamp ? Math.floor(tx.raw_data.timestamp / 1000) : 0,
        index: 0,
        raw: { tx, info },
      };
    } catch (error) {
      this.recordError();
      throw error;
    }
  }
}
