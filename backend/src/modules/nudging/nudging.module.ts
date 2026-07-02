import { Module } from '@nestjs/common';
import { NudgingService } from './nudging.service';
import { NudgingController } from './nudging.controller';

@Module({
  controllers: [NudgingController],
  providers: [NudgingService],
  exports: [NudgingService],
})
export class NudgingModule {}
