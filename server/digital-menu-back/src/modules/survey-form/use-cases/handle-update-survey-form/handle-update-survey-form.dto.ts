import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { UpdateSurveyFormDto } from '../update-survey-form/update-survey-form.dto';
import { QuestionsFromBodyWithId } from '../handle-create-survey-form/handle-create-survey-form.dto';

export class HandleUpdateSurveyFormDto extends IntersectionType(
  UpdateSurveyFormDto,
  PartialType(QuestionsFromBodyWithId),
) {}
