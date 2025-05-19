import { IsString, IsBoolean, IsEnum } from 'class-validator';
import { BluetoothScalesStatus } from '@prisma/client';

export class CreateBluetoothScaleDto {
  @IsString()
  macAddress: string;

  @IsString()
  name: string;

  @IsString()
  model: string;

  @IsString()
  brand: string;

  @IsBoolean()
  supportsImpedance: boolean;

  @IsEnum(BluetoothScalesStatus)
  status: BluetoothScalesStatus;
}
