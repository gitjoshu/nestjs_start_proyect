import { Injectable, NotFoundException, HttpException, HttpStatus, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { IUsers } from './interfaces/users.interface';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { UserProfileDto } from './dto/user-profile.dto';
import { Role } from '../role/entities/role.entity';
import { RoleType } from '../role/roletype.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { Status } from 'src/shared/entity-status.num';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly _userRepository: Repository<Users>,
    @InjectRepository(Role)
    private readonly _roleRepository: Repository<Role>,
  ) {}

  async getAll(): Promise<ReadUserDto[]> {
    const users: Users[] = await this._userRepository.find({
      where: { status: Status.ACTIVE },
    });
    if(!users){
      throw new NotFoundException('No se encontraron usuarios en la base de datos');
    }

    return users.map((user) => plainToClass(ReadUserDto, user));
  }

  public async findByEmail(email: string): Promise<Users> {
    const user = await this._userRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new NotFoundException(`El usuario con email: ${email} no existe`);
    }

    return user;
  }

  public async findById(userId: string): Promise<Users> {
    const user = await this._userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(`El usuario con id: ${userId} no existe`);
    }

    return user;
  }

  public async create(userDto: UserDto): Promise<IUsers> {
    try {
      const defaultRole: Role = await this._roleRepository.findOne({
        where: { name: RoleType.general },
      });
      userDto.roles = [defaultRole];
      return await this._userRepository.save(userDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateByEmail(email: string): Promise<Users> {
    try {
      const user = await this._userRepository.findOne({ email: email });
      user.password = bcrypt.hashSync(
        Math.random()
          .toString(36)
          .slice(-8),
        8,
      );
      
      return await this._userRepository.save(user);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateByPassword(
    email: string,
    password: string,
  ): Promise<Users> {
    try {
      const user = await this._userRepository.findOne({ email: email });
      user.password = bcrypt.hashSync(password, 8);

      return await this._userRepository.save(user);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }

  }

  public async updateProfileUser(id: string, userProfileDto: UserProfileDto): Promise<Users> {
    try {
      const user = await this._userRepository.findOne({id: +id});
      user.name = userProfileDto.name;
      user.email = userProfileDto.email;
      user.username = userProfileDto.username;
      
      return await this._userRepository.save(user);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async updateUserByAdmin(id: number, user: UpdateUserDto): Promise<ReadUserDto> {
    const { username, email, roles } = user;
    const userIdExists: Users = await this._userRepository.findOne(id, {
      where: { status: Status.ACTIVE },
    });
    if (!userIdExists) {
      throw new NotFoundException(`El usuario con id: ${id} no existe`);
    }
    const userNameExists = await this._userRepository.findOne({
      where: [{ username }],
    });
    const userEmailExists = await this._userRepository.findOne({
      where: [ { email }],
    });
    if (userNameExists && (username !== userNameExists.username)){
      throw new ConflictException('El nombre de usuario ya existe');
    }
    if (userEmailExists && (email !== userEmailExists.email)){
      throw new ConflictException('El email de usuario ya existe');
    }

    const defaultRole: Role = await this._roleRepository.findOne({
      where: { name: RoleType.general },
    });
    roles.push(defaultRole);
    
    const newRoles: Role[] = await this._roleRepository.findByIds(
      roles,
      {
        where: {status: Status.ACTIVE},
      }
    )
    if(!roles){
      throw new NotFoundException(`Los roles introducidos no existen`)
    }
    user.roles = newRoles;
    
    const updatedsUser = await this._userRepository.save({...userIdExists, ...user});
    return plainToClass(ReadUserDto, updatedsUser);
    
  }

  async delete(id: number): Promise<void> {
    const userExist = await this._userRepository.findOne(id, {
      where: { status: Status.ACTIVE },
    });

    if (!userExist) {
      throw new NotFoundException(`No se encontró un usuario con id: ${id}`);
    }

    await this._userRepository.update(id, { status: Status.INACTIVE });
  }

}
