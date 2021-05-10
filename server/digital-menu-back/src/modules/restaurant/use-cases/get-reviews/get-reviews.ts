import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectWithKeys } from 'src/modules/survey-form/use-cases/get-survey-form-response/get-survey-form-response';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Review } from '../../entities/review.entity';

@Injectable()
export class GetReviews {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async byOwner(owner: User, query: ObjectWithKeys): Promise<Review[]> {
    const queryBuilder = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.order', 'order')
      .leftJoinAndSelect('review.restaurant', 'restaurant')
      .leftJoinAndSelect('restaurant.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: owner.id });

    if (query.rangeDate) {
      queryBuilder.andWhere('review.createdAt BETWEEN :start AND :end', {
        start: query.start,
        end: query.end,
      });
    }
    return await queryBuilder.getMany();
  }
}
