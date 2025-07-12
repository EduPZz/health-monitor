import { IsEmail, IsString } from 'class-validator';

export class SearchUserDto {
  @IsEmail()
  email?: string;

  @IsString()
  name?: string;
}
