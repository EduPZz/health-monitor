import { Controller, Get, Param, Request } from '@nestjs/common';
import { SmartwatchesService } from './smartwatches.service';

@Controller('smartwatch')
export class SmartwatchesController {
  constructor(private readonly smartwatchesService: SmartwatchesService) {}

  @Get(':code')
  findOne(@Param('code') code: string, @Request() req) {
    return this.smartwatchesService.findOrCreate(code, req.user.sub);
  }
}
