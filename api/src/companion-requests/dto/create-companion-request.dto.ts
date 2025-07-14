import { CompanionRequestType } from '@prisma/client';
import {
  IsEnum,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateCompanionRequestDto {
  @IsOptional()
  @IsString()
  message?: string;

  @IsNumber()
  @IsNotEmpty()
  invitedId: number;

  @IsEnum(CompanionRequestType)
  type: CompanionRequestType;
}
