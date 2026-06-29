export class WsReconnect {
    private maxRetries: number;
    private retryCount: number = 0;
    private initialDelay: number;
    private maxDelay: number;

    constructor(maxRetries: number = 10, initialDelay: number = 1000, maxDelay: number = 30000) {
        this.maxRetries = maxRetries;
        this.initialDelay = initialDelay;
        this.maxDelay = maxDelay;
    }

    reset() {
        this.retryCount = 0;
    }

    async wait(): Promise<boolean> {
        if (this.retryCount >= this.maxRetries) {
            return false;
        }

        const delay = Math.min(this.initialDelay * Math.pow(2, this.retryCount), this.maxDelay);
        this.retryCount++;
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return true;
    }
}
