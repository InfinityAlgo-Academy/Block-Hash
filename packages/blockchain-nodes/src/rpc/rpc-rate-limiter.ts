export class RpcRateLimiter {
  private maxRequests: number;
  private intervalMs: number;
  private requests: number[] = [];

  constructor(maxRequests: number, intervalMs: number = 1000) {
    this.maxRequests = maxRequests;
    this.intervalMs = intervalMs;
  }

  async acquire(): Promise<void> {
    const now = Date.now();
    this.cleanup(now);

    if (this.requests.length >= this.maxRequests) {
      const oldest = this.requests[0];
      const waitTime = this.intervalMs - (now - oldest);
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return this.acquire(); // Recursively check again after waiting
      }
    }

    this.requests.push(Date.now());
  }

  private cleanup(now: number) {
    while (this.requests.length > 0 && now - this.requests[0] > this.intervalMs) {
      this.requests.shift();
    }
  }
}
