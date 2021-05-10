import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetRestaurant } from 'src/modules/restaurant/use-cases/get-restaurant/get-restaurant';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Menu } from '../../entities/menu.entity';
import { CreateMenu } from '../create-menu/create-menu';
import { CreatePlate } from '../create-plate/create-plate';
import { GetMenu } from '../get-menu/get-menu';

@Injectable()
export class DuplicateMenu {
  constructor(
    private readonly getMenu: GetMenu,
    private readonly createPlate: CreatePlate,
    private readonly createMenu: CreateMenu,
    private readonly getRestaurant: GetRestaurant,
  ) {}

  async execute(menuId: number, owner: User): Promise<Menu> {
    const menuToDuplicate = await this.getMenu.oneByOwnerWithRelations(
      owner,
      menuId,
    );
    const restaurant = await this.getRestaurant.byOwner(owner);
    const {
      id,
      createdAt,
      updatedAt,
      plates: platesOfMenuToDuplicate,
      ...rest
    } = menuToDuplicate;
    const menuDuplicated = await this.createMenu.execute(rest, restaurant);
    const platesCreated = await Promise.all(
      platesOfMenuToDuplicate.map(async (plateToDuplicate) => {
        const { createdAt, updatedAt, id, ...rest } = plateToDuplicate;
        return await this.createPlate.execute(rest, menuDuplicated);
      }),
    );
    return { ...menuDuplicated, plates: platesCreated };
  }
}
