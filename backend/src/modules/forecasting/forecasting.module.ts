import { Module } from '@nestjs/common';
import { ForecastingService } from './forecasting.service';
import { ForecastingController } from './forecasting.controller';

@Module({
  controllers: [ForecastingController],
  providers: [ForecastingService],
  exports: [ForecastingService],
})
export class ForecastingModule {}
