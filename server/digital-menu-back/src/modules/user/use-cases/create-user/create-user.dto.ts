import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRoles } from '../../user.roles';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  password: string;

  @IsArray()
  @IsEnum(UserRoles, { each: true })
  role: UserRoles[];
}
