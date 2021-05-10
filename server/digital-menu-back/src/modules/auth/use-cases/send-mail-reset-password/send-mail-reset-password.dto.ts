import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendMailResetPasswordDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
}
