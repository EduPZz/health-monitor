import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMeasurementEventDto } from './dto/create-measurement-event.dto';
import { UpdateMeasurementEventDto } from './dto/update-measurement-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MeasurementEventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  private async validateEventOwnership(id: number, userId: number) {
    const measurementEvent = await this.prisma.measurementEvents.findFirst({
      where: { id, userId },
    });

    if (!measurementEvent) {
      throw new NotFoundException('Exercise not found or not authorized');
    }

    return measurementEvent;
  }

  async create(
    createMeasurementEventDto: CreateMeasurementEventDto,
    userId: number,
  ) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.measurementEvents.create({
      data: {
        ...createMeasurementEventDto,
        userId: userId,
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.measurementEvents.findMany({
      where: { userId: userId },
    });
  }

  async findOne(id: number, userId: number) {
    return this.prisma.measurementEvents.findFirst({
      where: { id, userId },
      include: {
        measurementSession: {
          include: { bioimpedanceMeasurement: true },
          orderBy: { id: 'desc' },
        },
      },
    });
  }

  async update(
    id: number,
    updateMeasurementEventDto: UpdateMeasurementEventDto,
    userId: number,
  ) {
    await this.validateEventOwnership(id, userId);

    return this.prisma.measurementEvents.update({
      where: { id: id },
      data: {
        ...updateMeasurementEventDto,
      },
    });
  }

  remove(id: number, userId: number) {
    return this.prisma.measurementEvents.deleteMany({
      where: { id: id, userId: userId },
    });
  }
}
