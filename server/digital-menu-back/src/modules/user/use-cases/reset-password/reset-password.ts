import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { ResetPasswordDto } from './reset-password.dto';

@Injectable()
export class ResetPassword {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(user: User, dto: ResetPasswordDto) {
    user.password = dto.newPassword;
    await this.userRepository.save(user);
    return { message: 'Password Changed Successfully' };
  }
}
