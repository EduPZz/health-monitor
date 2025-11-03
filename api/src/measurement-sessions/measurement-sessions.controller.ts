import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { MeasurementSessionsService } from './measurement-sessions.service';
import { CreateMeasurementSessionDto } from './dto/create-measurement-session.dto';

@Controller('measurement-sessions')
export class MeasurementSessionsController {
  constructor(
    private readonly measurementSessionsService: MeasurementSessionsService,
  ) {}

  @Post()
  create(@Request() req, @Body() dto: CreateMeasurementSessionDto) {
    return this.measurementSessionsService.create(req.user.sub, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.measurementSessionsService.findAll(req.user.sub);
  }

  @Get('event/:eventId')
  findByEvent(@Param('eventId') eventId: string, @Request() req) {
    return this.measurementSessionsService.findByEvent(+eventId, req.user.sub);
  }
}
