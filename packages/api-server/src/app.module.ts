import { Module } from '@nestjs/common';
import { AnalyticsController } from './controllers/analytics.controller';
import { WalletController } from './controllers/wallet.controller';
import { EventsGateway } from './gateways/events.gateway';

@Module({
  imports: [],
  controllers: [AnalyticsController, WalletController],
  providers: [EventsGateway],
})
export class AppModule {}
