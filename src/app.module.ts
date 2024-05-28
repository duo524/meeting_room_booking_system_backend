import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entities';
import { Role } from './user/entities/roles.entities';
import { Permissions } from './user/entities/permissions.entities';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'renjinduo',
      database: 'meeting_room_booking_system',

      logging: true,//打印生成的 sql 语句
      entities: [User, Role, Permissions],//指定有哪些和数据库的表对应的 Entity
      poolSize: 10,//数据库连接池中连接的最大数量
      synchronize: true,//同步创建表
      connectorPackage: 'mysql2',//是指定用什么驱动包
      extra: {
        authPlugin: 'sha256_password',
      }
    }),
    UserModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
