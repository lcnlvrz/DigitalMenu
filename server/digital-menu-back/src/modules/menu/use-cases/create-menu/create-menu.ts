import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/modules/restaurant/entities/restaurant.entity';
import { GetRestaurant } from 'src/modules/restaurant/use-cases/get-restaurant/get-restaurant';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Menu } from '../../entities/menu.entity';
import { CreateMenuDto } from './create-menu.dto';

@Injectable()
export class CreateMenu {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async execute(dto: CreateMenuDto, restaurant: Restaurant): Promise<Menu> {
    const menu = this.menuRepository.create(dto);
    menu.restaurant = restaurant;
    const menuStored = await this.menuRepository.save(menu);
    delete menuStored.restaurant;
    return menuStored;
  }
}
