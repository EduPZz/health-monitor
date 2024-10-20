import { OmitType } from '@nestjs/mapped-types';
import { CreateBodyMeasureDto } from './create-body-measure.dto';

export class UpdateBodyMeasureDto extends OmitType(CreateBodyMeasureDto, [
  'userId',
]) {}
