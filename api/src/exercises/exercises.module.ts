import { Module } from '@nestjs/common';
import { ExerciseService } from './exercises.service';
import { ExerciseController } from './exercises.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { EventsModule } from '../events/events.module';

@Module({
  controllers: [ExerciseController],
  providers: [ExerciseService, PrismaService],
  imports: [UsersModule, EventsModule],
})
export class ExercisesModule {}
