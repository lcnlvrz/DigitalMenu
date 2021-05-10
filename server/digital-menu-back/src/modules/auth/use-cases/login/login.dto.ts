import { IsEmail, IsNumber, IsPositive } from 'class-validator';

export class LoginInputDto {
  @IsEmail()
  email: string;

  @IsNumber()
  @IsPositive()
  id: number;
}

export interface LoginOutputDto {
  accessToken: string;
}
