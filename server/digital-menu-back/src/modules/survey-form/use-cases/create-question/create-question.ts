import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../../entities/question.entity';
import { SurveyForm } from '../../entities/survey-form.entity';
import { CreateQuestionDto } from './create-question.dto';

@Injectable()
export class CreateQuestion {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async execute(
    surveyForm: SurveyForm,
    dto: CreateQuestionDto,
  ): Promise<Question> {
    const question = await this.questionRepository.create(dto);
    question.surveyForm = surveyForm;
    return await this.questionRepository.save(question);
  }
}
