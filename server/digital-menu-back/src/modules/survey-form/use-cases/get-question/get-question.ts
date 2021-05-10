import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Question } from '../../entities/question.entity';
import { SurveyForm } from '../../entities/survey-form.entity';
import { ObjectWithKeys } from '../get-survey-form-response/get-survey-form-response';

@Injectable()
export class GetQuestion {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async manyBySurveyFormId(surveyFormId: number): Promise<Question[]> {
    return await this.questionRepository
      .createQueryBuilder('question')
      .leftJoin('question.surveyForm', 'surveyForm')
      .where('surveyForm.id = :surveyFormId', { surveyFormId })
      .getMany();
  }

  async oneByQuestionIdAndSurveyFormId(
    surveyFormId: number,
    questionId: number,
  ): Promise<Question> {
    return await this.questionRepository
      .createQueryBuilder('question')
      .leftJoin('question.surveyForm', 'surveyForm')
      .where('surveyForm.id = :surveyFormId', { surveyFormId })
      .andWhere('question.id = :questionId', { questionId })
      .getOne();
  }

  async oneByQuestionIdAndOwner(
    questionId: number,
    owner: User,
  ): Promise<Question> {
    return await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.surveyForm', 'surveyForm')
      .leftJoinAndSelect('surveyForm.questions', 'otherQuestion')
      .leftJoin('surveyForm.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .andWhere('question.id = :questionId', { questionId })
      .getOne();
  }
}
