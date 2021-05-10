import { Injectable } from '@nestjs/common';
import { GetRestaurant } from 'src/modules/restaurant/use-cases/get-restaurant/get-restaurant';
import { User } from 'src/modules/user/entities/user.entity';
import { SurveyForm } from '../../entities/survey-form.entity';
import { CreateQuestion } from '../create-question/create-question';
import { CreateSurveyForm } from '../create-survey-form/create-survey-form';
import { HandleCreateSurveyFormDto } from './handle-create-survey-form.dto';

@Injectable()
export class HandleCreateSurveyForm {
  constructor(
    private readonly createQuestion: CreateQuestion,
    private readonly createSurveyForm: CreateSurveyForm,
    private readonly getRestaurant: GetRestaurant,
  ) {}

  async execute(
    dto: HandleCreateSurveyFormDto,
    user: User,
  ): Promise<SurveyForm> {
    const { questions, ...surveyFormData } = dto;
    const restaurant = await this.getRestaurant.byOwner(user);
    const surveyForm = await this.createSurveyForm.execute(
      surveyFormData,
      restaurant,
    );
    const questionsStored = await Promise.all(
      questions.map(async (question) => {
        return await this.createQuestion.execute(surveyForm, question);
      }),
    );
    delete surveyForm.restaurant;
    return { ...surveyForm, questions: questionsStored };
  }
}
