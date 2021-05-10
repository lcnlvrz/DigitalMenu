import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/use-cases/create-user/create-user.dto';
import { ReqUser } from './decorators/req-user.decorator';
import { JwtStrategyGuard } from './guards/jwt-strategy.guard';
import { LocalStrategyGuard } from './guards/local-strategy.guard';
import { Login } from './use-cases/login';
import { LoginOutputDto } from './use-cases/login/login.dto';
import { Register } from './use-cases/register';
import { SendMailResetPassword } from './use-cases/send-mail-reset-password/send-mail-reset-password';
import { SendMailResetPasswordDto } from './use-cases/send-mail-reset-password/send-mail-reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly register: Register,
    private readonly login: Login,
    private readonly sendMailResetPassword: SendMailResetPassword,
  ) {}

  @Post('mail-password')
  async executeSendMailResetPassword(
    @Body() dto: SendMailResetPasswordDto,
  ): Promise<any> {
    return await this.sendMailResetPassword.execute(dto);
  }

  @Post('register')
  async executeRegister(@Body() dto: CreateUserDto): Promise<LoginOutputDto> {
    return await this.register.execute(dto);
  }

  @UseGuards(LocalStrategyGuard)
  @Post('login')
  async executeLogin(@ReqUser() dto: User) {
    return await this.login.execute({ email: dto.email, id: dto.id });
  }

  @UseGuards(JwtStrategyGuard)
  @Get('me')
  async executeFindUser(@ReqUser() user: User): Promise<User> {
    delete user.password;
    return user;
  }
}
