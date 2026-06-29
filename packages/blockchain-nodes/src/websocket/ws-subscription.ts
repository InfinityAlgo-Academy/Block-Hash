export interface WsSubscription<T = any> {
    id: string;
    topic: string;
    params: any[];
    handler: (data: T) => void;
}

export class WsSubscriptionManager {
    private subscriptions: Map<string, WsSubscription> = new Map();

    add(sub: WsSubscription) {
        this.subscriptions.set(sub.id, sub);
    }

    remove(id: string) {
        this.subscriptions.delete(id);
    }

    get(id: string): WsSubscription | undefined {
        return this.subscriptions.get(id);
    }

    getAll(): WsSubscription[] {
        return Array.from(this.subscriptions.values());
    }
    
    clear() {
        this.subscriptions.clear();
    }
}
