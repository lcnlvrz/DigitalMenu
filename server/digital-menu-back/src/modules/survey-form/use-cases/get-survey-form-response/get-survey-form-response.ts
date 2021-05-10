import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { User } from 'src/modules/user/entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { SurveyFormResponse } from '../../entities/survey-form-response.entity';

export interface ObjectWithKeys {
  [key: string]: boolean | string;
}

@Injectable()
export class GetSurveyFormResponse {
  constructor(
    @InjectRepository(SurveyFormResponse)
    private readonly surveyFormResponseRepository: Repository<SurveyFormResponse>,
  ) {}

  async manyByOwner(owner: User): Promise<SurveyFormResponse[]> {
    return await this.surveyFormResponseRepository
      .createQueryBuilder('response')
      .leftJoinAndSelect('response.surveyForm', 'surveyForm')
      .leftJoinAndSelect('response.order', 'order')
      .leftJoinAndSelect('order.table', 'table')
      .leftJoin('surveyForm.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .getMany();
  }

  async onyByIdAndOwner(
    owner: User,
    surveyFormResponseId: number,
  ): Promise<SurveyFormResponse> {
    return await this.surveyFormResponseRepository
      .createQueryBuilder('response')
      .leftJoin('response.surveyForm', 'surveyForm')
      .leftJoin('surveyForm.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id })
      .andWhere('response.id = :surveyFormResponseId', { surveyFormResponseId })
      .getOne();
  }

  async manyByOwnerAndQuery(
    owner: User,
    query: ObjectWithKeys,
    page: number,
    limit: number,
  ): Promise<Pagination<SurveyFormResponse>> {
    const queryBuilder = await this.surveyFormResponseRepository
      .createQueryBuilder('response')
      .leftJoinAndSelect('response.surveyForm', 'surveyForm')
      .leftJoinAndSelect('response.answers', 'answer')
      .leftJoinAndSelect('response.order', 'order')
      .leftJoin('surveyForm.restaurant', 'restaurant')
      .leftJoin('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id });

    if (query.status) {
      queryBuilder.andWhere('response.status = :status', {
        status: query.status,
      });
    }

    if (query.tableOrForm) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(
            'LOWER(surveyForm.name) like :query OR LOWER(order.tableName) like :query',
            {
              query: `%${query.tableOrForm.toString().toLowerCase()}%`,
            },
          );
        }),
      );
    }

    if (query.rangeDate) {
      queryBuilder.andWhere(`response.createdAt BETWEEN :start AND :end`, {
        start: query.start,
        end: query.end,
      });
    }

    if (typeof query.order === 'string') {
      const orderParsed = query.order === 'ASCEND' ? 'ASC' : 'DESC';
      queryBuilder.orderBy(`response.${query.field}`, orderParsed);
    }

    return paginate(queryBuilder, {
      limit,
      page,
      route: process.env.APP_BASE_URL,
    });
  }
}
