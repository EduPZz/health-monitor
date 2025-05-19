import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBluetoothScaleDto } from './dto/create-bluetooth-scale.dto';
import { UpdateBluetoothScaleDto } from './dto/update-bluetooth-scale.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BluetoothScalesService {
  constructor(
    private prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    userId: number,
    createBluetoothScaleDto: CreateBluetoothScaleDto,
  ) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return this.prisma.bluetoothScales.create({
      data: {
        ...createBluetoothScaleDto,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.bluetoothScales.findMany({
      where: {
        userId,
      },
    });
  }

  async findOne(userId: number, id: number) {
    const scale = await this.prisma.bluetoothScales.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!scale) {
      throw new NotFoundException(`Bluetooth scale with ID ${id} not found`);
    }

    return scale;
  }

  async update(
    userId: number,
    id: number,
    updateBluetoothScaleDto: UpdateBluetoothScaleDto,
  ) {
    await this.findOne(userId, id);

    return this.prisma.bluetoothScales.update({
      where: {
        id,
      },
      data: updateBluetoothScaleDto,
    });
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id);

    await this.prisma.bluetoothScales.delete({
      where: {
        id,
      },
    });
  }
}
