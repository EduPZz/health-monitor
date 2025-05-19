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
import { BluetoothScalesService } from './bluetooth-scales.service';
import { CreateBluetoothScaleDto } from './dto/create-bluetooth-scale.dto';
import { UpdateBluetoothScaleDto } from './dto/update-bluetooth-scale.dto';

@Controller('bluetooth-scales')
export class BluetoothScalesController {
  constructor(
    private readonly bluetoothScalesService: BluetoothScalesService,
  ) {}

  @Post()
  create(
    @Request() req,
    @Body() createBluetoothScaleDto: CreateBluetoothScaleDto,
  ) {
    return this.bluetoothScalesService.create(
      req.user.sub,
      createBluetoothScaleDto,
    );
  }

  @Get()
  findAll(@Request() req) {
    return this.bluetoothScalesService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.bluetoothScalesService.findOne(req.user.sub, +id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateBluetoothScaleDto: UpdateBluetoothScaleDto,
  ) {
    return this.bluetoothScalesService.update(
      req.user.sub,
      +id,
      updateBluetoothScaleDto,
    );
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.bluetoothScalesService.remove(req.user.sub, +id);
  }
}
