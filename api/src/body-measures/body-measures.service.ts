import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBodyMeasureDto } from './dto/create-body-measure.dto';
import { UpdateBodyMeasureDto } from './dto/update-body-measure.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BodyMeasuresService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  private async validateBodyMeasureOwnership(id: number, userId: number) {
    const bodyMeasure = await this.prisma.bodyMeasure.findFirst({
      where: { id, userId },
    });

    if (!bodyMeasure) {
      throw new NotFoundException('Body measure not found or not authorized');
    }

    return bodyMeasure;
  }

  async create(createBodyMeasureDto: CreateBodyMeasureDto, userId: number) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.prisma.bodyMeasure.create({
      data: { ...createBodyMeasureDto, userId },
    });
  }

  findByUserId(userId: number) {
    return this.prisma.bodyMeasure.findMany({ where: { userId } });
  }

  findOne(id: number, userId: number) {
    return this.validateBodyMeasureOwnership(id, userId);
  }

  async update(
    id: number,
    userId: number,
    updateBodyMeasureDto: UpdateBodyMeasureDto,
  ) {
    await this.validateBodyMeasureOwnership(id, userId);

    return this.prisma.bodyMeasure.update({
      data: updateBodyMeasureDto,
      where: { id },
    });
  }

  async remove(id: number, userId: number) {
    await this.validateBodyMeasureOwnership(id, userId);

    await this.prisma.bodyMeasure.delete({
      where: { id },
    });
  }
}
