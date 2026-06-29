import { Chain, CHAIN_CONFIGS } from '@block-hash/common';
import { NodeManager } from '@block-hash/blockchain-nodes';
import { BlockCollector } from './collectors/block-collector';
import { TransactionCollector } from './collectors/transaction-collector';
import { LogCollector } from './collectors/log-collector';
import { MempoolCollector } from './collectors/mempool-collector';
import { BaseCollector } from './collectors/base-collector';

export class CollectorManager {
    private nodeManager: NodeManager;
    private collectors: Map<string, BaseCollector | MempoolCollector> = new Map();

    constructor(nodeManager: NodeManager) {
        this.nodeManager = nodeManager;
    }

    async startAll() {
        for (const [chainName, config] of Object.entries(CHAIN_CONFIGS)) {
            const chain = chainName as Chain;
            
            try {
                const provider = this.nodeManager.getProvider(chain);
                const wsManager = this.nodeManager.getWsManager(chain);

                // 1. Block Collector
                const blockCollector = new BlockCollector(chain, provider);
                this.collectors.set(`${chain}_block`, blockCollector);
                blockCollector.start().catch(console.error);

                // 2. Transaction Collector
                const txCollector = new TransactionCollector(chain, provider);
                this.collectors.set(`${chain}_tx`, txCollector);
                txCollector.start().catch(console.error);

                // 3. Log Collector (EVM only for now)
                if (config.isEvm) {
                    const logCollector = new LogCollector(chain, provider);
                    this.collectors.set(`${chain}_log`, logCollector);
                    logCollector.start().catch(console.error);
                }

                // 4. Mempool Collector (WS required)
                if (wsManager) {
                    const mempoolCollector = new MempoolCollector(chain, wsManager);
                    this.collectors.set(`${chain}_mempool`, mempoolCollector);
                    mempoolCollector.start().catch(console.error);
                }

            } catch (err) {
                console.error(`Failed to start collectors for ${chain}:`, err);
            }
        }
    }

    async stopAll() {
        for (const collector of this.collectors.values()) {
            await collector.stop();
        }
    }
}
