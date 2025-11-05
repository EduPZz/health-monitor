import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MeasurementTypes } from '@prisma/client';

class BioimpedanceDto {
  @IsOptional()
  weight?: any;

  @IsOptional()
  height?: any;

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
  @IsString()
  anonymousName?: string;

  @IsOptional()
  @IsString()
  anonymousEmail?: string;

  @IsOptional()
  @IsString()
  anonymousPhone?: string;

  @IsOptional()
  @IsInt()
  measuredUserId?: number;

  @IsOptional()
  @IsInt()
  bluetoothScaleId?: number;

  @IsOptional()
  @IsInt()
  eventId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => BioimpedanceDto)
  bioimpedanceMeasurement?: BioimpedanceDto;
}
