import { IsEmail, IsNotEmpty, IsEnum, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Nama tidak boleh kosong.' })
  name: string;

  @IsEmail({}, { message: 'Format email tidak valid.' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong.' })
  email: string;

  @IsNotEmpty({ message: 'Password tidak boleh kosong.' })
  @MinLength(6, { message: 'Password minimal 6 karakter.' })
  password: string;

  @IsEnum(UserRole, { message: 'Role tidak valid.' })
  role: UserRole;
}
