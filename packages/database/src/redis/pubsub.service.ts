// ============================================
// Block-Hash Database — Pub/Sub Service
// ============================================

import { getRedisPublisher, getRedisSubscriber } from './client';
import Redis from 'ioredis';

export type MessageHandler<T = any> = (data: T) => void;
type InternalHandler = (channel: string, message: string) => void;

export class PubSubService {
  private publisher: Redis;
  private subscriber: Redis;
  private handlers: Map<string, Set<InternalHandler>> = new Map();

  constructor() {
    this.publisher = getRedisPublisher();
    this.subscriber = getRedisSubscriber();

    this.subscriber.on('message', (channel: string, message: string) => {
      const channelHandlers = this.handlers.get(channel);
      if (channelHandlers) {
        for (const handler of channelHandlers) {
          try {
            handler(channel, message);
          } catch (err) {
            console.error(`[PubSub] Handler error on ${channel}:`, err);
          }
        }
      }
    });
  }

  /** Publish a message to a channel */
  async publish<T>(channel: string, data: T): Promise<void> {
    const message = JSON.stringify({
      data,
      timestamp: Date.now(),
    });
    await this.publisher.publish(channel, message);
  }

  /** Subscribe to a channel with auto-parsed typed data */
  async subscribe<T = any>(channel: string, handler: MessageHandler<T>): Promise<void> {
    const wrapped: InternalHandler = (ch, message) => {
      try {
        const parsed = PubSubService.parseMessage<T>(message);
        handler(parsed.data);
      } catch (err) {
        console.error(`[PubSub] Failed to parse message on ${channel}:`, err);
      }
    };
    if (!this.handlers.has(channel)) {
      this.handlers.set(channel, new Set());
      await this.subscriber.subscribe(channel);
    }
    this.handlers.get(channel)!.add(wrapped);
  }

  /** Unsubscribe from a channel */
  async unsubscribe(channel: string): Promise<void> {
    this.handlers.delete(channel);
    await this.subscriber.unsubscribe(channel);
  }

  /** Parse a received message */
  static parseMessage<T>(raw: string): { data: T; timestamp: number } {
    return JSON.parse(raw);
  }
}

/** Singleton pub/sub service */
export const pubSubService = new PubSubService();
