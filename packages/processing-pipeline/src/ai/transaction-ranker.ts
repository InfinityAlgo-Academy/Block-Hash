import { NormalizedTransaction } from '@block-hash/common';
import { openAiClient } from './openai-client';

export class TransactionRanker {
    async rankTransactions(transactions: NormalizedTransaction[]): Promise<any> {
        if (transactions.length === 0) return null;

        // Simplify txs for prompt context limit
        const txSummaries = transactions.map(tx => ({
            hash: tx.hash,
            chain: tx.chain,
            from: tx.from,
            to: tx.to,
            value: tx.value.toString()
        }));

        const prompt = `
        Analyze the following recent high-value blockchain transactions. 
        Rank the top 3 most interesting or anomalous transactions.
        Return the response as a JSON array of objects with keys: "hash", "reasoning", "significanceScore" (1-10).

        Transactions:
        ${JSON.stringify(txSummaries, null, 2)}
        `;

        try {
            const responseText = await openAiClient.generateInsight(prompt);
            // Parse JSON response (assuming model follows instructions, in prod use function calling or strict JSON mode)
            const jsonMatch = responseText.match(/\[.*\]/s);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return null;
        } catch (error) {
            console.error('[TransactionRanker] Error ranking transactions:', error);
            return null;
        }
    }
}
