import { Strategy } from 'passport-local';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { compare } from 'bcrypt';
import { User } from 'src/modules/user/entities/user.entity';
import { FindUser } from 'src/modules/user/use-cases/find-user/find-user';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly findUser: FindUser) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.findUser.byEmail(email);
    if (!user) {
      throw new NotFoundException({
        code: 'email_does_not_exist',
        detail: "The email doesn't exist",
      });
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        code: 'invalid_credentials',
        detail: 'The credentials are invalid',
      });
    }

    return user;
  }
}
