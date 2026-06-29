import { Chain, CHAIN_CONFIGS } from '@block-hash/common';
import { BaseProvider } from './providers/base-provider';
import { EvmProvider } from './providers/evm-provider';
import { BitcoinProvider } from './providers/bitcoin-provider';
import { SolanaProvider } from './providers/solana-provider';
import { TronProvider } from './providers/tron-provider';
import { RpcLoadBalancer } from './rpc/rpc-load-balancer';
import { WsManager } from './websocket/ws-manager';

export class NodeManager {
    private providers: Map<Chain, RpcLoadBalancer> = new Map();
    private wsManagers: Map<Chain, WsManager> = new Map();

    async initialize() {
        for (const [chainName, config] of Object.entries(CHAIN_CONFIGS)) {
            const chain = chainName as Chain;
            const chainProviders: BaseProvider[] = [];

            // Primary RPC
            if (config.rpcUrl) {
                chainProviders.push(this.createProvider(chain, config.rpcUrl, config.isEvm));
            }
            // Fallback RPC
            if (config.rpcUrlFallback) {
                chainProviders.push(this.createProvider(chain, config.rpcUrlFallback, config.isEvm));
            }

            if (chainProviders.length > 0) {
                const balancer = new RpcLoadBalancer(chainProviders);
                this.providers.set(chain, balancer);
                
                // Connect all providers
                for (const p of balancer.getAllProviders()) {
                    await p.connect().catch(e => console.warn(`Failed to connect to ${chain} provider:`, e.message));
                }
            }

            // WebSocket
            if (config.wsUrl) {
                const wsManager = new WsManager(chain, config.wsUrl);
                this.wsManagers.set(chain, wsManager);
                // We might not await connection here to avoid blocking startup
                wsManager.connect().catch(e => console.warn(`Failed to connect WS for ${chain}:`, e.message));
            }
        }
    }

    private createProvider(chain: Chain, url: string, isEvm: boolean): BaseProvider {
        if (isEvm) return new EvmProvider(chain, url);
        
        switch (chain) {
            case Chain.BITCOIN: return new BitcoinProvider(chain, url);
            case Chain.SOLANA: return new SolanaProvider(chain, url);
            case Chain.TRON: return new TronProvider(chain, url);
            default: throw new Error(`Unsupported chain: ${chain}`);
        }
    }

    getProvider(chain: Chain): BaseProvider {
        const balancer = this.providers.get(chain);
        if (!balancer) throw new Error(`No provider configured for chain: ${chain}`);
        return balancer.getProvider();
    }

    getWsManager(chain: Chain): WsManager | undefined {
        return this.wsManagers.get(chain);
    }
    
    async shutdown() {
        for (const balancer of this.providers.values()) {
            for (const p of balancer.getAllProviders()) {
                await p.disconnect();
            }
        }
        for (const ws of this.wsManagers.values()) {
            ws.disconnect();
        }
    }
}
