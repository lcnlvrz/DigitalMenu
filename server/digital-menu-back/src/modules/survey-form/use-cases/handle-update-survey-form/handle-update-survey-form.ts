import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { User } from 'src/modules/user/entities/user.entity';
import { SurveyForm } from '../../entities/survey-form.entity';
import { CreateQuestion } from '../create-question/create-question';
import { GetQuestion } from '../get-question/get-question';
import { GetSurveyForm } from '../get-survey-form/get-survey-form';
import { UpdateQuestion } from '../update-question/update-question';
import { UpdateSurveyForm } from '../update-survey-form/update-survey-form';
import { HandleUpdateSurveyFormDto } from './handle-update-survey-form.dto';

@Injectable()
export class HandleUpdateSurveyForm {
  constructor(
    private readonly getSurveyForm: GetSurveyForm,
    private readonly getQuestion: GetQuestion,
    private readonly createQuestion: CreateQuestion,
    private readonly updateSurveyForm: UpdateSurveyForm,
    private readonly updateQuestion: UpdateQuestion,
  ) {}

  async execute(
    dto: HandleUpdateSurveyFormDto,
    owner: User,
    surveyFormId: number,
  ): Promise<SurveyForm> {
    const { questions, ...surveyFormData } = dto;
    const surveyForm = await this.getSurveyForm.oneByOwnerAndId(
      owner,
      surveyFormId,
    );
    if (
      !surveyForm.questions.length &&
      dto.isPublic &&
      !dto.questions?.length
    ) {
      throw new ConflictException({
        code: 'survey_form_no_questions',
        detail:
          "You can't public this form because it doesn't have any questions saved",
      });
    }
    const surveyFormUpdated = await this.updateSurveyForm.execute(
      surveyForm,
      surveyFormData,
    );
    if (questions) {
      const questionsStoredUpdated = await Promise.all(
        questions.map(async (question) => {
          const questionStored = await this.getQuestion.oneByQuestionIdAndSurveyFormId(
            surveyForm.id,
            question.id,
          );

          if (questionStored) {
            return await this.updateQuestion.execute(questionStored, question);
          } else {
            const questionCreated = await this.createQuestion.execute(
              surveyForm,
              question,
            );
            delete questionCreated.surveyForm;
            return questionCreated;
          }
        }),
      );
      return { ...surveyFormUpdated, questions: questionsStoredUpdated };
    } else {
      return surveyFormUpdated;
    }
  }
}
