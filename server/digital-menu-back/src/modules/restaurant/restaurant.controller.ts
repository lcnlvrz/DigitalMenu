import {
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ReqUser } from '../auth/decorators/req-user.decorator';
import { JwtStrategyGuard } from '../auth/guards/jwt-strategy.guard';
import { User } from '../user/entities/user.entity';
import { Restaurant } from './entities/restaurant.entity';
import { Review } from './entities/review.entity';
import { CreateRestaurant } from './use-cases/create-restaurant';
import { CreateRestaurantDto } from './use-cases/create-restaurant/create-restaurant.dto';
import { GetRestaurant } from './use-cases/get-restaurant/get-restaurant';
import { SearchRestaurant } from './use-cases/search-restaurants/search-restaurants';
import { UpdateRestaurant } from './use-cases/update-restaurant/update-restaurant';
import { UpdateRestaurantDto } from './use-cases/update-restaurant/update-restaurant.dto';
import { CreateReview } from './use-cases/create-review/create-review';
import { CreateReviewDto } from './use-cases/create-review/create-review.dto';
import { GetReviews } from './use-cases/get-reviews/get-reviews';
import { ObjectWithKeys } from '../survey-form/use-cases/get-survey-form-response/get-survey-form-response';
import { HandleSearchRestaurantPublic } from './use-cases/handle-search-restaurant-public/handle-search-restaurant-public';

@Controller('restaurant')
export class RestaurantController {
  constructor(
    private readonly createRestaurant: CreateRestaurant,
    private readonly updateRestaurant: UpdateRestaurant,
    private readonly getRestaurant: GetRestaurant,
    private readonly searchRestaurant: SearchRestaurant,
    private readonly createReview: CreateReview,
    private readonly getReviews: GetReviews,
    private readonly handleSearchRestaurantPublic: HandleSearchRestaurantPublic,
  ) {}

  @UseGuards(JwtStrategyGuard)
  @Post()
  async executeCreateRestaurant(
    @Body() dto: CreateRestaurantDto,
    @ReqUser() owner: User,
  ) {
    return await this.createRestaurant.execute(dto, owner);
  }

  @UseGuards(JwtStrategyGuard)
  @Get()
  async executeByOwner(@ReqUser() owner: User): Promise<Restaurant> {
    return await this.getRestaurant.byOwner(owner);
  }

  @UseGuards(JwtStrategyGuard)
  @Put()
  async executeUpdateRestaurant(
    @Body() dto: UpdateRestaurantDto,
    @ReqUser() owner: User,
  ): Promise<Restaurant> {
    return await this.updateRestaurant.execute(dto, owner);
  }

  @Get('/name/:nameRestaurant')
  async executeSearchRestaurant(
    @Param('nameRestaurant') name: string,
  ): Promise<Restaurant[]> {
    return await this.searchRestaurant.manyByName(name);
  }

  @Get('/id/:restaurantId')
  async executeSearchRestaurantById(
    @Param('restaurantId') id: number,
  ): Promise<Restaurant> {
    return await this.handleSearchRestaurantPublic.execute(id);
  }

  @Post('/review/:orderId')
  async executeCreateOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: CreateReviewDto,
  ): Promise<Review> {
    return await this.createReview.execute(dto, orderId);
  }

  @UseGuards(JwtStrategyGuard)
  @Get('reviews')
  async executeGetReviews(
    @ReqUser() owner: User,
    @Query() query: ObjectWithKeys,
  ): Promise<Review[]> {
    return await this.getReviews.byOwner(owner, query);
  }
}
