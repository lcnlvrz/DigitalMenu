import { Injectable } from '@nestjs/common';
import { IntersectionType } from '@nestjs/mapped-types';
import { InjectRepository } from '@nestjs/typeorm';
import { AnswerDto } from 'src/modules/survey-form/use-cases/create-survey-form-response/create-survey-form-response.dto';
import { Repository } from 'typeorm';
import { Restaurant } from '../../entities/restaurant.entity';

export type ReviewsRating = AnswerDto & {
  name: string;
  createdAt: Date;
};

export class ReviewsSurveyForm {
  reviewsSurveyForm: ReviewsRating[];
  opensAt?: string;
  closesAt?: string;
  isDayMatched: boolean;
  nextNearDay: string;
}

export class RestaurantExtended extends IntersectionType(
  Restaurant,
  ReviewsSurveyForm,
) {}

@Injectable()
export class SearchRestaurant {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async manyByName(query: string): Promise<Restaurant[]> {
    return await this.restaurantRepository
      .createQueryBuilder('restaurant')
      .where('LOWER(restaurant.name) like :name', {
        name: `%${query.toLowerCase()}%`,
      })
      .getMany();
  }

  async oneById(id: number): Promise<Restaurant> {
    return await this.restaurantRepository
      .createQueryBuilder('restaurant')
      .leftJoinAndSelect('restaurant.menus', 'menu')
      .leftJoinAndSelect('restaurant.surveyForms', 'surveyForm')
      .leftJoinAndSelect(
        'restaurant.campaings',
        'campaing',
        'campaing.publish = true',
      )
      .leftJoinAndSelect('campaing.startsWhenSelectedMenu', 'menuSelected')
      .leftJoinAndSelect('campaing.startsWhenSelectedPlate', 'plateSelected')
      .leftJoinAndSelect('restaurant.tables', 'table')
      .where('restaurant.id = :restaurantId', { restaurantId: id })
      .getOne();
  }
}
