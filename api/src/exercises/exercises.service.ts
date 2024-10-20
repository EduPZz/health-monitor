import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import ValidationUtil from 'src/utils/dateValidation';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ExerciseService {
  constructor(
    private prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  private async validateExerciseOwnership(id: number, userId: number) {
    const exercise = await this.prisma.exercise.findFirst({
      where: { id, userId },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found or not authorized');
    }

    return exercise;
  }

  async create(createExerciseDto: CreateExerciseDto, userId: number) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (
      !ValidationUtil.isCompareDate(
        createExerciseDto.beginTime,
        createExerciseDto.endTime,
      )
    ) {
      throw new BadRequestException(
        'Data Final deve ser maior que a data inicial!',
      );
    }

    return this.prisma.exercise.create({
      data: { ...createExerciseDto, userId },
    });
  }

  findByUserId(userId: number) {
    return this.prisma.exercise.findMany({ where: { userId } });
  }

  async findOne(id: number, userId: number) {
    return this.validateExerciseOwnership(id, userId);
  }

  async update(
    id: number,
    userId: number,
    updateExerciseDto: UpdateExerciseDto,
  ) {
    await this.validateExerciseOwnership(id, userId);

    if (
      updateExerciseDto.beginTime &&
      updateExerciseDto.endTime &&
      !ValidationUtil.isCompareDate(
        updateExerciseDto.beginTime,
        updateExerciseDto.endTime,
      )
    ) {
      throw new BadRequestException(
        'Data Final deve ser maior que a data inicial!',
      );
    }

    return this.prisma.exercise.update({
      data: updateExerciseDto,
      where: { id },
    });
  }

  async remove(id: number, userId: number) {
    await this.validateExerciseOwnership(id, userId);
    await this.prisma.exercise.delete({ where: { id } });
  }
}
