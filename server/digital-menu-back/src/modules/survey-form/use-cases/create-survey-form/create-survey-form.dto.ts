import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateSurveyFormDto {
  @IsString()
  @IsNotEmpty()
  header: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
