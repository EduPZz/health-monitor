import { BodyMeasure } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class BodyMeasureEntity implements BodyMeasure {
  id: number;
  chest: number;
  arm: number;
  waist: number;
  thigh: number;
  hip: number;
  calf: number;
  weight: Decimal;
  height: Decimal;
  createdAt: Date;
  userId: number;
}
