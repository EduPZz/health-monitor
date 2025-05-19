import { Module } from '@nestjs/common';
import { BluetoothScalesService } from './bluetooth-scales.service';
import { BluetoothScalesController } from './bluetooth-scales.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [BluetoothScalesController],
  providers: [PrismaService, BluetoothScalesService],
})
export class BluetoothScalesModule {}
