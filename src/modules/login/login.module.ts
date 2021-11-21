import { Module } from "@nestjs/common";
import { LoginService } from "./login.service";
import { LoginController } from "./login.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { ConfigModule } from '@nestjs/config';
import { Users } from "../users/entities/users.entity";
import { UsersService } from "../users/users.service";
import { Role } from "../role/entities/role.entity";
import { expiresTimeTokenTime } from "src/shared/expires-time-token-time";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Users, Role]),
    PassportModule.register({ defaultStrategy: "jwt", session: false }),
    JwtModule.register({
      secret: process.env.SECRET_KEY_JWT,
      signOptions: {
        expiresIn: expiresTimeTokenTime,
      },
    }),
  ],
  providers: [LoginService, UsersService, JwtStrategy],
  controllers: [LoginController],
})
export class LoginModule {}
