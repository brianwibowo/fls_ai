import { IsNotEmpty, IsEnum, IsBoolean, IsOptional } from 'class-validator';
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
}
