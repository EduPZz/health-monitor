import { IsBoolean, IsEnum, IsInt, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MeasurementTypes } from '@prisma/client';

class BioimpedanceDto {
  @IsOptional()
  weight?: any;

  @IsOptional()
  bodyFatPercentage?: any;

  @IsOptional()
  muscleMass?: any;

  @IsOptional()
  boneMass?: any;

  @IsOptional()
  waterPercentage?: any;

  @IsOptional()
  visceralFat?: number;

  @IsOptional()
  metabolicAge?: number;
}

export class CreateMeasurementSessionDto {
  @IsEnum(MeasurementTypes)
  measurementType: MeasurementTypes;

  @IsOptional()
  @IsBoolean()
  anonymous?: boolean;

  @IsOptional()
  @IsInt()
  bluetoothScaleId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => BioimpedanceDto)
  bioimpedanceMeasurement?: BioimpedanceDto;
}


