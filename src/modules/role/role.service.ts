import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { ReadRoleDto, CreateRoleDto, UpdateRoleDto } from './dtos';
import { plainToClass } from 'class-transformer';
import { Status } from 'src/shared/entity-status.num';
import { REQUEST } from '@nestjs/core';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly _roleRepository: Repository<Role>,
    @Inject(REQUEST) private request,
  ) {}

  async get(id: number): Promise<ReadRoleDto> {
    if (!id) {
      throw new BadRequestException('Es necesario enviar un id');
    }

    const role: Role = await this._roleRepository.findOne(id, {
      where: { status: Status.ACTIVE },
    });

    if (!role) {
      throw new NotFoundException(`No hay ningún rol con el id: ${id}`);
    }

    return plainToClass(ReadRoleDto, role);
  }

  async getAll(): Promise<ReadRoleDto[]> {
    const roles: Role[] = await this._roleRepository.find({
      where: { status: Status.ACTIVE },
    });
    if (!roles) {
      throw new NotFoundException(
        `No se encontraron roles en la base de datos`,
      );
    }

    return roles.map((role) => plainToClass(ReadRoleDto, role));
  }

  async create(role: CreateRoleDto): Promise<ReadRoleDto> {
    const roleNameExist: Role = await this._roleRepository.findOne({
      where: { name: role.name, status: Status.ACTIVE },
    });
    if (!roleNameExist) {
      const savedRole: Role = await this._roleRepository.save(role);
      return plainToClass(ReadRoleDto, savedRole);
    }
    throw new BadRequestException('Este nombre de rol ya existe');
  }

  async update(id: number, role: UpdateRoleDto): Promise<ReadRoleDto> {
    const roleExists: Role = await this._roleRepository.findOne(id, {
      where: { status: Status.ACTIVE },
    });
    if(!roleExists){
      throw new NotFoundException(`El rol con id: ${id} no existe`);
    }

    const roleNameExist: Role = await this._roleRepository.findOne({
      where: { name: role.name, status: Status.ACTIVE },
    });

    if(!roleNameExist || (roleExists.name === role.name)){
      const updatedRole = await this._roleRepository.update(id, role);
      return plainToClass(ReadRoleDto, updatedRole);
    }
    throw new BadRequestException('Este nombre de rol ya existe');

  }

  async delete(id: number): Promise<void> {
    const roleExists = await this._roleRepository.findOne(id, {
      where: { status: Status.ACTIVE },
    });

    if (!roleExists) {
      throw new NotFoundException(`No se encontró un rol para el id: ${id}`);
    }

    await this._roleRepository.update(id, { status: Status.INACTIVE });
  }
}
