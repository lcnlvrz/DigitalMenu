import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from '../order/order.module';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { Answer } from './entities/answer.entity';
import { Question } from './entities/question.entity';
import { SurveyFormResponse } from './entities/survey-form-response.entity';
import { SurveyForm } from './entities/survey-form.entity';
import { SurveyFormController } from './survey-form.controller';
import { CreateAnswer } from './use-cases/create-answer/create-answer';
import { CreateQuestion } from './use-cases/create-question/create-question';
import { CreateSurveyFormResponse } from './use-cases/create-survey-form-response/create-survey-form-response';
import { CreateSurveyForm } from './use-cases/create-survey-form/create-survey-form';
import { GetQuestion } from './use-cases/get-question/get-question';
import { GetRatingReviews } from './use-cases/get-rating-reviews/get-rating-reviews';
import { GetSurveyFormResponse } from './use-cases/get-survey-form-response/get-survey-form-response';
import { GetSurveyForm } from './use-cases/get-survey-form/get-survey-form';
import { HandleCreateSurveyFormResponse } from './use-cases/handle-create-survey-form-response/handle-create-survey-form-response';
import { HandleCreateSurveyForm } from './use-cases/handle-create-survey-form/handle-create-survey-form';
import { HandleRemoveQuestion } from './use-cases/handle-remove-question/handle-remove-question';
import { HandleUpdateSurveyForm } from './use-cases/handle-update-survey-form/handle-update-survey-form';
import { RemoveQuestion } from './use-cases/remove-question/remove-question';
import { UpdateQuestion } from './use-cases/update-question/update-question';
import { UpdateStatusSurveyFormResponse } from './use-cases/update-status-survey-form-response/update-status-survey-form-response';
import { UpdateSurveyForm } from './use-cases/update-survey-form/update-survey-form';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Question,
      SurveyForm,
      SurveyFormResponse,
      Answer,
    ]),
    forwardRef(() => RestaurantModule),
    forwardRef(() => OrderModule),
  ],
  providers: [
    CreateQuestion,
    CreateSurveyForm,
    HandleCreateSurveyForm,
    GetSurveyForm,
    UpdateSurveyForm,
    UpdateQuestion,
    GetQuestion,
    RemoveQuestion,
    CreateSurveyFormResponse,
    GetSurveyFormResponse,
    UpdateStatusSurveyFormResponse,
    HandleUpdateSurveyForm,
    HandleRemoveQuestion,
    HandleCreateSurveyFormResponse,
    CreateAnswer,
    GetRatingReviews,
  ],
  controllers: [SurveyFormController],
  exports: [GetQuestion, GetRatingReviews],
})
export class SurveyFormModule {}
