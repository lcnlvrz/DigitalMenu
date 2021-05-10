import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FindUser } from 'src/modules/user/use-cases/find-user/find-user';
import { RegisterOutputDto } from '../register/register.dto';
import { LoginInputDto, LoginOutputDto } from './login.dto';

@Injectable()
export class Login {
  constructor(
    private readonly jwtService: JwtService,
    private readonly findUser: FindUser,
  ) {}

  async execute(dto: LoginInputDto): Promise<RegisterOutputDto> {
    const payload = { email: dto.email, sub: dto.id };
    const user = await this.findUser.byEmail(dto.email);
    delete user.password;
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
}
