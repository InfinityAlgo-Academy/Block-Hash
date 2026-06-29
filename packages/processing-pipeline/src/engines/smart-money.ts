import { NormalizedTransaction, WalletType } from '@block-hash/common';
import { smartMoneyRepository, walletRepository, pubSubService } from '@block-hash/database';

export class SmartMoneyEngine {
    
    async processTrade(tx: NormalizedTransaction, tradeDetails: { isBuy: boolean, tokenOut: string, tokenIn: string, profitUsd?: number }) {
        // This engine would normally listen to DEX trades specifically
        
        const trader = tx.from;
        if (!trader) return;

        // Fetch or create profile
        let profile = await smartMoneyRepository.getByAddress(trader);
        if (!profile) {
            await smartMoneyRepository.upsert({ address: trader, score: 0 });
            profile = await smartMoneyRepository.getByAddress(trader);
        }

        // Update basic metrics
        const totalTrades = (profile?.totalTrades || 0) + 1;
        let profitableTrades = profile?.profitableTrades || 0;
        
        if (tradeDetails.profitUsd && tradeDetails.profitUsd > 0) {
            profitableTrades++;
        }

        const winRate = totalTrades > 0 ? profitableTrades / totalTrades : 0;
        
        // Simple scoring mechanism
        const score = Math.floor(winRate * 100) + (totalTrades > 10 ? 20 : 0);

        await smartMoneyRepository.upsert({
            address: trader,
            totalTrades,
            profitableTrades,
            winRate,
            score
        });

        // If score is high enough, tag wallet as smart money
        if (score >= 80 && totalTrades > 5) {
            await walletRepository.upsert({
                address: trader,
                type: WalletType.SMART_MONEY,
                tags: ['high_win_rate', 'dex_trader']
            });

            await pubSubService.publish('bh:alerts:smart_money_activity', {
                chain: tx.chain,
                trader,
                txHash: tx.hash,
                score
            });
        }
    }
}
