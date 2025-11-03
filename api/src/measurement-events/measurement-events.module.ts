import { Module } from '@nestjs/common';
import { MeasurementEventsService } from './measurement-events.service';
import { MeasurementEventsController } from './measurement-events.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [MeasurementEventsController],
  providers: [PrismaService, MeasurementEventsService],
})
export class MeasurementEventsModule {}
