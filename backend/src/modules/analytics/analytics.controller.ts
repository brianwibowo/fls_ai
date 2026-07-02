import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  getOverview() {
    return this.analyticsService.getOverview();
  }

  @Get('trends')
  getTrends() {
    return this.analyticsService.getTrends();
  }

  @Get('category-performance')
  getCategoryPerformance() {
    return this.analyticsService.getCategoryPerformance();
  }

  @Get('insights')
  getInsights() {
    return this.analyticsService.getInsights();
  }

  @Post('snapshot')
  @Roles(UserRole.ADMIN)
  createSnapshot() {
    return this.analyticsService.createSnapshot();
  }
}
