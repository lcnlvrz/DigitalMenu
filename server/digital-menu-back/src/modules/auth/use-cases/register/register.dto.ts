import { User } from 'src/modules/user/entities/user.entity';

export interface RegisterOutputDto {
  accessToken: string;
  user: User;
}
