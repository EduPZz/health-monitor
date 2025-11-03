import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { MeasurementEventsService } from './measurement-events.service';
import { CreateMeasurementEventDto } from './dto/create-measurement-event.dto';
import { UpdateMeasurementEventDto } from './dto/update-measurement-event.dto';

@Controller('measurement-events')
export class MeasurementEventsController {
  constructor(
    private readonly measurementEventsService: MeasurementEventsService,
  ) {}

  @Post()
  create(
    @Body() createMeasurementEventDto: CreateMeasurementEventDto,
    @Request() req,
  ) {
    return this.measurementEventsService.create(
      createMeasurementEventDto,
      req.user.sub,
    );
  }

  @Get()
  findAll(@Request() req) {
    return this.measurementEventsService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.measurementEventsService.findOne(+id, req.user.sub);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMeasurementEventDto: UpdateMeasurementEventDto,
    @Request() req,
  ) {
    return this.measurementEventsService.update(
      +id,
      updateMeasurementEventDto,
      req.user.sub,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.measurementEventsService.remove(+id, req.user.sub);
  }
}
