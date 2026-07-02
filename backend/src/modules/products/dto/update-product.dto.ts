import { IsOptional, IsNumber, IsPositive, IsString, IsBoolean } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  shelfLifeDays?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  unitCost?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  unitPrice?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
