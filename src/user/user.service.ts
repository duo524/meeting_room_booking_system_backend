import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entities';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    @InjectRepository(User)
    private userRepository: Repository<User>;
}
