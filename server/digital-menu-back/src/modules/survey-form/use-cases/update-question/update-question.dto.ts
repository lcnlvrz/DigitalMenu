import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDto } from '../create-question/create-question.dto';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}
