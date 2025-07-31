import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserCompanions(userId: number) {
    return this.prismaService.userCompanion.findMany({
      where: {
        accompaniedById: userId,
      },
      select: {
        accompanyingId: true,
      },
    });
  }
}
