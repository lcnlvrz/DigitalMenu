import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { ReqUser } from '../auth/decorators/req-user.decorator';
import { JwtStrategyGuard } from '../auth/guards/jwt-strategy.guard';
import { User } from './entities/user.entity';
import { ResetPassword } from './use-cases/reset-password/reset-password';
import { ResetPasswordDto } from './use-cases/reset-password/reset-password.dto';
import { UpdateUser } from './use-cases/update-user/update-user';
import { UpdateUserDto } from './use-cases/update-user/update-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly updateUser: UpdateUser,
    private readonly resetPassword: ResetPassword,
  ) {}

  @UseGuards(JwtStrategyGuard)
  @Put()
  async executeUpdateUser(
    @Body() dto: UpdateUserDto,
    @ReqUser() user: User,
  ): Promise<User> {
    const userUpdated = await this.updateUser.execute(user, dto);
    delete userUpdated.password;
    return userUpdated;
  }

  @UseGuards(JwtStrategyGuard)
  @Put('password')
  async executeResetPassword(
    @Body() dto: ResetPasswordDto,
    @ReqUser() user: User,
  ) {
    return await this.resetPassword.execute(user, dto);
  }
}
