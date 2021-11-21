import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RoleService } from '../role/role.service';
import { Role } from '../role/entities/role.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Users, Role])
    ],
    controllers: [UsersController],
    providers: [UsersService, RoleService]
})
export class UsersModule {}
