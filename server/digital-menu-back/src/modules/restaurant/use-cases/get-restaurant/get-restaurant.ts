import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Restaurant } from '../../entities/restaurant.entity';

@Injectable()
export class GetRestaurant {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async byOwner(owner: User): Promise<Restaurant> {
    return await this.restaurantRepository.findOne({
      where: { owner: { id: owner.id } },
    });
  }
}
