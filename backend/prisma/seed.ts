import { PrismaClient, UserRole, BatchStatus, NudgeType, NudgeStatus, NudgeEventType, ReorderStatus, Urgency } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.nudgeActivityLog.deleteMany();
  await prisma.nudgeProduct.deleteMany();
  await prisma.salesTransaction.deleteMany();
  await prisma.reorderRecommendation.deleteMany();
  await prisma.demandForecast.deleteMany();
  await prisma.inventoryBatch.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.nudgeStrategy.deleteMany();
  await prisma.user.deleteMany();
  await prisma.analyticsSnapshot.deleteMany();

  console.log('Seeding users...');
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const logisticsPassword = await bcrypt.hash('logistics123', salt);
  const marketingPassword = await bcrypt.hash('marketing123', salt);

  const admin = await prisma.user.create({
    data: {
      name: 'Freashday Admin',
      email: 'admin@freashday.com',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  const logistics = await prisma.user.create({
    data: {
      name: 'Logistics Manager',
      email: 'logistics@freashday.com',
      passwordHash: logisticsPassword,
      role: UserRole.LOGISTICS_MANAGER,
    },
  });

  const marketing = await prisma.user.create({
    data: {
      name: 'Marketing Manager',
      email: 'marketing@freashday.com',
      passwordHash: marketingPassword,
      role: UserRole.MARKETING_MANAGER,
    },
  });

  console.log('Seeding categories...');
  const dairy = await prisma.category.create({ data: { name: 'Dairy', description: 'Produk susu, keju, dan olahannya' } });
  const bakery = await prisma.category.create({ data: { name: 'Bakery', description: 'Roti, kue, dan produk panggangan' } });
  const produce = await prisma.category.create({ data: { name: 'Produce', description: 'Sayuran segar dan buah-buahan' } });
  const protein = await prisma.category.create({ data: { name: 'Protein', description: 'Daging, ayam, ikan, dan telur' } });

  console.log('Seeding products...');
  const productsData = [
    // Dairy
    { sku: 'DRY-001', name: 'Susu Segar Pasteurisasi 1L', categoryId: dairy.id, unit: 'pcs', shelfLifeDays: 7, unitCost: 15000, unitPrice: 19500, imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=200' },
    { sku: 'DRY-002', name: 'Yogurt Plain 200ml', categoryId: dairy.id, unit: 'pcs', shelfLifeDays: 14, unitCost: 8000, unitPrice: 11000, imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=200' },
    { sku: 'DRY-003', name: 'Keju Mozzarella 250g', categoryId: dairy.id, unit: 'pcs', shelfLifeDays: 30, unitCost: 28000, unitPrice: 38000, imageUrl: 'https://images.unsplash.com/photo-1552763442-15967bfb41e8?auto=format&fit=crop&q=80&w=200' },
    { sku: 'DRY-004', name: 'Mentega Tawar 200g', categoryId: dairy.id, unit: 'pcs', shelfLifeDays: 45, unitCost: 22000, unitPrice: 30000, imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=200' },
    // Bakery
    { sku: 'BKR-001', name: 'Roti Tawar Gandum', categoryId: bakery.id, unit: 'pcs', shelfLifeDays: 4, unitCost: 12000, unitPrice: 17000, imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200' },
    { sku: 'BKR-002', name: 'Croissant Butter', categoryId: bakery.id, unit: 'pcs', shelfLifeDays: 3, unitCost: 9000, unitPrice: 15000, imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=200' },
    { sku: 'BKR-003', name: 'Roti Sobek Cokelat', categoryId: bakery.id, unit: 'pcs', shelfLifeDays: 5, unitCost: 10000, unitPrice: 14500, imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=200' },
    // Produce
    { sku: 'PRD-001', name: 'Bayam Segar 250g', categoryId: produce.id, unit: 'pcs', shelfLifeDays: 3, unitCost: 2500, unitPrice: 4000, imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=200' },
    { sku: 'PRD-002', name: 'Tomat Cherry 500g', categoryId: produce.id, unit: 'pcs', shelfLifeDays: 7, unitCost: 12000, unitPrice: 18000, imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=200' },
    { sku: 'PRD-003', name: 'Wortel Baby 300g', categoryId: produce.id, unit: 'pcs', shelfLifeDays: 10, unitCost: 6000, unitPrice: 9000, imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=200' },
    { sku: 'PRD-004', name: 'Pisang Cavendish Sisir', categoryId: produce.id, unit: 'pcs', shelfLifeDays: 6, unitCost: 15000, unitPrice: 22000, imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=200' },
    // Protein
    { sku: 'PTN-001', name: 'Dada Ayam Fillet 500g', categoryId: protein.id, unit: 'pcs', shelfLifeDays: 4, unitCost: 32000, unitPrice: 45000, imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=200' },
    { sku: 'PTN-002', name: 'Ikan Salmon Fillet 200g', categoryId: protein.id, unit: 'pcs', shelfLifeDays: 3, unitCost: 55000, unitPrice: 75000, imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=200' },
    { sku: 'PTN-003', name: 'Telur Ayam Omega 10s', categoryId: protein.id, unit: 'pcs', shelfLifeDays: 14, unitCost: 20000, unitPrice: 28000, imageUrl: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&q=80&w=200' },
  ];

  const products: any[] = [];
  for (const p of productsData) {
    const created = await prisma.product.create({ data: p });
    products.push(created);
  }

  console.log('Seeding inventory batches...');
  const baseDate = new Date('2026-07-02');
  const batches: any[] = [];

  for (const product of products) {
    // Fresh batch
    const freshReceivedDate = new Date(baseDate);
    freshReceivedDate.setDate(baseDate.getDate() - 1);
    const freshExpiryDate = new Date(freshReceivedDate);
    freshExpiryDate.setDate(freshReceivedDate.getDate() + product.shelfLifeDays);

    const freshBatch = await prisma.inventoryBatch.create({
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

    // Near-expiry batch (received earlier)
    const oldReceivedDate = new Date(baseDate);
    oldReceivedDate.setDate(baseDate.getDate() - (product.shelfLifeDays - 2));
    const oldExpiryDate = new Date(oldReceivedDate);
    oldExpiryDate.setDate(oldReceivedDate.getDate() + product.shelfLifeDays);

    const oldBatch = await prisma.inventoryBatch.create({
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

  console.log('Seeding sales transactions...');
  const sales: any[] = [];
  // Generate 30 days of sales history (June 2026)
  for (let i = 30; i >= 1; i--) {
    const saleDate = new Date(baseDate);
    saleDate.setDate(baseDate.getDate() - i);
    const isWeekend = saleDate.getDay() === 0 || saleDate.getDay() === 6;

    for (const product of products) {
      // Base demand is between 5 and 15
      let quantitySold = Math.floor(Math.random() * 10) + 5;
      // Higher sales on weekends
      if (isWeekend) quantitySold = Math.floor(quantitySold * 1.4);

      // Find Oldest Batch for FEFO
      const activeBatches = batches.filter(
        (b) => b.productId === product.id && new Date(b.expiryDate) > saleDate
      );

      const batch = activeBatches.length > 0 ? activeBatches[0] : null;

      const sale = await prisma.salesTransaction.create({
        data: {
          productId: product.id,
          batchId: batch ? batch.id : null,
          quantitySold,
          saleDate,
          salePrice: product.unitPrice,
          wasNudged: Math.random() < 0.2, // 20% sales are nudged
        },
      });
      sales.push(sale);
    }
  }

  console.log('Seeding nudge strategies...');
  const nudge1 = await prisma.nudgeStrategy.create({
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

  const nudge2 = await prisma.nudgeStrategy.create({
    data: {
      name: 'Label Urgensi Protein',
      type: NudgeType.URGENCY_LABEL,
      startDate: new Date('2026-06-28'),
      endDate: new Date('2026-07-04'),
      status: NudgeStatus.ACTIVE,
      createdById: marketing.id,
    },
  });

  // Connect strategies to products
  await prisma.nudgeProduct.create({ data: { nudgeId: nudge1.id, productId: products[0].id } }); // DRY-001
  await prisma.nudgeProduct.create({ data: { nudgeId: nudge1.id, productId: products[1].id } }); // DRY-002
  await prisma.nudgeProduct.create({ data: { nudgeId: nudge2.id, productId: products[11].id } }); // PTN-001

  console.log('Seeding activity logs...');
  for (let i = 0; i < 50; i++) {
    const strategy = Math.random() < 0.6 ? nudge1 : nudge2;
    const prodId = strategy === nudge1 ? products[0].id : products[11].id;
    const eventType = Math.random() < 0.6 ? NudgeEventType.IMPRESSION : Math.random() < 0.75 ? NudgeEventType.CLICK : NudgeEventType.CONVERSION;

    await prisma.nudgeActivityLog.create({
      data: {
        nudgeId: strategy.id,
        eventType,
        productId: prodId,
        occurredAt: new Date(baseDate.getTime() - Math.random() * 3 * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log('Seeding demand forecasts...');
  for (const product of products) {
    const forecastDate = new Date(baseDate);
    // Predict next 3 days
    for (let day = 0; day < 3; day++) {
      const targetDate = new Date(forecastDate);
      targetDate.setDate(forecastDate.getDate() + day);

      await prisma.demandForecast.create({
        data: {
          productId: product.id,
          forecastDate: targetDate,
          predictedDemand: Math.floor(Math.random() * 12) + 8,
          modelVersion: 'MA-v1.0',
        },
      });
    }
  }

  console.log('Seeding reorder recommendations...');
  await prisma.reorderRecommendation.create({
    data: {
      productId: products[1].id, // DRY-002
      currentStock: 80,
      recommendedQuantity: 45,
      urgency: Urgency.HIGH,
      aiReasoning: 'Stok sangat rendah (defisit 30 unit) dan shelf life pendek (3 hari). Segera pesan ulang.',
      status: ReorderStatus.PENDING,
    },
  });

  await prisma.reorderRecommendation.create({
    data: {
      productId: products[7].id, // PRD-001
      currentStock: 150,
      recommendedQuantity: 15,
      urgency: Urgency.LOW,
      aiReasoning: 'Stok mendekati prediksi demand. Reorder preventif disarankan.',
      status: ReorderStatus.PENDING,
    },
  });

  console.log('Seeding analytics snapshots...');
  for (let i = 30; i >= 1; i--) {
    const snapshotDate = new Date(baseDate);
    snapshotDate.setDate(baseDate.getDate() - i);

    await prisma.analyticsSnapshot.create({
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

  console.log('Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
