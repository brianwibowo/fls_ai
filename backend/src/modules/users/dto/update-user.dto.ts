import { IsNotEmpty, IsEnum, IsBoolean, IsOptional, IsString } from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Nama tidak boleh kosong.' })
  name?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role tidak valid.' })
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString({ message: 'No. Telepon harus berupa teks.' })
  phoneNumber?: string;
}
