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

    const data: any = {
      executerId: userId,
      measuredUserId: userId,
      anonymous: dto.anonymous ?? false,
      measurementType: dto.measurementType,
      bluetoothScaleId: dto.bluetoothScaleId ?? null,
    };

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
      include: { bioimpedanceMeasurement: true },
    });
  }
}


