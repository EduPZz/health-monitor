import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signup(createUserDto: CreateUserDto) {
    const createdUser = await this.usersService.create(createUserDto);

    const payload = { sub: createdUser.id, username: createdUser.email };

    const tokenInformation = {
      access_token: await this.jwtService.signAsync(payload),
    };

    return {
      tokenInformation,
    };
  }

  async profile(userFromReq: any) {
    const user = await this.usersService.findById(userFromReq.sub);

    return { ...userFromReq, smartwatchCode: user.smartwatchCode, timezone: user.timezone };
  }
}
