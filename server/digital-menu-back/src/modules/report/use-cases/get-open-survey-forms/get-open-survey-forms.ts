import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SurveyForm } from 'src/modules/survey-form/entities/survey-form.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetOpenSurveyForms {
  constructor(
    @InjectRepository(SurveyForm)
    private readonly surveyFormRepository: Repository<SurveyForm>,
  ) {}

  async execute(owner: User): Promise<number> {
    return await this.surveyFormRepository
      .createQueryBuilder('surveyForm')
      .leftJoin('surveyForm.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('surveyForm.isPublic = true')
      .andWhere('owner.id = :ownerId', { ownerId: owner.id })
      .getCount();
  }
}
