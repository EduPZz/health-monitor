import { Module } from '@nestjs/common';
import { MeasurementSessionsService } from './measurement-sessions.service';
import { MeasurementSessionsController } from './measurement-sessions.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [MeasurementSessionsController],
  providers: [PrismaService, MeasurementSessionsService],
})
export class MeasurementSessionsModule {}


