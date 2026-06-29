import WebSocket from 'ws';
import { WsReconnect } from './ws-reconnect';
import { WsSubscriptionManager, WsSubscription } from './ws-subscription';
import { Chain } from '@block-hash/common';

export class WsManager {
    private ws: WebSocket | null = null;
    private url: string;
    private chain: Chain;
    private reconnectLogic: WsReconnect;
    private subManager: WsSubscriptionManager;
    private isConnected: boolean = false;
    private pingInterval: NodeJS.Timeout | null = null;

    constructor(chain: Chain, url: string) {
        this.chain = chain;
        this.url = url;
        this.reconnectLogic = new WsReconnect();
        this.subManager = new WsSubscriptionManager();
    }

    async connect(): Promise<void> {
        if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
            return;
        }

        return new Promise((resolve, reject) => {
            console.log(`[WS] Connecting to ${this.chain} at ${this.url}`);
            this.ws = new WebSocket(this.url);

            this.ws.on('open', () => {
                console.log(`[WS] Connected to ${this.chain}`);
                this.isConnected = true;
                this.reconnectLogic.reset();
                this.setupPing();
                this.resubscribeAll();
                resolve();
            });

            this.ws.on('message', (data: WebSocket.Data) => {
                this.handleMessage(data);
            });

            this.ws.on('close', async () => {
                console.log(`[WS] Disconnected from ${this.chain}`);
                this.isConnected = false;
                this.cleanup();
                
                const shouldReconnect = await this.reconnectLogic.wait();
                if (shouldReconnect) {
                    this.connect().catch(console.error);
                } else {
                    console.error(`[WS] Max retries reached for ${this.chain}`);
                }
            });

            this.ws.on('error', (err) => {
                console.error(`[WS] Error on ${this.chain}:`, err.message);
                if (!this.isConnected) {
                    reject(err);
                }
            });
        });
    }

    disconnect() {
        this.cleanup();
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    subscribe(topic: string, params: any[], handler: (data: any) => void): string {
        const id = `${topic}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.subManager.add({ id, topic, params, handler });
        this.sendSubscribeRequest(topic, params, id);
        return id;
    }

    unsubscribe(id: string) {
        const sub = this.subManager.get(id);
        if (sub) {
            // Send unsubscribe logic based on chain (EVM specific typically requires the subscription ID returned from provider)
            // This is a simplified version.
            this.subManager.remove(id);
        }
    }

    private sendSubscribeRequest(topic: string, params: any[], internalId: string) {
        if (!this.isConnected || !this.ws) return;

        // Basic EVM JSON-RPC subscription format
        const payload = {
            jsonrpc: "2.0",
            id: internalId,
            method: "eth_subscribe",
            params: [topic, ...params]
        };
        this.ws.send(JSON.stringify(payload));
    }

    private resubscribeAll() {
        for (const sub of this.subManager.getAll()) {
            this.sendSubscribeRequest(sub.topic, sub.params, sub.id);
        }
    }

    private handleMessage(data: WebSocket.Data) {
        try {
            const parsed = JSON.parse(data.toString());
            // Map the incoming message to the correct subscription handler
            // EVM subscriptions return data with a 'subscription' ID in the 'params' object
            if (parsed.method === 'eth_subscription' && parsed.params) {
                // In a real implementation, we need to map the provider's subscription ID back to our internal handler
                // For simplicity here, we assume one global handler per topic or just broadcast
                console.debug(`[WS] Received data on ${this.chain}`);
            }
        } catch (e) {
            console.error(`[WS] Parse error on ${this.chain}:`, e);
        }
    }

    private setupPing() {
        if (this.pingInterval) clearInterval(this.pingInterval);
        this.pingInterval = setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.ping();
            }
        }, 30000);
    }

    private cleanup() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }
}
