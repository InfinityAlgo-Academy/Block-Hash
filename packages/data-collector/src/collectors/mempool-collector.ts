import { Chain, NormalizedTransaction } from '@block-hash/common';
import { WsManager } from '@block-hash/blockchain-nodes';
import { pubSubService } from '@block-hash/database';

export class MempoolCollector {
    private chain: Chain;
    private wsManager: WsManager;
    private subscriptionId: string | null = null;
    private isRunning: boolean = false;

    constructor(chain: Chain, wsManager: WsManager) {
        this.chain = chain;
        this.wsManager = wsManager;
    }

    async start(): Promise<void> {
        if (this.isRunning) return;
        this.isRunning = true;

        // Assuming EVM 'newPendingTransactions'
        this.subscriptionId = this.wsManager.subscribe(
            'newPendingTransactions',
            [],
            (txHash: string) => this.handlePendingTx(txHash)
        );

        console.log(`[MempoolCollector - ${this.chain}] Started listening for pending txs`);
    }

    async stop(): Promise<void> {
        if (!this.isRunning) return;
        this.isRunning = false;

        if (this.subscriptionId) {
            this.wsManager.unsubscribe(this.subscriptionId);
            this.subscriptionId = null;
        }
    }

    private async handlePendingTx(txHash: string) {
        // Normally we might want to fetch the full tx details from the RPC node right away
        // But for high volume chains, just broadcasting the hash or storing it in Redis is safer.
        
        // Broadcast the pending tx hash
        await pubSubService.publish('bh:events:mempool_tx', {
            chain: this.chain,
            hash: txHash,
            timestamp: Date.now()
        });
    }
}
