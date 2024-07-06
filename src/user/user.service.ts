import {
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entities';
import { Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { md5 } from 'src/utils';
import { Role } from './entities/roles.entities';
import { Permissions } from './entities/permissions.entities';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVo } from './vo/login-user.vo';

@Injectable()
export class UserService {
    private logger = new Logger();

    @InjectRepository(User)
    private userRepository: Repository<User>;

    @InjectRepository(Role)
    private rolesRepository: Repository<Role>;

    @InjectRepository(Permissions)
    private permissionsRepository: Repository<Permissions>;

    @Inject(RedisService)
    private redisService: RedisService;

    async register(user: RegisterUserDto) {
        const captcha = await this.redisService.get(`captcha_${user.email}`);

        if (!captcha) {
            throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
        }

        if (user.captcha !== captcha) {
            throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
        }

        const foundUser = await this.userRepository.findOneBy({
            username: user.username,
        });
        if (foundUser) {
            throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
        }

        const newUser = new User();
        newUser.username = user.username;
        newUser.password = md5(user.password);
        newUser.email = user.email;
        newUser.nickName = user.nickName;
        try {
            await this.userRepository.save(newUser);
            return '注册成功';
        } catch (e) {
            this.logger.error(e, UserService);
            return '注册失败';
        }
    }

    async login(loginUserDto: LoginUserDto, isAdmin: boolean): Promise<LoginUserVo> {
        const user = await this.userRepository.findOne({
            where: {
                username: loginUserDto.username,
                isAdmin
            },
            relations: ['roles', 'roles.permissions']
        });

        if (!user) {
            throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
        }

        if (user.password !== md5(loginUserDto.password)) {
            throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
        }
        const vo = new LoginUserVo();
        vo.userInfo = {
            id: user.id,
            username: user.username,
            nickName: user.nickName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            headPic: user.headPic,
            createTime: user.createTime.getTime(),
            isFrozen: user.isFrozen,
            isAdmin: user.isAdmin,
            roles: user.roles.map(item => item.name),
            permissions: user.roles.reduce((arr, item) => {
                item.permissions.forEach(permission => {
                    if (arr.indexOf(permission) === -1) {
                        arr.push(permission);
                    }
                })
                return arr;
            }, [])
        }
        return vo;
    }

    async findUserById(userId: number, isAdmin: boolean) {
        const user = await this.userRepository.findOne({
            where: {
                id: userId,
                isAdmin
            },
            relations: ['roles', 'roles.permissions']
        });

        return {
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
            roles: user.roles.map(item => item.name),
            permissions: user.roles.reduce((arr, item) => {
                item.permissions.forEach(permission => {
                    if (arr.indexOf(permission) === -1) {
                        arr.push(permission);
                    }
                })
                return arr;
            }, [])
        }
    }


}
