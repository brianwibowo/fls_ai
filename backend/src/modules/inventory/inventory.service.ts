import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { BatchStatus, RiskLevel } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBatchDto: CreateBatchDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: createBatchDto.productId },
    });
    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan.');
    }

    return this.prisma.inventoryBatch.create({
      data: {
        productId: createBatchDto.productId,
        batchCode: createBatchDto.batchCode,
        quantityReceived: createBatchDto.quantityReceived,
        quantityCurrent: createBatchDto.quantityReceived,
        receivedDate: new Date(createBatchDto.receivedDate),
        expiryDate: new Date(createBatchDto.expiryDate),
        status: BatchStatus.ACTIVE,
      },
    });
  }

  async findAll(category?: string, risk?: string, search?: string) {
    const where: any = {
      quantityCurrent: { gt: 0 },
      status: BatchStatus.ACTIVE,
    };

    if (category && category !== 'all') {
      where.product = {
        category: { name: category },
      };
    }

    if (search) {
      where.product = {
        ...where.product,
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const batches = await this.prisma.inventoryBatch.findMany({
      where,
      include: {
        product: {
          include: { category: true },
        },
      },
      orderBy: { expiryDate: 'asc' },
    });

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const result = batches.map((batch: any) => {
      const exp = new Date(batch.expiryDate);
      exp.setHours(0, 0, 0, 0);
      const diffTime = exp.getTime() - now.getTime();
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const finalDaysLeft = daysLeft < 0 ? 0 : daysLeft;

      let riskLevel: RiskLevel = RiskLevel.LOW;
      if (finalDaysLeft <= 2) {
        riskLevel = RiskLevel.HIGH;
      } else if (finalDaysLeft <= 5) {
        riskLevel = RiskLevel.MEDIUM;
      }

      return {
        ...batch,
        daysLeft: finalDaysLeft,
        riskLevel,
      };
    });

    if (risk && risk !== 'all') {
      return result.filter((b: any) => b.riskLevel === risk.toUpperCase());
    }

    return result;
  }

  async findOne(id: string) {
    const batch = await this.prisma.inventoryBatch.findUnique({
      where: { id },
      include: {
        product: { include: { category: true } },
      },
    });
    if (!batch) {
      throw new NotFoundException('Batch tidak ditemukan.');
    }
    return batch;
  }

  async update(id: string, updateBatchDto: UpdateBatchDto) {
    await this.findOne(id);
    return this.prisma.inventoryBatch.update({
      where: { id },
      data: updateBatchDto,
    });
  }

  async getSummary() {
    const activeBatches = await this.findAll('all', 'all', '');
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const totalStock = activeBatches.reduce((sum: number, b: any) => sum + b.quantityCurrent, 0);
    const highRiskCount = activeBatches.filter((b: any) => b.riskLevel === RiskLevel.HIGH).length;

    const expiringTodayCount = activeBatches.filter((b: any) => {
      const exp = new Date(b.expiryDate);
      exp.setHours(0, 0, 0, 0);
      return exp.getTime() === now.getTime();
    }).length;

    const overstockCount = activeBatches.filter((b: any) => b.quantityCurrent > 150).length;

    return {
      totalStock,
      highRiskItems: highRiskCount,
      expiringToday: expiringTodayCount,
      overstockItems: overstockCount,
    };
  }
}
