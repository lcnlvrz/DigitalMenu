import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { FindUser } from '../find-user/find-user';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class CreateUser {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(dto);
    return await this.userRepository.save(user);
  }
}
