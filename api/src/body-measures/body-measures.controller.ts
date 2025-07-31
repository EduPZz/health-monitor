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
import { BodyMeasuresService } from './body-measures.service';
import { CreateBodyMeasureDto } from './dto/create-body-measure.dto';
import { UpdateBodyMeasureDto } from './dto/update-body-measure.dto';

@Controller('body-measure')
export class BodyMeasuresController {
  constructor(private readonly bodyMeasuresService: BodyMeasuresService) {}

  @Post()
  create(@Body() createBodyMeasureDto: CreateBodyMeasureDto, @Request() req) {
    return this.bodyMeasuresService.create(createBodyMeasureDto, req.user.sub);
  }

  @Get()
  findAll(@Request() req) {
    return this.bodyMeasuresService.findByUserId(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.bodyMeasuresService.findOne(+id, req.user.sub);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBodyMeasureDto: UpdateBodyMeasureDto,
    @Request() req,
  ) {
    return this.bodyMeasuresService.update(
      +id,
      req.user.sub,
      updateBodyMeasureDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.bodyMeasuresService.remove(+id, req.user.sub);
  }

  @Get('/user/:user_id')
  getFromUserId(@Param('user_id') user_id: string, @Request() req) {
    return this.bodyMeasuresService.getFromUserId(+req.user.sub, +user_id);
  }
}
