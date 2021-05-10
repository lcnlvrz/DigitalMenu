import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from '../order/order.module';
import { Restaurant } from './entities/restaurant.entity';
import { Review } from './entities/review.entity';
import { RestaurantController } from './restaurant.controller';
import { CreateRestaurant } from './use-cases/create-restaurant';
import { GetRestaurant } from './use-cases/get-restaurant/get-restaurant';
import { SearchRestaurant } from './use-cases/search-restaurants/search-restaurants';
import { UpdateRestaurant } from './use-cases/update-restaurant/update-restaurant';
import { CreateReview } from './use-cases/create-review/create-review';
import { GetReviews } from './use-cases/get-reviews/get-reviews';
import { Plate } from '../menu/entities/plate.entity';
import { RestaurantScheduleStatus } from './use-cases/restaurant-schedule-status/restaurant-schedule-status';
import { SurveyFormModule } from '../survey-form/survey-form.module';
import { HandleSearchRestaurantPublic } from './use-cases/handle-search-restaurant-public/handle-search-restaurant-public';
import { MenuModule } from '../menu/menu.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant, Review, Plate]),
    forwardRef(() => OrderModule),
    forwardRef(() => SurveyFormModule),
    forwardRef(() => MenuModule),
  ],
  controllers: [RestaurantController],
  providers: [
    CreateRestaurant,
    CreateReview,
    GetRestaurant,
    UpdateRestaurant,
    SearchRestaurant,
    GetReviews,
    RestaurantScheduleStatus,
    HandleSearchRestaurantPublic,
  ],
  exports: [GetRestaurant, SearchRestaurant],
})
export class RestaurantModule {}
