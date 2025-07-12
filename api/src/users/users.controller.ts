import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { SearchUserDto } from './dto/search-user.dto.js';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  search(@Query() searchUserDto: SearchUserDto) {
    return this.userService.search(searchUserDto);
  }
}
