import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { BatchStatus, NudgeEventType } from '@prisma/client';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSaleDto: CreateSaleDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: createSaleDto.productId },
      include: {
        batches: {
          where: { quantityCurrent: { gt: 0 }, status: BatchStatus.ACTIVE },
          orderBy: { expiryDate: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan.');
    }

    const totalAvailable = product.batches.reduce((sum, b) => sum + b.quantityCurrent, 0);
    if (totalAvailable < createSaleDto.quantitySold) {
      throw new BadRequestException('Stok tidak mencukupi untuk melakukan transaksi.');
    }

    return this.prisma.$transaction(async (tx) => {
      let remainingToDeduct = createSaleDto.quantitySold;
      const salesCreated = [];

      for (const batch of product.batches) {
        if (remainingToDeduct <= 0) break;

        const deductFromThisBatch = Math.min(batch.quantityCurrent, remainingToDeduct);
        const newQuantity = batch.quantityCurrent - deductFromThisBatch;
        remainingToDeduct -= deductFromThisBatch;

        await tx.inventoryBatch.update({
          where: { id: batch.id },
          data: {
            quantityCurrent: newQuantity,
            status: newQuantity === 0 ? BatchStatus.SOLD_OUT : BatchStatus.ACTIVE,
          },
        });

        const sale = await tx.salesTransaction.create({
          data: {
            productId: createSaleDto.productId,
            batchId: batch.id,
            quantitySold: deductFromThisBatch,
            saleDate: new Date(createSaleDto.saleDate),
            salePrice: createSaleDto.salePrice,
            wasNudged: createSaleDto.wasNudged || false,
            nudgeId: createSaleDto.nudgeId || null,
          },
        });

        if (createSaleDto.wasNudged && createSaleDto.nudgeId) {
          await tx.nudgeActivityLog.create({
            data: {
              nudgeId: createSaleDto.nudgeId,
              eventType: NudgeEventType.CONVERSION,
              productId: createSaleDto.productId,
              occurredAt: new Date(),
            },
          });
        }

        salesCreated.push(sale);
      }

      return salesCreated;
    });
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const where: any = {};
    if (search) {
      where.product = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const total = await this.prisma.salesTransaction.count({ where });
    const data = await this.prisma.salesTransaction.findMany({
      where,
      include: {
        product: true,
        batch: true,
        nudge: true,
      },
      orderBy: { saleDate: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStats() {
    const aggregations = await this.prisma.salesTransaction.aggregate({
      _sum: {
        quantitySold: true,
      },
      _count: {
        id: true,
      },
    });

    const sales = await this.prisma.salesTransaction.findMany({
      select: {
        quantitySold: true,
        salePrice: true,
      },
    });

    const revenue = sales.reduce((sum, s) => sum + (s.quantitySold * Number(s.salePrice)), 0);

    return {
      totalSold: aggregations._sum.quantitySold || 0,
      totalTransactions: aggregations._count.id || 0,
      totalRevenue: revenue,
    };
  }
}
