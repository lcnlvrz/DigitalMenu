import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UpdateUserDto } from './update-user.dto';

@Injectable()
export class UpdateUser {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(user: User, dto: UpdateUserDto): Promise<User> {
    const userUpdated = this.userRepository.merge(user, dto);
    return await this.userRepository.save(userUpdated);
  }
}
