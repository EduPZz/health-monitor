import { CompanionRequestType } from '@prisma/client';
import { IsEnum, IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateCompanionRequestDto {
  @IsString()
  message: string;

  @IsNumber()
  @IsNotEmpty()
  invitedId: number;

  @IsEnum(CompanionRequestType)
  type: CompanionRequestType;
}
