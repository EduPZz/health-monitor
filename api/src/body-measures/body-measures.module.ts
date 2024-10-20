import { Module } from '@nestjs/common';
import { BodyMeasuresService } from './body-measures.service';
import { BodyMeasuresController } from './body-measures.controller';
import { UsersModule } from 'src/users/users.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [UsersModule],
  controllers: [BodyMeasuresController],
  providers: [BodyMeasuresService, PrismaService],
})
export class BodyMeasuresModule {}
