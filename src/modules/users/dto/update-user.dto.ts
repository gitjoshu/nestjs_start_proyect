import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Role } from 'src/modules/role/entities/role.entity';


export class UpdateUserDto {
  @IsString({ message: 'El nombre debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @MaxLength(30, { message: 'El nombre no puede ocupar más de 30 caracteres' })
  name: string;

  @IsNotEmpty({ message: 'El nombre de usuario no puede estar vacío' })
  @MaxLength(30, { message: 'El nombre no puede ocupar más de 30 caracteres' })
  @IsString({ message: 'El nombre debe ser una cadena de caracteres' })
  username: string;

  @IsNotEmpty({ message: 'El email de usuario no puede estar vacío' })
  @IsString({ message: 'El email debe ser una cadena de caracteres' })
  @MaxLength(50, { message: 'El email no puede ocupar más de 50 caracteres' })
  email: string;

  @IsNotEmpty()
  roles: Role[];
}
