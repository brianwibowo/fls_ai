import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { sku: createProductDto.sku },
    });
    if (existing) {
      throw new ConflictException('Produk dengan SKU ini sudah ada.');
    }

    return this.prisma.product.create({
      data: {
        sku: createProductDto.sku,
        name: createProductDto.name,
        categoryId: createProductDto.categoryId,
        unit: createProductDto.unit,
        shelfLifeDays: createProductDto.shelfLifeDays,
        unitCost: createProductDto.unitCost,
        unitPrice: createProductDto.unitPrice,
        imageUrl: createProductDto.imageUrl,
      },
    });
  }

  async findAll(category?: string, search?: string) {
    const where: any = { isActive: true };
    if (category && category !== 'all') {
      where.category = { name: category };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { sku: 'asc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        batches: {
          where: { quantityCurrent: { gt: 0 }, status: 'ACTIVE' },
          orderBy: { expiryDate: 'asc' },
        },
      },
    });
    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan.');
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    if (updateProductDto.sku) {
      const existing = await this.prisma.product.findFirst({
        where: { sku: updateProductDto.sku, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException('SKU sudah digunakan oleh produk lain.');
      }
    }
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
