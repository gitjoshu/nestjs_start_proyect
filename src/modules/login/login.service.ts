import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt.payload';
import { LoginDto } from './dto/login.dto';
import { IUsers } from '../users/interfaces/users.interface';
import { UsersService } from '../users/users.service';
import { RoleType } from '../role/roletype.enum';
import { expiresTimeTokenTime } from 'src/shared/expires-time-token-time';

@Injectable()
export class LoginService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private async validate(loginDto: LoginDto): Promise<IUsers> {
    return await this.usersService.findByEmail(loginDto.email);
  }

  public async login(
    loginDto: LoginDto,
  ): Promise<any | { status: number; message: string }> {
    return this.validate(loginDto).then(userData => {
      if (!userData) {
        throw new UnauthorizedException();
      }

      const passwordIsValid = bcrypt.compareSync(
        loginDto.password,
        userData.password,
      );

      if (!passwordIsValid == true) {
        return {
          message: 'Fallo de autenticación. Contraseña incorrecta.',
          status: 400,
        };
      }

      const payload = {
        name: userData.name,
        email: userData.email,
        id: userData.id,
        roles: userData.roles.map(r => r.name as RoleType),
      };

      const accessToken = this.jwtService.sign(payload);
      const expirationTimeToken = new Date();
      expirationTimeToken.setSeconds(expirationTimeToken.getSeconds()+expiresTimeTokenTime);

      return {
        expiresIn: expirationTimeToken,
        accessToken: accessToken,
        user: payload,
        status: 200,
      };
    });
  }

  public async validateUserByJwt(payload: JwtPayload) {
    // This will be used when the user has already logged in and has a JWT
    const user = await this.usersService.findByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException();
    }
    return this.createJwtPayload(user);
  }

  protected createJwtPayload(user) {
    const data: JwtPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles.map(r => r.name as RoleType),
    };

    const jwt = this.jwtService.sign(data);

    return {
      expiresIn: expiresTimeTokenTime,
      token: jwt,
    };
  }
}
