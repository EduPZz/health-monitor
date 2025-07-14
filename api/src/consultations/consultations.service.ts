import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ConsultationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  private async validateConsultationOwnership(id: number, userId: number) {
    const consultation = await this.prisma.consultation.findFirst({
      where: { id, userId },
    });

    if (!consultation) {
      throw new NotFoundException(
        'Consulta não encontrada ou você não tem permissão para acessá-la.',
      );
    }

    return consultation;
  }

  async create(createConsultationDto: CreateConsultationDto, userId: number) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.prisma.consultation.create({
      data: { ...createConsultationDto, userId },
    });
  }

  findByUserId(userId: number) {
    return this.prisma.consultation.findMany({ where: { userId } });
  }

  findOne(id: number, userId: number) {
    return this.validateConsultationOwnership(id, userId);
  }

  async update(
    id: number,
    userId: number,
    updateConsultationDto: UpdateConsultationDto,
  ) {
    await this.validateConsultationOwnership(id, userId);

    return this.prisma.consultation.update({
      data: updateConsultationDto,
      where: { id },
    });
  }

  async remove(id: number, userId: number) {
    await this.validateConsultationOwnership(id, userId);

    await this.prisma.consultation.delete({
      where: { id },
    });
  }
}
