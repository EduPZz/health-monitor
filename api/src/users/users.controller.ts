import { Controller, Get, Query, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { SearchUserDto } from './dto/search-user.dto.js';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  search(@Query() searchUserDto: SearchUserDto, @Req() req) {
    return this.userService.search(searchUserDto, req.user.sub);
  }
}
