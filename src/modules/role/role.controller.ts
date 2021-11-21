import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, ReadRoleDto } from './dtos';
import { Roles } from './decorators/role.decorator';
import { RoleType } from './roletype.enum';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from './guards/role.guard';

// @Roles(RoleType.administrator)
// @UseGuards(AuthGuard(), RoleGuard)
@Controller('roles')
export class RoleController {
  constructor(private readonly _roleService: RoleService) {}

  
  @Get(':id')
  public async getRole(
    @Res() res,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReadRoleDto> {
    const role = await this._roleService.get(id);
    return res.status(HttpStatus.OK).json({
      role: role,
      status: 200,
    });
  }

  @Get()
  public async getRoles(@Res() res): Promise<ReadRoleDto[]> {
    const roles = await this._roleService.getAll();
    return res.status(HttpStatus.OK).json({
      roles: roles,
      status: 200,
    });
  }

  @Post('create')
  public async createRole(
    @Res() res,
    @Body() role: CreateRoleDto,
  ): Promise<ReadRoleDto> {
    try {
      await this._roleService.create(role);
      return res.status(HttpStatus.OK).json({
        message: 'Rol creado correctamente',
        status: 200,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: El rol no se ha podido crear',
        status: 400,
      });
    }
  }

  @Patch(':id')
  public async updateRole(
    @Res() res,
    @Param('id', ParseIntPipe) id: number,
    @Body() role: ReadRoleDto,
  ) {
    try {
      await await this._roleService.update(id, role);
      return res.status(HttpStatus.OK).json({
        message: 'Rol editado correctamente',
        status: 200,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: El rol no se ha podido editar',
        status: 400,
      });
    }
  }

  @Delete(':id')
  public async deleteRole(@Res() res, @Param('id', ParseIntPipe) id: number) {
    try {
      await this._roleService.delete(id);
      return res.status(HttpStatus.OK).json({
        message: 'Rol borrado correctamente',
        status: 200,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: El rol no se ha podido borrar',
        status: 400,
      });
    }
  }
}
