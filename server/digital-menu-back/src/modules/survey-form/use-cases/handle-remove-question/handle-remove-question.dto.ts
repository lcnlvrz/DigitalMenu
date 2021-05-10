import { IntersectionType } from '@nestjs/mapped-types';
import { Question } from '../../entities/question.entity';

class CalculateValues {
  isChangedStatus?: boolean;
}

export class HandleRemoveQuestionOutput extends IntersectionType(
  Question,
  CalculateValues,
) {}
