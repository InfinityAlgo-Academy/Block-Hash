import { pubSubService } from '@block-hash/database';
import { WhaleTrackerEngine } from './engines/whale-tracker';
import { SmartMoneyEngine } from './engines/smart-money';
import { NormalizedTransaction } from '@block-hash/common';

export class PipelineManager {
    private whaleTracker: WhaleTrackerEngine;
    private smartMoney: SmartMoneyEngine;
    private isRunning: boolean = false;

    constructor() {
        this.whaleTracker = new WhaleTrackerEngine();
        this.smartMoney = new SmartMoneyEngine();
    }

    async start() {
        if (this.isRunning) return;
        this.isRunning = true;

        // Subscribe to new transactions published by the data-collector
        await pubSubService.subscribe<NormalizedTransaction>('bh:events:new_transaction', async (tx) => {
            try {
                // Route to engines
                await this.whaleTracker.processTransaction(tx);
                
                // If it's a DEX trade, we would route to SmartMoneyEngine
                // (Requires tx decoding which happens before this step or here)
                if (tx.input && tx.input.length > 2) {
                    // await this.smartMoney.processTrade(tx, details);
                }
            } catch (err) {
                console.error(`[PipelineManager] Error processing tx ${tx.hash}:`, err);
            }
        });

        console.log('[PipelineManager] Started processing engines');
    }

    async stop() {
        this.isRunning = false;
        await pubSubService.unsubscribe('bh:events:new_transaction');
        console.log('[PipelineManager] Stopped processing engines');
    }
}
