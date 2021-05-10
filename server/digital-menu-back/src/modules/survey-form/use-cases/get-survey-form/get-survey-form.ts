import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { SurveyForm } from '../../entities/survey-form.entity';

@Injectable()
export class GetSurveyForm {
  constructor(
    @InjectRepository(SurveyForm)
    private readonly surveyFormRepository: Repository<SurveyForm>,
  ) {}

  async oneById(id: number): Promise<SurveyForm> {
    return await this.surveyFormRepository
      .createQueryBuilder('surveyForm')
      .where('surveyForm.id = :id', { id })
      .getOne();
  }

  async manyByOwner(owner: User): Promise<SurveyForm[]> {
    return await this.surveyFormRepository
      .createQueryBuilder('surveyForm')
      .leftJoinAndSelect('surveyForm.questions', 'question')
      .leftJoin('surveyForm.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .getMany();
  }

  async oneByOwnerAndId(owner: User, id: number): Promise<SurveyForm> {
    return await this.surveyFormRepository
      .createQueryBuilder('surveyForm')
      .leftJoinAndSelect('surveyForm.questions', 'question')
      .leftJoin('surveyForm.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .andWhere('surveyForm.id = :id', { id })
      .getOne();
  }
}
