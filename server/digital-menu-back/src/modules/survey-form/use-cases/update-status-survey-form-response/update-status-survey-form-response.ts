import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SurveyFormResponse,
  SurveyFormResponseStatus,
} from '../../entities/survey-form-response.entity';
import { SurveyForm } from '../../entities/survey-form.entity';

@Injectable()
export class UpdateStatusSurveyFormResponse {
  constructor(
    @InjectRepository(SurveyFormResponse)
    private readonly surveyFormResponse: Repository<SurveyFormResponse>,
  ) {}

  async execute(
    surveyFormResponse: SurveyFormResponse,
  ): Promise<SurveyFormResponse> {
    if (surveyFormResponse.status === SurveyFormResponseStatus.CLOSED) {
      surveyFormResponse.status = SurveyFormResponseStatus.OPEN;
    } else {
      surveyFormResponse.status = SurveyFormResponseStatus.CLOSED;
    }
    return await this.surveyFormResponse.save(surveyFormResponse);
  }
}
