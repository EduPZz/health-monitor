import { IsNotEmpty, IsString, IsDateString, IsInt } from 'class-validator';

export class CreateExerciseDto {
  @IsNotEmpty()
  @IsDateString()
  beginTime: Date;

  @IsNotEmpty()
  @IsDateString()
  endTime: Date;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsInt()
  userId: number;
}
