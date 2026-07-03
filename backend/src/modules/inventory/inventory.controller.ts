import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, Delete } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('batches')
  @Roles(UserRole.ADMIN, UserRole.LOGISTICS_MANAGER)
  create(@Body() createBatchDto: CreateBatchDto) {
    return this.inventoryService.create(createBatchDto);
  }

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('risk') risk?: string,
    @Query('search') search?: string,
  ) {
    return this.inventoryService.findAll(category, risk, search);
  }

  @Get('summary')
  getSummary() {
    return this.inventoryService.getSummary();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Patch('batches/:id')
  @Roles(UserRole.ADMIN, UserRole.LOGISTICS_MANAGER)
  update(@Param('id') id: string, @Body() updateBatchDto: UpdateBatchDto) {
    return this.inventoryService.update(id, updateBatchDto);
  }

  @Delete('batches/:id')
  @Roles(UserRole.ADMIN, UserRole.LOGISTICS_MANAGER)
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }
}
