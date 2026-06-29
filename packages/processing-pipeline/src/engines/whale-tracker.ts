import { NormalizedTransaction, WalletType } from '@block-hash/common';
import { walletRepository, whaleAlertRepository, pubSubService } from '@block-hash/database';

export class WhaleTrackerEngine {
    private readonly WHALE_THRESHOLD_USD = 100_000; // Configurable

    async processTransaction(tx: NormalizedTransaction, tokenPriceUsd: number = 1, tokenSymbol: string = 'ETH') {
        // Simplified value calculation (assuming tx.value is in native tokens, scaled by 1e18)
        const valueNum = Number(tx.value) / 1e18; 
        const amountUsd = valueNum * tokenPriceUsd;

        if (amountUsd >= this.WHALE_THRESHOLD_USD) {
            await this.handleWhaleMovement(tx, amountUsd, tokenSymbol);
        }
    }

    private async handleWhaleMovement(tx: NormalizedTransaction, amountUsd: number, tokenSymbol: string) {
        let alertType = 'LARGE_TRANSFER';
        
        // 1. Update wallet repositories (mark as whale)
        if (tx.from) {
            await walletRepository.upsert({
                address: tx.from,
                type: WalletType.WHALE,
                tags: ['whale', `large_sender_${tx.chain}`],
            });
        }
        if (tx.to) {
            await walletRepository.upsert({
                address: tx.to,
                type: WalletType.WHALE,
                tags: ['whale', `large_receiver_${tx.chain}`],
            });
        }

        // 2. Simple classification logic (normally involves CEX address lists)
        // if (isCex(tx.to)) alertType = 'DUMP_WARNING';
        // if (isCex(tx.from)) alertType = 'ACCUMULATION';

        const severity = amountUsd > 1_000_000 ? 'HIGH' : (amountUsd > 500_000 ? 'MEDIUM' : 'LOW');

        const alert = {
            chain: tx.chain,
            transactionHash: tx.hash,
            fromAddress: tx.from,
            toAddress: tx.to || '',
            token: 'native',
            tokenSymbol: tokenSymbol,
            amount: tx.value.toString(),
            amountUsd,
            alertType,
            severity,
            timestamp: new Date(tx.timestamp * 1000)
        };

        // 3. Save alert
        await whaleAlertRepository.save(alert);

        // 4. Broadcast real-time alert
        await pubSubService.publish('bh:alerts:whale', alert);
        console.log(`[WhaleTracker] Alert generated on ${tx.chain}: $${amountUsd.toFixed(2)} transfer`);
    }
}
