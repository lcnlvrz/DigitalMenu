import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Restaurant } from '../../entities/restaurant.entity';
import { GetRestaurant } from '../get-restaurant/get-restaurant';
import { UpdateRestaurantDto } from './update-restaurant.dto';

@Injectable()
export class UpdateRestaurant {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly getRestaurant: GetRestaurant,
  ) {}

  async execute(dto: UpdateRestaurantDto, owner: User): Promise<Restaurant> {
    const restaurant = await this.getRestaurant.byOwner(owner);
    const restaurantUpdated = await this.restaurantRepository.merge(
      restaurant,
      dto,
    );
    return await this.restaurantRepository.save(restaurantUpdated);
  }
}
