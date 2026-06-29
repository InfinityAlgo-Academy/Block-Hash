import { Chain } from '@block-hash/common';
import { BaseProvider } from '@block-hash/blockchain-nodes';

export abstract class BaseCollector {
    protected chain: Chain;
    protected provider: BaseProvider;
    protected isRunning: boolean = false;
    protected intervalId: NodeJS.Timeout | null = null;
    protected pollingIntervalMs: number;

    constructor(chain: Chain, provider: BaseProvider, pollingIntervalMs: number = 2000) {
        this.chain = chain;
        this.provider = provider;
        this.pollingIntervalMs = pollingIntervalMs;
    }

    async start(): Promise<void> {
        if (this.isRunning) return;
        this.isRunning = true;
        await this.onStart();
        this.poll();
    }

    async stop(): Promise<void> {
        if (!this.isRunning) return;
        this.isRunning = false;
        if (this.intervalId) {
            clearTimeout(this.intervalId);
            this.intervalId = null;
        }
        await this.onStop();
    }

    protected async poll(): Promise<void> {
        if (!this.isRunning) return;

        try {
            await this.processNext();
        } catch (error) {
            console.error(`[Collector Error - ${this.chain}]`, error);
        } finally {
            if (this.isRunning) {
                this.intervalId = setTimeout(() => this.poll(), this.pollingIntervalMs);
            }
        }
    }

    /** Called once when collector starts */
    protected onStart(): void | Promise<void> {}

    /** Called once when collector stops */
    protected onStop(): void | Promise<void> {}

    /** The core processing logic executed on every poll interval */
    protected abstract processNext(): Promise<void>;
}
