import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/entities/user.entity';
import { GetQuestion } from '../get-question/get-question';
import { RemoveQuestion } from '../remove-question/remove-question';
import { UpdateSurveyForm } from '../update-survey-form/update-survey-form';
import { HandleRemoveQuestionOutput } from './handle-remove-question.dto';

@Injectable()
export class HandleRemoveQuestion {
  constructor(
    private readonly getQuestion: GetQuestion,
    private readonly updateSurveyForm: UpdateSurveyForm,
    private readonly removeQuestion: RemoveQuestion,
  ) {}

  async execute(
    owner: User,
    questionId: number,
  ): Promise<HandleRemoveQuestionOutput> {
    const question = await this.getQuestion.oneByQuestionIdAndOwner(
      questionId,
      owner,
    );
    let isChangedStatus: boolean = false;
    if (
      question.surveyForm.questions.length === 1 &&
      question.surveyForm.isPublic
    ) {
      isChangedStatus = true;
      await this.updateSurveyForm.execute(question.surveyForm, {
        isPublic: false,
      });
    }
    const questionRemoved = await this.removeQuestion.execute(question);
    return { ...questionRemoved, isChangedStatus };
  }
}
