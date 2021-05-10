import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../create-user/create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email', 'role', 'password']),
) {}
