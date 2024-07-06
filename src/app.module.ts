import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entities';
import { Role } from './user/entities/roles.entities';
import { Permissions } from './user/entities/permissions.entities';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt_secret'),
          signOptions: {
            expiresIn: '30m' // 默认 30 分钟
          }
        }
      },
      inject: [ConfigService]
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/.env'
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          type: 'mysql',
          host: configService.get('mysql_server_host'),
          port: configService.get('mysql_server_port'),
          username: configService.get('mysql_server_username'),
          password: configService.get('mysql_server_password'),
          database: configService.get('mysql_server_database'),

          logging: true,//打印生成的 sql 语句
          entities: [User, Role, Permissions],//指定有哪些和数据库的表对应的 Entity
          poolSize: 10,//数据库连接池中连接的最大数量
          synchronize: true,//同步创建表
          connectorPackage: 'mysql2',//是指定用什么驱动包
          extra: {
            authPlugin: 'sha256_password',
          }
        }
      },
      inject: [ConfigService]
    }),
    UserModule,
    RedisModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
