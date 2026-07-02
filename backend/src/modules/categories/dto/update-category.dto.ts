import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Nama kategori tidak boleh kosong.' })
  name?: string;

  @IsOptional()
  description?: string;
}
