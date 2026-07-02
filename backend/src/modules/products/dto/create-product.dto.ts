import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'SKU tidak boleh kosong.' })
  @IsString()
  sku: string;

  @IsNotEmpty({ message: 'Nama produk tidak boleh kosong.' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'ID Kategori tidak boleh kosong.' })
  @IsString()
  categoryId: string;

  @IsNotEmpty({ message: 'Satuan tidak boleh kosong.' })
  @IsString()
  unit: string;

  @IsNotEmpty({ message: 'Shelf life tidak boleh kosong.' })
  @IsNumber()
  @IsPositive()
  shelfLifeDays: number;

  @IsNotEmpty({ message: 'Harga modal tidak boleh kosong.' })
  @IsNumber()
  @IsPositive()
  unitCost: number;

  @IsNotEmpty({ message: 'Harga jual tidak boleh kosong.' })
  @IsNumber()
  @IsPositive()
  unitPrice: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
