import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTableDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  securityPassword: string;
}
