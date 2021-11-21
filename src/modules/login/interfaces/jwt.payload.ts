import { RoleType } from "src/modules/role/roletype.enum";

export interface JwtPayload {
    id: number;
  username: string;
  email: string;
  roles: RoleType[];
  iat?: Date;
}
