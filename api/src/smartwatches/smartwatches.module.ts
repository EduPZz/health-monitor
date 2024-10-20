import { Module } from '@nestjs/common';
import { SmartwatchesService } from './smartwatches.service';
import { SmartwatchesController } from './smartwatches.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [SmartwatchesController],
  providers: [SmartwatchesService, PrismaService],
})
export class SmartwatchesModule {}
