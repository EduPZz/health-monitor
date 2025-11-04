import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreateMeasurementSessionDto } from './dto/create-measurement-session.dto';

@Injectable()
export class MeasurementSessionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: number, dto: CreateMeasurementSessionDto) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const measuredUserId = dto.anonymous ? dto?.measuredUserId : userId;

    const data: any = {
      executerId: userId,
      measuredUserId: measuredUserId,
      anonymous: dto.anonymous ?? false,
      measurementType: dto.measurementType,
      bluetoothScaleId: dto.bluetoothScaleId ?? null,
      eventId: dto.eventId ?? null,
    };

    if (
      dto.anonymous &&
      dto.anonymousEmail &&
      dto.anonymousName &&
      dto.anonymousPhone
    ) {
      data.anonymousEmail = dto.anonymousEmail;
      data.anonymousName = dto.anonymousName;
      data.anonymousPhone = dto.anonymousPhone;
    }

    const lastMeasure = await this.prisma.bodyMeasure.findFirst({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
    });
    if (lastMeasure && dto.bioimpedanceMeasurement?.weight) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, createdAt, updatedAt, weight, ...rest } = lastMeasure;

      await this.prisma.bodyMeasure.create({
        data: {
          ...rest,
          weight: dto.bioimpedanceMeasurement.weight,
          userId: userId,
        },
      });
    }

    return this.prisma.measurementSession.create({
      data: {
        ...data,
        bioimpedanceMeasurement: dto.bioimpedanceMeasurement
          ? {
              create: {
                weight: dto.bioimpedanceMeasurement.weight ?? null,
                bodyFatPercentage:
                  dto.bioimpedanceMeasurement.bodyFatPercentage ?? null,
                muscleMass: dto.bioimpedanceMeasurement.muscleMass ?? null,
                boneMass: dto.bioimpedanceMeasurement.boneMass ?? null,
                waterPercentage:
                  dto.bioimpedanceMeasurement.waterPercentage ?? null,
                visceralFat: dto.bioimpedanceMeasurement.visceralFat ?? null,
                metabolicAge: dto.bioimpedanceMeasurement.metabolicAge ?? null,
              },
            }
          : undefined,
      },
      include: { bioimpedanceMeasurement: true },
    });
  }

  async findAll(userId: number) {
    return this.prisma.measurementSession.findMany({
      where: { measuredUserId: userId },
      orderBy: { id: 'desc' },
      include: { bioimpedanceMeasurement: true, measuredUser: true },
    });
  }

  async findByEvent(eventId: number, userId: number) {
    // Validate event ownership
    const event = await this.prisma.measurementEvents.findFirst({
      where: { id: eventId, userId },
    });

    if (!event) {
      throw new NotFoundException('Event not found or not authorized');
    }

    return this.prisma.measurementSession.findMany({
      where: { eventId, measuredUserId: userId },
      orderBy: { id: 'desc' },
      include: { bioimpedanceMeasurement: true, measuredUser: true },
    });
  }
}
