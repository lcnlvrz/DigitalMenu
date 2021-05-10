import { PartialType } from '@nestjs/mapped-types';
import { IntersectionType } from '@nestjs/mapped-types';
import { IsBoolean } from 'class-validator';
import { CreateSurveyFormDto } from '../create-survey-form/create-survey-form.dto';

class IsPublic {
  @IsBoolean()
  isPublic: boolean;
}

export class UpdateSurveyFormDto extends PartialType(
  IntersectionType(CreateSurveyFormDto, IsPublic),
) {}
