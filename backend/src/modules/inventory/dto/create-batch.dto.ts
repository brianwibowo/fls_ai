import { IsNotEmpty, IsNumber, IsPositive, IsString, IsDateString } from 'class-validator';

export class CreateBatchDto {
  @IsNotEmpty({ message: 'ID produk tidak boleh kosong.' })
  @IsString()
  productId: string;

  @IsNotEmpty({ message: 'Kode batch tidak boleh kosong.' })
  @IsString()
  batchCode: string;

  @IsNotEmpty({ message: 'Jumlah kuantiti diterima tidak boleh kosong.' })
  @IsNumber()
  @IsPositive()
  quantityReceived: number;

  @IsNotEmpty({ message: 'Tanggal masuk tidak boleh kosong.' })
  @IsDateString()
  receivedDate: string;

  @IsNotEmpty({ message: 'Tanggal kadaluarsa tidak boleh kosong.' })
  @IsDateString()
  expiryDate: string;
}
