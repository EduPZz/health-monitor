import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import ValidationUtil from 'src/utils/dateValidation';
import { UsersService } from 'src/users/users.service';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class ExerciseService {
  constructor(
    private prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly eventsGateway: EventsGateway,
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

  private async validateCompanionAccess(
    companionUserId: number,
    requestingUserId: number,
  ) {
    // Check if the requesting user is a companion of the target user
    const companionRelation = await this.prisma.userCompanion.findFirst({
      where: {
        accompaniedById: requestingUserId,
        accompanyingId: companionUserId,
      },
    });

    if (!companionRelation) {
      throw new ForbiddenException(
        "Access denied: Not authorized to view this user's exercises",
      );
    }

    return true;
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

    const exercise = await this.prisma.exercise.create({
      data: { ...createExerciseDto, userId },
    });

    // Emit event to companions
    await this.eventsGateway.emitExerciseToCompanions(
      userId,
      'exercise-created',
      {
        exercise,
        type: 'exercise-created',
      },
    );

    return exercise;
  }

  findByUserId(userId: number) {
    return this.prisma.exercise.findMany({ where: { userId } });
  }

  async findByUserIdForCompanion(
    companionUserId: number,
    requestingUserId: number,
  ) {
    await this.validateCompanionAccess(companionUserId, requestingUserId);
    return this.prisma.exercise.findMany({
      where: { userId: companionUserId },
      orderBy: { beginTime: 'desc' },
    });
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

    const exercise = await this.prisma.exercise.update({
      data: updateExerciseDto,
      where: { id },
    });

    // Emit event to companions
    await this.eventsGateway.emitExerciseToCompanions(
      userId,
      'exercise-updated',
      {
        exercise,
        type: 'exercise-updated',
      },
    );

    return exercise;
  }

  async remove(id: number, userId: number) {
    await this.validateExerciseOwnership(id, userId);
    await this.prisma.exercise.delete({ where: { id } });

    // Emit event to companions
    await this.eventsGateway.emitExerciseToCompanions(
      userId,
      'exercise-deleted',
      {
        exerciseId: id,
        type: 'exercise-deleted',
      },
    );
  }
}
