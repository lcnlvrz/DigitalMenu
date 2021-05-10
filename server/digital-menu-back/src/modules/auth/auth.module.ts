import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWT_SECRET } from 'src/config/constants';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { Login } from './use-cases/login';
import { Register } from './use-cases/register';
import { SendMailResetPassword } from './use-cases/send-mail-reset-password/send-mail-reset-password';

@Module({
  imports: [
    UserModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>(JWT_SECRET),
        signOptions: { expiresIn: '14d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    Login,
    Register,
    LocalStrategy,
    JwtStrategy,
    SendMailResetPassword,
  ],
  exports: [JwtModule],
})
export class AuthModule {}
