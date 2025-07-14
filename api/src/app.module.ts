import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { ExercisesModule } from './exercises/exercises.module';
import { BodyMeasuresModule } from './body-measures/body-measures.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { BluetoothScalesModule } from './bluetooth-scales/bluetooth-scales.module';
import { CompanionRequestsModule } from './companion-requests/companion-requests.module';
import { UserCompanionsModule } from './user-companions/user-companions.module';
@Module({
  imports: [
    UsersModule,
    AuthModule,
    ExercisesModule,
    BodyMeasuresModule,
    ConsultationsModule,
    BluetoothScalesModule,
    CompanionRequestsModule,
    UserCompanionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
