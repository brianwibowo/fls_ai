import { IsNotEmpty, IsEnum, IsOptional, IsNumber, IsPositive, IsDateString, IsArray } from 'class-validator';
import { NudgeType, NudgeStatus } from '@prisma/client';

export class CreateNudgeDto {
  @IsNotEmpty({ message: 'Nama strategi tidak boleh kosong.' })
  name: string;

  @IsEnum(NudgeType, { message: 'Tipe nudge tidak valid.' })
  type: NudgeType;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  discountPercentage?: number;

  @IsNotEmpty({ message: 'Tanggal mulai tidak boleh kosong.' })
  @IsDateString()
  startDate: string;

  @IsNotEmpty({ message: 'Tanggal berakhir tidak boleh kosong.' })
  @IsDateString()
  endDate: string;

  @IsNotEmpty({ message: 'Target produk tidak boleh kosong.' })
  @IsArray()
  productIds: string[];

  @IsOptional()
  @IsEnum(NudgeStatus)
  status?: NudgeStatus;
}
