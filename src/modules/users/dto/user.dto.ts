import { Type } from "class-transformer";
import { MaxLength, IsNotEmpty, IsEmail, IsString } from "class-validator";
import { ReadRoleDto } from "src/modules/role/dtos";


export class UserDto {
  @IsString({ message: 'El nombre debe ser una cadena de caracteres' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @MaxLength(30, { message: 'El nombre no puede ocupar más de 30 caracteres'})
  readonly name: string;

  @IsNotEmpty({ message: 'El nombre de usuario no puede estar vacío' })
  @IsString({ message: 'El nombre debe ser una cadena de caracteres' })
  readonly username: string;

  @IsNotEmpty({ message: 'El email de usuario no puede estar vacío' })
  @IsString({ message: 'El email debe ser una cadena de caracteres' })
  readonly email: string;

  @Type(type => ReadRoleDto)
  roles: ReadRoleDto[];

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  password: string;
}
