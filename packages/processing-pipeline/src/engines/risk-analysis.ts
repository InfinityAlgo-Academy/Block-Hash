import { NormalizedTransaction } from '@block-hash/common';
import { walletRepository } from '@block-hash/database';

export class RiskAnalysisEngine {
    // Known malicious addresses (in a real app, this would be backed by a DB or external API)
    private blacklistedAddresses: Set<string> = new Set([
        '0x000000000000000000000000000000000000dEaD'
    ]);

    async analyzeTransaction(tx: NormalizedTransaction): Promise<number> {
        let riskScore = 0;

        // Check if from/to is blacklisted
        if (tx.from && this.blacklistedAddresses.has(tx.from.toLowerCase())) {
            riskScore += 80;
        }
        if (tx.to && this.blacklistedAddresses.has(tx.to.toLowerCase())) {
            riskScore += 80;
        }

        // Check if value is unusually high
        if (tx.value > 1000000000000000000000n) { // Example threshold
            riskScore += 20;
        }

        // Additional checks like OFAC sanctions, Tornado Cash interactions, etc.

        if (riskScore > 0) {
            // Update wallet risk level
            if (tx.from) {
                await walletRepository.upsert({
                    address: tx.from,
                    riskLevel: riskScore > 75 ? 'high' : (riskScore > 40 ? 'medium' : 'low')
                });
            }
        }

        return Math.min(riskScore, 100);
    }
}
