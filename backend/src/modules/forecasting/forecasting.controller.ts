import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ForecastingService } from './forecasting.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, ReorderStatus } from '@prisma/client';

@Controller('forecasting')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ForecastingController {
  constructor(private readonly forecastingService: ForecastingService) {}

  @Post('generate')
  @Roles(UserRole.ADMIN, UserRole.LOGISTICS_MANAGER)
  generateForecasts() {
    return this.forecastingService.generateForecasts();
  }

  @Get('demand')
  getDemandForecasts() {
    return this.forecastingService.getDemandForecasts();
  }

  @Get('reorder')
  getReorders() {
    return this.forecastingService.getReorders();
  }

  @Get('waste-risk')
  getWasteRisk() {
    return this.forecastingService.getWasteRisk();
  }

  @Get('summary')
  getSummary() {
    return this.forecastingService.getSummary();
  }

  @Patch('reorder/:id')
  @Roles(UserRole.ADMIN, UserRole.LOGISTICS_MANAGER)
  updateReorderStatus(
    @Param('id') id: string,
    @Body('status') status: ReorderStatus,
  ) {
    return this.forecastingService.updateReorderStatus(id, status);
  }
}
