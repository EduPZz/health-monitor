import { PartialType } from '@nestjs/mapped-types';
import { CreateMeasurementEventDto } from './create-measurement-event.dto';

export class UpdateMeasurementEventDto extends PartialType(
  CreateMeasurementEventDto,
) {}
