import {
  Controller,
  Put,
  Get,
  Body,
  Res,
  Param,
  UseGuards,
  HttpStatus,
  NotFoundException,
  Patch,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuard } from "@nestjs/passport";
import { UserProfileDto } from "./dto/user-profile.dto";
import { IUsers } from "./interfaces/users.interface";
import { ReadUserDto } from "./dto/read-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { RoleType } from "../role/roletype.enum";
import { Roles } from "../role/decorators/role.decorator";
import { RoleGuard } from "../role/guards/role.guard";

// @UseGuards(AuthGuard("jwt"), RoleGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @Get("/:userId/profile")
  public async getUser(@Res() res, @Param("userId") userId: string ): Promise<IUsers> {
    const user = await this._usersService.findById(userId);

    if (!user) {
      throw new NotFoundException("El usuario no existe");
    }

    return res.status(HttpStatus.OK).json({
      user: user,
      status: 200,
    });
  }

  // @Roles(RoleType.administrator)
  @Get()
  public async getUsers(@Res() res): Promise<ReadUserDto[]> {
    const users = await this._usersService.getAll();

    return res.status(HttpStatus.OK).json({
      users: users,
      status: 200
    })
  }

  @Put("/:userId/profile")
  public async updateProfileUser(
    @Res() res,
    @Param('userId') userId: string, 
    @Body() userProfileDto: UserProfileDto
  ): Promise<any> {
    try {
      await this._usersService.updateProfileUser(userId, userProfileDto);

      return res.status(HttpStatus.OK).json({
        message: "Usuario editado correctamente",
        status: 200,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Error: El usuario no se ha podido actualizar",
        status: 400,
      });
    }
  }

  @Patch("/:userId/update-user")
  public async updateUserByAdmin(
    @Res() res,
    @Param('userId') userId: number, 
    @Body() userProfileDto: UpdateUserDto
  ): Promise<ReadUserDto> {
    try {
      await this._usersService.updateUserByAdmin(userId, userProfileDto);

      return res.status(HttpStatus.OK).json({
        message: "Usuario editado correctamente",
        status: 200,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Error: El usuario no se ha podido actualizar",
        status: 400,
      });
    }
  }

  @Delete(':userId')
  public async deleteUser(@Res() res, @Param('userId', ParseIntPipe) id: number) {
    try {
      await this._usersService.delete(id);
      return res.status(HttpStatus.OK).json({
        message: 'Usuario borrado correctamente',
        status: 200,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: El usuario no se ha podido borrar',
        status: 400,
      });
    }
  }
}
