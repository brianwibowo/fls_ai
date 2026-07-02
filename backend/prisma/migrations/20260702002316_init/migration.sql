-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'LOGISTICS_MANAGER', 'MARKETING_MANAGER');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'SOLD_OUT', 'DISPOSED');

-- CreateEnum
CREATE TYPE "StockStatus" AS ENUM ('OPTIMAL', 'LOW', 'OVERSTOCK');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "NudgeType" AS ENUM ('DISCOUNT', 'BUNDLING', 'URGENCY_LABEL', 'GAMIFICATION_BADGE');

-- CreateEnum
CREATE TYPE "NudgeStatus" AS ENUM ('ACTIVE', 'SCHEDULED', 'ENDED');

-- CreateEnum
CREATE TYPE "ReorderStatus" AS ENUM ('PENDING', 'ORDERED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "NudgeEventType" AS ENUM ('IMPRESSION', 'CLICK', 'CONVERSION');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "shelfLifeDays" INTEGER NOT NULL,
    "unitCost" DECIMAL(12,2) NOT NULL,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_batches" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "batchCode" TEXT NOT NULL,
    "quantityReceived" INTEGER NOT NULL,
    "quantityCurrent" INTEGER NOT NULL,
    "receivedDate" DATE NOT NULL,
    "expiryDate" DATE NOT NULL,
    "status" "BatchStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_transactions" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "batchId" TEXT,
    "quantitySold" INTEGER NOT NULL,
    "saleDate" DATE NOT NULL,
    "salePrice" DECIMAL(12,2) NOT NULL,
    "wasNudged" BOOLEAN NOT NULL DEFAULT false,
    "nudgeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sales_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demand_forecasts" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "forecastDate" DATE NOT NULL,
    "predictedDemand" INTEGER NOT NULL,
    "actualDemand" INTEGER,
    "modelVersion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "demand_forecasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reorder_recommendations" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "currentStock" INTEGER NOT NULL,
    "recommendedQuantity" INTEGER NOT NULL,
    "urgency" "Urgency" NOT NULL,
    "aiReasoning" TEXT NOT NULL,
    "status" "ReorderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reorder_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nudge_strategies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "NudgeType" NOT NULL,
    "discountPercentage" DECIMAL(5,2),
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "status" "NudgeStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nudge_strategies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nudge_products" (
    "id" TEXT NOT NULL,
    "nudgeId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "nudge_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nudge_activity_logs" (
    "id" TEXT NOT NULL,
    "nudgeId" TEXT NOT NULL,
    "eventType" "NudgeEventType" NOT NULL,
    "productId" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nudge_activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_snapshots" (
    "id" TEXT NOT NULL,
    "snapshotDate" DATE NOT NULL,
    "wasteReductionPct" DECIMAL(5,2) NOT NULL,
    "demandAccuracyPct" DECIMAL(5,2) NOT NULL,
    "sellThroughRatePct" DECIMAL(5,2) NOT NULL,
    "inventoryTurnover" DECIMAL(5,2) NOT NULL,
    "customerSatisfaction" DECIMAL(3,2) NOT NULL,
    "itemsRecovered" INTEGER NOT NULL,
    "foodSavedThisMonth" INTEGER NOT NULL,
    "sustainabilityScore" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE INDEX "inventory_batches_expiryDate_idx" ON "inventory_batches"("expiryDate");

-- CreateIndex
CREATE INDEX "inventory_batches_status_idx" ON "inventory_batches"("status");

-- CreateIndex
CREATE INDEX "sales_transactions_saleDate_idx" ON "sales_transactions"("saleDate");

-- CreateIndex
CREATE INDEX "sales_transactions_productId_idx" ON "sales_transactions"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "demand_forecasts_productId_forecastDate_key" ON "demand_forecasts"("productId", "forecastDate");

-- CreateIndex
CREATE UNIQUE INDEX "nudge_products_nudgeId_productId_key" ON "nudge_products"("nudgeId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "analytics_snapshots_snapshotDate_key" ON "analytics_snapshots"("snapshotDate");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_batches" ADD CONSTRAINT "inventory_batches_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_transactions" ADD CONSTRAINT "sales_transactions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_transactions" ADD CONSTRAINT "sales_transactions_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "inventory_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_transactions" ADD CONSTRAINT "sales_transactions_nudgeId_fkey" FOREIGN KEY ("nudgeId") REFERENCES "nudge_strategies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demand_forecasts" ADD CONSTRAINT "demand_forecasts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reorder_recommendations" ADD CONSTRAINT "reorder_recommendations_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nudge_strategies" ADD CONSTRAINT "nudge_strategies_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nudge_products" ADD CONSTRAINT "nudge_products_nudgeId_fkey" FOREIGN KEY ("nudgeId") REFERENCES "nudge_strategies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nudge_products" ADD CONSTRAINT "nudge_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nudge_activity_logs" ADD CONSTRAINT "nudge_activity_logs_nudgeId_fkey" FOREIGN KEY ("nudgeId") REFERENCES "nudge_strategies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nudge_activity_logs" ADD CONSTRAINT "nudge_activity_logs_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
