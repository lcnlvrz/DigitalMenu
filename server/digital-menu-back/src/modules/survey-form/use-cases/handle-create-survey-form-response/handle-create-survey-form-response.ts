import { ForbiddenException, Injectable } from '@nestjs/common';
import { GetOrder } from 'src/modules/order/use-cases/get-order/get-order';
import { Answer } from '../../entities/answer.entity';
import { SurveyFormResponse } from '../../entities/survey-form-response.entity';
import { CreateAnswer } from '../create-answer/create-answer';
import { CreateSurveyFormResponse } from '../create-survey-form-response/create-survey-form-response';
import { CreateSurveyFormResponseDto } from '../create-survey-form-response/create-survey-form-response.dto';
import { GetSurveyForm } from '../get-survey-form/get-survey-form';

@Injectable()
export class HandleCreateSurveyFormResponse {
  constructor(
    private readonly getSurveyForm: GetSurveyForm,
    private readonly getOrder: GetOrder,
    private readonly createSurveyFormResponse: CreateSurveyFormResponse,
    private readonly createAnswer: CreateAnswer,
  ) {}

  async execute(dto: CreateSurveyFormResponseDto): Promise<SurveyFormResponse> {
    const surveyForm = await this.getSurveyForm.oneById(dto.surveyFormId);
    const order = await this.getOrder.byId(dto.orderId);
    if (order.surveyFormResponse) {
      throw new ForbiddenException({
        code: 'order_already_answered',
        detail: 'This ordery has been already answered',
      });
    }
    const answers = await Promise.all(
      dto.answers.map(async (answer) => {
        return await this.createAnswer.execute(order, answer);
      }),
    );
    const surveyFormResponse = await this.createSurveyFormResponse.execute(
      dto,
      surveyForm,
      order,
      answers,
    );
    delete surveyFormResponse.order;
    return surveyFormResponse;
  }
}
