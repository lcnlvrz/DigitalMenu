import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/modules/order/entities/order.entity';
import { Repository } from 'typeorm';
import { Answer } from '../../entities/answer.entity';
import { SurveyFormResponse } from '../../entities/survey-form-response.entity';
import { SurveyForm } from '../../entities/survey-form.entity';
import { CreateSurveyFormResponseDto } from './create-survey-form-response.dto';

@Injectable()
export class CreateSurveyFormResponse {
  constructor(
    @InjectRepository(SurveyFormResponse)
    private readonly surveyFormResponseRepository: Repository<SurveyFormResponse>,
  ) {}

  async execute(
    dto: CreateSurveyFormResponseDto,
    surveyForm: SurveyForm,
    order: Order,
    answers: Answer[],
  ): Promise<SurveyFormResponse> {
    const surveyFormResponse = await this.surveyFormResponseRepository.create({
      answers: dto.answers,
    });
    surveyFormResponse.surveyForm = surveyForm;
    surveyFormResponse.order = order;
    surveyFormResponse.answers = answers;
    return await this.surveyFormResponseRepository.save(surveyFormResponse);
  }
}
