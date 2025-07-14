import { Controller, Get, Param, Delete } from '@nestjs/common';
import { UserCompanionsService } from './user-companions.service';

@Controller('user-companions')
export class UserCompanionsController {
  constructor(private readonly userCompanionsService: UserCompanionsService) {}

  @Get()
  findAll() {
    return this.userCompanionsService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userCompanionsService.remove(+id);
  }
}
