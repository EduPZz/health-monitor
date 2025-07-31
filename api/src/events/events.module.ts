import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsGateway } from './events.gateway';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  exports: [EventsGateway],
  imports: [AuthModule, PrismaModule],
  providers: [EventsGateway, EventsService],
})
export class EventsModule {}
