import { OmitType } from '@nestjs/mapped-types';
import { CreateConsultationDto } from './create-consultation.dto';

export class UpdateConsultationDto extends OmitType(CreateConsultationDto, [
  'userId',
]) {}
