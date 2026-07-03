import { Controller, Get, Post, Patch, Param, Delete, Body, UseGuards } from '@nestjs/common';
import { NudgingService } from './nudging.service';
import { CreateNudgeDto } from './dto/create-nudge.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole, NudgeEventType } from '@prisma/client';

@Controller('nudging')
@Roles(UserRole.ADMIN, UserRole.MARKETING_MANAGER)
@UseGuards(JwtAuthGuard, RolesGuard)
export class NudgingController {
  constructor(private readonly nudgingService: NudgingService) {}

  @Post('strategies')
  @Roles(UserRole.ADMIN, UserRole.MARKETING_MANAGER)
  create(@Body() createNudgeDto: CreateNudgeDto, @CurrentUser() user: any) {
    return this.nudgingService.create(createNudgeDto, user.id);
  }

  @Get('strategies')
  findAll() {
    return this.nudgingService.findAll();
  }

  @Get('strategies/:id')
  findOne(@Param('id') id: string) {
    return this.nudgingService.findOne(id);
  }

  @Patch('strategies/:id')
  @Roles(UserRole.ADMIN, UserRole.MARKETING_MANAGER)
  update(@Param('id') id: string, @Body() data: any) {
    return this.nudgingService.update(id, data);
  }

  @Delete('strategies/:id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.nudgingService.remove(id);
  }

  @Get('preview')
  getPreview() {
    return this.nudgingService.getPreview();
  }

  @Get('logs')
  getLogs() {
    return this.nudgingService.getLogs();
  }

  @Post('logs')
  createLog(
    @Body('nudgeId') nudgeId: string,
    @Body('eventType') eventType: NudgeEventType,
    @Body('productId') productId: string,
  ) {
    return this.nudgingService.createLog(nudgeId, eventType, productId);
  }

  @Get('summary')
  getSummary() {
    return this.nudgingService.getSummary();
  }
}
