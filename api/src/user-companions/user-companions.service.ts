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

  findAll() {
    return `This action returns all userCompanions`;
  }

  remove(id: number) {
    return `This action removes a #${id} userCompanion`;
  }
}
