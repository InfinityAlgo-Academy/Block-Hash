import { BaseCollector } from './base-collector';
import { Chain } from '@block-hash/common';
import { BaseProvider } from '@block-hash/blockchain-nodes';
import { blockRepository, pubSubService } from '@block-hash/database';

export class LogCollector extends BaseCollector {
    private lastProcessedBlock: bigint = 0n;

    constructor(chain: Chain, provider: BaseProvider, pollingIntervalMs: number = 2000) {
        super(chain, provider, pollingIntervalMs);
    }

    protected async onStart(): Promise<void> {
        // Find latest processed block from somewhere (or reuse block repository's)
        const latestDbBlock = await blockRepository.getLatest(this.chain);
        if (latestDbBlock) {
            this.lastProcessedBlock = latestDbBlock.number;
        } else {
            this.lastProcessedBlock = await this.provider.getBlockNumber();
        }
        console.log(`[LogCollector - ${this.chain}] Started from block ${this.lastProcessedBlock}`);
    }

    protected async processNext(): Promise<void> {
        // Usually, LogCollector fetches getLogs for the new blocks.
        // For EVM: provider.getLogs({ fromBlock, toBlock })
        // Note: BaseProvider currently lacks a specific getLogs method as it abstracts non-EVM chains too.
        // In a real implementation, we would typecast to EvmProvider or add getLogs to BaseProvider.

        const latestDbBlock = await blockRepository.getLatest(this.chain);
        if (!latestDbBlock || latestDbBlock.number <= this.lastProcessedBlock) {
            return;
        }

        const nextBlockNum = this.lastProcessedBlock + 1n;
        
        try {
            // Pseudo-code for getting logs if it's an EVM provider:
            // if (this.provider instanceof EvmProvider) {
            //    const logs = await this.provider.getLogs({ fromBlock: nextBlockNum, toBlock: nextBlockNum });
            //    publish('bh:events:new_logs', logs)
            // }

            // console.log(`[LogCollector - ${this.chain}] Processed logs for block ${nextBlockNum}`);
            this.lastProcessedBlock = nextBlockNum;
        } catch (err) {
            console.error(`[LogCollector - ${this.chain}] Error processing logs for block ${nextBlockNum}:`, err);
        }
    }
}
