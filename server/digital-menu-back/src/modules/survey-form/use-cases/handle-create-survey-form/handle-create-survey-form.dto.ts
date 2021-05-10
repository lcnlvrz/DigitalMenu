import { IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  CreateQuestionDto,
  UpdateQuestionDto,
} from '../create-question/create-question.dto';
import { CreateSurveyFormDto } from '../create-survey-form/create-survey-form.dto';

export class QuestionsFromBody {
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}

export class QuestionsFromBodyWithId {
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateQuestionDto)
  questions: UpdateQuestionDto[];
}

export class HandleCreateSurveyFormDto extends IntersectionType(
  CreateSurveyFormDto,
  QuestionsFromBody,
) {}
