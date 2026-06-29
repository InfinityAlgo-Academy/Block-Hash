import { BaseProvider } from '../providers/base-provider';
import { ConnectionState } from '@block-hash/common';

export class RpcLoadBalancer {
  private providers: BaseProvider[];
  private currentIndex: number = 0;

  constructor(providers: BaseProvider[]) {
    if (providers.length === 0) {
      throw new Error("Cannot initialize RpcLoadBalancer with empty providers array");
    }
    this.providers = providers;
  }

  /**
   * Gets the next healthy provider using a round-robin approach.
   * If all are disconnected/error, it returns the current one and hopes for the best.
   */
  getProvider(): BaseProvider {
    const total = this.providers.length;
    let attempts = 0;

    while (attempts < total) {
      const provider = this.providers[this.currentIndex];
      this.currentIndex = (this.currentIndex + 1) % total;
      
      if (provider.getHealth().state === ConnectionState.CONNECTED) {
        return provider;
      }
      attempts++;
    }

    // Fallback: just return the next one if none are strictly 'CONNECTED'
    // It might be connecting or just failed previously.
    const fallback = this.providers[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % total;
    return fallback;
  }
  
  getAllProviders(): BaseProvider[] {
      return this.providers;
  }
}
