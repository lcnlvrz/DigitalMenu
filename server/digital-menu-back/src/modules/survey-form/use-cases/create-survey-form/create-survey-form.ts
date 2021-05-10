import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/modules/restaurant/entities/restaurant.entity';
import { Repository } from 'typeorm';
import { Question } from '../../entities/question.entity';
import { SurveyForm } from '../../entities/survey-form.entity';
import { CreateSurveyFormDto } from './create-survey-form.dto';

@Injectable()
export class CreateSurveyForm {
  constructor(
    @InjectRepository(SurveyForm)
    private readonly surveyFormRepository: Repository<SurveyForm>,
  ) {}

  async execute(
    dto: CreateSurveyFormDto,
    restaurant: Restaurant,
  ): Promise<SurveyForm> {
    const surveyForm = this.surveyFormRepository.create(dto);
    surveyForm.restaurant = restaurant;
    return await this.surveyFormRepository.save(surveyForm);
  }
}
