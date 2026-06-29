import { Chain, NormalizedBlock, NormalizedTransaction, ProviderHealth, ConnectionState } from '@block-hash/common';

export abstract class BaseProvider {
  protected chain: Chain;
  protected state: ConnectionState = ConnectionState.DISCONNECTED;
  protected lastBlockHeight: bigint = 0n;
  protected lastChecked: number = 0;
  protected errorCount: number = 0;
  protected latency: number = 0;

  constructor(chain: Chain) {
    this.chain = chain;
  }

  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  
  abstract getBlockNumber(): Promise<bigint>;
  abstract getBlock(blockNumber: bigint): Promise<NormalizedBlock | null>;
  abstract getTransaction(txHash: string): Promise<NormalizedTransaction | null>;
  
  getHealth(): ProviderHealth {
    return {
      chain: this.chain,
      url: this.getProviderUrl(),
      state: this.state,
      latency: this.latency,
      lastBlock: this.lastBlockHeight,
      lastChecked: this.lastChecked,
      errors: this.errorCount,
    };
  }

  protected abstract getProviderUrl(): string;

  protected recordLatency(start: number) {
    this.latency = Date.now() - start;
    this.lastChecked = Date.now();
  }

  protected recordError() {
    this.errorCount++;
    this.state = ConnectionState.ERROR;
    this.lastChecked = Date.now();
  }

  protected recordSuccess() {
    this.state = ConnectionState.CONNECTED;
    this.errorCount = 0;
  }
}
