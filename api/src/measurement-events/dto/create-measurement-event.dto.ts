import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMeasurementEventDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
