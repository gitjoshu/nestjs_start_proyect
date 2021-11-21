import { Role } from "src/modules/role/entities/role.entity";

export interface IUsers {
  readonly id: number;
  readonly name: string;
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly roles: Role[];
}
