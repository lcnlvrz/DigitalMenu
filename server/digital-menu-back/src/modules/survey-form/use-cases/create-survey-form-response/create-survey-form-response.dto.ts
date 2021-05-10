import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TypesQuestion } from '../../entities/question.entity';

export class AnswerDto {
  @IsEnum(TypesQuestion)
  @IsString()
  @IsNotEmpty()
  type: TypesQuestion;

  @IsString()
  @IsNotEmpty()
  question: string;

  @IsNotEmpty()
  answer: any;
}

export class CreateSurveyFormResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];

  @IsNumber()
  @IsPositive()
  surveyFormId: number;

  @IsNumber()
  @IsPositive()
  orderId: number;
}
