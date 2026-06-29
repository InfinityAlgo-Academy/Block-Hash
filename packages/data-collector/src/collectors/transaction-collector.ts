import { BaseCollector } from './base-collector';
import { Chain, NormalizedTransaction } from '@block-hash/common';
import { BaseProvider } from '@block-hash/blockchain-nodes';
import { transactionRepository, pubSubService, blockRepository, insertTransactionAnalytics } from '@block-hash/database';

export class TransactionCollector extends BaseCollector {
    private lastProcessedBlock: bigint = 0n;

    constructor(chain: Chain, provider: BaseProvider, pollingIntervalMs: number = 2000) {
        super(chain, provider, pollingIntervalMs);
    }

    protected async onStart(): Promise<void> {
        const latestDbBlock = await blockRepository.getLatest(this.chain);
        if (latestDbBlock) {
            this.lastProcessedBlock = latestDbBlock.number;
        } else {
            this.lastProcessedBlock = await this.provider.getBlockNumber();
        }
        console.log(`[TxCollector - ${this.chain}] Started from block ${this.lastProcessedBlock}`);
    }

    protected async processNext(): Promise<void> {
        // Find if there are blocks we haven't processed transactions for
        const latestDbBlock = await blockRepository.getLatest(this.chain);
        if (!latestDbBlock || latestDbBlock.number <= this.lastProcessedBlock) {
            return;
        }

        const nextBlockNum = this.lastProcessedBlock + 1n;
        const block = await this.provider.getBlock(nextBlockNum);

        if (block && block.raw && (block.raw as any).transactions) {
            const txs: NormalizedTransaction[] = [];
            const analyticsRows: any[] = [];
            
            // Note: For EvmProvider this requires getBlock to include full tx objects, 
            // otherwise we'd need to fetch them individually. Assuming getBlock(num, true).
            const rawTxs = (block.raw as any).transactions;
            
            for (const rawTx of rawTxs) {
                let txHash = typeof rawTx === 'string' ? rawTx : (rawTx.hash || rawTx.txid);
                if (!txHash) continue;
                
                try {
                    // This fetches receipt too for EVM to get status/gasUsed
                    const normalizedTx = await this.provider.getTransaction(txHash);
                    
                    if (normalizedTx) {
                        normalizedTx.timestamp = Number(block.timestamp); // Assign block timestamp
                        txs.push(normalizedTx);
                        
                        // Prepare ClickHouse analytics row
                        analyticsRows.push({
                            chain: this.chain,
                            block_number: Number(normalizedTx.blockNumber),
                            tx_hash: normalizedTx.hash,
                            from_address: normalizedTx.from,
                            to_address: normalizedTx.to,
                            value: normalizedTx.value.toString(),
                            gas_price: normalizedTx.gasPrice?.toString(),
                            gas_used: normalizedTx.gasUsed?.toString(),
                            tx_type: normalizedTx.type,
                            status: normalizedTx.status,
                            timestamp: new Date(normalizedTx.timestamp * 1000).toISOString().replace('T', ' ').substring(0, 19)
                        });
                        
                        // Broadcast single tx (could be heavy, maybe batch this)
                        await pubSubService.publish('bh:events:new_transaction', normalizedTx);
                    }
                } catch (err) {
                    console.error(`[TxCollector - ${this.chain}] Error processing tx ${txHash}:`, err);
                }
            }

            if (txs.length > 0) {
                // Save to Postgres
                await transactionRepository.saveBatch(txs);
                // Save to ClickHouse
                await insertTransactionAnalytics(analyticsRows);
            }
            
            console.log(`[TxCollector - ${this.chain}] Processed ${txs.length} txs for block ${nextBlockNum}`);
            this.lastProcessedBlock = nextBlockNum;
        } else if (block) {
            this.lastProcessedBlock = nextBlockNum;
        }
    }
}
