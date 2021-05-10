import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(25)
  @MaxLength(200)
  description: string;
}
