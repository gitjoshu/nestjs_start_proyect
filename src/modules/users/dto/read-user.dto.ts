import { Type } from "class-transformer";
import { MaxLength, IsNotEmpty, IsEmail, IsString } from "class-validator";
import { ReadRoleDto } from "src/modules/role/dtos";


export class ReadUserDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly username: string;

  @IsString()
  readonly email: string;

  @Type(type => ReadRoleDto)
  readonly roles: ReadRoleDto[];

}