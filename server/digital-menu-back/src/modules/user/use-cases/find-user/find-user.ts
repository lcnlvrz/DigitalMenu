import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

export class FindUser {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async byEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async byId(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async byIdWithoutPassword(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    delete user.password;
    return user;
  }
}
