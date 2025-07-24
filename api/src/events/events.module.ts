import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsGateway } from './events.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  exports: [EventsGateway],
  imports: [AuthModule],
  providers: [EventsGateway, EventsService],
})
export class EventsModule {}
