import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewsRating } from 'src/modules/restaurant/use-cases/search-restaurants/search-restaurants';
import { TypesQuestion } from 'src/modules/survey-form/entities/question.entity';
import { SurveyFormResponse } from 'src/modules/survey-form/entities/survey-form-response.entity';
import { SurveyForm } from 'src/modules/survey-form/entities/survey-form.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetRatingReviews {
  constructor(
    @InjectRepository(SurveyFormResponse)
    private readonly surveyFormResponseRepository: Repository<SurveyFormResponse>,
  ) {}

  async execute(surveyForms: SurveyForm[]): Promise<ReviewsRating[]> {
    const answers = await Promise.all(
      surveyForms.map(async (surveyForm) => {
        return await this.surveyFormResponseRepository
          .createQueryBuilder('response')
          .leftJoin('response.surveyForm', 'surveyForm')
          .leftJoinAndSelect('response.answers', 'answer')
          .leftJoinAndSelect('response.order', 'order')
          .where('surveyForm.id = :surveyFormId', {
            surveyFormId: surveyForm.id,
          })
          .andWhere('answer.type = :rating', { rating: TypesQuestion.RATING })
          .orderBy('answer.createdAt', 'DESC')
          .getMany();
      }),
    );

    const reviewsSurveyForm: ReviewsRating[] = [];

    for (let i = 0; i < answers.length; i++) {
      const responses = answers[i];
      for (let i2 = 0; i2 < responses.length; i2++) {
        const response = responses[i2];
        for (let i3 = 0; i3 < responses[i2].answers.length; i3++) {
          const answer = responses[i2].answers[i3];
          reviewsSurveyForm.push({
            ...answer,
            name: response.order.firstName + ' ' + response.order.lastName,
            answer:
              answer.type === TypesQuestion.RATING
                ? Number(answer.value)
                : answer.value,
            question: answer.question,
          });
        }
      }
    }

    return reviewsSurveyForm;
  }
}
