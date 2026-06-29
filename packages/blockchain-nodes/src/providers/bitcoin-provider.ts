import { BaseProvider } from './base-provider';
import { Chain, NormalizedBlock, NormalizedTransaction, TransactionStatus, TransactionType, ConnectionState } from '@block-hash/common';
import axios, { AxiosInstance } from 'axios';

export class BitcoinProvider extends BaseProvider {
  private url: string;
  private client: AxiosInstance;

  constructor(chain: Chain, url: string) {
    super(chain);
    this.url = url;
    
    // Config values would normally come from env/config
    const user = process.env.BTC_RPC_USER || 'bitcoin';
    const password = process.env.BTC_RPC_PASSWORD || 'bitcoin_secret';

    this.client = axios.create({
      baseURL: this.url,
      auth: {
        username: user,
        password: password
      },
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

  protected getProviderUrl(): string {
    return this.url;
  }

  private async rpcCall(method: string, params: any[] = []): Promise<any> {
    const payload = {
      jsonrpc: "1.0",
      id: "block-hash",
      method: method,
      params: params
    };
    
    const response = await this.client.post('/', payload);
    if (response.data.error) {
      throw new Error(`Bitcoin RPC Error: ${JSON.stringify(response.data.error)}`);
    }
    return response.data.result;
  }

  async connect(): Promise<void> {
    this.state = ConnectionState.CONNECTING;
    try {
      const start = Date.now();
      await this.rpcCall('getblockchaininfo');
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
      const info = await this.rpcCall('getblockchaininfo');
      this.recordLatency(start);
      this.recordSuccess();
      this.lastBlockHeight = BigInt(info.blocks);
      return this.lastBlockHeight;
    } catch (error) {
      this.recordError();
      throw error;
    }
  }

  async getBlock(blockNumber: bigint): Promise<NormalizedBlock | null> {
    const start = Date.now();
    try {
      const blockHash = await this.rpcCall('getblockhash', [Number(blockNumber)]);
      if (!blockHash) return null;
      
      const block = await this.rpcCall('getblock', [blockHash, 2]); // verbosity 2 for tx details
      this.recordLatency(start);
      this.recordSuccess();
      
      if (!block) return null;

      return {
        chain: this.chain,
        number: BigInt(block.height),
        hash: block.hash,
        parentHash: block.previousblockhash || '',
        timestamp: block.time,
        nonce: block.nonce.toString(),
        miner: '', // BTC doesn't have a simple miner address in block header
        difficulty: BigInt(Math.floor(block.difficulty)),
        transactionCount: block.tx.length,
        size: block.size,
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
      const tx = await this.rpcCall('getrawtransaction', [txHash, true]);
      this.recordLatency(start);
      this.recordSuccess();
      
      if (!tx) return null;

      // Basic BTC normalization
      let value = 0n;
      for (const vout of tx.vout) {
        value += BigInt(Math.floor(vout.value * 1e8)); // Convert BTC to sats
      }

      return {
        chain: this.chain,
        hash: tx.txid,
        blockNumber: 0n, // Need to get from block context typically
        blockHash: tx.blockhash || '',
        from: tx.vin.length > 0 && tx.vin[0].txid ? tx.vin[0].txid : 'coinbase', // Simplified
        to: tx.vout.length > 0 && tx.vout[0].scriptPubKey.address ? tx.vout[0].scriptPubKey.address : null,
        value: value,
        nonce: 0,
        input: '',
        status: TransactionStatus.SUCCESS,
        type: TransactionType.TRANSFER,
        timestamp: tx.time || 0,
        index: 0,
        raw: tx,
      };
    } catch (error) {
      this.recordError();
      throw error;
    }
  }
}
