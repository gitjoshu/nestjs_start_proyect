import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RegisterController } from "./register.controller";
import { RegisterService } from "./register.service";
import { UsersService } from "../users/users.service";
import { Users } from "../users/entities/users.entity";
import { Role } from "../role/entities/role.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Users, Role])],
  controllers: [RegisterController],
  providers: [RegisterService, UsersService],
})
export class RegisterModule {}
