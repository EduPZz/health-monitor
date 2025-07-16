import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanionRequestDto } from './dto/create-companion-request.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { UserCompanionsService } from 'src/user-companions/user-companions.service';

@Injectable()
export class CompanionRequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private usersService: UsersService,
    private userCompanionsService: UserCompanionsService,
  ) {}

  async create(
    userId: number,
    createCompanionRequestDto: CreateCompanionRequestDto,
  ) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException(
        `Nenhum usuário com ID ${userId} foi encontrado`,
      );
    }

    const invitedUser = await this.usersService.findById(
      createCompanionRequestDto.invitedId,
    );
    if (!invitedUser) {
      throw new NotFoundException(
        `Nenhum usuário com ID ${createCompanionRequestDto.invitedId} foi encontrado`,
      );
    }

    const existingRequest = await this.prisma.companionRequest.findFirst({
      where: {
        inviterId: userId,
        invitedId: createCompanionRequestDto.invitedId,
        type: createCompanionRequestDto.type,
      },
    });

    if (existingRequest) {
      throw new ConflictException(
        'Você já fez um pedido de companhia para este usuário.',
      );
    }

    return this.prisma.companionRequest.create({
      data: { ...createCompanionRequestDto, inviterId: userId },
    });
  }

  findAll(userId: number, type?: 'sent' | 'received') {
    if (type === 'sent') {
      return this.prisma.companionRequest.findMany({
        where: { inviterId: userId },
        include: { invited: true },
      });
    }
    if (type === 'received') {
      return this.prisma.companionRequest.findMany({
        where: { invitedId: userId },
        include: { inviter: true },
      });
    }

    return this.prisma.companionRequest.findMany({
      where: {
        OR: [{ inviterId: userId }, { invitedId: userId }],
      },
      include: {
        inviter: true,
        invited: true,
      },
    });
  }

  async accept(id: number, userId: number) {
    const request = await this.validateCompanionRequestOwnership(id, userId);

    if (request.status !== 'pending') {
      throw new ConflictException('Este pedido já foi respondido.');
    }

    const { inviterId, invitedId, type } = request;

    let accompanyingId: number;
    let accompaniedById: number;

    if (type === 'to_share') {
      accompanyingId = inviterId;
      accompaniedById = invitedId;
    } else {
      accompanyingId = invitedId;
      accompaniedById = inviterId;
    }

    await this.userCompanionsService.create({
      accompaniedById,
      accompanyingId,
    });

    return this.prisma.companionRequest.update({
      where: { id },
      data: { status: 'accepted' },
    });
  }

  async reject(id: number, userId: number) {
    const request = await this.validateCompanionRequestOwnership(id, userId);

    if (request.status !== 'pending') {
      throw new ConflictException('Este pedido já foi respondido.');
    }

    return this.prisma.companionRequest.update({
      where: { id },
      data: { status: 'rejected' },
    });
  }

  async remove(id: number, userId: number) {
    const request = await this.prisma.companionRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Pedido de companhia não encontrado.');
    }

    if (request.inviterId !== userId && request.invitedId !== userId) {
      throw new NotFoundException(
        'Você não tem permissão para remover este pedido de companhia.',
      );
    }

    return this.prisma.companionRequest.delete({
      where: { id },
    });
  }

  async validateCompanionRequestOwnership(id: number, userId: number) {
    const request = await this.prisma.companionRequest.findFirst({
      where: { id, invitedId: userId },
    });

    if (!request) {
      throw new NotFoundException(
        'Pedido de companhia não encontrado ou você não tem permissão para acessá-lo.',
      );
    }

    return request;
  }
}
