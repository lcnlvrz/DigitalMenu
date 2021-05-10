import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FindUser } from 'src/modules/user/use-cases/find-user/find-user';
import { SendMailResetPasswordDto } from './send-mail-reset-password.dto';

@Injectable()
export class SendMailResetPassword {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly findUser: FindUser,
  ) {}

  async execute(dto: SendMailResetPasswordDto): Promise<any> {
    const user = await this.findUser.byEmail(dto.email);
    if (!user) {
      throw new NotFoundException({
        code: 'not_found_user',
        detail: "This user doesn't exist",
      });
    }

    const token = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { expiresIn: '15d' },
    );
    return await this.mailerService.sendMail({
      to: dto.email,
      from: 'noreply@digital-menu.com',
      subject: 'Change Your Password',
      template: './reset-password',
      context: {
        baseURL: process.env.APP_BASE_URL,
        linkResetPassword:
          process.env.APP_BASE_URL + '/auth/change-password?token=' + token,
      },
    });
  }
}
