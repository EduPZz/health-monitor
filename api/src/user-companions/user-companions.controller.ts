import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserCompanionsService } from './user-companions.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user-companions')
@UseGuards(AuthGuard)
export class UserCompanionsController {
  constructor(private readonly userCompanionsService: UserCompanionsService) {}

  @Get('companions')
  findCompanions(@Request() req) {
    return this.userCompanionsService.findCompanions(req.user.sub);
  }

  @Get('accompanied-by')
  findAccompaniedBy(@Request() req) {
    return this.userCompanionsService.findAccompaniedBy(req.user.sub);
  }

  @Get()
  findAll() {
    return this.userCompanionsService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userCompanionsService.remove(+id);
  }
}
