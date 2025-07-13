import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUserDto } from './dto/search-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (exists) throw new BadRequestException('Email já cadastrado!');

    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async search(searchUserDto: SearchUserDto) {
    const { name, email } = searchUserDto;

    if (!name && !email) {
      return [];
    }

    const conditions = [];
    if (name) {
      conditions.push({
        name: {
          contains: name,
          mode: 'insensitive',
        },
      });
    }
    if (email) {
      conditions.push({
        email: {
          contains: email,
          mode: 'insensitive',
        },
      });
    }

    return this.prisma.user.findMany({
      where: {
        OR: conditions,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      take: 10,
      orderBy: {
        name: 'asc',
      },
    });
  }
}
