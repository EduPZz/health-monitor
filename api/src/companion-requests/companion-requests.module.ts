import { Module } from '@nestjs/common';
import { CompanionRequestsService } from './companion-requests.service';
import { CompanionRequestsController } from './companion-requests.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { UserCompanionsModule } from 'src/user-companions/user-companions.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [UsersModule, UserCompanionsModule, EventsModule],
  controllers: [CompanionRequestsController],
  providers: [PrismaService, CompanionRequestsService],
})
export class CompanionRequestsModule {}
