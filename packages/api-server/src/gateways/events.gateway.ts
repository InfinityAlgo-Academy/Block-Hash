import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { pubSubService } from '@block-hash/database';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private isSubscribedToRedis = false;

  handleConnection(client: Socket) {
    console.log(`[WS Gateway] Client connected: ${client.id}`);
    this.ensureRedisSubscription();
  }

  handleDisconnect(client: Socket) {
    console.log(`[WS Gateway] Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe_chain')
  handleSubscribeChain(client: Socket, chain: string) {
    client.join(`chain:${chain}`);
    return { event: 'subscribed', data: `Subscribed to ${chain} events` };
  }
  
  @SubscribeMessage('subscribe_alerts')
  handleSubscribeAlerts(client: Socket) {
    client.join('alerts');
    return { event: 'subscribed', data: `Subscribed to global alerts` };
  }

  private async ensureRedisSubscription() {
    if (this.isSubscribedToRedis) return;
    this.isSubscribedToRedis = true;

    // Listen to Redis Pub/Sub events published by the pipeline/collectors
    
    // New Blocks
    await pubSubService.subscribe<any>('bh:events:new_block', (block) => {
      this.server.to(`chain:${block.chain}`).emit('new_block', block);
    });

    // New Transactions
    await pubSubService.subscribe<any>('bh:events:new_transaction', (tx) => {
      this.server.to(`chain:${tx.chain}`).emit('new_transaction', tx);
    });

    // Alerts (Whales, Smart Money)
    await pubSubService.subscribe<any>('bh:alerts:whale', (alert) => {
      this.server.to('alerts').emit('whale_alert', alert);
      this.server.to(`chain:${alert.chain}`).emit('whale_alert', alert);
    });
    
    console.log('[WS Gateway] Subscribed to backend Redis events');
  }
}
