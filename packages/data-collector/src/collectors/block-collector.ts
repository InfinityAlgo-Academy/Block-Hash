import { BaseCollector } from './base-collector';
import { Chain } from '@block-hash/common';
import { BaseProvider } from '@block-hash/blockchain-nodes';
import { blockRepository, pubSubService } from '@block-hash/database';

export class BlockCollector extends BaseCollector {
    private lastProcessedBlock: bigint = 0n;

    constructor(chain: Chain, provider: BaseProvider, pollingIntervalMs: number = 2000) {
        super(chain, provider, pollingIntervalMs);
    }

    protected async onStart(): Promise<void> {
        const latestDbBlock = await blockRepository.getLatest(this.chain);
        if (latestDbBlock) {
            this.lastProcessedBlock = latestDbBlock.number;
        } else {
            // First time run, start from current chain head
            this.lastProcessedBlock = await this.provider.getBlockNumber();
        }
        console.log(`[BlockCollector - ${this.chain}] Started from block ${this.lastProcessedBlock}`);
    }

    protected async processNext(): Promise<void> {
        const currentChainHeight = await this.provider.getBlockNumber();

        if (this.lastProcessedBlock < currentChainHeight) {
            const nextBlockNum = this.lastProcessedBlock + 1n;
            const block = await this.provider.getBlock(nextBlockNum);

            if (block) {
                // Save to DB
                await blockRepository.save(block);
                
                // Broadcast new block event via Redis Pub/Sub
                await pubSubService.publish('bh:events:new_block', block);
                
                console.log(`[BlockCollector - ${this.chain}] Processed block ${nextBlockNum}`);
                this.lastProcessedBlock = nextBlockNum;
            } else {
                console.warn(`[BlockCollector - ${this.chain}] Block ${nextBlockNum} returned null`);
            }
        }
    }
}
