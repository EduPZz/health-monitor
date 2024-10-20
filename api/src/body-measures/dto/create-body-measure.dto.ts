import { Decimal } from '@prisma/client/runtime/library';
import { IsInt, IsPositive, IsDecimal, IsNotEmpty } from 'class-validator';

export class CreateBodyMeasureDto {
  @IsInt()
  @IsPositive()
  chest: number;

  @IsInt()
  @IsPositive()
  arm: number;

  @IsInt()
  @IsPositive()
  waist: number;

  @IsInt()
  @IsPositive()
  thigh: number;

  @IsInt()
  @IsPositive()
  hip: number;

  @IsInt()
  @IsPositive()
  calf: number;

  @IsDecimal()
  @IsNotEmpty()
  weight: Decimal;

  @IsDecimal()
  @IsNotEmpty()
  height: Decimal;

  @IsInt()
  @IsPositive()
  userId: number;
}
