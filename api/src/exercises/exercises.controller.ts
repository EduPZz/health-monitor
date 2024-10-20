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
import { ExerciseService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Controller('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  create(@Body() createExerciseDto: CreateExerciseDto, @Request() req) {
    return this.exerciseService.create(createExerciseDto, req.user.sub);
  }

  @Get()
  findAll(@Request() req) {
    return this.exerciseService.findByUserId(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.exerciseService.findOne(+id, req.user.sub);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
    @Request() req,
  ) {
    return this.exerciseService.update(+id, req.user.sub, updateExerciseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.exerciseService.remove(+id, req.user.sub);
  }
}
