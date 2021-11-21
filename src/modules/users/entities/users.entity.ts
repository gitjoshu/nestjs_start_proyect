
import { Role } from 'src/modules/role/entities/role.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable } from 'typeorm';

@Entity('users')
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column( { nullable: false})
  name: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({
    unique: true, nullable: false
  })
  email: string;

  @Column({ length: 60, nullable: false })
  password: string;

  @ManyToMany(type => Role, role => role.users, { eager: true })
  @JoinTable({ name: 'user_roles' })
  roles: Role[];

  @Column({ type: 'varchar', default: 'ACTIVE', length: 8 })
  status: string;
}

