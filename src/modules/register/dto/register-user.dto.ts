import { MaxLength, IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { Role } from 'src/modules/role/entities/role.entity';


export class RegisterUserDto {
  readonly id: number;

  @IsString()
  @MaxLength(30)
  readonly name: string;

  @IsString()
  @MaxLength(40)
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  password: string;

  readonly roles: Role[];
}
