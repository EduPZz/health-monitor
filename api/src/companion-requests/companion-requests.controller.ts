import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { CompanionRequestsService } from './companion-requests.service';
import { CreateCompanionRequestDto } from './dto/create-companion-request.dto';

@Controller('companion-requests')
export class CompanionRequestsController {
  constructor(
    private readonly companionRequestsService: CompanionRequestsService,
  ) {}

  @Post()
  create(
    @Body() createCompanionRequestDto: CreateCompanionRequestDto,
    @Req() req,
  ) {
    return this.companionRequestsService.create(
      req.user.sub,
      createCompanionRequestDto,
    );
  }

  @Get()
  findAll(@Req() req, @Query('type') type?: 'sent' | 'received') {
    return this.companionRequestsService.findAll(req.user.sub, type);
  }

  @Patch(':id/accept')
  accept(@Param('id') id: string, @Req() req) {
    return this.companionRequestsService.accept(+id, req.user.sub);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string, @Req() req) {
    return this.companionRequestsService.reject(+id, req.user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.companionRequestsService.remove(+id, req.user.sub);
  }
}
