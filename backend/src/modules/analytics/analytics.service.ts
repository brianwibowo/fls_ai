import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const latestSnapshot = await this.prisma.analyticsSnapshot.findFirst({
      orderBy: { snapshotDate: 'desc' },
    });

    if (latestSnapshot) {
      return {
        sustainabilityScore: Number(latestSnapshot.sustainabilityScore),
        wasteReduction: Number(latestSnapshot.wasteReductionPct),
        demandAccuracy: Number(latestSnapshot.demandAccuracyPct),
        sellThroughRate: Number(latestSnapshot.sellThroughRatePct),
        inventoryTurnover: Number(latestSnapshot.inventoryTurnover),
        customerSatisfaction: Number(latestSnapshot.customerSatisfaction),
        itemsRecovered: latestSnapshot.itemsRecovered,
        foodSavedThisMonth: latestSnapshot.foodSavedThisMonth,
        activeNudges: 5,
        riskItems: 12,
        nudgeConversion: 18.7,
      };
    }

    return {
      sustainabilityScore: 82.3,
      wasteReduction: 87.5,
      demandAccuracy: 91.2,
      sellThroughRate: 78.4,
      inventoryTurnover: 4.8,
      customerSatisfaction: 4.2,
      itemsRecovered: 156,
      foodSavedThisMonth: 156,
      activeNudges: 5,
      riskItems: 12,
      nudgeConversion: 18.7,
    };
  }

  async getTrends() {
    const snapshots = await this.prisma.analyticsSnapshot.findMany({
      orderBy: { snapshotDate: 'asc' },
      take: 30,
    });

    return snapshots.map((s) => ({
      week: new Date(s.snapshotDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      wasteReduction: Number(s.wasteReductionPct),
      turnover: Number(s.inventoryTurnover),
    }));
  }

  async getCategoryPerformance() {
    return [
      { category: 'Dairy', foodLoss: 15.2, nudgeEffectiveness: 22.5, sellThrough: 72.1, totalProducts: 4, disposed: 12 },
      { category: 'Bakery', foodLoss: 18.7, nudgeEffectiveness: 15.3, sellThrough: 68.4, totalProducts: 3, disposed: 18 },
      { category: 'Produce', foodLoss: 8.3, nudgeEffectiveness: 12.1, sellThrough: 85.2, totalProducts: 4, disposed: 8 },
      { category: 'Protein', foodLoss: 10.1, nudgeEffectiveness: 19.8, sellThrough: 82.7, totalProducts: 3, disposed: 10 },
    ];
  }

  async getInsights() {
    return [
      { id: '1', type: 'warning', text: 'Kategori Bakery memiliki risiko food loss tertinggi minggu ini (18.7%) — pertimbangkan promosi tambahan atau bundling.', category: 'Bakery' },
      { id: '2', type: 'success', text: 'Strategi nudging efektif! Conversion rate 18.7% menunjukkan konsumen responsif terhadap promosi near-expiry.', category: 'Global' },
      { id: '3', type: 'info', text: 'Kategori Produce memiliki sell-through rate tertinggi (85.2%). Pertahankan volume stok saat ini.', category: 'Produce' },
      { id: '4', type: 'success', text: 'Tren waste reduction membaik +5.4% dalam 5 minggu terakhir. Sistem berjalan efektif!', category: 'Global' },
      { id: '5', type: 'warning', text: '5 produk mengalami overstock. Pertimbangkan diskon atau bundling untuk mencegah food loss.', category: 'Inventory' },
    ];
  }

  async createSnapshot() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.analyticsSnapshot.upsert({
      where: { snapshotDate: today },
      update: {
        wasteReductionPct: 87.5,
        demandAccuracyPct: 91.2,
        sellThroughRatePct: 78.4,
        inventoryTurnover: 4.8,
        customerSatisfaction: 4.2,
        itemsRecovered: 156,
        foodSavedThisMonth: 156,
        sustainabilityScore: 82.3,
      },
      create: {
        snapshotDate: today,
        wasteReductionPct: 87.5,
        demandAccuracyPct: 91.2,
        sellThroughRatePct: 78.4,
        inventoryTurnover: 4.8,
        customerSatisfaction: 4.2,
        itemsRecovered: 156,
        foodSavedThisMonth: 156,
        sustainabilityScore: 82.3,
      },
    });
  }
}
