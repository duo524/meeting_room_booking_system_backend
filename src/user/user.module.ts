import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entities';
import { Role } from './entities/roles.entities';
import {Permissions} from './entities/permissions.entities'

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Role,Permissions])
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
