import { IsNotEmpty, IsNumber, IsPositive, IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateSaleDto {
  @IsNotEmpty({ message: 'ID produk tidak boleh kosong.' })
  @IsString()
  productId: string;

  @IsNotEmpty({ message: 'Kuantiti terjual tidak boleh kosong.' })
  @IsNumber()
  @IsPositive()
  quantitySold: number;

  @IsNotEmpty({ message: 'Tanggal penjualan tidak boleh kosong.' })
  @IsDateString()
  saleDate: string;

  @IsNotEmpty({ message: 'Harga jual tidak boleh kosong.' })
  @IsNumber()
  @IsPositive()
  salePrice: number;

  @IsOptional()
  @IsBoolean()
  wasNudged?: boolean;

  @IsOptional()
  @IsString()
  nudgeId?: string;
}
