import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @IsString({ message: 'El nombre debe ser una cadena de caracteres' })
  @MaxLength(20, { message: 'El nombre no puede ocupar más de 20 caracteres' })
  readonly name: string;

  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  @IsString({ message: 'La descripción debe ser una cadena de caracteres' })
  @MaxLength(100, {
    message: 'La descripción no puede ocupar más de 100 caracteres',
  })
  readonly description: string;
}
