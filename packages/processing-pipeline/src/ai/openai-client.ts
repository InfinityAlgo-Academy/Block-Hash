import OpenAI from 'openai';

export class OpenAiClient {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async generateInsight(prompt: string): Promise<string> {
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: 'You are an expert blockchain data analyst. Provide concise, actionable insights based on the provided data.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.2,
                max_tokens: 500,
            });

            return response.choices[0]?.message?.content || 'No insight generated.';
        } catch (error) {
            console.error('[OpenAiClient] Error generating insight:', error);
            return 'Insight generation failed.';
        }
    }
}

export const openAiClient = new OpenAiClient();
