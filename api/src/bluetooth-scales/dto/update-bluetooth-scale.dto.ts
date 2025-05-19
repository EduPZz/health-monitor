import { PartialType } from '@nestjs/mapped-types';
import { CreateBluetoothScaleDto } from './create-bluetooth-scale.dto';

export class UpdateBluetoothScaleDto extends PartialType(
  CreateBluetoothScaleDto,
) {}
