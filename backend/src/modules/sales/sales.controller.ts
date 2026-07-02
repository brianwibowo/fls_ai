import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.LOGISTICS_MANAGER)
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = parseInt(page || '1', 10) || 1;
    const limitNum = parseInt(limit || '10', 10) || 10;
    return this.salesService.findAll(pageNum, limitNum, search);
  }

  @Get('stats')
  getStats() {
    return this.salesService.getStats();
  }
}
