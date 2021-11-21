import { Module } from "@nestjs/common";
import { ChangePasswordController } from "./change-password.controller";
import { ChangePasswordService } from "./change-password.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "../users/entities/users.entity";
import { UsersService } from "../users/users.service";
import { Role } from "../role/entities/role.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Users, Role])],
  controllers: [ChangePasswordController],
  providers: [ChangePasswordService, UsersService],
})
export class ChangePasswordModule {}
