import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyForm } from '../../entities/survey-form.entity';
import { UpdateSurveyFormDto } from './update-survey-form.dto';

@Injectable()
export class UpdateSurveyForm {
  constructor(
    @InjectRepository(SurveyForm)
    private readonly surveyFormRepository: Repository<SurveyForm>,
  ) {}

  async execute(
    surveyForm: SurveyForm,
    dto: UpdateSurveyFormDto,
  ): Promise<SurveyForm> {
    const surveyFormUpdated = this.surveyFormRepository.merge(surveyForm, dto);
    return await this.surveyFormRepository.save(surveyFormUpdated);
  }
}
