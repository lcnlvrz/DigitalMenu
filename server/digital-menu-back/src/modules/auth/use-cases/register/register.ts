import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUser } from 'src/modules/user/use-cases/create-user';
import { CreateUserDto } from 'src/modules/user/use-cases/create-user/create-user.dto';
import { FindUser } from 'src/modules/user/use-cases/find-user/find-user';
import { UserRoles } from 'src/modules/user/user.roles';
import { Login } from '../login';
import { RegisterOutputDto } from './register.dto';

@Injectable()
export class Register {
  constructor(
    private readonly findUser: FindUser,
    private readonly createUser: CreateUser,
    private readonly login: Login,
  ) {}

  async execute(dto: CreateUserDto): Promise<RegisterOutputDto> {
    const oldUser = await this.findUser.byEmail(dto.email);
    if (oldUser) {
      throw new ConflictException({
        code: 'email_already_exist',
        message: 'The email already exist',
      });
    }
    const user = await this.createUser.execute(dto);
    const { accessToken } = await this.login.execute({
      email: user.email,
      id: user.id,
    });
    delete user.password;
    return { accessToken, user };
  }
}
