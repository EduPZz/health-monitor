import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { UserSex } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  timezone: string;

  @IsDateString()
  birthDate: Date;

  @IsEnum(UserSex)
  sex: UserSex;
}
