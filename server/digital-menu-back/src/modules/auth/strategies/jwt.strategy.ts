import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWT_SECRET } from 'src/config/constants';
import { FindUser } from '../../user/use-cases/find-user/find-user';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly findUser: FindUser,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>(JWT_SECRET),
    });
  }

  async validate(payload: any): Promise<User> {
    return await this.findUser.byId(payload.sub);
  }
}
