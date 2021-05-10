import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetOrder } from 'src/modules/order/use-cases/get-order/get-order';
import { Repository } from 'typeorm';
import { Review } from '../../entities/review.entity';
import { CreateReviewDto } from './create-review.dto';

@Injectable()
export class CreateReview {
  constructor(
    private readonly getOrder: GetOrder,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async execute(dto: CreateReviewDto, orderId: number): Promise<Review> {
    const order = await this.getOrder.byId(orderId);
    const review = this.reviewRepository.create(dto);
    review.restaurant = order.restaurant;
    review.order = order;
    return await this.reviewRepository.save(review);
  }
}
