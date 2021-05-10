import { Injectable, NotFoundException } from '@nestjs/common';
import { GetMenuPlatesLimit } from 'src/modules/menu/use-cases/get-menu-plates-limit/get-menu-plates-limit';
import { GetRatingReviews } from 'src/modules/survey-form/use-cases/get-rating-reviews/get-rating-reviews';
import { RestaurantScheduleStatus } from '../restaurant-schedule-status/restaurant-schedule-status';
import { SearchRestaurant } from '../search-restaurants/search-restaurants';

@Injectable()
export class HandleSearchRestaurantPublic {
  constructor(
    private readonly searchRestaurant: SearchRestaurant,
    private readonly getMenuPlatesLimit: GetMenuPlatesLimit,
    private readonly getRatingReviews: GetRatingReviews,
    private readonly restaurantScheduleStatus: RestaurantScheduleStatus,
  ) {}

  async execute(id: number) {
    const restaurant = await this.searchRestaurant.oneById(id);

    if (!restaurant) {
      throw new NotFoundException({
        code: 'not_found_restaurant',
        detail: "The restaurant doesn't exist",
      });
    }

    const menus = await this.getMenuPlatesLimit.execute(restaurant.menus, 3);

    const reviewsSurveyForm = await this.getRatingReviews.execute(
      restaurant.surveyForms,
    );

    const {
      closesAt,
      nextNearDay,
      opensAt,
      isDayMatched,
    } = this.restaurantScheduleStatus.execute(restaurant.schedule);

    return {
      ...restaurant,
      reviewsSurveyForm,
      menus,
      opensAt,
      closesAt,
      isDayMatched,
      nextNearDay,
    };
  }
}
