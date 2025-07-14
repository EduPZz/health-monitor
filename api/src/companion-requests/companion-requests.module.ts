import { Module } from '@nestjs/common';
import { CompanionRequestsService } from './companion-requests.service';
import { CompanionRequestsController } from './companion-requests.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { UserCompanionsModule } from 'src/user-companions/user-companions.module';

@Module({
  imports: [UsersModule, UserCompanionsModule, UserCompanionsModule],
  controllers: [CompanionRequestsController],
  providers: [PrismaService, CompanionRequestsService],
})
export class CompanionRequestsModule {}
