import { Module } from '@nestjs/common';
import { UserCompanionsService } from './user-companions.service';
import { UserCompanionsController } from './user-companions.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UserCompanionsController],
  providers: [PrismaService, UserCompanionsService],
  exports: [UserCompanionsService],
})
export class UserCompanionsModule {}
