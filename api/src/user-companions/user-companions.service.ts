import { Injectable } from '@nestjs/common';
import { CreateUserCompanionDto } from './dto/create-user-companion.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserCompanionsService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createUserCompanionDto: CreateUserCompanionDto) {
    return this.prismaService.userCompanion.create({
      data: {
        accompaniedById: createUserCompanionDto.accompaniedById,
        accompanyingId: createUserCompanionDto.accompanyingId,
      },
    });
  }

  // Find all users that the current user is accompanying (companions)
  async findCompanions(userId: number) {
    const result = await this.prismaService.userCompanion.findMany({
      where: {
        accompanyingId: userId,
      },
      include: {
        accompaniedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            birthDate: true,
            sex: true,
            createdAt: true,
          },
        },
      },
    });
    return result;
  }

  // Find all users that are accompanying the current user
  async findAccompaniedBy(userId: number) {
    return this.prismaService.userCompanion.findMany({
      where: {
        accompaniedById: userId,
      },
      include: {
        accompanying: {
          select: {
            id: true,
            name: true,
            email: true,
            birthDate: true,
            sex: true,
            createdAt: true,
          },
        },
      },
    });
  }

  findAll() {
    return `This action returns all userCompanions`;
  }

  remove(id: number) {
    return `This action removes a #${id} userCompanion`;
  }
}
