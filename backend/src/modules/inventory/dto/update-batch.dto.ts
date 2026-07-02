import { IsOptional, IsNumber, IsPositive, IsEnum } from 'class-validator';
import { BatchStatus } from '@prisma/client';

export class UpdateBatchDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  quantityCurrent?: number;

  @IsOptional()
  @IsEnum(BatchStatus)
  status?: BatchStatus;
}
