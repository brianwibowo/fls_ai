import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UserRole, BatchStatus, NudgeType, NudgeStatus, NudgeEventType, ReorderStatus, Urgency } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async resetDatabase() {
    const env = this.configService.get<string>('NODE_ENV');
    if (env === 'production') {
      throw new ForbiddenException('Reset database tidak diizinkan di lingkungan production.');
    }

    await this.prisma.nudgeActivityLog.deleteMany();
    await this.prisma.nudgeProduct.deleteMany();
    await this.prisma.salesTransaction.deleteMany();
    await this.prisma.reorderRecommendation.deleteMany();
    await this.prisma.demandForecast.deleteMany();
    await this.prisma.inventoryBatch.deleteMany();
    await this.prisma.product.deleteMany();
    await this.prisma.category.deleteMany();
    await this.prisma.nudgeStrategy.deleteMany();
    await this.prisma.user.deleteMany();
    await this.prisma.analyticsSnapshot.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const logisticsPassword = await bcrypt.hash('logistics123', salt);
    const marketingPassword = await bcrypt.hash('marketing123', salt);

    const admin = await this.prisma.user.create({
      data: {
        name: 'Freashday Admin',
        email: 'admin@freashday.com',
        passwordHash: adminPassword,
        role: UserRole.ADMIN,
      },
    });

    const logistics = await this.prisma.user.create({
      data: {
        name: 'Logistics Manager',
        email: 'logistics@freashday.com',
        passwordHash: logisticsPassword,
        role: UserRole.LOGISTICS_MANAGER,
      },
    });

    const marketing = await this.prisma.user.create({
      data: {
        name: 'Marketing Manager',
        email: 'marketing@freashday.com',
        passwordHash: marketingPassword,
        role: UserRole.MARKETING_MANAGER,
      },
    });

    const dairy = await this.prisma.category.create({ data: { name: 'Dairy', description: 'Produk susu, keju, dan olahannya' } });
    const bakery = await this.prisma.category.create({ data: { name: 'Bakery', description: 'Roti, kue, dan produk panggangan' } });
    const produce = await this.prisma.category.create({ data: { name: 'Produce', description: 'Sayuran segar dan buah-buahan' } });
    const protein = await this.prisma.category.create({ data: { name: 'Protein', description: 'Daging, ayam, ikan, dan telur' } });

    const productsData = [
      { sku: 'DRY-001', name: 'Susu Segar Pasteurisasi 1L', categoryId: dairy.id, unit: 'pcs', shelfLifeDays: 7, unitCost: 15000, unitPrice: 19500 },
      { sku: 'DRY-002', name: 'Yogurt Plain 200ml', categoryId: dairy.id, unit: 'pcs', shelfLifeDays: 14, unitCost: 8000, unitPrice: 11000 },
      { sku: 'DRY-003', name: 'Keju Mozzarella 250g', categoryId: dairy.id, unit: 'pcs', shelfLifeDays: 30, unitCost: 28000, unitPrice: 38000 },
      { sku: 'DRY-004', name: 'Mentega Tawar 200g', categoryId: dairy.id, unit: 'pcs', shelfLifeDays: 45, unitCost: 22000, unitPrice: 30000 },
      { sku: 'BKR-001', name: 'Roti Tawar Gandum', categoryId: bakery.id, unit: 'pcs', shelfLifeDays: 4, unitCost: 12000, unitPrice: 17000 },
      { sku: 'BKR-002', name: 'Croissant Butter', categoryId: bakery.id, unit: 'pcs', shelfLifeDays: 3, unitCost: 9000, unitPrice: 15000 },
      { sku: 'BKR-003', name: 'Roti Sobek Cokelat', categoryId: bakery.id, unit: 'pcs', shelfLifeDays: 5, unitCost: 10000, unitPrice: 14500 },
      { sku: 'PRD-001', name: 'Bayam Segar 250g', categoryId: produce.id, unit: 'pcs', shelfLifeDays: 3, unitCost: 2500, unitPrice: 4000 },
      { sku: 'PRD-002', name: 'Tomat Cherry 500g', categoryId: produce.id, unit: 'pcs', shelfLifeDays: 7, unitCost: 12000, unitPrice: 18000 },
      { sku: 'PRD-003', name: 'Wortel Baby 300g', categoryId: produce.id, unit: 'pcs', shelfLifeDays: 10, unitCost: 6000, unitPrice: 9000 },
      { sku: 'PRD-004', name: 'Pisang Cavendish Sisir', categoryId: produce.id, unit: 'pcs', shelfLifeDays: 6, unitCost: 15000, unitPrice: 22000 },
      { sku: 'PTN-001', name: 'Dada Ayam Fillet 500g', categoryId: protein.id, unit: 'pcs', shelfLifeDays: 4, unitCost: 32000, unitPrice: 45000 },
      { sku: 'PTN-002', name: 'Ikan Salmon Fillet 200g', categoryId: protein.id, unit: 'pcs', shelfLifeDays: 3, unitCost: 55000, unitPrice: 75000 },
      { sku: 'PTN-003', name: 'Telur Ayam Omega 10s', categoryId: protein.id, unit: 'pcs', shelfLifeDays: 14, unitCost: 20000, unitPrice: 28000 },
    ];

    const products = [];
    for (const p of productsData) {
      const created = await this.prisma.product.create({ data: p });
      products.push(created);
    }

    const baseDate = new Date('2026-07-02');
    const batches = [];

    for (const product of products) {
      const freshReceivedDate = new Date(baseDate);
      freshReceivedDate.setDate(baseDate.getDate() - 1);
      const freshExpiryDate = new Date(freshReceivedDate);
      freshExpiryDate.setDate(freshReceivedDate.getDate() + product.shelfLifeDays);

      const freshBatch = await this.prisma.inventoryBatch.create({
        data: {
          productId: product.id,
          batchCode: `BCH-${product.sku}-01`,
          quantityReceived: 100,
          quantityCurrent: 85,
          receivedDate: freshReceivedDate,
          expiryDate: freshExpiryDate,
          status: BatchStatus.ACTIVE,
        },
      });
      batches.push(freshBatch);

      const oldReceivedDate = new Date(baseDate);
      oldReceivedDate.setDate(baseDate.getDate() - (product.shelfLifeDays - 2));
      const oldExpiryDate = new Date(oldReceivedDate);
      oldExpiryDate.setDate(oldReceivedDate.getDate() + product.shelfLifeDays);

      const oldBatch = await this.prisma.inventoryBatch.create({
        data: {
          productId: product.id,
          batchCode: `BCH-${product.sku}-02`,
          quantityReceived: 80,
          quantityCurrent: 25,
          receivedDate: oldReceivedDate,
          expiryDate: oldExpiryDate,
          status: BatchStatus.ACTIVE,
        },
      });
      batches.push(oldBatch);
    }

    for (let i = 30; i >= 1; i--) {
      const saleDate = new Date(baseDate);
      saleDate.setDate(baseDate.getDate() - i);
      const isWeekend = saleDate.getDay() === 0 || saleDate.getDay() === 6;

      for (const product of products) {
        let quantitySold = Math.floor(Math.random() * 10) + 5;
        if (isWeekend) quantitySold = Math.floor(quantitySold * 1.4);

        const activeBatches = batches.filter(
          (b) => b.productId === product.id && new Date(b.expiryDate) > saleDate
        );
        const batch = activeBatches.length > 0 ? activeBatches[0] : null;

        await this.prisma.salesTransaction.create({
          data: {
            productId: product.id,
            batchId: batch ? batch.id : null,
            quantitySold,
            saleDate,
            salePrice: product.unitPrice,
            wasNudged: Math.random() < 0.2,
          },
        });
      }
    }

    const nudge1 = await this.prisma.nudgeStrategy.create({
      data: {
        name: 'Diskon 20% Dairy Near-Expiry',
        type: NudgeType.DISCOUNT,
        discountPercentage: 20,
        startDate: new Date('2026-06-25'),
        endDate: new Date('2026-07-05'),
        status: NudgeStatus.ACTIVE,
        createdById: marketing.id,
      },
    });

    const nudge2 = await this.prisma.nudgeStrategy.create({
      data: {
        name: 'Label Urgensi Protein',
        type: NudgeType.URGENCY_LABEL,
        startDate: new Date('2026-06-28'),
        endDate: new Date('2026-07-04'),
        status: NudgeStatus.ACTIVE,
        createdById: marketing.id,
      },
    });

    await this.prisma.nudgeProduct.create({ data: { nudgeId: nudge1.id, productId: products[0].id } });
    await this.prisma.nudgeProduct.create({ data: { nudgeId: nudge1.id, productId: products[1].id } });
    await this.prisma.nudgeProduct.create({ data: { nudgeId: nudge2.id, productId: products[11].id } });

    for (let i = 0; i < 50; i++) {
      const strategy = Math.random() < 0.6 ? nudge1 : nudge2;
      const prodId = strategy === nudge1 ? products[0].id : products[11].id;
      const eventType = Math.random() < 0.6 ? NudgeEventType.IMPRESSION : Math.random() < 0.75 ? NudgeEventType.CLICK : NudgeEventType.CONVERSION;

      await this.prisma.nudgeActivityLog.create({
        data: {
          nudgeId: strategy.id,
          eventType,
          productId: prodId,
          occurredAt: new Date(baseDate.getTime() - Math.random() * 3 * 24 * 60 * 60 * 1000),
        },
      });
    }

    for (const product of products) {
      const forecastDate = new Date(baseDate);
      for (let day = 0; day < 3; day++) {
        const targetDate = new Date(forecastDate);
        targetDate.setDate(forecastDate.getDate() + day);

        await this.prisma.demandForecast.create({
          data: {
            productId: product.id,
            forecastDate: targetDate,
            predictedDemand: Math.floor(Math.random() * 12) + 8,
            modelVersion: 'MA-v1.0',
          },
        });
      }
    }

    await this.prisma.reorderRecommendation.create({
      data: {
        productId: products[1].id,
        currentStock: 80,
        recommendedQuantity: 45,
        urgency: Urgency.HIGH,
        aiReasoning: 'Stok sangat rendah (defisit 30 unit) dan sisa umur simpan mepet (3 hari). Segera pesan.',
        status: ReorderStatus.PENDING,
      },
    });

    await this.prisma.reorderRecommendation.create({
      data: {
        productId: products[7].id,
        currentStock: 150,
        recommendedQuantity: 15,
        urgency: Urgency.LOW,
        aiReasoning: 'Stok mencukupi perkiraan demand. Pesan ulang preventif.',
        status: ReorderStatus.PENDING,
      },
    });

    for (let i = 30; i >= 1; i--) {
      const snapshotDate = new Date(baseDate);
      snapshotDate.setDate(baseDate.getDate() - i);

      await this.prisma.analyticsSnapshot.create({
        data: {
          snapshotDate,
          wasteReductionPct: 80 + Math.random() * 9,
          demandAccuracyPct: 88 + Math.random() * 5,
          sellThroughRatePct: 75 + Math.random() * 8,
          inventoryTurnover: 4.0 + Math.random() * 1.2,
          customerSatisfaction: 4.0 + Math.random() * 0.5,
          itemsRecovered: Math.floor(Math.random() * 30) + 10,
          foodSavedThisMonth: Math.floor(Math.random() * 100) + 50,
          sustainabilityScore: 78 + Math.random() * 10,
        },
      });
    }

    return { message: 'Database reset & reseeded successfully.' };
  }
}
