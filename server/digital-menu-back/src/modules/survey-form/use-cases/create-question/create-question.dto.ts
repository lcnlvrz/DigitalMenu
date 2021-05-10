import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { TypesQuestion } from '../../entities/question.entity';

export class CreateQuestionDto {
  @IsBoolean()
  isMandatoryQuestion: boolean;

  @IsEnum(TypesQuestion)
  @IsString()
  @IsNotEmpty()
  type: TypesQuestion;

  @IsString()
  @IsNotEmpty()
  value: string;
}

export class UpdateQuestionDto {
  @IsBoolean()
  isMandatoryQuestion: boolean;

  @IsEnum(TypesQuestion)
  @IsString()
  @IsNotEmpty()
  type: TypesQuestion;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  id: number;
}
