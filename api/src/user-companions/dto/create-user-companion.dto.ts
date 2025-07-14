import { IsNumber } from 'class-validator';

export class CreateUserCompanionDto {
  @IsNumber()
  accompaniedById: number;

  @IsNumber()
  accompanyingId: number;
}
