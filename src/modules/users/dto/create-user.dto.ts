import { Type } from "class-transformer";
import { MaxLength, IsNotEmpty, IsEmail, IsString } from "class-validator";


export class CreateUserDto {
  @IsString({ message: 'El nombre debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @MaxLength(30, { message: 'El nombre no puede ocupar más de 30 caracteres'})
  readonly name: string;

  @IsNotEmpty({ message: 'El nombre de usuario no puede estar vacío' })
  @IsString({ message: 'El nombre de usuario debe ser una cadena de caracteres' })
  @MaxLength(30, { message: 'El nombre de usuario no puede ocupar más de 30 caracteres'})
  readonly username: string;

  @IsNotEmpty({ message: 'El email de usuario no puede estar vacío' })
  @IsString({ message: 'El email debe ser una cadena de caracteres' })
  @MaxLength(50, { message: 'El email no puede ocupar más de 50 caracteres' })
  readonly email: string;

  @IsNotEmpty({ message: 'La contraseña de usuario no puede estar vacío' })
  @IsString({ message: 'La contraseña debe ser una cadena de caracteres' })
  @MaxLength(50, { message: 'La contraseña no puede ocupar más de 50 caracteres' })
  password: string;

  @IsNotEmpty({ message: 'La contraseña de usuario no puede estar vacío' })
  @IsString({ message: 'La contraseña debe ser una cadena de caracteres' })
  @MaxLength(50, { message: 'La contraseña no puede ocupar más de 50 caracteres' })
  passwordCompare: string;
}