import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Restaurant } from '../../entities/restaurant.entity';
import { CreateRestaurantDto } from './create-restaurant.dto';

@Injectable()
export class CreateRestaurant {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async execute(dto: CreateRestaurantDto, owner: User): Promise<Restaurant> {
    const restaurant = this.restaurantRepository.create(dto);
    restaurant.owner = owner;
    restaurant.hasTableOrderingSystem = true;
    const restaurantStored = await this.restaurantRepository.save(restaurant);
    delete restaurantStored.owner;
    return restaurant;
  }
}
